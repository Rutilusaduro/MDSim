/** Confession scenes: chart-quote crown jewel + supporting beats. */

import { dishonestChartEntries } from '../memoryLedger.js';

const FAMILY_MAP = {
  nurturer: 'nurturing',
  dreamer: 'nurturing',
  perfectionist: 'analytical',
  scholar: 'analytical',
  socialite: 'social',
  patron: 'social',
  vip: 'social',
  foodBlogger: 'social',
  housewifeDonor: 'social',
  rebel: 'defiant',
  rivalSpy: 'defiant',
  rivalDoctor: 'defiant',
  gymDefector: 'defiant',
};

function archetypeFamily(archetype) {
  return FAMILY_MAP[archetype] ?? 'hedonic';
}

function dishonestOpening(ctx) {
  const { firstName, character } = ctx;
  const f = archetypeFamily(character.archetype);

  if (f === 'nurturing') {
    return `${firstName} closed the door before she sat. She smoothed her coat once, the way she does when something costs her. "I went back through the numbers," she says. Soft voice. Steady hands. She has had this planned.`;
  }
  if (f === 'analytical') {
    return `${firstName} placed a folded page on the desk before she sat. No preamble. Three columns: week, scale reading, what the chart says. The gaps are highlighted in yellow. She lets you read it first.`;
  }
  if (f === 'social') {
    return `${firstName} followed you back from the front desk without being asked. "I want to show you something," she says. Her tone is warm and bright. That is exactly the part worth paying attention to.`;
  }
  if (f === 'defiant') {
    return `${firstName} crossed her arms the moment you entered. Not hostile. Defensive, maybe. "I pulled my records," she says. "The patient portal lets you do that now." She did not come here for a fight. She came with evidence.`;
  }
  return `${firstName} was mid-reach for the snack tray when she paused. She set it back down. She turned toward you with the patience of someone who rehearsed staying calm. "I have a question," she says, "about the chart."`;
}

function buildCitationBlock(ctx) {
  const entries = dishonestChartEntries(ctx.state, ctx.character.id);
  if (!entries.length) return '';
  const recent = entries.slice(-Math.min(4, Math.max(2, entries.length)));
  const lines = recent.map((row) => {
    const { kind, excuse, weight, charted } = row.data;
    if (kind === 'fabrication') {
      return `"${excuse || 'fluid retention'}." She reads it flat. "Week ${row.week}. I was ${weight} pounds."`;
    }
    return `"Weight stable." She smiles at that one. "Stable. I'd split a seam that month."`;
  });
  return lines.join(' ');
}

export const WARMING_CONFESSION = {
  id: 'warming_confession',
  title: 'The Chart, Laid Out',
  heatBand: 'charged',
  scope: 'visit',
  requires: { notFlags: ['confession_resolved'] },
  opening: dishonestOpening,
  citationBlock: buildCitationBlock,
  turn: `She is not angry. She kept receipts because she wanted to know if you would keep covering for her.`,
  choices: [
    {
      id: 'own_it',
      label: '"That is on me. The numbers were wrong."',
      hint: '+trust · −cover · resolves',
      apCost: 0,
      setsFlags: ['confession_resolved', 'confession_owned', 'global:global_warming_confession'],
      effects: { trust: 0.5, coverRating: -10, openness: 3, framingErosion: 5 },
      outcome: (ctx) =>
        `${ctx.firstName} holds still a moment. Then her shoulders drop. "Okay," she says. Not forgiveness yet. The first beat of something honest between you.`,
    },
    {
      id: 'clinical_mask',
      label: 'Cite measurement variance; keep clinical register',
      hint: '+cover · −trust · buildup',
      apCost: 0,
      setsFlags: ['confession_masked'],
      effects: { coverRating: 4, trust: -0.4, framingErosion: 12 },
      outcome: (ctx) =>
        `${ctx.firstName} folds the sheet once and tucks it into her bag. "Right," she says. She does not believe you. She will bring more receipts next time.`,
    },
    {
      id: 'turn_it_back',
      label: '"You never raised a concern before."',
      hint: '−trust · −openness · risk',
      apCost: 0,
      setsFlags: ['confession_deflected'],
      effects: { trust: -0.6, openness: -2, framingErosion: 8 },
      outcome: (ctx) =>
        `${ctx.firstName} thanks you for your time, picks up her bag, and leaves with everything she brought. Next visit she brings a friend.`,
    },
    {
      id: 'ask_what_she_wants',
      label: '"What would you like the chart to reflect?"',
      hint: '+openness · +indulgence · complicit shift',
      apCost: 1,
      setsFlags: ['confession_resolved', 'confession_complicit', 'global:global_warming_confession'],
      effects: { openness: 5, indulgence: 3, trust: 0.3, framingErosion: 15, coverRating: -5 },
      outcome: (ctx) =>
        `${ctx.firstName} leans back and thinks with her whole body. "Comfortable," she says. "Just write comfortable." You do. It changes the chart less than it changes the room.`,
    },
  ],
};

