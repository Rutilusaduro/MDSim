import { buyManagementItem, computeClinicEffects, getClinicRating, getItem, shopItems } from './clinic.js';
import { describeCharacter, getStageInfo, weightStageNames } from './characters.js';
import { endWeek, findCharacter, getInteractionOptions, performInteraction } from './events.js';
import { formatMoney, gameState, loadGame, resetGame, saveGame } from './state.js';

let activeTab = 'management';
let toastTimer = null;

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
  return `
    <article class="soft-card cursor-pointer rounded-3xl p-4 transition duration-200" data-action="open-character" data-id="${e(character.id)}">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.22em] text-amber-200/70">${isPatient ? 'Patient' : e(character.role)}</p>
          <h3 class="mt-1 text-lg font-semibold text-stone-50">${e(character.name)}</h3>
          <p class="text-sm text-stone-300">${e(stage.bodyType)} - ${Math.round(character.weight)} lb</p>
        </div>
        <span class="rounded-full bg-pink-500/15 px-3 py-1 text-xs text-pink-100">${e(stage.name)}</span>
      </div>
      ${stageMeter(character, true)}
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
          <p class="text-xs text-stone-300">${e(getClinicRating(state))}</p>
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
    ['interact', 'Interact'],
    ['log', 'Log / This Week'],
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
        <h2 class="mt-2 text-3xl font-black text-stone-50">Shape the clinic before the week resolves</h2>
        <p class="mt-2 max-w-3xl text-stone-300">Purchases are free of AP. Furniture installs at the end of the week; compounds and campaigns apply immediately.</p>
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
  const disabled = owned || pending || state.money < item.cost;
  const status = owned ? 'Owned' : pending ? 'Installing' : formatMoney(item.cost);
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
      <button class="mt-5 rounded-2xl px-4 py-3 font-bold transition ${disabled ? 'dark-button' : 'gold-button hover:scale-[1.01]'}" data-action="buy" data-id="${e(item.id)}" ${disabled ? 'disabled' : ''}>
        ${owned ? 'Installed' : pending ? 'Arrives End Week' : `Buy - ${formatMoney(item.cost)}`}
      </button>
    </article>
  `;
}

function renderInteract(state) {
  return `
    <section>
      <div class="mb-5">
        <p class="text-sm uppercase tracking-[0.28em] text-amber-200/70">Action phase</p>
        <h2 class="mt-2 text-3xl font-black text-stone-50">Spend AP on intimate care</h2>
        <p class="mt-2 max-w-3xl text-stone-300">Every interaction changes trust, appetite, weekly momentum, and how openly each adult participant embraces softness.</p>
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

function renderLog(state) {
  const notes = state.thisWeek.length
    ? state.thisWeek
    : [{ title: 'No actions yet', text: 'The week is waiting for your careful, generous direction.' }];
  return `
    <section>
      <div class="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm uppercase tracking-[0.28em] text-amber-200/70">Narrative feed</p>
          <h2 class="mt-2 text-3xl font-black text-stone-50">This Week</h2>
        </div>
        <div class="flex gap-3">
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
      : activeTab === 'interact'
        ? renderInteract(state)
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

function openCharacterModal(id) {
  const character = findCharacter(gameState, id);
  if (!character) return;
  const stage = getStageInfo(character);
  const options = getInteractionOptions(gameState, character);
  openModal(`
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.28em] text-amber-200/70">${e(character.type)} profile</p>
        <h2 class="mt-1 text-3xl font-black text-stone-50">${e(character.name)}</h2>
        <p class="mt-1 text-stone-300">${e(character.role)} - ${e(stage.bodyType)} - ${Math.round(character.weight)} lb</p>
      </div>
      <button class="dark-button rounded-2xl px-4 py-2 font-bold" data-action="close-modal">Close</button>
    </div>
    <div class="mt-6 grid gap-6 lg:grid-cols-[1fr_18rem]">
      <div class="rich-copy rounded-3xl border border-amber-100/10 bg-stone-950/30 p-5">
        ${describeCharacter(character)}
      </div>
      <aside class="soft-card rounded-3xl p-5">
        <p class="text-sm font-bold text-amber-100">${e(stage.name)}</p>
        ${stageMeter(character)}
        <div class="mt-5 space-y-3 text-sm text-stone-300">
          <div class="flex justify-between"><span>Appetite</span><strong>${character.appetite.toFixed(1)}</strong></div>
          <div class="flex justify-between"><span>Trust</span><strong>${character.trust.toFixed(1)}</strong></div>
          <div class="flex justify-between"><span>Openness</span><strong>${Math.round(character.openness)}</strong></div>
          <div class="flex justify-between"><span>Indulgence</span><strong>${Math.round(character.indulgence)}</strong></div>
          <div class="flex justify-between"><span>Momentum</span><strong>${character.weeklyMomentum.toFixed(1)}</strong></div>
        </div>
        <p class="mt-5 rounded-2xl bg-emerald-300/10 p-3 text-xs leading-5 text-emerald-100">${e(character.consent)}</p>
      </aside>
    </div>
    <div class="mt-6">
      <h3 class="text-xl font-bold text-amber-100">Choose interaction <span class="text-sm font-normal text-stone-400">(${gameState.actionPoints} AP remaining)</span></h3>
      <div class="mt-4 grid gap-3 md:grid-cols-2">
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
  `);
}

function openResolutionModal(resolution) {
  openModal(`
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.28em] text-pink-200/70">End of week resolution</p>
        <h2 class="mt-1 text-3xl font-black text-stone-50">Week ${resolution.week} settles into softness</h2>
      </div>
      <button class="dark-button rounded-2xl px-4 py-2 font-bold" data-action="close-modal">Close</button>
    </div>
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
  if (result.ok) saveGame(gameState);
  render();
}

function handleInteraction(characterId, actionId) {
  const result = performInteraction(gameState, characterId, actionId);
  showToast(result.ok ? 'Interaction recorded.' : result.message, result.ok ? 'success' : 'error');
  if (result.ok) {
    saveGame(gameState);
    render();
    openCharacterModal(characterId);
  }
}

function bindEvents() {
  document.addEventListener('click', (event) => {
    const modalCard = event.target.closest('[data-modal-card]');
    if (modalCard) event.stopPropagation();
    const target = event.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    if (action === 'tab') {
      activeTab = target.dataset.tab;
      render();
    }
    if (action === 'buy') {
      handleBuy(target.dataset.id);
    }
    if (action === 'open-character') {
      openCharacterModal(target.dataset.id);
    }
    if (action === 'interact') {
      handleInteraction(target.dataset.id, target.dataset.interaction);
    }
    if (action === 'end-week') {
      const resolution = endWeek(gameState);
      render();
      openResolutionModal(resolution);
    }
    if (action === 'close-modal') {
      closeModal();
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
}

export function initUI() {
  try {
    loadGame();
  } catch (error) {
    console.warn('Save could not be loaded, starting fresh.', error);
  }
  bindEvents();
  render();
}
