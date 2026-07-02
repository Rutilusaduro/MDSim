import { getStageIndex, getStageInfo, getPatientAppearanceSummary } from './characters.js';
import { formatMoney } from './state.js';
import {
  VISIT_PHASES,
  canEndVisit,
  completeVisit,
  getVisitActions,
  performVisitAction,
  startVisit,
} from './patientVisit.js';
import { getVisitOpening } from './patientVisitDialogue.js';
import { renderSilhouette } from './silhouettes.js';

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
  const opening = visit.visitLog?.length ? '' : getVisitOpening(patient);
  const log = visit.visitLog || [];

  const phaseRail = VISIT_PHASES.map((phase, i) => {
    const done = i < phaseIdx;
    const current = i === phaseIdx;
    const cls = done
      ? 'bg-emerald-500/20 text-emerald-100'
      : current
        ? 'bg-amber-200/20 text-amber-50 ring-1 ring-amber-200/40'
        : 'bg-stone-800/50 text-stone-500';
    return `<span class="rounded-full px-3 py-1 text-xs font-bold ${cls}">${PHASE_LABELS[phase]}</span>`;
  }).join('');

  const logHtml = log.length
    ? log
        .map(
          (entry) => `
        <div class="rounded-2xl border border-amber-100/10 bg-stone-950/40 p-4 text-sm leading-7 text-stone-200">
          <p class="text-xs font-bold uppercase tracking-wide text-amber-200/80">${esc(entry.label)}</p>
          <p class="mt-2">${esc(entry.narrative)}</p>
          ${entry.reply ? `<p class="mt-2 text-pink-100"><em>"${esc(entry.reply)}"</em></p>` : ''}
        </div>`,
        )
        .join('')
    : opening
      ? `<div class="rounded-2xl border border-pink-400/20 bg-pink-950/20 p-4 text-sm leading-7 text-stone-100">${esc(opening)}</div>`
      : '';

  const endVisitDone = visit.completedActions.includes('end_visit');
  const canComplete = canEndVisit(state);

  return `
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.28em] text-pink-200/70">Patient visit</p>
        <h2 class="mt-1 text-3xl font-black text-stone-50">${esc(patient.name)}</h2>
        <p class="mt-1 text-stone-300">${esc(patient.role)} · ${esc(stage.bodyType)} · ${Math.round(patient.weight)} lb</p>
        <p class="mt-1 text-xs text-stone-400">${esc(getPatientAppearanceSummary(patient))}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        ${canComplete ? `<button class="gold-button rounded-2xl px-5 py-2 font-bold" data-action="visit-complete">Complete visit</button>` : ''}
        <button class="dark-button rounded-2xl px-4 py-2 font-bold" data-action="visit-abandon">Leave desk</button>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap gap-2">${phaseRail}</div>
    <p class="mt-2 text-xs text-stone-400">${state.actionPoints} AP remaining · Week ${state.week} · Bill consult before checkout</p>

    <div class="mt-6 grid gap-6 lg:grid-cols-[16rem_1fr]">
      <aside class="soft-card rounded-3xl p-4 lg:sticky lg:top-0">
        <div class="text-pink-300">${renderSilhouette(patient, stageIdx, { wide: true })}</div>
        <p class="mt-2 text-center text-sm font-bold text-amber-100">${esc(stage.name)}</p>
        <div class="mt-3 space-y-1 text-xs text-stone-400">
          <div class="flex justify-between"><span>Trust</span><strong class="text-stone-200">${patient.trust.toFixed(1)}</strong></div>
          <div class="flex justify-between"><span>Loyalty</span><strong class="text-stone-200">${patient.loyalty || 0}</strong></div>
          <div class="flex justify-between"><span>Visits</span><strong class="text-stone-200">${patient.visits || 0}</strong></div>
        </div>
      </aside>

      <div class="min-w-0 space-y-5">
        <div class="max-h-[14rem] space-y-3 overflow-auto pr-1">${logHtml}</div>

        <div>
          <h3 class="text-lg font-bold text-amber-100">${PHASE_LABELS[visit.phase]} actions</h3>
          <div class="mt-3 grid gap-2 sm:grid-cols-2">
            ${actions
              .map((option) => {
                const tags = [];
                if (option.effects?.money) tags.push(`+${formatMoney(option.effects.money)}`);
                if (option.effects?.weightRoll) tags.push('weight↑');
                if (option.effects?.weight) tags.push('scale↑');
                if (option.effects?.trust) tags.push('trust↑');
                if (option.effects?.loyalty) tags.push('loyalty↑');
                if (option.requires?.inventory) tags.push('uses stock');
                return `
              <button class="rounded-2xl p-3 text-left transition ${option.disabled ? 'dark-button opacity-50' : 'soft-card hover:border-amber-200/40'}" data-action="visit-action" data-id="${esc(option.id)}" ${option.disabled ? 'disabled' : ''}>
                <div class="flex items-start justify-between gap-2">
                  <strong class="text-sm text-stone-50">${esc(option.label)}</strong>
                  <span class="text-xs text-amber-100">${option.apCost ? `${option.apCost} AP` : 'free'}</span>
                </div>
                <p class="mt-1 text-xs leading-5 text-stone-400">${esc(option.description)}</p>
                ${tags.length ? `<p class="mt-2 text-xs text-emerald-200">${tags.join(' · ')}</p>` : ''}
                ${option.reason && option.disabled ? `<p class="mt-1 text-xs text-red-200">${esc(option.reason)}</p>` : ''}
              </button>`;
              })
              .join('')}
          </div>
        </div>

        ${
          visit.phase === 'checkout' && !endVisitDone
            ? `<p class="text-sm text-amber-100">Checkout: bill consult, schedule follow-up if you want, then end visit.</p>`
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