export const WARMING_CONFESSION_HONEST = {
  id: 'warming_confession_honest',
  title: 'The Chart, Kept True',
  heatBand: 'warm',
  scope: 'visit',
  requires: { notFlags: ['confession_honest_resolved'] },
  opening: (ctx) => {
    const { firstName } = ctx;
    return `${firstName} caught you reading her prior chart before she sat down. "You always put the real number," she says. No question in it. She drapes her coat over her lap and waits.`;
  },
  choices: [
    {
      id: 'acknowledge',
      label: '"The chart belongs to you, not me."',
      hint: '+trust · +openness',
      apCost: 0,
      setsFlags: ['confession_honest_resolved', 'global:global_warming_confession_honest'],
      effects: { trust: 0.6, openness: 3 },
      outcome: (ctx) =>
        `${ctx.firstName} smiles. A real one. "I appreciate that," she says. She means it fully.`,
    },
    {
      id: 'explain_philosophy',
      label: '"Clinical honesty is the baseline. It is not a favor."',
      hint: '+trust · +cover',
      apCost: 0,
      setsFlags: ['confession_honest_resolved'],
      effects: { trust: 0.4, coverRating: 3, openness: 2 },
      outcome: (ctx) =>
        `${ctx.firstName} nods slowly. She glances at the chart again as if reading it for the first time.`,
    },
    {
      id: 'admit_the_temptation',
      label: '"I have considered otherwise. Comfortable numbers keep patients in the door."',
      hint: '+openness · slow burn',
      apCost: 0,
      setsFlags: ['confession_honest_resolved', 'confession_honest_candid'],
      effects: { openness: 4, trust: 0.3, indulgence: 1, framingErosion: 4 },
      outcome: (ctx) =>
        `"But you did not," ${ctx.firstName} says. That distinction matters to her more than the honesty itself.`,
    },
    {
      id: 'show_her_the_trend',
      label: 'Open the chart and walk through the trend together',
      hint: '+trust · +heat · intimacy',
      apCost: 1,
      setsFlags: ['confession_honest_resolved', 'confession_shared_chart', 'global:global_warming_confession_honest'],
      effects: { trust: 0.5, openness: 3, heat: 4, indulgence: 2 },
      outcome: (ctx) =>
        `Week by week the numbers climb. ${ctx.firstName} leans forward, chin almost at your shoulder. "That is a lot," she says quietly. She does not look away.`,
    },
  ],
};

export const CONFESSION_FIRST_ADMISSION = {
  id: 'confession_first_admission',
  title: 'First Admission',
  scope: 'weekly',
  heatBand: 'warm',
  trigger: { minStage: 2, mindsetMin: 'curiosity' },
  opening: (ctx) => {
    if (ctx.mindset === 'devoted') {
      return `${ctx.firstName} sits in the wide chair and does not bother with the usual opener. "I want you to know I know exactly what I'm doing," she says.`;
    }
    return `Midway through the visit ${ctx.firstName} goes quiet. "I think I've been wanting this," she says, finally. She does not name what all of it means.`;
  },
  choices: [
    {
      id: 'receive_quietly',
      label: 'Listen. Say nothing until she finishes.',
      hint: '+trust · +openness',
      apCost: 0,
      setsFlags: ['confession_received_quiet', 'global:global_patient_confessed'],
      effects: { trust: 0.45, openness: 5, indulgence: 2, framingErosion: 12 },
      outcome: (ctx) =>
        `${ctx.firstName} works through the rest at her own pace. "Thank you for not making it weird," she says.`,
    },
    {
      id: 'confirm_openly',
      label: '"Yes. And that is all right here."',
      hint: '+indulgence · +heat',
      apCost: 0,
      requires: { mindsetMin: 'complicity' },
      setsFlags: ['confession_confirmed', 'global:global_patient_confessed'],
      effects: { indulgence: 6, openness: 6, trust: 0.5, heat: 10, coverRating: -8, framingErosion: 25, slimMindset: false },
      outcome: (ctx) => `${ctx.firstName} exhales. "Okay," she says. The chart stays professional. The room is something else entirely.`,
    },
  ],
};

export const CONFESSION_MIRROR_MOMENT = {
  id: 'confession_mirror_moment',
  title: 'The Mirror Question',
  scope: 'weekly',
  heatBand: 'charged',
  trigger: { minStage: 4, mindsetMin: 'curiosity' },
  opening: (ctx) =>
    `${ctx.firstName} paused at the exam room mirror during intake. She smoothed her blouse over her middle before turning back. "I look different," she said, flat, not asking.`,
  choices: [
    {
      id: 'affirm_change',
      label: '"You do. How does that feel?"',
      hint: '+openness',
      apCost: 0,
      setsFlags: ['mirror_affirmed', 'global:global_mirror_photo_taken'],
      effects: { openness: 5, trust: 0.35, framingErosion: 14, heat: 5 },
      outcome: (ctx) => `"Good," ${ctx.firstName} says eventually. "Actually good."`,
    },
    {
      id: 'mirror_clinical',
      label: 'Explain that weight distribution shifts are normal at this gain range',
      hint: '+cover',
      apCost: 0,
      setsFlags: ['mirror_clinical'],
      effects: { coverRating: 5, trust: 0.2, framingErosion: 5 },
      outcome: (ctx) =>
        `${ctx.firstName} listens and uses the explanation like a label. She does not stop looking in the mirror.`,
    },
  ],
};
