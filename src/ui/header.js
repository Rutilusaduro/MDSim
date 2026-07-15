import { e } from './dom.js';
import { isAudioMuted } from '../audio.js';
import { getChapterInfo } from '../chapters.js';
import { computeClinicEffects } from '../clinic.js';
import { getClinicTier } from '../clinicProgression.js';
import { getDominantStyle } from '../clinicStyle.js';
import { getCoverLabel } from '../patientFraming.js';
import { isDebugMode } from '../proseLab.js';
import { getReputationTier } from '../reputation.js';
import { getRivalProgress } from '../rival.js';
import { formatMoney } from '../state.js';
import { characterCard } from './components.js';

export function renderTopNav(state) {
  return `
    <header class="sticky top-0 z-30 border-b border-orange-100/10 bg-stone-950/72 backdrop-blur-xl">
      <div class="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div>
          <button class="text-left" data-action="rename-clinic">
            <p class="ui-label">Primary care on the surface</p>
            <h1 class="text-2xl font-black tracking-tight text-stone-50 md:text-3xl">${e(state.clinicName)}</h1>
          </button>
          <p class="text-sm text-stone-300">Owned by <button class="text-amber-200 underline decoration-amber-200/30" data-action="rename-doctor">${e(state.doctorName)}</button> · ${e(getClinicTier(state).label)}</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <div class="nav-pill rounded-2xl px-4 py-3">
            <p class="text-xs text-stone-400">Week</p>
            <p class="text-lg font-bold">${state.week}</p>
          </div>
          <div class="nav-pill rounded-2xl px-4 py-3">
            <p class="text-xs text-stone-400">Money</p>
            <p class="text-lg font-bold text-emerald-200">${formatMoney(state.money)}</p>
          </div>
          <div class="nav-pill rounded-2xl px-4 py-3">
            <p class="text-xs text-stone-400">Action Points</p>
            <p class="text-lg font-bold text-pink-100">${state.actionPoints}/${state.actionPointsMax}</p>
          </div>
          <button class="dark-button rounded-2xl px-4 py-3 text-sm font-bold" data-action="save">Save</button>
          <button class="dark-button rounded-2xl px-4 py-3 text-sm font-bold" data-action="load">Load</button>
          <button class="gold-button rounded-2xl px-6 py-4 font-bold transition hover:scale-[1.02]" data-action="end-week">
            End Week
          </button>
          <button class="dark-button rounded-2xl px-4 py-4 text-sm font-bold" data-action="toggle-audio" title="Toggle sound">
            ${isAudioMuted() ? 'Sound off' : 'Sound on'}
          </button>
          ${
            isDebugMode()
              ? `<button class="dark-button rounded-2xl px-4 py-3 text-sm font-bold" data-action="tab" data-tab="prose-lab">Prose Lab</button>`
              : `<button class="dark-button rounded-2xl px-4 py-3 text-xs font-bold opacity-70" data-action="toggle-debug" title="Add ?debug=1 to URL">Debug</button>`
          }
        </div>
      </div>
    </header>
  `;
}


