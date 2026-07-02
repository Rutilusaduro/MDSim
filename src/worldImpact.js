import { getStageIndex, isBlobStage, isImmobileStage, STAGE_MAX } from './characters.js';
import { addWeekNote } from './state.js';

export const MOBILITY_LABELS = {
  mobile: 'Mobile',
  heavy: 'Heavy gait',
  lumbering: 'Lumbering',
  waddling: 'Waddling',
  assisted: 'Needs assistance',
  immobile: 'Immobile',
  blob: 'Bedbound mass',
};

export function getMobilityTier(character) {
  const stage = getStageIndex(character);
  if (isBlobStage(stage)) return 'blob';
  if (isImmobileStage(stage)) return 'immobile';
  if (stage >= 8) return 'waddling';
  if (stage >= 6) return 'lumbering';
  if (stage >= 4) return 'heavy';
  if (stage >= 2) return 'mobile';
  return 'mobile';
}

export function getMobilityLabel(character) {
  return MOBILITY_LABELS[getMobilityTier(character)] || MOBILITY_LABELS.mobile;
}

export function rosterMobilitySummary(state) {
  const all = [...state.staff, ...state.patients];
  const immobile = all.filter((c) => isImmobileStage(getStageIndex(c)));
  const blob = all.filter((c) => isBlobStage(getStageIndex(c)));
  const outgrowing = all.filter((c) => {
    const s = getStageIndex(c);
    return s >= 6 && s < 10;
  });
  return { immobile, blob, outgrowing, total: all.length };
}

const WORLD_IMPACT_EVENTS = [
  {
    id: 'chair_collapse',
    minStage: 6,
    scope: 'any',
    title: 'Chair Collapse',
    text: (name) =>
      `${name} sat down and the chair gave up. Wood cracked. Staff brought a reinforced seat before she could apologize. She stayed seated through the swap, belly spilling over both armrests, and asked for a snack while she waited.`,
    effect: (state, character) => {
      character.indulgence = Math.min(100, character.indulgence + 2);
      state.reputation += 1;
    },
  },
  {
    id: 'doorway_wedge',
    minStage: 7,
    scope: 'any',
    title: 'Doorway Wedge',
    text: (name) =>
      `${name} stuck in the supply doorway, hips caught, belly pressed to the frame. Two staff pushed while she laughed breathless. The doorframe got scraped. Maintenance billed it as wear.`,
    effect: (character) => {
      character.openness = Math.min(100, character.openness + 3);
      character.indulgence = Math.min(100, character.indulgence + 2);
    },
  },
  {
    id: 'scale_error',
    minStage: 8,
    scope: 'any',
    title: 'Scale Overload',
    text: (name) =>
      `The clinic scale error-lit under ${name} and shut down. She stepped off slow, thighs rubbing, and asked for a second tray. "Numbers later," she said. "I'm still hungry."`,
    effect: (character) => {
      character.appetite = Math.round((character.appetite + 0.2) * 100) / 100;
      character.trust += 0.15;
    },
  },
  {
    id: 'immobile_patient',
    minStage: 10,
    scope: 'patient',
    title: 'Home Visit Required',
    text: (name) =>
      `${name} no-showed because she could not stand. You sent a mobile cart and found her filling the couch, remote in one hand, delivery bags at her feet. She gorged while you took notes and booked a widened exam room for next week.`,
    effect: (state, character) => {
      character.trust += 0.25;
      character.visits = (character.visits || 0) + 1;
      character.seenThisWeek = true;
      state.money -= 40;
    },
  },
  {
    id: 'blob_staff',
    minStage: 11,
    scope: 'staff',
    title: 'Break Room Overhaul',
    text: (name) =>
      `${name} cannot leave the reinforced break couch. Staff now bring trays to her. She eats continuously between charts, a soft mass under blankets, and productivity somehow rose. The clinic ordered a wider hallway.`,
    effect: (state, character) => {
      character.indulgence = Math.min(100, character.indulgence + 4);
      character.weeklyMomentum += 0.5;
      state.money -= 120;
      state.reputation += 2;
    },
  },
  {
    id: 'feeding_riot',
    minStage: 5,
    scope: 'staff',
    minCount: 2,
    title: 'Snack Line Stampede',
    text: () =>
      `Two staff hit the vending wall at once and emptied it. Crumbs on scrubs. Belts strained. Nobody regretted it. You doubled the order and watched waistlines swell together.`,
    effect: (state, characters) => {
      characters.forEach((c) => {
        c.weight = Math.round((c.weight + 0.6) * 10) / 10;
        c.indulgence = Math.min(100, c.indulgence + 3);
      });
    },
  },
];

export function fireWorldImpactEvents(state, rng) {
  const fired = [];
  const candidates = [...state.staff, ...state.patients].filter((c) => getStageIndex(c) >= 5);
  if (!candidates.length) return fired;

  if (rng.chance(22 + state.week)) {
    const heavyStaff = state.staff.filter((c) => getStageIndex(c) >= 5);
    if (heavyStaff.length >= 2 && rng.chance(40)) {
      const event = WORLD_IMPACT_EVENTS.find((e) => e.id === 'feeding_riot');
      event.effect(state, heavyStaff.slice(0, 2));
      fired.push({ title: event.title, text: event.text() });
      addWeekNote({ type: 'world', title: event.title, text: event.text() }, state);
      return fired;
    }
  }

  const pick = rng.pick(candidates);
  const stage = getStageIndex(pick);
  const pool = WORLD_IMPACT_EVENTS.filter((ev) => {
    if (stage < ev.minStage) return false;
    if (ev.scope === 'patient' && pick.type !== 'patient') return false;
    if (ev.scope === 'staff' && pick.type !== 'staff') return false;
    return true;
  });
  if (!pool.length || !rng.chance(28 + stage * 2)) return fired;

  const event = rng.pick(pool);
  const text = event.text(pick.name);
  if (event.id === 'feeding_riot') event.effect(state, [pick]);
  else event.effect(state, pick);
  fired.push({ title: event.title, text, character: pick.name });
  addWeekNote({ type: 'world', title: `${event.title}: ${pick.name}`, text }, state);
  if (state.stats) state.stats.worldImpactEvents = (state.stats.worldImpactEvents || 0) + 1;
  return fired;
}

export function visitMobilityWarning(patient) {
  if (isBlobStage(getStageIndex(patient))) {
    return 'Bedbound. Bring the feeding cart. Weighing is estimate only.';
  }
  if (isImmobileStage(getStageIndex(patient))) {
    return 'Immobile. Visit at the widened lounge couch. Expect long feeding.';
  }
  if (getStageIndex(patient) >= 7) {
    return 'Too wide for standard exam chairs. Use reinforced furniture.';
  }
  return null;
}
