import { getAttitudeKey, getStageIndex } from './characters.js';

export const STAFF_ARC_TRACKS = {
  'Maya Okafor': {
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
        stageMin: 3,
        title: 'Scrubs in the Locker',
        text: 'She holds up the spare uniform. Too small now. No anger. Just a long look in the mirror and a quiet ask for the next size up. You write the order before she finishes the sentence.',
      },
      {
        id: 2,
        trustMin: 10,
        stageMin: 5,
        title: 'Rounds on a Full Stomach',
        text: 'Maya does rounds slower. Belly forward. Voice warm. Patients flirt with her without meaning to. Afterward she tells you hunger feels like part of the job now. She wants it that way.',
      },
      {
        id: 3,
        trustMin: 11,
        stageMin: 7,
        title: 'Night Shift Feast',
        text: 'Maya closes the clinic alone. You find her at the break table with two trays. "Overtime hazard," she says. She saves you a plate without asking.',
      },
    ],
  },
  'Elena Ruiz': {
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
        stageMin: 3,
        title: 'Chair Test',
        text: 'The new chair creaks when she sits. Elena shifts, adjusts, sits again. She grins. "Guess the warranty team needs me fatter for product testing." The lobby hears. She does not lower her voice.',
      },
      {
        id: 2,
        trustMin: 10,
        stageMin: 5,
        title: 'Greeting With Crumbs',
        text: 'She greets every patient with a smile and a faint smear of pastry at the lip. Hips wide against the desk. She tells you the desk feels smaller. She likes the pressure.',
      },
      {
        id: 3,
        trustMin: 11,
        stageMin: 7,
        title: 'Desk as Stage',
        text: 'Elena poses at the desk for a staff photo. Belly forward. Hips wide. She posts it before you approve. Patients book faster.',
      },
    ],
  },
  'Priya Shah': {
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
        stageMin: 3,
        title: 'Lab Coat Pull',
        text: 'The coat catches at the hip. She leaves it open. Under the scrubs, softness shows clear. She catches you looking. "Better than hiding it," she says. No shame in her voice.',
      },
      {
        id: 2,
        trustMin: 10,
        stageMin: 5,
        title: 'Second Opinion',
        text: 'Priya asks for a private weigh-in. Not for the chart. For her. She steps off the scale and exhales. "Keep going," she says. "I want to see what my body does when nobody stops it."',
      },
      {
        id: 3,
        trustMin: 11,
        stageMin: 7,
        title: 'Published Appetite',
        text: 'Priya drafts a comfort-care paper citing her own gain curves. She asks you to co-sign. The chart is honest. The belly in the photo is hers.',
      },
    ],
  },
  'Nadia Volkov': {
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
        stageMin: 3,
        title: 'Closed Door Lunch',
        text: 'She eats behind a closed office door. You knock. She opens with a fork still in hand. Sauce on her chin. "Come in," she says. "I run a clinic that practices what it sells."',
      },
      {
        id: 2,
        trustMin: 10,
        stageMin: 5,
        title: 'Performance Review',
        text: 'Nadia reviews her own waist in the window glass. "Acceptable growth," she mutters. Then louder: "Schedule more catered breaks. I am leading by example." She pats her hip. Hard. Satisfied.',
      },
      {
        id: 3,
        trustMin: 11,
        stageMin: 7,
        title: 'Budget Victory Lap',
        text: 'Nadia triples the snack line again. No vote. She eats a slice of cake at the staff meeting while announcing it. Nobody objects.',
      },
    ],
  },
  'Jasmine Brooks': {
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
        stageMin: 3,
        title: 'Stool Wobble',
        text: 'The phlebotomy stool groans. Jasmine freezes, then giggles. "Buy a bigger one or buy me dinner. Same difference." She stays seated until the break ends.',
      },
      {
        id: 2,
        trustMin: 10,
        stageMin: 5,
        title: 'After Shift',
        text: 'She finds you before clock-out. Belly soft against the counter. Voice low. "I used to skip meals on lab days. Now I plan them." She asks what you are serving tomorrow. She already knows the answer.',
      },
      {
        id: 3,
        trustMin: 11,
        stageMin: 7,
        title: 'Last Draw, First Bite',
        text: 'Jasmine finishes her last blood draw and walks straight to the donut box. She offers you the biggest one. "Lab reward," she says. "Clinical necessity."',
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
    title: 'Full Belly Confidence',
    text: (name) =>
      `${name} tells you hunger feels like part of the job now. Belly forward. Voice warm. She wants the clinic to keep pace with her.`,
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
  return STAFF_ARC_TRACKS[character.name] || buildProceduralArc(character);
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

export function advanceArc(character, state) {
  const check = canAdvanceArc(character);
  if (!check.ok) return check;
  if (!character.arc) character.arc = { completedBeats: [] };
  character.arc.completedBeats.push(check.beat.id);
  character.trust += 0.5;
  character.openness += 4;
  character.weeklyMomentum += 1.2;
  character.indulgence += 3;
  if (state?.stats) state.stats.arcBeatsCompleted = (state.stats.arcBeatsCompleted || 0) + 1;
  return { ok: true, beat: check.beat, text: check.beat.text };
}

export function getArcScenePreview(character) {
  const progress = getArcProgress(character);
  if (!progress?.nextBeat) return '';
  return progress.nextBeat.text.slice(0, 120) + '…';
}
