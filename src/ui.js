import { buyManagementItem, computeClinicEffects, getItem, shopItems } from './clinic.js';
import { describeCharacter, getStageIndex, getStageInfo, getPatientAppearanceSummary, weightStageNames } from './characters.js';
import { endWeek, findCharacter, getInteractionOptions, performInteraction } from './events.js';
import { formatMoney, gameState, loadGame, resetGame, saveGame, spendActionPoint } from './state.js';
import { getAchievementProgress } from './achievements.js';
import { getArcProgress } from './arcs.js';
import { getReputationBlockReason, getReputationTier, isItemUnlockedByReputation } from './reputation.js';
import { renderSilhouette, renderSilhouetteCompare } from './silhouettes.js';
import { ROOMS, assignItemToRoom, getRoomBonusSummary } from './rooms.js';
import { getRivalProgress } from './rival.js';
import { getChapterInfo } from './chapters.js';
import { getRelationshipWeb, renderRelationshipGraphSvg } from './relationships.js';
import { getDominantStyle, getStyleFlavor, getStylePerks } from './clinicStyle.js';
import { applyGroupChoice, getPendingGroupScene } from './groupScenes.js';
import { applyNgPlus } from './endings.js';
import { getActiveSeasonalWeek } from './v3WeeklyContent.js';
import { CHALLENGE_WEEKS, needsChallengePick, pickChallengeWeek, getChallengeLabel } from './challenges.js';
import { getLoyaltyArcProgress } from './loyaltyArcs.js';
import { canUseRivalClinic, getRivalClinicProgress, performRivalClinicAction, RIVAL_CLINIC_ACTIONS } from './rivalClinic.js';
import { copyWeekSummary } from './export.js';
import { initAudio, isAudioMuted, playPurchase, playStageUp, playUiClick, playWeekEnd, toggleAudioMuted } from './audio.js';

let activeTab = 'management';
let toastTimer = null;
let characterModalTab = 'profile';
let characterModalId = null;
let dialogueCloseCallback = null;

const app = () => document.querySelector('#app');
const modalRoot = () => document.querySelector('#modal-root');

