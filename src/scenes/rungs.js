/** Stage-crossing ceremony scenes for notable weight milestones. */

export const RUNG_FIRST_SOFTNESS = {
  id: 'rung_first_softness',
  title: 'First Real Softness',
  scope: 'weekly',
  heatBand: [0, 40],
  trigger: { minStage: 2, maxStage: 3 },
  opening: (ctx) => {
    if (ctx.mindset === 'slim' || ctx.mindset === 'denial') {
      return `${ctx.firstName} sits across from you looking puzzled by herself. Her blouse drapes differently at the waist and she keeps smoothing it, as if the fabric has misunderstood something. The chart says she is up from baseline. The blouse says more.`;
    }
    if (ctx.mindset === 'curiosity') {
      return `${ctx.firstName} stands at the exam room door and pauses with one hand on the frame, feeling the fit of the space. Something is different and she knows it. Her side presses the door lightly. She does not move yet. She waits to see what you say first.`;
    }
    return `${ctx.firstName} fills the chair with a new ease, like she has stopped remembering to hold herself smaller. Softness rounds her arms, her jaw, the front of her blouse. She looks up at you with something between amusement and invitation. "So," she says. "You notice."`;
  },
  choices: [
    {
      id: 'clinical_note',
      label: 'Chart normal weight redistribution -- no comment',
      hint: '+cover · slow burn',
      apCost: 0,
      setsFlags: ['rung_soft_clinical'],
      effects: { coverRating: 5, framingErosion: 3, openness: 1 },
      outcome: (ctx) =>
        `You write it up in quiet clinical terms and keep your face neutral. ${ctx.firstName} watches you write and exhales slowly. She believed the chart. She leaves believing the chair is also bigger than she remembers.`,
    },
    {
      id: 'gentle_acknowledge',
      label: '"Your body is settling. That can be a good sign."',
      hint: '+trust · +openness',
      apCost: 0,
      setsFlags: ['rung_soft_gentle'],
      effects: { trust: 0.3, openness: 3, framingErosion: 8 },
      outcome: (ctx) =>
        `${ctx.firstName} blinks. She was not expecting kindness exactly. "Good sign," she repeats, and the tension around her shoulders softens a degree. She leaves with a slightly different posture. Not straighter. Warmer.`,
    },
    {
      id: 'praise_openly',
      label: '"That softness suits you. I hope you are eating well."',
      hint: '+indulgence · +openness · −cover',
      apCost: 0,
      setsFlags: ['rung_soft_praised'],
      effects: { indulgence: 4, openness: 5, coverRating: -6, heat: 5, framingErosion: 18, slimMindset: false },
      outcome: (ctx) =>
        `${ctx.firstName} goes still for half a breath, then the smile comes, slow and certain. "I am," she says. "A lot." She does not pull the blouse down on her way out.`,
    },
    {
      id: 'measure_carefully',
      label: 'Do a full measurement -- make her aware of every number',
      hint: '+openness · clinical frame',
      apCost: 1,
      effects: { openness: 4, trust: 0.2, framingErosion: 12, heat: 3 },
      outcome: (ctx) =>
        `Tape and calipers. ${ctx.firstName} watches every number go down. Her face is careful, composing something. By the last measurement she has decided to be curious instead of alarmed. She asks if you have a chart she can keep.`,
    },
  ],
};

