import { CHALLENGE_WEEKS, getChallengeLabel, needsChallengePick } from '../../challenges.js';
import { getChapterInfo } from '../../chapters.js';
import { getStyleFlavor, getStylePerks } from '../../clinicStyle.js';
import { getRivalProgress } from '../../rival.js';
import { RIVAL_CLINIC_ACTIONS, canUseRivalClinic, getRivalClinicProgress } from '../../rivalClinic.js';
import { formatMoney } from '../../state.js';
import { getActiveSeasonalWeek } from '../../v3WeeklyContent.js';
import { e } from '../dom.js';

export function renderCampaign(state) {
  const info = getChapterInfo(state);
  const rival = getRivalProgress(state);
  const seasonal = getActiveSeasonalWeek(state);
  const perks = getStylePerks(state);
  const rivalOps = getRivalClinicProgress(state);
  const challengeBanner = needsChallengePick(state)
    ? `<div class="mb-6 rounded-3xl border border-amber-300/30 bg-amber-950/30 p-5">
        <h3 class="font-bold text-amber-100">Pick this week's challenge</h3>
        <div class="mt-3 flex flex-wrap gap-3">
          ${CHALLENGE_WEEKS.map(
            (c) => `
            <button class="gold-button rounded-2xl px-4 py-3 text-sm font-bold" data-action="pick-challenge" data-challenge="${e(c.id)}">${e(c.name)}</button>
          `,
          ).join('')}
        </div>
      </div>`
    : `<p class="mb-4 text-sm text-stone-400">Active challenge: <strong class="text-amber-100">${e(getChallengeLabel(state.challengeWeek))}</strong></p>`;
  return `
    <section>
      ${challengeBanner}
      <div class="mb-5">
        <p class="text-sm uppercase tracking-[0.28em] text-amber-200/70">Story mode</p>
        <h2 class="mt-2 text-3xl font-black text-stone-50">${info.allDone ? 'Campaign complete' : info.chapter.name}</h2>
        <p class="mt-2 text-stone-300">${info.allDone ? 'Ending available after week 20.' : e(info.chapter.tagline)}</p>
      </div>
      ${
        !info.allDone
          ? `
        <ul class="space-y-3">
          ${info.goals
            .map(
              (g) => `
            <li class="soft-card flex items-center justify-between rounded-2xl px-4 py-3">
              <span class="text-stone-200">${e(g.label)}</span>
              <span class="${g.done ? 'text-emerald-300' : 'text-stone-500'}">${g.done ? 'Done' : 'Pending'}</span>
            </li>
          `,
            )
            .join('')}
        </ul>`
          : ''
      }
      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <div class="soft-card rounded-3xl p-4">
          <h4 class="font-bold text-red-100">Rival race</h4>
          <p class="mt-2 text-sm text-stone-300">You: ${state.reputation} vs ${rival.reputation}</p>
          <p class="mt-1 text-xs text-stone-400">${rival.defeated ? 'ThriveWell Annex defeated.' : `${rival.eventsLeft} rival events may still fire.`}</p>
        </div>
        <div class="soft-card rounded-3xl p-4">
          <h4 class="font-bold text-amber-100">Clinic style</h4>
          <p class="mt-2 text-sm text-stone-300">${e(getStyleFlavor(state))}</p>
          ${perks.length ? `<ul class="mt-2 space-y-1 text-xs text-emerald-200">${perks.map((p) => `<li>${e(p.label)}: ${e(p.effect)}</li>`).join('')}</ul>` : '<p class="mt-2 text-xs text-stone-500">Reach 65+ on a style axis for perks.</p>'}
          ${seasonal ? `<p class="mt-2 text-xs text-pink-200">${e(seasonal.name)}: ${e(seasonal.modifier)}</p>` : ''}
        </div>
      </div>
      ${
        canUseRivalClinic(state)
          ? `
      <div class="mt-6 soft-card rounded-3xl p-5">
        <h4 class="font-bold text-red-100">Annex Ops (${rivalOps.phase}/${rivalOps.maxPhase})</h4>
        <p class="mt-2 text-sm text-stone-300">Light rival-clinic counterplay. ${rivalOps.complete ? 'Arc complete.' : 'Take actions to silence ThriveWell.'}</p>
        <div class="mt-4 flex flex-wrap gap-3">
          ${RIVAL_CLINIC_ACTIONS.map(
            (a) => `
            <button class="dark-button rounded-2xl px-4 py-3 text-sm font-bold" data-action="rival-ops" data-rival-action="${e(a.id)}" ${rivalOps.complete ? 'disabled' : ''}>
              ${e(a.label)}${a.ap ? ' (1 AP)' : ` (${formatMoney(a.cost)})`}
            </button>
          `,
          ).join('')}
        </div>
      </div>`
          : ''
      }
    </section>
  `;
}