export function renderSidebar(state) {
  const effects = computeClinicEffects(state);
  const cover = state.coverRating ?? 100;
  const heat = state.heat || 0;
  return `
    <aside class="glass-panel h-fit rounded-[2rem] p-5 lg:sticky lg:top-28">
      <div class="grid grid-cols-2 gap-3">
        <div class="soft-card rounded-2xl p-4">
          <p class="text-xs text-stone-400">Cover rating</p>
          <p class="text-2xl font-black text-sky-100">${cover}</p>
          <p class="text-xs text-stone-300">${e(getCoverLabel(state))}</p>
        </div>
        <div class="soft-card rounded-2xl p-4">
          <p class="text-xs text-stone-400">Heat</p>
          <p class="text-2xl font-black text-orange-100">${heat}</p>
          <p class="text-xs text-stone-300">${heat >= 40 ? 'Viral risk' : heat >= 15 ? 'Lobby whispers' : 'Low profile'}</p>
        </div>
        <div class="soft-card rounded-2xl p-4">
          <p class="text-xs text-stone-400">Reputation</p>
          <p class="text-2xl font-black text-amber-100">${state.reputation}</p>
          <p class="text-xs text-stone-300">${e(getReputationTier(state.reputation).name)}</p>
        </div>
        <div class="soft-card rounded-2xl p-4">
          <p class="text-xs text-stone-400">Rival</p>
          <p class="text-xl font-black text-red-100">${getRivalProgress(state).reputation}</p>
          <p class="text-xs text-stone-300 truncate">${e(getRivalProgress(state).name)}</p>
        </div>
        <div class="soft-card rounded-2xl p-4">
          <p class="text-xs text-stone-400">Chapter</p>
          <p class="text-sm font-black text-amber-100">${e(getChapterInfo(state).chapter?.name || 'Done')}</p>
          <p class="text-xs text-stone-300">${getDominantStyle(state).label}</p>
        </div>
        <div class="soft-card rounded-2xl p-4">
          <p class="text-xs text-stone-400">Roster</p>
          <p class="text-2xl font-black text-pink-100">${state.staff.length + state.patients.length}</p>
          <p class="text-xs text-stone-300">${state.staff.length} staff / ${state.patients.length} patients</p>
        </div>
        <div class="soft-card rounded-2xl p-4">
          <p class="text-xs text-stone-400">Weekly Bills</p>
          <p class="text-xl font-black text-red-100">${formatMoney(state.rent + state.salaries + state.supplyCost + effects.maintenance)}</p>
        </div>
        <div class="soft-card rounded-2xl p-4">
          <p class="text-xs text-stone-400">Active Upgrades</p>
          <p class="text-xl font-black text-emerald-100">${state.ownedUpgrades.length}</p>
          <p class="text-xs text-stone-300">${state.pendingInstallations.length} pending</p>
        </div>
      </div>

      <div class="mt-5 rounded-3xl border border-amber-100/10 bg-stone-950/30 p-4">
        <p class="text-sm font-bold text-stone-100">Compound inventory</p>
        <div class="mt-3 space-y-2 text-sm text-stone-300">
          <div class="flex justify-between"><span>Comfort Blend</span><strong>${state.inventory.comfortBlend}</strong></div>
          <div class="flex justify-between"><span>Appetite Tonic</span><strong>${state.inventory.appetiteTonic}</strong></div>
          <div class="flex justify-between"><span>Recovery Shake</span><strong>${state.inventory.recoveryShake}</strong></div>
        </div>
      </div>

      <div class="mt-6">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="font-bold text-stone-50">Staff overview</h2>
          <span class="text-xs text-stone-400">Click to open</span>
        </div>
        <div class="max-h-[34rem] space-y-3 overflow-auto pr-1">
          ${state.staff.map((member) => characterCard(member, 'sidebar')).join('')}
        </div>
      </div>
    </aside>
  `;
}


export function renderTabs(activeTab) {
  const tabs = [
    ['management', 'Management'],
    ['floorplan', 'Floor Plan'],
    ['interact', 'Interact'],
    ['relationships', 'Relationships'],
    ['campaign', 'Campaign'],
    ['log', 'Log / This Week'],
    ['achievements', 'Achievements'],
  ];
  if (isDebugMode()) tabs.push(['prose-lab', 'Prose Lab']);
  return `
    <nav class="mb-6 flex flex-wrap gap-3">
      ${tabs
        .map(
          ([id, label]) => `
            <button class="nav-pill ${activeTab === id ? 'active' : ''} rounded-2xl px-5 py-3 text-sm font-bold transition" data-action="tab" data-tab="${id}">
              ${label}
            </button>
          `,
        )
        .join('')}
    </nav>
  `;
}