export const RUNG_WARDROBE_STAGE5 = {
  id: 'rung_wardrobe_stage5',
  title: 'The Wardrobe Problem',
  scope: 'weekly',
  heatBand: [0, 55],
  trigger: { minStage: 5, maxStage: 6 },
  opening: (ctx) => {
    if (ctx.mindset === 'denial') {
      return `${ctx.firstName} arrived in a blouse that stopped buttoning at the third eyelet, held together with a cardigan she keeps tugging closed. "Everything in the wash," she says. She looks at the wall when she says it.`;
    }
    if (ctx.mindset === 'complicity' || ctx.mindset === 'devoted') {
      return `${ctx.firstName} walks in wearing the stretchy separates she ordered six weeks ago, already straining at the seams. She drops her bag on the chair with a thud and a grin. "I went through three sizes in one month," she says. "I need a number to order, not a suggestion."`;
    }
    return `${ctx.firstName} stands in the lobby looking down at herself with an expression you might call inventory. A gap runs along her blouse front between the second and third button. Her skirt zips only halfway. She looks up at you. "It keeps happening," she says.`;
  },
  choices: [
    {
      id: 'wardrobe_allowance',
      label: 'Issue a clinic wardrobe allowance ($80)',
      hint: '+trust · −$80 · comfort',
      apCost: 1,
      requires: { moneyMin: 80 },
      setsFlags: ['rung_wardrobe_funded'],
      effects: { money: -80, trust: 0.4, openness: 3, indulgence: 2 },
      outcome: (ctx) =>
        `You print the voucher and hand it across the desk. ${ctx.firstName} looks at the number, then at you. "Just like that?" "Just like that," you tell her. She folds it into her pocket and buys a dress that fits across the hips with room to spare. She wears it to her next three appointments.`,
    },
    {
      id: 'order_custom',
      label: 'Order custom-fit clinic separates',
      hint: '+trust · +indulgence · −cover',
      apCost: 1,
      setsFlags: ['rung_wardrobe_custom', 'global:global_clinic_custom_wardrobe'],
      effects: { money: -120, trust: 0.5, indulgence: 3, openness: 4, coverRating: -5 },
      outcome: (ctx) =>
        `You take measurements yourself. ${ctx.firstName} stands straight and says nothing, but her eyes track every move. The separates arrive Thursday in a soft slate-grey. She puts them on in the exam room and turns once in front of the mirror. "They actually fit," she says, quietly, as if fit were a thing she had stopped expecting.`,
    },
    {
      id: 'deny_wardrobe',
      label: 'Tell her the current garments are fine for the clinic visit',
      hint: 'Denial path · tension',
      apCost: 0,
      effects: { openness: 1.5, trust: -0.1, framingErosion: 2 },
      outcome: (ctx) =>
        `${ctx.firstName} nods once and holds the cardigan closed with one hand for the whole visit. She does not complain. She sits a little apart from herself, though, like she is visiting the body and has not decided whether to stay.`,
    },
    {
      id: 'shop_together',
      label: 'Walk her to the boutique next door during lunch',
      hint: '+openness · +heat · relationship',
      apCost: 2,
      requires: { mindsetMin: 'curiosity' },
      setsFlags: ['rung_wardrobe_outing'],
      effects: { openness: 6, trust: 0.45, indulgence: 3, heat: 6, framingErosion: 15 },
      outcome: (ctx) =>
        `The boutique owner does not blink. She brings three sizes to the fitting room and gives you both room. ${ctx.firstName} comes out in something that actually closes and stands at the mirror for a long moment. "I look like myself," she says. You both know she means the new self. She buys two.`,
    },
  ],
};

export const RUNG_FURNITURE_STAGE7 = {
  id: 'rung_furniture_stage7',
  title: 'Furniture Talks',
  scope: 'weekly',
  heatBand: [0, 65],
  trigger: { minStage: 7, maxStage: 8 },
  opening: (ctx) => {
    if (ctx.mindset === 'curiosity') {
      return `The waiting room chair makes a sound when ${ctx.firstName} sits down, a low creak that catches. She goes very still. The patient beside her does not look up. She does, though. She looks at you.`;
    }
    if (ctx.mindset === 'complicity') {
      return `${ctx.firstName} lowers herself into the reinforced chair by the window and feels it accept her weight with a settled exhale of old springs. She pats the armrest once, approving. "This one," she says. "This one knows what it's for."`;
    }
    return `${ctx.firstName} sits in the lobby chair and it groans. Not a catastrophic groan. A working groan. She shifts. It groans again. Her cheeks go pink. She pulls her jacket closed over the button that has been struggling all morning.`;
  },
  choices: [
    {
      id: 'reinforce_quietly',
      label: 'Swap in a reinforced chair before her next visit -- say nothing',
      hint: '+trust · practical · no comment',
      apCost: 1,
      setsFlags: ['rung_furniture_upgraded'],
      effects: { trust: 0.45, openness: 3, money: -60 },
      outcome: (ctx) =>
        `The reinforced chair goes in Tuesday. ${ctx.firstName} finds it on Thursday and settles into it without a word. She stays ten minutes after checkout, seated. She does not ask why. You did not explain. This is how care works sometimes.`,
    },
    {
      id: 'name_it_kindly',
      label: '"We upgraded the lobby seating. You should use the big chair."',
      hint: '+openness · warm acknowledgment',
      apCost: 0,
      setsFlags: ['rung_furniture_named'],
      effects: { openness: 4, trust: 0.3, indulgence: 2, framingErosion: 10, heat: 4 },
      outcome: (ctx) =>
        `${ctx.firstName} looks at the chair and then at you. She understands the subtext. "Upgraded," she says, trying the word on. Then she goes and sits in it and the groaning stops. "Nice," she says. No one pretends it was about the lobby decor.`,
    },
    {
      id: 'propose_upgrade_line',
      label: 'Propose a full furniture upgrade for the waiting room ($400)',
      hint: '+rep · −cover · −$400 · global change',
      apCost: 1,
      requires: { moneyMin: 400 },
      setsFlags: ['global:global_furniture_upgraded'],
      effects: { money: -400, reputation: 3, coverRating: -8, heat: 7, trust: 0.3 },
      outcome: () =>
        'The contractor comes Monday. Wide chairs, armless benches, a padded settee by the window. By Wednesday every patient has migrated to a different spot. Nobody mentions the old furniture. The clinic looks like a decision was made.',
    },
    {
      id: 'chart_mobility',
      label: 'Chart it as reduced mobility -- clinical deflection',
      hint: '+cover · slow burn',
      apCost: 0,
      setsFlags: ['rung_furniture_charted'],
      effects: { coverRating: 8, framingErosion: 2, openness: 1 },
      outcome: (ctx) =>
        `You write a brief clinical note about reduced mobility aids and let her believe the chair was always a concern for you, not an answer to a different question. ${ctx.firstName} leaves with a pamphlet. The pamphlet goes in her bag without being opened.`,
    },
  ],
};

