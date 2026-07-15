import { buyManagementItem, computeClinicEffects, getItem, shopItems } from './clinic.js';
import { describeCharacter, getStageIndex, getStageInfo, getPatientAppearanceSummary, weightStageNames } from './characters.js';
import { endWeek, getInteractionOptions, performInteraction } from './events.js';
import { findCharacter } from './roster.js';
import { formatMoney, gameState, loadGame, resetGame, saveGame, spendActionPoint } from './state.js';
import { getAchievementProgress } from './achievements.js';
import { formatArcSceneNote } from './staffArcs/index.js';
import { getArcProgress, getArcSceneForCharacter, advanceArc, getRouteLabel } from './arcs.js';
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
import {
  copyAgentFixPrompt,
  downloadFixRequest,
  generateProseLabText,
  getGithubIssueUrl,
  initDebugModeFromUrl,
  isDebugMode,
  proseLabState,
  randomizeProseLabVars,
  renderProseLabPanel,
  setDebugMode,
  syncProseLabFromForm,
} from './proseLab.js';
import {
  applyDebugResetWeight,
  applyDebugStage,
  applyDebugStageBump,
  applyDebugWeightBump,
  fattenRoster,
  renderCharacterDebugControls,
  renderRosterDebugPanel,
} from './debugTools.js';
import {
  completeVisit,
  getUnvisitedPatients,
  performVisitAction,
  resolveVisitInterrupt,
  applyWeighChartChoice,
} from './patientVisit.js';
import { openPatientVisitFlow, renderPatientVisitModal } from './patientVisitUi.js';
import { rosterMobilitySummary, getMobilityLabel } from './worldImpact.js';
import { getRecruitmentPanel, hireCandidate } from './recruitment.js';
import { getClinicTier } from './clinicProgression.js';
import { PUBLIC_CLINIC_TAGLINE, getCoverLabel } from './patientFraming.js';
import { getClinicTagline, getClinicAmbientLine } from './clinicMindset.js';
import { renderChartGapSvg } from './gameOver.js';
import { queueModal, showNextModal, clearModalQueue } from './ui/modalQueue.js';
import { openConfirmModal, handleConfirmYes, handleConfirmNo } from './ui/confirmModal.js';
import { getCharacterRouteLabel, getMindset, MINDSET_LABELS } from './mindset.js';
import { isGameOver } from './gameOver.js';
import { getWeekInterrupt, getWeekInterruptScene, resolveWeekInterrupt } from './weekScenes.js';
import { app, closeModal, e, modalRoot, openModal, showToast } from './ui/dom.js';
import { stageMeter } from './ui/components.js';
import { renderSidebar, renderTabs, renderTopNav } from './ui/header.js';
import { renderManagement } from './ui/tabs/management.js';
import { renderInteract } from './ui/tabs/interact.js';
import { renderFloorPlan } from './ui/tabs/floorplan.js';
import { renderRelationships } from './ui/tabs/relationships.js';
import { renderCampaign } from './ui/tabs/campaign.js';
import { renderAchievements } from './ui/tabs/achievements.js';
import { renderLog } from './ui/tabs/log.js';
import { staffCandidateSummary } from './characters.js';

let activeTab = 'management';
let characterModalTab = 'profile';
let characterModalId = null;
let dialogueCloseCallback = null;


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


