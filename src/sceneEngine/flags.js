import { recordLedger } from '../memoryLedger.js';

export function ensureSceneState(state) {
  if (!state.sceneState) {
    state.sceneState = { resolved: [], weekInterrupt: null };
  }
  if (!state.globalFlags) state.globalFlags = [];
  if (state.coverRating == null) state.coverRating = 100;
  if (state.heat == null) state.heat = 0;
}

export function ensureCharacterScenes(character) {
  if (!character.scenes) {
    character.scenes = { flags: [], choices: {}, resolved: [] };
  }
  if (!character.scenes.flags) character.scenes.flags = [];
  if (!character.scenes.choices) character.scenes.choices = {};
  if (!character.scenes.resolved) character.scenes.resolved = [];
  if (character.framingErosion == null) character.framingErosion = 0;
}

export function charFlag(character, key) {
  ensureCharacterScenes(character);
  return character.scenes.flags.includes(key);
}

export function setCharFlag(character, key, state = null) {
  ensureCharacterScenes(character);
  if (!character.scenes.flags.includes(key)) {
    character.scenes.flags.push(key);
    if (state) recordLedger(state, { id: flagKeyToLedgerId(key), characterId: character.id });
  }
}

export function globalFlag(state, key) {
  ensureSceneState(state);
  return state.globalFlags.includes(key);
}

export function setGlobalFlag(state, key) {
  ensureSceneState(state);
  if (!state.globalFlags.includes(key)) {
    state.globalFlags.push(key);
    recordLedger(state, { id: flagKeyToLedgerId(key), characterId: null });
  }
}

function flagKeyToLedgerId(key) {
  return `flag:${key}`;
}

export function sceneResolved(state, character, sceneId) {
  ensureSceneState(state);
  ensureCharacterScenes(character);
  const key = `${sceneId}:${character.id}`;
  return state.sceneState.resolved.includes(key) || character.scenes.resolved.includes(sceneId);
}

export function markSceneResolved(state, character, sceneId) {
  ensureSceneState(state);
  ensureCharacterScenes(character);
  const key = `${sceneId}:${character.id}`;
  if (!state.sceneState.resolved.includes(key)) state.sceneState.resolved.push(key);
  if (!character.scenes.resolved.includes(sceneId)) character.scenes.resolved.push(sceneId);
}
