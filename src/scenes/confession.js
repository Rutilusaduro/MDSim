/**
 * Confession scenes: moments where a patient or staff member says out loud
 * what has been true for weeks. Mindset-gated, high-heat openings.
 */

export const CONFESSION_FIRST_ADMISSION = {
  id: 'confession_first_admission',
  title: 'First Admission',
  scope: 'visit',
  heatBand: [0, 50],
  trigger: { minStage: 2, mindsetMin: 'curiosity' },
  opening: (ctx) => {
    if (ctx.mindset === 'devoted') {
      return `${ctx.firstName} sits in the wide chair by the window and does not bother with the usual opener. "I want you to know I know exactly what I'm doing," she says. Her hands are folded over the forward curve of her belly like she has been waiting to say this for weeks. "I thought you should hear me say it plainly."`;
    }
    if (ctx.mindset === 'complicity') {
      return `${ctx.firstName} gets through intake and then stops. She looks at the chart, at you, at her hands. "I'm not going to pretend anymore," she says. "That I don't know what this is. That I don't come here on purpose." She waits to see if that changes anything.`;
    }
    return `Midway through the visit ${ctx.firstName} goes quiet. You wait. "I think I've been wanting this," she says, finally. "Not just the food. All of it." She does not name what all of it means. She looks at the window instead of at you while she says it.`;
  },
  choices: [
    {
      id: 'receive_quietly',
      label: 'Listen. Say nothing until she finishes.',
      hint: '+trust · +openness · gives her space',
      apCost: 0,
      setsFlags: ['confession_received_quiet'],
      effects: { trust: 0.45, openness: 5, indulgence: 2, framingErosion: 12 },
      outcome: (ctx) =>
        `You let the silence hold until it belongs to her. ${ctx.firstName} works through the rest of it at her own pace, saying more than she planned because you did not rush her. By the end she looks lighter. Not smaller. Lighter. "Thank you for not making it weird," she says. You both understand that you made it exactly the right amount of weird.`,
    },
    {
      id: 'confirm_openly',
      label: '"Yes. And that is all right here."',
      hint: '+indulgence · +heat · full acknowledgment',
      apCost: 0,
      requires: { mindsetMin: 'complicity' },
      setsFlags: ['confession_confirmed', 'global:global_patient_confessed'],
      effects: { indulgence: 6, openness: 6, trust: 0.5, heat: 10, coverRating: -8, framingErosion: 25, slimMindset: false },
      outcome: (ctx) =>
        `${ctx.firstName} exhales the way people exhale after holding their breath in a long meeting. "Okay," she says. "Okay." She does not add anything else. She does not need to. The chart stays professional. The room is something else entirely.`,
    },
    {
      id: 'clinical_soften',
      label: '"I hear you. Appetite changes are common at this stage. Let\'s talk through it."',
      hint: '+cover · warm but clinical · builds trust slowly',
      apCost: 0,
      setsFlags: ['confession_clinical_soften'],
      effects: { coverRating: 6, trust: 0.35, openness: 3, framingErosion: 8 },
      outcome: (ctx) =>
        `You keep the register clinical but the warmth is there underneath and she feels it. ${ctx.firstName} accepts the framing with visible relief. It gives her something to say to herself later, a safe label for what she said. She books a follow-up. The chart note says appetite review.`,
    },
    {
      id: 'ask_what_she_wants',
      label: '"What would you like this to look like, going forward?"',
      hint: '+openness · agency · path-setting',
      apCost: 0,
      setsFlags: ['confession_agency'],
      effects: { trust: 0.4, openness: 5, indulgence: 3, framingErosion: 15 },
      outcome: (ctx) =>
        `${ctx.firstName} blinks. No one asked her that before. She thinks for a real minute. "More of this," she says, meaning the tray, the chair, the fact that you are still listening. "More of all of it." She books weekly. She brings the recommendation to a friend. Your reputation goes up two points by Thursday.`,
    },
  ],
};

