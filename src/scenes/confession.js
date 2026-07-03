/** Confession scenes: patient confronts the chart record. */

import { dishonestChartEntries } from '../memoryLedger.js';

// Map actual archetype keys to the five prose-family buckets.
const FAMILY_MAP = {
  nurturer: 'nurturing', dreamer: 'nurturing',
  perfectionist: 'analytical', scholar: 'analytical',
  socialite: 'social', patron: 'social', vip: 'social',
  foodBlogger: 'social', housewifeDonor: 'social',
  rebel: 'defiant', rivalSpy: 'defiant', rivalDoctor: 'defiant', gymDefector: 'defiant',
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
  // hedonic
  return `${firstName} was mid-reach for the snack tray when she paused. She set it back down. She turned toward you with the patience of someone who rehearsed staying calm. "I have a question," she says, "about the chart."`;
}

function buildCitationBlock(ctx) {
  const entries = dishonestChartEntries(ctx.state, ctx.character.id);
  if (!entries.length) return '';
  const recent = entries.slice(-Math.min(4, Math.max(2, entries.length)));
  const lines = recent.map((row) => {
    const { kind, excuse, weight, charted } = row.data;
    const gap = Math.round(Math.abs((weight ?? 0) - (charted ?? weight ?? 0)) * 10) / 10;
    if (kind === 'fabrication') {
      return `Week ${row.week}: scale at ${weight} lb, chart at ${charted ?? weight} lb. Filed under: "${excuse || 'no notation'}."`;
    }
    return `Week ${row.week}: scale at ${weight} lb, chart at ${charted ?? weight} lb${gap > 0 ? `, down ${gap}` : ''}.`;
  });
  const fabrications = recent.filter((r) => r.data.kind === 'fabrication').length;
  const hedges = recent.filter((r) => r.data.kind === 'hedge').length;
  let tail;
  if (fabrications && hedges) {
    tail = ' Some entries carry a written excuse. Others just shrank without comment.';
  } else if (fabrications) {
    tail = ' Every entry has a justification written in.';
  } else {
    tail = ' The numbers drifted down on their own, no reason given.';
  }
  return lines.join(' ') + tail;
}

export const WARMING_CONFESSION = {
  id: 'warming_confession',
  title: 'The Chart, Laid Out',
  heatBand: 'charged',
  scope: 'visit',
  requires: { notFlags: ['confession_resolved'] },
  opening: dishonestOpening,
  citationBlock: buildCitationBlock,
  turn: `She is not angry. She kept receipts. The page rests between you, edges straight, the silence doing all the work it needs to.`,
  choices: [
    {
      id: 'own_it',
      label: '"That is on me. The numbers were wrong."',
      hint: '+trust · −cover · resolves',
      apCost: 0,
      setsFlags: ['confession_resolved', 'confession_owned'],
      effects: { trust: 0.5, coverRating: -10, openness: 3, framingErosion: 5 },
      outcome: (ctx) =>
        `${ctx.firstName} holds still a moment. Then her shoulders drop, the held breath going out of her. "Okay," she says. Not forgiveness yet. The first beat of something honest between you.`,
    },
    {
      id: 'clinical_mask',
      label: 'Cite measurement variance; keep clinical register',
      hint: '+cover · −trust · buildup',
      apCost: 0,
      setsFlags: ['confession_masked'],
      effects: { coverRating: 4, trust: -0.4, framingErosion: 12 },
      outcome: (ctx) =>
        `${ctx.firstName} looks at the page. Looks at you. Folds the sheet once and tucks it into her bag. "Right," she says. She does not believe you. She will bring more receipts next time.`,
    },
    {
      id: 'turn_it_back',
      label: '"You never raised a concern before."',
      hint: '−trust · −openness · risk',
      apCost: 0,
      setsFlags: ['confession_deflected'],
      effects: { trust: -0.6, openness: -2, framingErosion: 8 },
      outcome: (ctx) =>
        `${ctx.firstName} goes quiet. Not hurt. Recalculating. She thanks you for your time, picks up her bag, and leaves with everything in it she brought. Next visit she brings a friend.`,
    },
    {
      id: 'ask_what_she_wants',
      label: '"What would you like the chart to reflect?"',
      hint: '+openness · +indulgence · complicit shift',
      apCost: 1,
      setsFlags: ['confession_resolved', 'confession_complicit'],
      effects: { openness: 5, indulgence: 3, trust: 0.3, framingErosion: 15, coverRating: -5 },
      outcome: (ctx) =>
        `The question surprises her. ${ctx.firstName} leans back into the chair and thinks with her whole body. "Comfortable," she says. She lets the word settle. "Just write comfortable." You do. It changes the chart less than it changes the room.`,
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
    return `${firstName} caught you reading her prior chart before she sat down. She watched without speaking. "You always put the real number," she says. No question in it. She drapes her coat over her lap and crosses her ankles and waits.`;
  },
  choices: [
    {
      id: 'acknowledge',
      label: '"The chart belongs to you, not me."',
      hint: '+trust · +openness',
      apCost: 0,
      setsFlags: ['confession_honest_resolved', 'confession_honest_acknowledged'],
      effects: { trust: 0.6, openness: 3 },
      outcome: (ctx) =>
        `${ctx.firstName} smiles. A real one. She uncrosses her ankles and settles deeper into the chair and looks easier in the room. "I appreciate that," she says. She means it fully.`,
    },
    {
      id: 'explain_philosophy',
      label: '"Clinical honesty is the baseline. It is not a favor."',
      hint: '+trust · +cover',
      apCost: 0,
      setsFlags: ['confession_honest_resolved'],
      effects: { trust: 0.4, coverRating: 3, openness: 2 },
      outcome: (ctx) =>
        `${ctx.firstName} nods slowly. The answer lands different than she expected. She glances at the chart again as if reading it for the first time, studying what the real numbers make visible.`,
    },
    {
      id: 'admit_the_temptation',
      label: '"I have considered otherwise. Comfortable numbers keep patients in the door."',
      hint: '+openness · slow burn',
      apCost: 0,
      setsFlags: ['confession_honest_resolved', 'confession_honest_candid'],
      effects: { openness: 4, trust: 0.3, indulgence: 1, framingErosion: 4 },
      outcome: (ctx) =>
        `${ctx.firstName} hears the admission and does not rush to fill the space it leaves. "But you did not," she says. That distinction matters to her more than the honesty itself.`,
    },
    {
      id: 'show_her_the_trend',
      label: 'Open the chart and walk through the trend together',
      hint: '+trust · +heat · intimacy',
      apCost: 1,
      setsFlags: ['confession_honest_resolved', 'confession_shared_chart'],
      effects: { trust: 0.5, openness: 3, heat: 4, indulgence: 2 },
      outcome: (ctx) =>
        `You turn the screen toward ${ctx.firstName}. Week by week. The numbers climb the way they do. She leans forward, chin almost at your shoulder, reading her own body in data. "That is a lot," she says quietly. She does not look away.`,
    },
  ],
};
