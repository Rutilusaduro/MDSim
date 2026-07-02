import { getStageIndex, getAttitudeKey } from './characters.js';
import { getPatientFramingTier } from './patientFraming.js';

export const MINDSET_LABELS = {
  slim: 'Still believes the dryer',
  denial: 'Must be swelling',
  curiosity: 'Hungry and curious',
  complicity: 'Knows what she comes for',
  devoted: 'Feed me until…',
};

export function getMindset(character) {
  const stage = getStageIndex(character);
  const attitude = getAttitudeKey(character);
  const indulgence = character.indulgence || 0;
  const openness = character.openness || 0;

  if (attitude === 'immobile' || attitude === 'blob' || indulgence >= 70 || stage >= 9) {
    return 'devoted';
  }
  if (indulgence >= 40 || openness >= 50 || attitude === 'indulgent' || attitude === 'devoted') {
    return 'complicity';
  }
  if (stage >= 3 || attitude === 'hungry' || openness >= 25) {
    return 'curiosity';
  }
  if (stage >= 2 || openness >= 12) {
    return 'denial';
  }
  return 'slim';
}

export function mindsetRank(mindset) {
  const order = ['slim', 'denial', 'curiosity', 'complicity', 'devoted'];
  return order.indexOf(mindset);
}

export function meetsMindsetMin(character, minMindset) {
  if (!minMindset) return true;
  return mindsetRank(getMindset(character)) >= mindsetRank(minMindset);
}

export function getCharacterRouteLabel(character) {
  const flags = [
    ...(character.scenes?.flags || []),
    ...(character.arc?.flags || []),
  ];
  if (flags.includes('patient_plan_adjusted')) return 'Gorging plan convert';
  if (flags.includes('patient_scale_truth')) return 'Honest numbers';
  if (flags.includes('patient_scale_lie')) return 'PCP cover story';
  if (flags.includes('char_wedge_push_helped') || flags.includes('patient_wedge_push_helped')) {
    return 'Hands-on care';
  }
  if (flags.includes('patient_button_praised')) return 'Praised the pop';
  if (flags.includes('global_doorway_widened')) return 'Widened the frame';
  const route = flags.find((f) => f.endsWith('_route'));
  if (route) return route.replace(/_/g, ' ').replace(' route', '');
  return null;
}
