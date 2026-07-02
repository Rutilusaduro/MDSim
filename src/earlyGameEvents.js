import { addWeekNote } from './state.js';
import { sceneResolved } from './sceneEngine/flags.js';

const EARLY_GAIN_EVENTS = [
  {
    id: 'jeans_tight',
    minGain: 6,
    maxGain: 22,
    title: 'Jeans Too Tight',
    text: (name) =>
      `${name} tugged at her waistband after lunch and the button held by a thread. She blamed the dryer, then ate another roll while the seam complained.`,
  },
  {
    id: 'button_pop',
    minGain: 14,
    maxGain: 38,
    title: 'Button Gives Up',
    text: (name) =>
      `${name} reached for a chart and a blouse button popped off, pinged off the counter, and rolled under the scale. She stared at it, laughed once, and kept chewing.`,
  },
  {
    id: 'bra_strap',
    minGain: 10,
    maxGain: 30,
    title: 'Bra Strap Digs In',
    text: (name) =>
      `${name} adjusted her bra strap twice during intake and left red lines on her shoulders. "Must be swelling," she said, already reaching for the snack tray.`,
  },
  {
    id: 'old_photo',
    minGain: 18,
    maxGain: 55,
    title: 'ID Photo Shock',
    text: (name) =>
      `${name} compared her badge photo to the mirror and went quiet. The face was thinner. The hips were not. She tucked the badge away and asked what was for lunch.`,
  },
  {
    id: 'chair_pinch',
    minGain: 24,
    maxGain: 70,
    title: 'Chair Arms Pinch',
    text: (name) =>
      `${name} sat down and the chair arms bit into her sides. She wiggled, sighed, and stayed seated. "I used to fit," she muttered, and took another bite.`,
  },
  {
    id: 'scale_wince',
    minGain: 30,
    maxGain: 90,
    title: 'Scale Number Wince',
    text: (name) =>
      `${name} stepped on the scale for a routine weigh-in and winced at the number. She asked if the clinic had a nutrition handout, then ate the sample muffin anyway.`,
  },
  {
    id: 'diet_talk',
    minGain: 40,
    maxGain: 120,
    title: 'Diet Talk, Second Plate',
    text: (name) =>
      `${name} said she should cut back this week while loading a second plate. Her voice meant it. Her hands did not. Staff wrote "appetite elevated" and said nothing.`,
  },
  {
    id: 'zipper_stuck',
    minGain: 50,
    maxGain: 150,
    title: 'Skirt Zipper Stuck',
    text: (name) =>
      `${name} fought her skirt zipper before a patient room visit and gave up halfway. She wore it crooked, cheeks pink, and blamed the humidity while her thighs rubbed walking the hall.`,
  },
];

function gainFromBaseline(character) {
  return Math.max(0, character.weight - (character.baselineWeight || character.weight));
}

export function fireEarlyGainEvents(state, rng) {
  const fired = [];
  const roster = [...state.staff, ...state.patients];

  for (const character of roster) {
    const gain = gainFromBaseline(character);
    if (gain < 6 || gain > 200) continue;
    if (!character.earlyEventsFired) character.earlyEventsFired = [];

    const pool = EARLY_GAIN_EVENTS.filter((ev) => {
      if (character.earlyEventsFired.includes(ev.id)) return false;
      if (ev.id === 'jeans_tight' && sceneResolved(state, character, 'early_jeans_tight')) return false;
      return gain >= ev.minGain && gain <= ev.maxGain;
    });
    if (!pool.length || !rng.chance(18 + gain / 8)) continue;

    const event = rng.pick(pool);
    character.earlyEventsFired.push(event.id);
    const text = event.text(character.name);
    fired.push({ title: event.title, text, character: character.name });
    character.openness = Math.min(100, character.openness + 1.5);
    character.indulgence = Math.min(100, character.indulgence + 1);
    addWeekNote({ type: 'early_gain', title: `${event.title}: ${character.name}`, text }, state);
    if (state.stats) state.stats.earlyGainEvents = (state.stats.earlyGainEvents || 0) + 1;
  }

  return fired;
}
