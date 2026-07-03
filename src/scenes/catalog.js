import { WORLD_DOORWAY_WEDGE, WORLD_DOORWAY_ESCALATED } from './world.js';
import { EXAM_BUTTON_POP, EARLY_JEANS_TIGHT } from './wardrobe.js';
import { RUNG_SCENES } from './rungs.js';
import { MOLE_FLIP_SCENE } from './mole.js';
import { CONFESSION_FIRST_ADMISSION, CONFESSION_MIRROR_MOMENT, WARMING_CONFESSION, WARMING_CONFESSION_HONEST } from './confession.js';
import { EARLY_BRA_STRAP, EARLY_CHAIR_PINCH, EARLY_SCALE_WINCE } from './early.js';

export const SCENE_CATALOG = {
  world_doorway_wedge: WORLD_DOORWAY_WEDGE,
  world_doorway_escalated: WORLD_DOORWAY_ESCALATED,
  exam_button_pop: EXAM_BUTTON_POP,
  early_jeans_tight: EARLY_JEANS_TIGHT,
  ...RUNG_SCENES,
  mole_flip: MOLE_FLIP_SCENE,
  warming_confession: WARMING_CONFESSION,
  warming_confession_honest: WARMING_CONFESSION_HONEST,
  confession_first_admission: CONFESSION_FIRST_ADMISSION,
  confession_mirror_moment: CONFESSION_MIRROR_MOMENT,
  early_bra_strap: EARLY_BRA_STRAP,
  early_chair_pinch: EARLY_CHAIR_PINCH,
  early_scale_wince: EARLY_SCALE_WINCE,
};

export const VISIT_TONE_ACTIONS = ['say_hi', 'offer_water', 'weigh_patient'];

export const VISIT_TONES = [
  { id: 'gentle', label: 'Gentle push', hint: '+trust · +openness' },
  { id: 'clinical', label: 'Clinical cover', hint: '+cover · +trust' },
  { id: 'shameless', label: 'Shameless encourage', hint: '+indulgence · −cover' },
  { id: 'cruel', label: 'Cruel honesty', hint: '+openness · ±trust' },
];
