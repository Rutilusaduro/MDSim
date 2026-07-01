import { getStageIndex } from './characters.js';
import { recordRelationshipBeat } from './relationships.js';
import { V3_RELATIONSHIP_BEATS, V3_WEEKLY_EVENTS, getActiveSeasonalWeek } from './v3WeeklyContent.js';
import { getChallenge } from './challenges.js';

export const WEEKLY_EVENTS = [
  {
    id: 'break_feast',
    title: 'Break Room Feast',
    weight: 1,
    minUpgrades: 0,
    text: 'Someone brings a casserole chain to the break room. Staff stay an extra twenty minutes. Plates empty. Belts suffer.',
    effect: (state) => {
      state.staff.forEach((s) => {
        s.weight += 0.4 + Math.random() * 0.6;
        s.weeklyMomentum += 0.3;
      });
    },
  },
  {
    id: 'vending_run',
    title: 'Vending Wall Rush',
    weight: 1,
    requiresUpgrade: 'wellness-vending-wall',
    text: 'The vending wall sells out by two p.m. Shakes and bars. Nobody admits who bought the last row.',
    effect: (state) => {
      [...state.staff, ...state.patients].forEach((c) => {
        c.weight += 0.2 + Math.random() * 0.4;
      });
    },
  },
  {
    id: 'compliment_cascade',
    title: 'Compliment at the Desk',
    weight: 1,
    minUpgrades: 0,
    text: 'A patient tells Elena she looks "healthy and happy." Elena repeats the line twice. She orders lunch with extra sides.',
    effect: (state) => {
      const elena = state.staff.find((s) => s.name.includes('Elena')) || state.staff[0];
      if (elena) {
        elena.weight += 0.6;
        elena.openness += 3;
        elena.indulgence += 2;
      }
    },
  },
  {
    id: 'hunger_spiral',
    title: 'Hunger Spiral',
    weight: 1,
    minUpgrades: 0,
    text: 'Half the roster reports "weird hunger" by midweek. Snack drawers empty. The clinic smells like bread.',
    effect: (state) => {
      state.staff.forEach((s) => {
        s.appetite += 0.15;
        s.weeklyMomentum += 0.4;
      });
    },
  },
  {
    id: 'late_delivery',
    title: 'Late Supply Delivery',
    weight: 0.8,
    minUpgrades: 0,
    text: 'A supply crate arrives with bonus sample packs. Rich. Dense. Mislabeled as "fiber trial." Gone by morning.',
    effect: (state) => {
      state.patients.forEach((p) => {
        if (p.seenThisWeek) p.weight += 0.5;
      });
    },
  },
  {
    id: 'staff_lunch_run',
    title: 'Staff Lunch Run',
    weight: 1,
    minUpgrades: 0,
    text: 'Two staff go out for "salads." They return with bags that smell like fried oil. No salads visible.',
    effect: (state) => {
      state.staff.forEach((s) => {
        s.weight += 0.3 + Math.random() * 0.5;
        s.trust += 0.1;
      });
    },
  },
  {
    id: 'patient_referral',
    title: 'Word of Mouth',
    weight: 0.9,
    minUpgrades: 0,
    text: 'A patient tells a friend the clinic "gets it." Reputation ticks up without ad spend.',
    effect: (state) => {
      state.reputation += 2;
    },
  },
  {
    id: 'scale_shock',
    title: 'Break Room Scale',
    weight: 0.7,
    minUpgrades: 0,
    text: 'Someone leaves a scale in the break room. Numbers get whispered. Denial lasts an hour. Then snack runs double.',
    effect: (state) => {
      state.staff.forEach((s) => {
        s.openness += 1.5;
        s.weeklyMomentum += 0.25;
      });
    },
  },
  {
    id: 'group_snack',
    title: 'Group Snack Huddle',
    weight: 1,
    requiresUpgrade: 'plush-breakroom-couch',
    text: 'Staff pile onto the plush couch with a shared tray. Laughter. Crumbs. Nobody leaves until the tray is clean.',
    effect: (state) => {
      state.staff.forEach((s) => {
        s.weight += 0.7 + Math.random() * 0.4;
        s.indulgence += 1;
      });
    },
  },
  {
    id: 'recovery_nook',
    title: 'Nook Sessions',
    weight: 0.9,
    requiresUpgrade: 'private-recovery-nook',
    text: 'The recovery nook stays booked. Dim lights. Warm cabinets. Consults run long. Waistbands pay the price.',
    effect: (state) => {
      [...state.staff, ...state.patients].forEach((c) => {
        if (Math.random() > 0.4) c.weight += 0.35;
      });
    },
  },
];

export const ALL_WEEKLY_EVENTS = [...WEEKLY_EVENTS, ...V3_WEEKLY_EVENTS];