export const CONFESSION_MIRROR_MOMENT = {
  id: 'confession_mirror_moment',
  title: 'The Mirror Question',
  scope: 'weekly',
  heatBand: [5, 70],
  trigger: { minStage: 4, mindsetMin: 'curiosity' },
  opening: (ctx) => {
    if (ctx.mindset === 'devoted') {
      return `${ctx.firstName} caught herself in the exam room mirror while you were reviewing labs and did not look away. She stood there for a long moment, head tipped to one side, studying. When you looked up she was still watching her own reflection. "I keep thinking I'll be surprised," she said, "but I'm just not." She sounded completely at peace with that.`;
    }
    if (ctx.mindset === 'complicity') {
      return `After vitals ${ctx.firstName} glanced at the mirror above the sink and then looked back at herself a second time, like she caught something. "I keep forgetting what I look like now," she said. "Then I remember." She turned from the mirror and sat back down. "Is that normal?" She did not look like she was worried. She looked like she wanted to talk about it.`;
    }
    return `${ctx.firstName} paused at the exam room mirror during intake with a look you have learned to read: half recognition, half something she has not named yet. She smoothed her blouse over her middle before turning back to the chair. "I look different," she said, flat, not asking.`;
  },
  choices: [
    {
      id: 'affirm_change',
      label: '"You do. Your body has been changing. How does that feel?"',
      hint: '+openness · gentle confrontation',
      apCost: 0,
      requires: { mindsetMin: 'curiosity' },
      setsFlags: ['mirror_affirmed'],
      effects: { openness: 5, trust: 0.35, framingErosion: 14, heat: 5, indulgence: 2 },
      outcome: (ctx) =>
        `${ctx.firstName} sits with the question longer than most. "Good," she says eventually. "Actually good." She sounds surprised and then decides not to be. "I wasn't expecting that answer from myself." You write it down where she can see it. She asks you to keep it in the chart.`,
    },
    {
      id: 'mirror_clinical',
      label: 'Explain that weight distribution shifts are normal at this gain range',
      hint: '+cover · clinical anchor',
      apCost: 0,
      setsFlags: ['mirror_clinical'],
      effects: { coverRating: 5, trust: 0.2, framingErosion: 5, openness: 1 },
      outcome: (ctx) =>
        `You walk her through the physiology in calm, even language. ${ctx.firstName} listens and you can see her using the explanation the way people use labels: to make things smaller and safer. She does not stop looking in the mirror. She just has a word for it now.`,
    },
    {
      id: 'bring_the_tray',
      label: 'Bring the snack tray in and let her keep looking',
      hint: '+indulgence · sensory · no words needed',
      apCost: 0,
      requires: { mindsetMin: 'complicity' },
      setsFlags: ['mirror_fed'],
      effects: { indulgence: 5, openness: 3, heat: 8, weight: 0.3, framingErosion: 18 },
      outcome: (ctx) =>
        `You set the tray beside her without interrupting the mirror moment. ${ctx.firstName} reaches for the tray without looking away from her reflection. She eats facing herself and something visibly resolves. When she turns back to you she has decided something. The decision is not spoken. It does not have to be.`,
    },
    {
      id: 'take_a_photo',
      label: 'Ask if she wants a progress photo for the clinic record',
      hint: '+openness · +heat · documentation',
      apCost: 0,
      requires: { mindsetMin: 'complicity' },
      setsFlags: ['mirror_photo', 'global:global_mirror_photo_taken'],
      effects: { openness: 6, heat: 10, indulgence: 3, framingErosion: 22, coverRating: -6 },
      outcome: (ctx) =>
        `${ctx.firstName} goes still at the question. Then she straightens. "Yes," she says, and the yes is not about documentation. She faces the mirror fully. You take the photo from behind her shoulder so she can see her own face looking back. She asks for a copy. It goes in her file under: wellness progress.`,
    },
  ],
};
