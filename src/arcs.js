import { getAttitudeKey, getStageIndex } from './characters.js';
import { spendActionPoint, addWeekNote } from './state.js';
import { formatArcSceneNote, getStaffArcScene, applyChoiceFlags, getRouteLabel } from './staffArcs/index.js';

export { getRouteLabel };

export const STAFF_ARC_TRACKS = {
  maya: {
    title: 'The Nurse Who Stayed Late',
    beats: [
      {
        id: 0,
        trustMin: 5,
        stageMin: 0,
        title: 'First Overtime Snack',
        text: 'Maya stays after close. You find her at the break table with a foil tray she claims was "leftover inventory." She laughs when you sit down. The talk stays professional. The food does not.',
      },
      {
        id: 1,
        trustMin: 8,
        stageMin: 4,
        title: 'Scrubs in the Locker',
        text: 'She holds up the spare uniform. Too small now. No anger. Just a long look in the mirror and a quiet ask for the next size up. You write the order before she finishes the sentence.',
      },
      {
        id: 2,
        trustMin: 10,
        stageMin: 6,
        title: 'Rounds on a Full Stomach',
        text: 'Maya does rounds slower. Belly forward. Voice warm. Patients flirt with her without meaning to. Afterward she tells you hunger feels like part of the job now. She wants it that way.',
      },
      {
        id: 3,
        trustMin: 10,
        stageMin: 6,
        title: 'The Break Room Offer',
        text: 'Maya asks you to stay after close. Food, honesty, and a question about whether you like watching her grow.',
      },
      {
        id: 4,
        trustMin: 11,
        stageMin: 7,
        title: 'Night Shift Feast',
        text: 'Maya closes the clinic alone. Trays, locked doors, and an ending that depends on how you got here.',
      },
    ],
  },
  elena: {
    title: 'Front Desk Appetite',
    beats: [
      {
        id: 0,
        trustMin: 5,
        stageMin: 0,
        title: 'The Candy Bowl',
        text: 'Elena refills the lobby bowl twice before noon. She blames the morning rush. Her fingers stay dusted with sugar. She does not wipe them off.',
      },
      {
        id: 1,
        trustMin: 8,
        stageMin: 4,
        title: 'Chair Test',
        text: 'The new chair creaks when she sits. Elena shifts, adjusts, sits again. She grins. "Guess the warranty team needs me fatter for product testing." The lobby hears. She does not lower her voice.',
      },
      {
        id: 2,
        trustMin: 10,
        stageMin: 6,
        title: 'Greeting With Crumbs',
        text: 'She greets every patient with a smile and a faint smear of pastry at the lip. Hips wide against the desk. She tells you the desk feels smaller. She likes the pressure.',
      },
      {
        id: 3,
        trustMin: 10,
        stageMin: 6,
        title: 'Feeding at the Desk',
        text: 'Elena wants you at the front desk after hours. Hips on the counter, appetite on display.',
      },
      {
        id: 4,
        trustMin: 11,
        stageMin: 7,
        title: 'Desk as Stage',
        text: 'Elena poses for the clinic page, belly forward, unapologetic. Patients book faster.',
      },
    ],
  },
  priya: {
    title: 'Clinical Curves',
    beats: [
      {
        id: 0,
        trustMin: 5,
        stageMin: 0,
        title: 'Chart Notes',
        text: 'Priya adds a personal note to her own file: appetite elevated, sleep improved, mood stable. She shows you the screen like evidence. "Document everything," she says. "Even the good parts."',
      },
      {
        id: 1,
        trustMin: 8,
        stageMin: 4,
        title: 'Lab Coat Pull',
        text: 'The coat catches at the hip. She leaves it open. Under the scrubs, softness shows clear. She catches you looking. "Better than hiding it," she says. No shame in her voice.',
      },
      {
        id: 2,
        trustMin: 10,
        stageMin: 6,
        title: 'Second Opinion',
        text: 'Priya asks for a private weigh-in. Not for the chart. For her. She steps off the scale and exhales. "Keep going," she says. "I want to see what my body does when nobody stops it."',
      },
      {
        id: 3,
        trustMin: 10,
        stageMin: 6,
        title: 'Private Consult',
        text: 'Priya asks for a private exam room. Charting stops. Honesty starts.',
      },
      {
        id: 4,
        trustMin: 11,
        stageMin: 7,
        title: 'Published Appetite',
        text: 'Priya drafts a gluttony-care paper citing her own gain curves. She asks you to co-sign.',
      },
    ],
  },
  nadia: {
    title: 'Manager on a Meal Plan',
    beats: [
      {
        id: 0,
        trustMin: 5,
        stageMin: 0,
        title: 'Budget Line Item',
        text: 'Nadia slides a spreadsheet across your desk. Snack budget tripled. "Staff retention," she says. Her pen taps the column. Her other hand rests on her middle. Casual. Possessive.',
      },
      {
        id: 1,
        trustMin: 8,
        stageMin: 4,
        title: 'Closed Door Lunch',
        text: 'She eats behind a closed office door. You knock. She opens with a fork still in hand. Sauce on her chin. "Come in," she says. "I run a clinic that practices what it sells."',
      },
      {
        id: 2,
        trustMin: 10,
        stageMin: 6,
        title: 'Performance Review',
        text: 'Nadia reviews her own waist in the window glass. "Acceptable growth," she mutters. Then louder: "Schedule more catered breaks. I am leading by example." She pats her hip. Hard. Satisfied.',
      },
      {
        id: 3,
        trustMin: 10,
        stageMin: 6,
        title: 'Closed Door Dinner',
        text: 'Nadia locks the office. Fork in hand. A question about power, appetite, and your eyes on her.',
      },
      {
        id: 4,
        trustMin: 11,
        stageMin: 7,
        title: 'Budget Victory Lap',
        text: 'Nadia triples the snack line at the staff meeting. Cake in hand. Nobody objects.',
      },
    ],
  },
  jasmine: {
    title: 'Needle and Dough',
    beats: [
      {
        id: 0,
        trustMin: 5,
        stageMin: 0,
        title: 'Blood Draw Reward',
        text: 'Jasmine finishes a draw and reaches for the staff donut box without washing her hands first. She catches herself. Shrugs. Eats anyway. "Sterile enough," she says.',
      },
      {
        id: 1,
        trustMin: 8,
        stageMin: 4,
        title: 'Stool Wobble',
        text: 'The phlebotomy stool groans. Jasmine freezes, then giggles. "Buy a bigger one or buy me dinner. Same difference." She stays seated until the break ends.',
      },
      {
        id: 2,
        trustMin: 10,
        stageMin: 6,
        title: 'After Shift',
        text: 'She finds you before clock-out. Belly soft against the counter. Voice low. "I used to skip meals on lab days. Now I plan them." She asks what you are serving tomorrow. She already knows the answer.',
      },
      {
        id: 3,
        trustMin: 10,
        stageMin: 6,
        title: 'After the Last Draw',
        text: 'Jasmine finds you before clock-out. Donuts, hunger, and a confession about lab days.',
      },
      {
        id: 4,
        trustMin: 11,
        stageMin: 7,
        title: 'Last Draw, First Bite',
        text: 'Jasmine finishes her last blood draw and walks straight to the donut box.',
      },
    ],
  },
};

