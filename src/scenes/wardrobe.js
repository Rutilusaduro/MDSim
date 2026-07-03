/** Exam and wardrobe interactive scenes. */

export const EXAM_BUTTON_POP = {
  id: 'exam_button_pop',
  title: 'Button Pop',
  scope: 'visit',
  heatBand: [0, 45],
  opening: (ctx) =>
    `Mid-exam, a button on ${ctx.firstName}'s blouse pings free, rolls under the scale, and spins. She freezes. Color rises in her cheeks. The stethoscope is still cold against her skin.`,
  choices: [
    {
      id: 'clinical_deflect',
      label: 'Note garment fit — continue exam',
      hint: '+cover · +trust',
      apCost: 0,
      setsFlags: ['patient_button_clinical'],
      effects: { trust: 0.2, coverRating: 5, framingErosion: 5 },
      outcome: (ctx) =>
        `You document fit issues without drama and move on. ${ctx.firstName} buttons her cardigan over the gap. Clinical. Composed. Already reaching for the snack menu in her head.`,
    },
    {
      id: 'fetch_button',
      label: 'Fetch the button — hand it back without comment',
      hint: 'Neutral',
      apCost: 0,
      effects: { trust: 0.15 },
      outcome: (ctx) =>
        `You crawl, retrieve the button, place it in her palm. ${ctx.firstName} murmurs thanks. Neither of you names what happened.`,
    },
    {
      id: 'praise_pop',
      label: '"Sounds like you are outgrowing the wardrobe"',
      hint: '+openness · −cover',
      apCost: 0,
      setsFlags: ['patient_button_praised', 'global:global_wardrobe_celebrated'],
      effects: { openness: 4, indulgence: 2, coverRating: -6, heat: 5, framingErosion: 18, slimMindset: false },
      outcome: (ctx) =>
        `${ctx.firstName} laughs, surprised, then does not stop you. "Maybe," she says. Pride sits plain on her face. The exam continues with one less button and one more appetite.`,
    },
    {
      id: 'offer_tunic',
      label: 'Offer clinic backup tunic',
      hint: '+trust · exam continues',
      apCost: 1,
      effects: { trust: 0.35, openness: 2, money: -25 },
      outcome: (ctx) =>
        `You produce a soft clinic tunic, open in the back. ${ctx.firstName} changes without meeting your eyes. She looks comfortable. Dangerously so.`,
    },
  ],
};

export const EARLY_JEANS_TIGHT = {
  id: 'early_jeans_tight',
  title: 'Jeans Too Tight',
  scope: 'weekly',
  heatBand: [0, 30],
  trigger: { minGain: 6, maxGain: 22, minStage: 0 },
  opening: (ctx) =>
    `${ctx.firstName} tugged at her waistband after lunch. The button held by a thread. She blamed the dryer. The seam complained anyway.`,
  choices: [
    {
      id: 'blame_dryer',
      label: 'Agree — probably the dryer',
      hint: 'Denial path',
      apCost: 0,
      effects: { openness: 0.5, framingErosion: 2 },
      outcome: (ctx) =>
        `You nod at the dryer excuse. ${ctx.firstName} relaxes. She eats another roll. The button survives until tomorrow.`,
    },
    {
      id: 'admit_out_loud',
      label: '"Those jeans are too small now"',
      hint: 'Cruel honesty · +openness',
      apCost: 0,
      effects: { openness: 3, indulgence: 1, coverRating: -3, heat: 3, slimMindset: false },
      setsFlags: ['global:global_jeans_admitted'],
      outcome: (ctx) =>
        `${ctx.firstName} flushes. She looks down. "Maybe," she whispers. She does not zip them up all the way. She takes the pastry anyway.`,
    },
    {
      id: 'buy_bigger',
      label: 'Send her to buy the next size — clinic petty cash ($30)',
      hint: '+trust',
      apCost: 1,
      effects: { money: -30, trust: 0.25, openness: 2 },
      outcome: (ctx) =>
        `You hand her petty cash. ${ctx.firstName} returns twenty minutes later in jeans that actually close. She looks relieved and somehow hungrier.`,
    },
    {
      id: 'ignore_and_feed',
      label: 'Ignore it — push the snack tray closer',
      hint: '+indulgence',
      apCost: 0,
      effects: { indulgence: 3, weight: 0.3, framingErosion: 10 },
      outcome: (ctx) =>
        `You slide the tray nearer. ${ctx.firstName} stops tugging. She eats. The waistband surrenders quietly.`,
    },
  ],
};
