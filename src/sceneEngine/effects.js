import { addWeekNote } from '../state.js';
import { applyFramingErosion } from '../patientFraming.js';
import { checkAuditGameOver } from '../gameOver.js';
import { setCharFlag, setGlobalFlag } from './flags.js';

export function applySceneEffects(state, character, effects = {}, meta = {}) {
  if (!effects) return;

  if (effects.trust) {
    character.trust = Math.round((character.trust + effects.trust) * 100) / 100;
  }
  if (effects.openness) {
    character.openness = Math.min(100, character.openness + effects.openness);
  }
  if (effects.indulgence) {
    character.indulgence = Math.min(100, character.indulgence + effects.indulgence);
  }
  if (effects.appetite) {
    character.appetite = Math.round((character.appetite + effects.appetite) * 100) / 100;
  }
  if (effects.weight) {
    character.weight = Math.round((character.weight + effects.weight) * 10) / 10;
  }
  if (effects.money && state) {
    state.money += effects.money;
  }
  if (effects.reputation && state) {
    state.reputation = Math.max(0, state.reputation + effects.reputation);
  }
  if (effects.coverRating && state) {
    state.coverRating = Math.max(0, Math.min(100, state.coverRating + effects.coverRating));
    checkAuditGameOver(state);
  }
  if (effects.heat && state) {
    state.heat = Math.max(0, Math.min(100, (state.heat || 0) + effects.heat));
    if (effects.heat > 0) {
      state.coverRating = Math.max(0, (state.coverRating || 100) - Math.floor(effects.heat / 3));
      checkAuditGameOver(state);
    }
  }
  if (effects.framingErosion) {
    applyFramingErosion(character, effects.framingErosion);
  }
  if (effects.moleLoyalty && character.isMole) {
    character.moleLoyalty = (character.moleLoyalty || 0) + effects.moleLoyalty;
  }
  if (effects.slimMindset === false) {
    character.slimMindset = false;
  }

  const flags = effects.setsFlags || meta.setsFlags || [];
  for (const flag of flags) {
    if (flag.startsWith('global:')) {
      setGlobalFlag(state, flag.slice(7));
    } else {
      setCharFlag(character, flag);
    }
  }

  if (state?.stats && meta.sceneId) {
    state.stats.scenesResolved = (state.stats.scenesResolved || 0) + 1;
    if (meta.sceneId === 'exam_button_pop') {
      state.stats.wardrobeEvents = (state.stats.wardrobeEvents || 0) + 1;
    }
  }
}

export function recordSceneNote(state, title, text, choiceId) {
  addWeekNote(
    {
      type: 'scene',
      title,
      text,
      choiceId,
    },
    state,
  );
}