const PROCEDURAL_BEAT_TEMPLATES = [
  {
    trustMin: 5,
    stageMin: 0,
    title: 'After Hours',
    text: (name) =>
      `${name} stays late without being asked. A snack tray appears. She eats while finishing charts. Nobody mentions the crumbs.`,
  },
  {
    trustMin: 7,
    stageMin: 2,
    title: 'Uniform Reality',
    text: (name) =>
      `${name} holds up scrubs that fit last month. She orders the next size without shame. You approve before she finishes the sentence.`,
  },
  {
    trustMin: 9,
    stageMin: 4,
    title: 'Break Room Regular',
    text: (name) =>
      `${name} claims the best couch spot. Trays find her. She laughs when the seat groans. She does not move.`,
  },
  {
    trustMin: 10,
    stageMin: 6,
    title: 'Hunger Confession',
    text: (name) =>
      `${name} asks if the clinic can keep pace with her appetite. Her hand rests on her middle while she waits for an answer.`,
  },
  {
    trustMin: 11,
    stageMin: 7,
    title: 'After-Close Feast',
    text: (name) =>
      `${name} waits after close with trays and a smile that says she knows exactly what she wants from you and from dinner.`,
  },
];

export function buildProceduralArc(character) {
  const first = character.name.split(' ')[0];
  return {
    title: `${first}'s Appetite Arc`,
    beats: PROCEDURAL_BEAT_TEMPLATES.map((t, id) => ({
      id,
      trustMin: t.trustMin,
      stageMin: t.stageMin,
      title: t.title,
      text: t.text(character.name),
    })),
  };
}

