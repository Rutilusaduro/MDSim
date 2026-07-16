import { renderScenePage } from './ui/scenePage.js';
import { getStageIndex, getStageInfo, getPatientAppearanceSummary } from './characters.js';
import { FABRICATION_EXCUSES } from './patientVisit.js';
import { formatMoney } from './state.js';
import {
  VISIT_PHASES,
  TONE_ENABLED_ACTIONS,
  getVisitActions,
  getVisitInterruptScene,
  performVisitAction,
  startVisit,
  applyWeighChartChoice,
} from './patientVisit.js';
import { VISIT_TONES } from './scenes/catalog.js';
import { renderChartGapSvg } from './gameOver.js';
import { renderSilhouette } from './silhouettes.js';
import { visitMobilityWarning } from './worldImpact.js';
import { getFramingChipLabel } from './visitClinical.js';
import { getPatientFramingNote, getPatientFramingTier } from './patientFraming.js';
import { isToneLocked, getToneLockHint } from './visitTones.js';

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const PHASE_LABELS = {
  greeting: 'Arrival',
  intake: 'Intake',
  exam: 'Exam',
  services: 'Services',
  checkout: 'Checkout',
};

export function openPatientVisitFlow(state, patientId, hooks) {
  const { onStart, showToast, openModal } = hooks;
  const patient = state.patients.find((p) => p.id === patientId);
  if (!patient) return;

  if (state.activePatientVisit && state.activePatientVisit.patientId !== patientId) {
    const other = state.patients.find((p) => p.id === state.activePatientVisit.patientId);
    showToast(`Finish ${other?.name || 'the current'} visit before starting another.`, 'error');
    return;
  }

  if (patient.seenThisWeek && !state.activePatientVisit) {
    showToast(`${patient.name} was already seen this week. Open her profile instead.`, 'error');
    return;
  }

  if (!state.activePatientVisit || state.activePatientVisit.patientId !== patientId) {
    const start = startVisit(state, patientId);
    if (!start.ok) {
      showToast(start.message, 'error');
      return;
    }
    onStart?.(start);
  }

  openModal(renderPatientVisitModal(state, patientId));
}

function renderActionTags(option) {
  const tags = [];
  if (option.effects?.money) tags.push(`+${formatMoney(option.effects.money)}`);
  if (option.effects?.weightRoll) tags.push('weight↑');
  if (option.effects?.weight) tags.push('scale↑');
  if (option.effects?.trust) tags.push('trust↑');
  if (option.effects?.loyalty) tags.push('loyalty↑');
  if (option.requires?.inventory) tags.push('uses stock');
  return tags;
}

function renderVisitActionButton(option) {
  const tags = renderActionTags(option);
  const lockedCls = option.locked ? 'opacity-40' : option.disabled ? 'opacity-50' : '';
  return `
    <button class="rounded-2xl p-3 text-left transition ${option.disabled || option.locked ? `dark-button ${lockedCls}` : 'soft-card hover:border-amber-200/40'}" data-action="visit-action" data-id="${esc(option.id)}" ${option.disabled || option.locked ? 'disabled' : ''}>
      <div class="flex items-start justify-between gap-2">
        <strong class="text-sm text-stone-50">${esc(option.label)}</strong>
        <span class="text-xs text-amber-100">${option.apCost ? `${option.apCost} AP` : 'free'}</span>
      </div>
      <p class="mt-1 text-xs leading-5 text-stone-400">${esc(option.description)}</p>
      ${tags.length ? `<p class="mt-2 text-xs text-emerald-200">${tags.join(' · ')}</p>` : ''}
      ${option.lockHint && option.locked ? `<p class="mt-1 text-xs text-stone-500">${esc(option.lockHint)}</p>` : ''}
      ${option.reason && option.disabled && !option.locked ? `<p class="mt-1 text-xs text-red-200">${esc(option.reason)}</p>` : ''}
    </button>`;
}

