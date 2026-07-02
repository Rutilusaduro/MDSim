import { getMindset, meetsMindsetMin } from '../mindset.js';
import {
  charFlag,
  globalFlag,
  sceneResolved,
  markSceneResolved,
  ensureCharacterScenes,
} from './flags.js';
import { applySceneEffects, recordSceneNote } from './effects.js';
import { spendActionPoint } from '../state.js';
import { SCENE_CATALOG } from '../scenes/catalog.js';

function resolveText(value, ctx) {
  if (typeof value === 'function') return value(ctx);
  return value ?? '';
}

function choiceAvailable(ctx, choice) {
  const req = choice.requires;
  if (!req) return true;
  if (req.mindsetMin && !meetsMindsetMin(ctx.character, req.mindsetMin)) return false;
  if (req.trustMin && ctx.character.trust < req.trustMin) return false;
  if (req.staffCount && ctx.state.staff.length < req.staffCount) return false;
  if (req.moneyMin && ctx.state.money < req.moneyMin) return false;
  if (req.flags?.length && !req.flags.every((f) => charFlag(ctx.character, f) || globalFlag(ctx.state, f))) {
    return false;
  }
  if (req.notFlags?.length && req.notFlags.some((f) => charFlag(ctx.character, f) || globalFlag(ctx.state, f))) {
    return false;
  }
  return true;
}

export function buildSceneContext(state, character, extra = {}) {
  ensureCharacterScenes(character);
  return {
    state,
    character,
    firstName: character.name.split(' ')[0],
    mindset: getMindset(character),
    ...extra,
  };
}

export function getSceneDefinition(sceneId) {
  return SCENE_CATALOG[sceneId] || null;
}

export function resolveScene(sceneId, ctx) {
  const raw = getSceneDefinition(sceneId);
  if (!raw) return null;

  const opening = resolveText(raw.opening, ctx);
  const choices = (raw.choices || [])
    .filter((choice) => choiceAvailable(ctx, choice))
    .map((choice) => ({
      ...choice,
      id: choice.id,
      label: resolveText(choice.label, ctx),
      outcome: resolveText(choice.outcome, ctx),
      hint: choice.hint ? resolveText(choice.hint, ctx) : '',
      apCost: choice.apCost || 0,
    }));

  return {
    id: sceneId,
    title: raw.title,
    opening,
    choices,
    epilogue: raw.epilogue ? resolveText(raw.epilogue, ctx) : '',
  };
}

export function applySceneChoice(state, sceneId, choiceId, character, extraCtx = {}) {
  const ctx = buildSceneContext(state, character, extraCtx);
  const scene = resolveScene(sceneId, ctx);
  if (!scene) return { ok: false, message: 'Scene not found.' };

  const choice = scene.choices.find((c) => c.id === choiceId);
  if (!choice) return { ok: false, message: 'Choice unavailable.' };

  if (choice.apCost > 0 && !spendActionPoint(state)) {
    return { ok: false, message: 'No action points remain.' };
  }

  const setsFlags = (choice.setsFlags || []).map((f) =>
    f.replace('{id}', character.id).replace('{char}', character.id),
  );

  applySceneEffects(state, character, choice.effects, { setsFlags, sceneId });
  character.scenes.choices[sceneId] = choiceId;
  markSceneResolved(state, character, sceneId);

  if (choice.enqueueScene) {
    if (!state.sceneState) state.sceneState = { resolved: [], weekInterrupt: null };
    state.sceneState.weekInterrupt = {
      sceneId: choice.enqueueScene,
      characterId: character.id,
    };
  }

  const text = [scene.opening, choice.outcome, scene.epilogue].filter(Boolean).join('\n\n');
  recordSceneNote(state, `${scene.title}: ${character.name}`, text, choiceId);

  return {
    ok: true,
    message: choice.outcome,
    text,
    choice,
    scene,
  };
}

export { resolveScene as resolveSceneForDisplay };
