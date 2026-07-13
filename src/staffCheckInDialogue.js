import { getAttitudeKey } from './characters.js';
import { tierFromAttitude } from './mechanics/attitudeTier.js';
import { getStageIndex } from './characters.js';
import { pickSeen } from './proseSelect.js';

function pickLine(state, character, poolId, pool) {
  return pickSeen(state, character?.id || 'world', poolId, pool) || null;
}

const STAFF_CHECK_IN = {
  early: [
    {
      doctor: 'You ask how her shift is going and whether anything on the floor needs your eyes.',
      staff:
        'Busy but manageable. Vitals backlog cleared. One chair in room three creaks when patients sit — might be worth a note for maintenance.',
    },
    {
      doctor: 'You check in after rounds and ask if she had time to eat today.',
      staff:
        'Half a granola bar between patients. I will hit the break room when the board calms down. Thank you for asking.',
    },
    {
      doctor: 'You ask whether the new schedule is working or if she is stretched too thin.',
      staff:
        'It is fine for now. Thursdays run long. If we keep double-booking afternoons, I will need help at checkout.',
    },
    {
      doctor: 'You ask what is on her mind outside the patient list.',
      staff:
        'Honestly, sleep. I have been up late charting. Nothing clinical — just tired. I will catch up this weekend.',
    },
  ],
  mid: [
    {
      doctor: 'You pull her aside and ask how she is holding up — really holding up.',
      staff:
        'Scrubs are tighter than last month. I blame the break room pastries and I am not sorry about it. Hunger hits mid-shift now.',
    },
    {
      doctor: 'You ask whether she feels supported on the floor or if something is wearing on her.',
      staff:
        'Supported, mostly. I eat when I can. Patients flirt with me without meaning to. I pretend not to notice my uniform straining.',
    },
    {
      doctor: 'You ask what would make her shifts easier this week.',
      staff:
        'A stool that does not wobble. Five minutes to finish a tray without someone paging me. That would help.',
    },
  ],
  late: [
    {
      doctor: 'You ask what she wants from this job now that the clinic feels different than when she started.',
      staff:
        'Honesty? I want to keep growing here. The trays, the schedule, the way you look at me when I take seconds. I want all of it.',
    },
    {
      doctor: 'You ask whether she is still comfortable on the floor or if she needs something changed.',
      staff:
        'Comfortable is the wrong word. Happy, maybe. I like how soft I am getting. Do not schedule me on diet week. There is no diet week.',
    },
  ],
};

const MOLE_CHECK_IN = [
  {
    doctor: 'You ask how she is doing with the Annex pressure and whether anyone followed up.',
    staff:
      'They called twice. I let it go to voicemail. If they want me, they can find me here — fed, loyal, and not stupid.',
  },
  {
    doctor: 'You check in quietly and ask what she needs to stay steady this week.',
    staff:
      'Discretion. A full tray before their next check-in call. I will keep your name out of their reports if you keep mine off their scale.',
  },
];

export function getStaffCheckInBeat(character, state = null) {
  if (character.isMole && character.moleRevealed) {
    return pickLine(state, character, 'staff.checkin.mole', MOLE_CHECK_IN);
  }
  const attitude = getAttitudeKey(character);
  const tier = tierFromAttitude(attitude);
  const stage = getStageIndex(character);
  let pool = STAFF_CHECK_IN.early;
  let poolId = 'staff.checkin.early';
  if (tier === 'late' || stage >= 6) {
    pool = STAFF_CHECK_IN.late;
    poolId = 'staff.checkin.late';
  } else if (tier === 'mid' || stage >= 3) {
    pool = STAFF_CHECK_IN.mid;
    poolId = 'staff.checkin.mid';
  }
  return pickLine(state, character, poolId, pool);
}

export function formatStaffCheckInDialogue(character, beat) {
  if (!beat) return '';
  const name = character.name.split(' ')[0];
  return `${beat.doctor}\n\n${name}: "${beat.staff}"`;
}