function renderToneActionGroup(option, patient) {
  const tags = renderActionTags(option);
  const tones = VISIT_TONES.map((tone) => {
    const locked = isToneLocked(tone.id, patient);
    return `
      <button class="rounded-xl border border-amber-100/10 bg-stone-950/50 px-3 py-2 text-left text-xs transition ${locked ? 'opacity-40' : 'hover:border-amber-200/40'}" data-action="${locked ? '' : 'visit-tone-action'}" data-id="${esc(option.id)}" data-tone="${esc(tone.id)}" ${locked || option.disabled ? 'disabled' : ''}>
        <span class="font-bold text-stone-100">${esc(tone.label)}</span>
        <span class="ml-2 text-stone-500">${esc(tone.hint)}</span>
        ${locked ? `<span class="ml-2 text-stone-600">${esc(getToneLockHint())}</span>` : ''}
      </button>`;
  }).join('');
  return `
    <div class="rounded-2xl p-3 ${option.disabled ? 'dark-button opacity-50' : 'soft-card'}">
      <div class="flex items-start justify-between gap-2">
        <strong class="text-sm text-stone-50">${esc(option.label)}</strong>
        <span class="text-xs text-amber-100">${option.apCost ? `${option.apCost} AP` : 'free'}</span>
      </div>
      <p class="mt-1 text-xs leading-5 text-stone-400">${esc(option.description)}</p>
      ${tags.length ? `<p class="mt-2 text-xs text-emerald-200">${tags.join(' · ')}</p>` : ''}
      ${
        option.disabled
          ? `<p class="mt-1 text-xs text-red-200">${esc(option.reason)}</p>`
          : `
      <p class="mt-2 text-xs font-bold uppercase tracking-wide text-amber-200/80">Choose tone</p>
      <div class="mt-2 grid gap-1.5">${tones}</div>`
      }
    </div>`;
}

function renderWeighRitualPanel(state, visit, patient) {
  if (!visit.pendingWeigh) return '';
  const weight = visit.pendingWeigh.weight;
  const framing = getPatientFramingTier(patient);
  const reaction = visit.pendingWeigh.reaction || '';
  const canFabricate = framing === 'clinical_plus' || framing === 'warming' || framing === 'complicit';
  const prevCharted = Math.round(patient.chartedWeight ?? weight);
  const excuse = FABRICATION_EXCUSES[state.week % FABRICATION_EXCUSES.length];
  return `
    <div class="weigh-panel paper-surface p-5">
      <p class="ui-label" style="color: var(--ink-soft)">Vitals · weight</p>
      <p class="dial-number chart-num" data-weight="${weight}">${weight}<span class="text-xl"> lb</span></p>
      ${reaction ? `<p class="reaction-line prose-page mt-2 text-sm italic">"${esc(reaction)}"</p>` : ''}
      <p class="mt-4 text-sm font-bold text-[color:var(--ink)]">The chart is open. You write:</p>
      <div class="mt-2 grid gap-1">
        <button class="chart-entry" data-action="weigh-chart" data-choice="chart_true">
          <span class="chart-num">${weight} lb</span> — recorded as read.
          <span class="chart-entry-hint">+trust</span>
        </button>
        <button class="chart-entry" data-action="weigh-chart" data-choice="chart_hedge">
          <span class="chart-num">${prevCharted} lb</span> — <em>weight stable since last visit.</em>
          <span class="chart-entry-hint">+cover</span>
        </button>
        <button class="chart-entry ${canFabricate ? '' : 'chart-entry-locked'}" data-action="weigh-chart" data-choice="chart_fabricate" ${canFabricate ? '' : 'disabled'}>
          <span class="chart-num">${prevCharted} lb</span> — <em>${esc(excuse)}. Recheck next visit.</em>
          <span class="chart-entry-hint">${canFabricate ? '+cover, +erosion' : 'she would notice; needs familiarity'}</span>
        </button>
      </div>
    </div>`;
}

function renderInterruptPanel(state, interruptScene) {
  if (!interruptScene) return '';
  return renderScenePage(interruptScene, {
    kicker: 'The visit stops here until you decide',
    choiceAction: 'visit-scene-choice',
    tier: 'page',
  });
}