export const RUNG_IMMOBILITY = {
  id: 'rung_immobility',
  title: 'The Floor Does Not Give',
  scope: 'weekly',
  heatBand: [5, 100],
  trigger: { minStage: 10 },
  opening: (ctx) => {
    if (ctx.mindset === 'devoted') {
      return `${ctx.firstName} does not pretend to rise when you enter. She sits centered in the reinforced chair, feet flat, hands folded over the apex of her belly, and the weight of her is obvious and total. "I thought about walking to the window," she says, "and decided this was better." She means the chair. She means the stillness. She means all of it.`;
    }
    if (ctx.mindset === 'complicity') {
      return `${ctx.firstName} made it to the appointment. That part she is proud of. The walk from the car took long enough that she needed to sit on arrival, and she is still sitting, warmth rising from her in the cool of the lobby. "I'm here," she says. She sounds both tired and certain.`;
    }
    return `${ctx.firstName} stands at the lobby door and the distance to the exam room is a real question. Her breathing shifts with the first three steps. She sits down at the first chair and looks at you with an expression that is not quite asking for help but is not not asking.`;
  },
  choices: [
    {
      id: 'bring_exam_to_her',
      label: 'Bring the exam equipment to the lobby -- no walking required',
      hint: '+trust · +indulgence · practical care',
      apCost: 1,
      setsFlags: ['rung_immobility_lobby_exam'],
      effects: { trust: 0.6, indulgence: 4, openness: 4, heat: 8 },
      outcome: (ctx) =>
        `You wheel the cart out. ${ctx.firstName} watches you set up without moving and something in her goes quiet and grateful. The exam takes longer and costs two staff. Nobody complains. She rates the visit a ten in the digital survey, which nobody expected a ten in.`,
    },
    {
      id: 'mobility_plan',
      label: 'Propose a mobility accommodation plan',
      hint: '+cover · +trust · clinical framing',
      apCost: 0,
      setsFlags: ['rung_immobility_plan'],
      effects: { trust: 0.4, coverRating: 6, openness: 2, framingErosion: 5 },
      outcome: (ctx) =>
        `You walk her through the accommodation plan: a chair at intake, vitals in the lobby, staggered scheduling with wider slots. ${ctx.firstName} listens the way people listen when they are relieved something has a name. She signs the form. The chart looks procedural. The situation is not.`,
    },
    {
      id: 'call_it_out',
      label: '"You have reached the point where we talk about what this means."',
      hint: '+openness · high heat · devoted path',
      apCost: 0,
      requires: { mindsetMin: 'complicity' },
      setsFlags: ['rung_immobility_named'],
      effects: { openness: 7, indulgence: 5, heat: 14, coverRating: -12, framingErosion: 25, slimMindset: false },
      outcome: (ctx) =>
        `${ctx.firstName} meets your eyes. This is the conversation she has been waiting for. You say it plain. She nods, and something settles in her the way weight settles: final and decided. "I know," she says. "I know exactly." She asks what comes next. You answer honestly.`,
    },
    {
      id: 'home_visit_plan',
      label: 'Arrange for home visit scheduling going forward',
      hint: '+trust · +indulgence · operational shift',
      apCost: 2,
      setsFlags: ['rung_immobility_home_care', 'global:global_home_visits_active'],
      effects: { trust: 0.7, indulgence: 5, money: -90, heat: 10, framingErosion: 20 },
      outcome: (ctx) =>
        `You make the call. Home visits, twice a week, equipment brought in. ${ctx.firstName} exhales when you tell her and does not try to make it smaller than it is. "Thank you," she says. The clinic invoices for home assessment. The chart says what it needs to say. The care is real regardless.`,
    },
  ],
};

export const RUNG_SCENES = {
  rung_first_softness: RUNG_FIRST_SOFTNESS,
  rung_wardrobe_stage5: RUNG_WARDROBE_STAGE5,
  rung_furniture_stage7: RUNG_FURNITURE_STAGE7,
  rung_immobility: RUNG_IMMOBILITY,
};
