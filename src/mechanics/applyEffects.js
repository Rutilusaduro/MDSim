import { bumpLoyalty } from '../characters.js';
import { applyFramingErosion } from '../patientFraming.js';
import { checkAuditGameOver } from '../gameOver.js';
import { setCharFlag, setGlobalFlag } from '../sceneEngine/flags.js';

const HEAT_COVER_DIVISOR = 3;

/**
 * Unified stat mutator for visits, tones, and scenes.
 * @param {object} state
 * @param {object|null} character
 * @param {object} effects
 * @param {object} meta - { setsFlags, sceneId, framingScale, consultBonus }
 */
export function applyCharacterEffects(state, character, effects = {}, meta = {}) {
  if (!effects) return;

  const framingScale = meta.framingScale ?? 1;

  if (effects.trust && character) {
    character.trust = Math.round((character.trust + effects.trust) * 100) / 100;
  }
  if (effects.openness && character) {
    character.openness = Math.min(100, character.openness + effects.openness);
  }
  if (effects.indulgence && character) {
    character.indulgence = Math.min(100, character.indulgence + effects.indulgence);
  }
  if (effects.appetite && character) {
    character.appetite = Math.round((character.appetite + effects.appetite) * 100) / 100;
  }
  if (effects.weight && character) {
    character.weight = Math.round((character.weight + effects.weight) * 10) / 10;
  }
  if (effects.weeklyMomentum && character) {
    character.weeklyMomentum += effects.weeklyMomentum;
  }
  if (effects.loyalty && character) {
    bumpLoyalty(character, effects.loyalty);
  }

  if (effects.money && state) {
    state.money += effects.money;
    if (meta.consultIncome) {
      state.weekConsultIncome = (state.weekConsultIncome || 0) + effects.money;
    }
  }
  if (effects.reputation && state) {
    const bonus = meta.reputationBonus || 0;
    state.reputation += effects.reputation + bonus;
  }
  if (effects.coverRating && state) {
    state.coverRating = Math.max(0, Math.min(100, (state.coverRating ?? 100) + effects.coverRating));
    checkAuditGameOver(state);
  }
  if (effects.heat && state) {
    const heatDelta = Math.round(effects.heat * framingScale * 10) / 10;
    state.heat = Math.max(0, Math.min(100, (state.heat || 0) + heatDelta));
    if (heatDelta > 0 && state.coverRating != null) {
      state.coverRating = Math.max(0, state.coverRating - Math.floor(heatDelta / HEAT_COVER_DIVISOR));
      checkAuditGameOver(state);
    }
  }
  if (effects.framingErosion && character) {
    applyFramingErosion(character, effects.framingErosion);
  }
  if (effects.moleLoyalty && character?.isMole) {
    character.moleLoyalty = (character.moleLoyalty || 0) + effects.moleLoyalty;
  }
  if (effects.slimMindset === false && character) {
    character.slimMindset = false;
  }

  const flags = effects.setsFlags || meta.setsFlags || [];
  for (const flag of flags) {
    if (flag.startsWith('global:')) {
      setGlobalFlag(state, flag.slice(7));
    } else if (character) {
      setCharFlag(character, flag, state);
    }
  }

  if (state?.stats && meta.sceneId) {
    state.stats.scenesResolved = (state.stats.scenesResolved || 0) + 1;
    if (meta.sceneId === 'exam_button_pop') {
      state.stats.wardrobeEvents = (state.stats.wardrobeEvents || 0) + 1;
    }
  }
}

export { HEAT_COVER_DIVISOR };