export const WARDROBE_EVENTS = [
  {
    id: 'button_strain',
    stageMin: 3,
    text: 'A button holds on by thread during rounds. She fixes it with a safety pin. Laughs. Eats lunch anyway.',
  },
  {
    id: 'seam_split',
    stageMin: 4,
    text: 'A side seam whispers apart when she sits. She covers it with a cardigan. The cardigan gaps too.',
  },
  {
    id: 'new_scrubs',
    stageMin: 5,
    text: 'She orders scrubs one size up. They fit. For now. She already eyes the next size on the catalog.',
  },
  {
    id: 'zip_fail',
    stageMin: 6,
    text: 'A skirt zip stops halfway. She stays in the break room until someone brings a stretch waist option.',
  },
  {
    id: 'uniform_upgrade',
    stageMin: 7,
    text: 'Clinic uniform upgrade arrives. Reinforced seams. She fills it by end of shift. Worth every dollar.',
  },
  {
    id: 'custom_fit',
    stageMin: 8,
    text: 'She asks for custom fit. Measurements taken twice. The tailor exhales. She grins. "Room to grow."',
  },
];

export const RELATIONSHIP_BEATS = [
  {
    id: 'maya_elena_admire',
    title: 'Desk and Nurse',
    pair: ['Maya Okafor', 'Elena Ruiz'],
    minWeek: 4,
    text: 'Elena tells Maya her hips look "expensive." Maya blushes. They split a pastry after. Both gain that night.',
    effect: (state, chars) => {
      chars.forEach((c) => {
        c.weight += 0.5;
        c.openness += 2;
      });
    },
  },
  {
    id: 'priya_nadia_rival',
    title: 'Spreadsheet vs Scale',
    pair: ['Priya Shah', 'Nadia Volkov'],
    minWeek: 6,
    text: 'Nadia brags about her lunch log. Priya beats the number by dessert. Quiet competition. Loud results.',
    effect: (state, chars) => {
      chars.forEach((c) => {
        c.weight += 0.8;
        c.indulgence += 2;
      });
    },
  },
  {
    id: 'jasmine_maya_jealous',
    title: 'Break Room Split',
    pair: ['Jasmine Brooks', 'Maya Okafor'],
    minWeek: 5,
    text: 'Jasmine watches Maya take the last tray slot. "Fine," she says. "I will take two plates instead." She does.',
    effect: (state, chars) => {
      const j = chars.find((c) => c.name.includes('Jasmine'));
      if (j) j.weight += 1.0;
      chars.forEach((c) => (c.weeklyMomentum += 0.3));
    },
  },
  {
    id: 'staff_group',
    title: 'After-Shift Order',
    pair: ['Elena Ruiz', 'Nadia Volkov', 'Jasmine Brooks'],
    minWeek: 8,
    text: 'Three staff order delivery to the break room. One app. Six entrees. They eat until the couch groans.',
    effect: (state, chars) => {
      chars.forEach((c) => {
        c.weight += 1.2;
        c.indulgence += 3;
      });
    },
  },
  ...V3_RELATIONSHIP_BEATS,
];

export function pickWeeklyEvent(state, rng) {
  const owned = state.ownedUpgrades || [];
  const seasonal = getActiveSeasonalWeek(state);
  const pool = ALL_WEEKLY_EVENTS.filter((ev) => {
    if (ev.requiresUpgrade && !owned.includes(ev.requiresUpgrade)) return false;
    if (ev.minWeek && state.week < ev.minWeek) return false;
    return true;
  });
  if (!pool.length) return null;

  const weighted = pool.map((ev) => {
    let w = ev.weight;
    const challenge = getChallenge(state.challengeWeek);
    if (seasonal && ev.seasonal === seasonal.eventBoost) w *= 2;
    if (challenge?.eventBoost?.(ev)) w *= 2;
    if (state.challengeWeek === 'quiet') w *= 0.65;
    return { ev, w };
  });
  const total = weighted.reduce((s, e) => s + e.w, 0);
  let roll = rng.next() * total;
  for (const { ev, w } of weighted) {
    roll -= w;
    if (roll <= 0) return ev;
  }
  return weighted[weighted.length - 1].ev;
}

export function fireWardrobeEvents(state, rng) {
  const fired = [];
  const all = [...state.staff, ...state.patients];
  const challenge = getChallenge(state.challengeWeek);
  const wardrobeChance = 0.22 * (challenge?.wardrobeMult || 1);
  for (const character of all) {
    const stage = getStageIndex(character);
    for (const ev of WARDROBE_EVENTS) {
      if (stage < ev.stageMin) continue;
      const key = `wardrobe_${ev.id}_${character.id}`;
      if (state.firedEvents?.includes(key)) continue;
      if (rng.next() > wardrobeChance) continue;
      fired.push({ character, ...ev, key });
      character.openness += 2;
      character.weeklyMomentum += 0.35;
      if (state.stats) state.stats.wardrobeEvents = (state.stats.wardrobeEvents || 0) + 1;
      break;
    }
  }
  return fired;
}

export function fireRelationshipBeat(state, rng) {
  if (!state.firedEvents) state.firedEvents = [];
  for (const beat of RELATIONSHIP_BEATS) {
    if (state.firedEvents.includes(beat.id)) continue;
    if (state.week < beat.minWeek) continue;
    if (rng.next() > 0.35) continue;
    const chars = beat.pair
      .map((name) => state.staff.find((s) => s.name === name))
      .filter(Boolean);
    if (chars.length < beat.pair.length) continue;
    beat.effect(state, chars);
    state.firedEvents.push(beat.id);
    recordRelationshipBeat(state, beat);
    if (state.stats) state.stats.relationshipBeats = (state.stats.relationshipBeats || 0) + 1;
    return { beat, chars };
  }
  return null;
}
