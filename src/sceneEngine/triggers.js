import { gainFromBaseline } from './helpers.js';
import { getStageIndex } from '../characters.js';
import { getMobilityTier } from '../worldImpact.js';
import { sceneResolved, globalFlag } from './flags.js';
import { SCENE_CATALOG } from '../scenes/catalog.js';

export { gainFromBaseline };

export function checkVisitInterrupt(state, patient, actionId) {
  if (actionId === 'weigh_patient' || actionId === 'review_symptoms') {
    const gain = gainFromBaseline(patient);
    if (gain >= 14 && gain <= 45 && !sceneResolved(state, patient, 'exam_button_pop')) {
      return { sceneId: 'exam_button_pop', trigger: actionId };
    }
  }
  if (actionId === 'review_chart' || actionId === 'say_hi') {
    const stage = getStageIndex(patient);
    const mobility = getMobilityTier(patient);
    if (
      stage >= 7 &&
      ['waddling', 'assisted', 'immobile', 'blob'].includes(mobility) &&
      !globalFlag(state, 'global_doorway_widened') &&
      !sceneResolved(state, patient, 'world_doorway_wedge')
    ) {
      return { sceneId: 'world_doorway_wedge', trigger: actionId };
    }
  }
  return null;
}

export function pickWeeklyInteractiveScene(state, character, rng) {
  const gain = gainFromBaseline(character);
  const candidates = Object.values(SCENE_CATALOG).filter((scene) => {
    if (scene.scope !== 'weekly') return false;
    if (sceneResolved(state, character, scene.id)) return false;
    if (scene.trigger?.minGain && gain < scene.trigger.minGain) return false;
    if (scene.trigger?.maxGain && gain > scene.trigger.maxGain) return false;
    if (scene.trigger?.minStage && getStageIndex(character) < scene.trigger.minStage) return false;
    if (scene.trigger?.notGlobalFlag && globalFlag(state, scene.trigger.notGlobalFlag)) return false;
    return true;
  });
  if (!candidates.length) return null;
  if (!rng.chance(22 + gain / 10)) return null;
  const scene = rng.pick(candidates);
  return { sceneId: scene.id, characterId: character.id };
}
