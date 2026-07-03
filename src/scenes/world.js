/** Doorway wedge and escalated sequel. */

export const WORLD_DOORWAY_WEDGE = {
  id: 'world_doorway_wedge',
  title: 'Doorway Wedge',
  scope: 'visit',
  heatBand: [0, 65],
  opening: (ctx) => {
    const { character, firstName } = ctx;
    if (ctx.mindset === 'slim' || ctx.mindset === 'denial') {
      return `${firstName} tries the exam room door and stops. Her hips catch the frame. "This door was always narrow," she says, smoothing her blouse. The fabric does not cooperate.`;
    }
    return `${firstName} wedges in the supply doorway, belly pressed to the jamb, breathless. She laughs once, low. "Worth it," she mutters. Staff hover, unsure whether to push or fetch a tray.`;
  },
  choices: [
    {
      id: 'push_hips',
      label: 'Push from behind — gentle pressure',
      hint: '+openness · −cover',
      apCost: 1,
      setsFlags: ['patient_wedge_push_helped'],
      effects: { openness: 3, indulgence: 1, coverRating: -5, heat: 4, weight: 0.2 },
      outcome: (ctx) =>
        `You set your palms at ${ctx.firstName}'s hips. Heat through the fabric. The frame groans. She exhales. Maintenance will send an invoice. She whispers thank you like a secret.`,
    },
    {
      id: 'snack_wait',
      label: 'Bring a snack stool — wait while she eases through',
      hint: '+indulgence · time',
      apCost: 1,
      setsFlags: ['patient_wedge_snack_wait'],
      effects: { indulgence: 3, openness: 2, framingErosion: 8, heat: 2 },
      outcome: (ctx) =>
        `You roll a stool and a warm plate within reach. ${ctx.firstName} eats while wedged, hips shifting inch by inch. The lobby smells pastry. She unsticks on the third bite.`,
    },
    {
      id: 'widen_door',
      label: 'Call maintenance — widen the frame ($400)',
      hint: '+rep · −cover · −$400',
      apCost: 1,
      requires: { moneyMin: 400 },
      setsFlags: ['global:global_doorway_widened'],
      effects: { money: -400, reputation: 2, coverRating: -8, heat: 6 },
      outcome: () =>
        'Contractors cut the frame a foot wider. She eats while they work. The clinic looks less like a normal PCP office. She fits now. Everyone pretends that was the plan.',
    },
    {
      id: 'chart_edema',
      label: 'Chart lower-extremity edema — clinical cover',
      hint: '+cover · slow burn',
      apCost: 0,
      setsFlags: ['patient_edema_excuse'],
      effects: { coverRating: 8, openness: 1, framingErosion: 2 },
      outcome: (ctx) =>
        `You note swelling in the chart and speak in calm clinical terms. ${ctx.firstName} nods, relieved. She believes it one more week. The door stays narrow.`,
    },
    {
      id: 'defer',
      label: 'Let her work it out alone',
      hint: 'Escalates next week',
      apCost: 0,
      effects: { reputation: -2, heat: 8 },
      enqueueScene: 'world_doorway_escalated',
      outcome: (ctx) =>
        `${ctx.firstName} wrestles the frame alone for twenty minutes. Someone in the lobby films. Next week this gets worse.`,
    },
  ],
};

export const WORLD_DOORWAY_ESCALATED = {
  id: 'world_doorway_escalated',
  title: 'Doorway Crisis',
  scope: 'weekly',
  heatBand: [10, 100],
  trigger: { minStage: 4 },
  opening: (ctx) =>
    `${ctx.firstName} is stuck again, louder this time. The frame splinters. A patient in the lobby watches. You need a real answer.`,
  choices: [
    {
      id: 'emergency_widen',
      label: 'Emergency widen — double cost ($800)',
      hint: '−$800 · ends crisis',
      apCost: 1,
      requires: { moneyMin: 800 },
      setsFlags: ['global:global_doorway_widened'],
      effects: { money: -800, reputation: 1, coverRating: -12, heat: 10 },
      outcome: () => 'The contractors come overnight. The hallway looks like a renovation ad. She fits. The board might not.',
    },
    {
      id: 'feed_through',
      label: 'Feed her in the doorway until staff pull her through',
      hint: '+indulgence · +heat',
      apCost: 2,
      effects: { indulgence: 6, openness: 4, heat: 15, coverRating: -10, weight: 0.8 },
      outcome: (ctx) =>
        `Trays arrive. ${ctx.firstName} eats while two staff pull. The lobby watches. She pops free on a groan and a laugh. Your cover rating takes a hit.`,
    },
    {
      id: 'shame_clinical',
      label: 'Close the blinds and chart it as equipment failure',
      hint: '+cover',
      apCost: 0,
      effects: { coverRating: 10, openness: -1 },
      outcome: () => 'Blinds down. Chart cites faulty hardware. She believes you. The video maybe still exists.',
    },
  ],
};