export function getArcTrack(character) {
  if (character.type !== 'staff') return null;
  const key = character.arcSlot || legacyArcKeyForName(character.name);
  return STAFF_ARC_TRACKS[key] || buildProceduralArc(character);
}

function legacyArcKeyForName(name) {
  const map = {
    'Maya Okafor': 'maya',
    'Elena Ruiz': 'elena',
    'Priya Shah': 'priya',
    'Nadia Volkov': 'nadia',
    'Jasmine Brooks': 'jasmine',
  };
  return map[name] || null;
}

export function getArcProgress(character) {
  const track = getArcTrack(character);
  if (!track) return null;
  const completed = character.arc?.completedBeats || [];
  const nextBeat = track.beats.find((b) => !completed.includes(b.id));
  return {
    track,
    completed: completed.length,
    total: track.beats.length,
    nextBeat,
    done: completed.length >= track.beats.length,
  };
}

export function canAdvanceArc(character) {
  const progress = getArcProgress(character);
  if (!progress || progress.done || !progress.nextBeat) return { ok: false, reason: 'Arc complete or unavailable.' };
  const beat = progress.nextBeat;
  if (character.trust < beat.trustMin) return { ok: false, reason: `Need trust ${beat.trustMin}+` };
  if (getStageIndex(character) < beat.stageMin) return { ok: false, reason: `Need stage ${beat.stageMin + 1}+` };
  return { ok: true, beat };
}

export function advanceArc(character, state, choiceId) {
  const check = canAdvanceArc(character);
  if (!check.ok) return check;

  const scene = getStaffArcScene(character, check.beat);
  if (!scene) return { ok: false, reason: 'Arc scene unavailable.' };

  const choice = scene.choices.find((item) => item.id === choiceId);
  if (!choice) return { ok: false, reason: 'Unknown choice.' };

  if (state && !spendActionPoint(state)) {
    return { ok: false, reason: 'No action points remain.' };
  }

  if (!character.arc) character.arc = { completedBeats: [], choices: {}, flags: [] };
  character.arc.completedBeats.push(check.beat.id);
  character.arc.choices[check.beat.id] = choiceId;
  applyChoiceFlags(character, choice);

  character.trust = Math.round((character.trust + 0.5 + (choice.effects?.trust || 0)) * 100) / 100;
  character.openness = Math.min(100, character.openness + 4 + (choice.effects?.openness || 0));
  character.weeklyMomentum += 1.2 + (choice.effects?.weeklyMomentum || 0);
  character.indulgence = Math.min(100, character.indulgence + 3 + (choice.effects?.indulgence || 0));

  if (choice.effects?.weight) {
    character.weight = Math.round((character.weight + choice.effects.weight) * 10) / 10;
  }
  if (choice.effects?.appetite) {
    character.appetite = Math.round((character.appetite + choice.effects.appetite) * 100) / 100;
  }
  if (choice.effects?.money && state) {
    state.money += choice.effects.money;
  }
  if (choice.effects?.reputation && state) {
    state.reputation += choice.effects.reputation;
  }

  if (state?.stats) state.stats.arcBeatsCompleted = (state.stats.arcBeatsCompleted || 0) + 1;

  const noteText = formatArcSceneNote(scene.opening, choice.outcome);
  if (state) {
    addWeekNote(
      {
        type: 'arc',
        title: `Arc: ${character.name}: ${check.beat.title}`,
        text: noteText,
      },
      state,
    );
  }

  return {
    ok: true,
    beat: check.beat,
    choice,
    opening: scene.opening,
    text: choice.outcome,
    epilogue: scene.epilogue || '',
    message: choice.outcome,
  };
}

export function getArcSceneForCharacter(character) {
  const check = canAdvanceArc(character);
  if (!check.ok) return { ok: false, reason: check.reason };
  const scene = getStaffArcScene(character, check.beat);
  if (!scene) return { ok: false, reason: 'Arc scene unavailable.' };
  return { ok: true, beat: check.beat, scene, progress: getArcProgress(character) };
}