export function renderPatientVisitModal(state, patientId, hooks = {}) {
  const visit = state.activePatientVisit;
  const patient = state.patients.find((p) => p.id === patientId);
  if (!visit || !patient || visit.patientId !== patientId) return '';

  const stage = getStageInfo(patient);
  const stageIdx = getStageIndex(patient);
  const actions = getVisitActions(state).filter(
    (a) => VISIT_PHASES.indexOf(a.phase) <= VISIT_PHASES.indexOf(visit.phase),
  );
  const phaseIdx = VISIT_PHASES.indexOf(visit.phase);
  const opening = visit.visitLog?.length ? '' : visit.opening || '';
  const framingTier = getPatientFramingTier(patient);
  const framingChip = getFramingChipLabel(framingTier);
  const framingNote = getPatientFramingNote(patient);
  const weighPanel = renderWeighRitualPanel(state, visit, patient);
  const mobilityWarning = visitMobilityWarning(patient);
  const log = visit.visitLog || [];
  const interruptScene = getVisitInterruptScene(state);

  const phaseRail = VISIT_PHASES.map((phase, i) => {
    const done = i < phaseIdx;
    const current = i === phaseIdx;
    const cls = done ? 'phase-done' : current ? 'phase-current' : 'phase-todo';
    return `<span class="phase-step ${cls}">${PHASE_LABELS[phase]}</span>`;
  }).join('<span class="phase-gap"></span>');

  const chartEntries = visit.completedActions
    .filter((id) => id !== 'end_visit')
    .map((id) => {
      const label = actions.find((a) => a.id === id)?.label || id.replaceAll('_', ' ');
      return `<li class="chart-num text-xs">✓ ${esc(label)}</li>`;
    })
    .join('');

  const logHtml = log.length
    ? log
        .map(
          (entry) => `
        <div class="prose-page text-sm">
          <p class="ui-label" style="color: var(--ink-soft)">${esc(entry.label)}</p>
          <p class="mt-1">${esc(entry.narrative)}</p>
          ${entry.reply ? `<p class="mt-2 pl-3" style="border-left: 2px solid var(--accent-soft)"><em>"${esc(entry.reply)}"</em></p>` : ''}
        </div>`,
        )
        .join('<hr class="my-3" style="border-color: #d9c795" />')
    : opening
      ? `<div class="prose-page text-sm">${esc(opening)}</div>`
      : '';

  const endVisitDone = visit.completedActions.includes('end_visit');

  const actionsHtml = interruptScene
    ? renderInterruptPanel(state, interruptScene)
    : weighPanel ||
      `
        <div>
          <h3 class="text-lg font-bold text-amber-100">${PHASE_LABELS[visit.phase]} actions</h3>
          <div class="mt-3 grid gap-2 sm:grid-cols-2">
            ${actions
              .map((option) =>
                TONE_ENABLED_ACTIONS.includes(option.id)
                  ? renderToneActionGroup(option, patient)
                  : renderVisitActionButton(option),
              )
              .join('')}
          </div>
        </div>`;

  return `
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="ui-label">Patient visit · week ${state.week} · ${state.actionPoints} AP remaining</p>
        <h2 class="mt-1 text-3xl font-black text-stone-50">${esc(patient.name)}</h2>
        <p class="mt-1 text-stone-300">${esc(patient.role)} · ${esc(getPatientAppearanceSummary(patient))}</p>
      </div>
      <button class="dark-button rounded-2xl px-4 py-2 font-bold" data-action="visit-abandon">Leave desk</button>
    </div>

    ${mobilityWarning ? `<p class="mt-3 text-xs" style="color: var(--accent-soft)">${esc(mobilityWarning)}</p>` : ''}

    <div class="mt-5 grid gap-6 lg:grid-cols-[20rem_1fr]">
      <aside class="paper-surface h-fit p-4 lg:sticky lg:top-0">
        <p class="ui-label" style="color: var(--ink-soft)">${esc(framingNote)}</p>
        <div class="mt-3">${renderChartGapSvg(patient, state)}</div>
        <div class="mt-3" style="color: var(--ink)">${renderSilhouette(patient, stageIdx, { wide: true })}</div>
        <p class="mt-1 text-center text-sm font-bold" style="color: var(--ink)">${esc(stage.name)} · <span class="note-clip">${esc(framingChip)}</span></p>
        ${chartEntries ? `<ul class="mt-3 space-y-1" style="color: var(--ink-soft)">${chartEntries}</ul>` : ''}
      </aside>

      <div class="min-w-0 space-y-5">
        <div class="phase-rail">${phaseRail}</div>
        ${logHtml ? `<div class="paper-surface max-h-[15rem] overflow-auto p-4">${logHtml}</div>` : ''}

        ${actionsHtml}

        ${
          visit.phase === 'checkout' && !endVisitDone && !interruptScene
            ? `<p class="text-sm text-amber-100">Checkout: bill the consult, schedule a follow-up if you want her back, then end the visit.</p>`
            : ''
        }
      </div>
    </div>
  `;
}

export function appendVisitLog(visit, action, narrative, reply) {
  if (!visit.visitLog) visit.visitLog = [];
  visit.visitLog.push({
    label: action.label,
    narrative,
    reply,
  });
}
