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
    effect: (state, rng) => {
      state.staff.forEach((s) => {
        s.weight += 0.4 + rng.next() * 0.6;
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
    effect: (state, rng) => {
      [...state.staff, ...state.patients].forEach((c) => {
        c.weight += 0.2 + rng.next() * 0.4;
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
    effect: (state, rng) => {
      state.staff.forEach((s) => {
        s.weight += 0.3 + rng.next() * 0.5;
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
    effect: (state, rng) => {
      state.staff.forEach((s) => {
        s.weight += 0.7 + rng.next() * 0.4;
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
    effect: (state, rng) => {
      [...state.staff, ...state.patients].forEach((c) => {
        if (rng.next() > 0.4) c.weight += 0.35;
      });
    },
  },
];

export const ALL_WEEKLY_EVENTS = [...WEEKLY_EVENTS, ...V3_WEEKLY_EVENTS];

export const WARDROBE_EVENTS = [
  {
    id: 'button_strain',
    stageMin: 3,
    text: 'A button holds on by a single thread during rounds, then surrenders with a soft pop against her swelling middle. She pins it shut, laughs it off, and orders lunch anyway.',
  },
  {
    id: 'seam_split',
    stageMin: 4,
    text: 'A side seam whispers apart when she lowers herself into the chair, the fabric no longer able to hold what she has been growing. She drapes a cardigan over it. The cardigan gaps too.',
  },
  {
    id: 'new_scrubs',
    stageMin: 5,
    text: 'She sizes up her scrubs again, two notches this time. They fit for now, straining over the fresh softness, and she is already circling the next size on the catalog with a grin.',
  },
  {
    id: 'zip_fail',
    stageMin: 6,
    text: 'A skirt zip climbs halfway and stalls against the spread of her hips. She waits in the break room, unhurried, until someone fetches a stretch waistband built to keep pace with her.',
  },
  {
    id: 'uniform_upgrade',
    stageMin: 7,
    text: 'A reinforced uniform arrives, cut wide with panels made for a body that keeps outgrowing everything. She fills it out completely by the end of her shift. Worth every dollar.',
  },
  {
    id: 'custom_fit',
    stageMin: 8,
    text: 'She asks for a custom fit. The tailor measures twice, exhales at the numbers, and lets out the pattern generously. She pats her belly and says the only words that matter: room to grow.',
  },
  {
    id: 'chair_reinforce',
    stageMin: 9,
    text: 'The standard break room chair groans and buckles the moment she settles her spreading weight onto it. Maintenance rolls in a reinforced bench, bolted to the floor, and she claims it as hers before the day is out.',
  },
  {
    id: 'wheelchair_arrival',
    stageMin: 9,
    text: 'Walking the halls has become a slow, breathless ordeal, so a wide-frame wheelchair arrives with her name on the back. She sinks into it gratefully, hands already reaching for the snack tray tucked beside the armrest.',
  },
  {
    id: 'widened_door',
    stageMin: 10,
    text: 'Her doorway gets torn out and rebuilt a full foot wider, because her body no longer fits through the frame she once breezed past. Contractors work around her while she eats, immobile and unbothered, filling the room a little more each hour.',
  },
  {
    id: 'home_feeding_visit',
    stageMin: 10,
    text: 'Too vast to travel, she takes her feeding at home now. Staff arrive with loaded carts and stay for hours, spooning course after course into a soft, spreading mass that has stopped pretending it will ever leave the couch.',
  },
];

export const RELATIONSHIP_BEATS = [
  {
    id: 'maya_elena_admire',
    title: 'Desk and Nurse',
    pairArcSlots: ['maya', 'elena'],
    minWeek: 4,
    text: 'The receptionist tells the nurse her hips look expensive. The nurse blushes. They split a pastry after. Both gain that night.',
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
    pairArcSlots: ['priya', 'nadia'],
    minWeek: 6,
    text: 'The manager brags about her lunch log. The PA beats the number by dessert. Quiet competition. Loud results.',
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
    pairArcSlots: ['jasmine', 'maya'],
    minWeek: 5,
    text: 'The phlebotomist watches the nurse take the last tray slot. "Fine," she says. "I will take two plates instead." She does.',
    effect: (state, chars) => {
      const j = chars.find((c) => c.arcSlot === 'jasmine');
      if (j) j.weight += 1.0;
      chars.forEach((c) => (c.weeklyMomentum += 0.3));
    },
  },
  {
    id: 'staff_group',
    title: 'After-Shift Order',
    pairArcSlots: ['elena', 'nadia', 'jasmine'],
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
    let chars;
    if (beat.pairArcSlots?.length) {
      chars = beat.pairArcSlots
        .map((slot) => state.staff.find((s) => s.arcSlot === slot))
        .filter(Boolean);
      if (chars.length < beat.pairArcSlots.length) continue;
    } else if (beat.pair?.length) {
      chars = beat.pair
        .map((name) => state.staff.find((s) => s.name === name))
        .filter(Boolean);
      if (chars.length < beat.pair.length) continue;
    } else {
      continue;
    }
    beat.effect(state, chars);
    state.firedEvents.push(beat.id);
    recordRelationshipBeat(state, { ...beat, pair: chars.map((c) => c.name) });
    if (state.stats) state.stats.relationshipBeats = (state.stats.relationshipBeats || 0) + 1;
    return { beat, chars };
  }
  return null;
}
