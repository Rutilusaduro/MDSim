import { getArcProgress } from '../arcs.js';
import { getPatientAppearanceSummary, getStageInfo, weightStageNames } from '../characters.js';
import { getLoyaltyArcProgress } from '../loyaltyArcs.js';
import { getCharacterRouteLabel } from '../mindset.js';
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
    return '<span class="mt-2 inline-block rounded-full bg-amber-400/20 px-2 py-0.5 text-xs font-bold text-amber-100">Visit in progress</span>';
  }
  if (patient.seenThisWeek) {
    return '<span class="mt-2 inline-block rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-200">Seen this week</span>';
  }
  return '<span class="mt-2 inline-block rounded-full bg-red-400/20 px-2 py-0.5 text-xs font-bold text-red-100">Needs visit</span>';
}

export function characterCard(character, variant = 'standard', state = gameState) {
  const stage = getStageInfo(character);
  const isPatient = character.type === 'patient';
  const arc = isPatient ? getLoyaltyArcProgress(character) : getArcProgress(character);
  const arcChip =
    variant === 'sidebar' && arc
      ? `<p class="mt-2 text-xs text-amber-200/90">${isPatient ? 'Loyalty arc' : e(arc.track.title)}: ${arc.completed}/${arc.total}</p>`
      : '';
  const openAction =
    isPatient && (!character.seenThisWeek || state.activePatientVisit?.patientId === character.id)
      ? 'open-visit'
      : 'open-character';
  const routeLabel = getCharacterRouteLabel(character);
  const routeChip = routeLabel
    ? `<p class="mt-2 text-xs font-bold text-pink-200">${e(routeLabel)}</p>`
    : '';
  return `
    <article class="soft-card cursor-pointer rounded-3xl p-4 transition duration-200" data-action="${openAction}" data-id="${e(character.id)}">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="ui-label">${isPatient ? 'Patient' : e(character.role)}</p>
          <h3 class="mt-1 text-lg font-semibold text-stone-50">${e(character.name)}</h3>
          <p class="text-sm text-stone-300">${e(stage.bodyType)} - ${Math.round(character.weight)} lb${isPatient && character.loyalty ? ` - Loyalty ${character.loyalty}` : ''}</p>
          ${isPatient ? `<p class="mt-1 text-xs text-stone-400">${e(getPatientAppearanceSummary(character))}</p>` : ''}
          ${routeChip}
          ${isPatient && variant !== 'sidebar' ? patientVisitBadge(state, character) : ''}
        </div>
        <span class="rounded-full bg-pink-500/15 px-3 py-1 text-xs text-pink-100">${e(stage.name)}</span>
      </div>
      ${stageMeter(character, true)}
      ${arcChip}
      ${
        variant === 'sidebar'
          ? ''
          : `<p class="mt-3 line-clamp-2 text-sm leading-6 text-stone-300">${e(stage.description)}</p>`
      }
    </article>
  `;
}

export function bodyTypesLabel(character) {
  return character.bodyType?.replace(/^\w/, (c) => c.toUpperCase()) || 'Figure';
}

