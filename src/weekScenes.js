import { applySceneChoice, buildSceneContext, resolveScene } from './sceneEngine/index.js';
import { ensureSceneState } from './sceneEngine/flags.js';
import { checkAuditGameOver } from './gameOver.js';

export function getWeekInterrupt(state) {
  ensureSceneState(state);
  return state.sceneState?.weekInterrupt || null;
}

export function getWeekInterruptScene(state) {
  const interrupt = getWeekInterrupt(state);
  if (!interrupt) return null;
  const character = [...state.staff, ...state.patients].find((c) => c.id === interrupt.characterId);
  if (!character) return null;
  const ctx = buildSceneContext(state, character);
  return { character, scene: resolveScene(interrupt.sceneId, ctx) };
}

export function resolveWeekInterrupt(state, choiceId) {
  const interrupt = getWeekInterrupt(state);
  if (!interrupt) return { ok: false, message: 'No weekly crisis.' };

  const character = [...state.staff, ...state.patients].find((c) => c.id === interrupt.characterId);
  if (!character) return { ok: false, message: 'Character not found.' };

  const result = applySceneChoice(state, interrupt.sceneId, choiceId, character);
  if (!result.ok) return result;

  state.sceneState.weekInterrupt = null;
  checkAuditGameOver(state);

  return result;
}

export function setWeekInterrupt(state, sceneId, characterId) {
  ensureSceneState(state);
  state.sceneState.weekInterrupt = { sceneId, characterId };
}