function e(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function showToast(message, type = 'success') {
  const existing = document.querySelector('#toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = `fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border px-5 py-4 text-sm shadow-2xl ${
    type === 'error'
      ? 'border-red-300/30 bg-red-950/90 text-red-100'
      : 'border-amber-200/25 bg-stone-950/92 text-amber-50'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.remove(), 3200);
}

function openDialogueModal(message, title = 'Outcome', onClose = null) {
  dialogueCloseCallback = onClose;
  openModal(`
    <div class="flex min-h-[12rem] flex-col items-center justify-center text-center">
      <p class="text-xs uppercase tracking-[0.28em] text-amber-200/70">${e(title)}</p>
      <p class="mt-6 max-w-2xl text-base leading-8 text-stone-100 md:text-lg">${e(message)}</p>
      <button class="gold-button mt-8 rounded-2xl px-8 py-3 font-bold" data-action="close-dialogue">Close</button>
    </div>
  `);
}

function stageMeter(character, compact = false) {
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

function characterCard(character, variant = 'standard') {
  const stage = getStageInfo(character);
  const isPatient = character.type === 'patient';
  const arc = isPatient ? getLoyaltyArcProgress(character) : getArcProgress(character);
  const arcChip =
    variant === 'sidebar' && arc
      ? `<p class="mt-2 text-xs text-amber-200/90">${isPatient ? 'Loyalty arc' : e(arc.track.title)}: ${arc.completed}/${arc.total}</p>`
      : '';
  return `
    <article class="soft-card cursor-pointer rounded-3xl p-4 transition duration-200" data-action="open-character" data-id="${e(character.id)}">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.22em] text-amber-200/70">${isPatient ? 'Patient' : e(character.role)}</p>
          <h3 class="mt-1 text-lg font-semibold text-stone-50">${e(character.name)}</h3>
          <p class="text-sm text-stone-300">${e(stage.bodyType)} - ${Math.round(character.weight)} lb${isPatient && character.loyalty ? ` - Loyalty ${character.loyalty}` : ''}</p>
          ${isPatient ? `<p class="mt-1 text-xs text-stone-400">${e(getPatientAppearanceSummary(character))}</p>` : ''}
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

function renderTopNav(state) {
  return `
    <header class="sticky top-0 z-30 border-b border-orange-100/10 bg-stone-950/72 backdrop-blur-xl">
      <div class="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div>
          <button class="text-left" data-action="rename-clinic">
            <p class="text-xs uppercase tracking-[0.32em] text-amber-200/70">Adult comfort management sim</p>
            <h1 class="text-2xl font-black tracking-tight text-stone-50 md:text-3xl">${e(state.clinicName)}</h1>
          </button>
          <p class="text-sm text-stone-300">Owned by <button class="text-amber-200 underline decoration-amber-200/30" data-action="rename-doctor">${e(state.doctorName)}</button></p>
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
          <button class="gold-button rounded-2xl px-6 py-4 font-bold transition hover:scale-[1.02]" data-action="end-week">
            End Week
          </button>
          <button class="dark-button rounded-2xl px-4 py-4 text-sm font-bold" data-action="toggle-audio" title="Toggle sound">
            ${isAudioMuted() ? 'Sound off' : 'Sound on'}
          </button>
        </div>
      </div>
    </header>
  `;
}

function renderSidebar(state) {
  const effects = computeClinicEffects(state);
  return `
    <aside class="glass-panel h-fit rounded-[2rem] p-5 lg:sticky lg:top-28">
      <div class="grid grid-cols-2 gap-3">
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

function renderTabs() {
  const tabs = [
    ['management', 'Management'],
    ['floorplan', 'Floor Plan'],
    ['interact', 'Interact'],
    ['relationships', 'Relationships'],
    ['campaign', 'Campaign'],
    ['log', 'Log / This Week'],
    ['achievements', 'Achievements'],
  ];
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

function renderManagement(state) {
  const categories = [...new Set(shopItems.map((item) => item.category))];
  return `
    <section>
      <div class="mb-5">
        <p class="text-sm uppercase tracking-[0.28em] text-amber-200/70">Management phase</p>
        <h2 class="mt-2 text-3xl font-black text-stone-50">Buy before the week turns</h2>
        <p class="mt-2 max-w-3xl text-stone-300">Money only. No AP. Furniture lands end of week. Stock and campaigns apply now.</p>
      </div>
      <div class="space-y-8">
        ${categories
          .map((category) => {
            const items = shopItems.filter((item) => item.category === category);
            return `
              <div>
                <h3 class="mb-3 text-xl font-bold text-amber-100">${e(category)}</h3>
                <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  ${items.map((item) => renderShopCard(state, item)).join('')}
                </div>
              </div>
            `;
          })
          .join('')}
      </div>
    </section>
  `;
}

function renderShopCard(state, item) {
  const owned = state.ownedUpgrades.includes(item.id);
  const pending = state.pendingInstallations.some((entry) => entry.id === item.id);
  const repBlocked = !isItemUnlockedByReputation(state, item.id);
  const disabled = owned || pending || state.money < item.cost || repBlocked;
  const status = owned
    ? 'Owned'
    : pending
      ? 'Installing'
      : repBlocked
        ? 'Locked'
        : formatMoney(item.cost);
  return `
    <article class="soft-card flex min-h-72 flex-col rounded-3xl p-5 transition duration-200">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.22em] text-pink-200/70">${e(item.category)}</p>
          <h4 class="mt-1 text-xl font-black text-stone-50">${e(item.name)}</h4>
        </div>
        <span class="rounded-full bg-amber-300/12 px-3 py-1 text-sm font-bold text-amber-100">${status}</span>
      </div>
      <p class="mt-4 text-sm font-semibold leading-6 text-amber-50">${e(item.tagline)}</p>
      <p class="mt-3 flex-1 text-sm leading-6 text-stone-300">${e(item.description)}</p>
      ${repBlocked ? `<p class="mt-2 text-xs text-amber-200">${e(getReputationBlockReason(state, item.id))}</p>` : ''}
      <button class="mt-5 rounded-2xl px-4 py-3 font-bold transition ${disabled ? 'dark-button' : 'gold-button hover:scale-[1.01]'}" data-action="buy" data-id="${e(item.id)}" ${disabled ? 'disabled' : ''}>
        ${owned ? 'Installed' : pending ? 'Arrives End Week' : repBlocked ? 'Locked' : `Buy - ${formatMoney(item.cost)}`}
      </button>
    </article>
  `;
}

function renderInteract(state) {
  return `
    <section>
      <div class="mb-5">
        <p class="text-sm uppercase tracking-[0.28em] text-amber-200/70">Action phase</p>
        <h2 class="mt-2 text-3xl font-black text-stone-50">Spend AP on people</h2>
        <p class="mt-2 max-w-3xl text-stone-300">Each visit shifts trust, appetite, and how fast they gain.</p>
      </div>
      <div class="grid gap-6 2xl:grid-cols-2">
        <div>
          <h3 class="mb-3 text-xl font-bold text-amber-100">Staff</h3>
          <div class="grid gap-4 md:grid-cols-2">
            ${state.staff.map((member) => characterCard(member)).join('')}
          </div>
        </div>
        <div>
          <h3 class="mb-3 text-xl font-bold text-amber-100">Patients</h3>
          <div class="grid gap-4 md:grid-cols-2">
            ${state.patients.map((patient) => characterCard(patient)).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderFloorPlan(state) {
  const summary = getRoomBonusSummary(state);
  const unassigned = state.ownedUpgrades.filter((id) => !Object.values(state.rooms || {}).flat().includes(id));
  return `
    <section>
      <div class="mb-5">
        <p class="text-sm uppercase tracking-[0.28em] text-amber-200/70">Clinic layout</p>
        <h2 class="mt-2 text-3xl font-black text-stone-50">Floor plan</h2>
        <p class="mt-2 max-w-3xl text-stone-300">Assign owned furniture to rooms for stacked bonuses (~35% of item effects per placement).</p>
      </div>
      <div class="grid gap-5 md:grid-cols-2">
        ${summary
          .map(
            ({ room, items, filled, slots }) => `
          <article class="soft-card rounded-3xl p-5" data-drop-room="${e(room.id)}">
            <h3 class="text-xl font-bold text-amber-100">${e(room.name)}</h3>
            <p class="mt-1 text-sm text-stone-400">${e(room.blurb)}</p>
            <p class="mt-2 text-xs text-stone-500">${filled} / ${slots} slots · drop items here</p>
            <ul class="mt-4 min-h-16 space-y-2 rounded-2xl border border-dashed border-amber-100/15 p-3 text-sm text-stone-300">
              ${items.length ? items.map((i) => `<li class="draggable-chip cursor-grab rounded-xl bg-stone-900/60 px-2 py-1" draggable="true" data-drag-item="${e(i.id)}">${e(i.name)}</li>`).join('') : '<li class="text-stone-500">Empty — drag furniture here</li>'}
            </ul>
          </article>
        `,
          )
          .join('')}
      </div>
      ${
        unassigned.length
          ? `
        <div class="mt-8">
          <h3 class="mb-3 text-xl font-bold text-amber-100">Unassigned upgrades</h3>
          <div class="grid gap-3 md:grid-cols-2">
            ${unassigned
              .map((id) => {
                const item = getItem(id);
                return `
              <div class="soft-card draggable-chip cursor-grab rounded-2xl p-4" draggable="true" data-drag-item="${e(id)}">
                <p class="font-bold text-stone-50">${e(item?.name || id)}</p>
                <p class="mt-2 text-xs text-stone-500">Drag to a room or use buttons</p>
                <div class="mt-3 flex flex-wrap gap-2">
                  ${ROOMS.map(
                    (r) => `
                    <button class="dark-button rounded-xl px-3 py-2 text-xs font-bold" data-action="assign-room" data-item="${e(id)}" data-room="${e(r.id)}">
                      → ${e(r.name)}
                    </button>
                  `,
                  ).join('')}
                </div>
              </div>`;
              })
              .join('')}
          </div>
        </div>`
          : ''
      }
    </section>
  `;
}

function renderRelationships(state) {
  const edges = getRelationshipWeb(state);
  return `
    <section>
      <div class="mb-5">
        <p class="text-sm uppercase tracking-[0.28em] text-amber-200/70">Staff dynamics</p>
        <h2 class="mt-2 text-3xl font-black text-stone-50">Relationship web</h2>
        <p class="mt-2 text-stone-300">${edges.length} active edges. Green = admires, pink = envies.</p>
      </div>
      <div class="soft-card mb-6 rounded-3xl p-4">${renderRelationshipGraphSvg(state)}</div>
      <div class="grid gap-4 md:grid-cols-2">
        ${edges
          .map(
            (edge) => `
          <article class="soft-card rounded-3xl p-4">
            <p class="text-xs uppercase tracking-widest ${edge.type === 'admires' ? 'text-emerald-300' : 'text-pink-300'}">${e(edge.type)}</p>
            <h4 class="mt-1 font-bold text-stone-50">${e(edge.from)} → ${e(edge.to)}</h4>
            <p class="mt-2 text-sm text-stone-300">${e(edge.note)}</p>
            ${
              edge.history.length
                ? `<ul class="mt-3 space-y-1 text-xs text-stone-400">${edge.history.map((h) => `<li>Week ${h.week}: ${e(h.title)}</li>`).join('')}</ul>`
                : ''
            }
          </article>
        `,
          )
          .join('')}
      </div>
    </section>
  `;
}

function renderCampaign(state) {
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

function renderAchievements(state) {
  const progress = getAchievementProgress(state);
  return `
    <section>
      <div class="mb-5">
        <p class="text-sm uppercase tracking-[0.28em] text-amber-200/70">Milestones</p>
        <h2 class="mt-2 text-3xl font-black text-stone-50">Achievements</h2>
        <p class="mt-2 text-stone-300">${progress.unlocked} / ${progress.total} unlocked</p>
      </div>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        ${progress.list
          .map(
            (a) => `
          <article class="soft-card rounded-3xl p-4 ${a.done ? 'border-amber-300/30' : 'opacity-70'}">
            <div class="flex items-start justify-between gap-2">
              <h4 class="font-bold text-stone-50">${e(a.name)}</h4>
              <span class="text-xs ${a.done ? 'text-emerald-300' : 'text-stone-500'}">${a.done ? 'Done' : 'Locked'}</span>
            </div>
            <p class="mt-2 text-sm text-stone-300">${e(a.desc)}</p>
          </article>
        `,
          )
          .join('')}
      </div>
    </section>
  `;
}

function renderLog(state) {
  const notes = state.thisWeek.length
    ? state.thisWeek
    : [{ title: 'Quiet week', text: 'No notes yet. Spend AP or end the week.' }];
  return `
    <section>
      <div class="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm uppercase tracking-[0.28em] text-amber-200/70">Narrative feed</p>
          <h2 class="mt-2 text-3xl font-black text-stone-50">This Week</h2>
        </div>
        <div class="flex gap-3">
          <button class="dark-button rounded-2xl px-4 py-3 text-sm font-bold" data-action="export-week">Export Week</button>
          <button class="dark-button rounded-2xl px-4 py-3 text-sm font-bold" data-action="save">Save Game</button>
          <button class="dark-button rounded-2xl px-4 py-3 text-sm font-bold" data-action="load">Load Game</button>
          <button class="dark-button rounded-2xl px-4 py-3 text-sm font-bold" data-action="new-game">New Game</button>
        </div>
      </div>
      <div class="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <div class="glass-panel rounded-[2rem] p-5">
          <h3 class="text-xl font-bold text-amber-100">Current week notes</h3>
          <div class="mt-4 space-y-4">
            ${notes
              .map(
                (note) => `
                  <article class="soft-card rounded-3xl p-4">
                    <h4 class="font-bold text-stone-50">${e(note.title)}</h4>
                    <p class="mt-2 text-sm leading-7 text-stone-300">${e(note.text)}</p>
                  </article>
                `,
              )
              .join('')}
          </div>
        </div>
        <div class="glass-panel rounded-[2rem] p-5">
          <h3 class="text-xl font-bold text-amber-100">Clinic archive</h3>
          <div class="mt-4 max-h-[45rem] space-y-4 overflow-auto pr-1">
            ${state.log
              .map(
                (entry) => `
                  <article class="soft-card rounded-3xl p-4">
                    <p class="text-xs uppercase tracking-[0.2em] text-stone-400">Week ${entry.week} - ${e(entry.type)}</p>
                    <h4 class="mt-1 font-bold text-stone-50">${e(entry.title)}</h4>
                    <div class="rich-copy mt-2 text-sm">${entry.type === 'resolution' ? entry.text : `<p>${e(entry.text)}</p>`}</div>
                  </article>
                `,
              )
              .join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderMain(state) {
  const panel =
    activeTab === 'management'
      ? renderManagement(state)
      : activeTab === 'floorplan'
        ? renderFloorPlan(state)
        : activeTab === 'interact'
          ? renderInteract(state)
          : activeTab === 'relationships'
            ? renderRelationships(state)
            : activeTab === 'campaign'
              ? renderCampaign(state)
              : activeTab === 'achievements'
                ? renderAchievements(state)
                : renderLog(state);

  return `
    <main class="mx-auto grid max-w-[1600px] gap-6 px-5 py-6 lg:grid-cols-[22rem_1fr]">
      ${renderSidebar(state)}
      <div class="glass-panel min-h-[48rem] rounded-[2rem] p-5 md:p-7">
        ${renderTabs()}
        ${panel}
      </div>
    </main>
  `;
}

export function render() {
  app().innerHTML = `
    ${renderTopNav(gameState)}
    ${renderMain(gameState)}
  `;
}

function openModal(content) {
  modalRoot().innerHTML = `
    <div class="modal-backdrop fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4" data-action="close-modal">
      <div class="modal-card glass-panel max-h-[92vh] w-full max-w-4xl overflow-auto rounded-[2rem] p-6 md:p-8" data-modal-card>
        ${content}
      </div>
    </div>
  `;
}

function closeModal() {
  modalRoot().innerHTML = '';
}

function openCharacterModal(id, tab = null) {
  const character = findCharacter(gameState, id);
  if (!character) return;
  if (tab) characterModalTab = tab;
  else if (characterModalId !== id) characterModalTab = 'profile';
  characterModalId = id;

  const stage = getStageInfo(character);
  const stageIdx = getStageIndex(character);
  const options = getInteractionOptions(gameState, character);
  const arc = character.type === 'staff' ? getArcProgress(character) : getLoyaltyArcProgress(character);
  const prefs = character.preferences || { pace: 'gradual', focus: 'comfort', public: 'private' };
  const arcHtml = arc
    ? `<p class="mt-3 rounded-2xl bg-pink-500/10 px-3 py-2 text-xs text-pink-100"><strong>${e(arc.track.title)}</strong><br>${character.type === 'patient' ? 'Loyalty' : 'Arc'} ${arc.completed} / ${arc.total}${arc.done ? ' (complete)' : ''}</p>`
    : '';
  const tabClass = (name) =>
    characterModalTab === name
      ? 'rounded-2xl bg-amber-200/15 px-4 py-2 text-sm font-bold text-amber-50'
      : 'rounded-2xl px-4 py-2 text-sm font-bold text-stone-400 hover:text-stone-200';

  const statsBlock = `
    <div class="space-y-3 text-sm text-stone-300">
      <div class="flex justify-between"><span>Appetite</span><strong>${character.appetite.toFixed(1)}</strong></div>
      <div class="flex justify-between"><span>Trust</span><strong>${character.trust.toFixed(1)}</strong></div>
      <div class="flex justify-between"><span>Openness</span><strong>${Math.round(character.openness)}</strong></div>
      <div class="flex justify-between"><span>Indulgence</span><strong>${Math.round(character.indulgence)}</strong></div>
      <div class="flex justify-between"><span>Momentum</span><strong>${character.weeklyMomentum.toFixed(1)}</strong></div>
    </div>
  `;

  const prefsBlock = `
    <div class="mt-4 space-y-2 text-xs text-stone-300">
      <p class="font-bold text-amber-100">Comfort preferences</p>
      <label class="block">Pace
        <select data-action="set-pref" data-id="${e(character.id)}" data-key="pace" class="mt-1 w-full rounded-xl border border-amber-100/10 bg-stone-950 p-2 text-stone-200">
          <option value="gradual" ${prefs.pace === 'gradual' ? 'selected' : ''}>Gradual</option>
          <option value="eager" ${prefs.pace === 'eager' ? 'selected' : ''}>Eager</option>
        </select>
      </label>
      <label class="block">Focus
        <select data-action="set-pref" data-id="${e(character.id)}" data-key="focus" class="mt-1 w-full rounded-xl border border-amber-100/10 bg-stone-950 p-2 text-stone-200">
          <option value="comfort" ${prefs.focus === 'comfort' ? 'selected' : ''}>Comfort</option>
          <option value="appetite" ${prefs.focus === 'appetite' ? 'selected' : ''}>Appetite</option>
        </select>
      </label>
      <label class="block">Public display
        <select data-action="set-pref" data-id="${e(character.id)}" data-key="public" class="mt-1 w-full rounded-xl border border-amber-100/10 bg-stone-950 p-2 text-stone-200">
          <option value="private" ${prefs.public === 'private' ? 'selected' : ''}>Private</option>
          <option value="open" ${prefs.public === 'open' ? 'selected' : ''}>Open</option>
        </select>
      </label>
    </div>
  `;

  const profilePanel = `
    <div class="rich-copy rounded-3xl border border-amber-100/10 bg-stone-950/30 p-5">
      ${describeCharacter(character)}
    </div>
    ${statsBlock}
    ${prefsBlock}
    <p class="rounded-2xl bg-emerald-300/10 p-3 text-xs leading-5 text-emerald-100">${e(character.consent)}</p>
  `;

  const actionsPanel = `
    <div>
      <h3 class="text-xl font-bold text-amber-100">Choose interaction <span class="text-sm font-normal text-stone-400">(${gameState.actionPoints} AP remaining)</span></h3>
      <div class="mt-4 grid gap-3">
        ${options
          .map(
            (option) => `
              <button class="rounded-3xl p-4 text-left transition ${option.disabled ? 'dark-button opacity-55' : 'soft-card hover:border-amber-200/40'}" data-action="interact" data-id="${e(character.id)}" data-interaction="${e(option.id)}" ${option.disabled ? 'disabled' : ''}>
                <div class="flex items-start justify-between gap-3">
                  <strong class="text-stone-50">${e(option.label)}</strong>
                  <span class="text-xs text-amber-100">${option.cost ? formatMoney(option.cost) : option.money ? `+${formatMoney(option.money)}` : '1 AP'}</span>
                </div>
                <p class="mt-2 text-sm leading-6 text-stone-300">${e(option.description)}</p>
                ${option.reason ? `<p class="mt-2 text-xs text-red-200">${e(option.reason)}</p>` : ''}
              </button>
            `,
          )
          .join('')}
      </div>
    </div>
  `;

  openModal(`
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.28em] text-amber-200/70">${e(character.type)} profile</p>
        <h2 class="mt-1 text-3xl font-black text-stone-50">${e(character.name)}</h2>
        <p class="mt-1 text-stone-300">${e(character.role)} - ${e(stage.bodyType)} - ${Math.round(character.weight)} lb</p>
      </div>
      <button class="dark-button rounded-2xl px-4 py-2 font-bold" data-action="close-modal">Close</button>
    </div>
    <div class="mt-6 grid gap-6 lg:grid-cols-[18rem_1fr]">
      <aside class="soft-card rounded-3xl p-5 lg:sticky lg:top-0 lg:self-start">
        <div class="text-pink-300">${renderSilhouette(character, stageIdx)}</div>
        <p class="mt-2 text-center text-sm font-bold text-amber-100">${e(stage.name)}</p>
        ${stageMeter(character)}
        ${arcHtml}
        ${character.type === 'patient' ? `<p class="mt-2 text-center text-xs text-stone-400">Loyalty ${character.loyalty || 0} · Visits ${character.visits || 0}</p>` : ''}
      </aside>
      <div class="min-w-0">
        <div class="mb-4 flex flex-wrap gap-2 border-b border-amber-100/10 pb-4">
          <button class="${tabClass('profile')}" data-action="character-tab" data-id="${e(character.id)}" data-tab="profile">Profile &amp; stats</button>
          <button class="${tabClass('actions')}" data-action="character-tab" data-id="${e(character.id)}" data-tab="actions">Actions</button>
        </div>
        <div class="space-y-5">
          ${characterModalTab === 'actions' ? actionsPanel : profilePanel}
        </div>
      </div>
    </div>
  `);
}

function openGroupSceneModal(payload) {
  const { scene, characters } = payload;
  openModal(`
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.28em] text-pink-200/70">Group scene</p>
        <h2 class="mt-1 text-3xl font-black text-stone-50">${e(scene.title)}</h2>
      </div>
    </div>
    <p class="mt-4 text-stone-300">${e(scene.text)}</p>
    <p class="mt-2 text-sm text-amber-100">Present: ${characters.map((c) => e(c.name)).join(', ')}</p>
    <div class="mt-6 grid gap-3">
      ${scene.choices
        .map(
          (ch) => `
        <button class="soft-card rounded-2xl p-4 text-left hover:border-amber-200/40" data-action="group-choice" data-scene="${e(scene.id)}" data-choice="${e(ch.id)}">
          <strong class="text-stone-50">${e(ch.label)}</strong>
          <p class="mt-1 text-sm text-stone-400">Costs 1 AP</p>
        </button>
      `,
        )
        .join('')}
    </div>
    <button class="dark-button mt-4 rounded-2xl px-4 py-2 font-bold" data-action="dismiss-group">Skip scene</button>
  `);
}

function openEndingModal(ending) {
  openModal(`
    <div>
      <p class="text-xs uppercase tracking-[0.28em] text-amber-200/70">Campaign ending</p>
      <h2 class="mt-2 text-3xl font-black text-stone-50">${e(ending.card.name)}</h2>
      <p class="mt-4 text-lg text-stone-300">${e(ending.card.blurb)}</p>
      <ul class="mt-6 space-y-2 text-sm text-stone-400">
        <li>Week ${ending.week}</li>
        <li>Reputation ${ending.reputation}</li>
        <li>Staff ${ending.staffCount}</li>
        <li>Recruited ${ending.recruited}</li>
      </ul>
      <div class="mt-8 flex flex-wrap gap-3">
        <button class="gold-button rounded-2xl px-5 py-3 font-bold" data-action="ng-plus" data-bonus="ap">NG+ (+1 AP)</button>
        <button class="dark-button rounded-2xl px-5 py-3 font-bold" data-action="close-modal">Continue</button>
      </div>
    </div>
  `);
}

function openResolutionModal(resolution) {
  const stageBlock =
    resolution.stageChanges?.length > 0
      ? `<div class="mt-4 space-y-4">${resolution.stageChanges
          .map((c) => {
            const char = findCharacter(gameState, c.id);
            return `
        <div class="stage-glow soft-card rounded-2xl p-3 text-sm">
          <strong class="text-amber-100">${e(c.name)}</strong>
          <span class="text-stone-400"> stage ${c.oldStage + 1} → ${c.newStage + 1}</span>
          <p class="mt-1 text-stone-300">+${c.gain.toFixed(1)} lb this week</p>
          ${char ? `<div class="mt-3">${renderSilhouetteCompare(char, c.oldStage, c.newStage)}</div>` : ''}
        </div>`;
          })
          .join('')}</div>`
      : '';

  const achBlock =
    resolution.newAchievements?.length > 0
      ? `<div class="mt-4 rounded-2xl border border-amber-300/20 bg-amber-950/30 p-4">
          <p class="text-sm font-bold text-amber-100">Achievements unlocked</p>
          <ul class="mt-2 space-y-1 text-sm text-stone-200">
            ${resolution.newAchievements.map((a) => `<li>${e(a.name)}: ${e(a.desc)}</li>`).join('')}
          </ul>
        </div>`
      : '';

  openModal(`
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.28em] text-pink-200/70">End of week resolution</p>
        <h2 class="mt-1 text-3xl font-black text-stone-50">Week ${resolution.week} closes</h2>
      </div>
      <button class="dark-button rounded-2xl px-4 py-2 font-bold" data-action="close-modal">Close</button>
    </div>
    ${achBlock}
    ${stageBlock}
    <div class="rich-copy mt-6 rounded-3xl border border-amber-100/10 bg-stone-950/30 p-5 text-base">
      ${resolution.html}
    </div>
    <div class="mt-6 grid gap-4 md:grid-cols-3">
      <div class="soft-card rounded-3xl p-4">
        <p class="text-xs text-stone-400">Staff gain</p>
        <p class="text-2xl font-black text-pink-100">${resolution.staffGains.reduce((sum, item) => sum + item.gain, 0).toFixed(1)} lb</p>
      </div>
      <div class="soft-card rounded-3xl p-4">
        <p class="text-xs text-stone-400">Patient gain</p>
        <p class="text-2xl font-black text-pink-100">${resolution.patientGains.reduce((sum, item) => sum + item.gain, 0).toFixed(1)} lb</p>
      </div>
      <div class="soft-card rounded-3xl p-4">
        <p class="text-xs text-stone-400">Stage changes</p>
        <p class="text-2xl font-black text-amber-100">${resolution.stageChanges.length}</p>
      </div>
    </div>
  `);
}

function handleBuy(id) {
  const result = buyManagementItem(gameState, id);
  showToast(result.message, result.ok ? 'success' : 'error');
  if (result.ok) {
    playPurchase();
    saveGame(gameState);
  }
  render();
}

function handleInteraction(characterId, actionId) {
  const result = performInteraction(gameState, characterId, actionId);
  if (!result.ok) {
    showToast(result.message, 'error');
    return;
  }
  saveGame(gameState);
  render();
  if (actionId === 'recruit') {
    openDialogueModal(result.message, 'Recruitment');
    return;
  }
  const resumeTab = actionId === 'arcScene' ? 'profile' : 'actions';
  openDialogueModal(result.message, 'Interaction result', () => {
    const character = findCharacter(gameState, characterId);
    if (character) openCharacterModal(characterId, resumeTab);
  });
}

function bindEvents() {
  document.addEventListener('click', (event) => {
    const modalCard = event.target.closest('[data-modal-card]');
    if (modalCard) event.stopPropagation();
    const target = event.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    if (action === 'tab') {
      playUiClick();
      activeTab = target.dataset.tab;
      render();
    }
    if (action === 'buy') {
      handleBuy(target.dataset.id);
    }
    if (action === 'open-character') {
      openCharacterModal(target.dataset.id);
    }
    if (action === 'character-tab') {
      playUiClick();
      openCharacterModal(target.dataset.id, target.dataset.tab);
    }
    if (action === 'interact') {
      handleInteraction(target.dataset.id, target.dataset.interaction);
    }
    if (action === 'end-week') {
      const resolution = endWeek(gameState);
      playWeekEnd();
      if (resolution.stageChanges?.length) playStageUp();
      render();
      openResolutionModal(resolution);
      gameState.pendingStageHighlights = [];
      if (getPendingGroupScene(gameState)) {
        setTimeout(() => openGroupSceneModal(getPendingGroupScene(gameState)), 400);
      }
      if (resolution.ending) {
        setTimeout(() => openEndingModal(resolution.ending), 800);
      }
    }
    if (action === 'pick-challenge') {
      const result = pickChallengeWeek(gameState, target.dataset.challenge);
      showToast(result.message, result.ok ? 'success' : 'error');
      if (result.ok) {
        playUiClick();
        saveGame(gameState);
        render();
      }
    }
    if (action === 'rival-ops') {
      const result = performRivalClinicAction(gameState, target.dataset.rivalAction, spendActionPoint);
      showToast(result.message, result.ok ? 'success' : 'error');
      if (result.ok) {
        if (gameState.stats) gameState.stats.rivalOpsActions = (gameState.stats.rivalOpsActions || 0) + 1;
        saveGame(gameState);
        render();
      }
    }
    if (action === 'export-week') {
      copyWeekSummary(gameState).then((r) => showToast(r.message, r.ok ? 'success' : 'error'));
    }
    if (action === 'toggle-audio') {
      toggleAudioMuted(gameState);
      saveGame(gameState);
      render();
      showToast(isAudioMuted() ? 'Sound muted.' : 'Sound on.');
    }
    if (action === 'assign-room') {
      const result = assignItemToRoom(gameState, target.dataset.item, target.dataset.room);
      showToast(result.message, result.ok ? 'success' : 'error');
      if (result.ok) saveGame(gameState);
      render();
    }
    if (action === 'group-choice') {
      const pending = getPendingGroupScene(gameState);
      if (!pending) return;
      const result = applyGroupChoice(gameState, pending.scene, target.dataset.choice, pending.characters);
      showToast(result.message, result.ok ? 'success' : 'error');
      if (result.ok) {
        gameState.pendingGroupScene = null;
        if (gameState.stats) gameState.stats.groupScenesPlayed = (gameState.stats.groupScenesPlayed || 0) + 1;
        saveGame(gameState);
        closeModal();
        render();
      }
    }
    if (action === 'dismiss-group') {
      gameState.pendingGroupScene = null;
      saveGame(gameState);
      closeModal();
    }
    if (action === 'ng-plus') {
      const bonus = applyNgPlus(gameState, target.dataset.bonus);
      showToast(`NG+ bonus: ${bonus.label}`);
      gameState.pendingEnding = null;
      saveGame(gameState);
      closeModal();
      render();
    }
    if (action === 'close-modal') {
      characterModalId = null;
      closeModal();
    }
    if (action === 'close-dialogue') {
      const callback = dialogueCloseCallback;
      dialogueCloseCallback = null;
      closeModal();
      if (callback) callback();
    }
    if (action === 'save') {
      saveGame(gameState);
      showToast('Game saved.');
    }
    if (action === 'load') {
      try {
        const loaded = loadGame();
        showToast(loaded ? 'Game loaded.' : 'No save file found.', loaded ? 'success' : 'error');
        render();
      } catch (error) {
        showToast(`Could not load save: ${error.message}`, 'error');
      }
    }
    if (action === 'new-game') {
      if (window.confirm('Start a fresh clinic and overwrite the current autosave?')) {
        resetGame();
        activeTab = 'management';
        closeModal();
        render();
        showToast('New clinic generated.');
      }
    }
    if (action === 'rename-doctor') {
      const next = window.prompt('Doctor name', gameState.doctorName);
      if (next?.trim()) {
        gameState.doctorName = next.trim();
        saveGame(gameState);
        render();
      }
    }
    if (action === 'rename-clinic') {
      const next = window.prompt('Clinic name', gameState.clinicName);
      if (next?.trim()) {
        gameState.clinicName = next.trim();
        saveGame(gameState);
        render();
      }
    }
  });
  let dragItemId = null;
  document.addEventListener('dragstart', (event) => {
    const chip = event.target.closest('[data-drag-item]');
    if (!chip) return;
    dragItemId = chip.dataset.dragItem;
    event.dataTransfer?.setData('text/plain', dragItemId);
  });
  document.addEventListener('dragover', (event) => {
    if (event.target.closest('[data-drop-room]')) event.preventDefault();
  });
  document.addEventListener('drop', (event) => {
    const zone = event.target.closest('[data-drop-room]');
    if (!zone || !dragItemId) return;
    event.preventDefault();
    const result = assignItemToRoom(gameState, dragItemId, zone.dataset.dropRoom);
    dragItemId = null;
    showToast(result.message, result.ok ? 'success' : 'error');
    if (result.ok) saveGame(gameState);
    render();
  });
  document.addEventListener('change', (event) => {
    const target = event.target.closest('[data-action="set-pref"]');
    if (!target) return;
    const character = findCharacter(gameState, target.dataset.id);
    if (!character) return;
    if (!character.preferences) character.preferences = { pace: 'gradual', focus: 'comfort', public: 'private' };
    character.preferences[target.dataset.key] = target.value;
    saveGame(gameState);
    showToast('Preferences updated.');
    if (characterModalId === character.id) openCharacterModal(character.id, 'profile');
  });
}

export function initUI() {
  try {
    loadGame();
  } catch (error) {
    console.warn('Save could not be loaded, starting fresh.', error);
  }
  initAudio(gameState);
  bindEvents();
  render();
  if (needsChallengePick(gameState)) {
    activeTab = 'campaign';
    render();
  }
}
