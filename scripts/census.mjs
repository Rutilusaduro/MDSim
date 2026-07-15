/**
 * String census: plays balanced runs and reports what actually renders.
 *
 * Output: docs/census/latest.md (gitignored) + console summary.
 * D-batch PRs paste the summary table into the PR description.
 *
 * Usage: node scripts/census.mjs [--weeks 30] [--seeds 20]
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import '../tests/helpers.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? Number(args[i + 1]) : fallback;
};
const WEEKS = flag('weeks', 30);
const SEEDS = flag('seeds', 20);

const { createNewGame } = await import('../src/state.js');
const { endWeek } = await import('../src/events.js');
const { setCensusTap } = await import('../src/proseSelect.js');
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

// tally[poolId] = { size, hits: Map(index -> count), lines: Map(index -> text) }
const tally = new Map();
let perRunDistinct = [];
let currentRunLines = null;

setCensusTap((scopeId, poolId, index, pool) => {
  if (!tally.has(poolId)) tally.set(poolId, { size: pool.length, hits: new Map(), lines: new Map() });
  const entry = tally.get(poolId);
  entry.size = Math.max(entry.size, pool.length);
  entry.hits.set(index, (entry.hits.get(index) || 0) + 1);
  if (!entry.lines.has(index)) {
    const line = pool[index];
    entry.lines.set(index, typeof line === 'string' ? line : JSON.stringify(line).slice(0, 120));
  }
  currentRunLines?.add(`${poolId}#${index}`);
});

// Minimal balanced policy (mirrors simulate.mjs; scripts can't import each other).
const PLAN = ['say_hi', 'review_symptoms', 'weigh_patient', 'nutrition_counseling', 'bill_consultation', 'schedule_followup', 'end_visit'];
function playBalanced(seed, weeks) {
  const state = createNewGame({ seed });
  for (let w = 0; w < weeks && !state.gameOver; w += 1) {
    for (const p of getUnvisitedPatients(state)) {
      if (state.actionPoints < 4) break;
      if (!startVisit(state, p.id).ok) continue;
      for (const actionId of PLAN) {
        const available = new Set(getVisitActions(state).filter((a) => !a.disabled).map((a) => a.id));
        if (!available.has(actionId)) continue;
        const result = performVisitAction(state, actionId);
        if (result?.weighRitual) applyWeighChartChoice(state, 'chart_true');
        const visit = state.activePatientVisit;
        if (visit?.interrupt?.sceneId) {
          const choice = getVisitInterruptScene(state)?.choices?.[0];
          if (choice) resolveVisitInterrupt(state, choice.id);
          else visit.interrupt = null;
        }
        if (!state.activePatientVisit) break;
      }
      if (state.activePatientVisit) state.activePatientVisit = null;
    }
    endWeek(state);
  }
}

for (let s = 0; s < SEEDS; s += 1) {
  currentRunLines = new Set();
  playBalanced(2000 + s * 104729, WEEKS);
  perRunDistinct.push(currentRunLines.size);
}
currentRunLines = null;

// ---- report -----------------------------------------------------------------
const rows = [];
for (const [poolId, entry] of tally) {
  const exposures = [...entry.hits.values()].reduce((a, b) => a + b, 0);
  rows.push({
    poolId,
    size: entry.size,
    exposures,
    distinct: entry.hits.size,
    debt: Number((exposures / SEEDS / entry.size).toFixed(2)),
  });
}
rows.sort((a, b) => b.exposures - a.exposures);

const topLines = [];
for (const [poolId, entry] of tally) {
  for (const [index, count] of entry.hits) {
    topLines.push({ poolId, count, text: entry.lines.get(index) });
  }
}
topLines.sort((a, b) => b.count - a.count);

const avgDistinct = Math.round(perRunDistinct.reduce((a, b) => a + b, 0) / perRunDistinct.length);
const highDebt = rows.filter((r) => r.debt > 1.5);

const md = [
  `# String census — ${WEEKS} weeks x ${SEEDS} balanced seeds`,
  '',
  `- Pools observed: **${rows.length}**`,
  `- Distinct lines per run (avg): **${avgDistinct}**`,
  `- Repetition-debt pools (>1.5 full rotations per run): **${highDebt.length}**`,
  '',
  '## Repetition debt (write here first)',
  '',
  '| pool | size | exposures | rotations/run |',
  '|---|---|---|---|',
  ...highDebt.slice(0, 40).map((r) => `| ${r.poolId} | ${r.size} | ${r.exposures} | ${r.debt} |`),
  '',
  '## Top 100 most-rendered lines',
  '',
  '| # | pool | count | line |',
  '|---|---|---|---|',
  ...topLines.slice(0, 100).map((l, i) => `| ${i + 1} | ${l.poolId} | ${l.count} | ${l.text.replaceAll('|', '\\|').slice(0, 110)} |`),
  '',
].join('\n');

mkdirSync(join(root, 'docs', 'census'), { recursive: true });
writeFileSync(join(root, 'docs', 'census', 'latest.md'), md);

console.log(`pools=${rows.length} avgDistinctLinesPerRun=${avgDistinct} highDebtPools=${highDebt.length}`);
console.log('top 5 pools by exposure:');
for (const r of rows.slice(0, 5)) {
  console.log(`  ${r.poolId}  size=${r.size} exposures=${r.exposures} rotations/run=${r.debt}`);
}
console.log('report -> docs/census/latest.md');
