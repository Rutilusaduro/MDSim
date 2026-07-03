/**
 * MOLE_FLIP_SCENE: double-agent romance scene for Jasmine when
 * moleLoyalty >= 40 and stage >= 4.
 */

export const MOLE_FLIP_SCENE = {
  id: 'mole_flip',
  title: 'The Annex Report She Will Not File',
  scope: 'weekly',
  heatBand: [0, 100],
  trigger: { moleLoyaltyMin: 40, minStage: 4 },
  opening: (ctx) => {
    const first = ctx.firstName;
    if (ctx.mindset === 'devoted') {
      return `${first} waits until the lab closes and then slides a folded printout across the counter. The ThriveWell letterhead is visible at the top. She has written VOID across it in red marker, twice, firmly. "I missed my last two check-in calls," she says. "I forgot to miss them. I think I forgot on purpose." She does not look sorry. She looks like someone who has already chosen the right side and is only now saying it out loud.`;
    }
    if (ctx.mindset === 'complicity') {
      return `${first} finds you after the last draw of the day with an envelope she has been carrying too long, the corners bent soft from her pocket. "They sent a new reporting form," she says. She sets it on the counter unopened. "I haven't filled one out in six weeks. They're going to figure that out eventually." She looks at you the way people look when they want to be asked what they actually want.`;
    }
    return `${first} stops you by the supply closet door with a look that is not her usual grin. "ThriveWell called again," she says quietly. "Third time this month." She holds up the phone like evidence and then puts it face-down on the cart. "They want a progress report. I keep telling them I don't have one." She pauses. "I have one. I just don't want to give it to them."`;
  },
  choices: [
    {
      id: 'ask_what_she_wants',
      label: '"What do you want to happen here?"',
      hint: '+trust · opens the honest path',
      apCost: 0,
      setsFlags: ['mole_flip_honest_path'],
      effects: { trust: 0.4, openness: 4, moleLoyalty: 8 },
      outcome: (ctx) =>
        `${ctx.firstName} was waiting for that question. "I want to stay," she says. "Not report. Not leave. Stay." She looks at the phone on the cart. "I think I stopped being their person the day you handed me the first donut out of the box instead of the small one." She does not pick the phone back up.`,
    },
    {
      id: 'promise_protection',
      label: '"File nothing. I will handle whatever comes from ThriveWell."',
      hint: '+moleLoyalty · high heat · decisive',
      apCost: 0,
      requires: { mindsetMin: 'curiosity' },
      setsFlags: ['mole_flip_protected', 'global:global_mole_defected'],
      effects: { trust: 0.55, moleLoyalty: 12, heat: 10, indulgence: 4, coverRating: -8 },
      outcome: (ctx) =>
        `${ctx.firstName} looks at you for a long moment. "You mean that." It is not a question but you answer it anyway. She takes a breath and puts the envelope in the paper shredder by the desk, the kind of commitment that makes a sound. "Then I'm yours," she says. "Not theirs. I was already, I just needed to hear you say it." She goes home and does not return ThriveWell's next call.`,
    },
    {
      id: 'feed_her_into_loyalty',
      label: 'Bring out the good tray and let the evening do the talking',
      hint: '+indulgence · +moleLoyalty · relationship deepens',
      apCost: 1,
      requires: { flags: ['jasmine_feeding'] },
      setsFlags: ['mole_flip_fed', 'global:global_mole_defected'],
      effects: { indulgence: 6, trust: 0.6, moleLoyalty: 15, weight: 0.7, openness: 5, heat: 8 },
      outcome: (ctx) =>
        `You bring the good tray, the one with the heavier plate and the soft rolls she has been eating since week two. ${ctx.firstName} looks at it and then at you and the whole complicated calculation she has been running comes to a close. She eats. Slow and certain, one hand on her middle where the scrubs pull. "I never wanted to report anything real," she says between bites. "I just wanted something to do with my hands while I thought about staying." She finishes the tray and stays two more hours. ThriveWell gets a blank form in the morning post.`,
    },
    {
      id: 'negotiate_cover',
      label: 'Ask her to file a minimal report to buy time',
      hint: '+cover · moleLoyalty risk · tactical',
      apCost: 0,
      setsFlags: ['mole_flip_cover_deal'],
      effects: { coverRating: 10, moleLoyalty: 4, trust: 0.1, heat: -3 },
      outcome: (ctx) =>
        `${ctx.firstName} chews the inside of her cheek. "Minimal," she says. "I can do minimal." She types something short and clinical, nothing actionable, nothing true, and sends it from the parking lot so the IP traces right. "That buys us maybe a month," she says. "Figure out the rest before then." She hands you the phone so you can read what she wrote. It is better than minimal. She is better than she gives herself credit for.`,
    },
  ],
  epilogue: (ctx) =>
    `${ctx.firstName} leaves through the side exit. The Annex number stays on her blocked list. Whatever she was when she arrived, she is yours now.`,
};