function renderMain(state) {
  if (activeTab === 'prose-lab' && isDebugMode()) {
    return `
      <main class="mx-auto max-w-[1600px] px-5 py-6">
        <div class="glass-panel min-h-[48rem] rounded-[2rem] p-5 md:p-7">
          ${renderProseLabPanel()}
        </div>
      </main>
    `;
  }

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
        ${renderTabs(activeTab)}
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


function refreshPatientVisitModal() {
  const visit = gameState.activePatientVisit;
  if (!visit) return;
  openModal(renderPatientVisitModal(gameState, visit.patientId));
}

function startPatientVisit(patientId) {
  openPatientVisitFlow(gameState, patientId, {
    showToast,
    openModal: (html) => openModal(html),
    onStart: () => saveGame(gameState),
  });
}

function openStaffArcModal(characterId) {
  const character = findCharacter(gameState, characterId);
  if (!character) return;

  const payload = getArcSceneForCharacter(character);
  if (!payload.ok) {
    showToast(payload.reason, 'error');
    return;
  }

  const { beat, scene, progress } = payload;
  const stageIdx = getStageIndex(character);
  const route = getRouteLabel(character);

  openModal(`
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.28em] text-pink-200/70">Staff arc · ${progress.completed + 1} / ${progress.total}</p>
        <h2 class="mt-1 text-3xl font-black text-stone-50">${e(beat.title)}</h2>
        <p class="mt-1 text-stone-400">${e(progress.track.title)} · ${e(character.name)}${route ? ` · <span class="text-pink-200">${e(route)}</span>` : ''}</p>
      </div>
      <button class="dark-button rounded-2xl px-4 py-2 font-bold" data-action="close-modal">Close</button>
    </div>

    <div class="mt-6 grid gap-6 lg:grid-cols-[14rem_1fr]">
      <aside class="soft-card rounded-3xl p-4 lg:sticky lg:top-0">
        <div class="text-pink-300">${renderSilhouette(character, stageIdx, { wide: true })}</div>
        <p class="mt-2 text-center text-sm font-bold text-amber-100">${e(getStageInfo(character).name)}</p>
        <p class="mt-2 text-center text-xs text-stone-400">Trust ${character.trust.toFixed(1)}</p>
      </aside>
      <div class="min-w-0 space-y-5">
        <div class="rich-copy rounded-3xl border border-amber-100/10 bg-stone-950/30 p-5 text-base">
          ${scene.opening
            .split('\n\n')
            .map((para, i) => `<p class="${i ? 'mt-4' : ''} leading-8 text-stone-100">${e(para)}</p>`)
            .join('')}
        </div>
        <div>
          <h3 class="text-lg font-bold text-amber-100">What do you do?</h3>
          <p class="mt-1 text-xs text-stone-400">Costs 1 AP · ${gameState.actionPoints} AP remaining</p>
          <div class="mt-3 grid gap-3">
            ${scene.choices
              .map(
                (choice) => `
              <button class="soft-card rounded-2xl p-4 text-left hover:border-amber-200/40" data-action="arc-choice" data-id="${e(character.id)}" data-choice="${e(choice.id)}" ${gameState.actionPoints <= 0 ? 'disabled' : ''}>
                <strong class="text-stone-50">${e(choice.label)}</strong>
                ${choice.hint ? `<p class="mt-1 text-xs text-stone-400">${e(choice.hint)}</p>` : ''}
              </button>`,
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>
  `);
}

function handleArcChoice(characterId, choiceId) {
  const character = findCharacter(gameState, characterId);
  if (!character) return;

  const result = advanceArc(character, gameState, choiceId);
  if (!result.ok) {
    showToast(result.message || result.reason, 'error');
    return;
  }

  saveGame(gameState);
  render();
  const closing = [result.text, result.epilogue].filter(Boolean).join('\n\n');
  openDialogueModal(closing, `After: ${result.beat.title}`, () => {
    openCharacterModal(characterId, 'profile');
  });
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
  const routeLabel = getCharacterRouteLabel(character);
  const mindset = getMindset(character);
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
      <div class="flex justify-between"><span>Mindset</span><strong>${e(MINDSET_LABELS[mindset] || mindset)}</strong></div>
      ${routeLabel ? `<div class="flex justify-between"><span>Route</span><strong class="text-pink-200">${e(routeLabel)}</strong></div>` : ''}
      <div class="flex justify-between"><span>Appetite</span><strong>${character.appetite.toFixed(1)}</strong></div>
      <div class="flex justify-between"><span>Trust</span><strong>${character.trust.toFixed(1)}</strong></div>
      <div class="flex justify-between"><span>Openness</span><strong>${Math.round(character.openness)}</strong></div>
      <div class="flex justify-between"><span>Indulgence</span><strong>${Math.round(character.indulgence)}</strong></div>
      <div class="flex justify-between"><span>Momentum</span><strong>${character.weeklyMomentum.toFixed(1)}</strong></div>
    </div>
  `;

  const prefsBlock = `
    <div class="mt-4 space-y-2 text-xs text-stone-300">
      <p class="font-bold text-amber-100">Feeding preferences</p>
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

  const chartBlock =
    character.type === 'patient'
      ? `<div class="mt-4 rounded-2xl border border-amber-100/10 bg-stone-950/40 p-4">
          <p class="text-xs font-bold uppercase tracking-wide text-amber-200">Chart vs scale</p>
          ${renderChartGapSvg(character, gameState)}
        </div>`
      : '';

  const profilePanel = `
    <div class="rich-copy rounded-3xl border border-amber-100/10 bg-stone-950/30 p-5">
      ${describeCharacter(character)}
    </div>
    ${statsBlock}
    ${chartBlock}
    ${prefsBlock}
    <p class="rounded-2xl bg-emerald-300/10 p-3 text-xs leading-5 text-emerald-100">${e(character.consent)}</p>
  `;

  const actionsPanel = `
    <div>
      ${
        character.type === 'patient' && gameState.activePatientVisit?.patientId === character.id
          ? `<button class="gold-button mb-4 rounded-2xl px-5 py-2 font-bold" data-action="open-visit" data-id="${e(character.id)}">Resume visit</button>`
          : ''
      }
      <h3 class="text-xl font-bold text-amber-100">Choose interaction <span class="text-sm font-normal text-stone-400">(${gameState.actionPoints} AP remaining)</span></h3>
      ${
        character.type === 'patient' && !character.seenThisWeek
          ? `<p class="mt-2 text-sm text-amber-100">This patient still needs a visit this week. Use the Interact tab to run her exam.</p>`
          : ''
      }
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
        ${routeLabel ? `<p class="mt-1 text-sm text-pink-200">${e(routeLabel)}</p>` : ''}
        ${character.isMole && character.moleRevealed ? '<p class="mt-1 text-xs text-red-200">Annex eyes. Feed only, no firing.</p>' : ''}
      </div>
      <button class="dark-button rounded-2xl px-4 py-2 font-bold" data-action="close-modal">Close</button>
    </div>
    <div class="mt-6 grid gap-6 lg:grid-cols-[18rem_1fr]">
      <aside class="soft-card rounded-3xl p-5 lg:sticky lg:top-0 lg:self-start">
        <div class="text-pink-300">${renderSilhouette(character, stageIdx, { wide: true })}</div>
        <p class="mt-2 text-center text-sm font-bold text-amber-100">${e(stage.name)}</p>
        ${stageMeter(character)}
        ${arcHtml}
        ${character.type === 'patient' ? `<p class="mt-2 text-center text-xs text-stone-400">Loyalty ${character.loyalty || 0} · Visits ${character.visits || 0}</p>` : ''}
        ${isDebugMode() ? renderCharacterDebugControls(character.id) : ''}
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

function openWeekSceneModal() {
  const payload = getWeekInterruptScene(gameState);
  if (!payload?.scene) return;

  const { character, scene } = payload;
  openModal(`
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.28em] text-red-200/70">Weekly crisis</p>
        <h2 class="mt-1 text-3xl font-black text-stone-50">${e(scene.title)}</h2>
        <p class="mt-1 text-stone-400">${e(character.name)} · ${gameState.actionPoints} AP remaining</p>
      </div>
    </div>
    <div class="mt-6 rich-copy rounded-3xl border border-amber-100/10 bg-stone-950/30 p-5 text-base leading-8 text-stone-100">
      ${e(scene.opening)}
    </div>
    <div class="mt-5 grid gap-3">
      ${scene.choices
        .map(
          (choice) => `
        <button class="soft-card rounded-2xl p-4 text-left hover:border-amber-200/40" data-action="week-scene-choice" data-choice="${e(choice.id)}">
          <strong class="text-stone-50">${e(choice.label)}</strong>
          ${choice.hint ? `<p class="mt-1 text-xs text-stone-400">${e(choice.hint)}</p>` : ''}
          ${choice.apCost ? `<p class="mt-1 text-xs text-amber-200">${choice.apCost} AP</p>` : ''}
        </button>`,
        )
        .join('')}
    </div>
  `);
}

function openGameOverModal(gameOver = gameState.gameOver) {
  if (!gameOver) return;
  openModal(`
    <div>
      <p class="text-xs uppercase tracking-[0.28em] text-red-200/70">Game over</p>
      <h2 class="mt-2 text-3xl font-black text-stone-50">${e(gameOver.title)}</h2>
      <p class="mt-4 text-lg leading-8 text-stone-300">${e(gameOver.text)}</p>
      <p class="mt-4 text-sm text-stone-500">Week ${gameOver.week || gameState.week}</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <button class="gold-button rounded-2xl px-5 py-3 font-bold" data-action="new-game">Start fresh clinic</button>
        <button class="dark-button rounded-2xl px-5 py-3 font-bold" data-action="close-modal">Review save</button>
      </div>
    </div>
  `);
}

function flushEndWeekModals(resolution) {
  clearModalQueue();
  queueModal(`<div class="resolution-html">${resolution.html}</div>`);
  if (getPendingGroupScene(gameState)) {
    const payload = getPendingGroupScene(gameState);
    queueModal(`<h2 class="text-2xl font-black text-stone-50">Group scene</h2><p class="mt-4 text-stone-200">${e(payload.scene?.title || 'Staff moment')}</p>`);
  }
  if (resolution.ending) {
    queueModal(`<h2 class="text-2xl font-black text-amber-100">${e(resolution.ending.title)}</h2><p class="mt-4 text-stone-200">${resolution.ending.text}</p>`);
  }
  if (resolution.gameOver) {
    queueModal(`<h2 class="text-2xl font-black text-red-200">${e(resolution.gameOver.title)}</h2><p class="mt-4 text-stone-200">${e(resolution.gameOver.text)}</p>`);
  } else if (resolution.weekInterrupt) {
    queueModal(`<p class="text-stone-200">A weekly crisis needs resolution before you continue.</p>`);
  }
  showNextModal(openModal, closeModal);
}

function runEndWeekFlow() {
  const resolution = endWeek(gameState);
  playWeekEnd();
  if (resolution.stageChanges?.length) playStageUp();
  render();
  gameState.pendingStageHighlights = [];
  flushEndWeekModals(resolution);
  saveGame(gameState);
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
    if (action === 'toggle-debug') {
      const next = !isDebugMode();
      setDebugMode(next);
      if (next) {
        activeTab = 'prose-lab';
        generateProseLabText();
      } else if (activeTab === 'prose-lab') {
        activeTab = 'management';
      }
      render();
      showToast(next ? 'Debug mode on — Prose Lab open.' : 'Debug mode off.');
    }
    if (action === 'prose-generate') {
      syncProseLabFromForm();
      generateProseLabText();
      render();
    }
    if (action === 'prose-randomize') {
      syncProseLabFromForm();
      randomizeProseLabVars();
      generateProseLabText();
      render();
    }
    if (action === 'prose-copy-agent') {
      syncProseLabFromForm();
      if (!proseLabState.output) generateProseLabText();
      copyAgentFixPrompt(proseLabState.issueText)
        .then(() => showToast('Copied — paste into Cursor Agent chat (Ctrl+L or Composer).'))
        .catch(() => showToast('Could not copy to clipboard.', 'error'));
    }
    if (action === 'prose-github-issue') {
      syncProseLabFromForm();
      if (!proseLabState.output) generateProseLabText();
      window.open(getGithubIssueUrl(proseLabState.issueText), '_blank', 'noopener');
      showToast('GitHub issue form opened — submit to queue an agent fix.');
    }
    if (action === 'prose-download') {
      syncProseLabFromForm();
      if (!proseLabState.output) generateProseLabText();
      downloadFixRequest(proseLabState.issueText);
      showToast('Fix request downloaded.');
    }
    if (action === 'debug-stage') {
      if (!isDebugMode()) return;
      const character = findCharacter(gameState, target.dataset.id);
      if (!character) return;
      if (target.dataset.target !== undefined) {
        applyDebugStage(character, Number(target.dataset.target));
      } else {
        applyDebugStageBump(character, Number(target.dataset.delta || 1));
      }
      saveGame(gameState);
      render();
      openCharacterModal(character.id, characterModalTab);
      showToast(`${character.name} is now stage ${getStageIndex(character) + 1}.`);
    }
    if (action === 'debug-weight') {
      if (!isDebugMode()) return;
      const character = findCharacter(gameState, target.dataset.id);
      if (!character) return;
      applyDebugWeightBump(character, Number(target.dataset.pounds || 20));
      saveGame(gameState);
      render();
      openCharacterModal(character.id, characterModalTab);
      showToast(`${character.name} now ${Math.round(character.weight)} lb.`);
    }
    if (action === 'debug-reset') {
      if (!isDebugMode()) return;
      const character = findCharacter(gameState, target.dataset.id);
      if (!character) return;
      applyDebugResetWeight(character);
      saveGame(gameState);
      render();
      openCharacterModal(character.id, characterModalTab);
      showToast(`${character.name} reset to baseline weight.`);
    }
    if (action === 'debug-fatten') {
      if (!isDebugMode()) return;
      const count = fattenRoster(gameState, target.dataset.filter, target.dataset.mode);
      saveGame(gameState);
      render();
      showToast(`Debug: updated ${count} characters.`);
    }
    if (action === 'debug-copy-seed') {
      if (!isDebugMode()) return;
      const url = `${window.location.origin}${window.location.pathname}?debug=1&seed=${gameState.rngSeed}`;
      navigator.clipboard?.writeText(url);
      showToast('Seed link copied.');
    }
    if (action === 'tab') {
      playUiClick();
      activeTab = target.dataset.tab;
      if (activeTab === 'prose-lab' && isDebugMode()) generateProseLabText();
      render();
    }
    if (action === 'buy') {
      handleBuy(target.dataset.id);
    }
    if (action === 'open-character') {
      openCharacterModal(target.dataset.id);
    }
    if (action === 'open-visit') {
      playUiClick();
      startPatientVisit(target.dataset.id);
    }
    if (action === 'visit-action') {
      const visit = gameState.activePatientVisit;
      if (!visit) return;
      const result = performVisitAction(gameState, target.dataset.id);
      if (!result.ok) {
        showToast(result.message, 'error');
        return;
      }
      saveGame(gameState);
      render();
      if (result.weighRitual || result.visitComplete) {
        if (result.visitComplete) {
          showToast(result.message, 'success');
          closeModal();
        } else {
          refreshPatientVisitModal();
        }
      } else {
        refreshPatientVisitModal();
      }
      if (result.phase) {
        const phaseLabels = { greeting: 'Arrival', intake: 'Intake', exam: 'Exam', services: 'Services', checkout: 'Checkout' };
        showToast(`Now in ${phaseLabels[result.phase] || result.phase} phase.`, 'success');
      }
      if (gameState.gameOver) openGameOverModal();
    }
    if (action === 'visit-tone-action') {
      const visit = gameState.activePatientVisit;
      if (!visit) return;
      const result = performVisitAction(gameState, target.dataset.id, target.dataset.tone);
      if (!result.ok) {
        showToast(result.message, 'error');
        return;
      }
      saveGame(gameState);
      render();
      if (result.visitComplete) {
        showToast(result.message, 'success');
        closeModal();
      } else if (result.weighRitual) {
        refreshPatientVisitModal();
      } else {
        refreshPatientVisitModal();
      }
      if (gameState.gameOver) openGameOverModal();
    }
    if (action === 'visit-scene-choice') {
      const result = resolveVisitInterrupt(gameState, target.dataset.choice);
      if (!result.ok) {
        showToast(result.message, 'error');
        return;
      }
      saveGame(gameState);
      render();
      refreshPatientVisitModal();
      if (gameState.gameOver) openGameOverModal();
    }
    if (action === 'week-scene-choice') {
      const result = resolveWeekInterrupt(gameState, target.dataset.choice);
      if (!result.ok) {
        showToast(result.message, 'error');
        return;
      }
      saveGame(gameState);
      closeModal();
      render();
      if (gameState.gameOver) {
        openGameOverModal();
      } else {
        showToast('Crisis resolved.', 'success');
      }
    }
    if (action === 'visit-complete') {
      const result = completeVisit(gameState);
      showToast(result.message, result.ok ? 'success' : 'error');
      if (result.ok) {
        saveGame(gameState);
        closeModal();
        render();
      }
    }
    if (action === 'visit-abandon') {
      saveGame(gameState);
      closeModal();
      render();
    }
    if (action === 'character-tab') {
      playUiClick();
      openCharacterModal(target.dataset.id, target.dataset.tab);
    }
    if (action === 'interact') {
      if (target.dataset.interaction === 'arcScene') {
        playUiClick();
        openStaffArcModal(target.dataset.id);
        return;
      }
      handleInteraction(target.dataset.id, target.dataset.interaction);
    }
    if (action === 'arc-choice') {
      playUiClick();
      handleArcChoice(target.dataset.id, target.dataset.choice);
    }
    if (action === 'end-week') {
      if (getWeekInterrupt(gameState)) {
        openWeekSceneModal();
        showToast('Resolve the weekly crisis before ending the week.', 'error');
        return;
      }
      const unvisited = getUnvisitedPatients(gameState);
      const warnings = [];
      if (unvisited.length) {
        warnings.push(
          `${unvisited.length} patient${unvisited.length === 1 ? '' : 's'} still need a visit (${unvisited.map((p) => p.name).join(', ')}). Reputation will drop.`,
        );
      }
      if (gameState.activePatientVisit) {
        warnings.push('An in-progress visit will be abandoned.');
      }
      const apNudge =
        gameState.actionPoints > 0
          ? `<p class="mt-2 text-sm text-amber-200">${gameState.actionPoints} action point${gameState.actionPoints === 1 ? '' : 's'} unspent.</p>`
          : '';
      const confirmMsg = `${warnings.join(' ')}${apNudge}<br><br>End the week anyway?`;
      const proceed = () => runEndWeekFlow();
      if (warnings.length || gameState.actionPoints > 0) {
        openConfirmModal(confirmMsg, proceed, openModal);
        return;
      }
      runEndWeekFlow();
    }
    if (action === 'weigh-chart') {
      const result = applyWeighChartChoice(gameState, target.dataset.choice);
      if (!result.ok) {
        showToast(result.message, 'error');
        return;
      }
      if (result.visitComplete) {
        showToast(result.message, 'success');
        closeModal();
      } else {
        saveGame(gameState);
        refreshPatientVisitModal();
      }
      render();
    }
    if (action === 'dismiss-onboarding') {
      if (!gameState.gameSettings) gameState.gameSettings = {};
      gameState.gameSettings.onboardingDismissed = true;
      saveGame(gameState);
      render();
    }
    if (action === 'confirm-yes') {
      handleConfirmYes();
      closeModal();
      render();
    }
    if (action === 'confirm-no') {
      handleConfirmNo();
      closeModal();
    }
    if (action === 'advance-modal-queue') {
      closeModal();
      if (getWeekInterrupt(gameState) && !gameState.gameOver) {
        openWeekSceneModal();
      } else if (getPendingGroupScene(gameState)) {
        openGroupSceneModal(getPendingGroupScene(gameState));
      }
      showNextModal(openModal, closeModal);
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
    if (action === 'hire-candidate') {
      const result = hireCandidate(gameState, target.dataset.id);
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
      openConfirmModal('Start a fresh clinic and overwrite the current autosave?', () => {
        resetGame();
        activeTab = 'management';
        closeModal();
        render();
        showToast('New clinic generated.');
      }, openModal);
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
  initDebugModeFromUrl();
  let loaded = null;
  try {
    loaded = loadGame();
  } catch (error) {
    console.warn('Save could not be loaded, starting fresh.', error);
  }
  const urlSeed = Number(new URLSearchParams(window.location.search).get('seed'));
  if (!loaded && Number.isFinite(urlSeed) && urlSeed > 0) {
    resetGame({ seed: urlSeed });
  }
  initAudio(gameState);
  bindEvents();
  if (gameState.week === 1 && !gameState.patients.length) {
    activeTab = 'interact';
  }
  render();
  if (gameState.activePatientVisit) {
    activeTab = 'interact';
    render();
    setTimeout(() => startPatientVisit(gameState.activePatientVisit.patientId), 50);
  }
  if (needsChallengePick(gameState)) {
    activeTab = 'campaign';
    render();
  }
  if (isGameOver(gameState)) {
    setTimeout(() => openGameOverModal(), 100);
  } else if (getWeekInterrupt(gameState)) {
    setTimeout(() => openWeekSceneModal(), 200);
  }
}
