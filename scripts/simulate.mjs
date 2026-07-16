/**
 * Headless balance harness.
 *
 * Usage:
 *   node scripts/simulate.mjs                     # full batch, CSV + summary
 *   node scripts/simulate.mjs --weeks 20 --seeds 5
 *   node scripts/simulate.mjs --assert            # exit non-zero on invariant breach
 *   node scripts/simulate.mjs --csv out.csv
 */
import { writeFileSync } from 'node:fs';
import '../tests/helpers.js';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? Number(args[i + 1]) : fallback;
};
const WEEKS = flag('weeks', 52);
const SEEDS = flag('seeds', 20);
const ASSERT = args.includes('--assert');
const csvIndex = args.indexOf('--csv');
const CSV_PATH = csvIndex >= 0 ? args[csvIndex + 1] : null;

const { createNewGame } = await import('../src/state.js');
const { endWeek } = await import('../src/events.js');
const {
  startVisit,
  performVisitAction,
  completeVisit,
  applyWeighChartChoice,
  resolveVisitInterrupt,
  getVisitActions,
  getUnvisitedPatients,
  getVisitInterruptScene,
} = await import('../src/patientVisit.js');
const { getPatientFramingTier } = await import('../src/patientFraming.js');
const { getStageIndex } = await import('../src/characters.js');
const { hireCandidate } = await import('../src/recruitment.js');
const { buyManagementItem } = await import('../src/clinic.js');

/** The clinic grows through hiring; a policy that never hires is not
 * playing the game. Shared management step for the non-neglect policies. */
function manageClinic(state, { marketing = false } = {}) {
  const candidates = state.recruitment?.candidates || [];
  if (candidates.length && state.staff.length < 3 && state.actionPoints >= 5 && state.money > 900) {
    hireCandidate(state, candidates[0].id);
  }
  if (!state.ownedUpgrades.includes('wellness-vending-wall') && state.money > 1600) {
    buyManagementItem(state, 'wellness-vending-wall');
  }
  if (marketing && state.money > 2400) {
    buyManagementItem(state, 'luxury-comfort-campaign');
  }
}

function act(state, actionId, chartChoice = 'chart_true') {
  const result = performVisitAction(state, actionId);
  if (result?.weighRitual) {
    applyWeighChartChoice(state, chartChoice);
  }
  const visit = state.activePatientVisit;
  if (visit?.interrupt?.sceneId) {
    const scene = getVisitInterruptScene(state);
    const choice = scene?.choices?.[0];
    if (choice) resolveVisitInterrupt(state, choice.id);
    else visit.interrupt = null;
  }
  return result;
}

function availableIds(state) {
  return new Set(getVisitActions(state).filter((a) => !a.disabled).map((a) => a.id));
}

function runVisit(state, patientId, plan, chartChoice) {
  if (!startVisit(state, patientId).ok) return false;
  for (const actionId of plan) {
    if (state.actionPoints <= 0 && actionId !== 'schedule_followup' && actionId !== 'end_visit') break;
    if (!availableIds(state).has(actionId)) continue;
    act(state, actionId, chartChoice);
    if (!state.activePatientVisit) return true;
  }
  if (state.activePatientVisit) {
    if (availableIds(state).has('end_visit')) return act(state, 'end_visit').ok === true;
    state.activePatientVisit = null;
  }
  return false;
}

const SKELETON = ['say_hi', 'review_chart', 'weigh_patient', 'bill_consultation', 'schedule_followup', 'end_visit'];
const MONEY_PLAN = [...SKELETON.slice(0, 4), 'upsell_wellness_kit', 'schedule_followup', 'end_visit'];
const LEAN_PLAN = SKELETON;
const GAIN_PLAN = [
  'say_hi', 'personal_talk', 'offer_snack_menu', 'weigh_patient', 'feed_in_place',
  'warm_blanket', 'lounge_snack', 'comfort_plan', 'bill_consultation', 'schedule_followup', 'end_visit',
];
const BALANCED_PLAN = [
  'say_hi', 'review_symptoms', 'weigh_patient',
  'bill_consultation', 'schedule_followup', 'end_visit',
];

const POLICIES = {
  neglect: () => {},
  'greedy-money': (state) => {
    manageClinic(state, { marketing: true });
    for (const p of getUnvisitedPatients(state)) {
      if (state.actionPoints < 4) break;
      runVisit(state, p.id, state.actionPoints >= 6 ? MONEY_PLAN : LEAN_PLAN, 'chart_true');
    }
  },
  'greedy-gain': (state) => {
    manageClinic(state);
    for (const p of getUnvisitedPatients(state)) {
      if (state.actionPoints < 4) break;
      const tier = getPatientFramingTier(p);
      const chart = tier === 'clinical' ? 'chart_true' : 'chart_hedge';
      runVisit(state, p.id, GAIN_PLAN, chart);
    }
  },
  balanced: (state) => {
    manageClinic(state, { marketing: true });
    for (const p of getUnvisitedPatients(state)) {
      if (state.actionPoints < 4) break;
      runVisit(state, p.id, BALANCED_PLAN, 'chart_true');
    }
  },
};

