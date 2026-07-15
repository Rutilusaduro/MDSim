import { getArcProgress } from '../arcs.js';
import { getPatientAppearanceSummary, getStageInfo, weightStageNames } from '../characters.js';
import { getLoyaltyArcProgress } from '../loyaltyArcs.js';
import { getCharacterRouteLabel } from '../mindset.js';
import { getPatientFramingTier } from '../patientFraming.js';
import { getFramingChipLabel } from '../visitClinical.js';
import { gameState } from '../state.js';
import { e } from './dom.js';

export function stageMeter(character, compact = false) {
  const stage = getStageInfo(character);
  return `
    <div class="${compact ? 'mt-3' : 'mt-4'}">
      <div class="mb-1 flex items-center justify-between text-xs text-stone-300">
        <span>${e(stage.name)}</span>
        <span>${stage.index + 1}/${weightStageNames.length}</span>
      </div>
      <div class="stage-bar">
        <div class="stage-fill" style="width:${stage.progress}%"></div>
      </div>
    </div>
  `;
}

export function patientVisitBadge(state, patient) {
  if (state.activePatientVisit?.patientId === patient.id) {
    return '<span class="badge badge-active">Visit in progress</span>';
  }
  if (patient.seenThisWeek) {
    return '<span class="badge badge-done">Seen this week</span>';
  }
  return '<span class="badge badge-due">Needs visit</span>';
}

function trustDots(trust) {
  const filled = Math.max(0, Math.min(5, Math.round((trust || 0) / 2.4)));
  return '●'.repeat(filled) + '○'.repeat(5 - filled);
}

export function characterCard(character, variant = 'standard', state = gameState) {
  const stage = getStageInfo(character);
  const isPatient = character.type === 'patient';
  const arc = isPatient ? getLoyaltyArcProgress(character) : getArcProgress(character);
  const arcChip =
    variant === 'sidebar' && arc
      ? `<p class="mt-2 text-xs text-[color:var(--ink-soft)]">${isPatient ? 'Loyalty arc' : e(arc.track.title)}: ${arc.completed}/${arc.total}</p>`
      : '';
  const openAction =
    isPatient && (!character.seenThisWeek || state.activePatientVisit?.patientId === character.id)
      ? 'open-visit'
      : 'open-character';
  const routeLabel = getCharacterRouteLabel(character);
  const routeChip = routeLabel
    ? `<p class="mt-2 text-xs font-bold text-[color:var(--accent)]">${e(routeLabel)}</p>`
    : '';
  const chartedLb = isPatient
    ? Math.round(character.chartedWeight ?? character.weight)
    : Math.round(character.weight);
  const framingNote = isPatient
    ? `<span class="note-clip">${e(getFramingChipLabel(getPatientFramingTier(character)))}</span>`
    : '';
  return `
    <article class="chart-card cursor-pointer" data-action="${openAction}" data-id="${e(character.id)}">
      <div class="chart-card-tab">
        <span class="font-bold">${e(character.name)}</span>
        <span class="chart-num text-xs">${chartedLb} lb${isPatient && character.chartedWeight != null && Math.round(character.chartedWeight) !== Math.round(character.weight) ? ' (chart)' : ''}</span>
      </div>
      <div class="p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="ui-label">${isPatient ? `Reason: ${e(character.publicReason || 'follow-up')}` : e(character.role)}</p>
            ${isPatient ? `<p class="prose-page mt-1 text-sm">${e(getPatientAppearanceSummary(character))}</p>` : ''}
            ${routeChip}
            ${isPatient && variant !== 'sidebar' ? patientVisitBadge(state, character) : ''}
          </div>
          ${framingNote}
        </div>
        ${stageMeter(character, true)}
        <p class="mt-1 flex items-center justify-between text-xs text-[color:var(--ink-soft)]">
          <span>${e(stage.name)}</span>
          <span title="Trust">${trustDots(character.trust)}</span>
        </p>
        ${arcChip}
        ${
          variant === 'sidebar'
            ? ''
            : `<p class="prose-page mt-3 line-clamp-2 text-sm">${e(stage.description)}</p>`
        }
      </div>
    </article>
  `;
}

export function bodyTypesLabel(character) {
  return character.bodyType?.replace(/^\w/, (c) => c.toUpperCase()) || 'Figure';
}

