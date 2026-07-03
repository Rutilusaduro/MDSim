/**
 * Early-game interactive scenes migrated from earlyGameEvents passive beats.
 * These give the player real choices on moments that were previously read-only.
 */

export const EARLY_BRA_STRAP = {
  id: 'early_bra_strap',
  title: 'Strap Digs In',
  scope: 'weekly',
  heatBand: [0, 35],
  trigger: { minGain: 10, maxGain: 30, minStage: 0 },
  opening: (ctx) =>
    `${ctx.firstName} adjusted her bra strap twice during intake. The left side has left a red line across her shoulder wide enough to see from across the desk. "Must be swelling," she said, already reaching for the snack tray. Now she looks at you for what comes next.`,
  choices: [
    {
      id: 'agree_swelling',
      label: 'Agree -- probably mild fluid retention, nothing to worry about',
      hint: 'Denial comfort · +cover',
      apCost: 0,
      setsFlags: ['bra_strap_excused'],
      effects: { coverRating: 4, openness: 0.5, framingErosion: 2 },
      outcome: (ctx) =>
        `You nod at the swelling explanation with clinical calm. ${ctx.firstName} relaxes and reaches for the tray. The red line is still there when she leaves, a little deeper. The chart says nothing about it.`,
    },
    {
      id: 'note_fit',
      label: 'Note the fit issue and recommend a sizing consultation',
      hint: '+openness · +trust · gentle nudge',
      apCost: 0,
      setsFlags: ['bra_strap_noted'],
      effects: { openness: 3, trust: 0.2, framingErosion: 7 },
      outcome: (ctx) =>
        `You tell her you have a fitting contact and hand over the card without making it a moment. ${ctx.firstName} tucks it into her pocket without protest. She comes back next week in a band that does not dig. The snack tray stays exactly as full.`,
    },
    {
      id: 'name_it_plainly',
      label: '"That strap is too small. Your body needs room to breathe."',
      hint: '+openness · +indulgence · −cover',
      apCost: 0,
      setsFlags: ['bra_strap_named'],
      effects: { openness: 4, indulgence: 2, coverRating: -4, heat: 4, framingErosion: 14, slimMindset: false },
      outcome: (ctx) =>
        `${ctx.firstName} blinks. She expected the swelling line too. Your plainness catches her like a step that was not there. "I know," she says, finally, and her shoulders drop. "I've been buying the same size for two years." She gets the right size that afternoon. She does not blame the dryer.`,
    },
    {
      id: 'clinic_voucher_lingerie',
      label: 'Issue a wellness fitting voucher ($45)',
      hint: '+trust · −$45 · practical care',
      apCost: 1,
      requires: { moneyMin: 45 },
      setsFlags: ['bra_strap_funded'],
      effects: { money: -45, trust: 0.35, openness: 2, indulgence: 1 },
      outcome: (ctx) =>
        `You print the voucher and say it covers a proper fitting. ${ctx.firstName} looks at it the way people look at things they did not know they were allowed to have. "Thank you," she says, and means it fully. She stops adjusting the strap for the rest of the visit because she has somewhere to go after.`,
    },
  ],
};

export const EARLY_CHAIR_PINCH = {
  id: 'early_chair_pinch',
  title: 'Chair Arms Bite',
  scope: 'weekly',
  heatBand: [0, 40],
  trigger: { minGain: 24, maxGain: 70, minStage: 1 },
  opening: (ctx) => {
    if (ctx.mindset === 'slim' || ctx.mindset === 'denial') {
      return `${ctx.firstName} sat down in the armchair across from your desk and the armrests bit into her hips on both sides. She wiggled once, then settled, then stopped moving to avoid drawing attention to it. "I used to fit these," she muttered, and ate another bite of the granola bar she brought in.`;
    }
    return `${ctx.firstName} dropped into the armchair and felt the bite of the armrests immediately. She looked down, then at you, then back down. "I know," she said. "It's a whole thing." She adjusted her grip on the granola bar she was not quite done with and waited for whatever you were going to say about it.`;
  },
  choices: [
    {
      id: 'pretend_not_to_notice',
      label: 'Keep talking -- do not look at the chair',
      hint: 'Smooth deflection · +cover',
      apCost: 0,
      effects: { coverRating: 3, openness: 0.5, trust: 0.1 },
      outcome: (ctx) =>
        `You talk about labs. ${ctx.firstName} talks about labs. Neither of you acknowledges the chair. By the time she leaves she has decided today was a normal appointment, which is the most charitable possible reading. She books again for next month.`,
    },
    {
      id: 'swap_armless',
      label: 'Swap in the armless chair without comment',
      hint: '+trust · practical · wordless care',
      apCost: 0,
      setsFlags: ['chair_pinch_swapped'],
      effects: { trust: 0.35, openness: 2, heat: 2 },
      outcome: (ctx) =>
        `You step out and come back with the armless bench from the side room. You set it in place without explaining. ${ctx.firstName} looks at the bench, at you, at the bench again. She moves to it and the relief is visible in her posture. "Thank you," she says quietly, like something just got easier.`,
    },
    {
      id: 'order_wide_chairs',
      label: 'Order wide lobby chairs this week ($150)',
      hint: '+trust · −$150 · global clinic improvement',
      apCost: 1,
      requires: { moneyMin: 150 },
      setsFlags: ['chair_pinch_upgraded', 'global:global_furniture_upgraded'],
      effects: { money: -150, trust: 0.45, reputation: 1, openness: 3, heat: 4, framingErosion: 8 },
      outcome: (ctx) =>
        `You order the wide chairs from the catalog before the visit is over. ${ctx.firstName} watches you type and says nothing until you close the laptop. "How soon?" she asks. "Thursday," you tell her. She nods once, exactly. She comes back Thursday and sits in one for twenty minutes before her appointment starts.`,
    },
    {
      id: 'honest_and_kind',
      label: '"Let me find you a seat that actually fits you."',
      hint: '+openness · warmth · low heat',
      apCost: 0,
      setsFlags: ['chair_pinch_kind'],
      effects: { openness: 4, trust: 0.3, framingErosion: 10, heat: 3 },
      outcome: (ctx) =>
        `You say it like it is the most ordinary thing in the world, which is the correct tone for it. ${ctx.firstName} looks briefly like she might cry and then does not, which takes effort. "Okay," she says. "Yes please." You bring the right chair. She finishes the granola bar. The appointment goes well.`,
    },
  ],
};

