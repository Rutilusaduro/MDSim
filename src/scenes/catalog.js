import { WORLD_DOORWAY_WEDGE, WORLD_DOORWAY_ESCALATED } from './world.js';
import { EXAM_BUTTON_POP, EARLY_JEANS_TIGHT } from './wardrobe.js';

export const SCENE_CATALOG = {
  world_doorway_wedge: WORLD_DOORWAY_WEDGE,
  world_doorway_escalated: WORLD_DOORWAY_ESCALATED,
  exam_button_pop: EXAM_BUTTON_POP,
  early_jeans_tight: EARLY_JEANS_TIGHT,
};

export const VISIT_TONE_ACTIONS = ['say_hi', 'offer_water', 'weigh_patient'];

export const VISIT_TONES = [
  { id: 'gentle', label: 'Gentle push', hint: '+trust · +openness' },
  { id: 'clinical', label: 'Clinical cover', hint: '+cover · +trust' },
  { id: 'shameless', label: 'Shameless encourage', hint: '+indulgence · −cover' },
  { id: 'cruel', label: 'Cruel honesty', hint: '+openness · ±trust' },
];
