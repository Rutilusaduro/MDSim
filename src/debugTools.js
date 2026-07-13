import { getStageIndex, STAGE_MAX, weightForStageIndex } from './characters.js';

/** Snap weight to a representative value for a target stage index (0–11). */
export function applyDebugStage(character, targetStage) {
  const stage = Math.max(0, Math.min(STAGE_MAX, Math.floor(targetStage)));
  character.weight = Math.round(weightForStageIndex(character, stage) * 10) / 10;
  character.lastStage = stage;
  character.indulgence = Math.min(100, Math.max(character.indulgence, stage * 8));
  character.openness = Math.min(100, Math.max(character.openness, stage * 2 + 10));
  character.appetite = Math.min(12, Math.max(character.appetite, 4 + stage * 0.35));
  return character;
}

export function applyDebugStageBump(character, delta = 1) {
  return applyDebugStage(character, getStageIndex(character) + delta);
}

export function applyDebugWeightBump(character, pounds) {
  character.weight = Math.round((character.weight + pounds) * 10) / 10;
  character.indulgence = Math.min(100, character.indulgence + pounds * 0.35);
  character.lastStage = getStageIndex(character);
  return character;
}

export function applyDebugResetWeight(character) {
  character.weight = character.baselineWeight;
  character.lastStage = 0;
  return character;
}

/**
 * @param {'staff' | 'patients' | 'all'} filter
 * @param {'plus_one_stage' | 'plus_three_stages' | 'max_stage' | 'plus_twenty_lb'} mode
 */
export function fattenRoster(state, filter = 'all', mode = 'plus_one_stage') {
  const roster = [];
  if (filter === 'all' || filter === 'staff') roster.push(...state.staff);
  if (filter === 'all' || filter === 'patients') roster.push(...state.patients);

  for (const character of roster) {
    if (mode === 'max_stage') applyDebugStage(character, STAGE_MAX);
    else if (mode === 'plus_three_stages') applyDebugStageBump(character, 3);
    else if (mode === 'plus_twenty_lb') applyDebugWeightBump(character, 20);
    else applyDebugStageBump(character, 1);
  }
  return roster.length;
}

export function renderCharacterDebugControls(characterId) {
  return `
    <div class="mt-4 rounded-2xl border border-pink-400/25 bg-pink-950/40 p-3">
      <p class="text-xs font-bold uppercase tracking-wide text-pink-200">Debug body</p>
      <div class="mt-2 flex flex-wrap gap-1">
        <button class="dark-button rounded-lg px-2 py-1 text-xs font-bold" data-action="debug-stage" data-id="${characterId}" data-delta="1">+1 stage</button>
        <button class="dark-button rounded-lg px-2 py-1 text-xs font-bold" data-action="debug-stage" data-id="${characterId}" data-delta="3">+3 stages</button>
        <button class="gold-button rounded-lg px-2 py-1 text-xs font-bold" data-action="debug-stage" data-id="${characterId}" data-target="${STAGE_MAX}">Max</button>
        <button class="dark-button rounded-lg px-2 py-1 text-xs font-bold" data-action="debug-weight" data-id="${characterId}" data-pounds="20">+20 lb</button>
        <button class="dark-button rounded-lg px-2 py-1 text-xs font-bold" data-action="debug-weight" data-id="${characterId}" data-pounds="50">+50 lb</button>
        <button class="dark-button rounded-lg px-2 py-1 text-xs font-bold opacity-70" data-action="debug-reset" data-id="${characterId}">Reset slim</button>
      </div>
    </div>
  `;
}

export function renderRosterDebugPanel(state = null) {
  const seedRow = state
    ? `<p class="mt-1 text-xs text-stone-400">Run seed <span class="font-mono text-stone-200">${state.rngSeed}</span>
        <button class="dark-button ml-2 rounded-xl px-2 py-1 text-xs font-bold" data-action="debug-copy-seed">Copy seed link</button></p>`
    : '';
  return `
    <div class="soft-card mt-8 rounded-3xl border border-pink-400/25 p-5">
      <p class="text-sm font-bold text-pink-100">Debug body cheats</p>${seedRow}
      <p class="mt-1 text-xs text-stone-400">Instant weight for testing prose and silhouettes. Does not spend AP.</p>
      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <button class="dark-button rounded-2xl px-4 py-3 text-left text-sm font-bold" data-action="debug-fatten" data-filter="staff" data-mode="plus_one_stage">All staff +1 stage</button>
        <button class="dark-button rounded-2xl px-4 py-3 text-left text-sm font-bold" data-action="debug-fatten" data-filter="patients" data-mode="plus_one_stage">All patients +1 stage</button>
        <button class="gold-button rounded-2xl px-4 py-3 text-left text-sm font-bold" data-action="debug-fatten" data-filter="all" data-mode="plus_three_stages">Everyone +3 stages</button>
        <button class="gold-button rounded-2xl px-4 py-3 text-left text-sm font-bold" data-action="debug-fatten" data-filter="all" data-mode="max_stage">Everyone max stage</button>
        <button class="dark-button rounded-2xl px-4 py-3 text-left text-sm font-bold" data-action="debug-fatten" data-filter="all" data-mode="plus_twenty_lb">Everyone +20 lb</button>
      </div>
    </div>
  `;
}