export const EARLY_SCALE_WINCE = {
  id: 'early_scale_wince',
  title: 'Scale Number',
  scope: 'visit',
  heatBand: [0, 45],
  trigger: { minGain: 30, maxGain: 90, minStage: 1 },
  opening: (ctx) => {
    if (ctx.mindset === 'slim' || ctx.mindset === 'denial') {
      return `The scale reads back the number and ${ctx.firstName} goes still for two full seconds before stepping off. Her face does the math no one asked to see. "That can't be right," she says. She does not step back on. She asked about a nutrition handout while the sample muffin sat warm and untouched at her elbow.`;
    }
    if (ctx.mindset === 'curiosity') {
      return `${ctx.firstName} stepped on the scale and looked at the number straight on, no flinch, just a breath. Then she stepped off and turned to you. "So that happened," she said. She pulled the sample muffin toward her. "Is that a problem, or just a number?"`;
    }
    return `${ctx.firstName} stepped on the scale, glanced at the number, and smiled at the ceiling. "Yep," she said. She grabbed the muffin without waiting to be offered it and bit off a corner. "Put it in the chart. I want to see the graph."`;
  },
  choices: [
    {
      id: 'neutral_chart',
      label: 'Chart the number without comment -- keep it clinical',
      hint: '+cover · clean framing',
      apCost: 0,
      setsFlags: ['scale_wince_neutral'],
      effects: { coverRating: 5, trust: 0.15, framingErosion: 3 },
      outcome: (ctx) =>
        `You enter the weight into the chart with the same expression you use for blood pressure. ${ctx.firstName} watches you, decides the expression means nothing important, and finishes the muffin. The number goes in the chart. Neither of you says it aloud again.`,
    },
    {
      id: 'reframe_progress',
      label: '"That is progress on the comfort plan. The number reflects the work."',
      hint: '+indulgence · +openness · reframes gain as success',
      apCost: 0,
      requires: { mindsetMin: 'curiosity' },
      setsFlags: ['scale_wince_reframed'],
      effects: { indulgence: 4, openness: 5, framingErosion: 20, heat: 6, slimMindset: false },
      outcome: (ctx) =>
        `${ctx.firstName} holds the muffin in both hands and looks at you with something clarifying in her face. "Progress," she repeats. "You mean it." You mean it. She takes a second muffin from the tray. She does not ask about nutrition handouts. She asks about next week.`,
    },
    {
      id: 'offer_handout',
      label: 'Give her the nutrition handout and say the number warrants a look',
      hint: 'Ambiguous · slight cover',
      apCost: 0,
      effects: { coverRating: 4, openness: 1, framingErosion: 4 },
      outcome: (ctx) =>
        `You slide the handout across. ${ctx.firstName} takes it with the hand not holding the muffin and reads the first line before folding it in half and tucking it in her bag. "I'll read it later," she says. She eats the muffin. The handout stays in the bag. The number stays in the chart.`,
    },
    {
      id: 'show_the_graph',
      label: 'Pull up the weight graph and show her the trend',
      hint: '+openness · high · honest framing',
      apCost: 0,
      requires: { mindsetMin: 'denial' },
      setsFlags: ['scale_wince_graphed'],
      effects: { openness: 5, trust: 0.25, framingErosion: 15, heat: 5, indulgence: 2 },
      outcome: (ctx) =>
        `You turn the screen so she can see the line going up steady over the visits. ${ctx.firstName} studies it the way someone studies a map of somewhere they already are. "Consistent," she says. Her thumb touches the screen at the current point. "How far does it go?" You answer honestly. She finishes the muffin and books monthly instead of quarterly.`,
    },
  ],
};