function seenLineCount(state) {
  let total = 0;
  for (const scope of Object.values(state.seenLines || {})) {
    for (const arr of Object.values(scope)) total += arr.length;
  }
  return total;
}

function runGame(policyName, seed, weeks) {
  const state = createNewGame({ seed });
  const policy = POLICIES[policyName];
  const rows = [];
  const arrivals = new Map();
  const tenures = [];
  for (const p of state.patients) arrivals.set(p.id, 1);

  for (let w = 0; w < weeks && !state.gameOver; w += 1) {
    policy(state);
    const before = new Set(state.patients.map((p) => p.id));
    endWeek(state);
    for (const p of state.patients) {
      if (!arrivals.has(p.id)) arrivals.set(p.id, state.week);
    }
    for (const row of state.ledger.filter((r) => r.id === 'patient_departed' && r.data.week === state.week - 1)) {
      const arrived = arrivals.get(row.characterId);
      if (arrived != null && before.has(row.characterId)) {
        tenures.push({ tier: row.data.tier, weeks: row.data.week - arrived });
      }
    }
    const avgStage = state.patients.length
      ? state.patients.reduce((sum, p) => sum + getStageIndex(p), 0) / state.patients.length
      : 0;
    rows.push({
      policy: policyName,
      seed,
      week: state.week - 1,
      money: state.money,
      heat: state.heat,
      cover: state.coverRating,
      reputation: state.reputation,
      patients: state.patients.length,
      avgStage: Number(avgStage.toFixed(2)),
      distinctLines: seenLineCount(state),
    });
  }
  return { state, rows, tenures };
}

const allRows = [];
const finals = {};
const tenuresByTier = { clinical: [], clinical_plus: [], warming: [], complicit: [] };
const failures = [];

for (const policyName of Object.keys(POLICIES)) {
  finals[policyName] = [];
  for (let s = 0; s < SEEDS; s += 1) {
    const seed = 1000 + s * 7919;
    let result;
    try {
      result = runGame(policyName, seed, WEEKS);
    } catch (error) {
      failures.push(`${policyName} seed ${seed} crashed: ${error.stack?.split('\n')[0]}`);
      continue;
    }
    allRows.push(...result.rows);
    finals[policyName].push(result.rows[result.rows.length - 1]);
    for (const t of result.tenures) {
      (tenuresByTier[t.tier] || (tenuresByTier[t.tier] = [])).push(t.weeks);
    }
  }
}

const median = (arr) => {
  if (!arr.length) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};
const avg = (arr, key) => (arr.length ? arr.reduce((sum, r) => sum + r[key], 0) / arr.length : 0);

console.log(`\n${WEEKS} weeks x ${SEEDS} seeds per policy\n`);
console.log('policy        | money$    | heat  | rep   | avgStage | patients | lines');
for (const [name, rows] of Object.entries(finals)) {
  console.log(
    `${name.padEnd(13)} | ${Math.round(avg(rows, 'money')).toString().padStart(9)} | ${avg(rows, 'heat')
      .toFixed(1)
      .padStart(5)} | ${avg(rows, 'reputation').toFixed(1).padStart(5)} | ${avg(rows, 'avgStage')
      .toFixed(2)
      .padStart(8)} | ${avg(rows, 'patients').toFixed(1).padStart(8)} | ${Math.round(avg(rows, 'distinctLines'))}`,
  );
}
const medClinical = median(tenuresByTier.clinical);
const medComplicit = median(tenuresByTier.complicit);
console.log(
  `\ntenure medians (weeks): clinical=${medClinical} clinical_plus=${median(tenuresByTier.clinical_plus)} warming=${median(tenuresByTier.warming)} complicit=${medComplicit}`,
);

if (CSV_PATH) {
  const header = Object.keys(allRows[0]).join(',');
  writeFileSync(CSV_PATH, [header, ...allRows.map((r) => Object.values(r).join(','))].join('\n'));
  console.log(`csv → ${CSV_PATH}`);
}

if (ASSERT) {
  const checks = [
    [failures.length === 0, `no crashes (${failures.join('; ') || 'ok'})`],
    [Object.values(finals).every((rows) => rows.length === SEEDS), 'every run finished'],
    [
      Object.values(finals).every((rows) => rows.every((r) => Number.isFinite(r.money))),
      'money stays finite',
    ],
    [
      Object.values(finals).every((rows) => rows.every((r) => r.money < 200000)),
      'no policy prints money (<$200k)',
    ],
    [
      avg(finals['greedy-gain'], 'avgStage') > avg(finals.neglect, 'avgStage'),
      'feeding produces more stage growth than neglect',
    ],
    [
      avg(finals.balanced, 'distinctLines') > 50,
      'balanced play renders a real spread of lines',
    ],
    [
      avg(finals.balanced, 'money') > -1500,
      'balanced play stays solvent on the attending start',
    ],
    [
      avg(finals.balanced, 'money') - avg(finals.neglect, 'money') > 10000,
      'neglect is punished distinctly from play',
    ],
    [
      medComplicit == null || medClinical == null || medComplicit >= medClinical,
      'complicit patients stay at least as long as clinical ones',
    ],
  ];
  let failed = false;
  for (const [ok, label] of checks) {
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
    if (!ok) failed = true;
  }
  process.exit(failed ? 1 : 0);
}
