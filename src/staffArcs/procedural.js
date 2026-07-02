import { scene } from './shared.js';

/** Procedural arcs for recruited staff — multipath templates keyed by beat id. */
export const PROCEDURAL_ARC = {
  0: scene(
    (ctx) => {
      const name = ctx.firstName;
      if (ctx.flags.has('proc_feeding')) {
        return `${name} stayed late with two trays and no excuse ready when you found her.\n\n"I was going to tell you tomorrow," she says, cheeks full. "I like eating after everyone leaves. It's quieter. I can feel myself getting softer without an audience." She pats the chair beside her. "Unless you want to watch."`;
      }
      return `${name} stayed late without being asked. A snack tray waits on the break table with two forks.\n\n"Could not let it go bad," she says, wiping crumbs from her lip. She looks at you with the bold, shy mix of someone who still wants approval.\n\n"Sit with me?" she asks. "Just for a minute. The clinic is better when it's not empty."`;
    },
    [
      {
        id: 'stay',
        label: 'Stay and eat with her',
        setsFlags: ['proc_shared', 'proc_feast_route'],
        outcome: (ctx) =>
          `You eat while ${ctx.firstName} talks about the week, the chairs, the vending wall, the way hunger sneaks up now that this job feels safe. She saves you the last bite without thinking. "Same time Thursday?" she says, already certain.`,
        effects: { trust: 0.45, indulgence: 3, weight: 0.35, weeklyMomentum: 0.5 },
      },
      {
        id: 'feed',
        label: 'Feed her the second half yourself',
        setsFlags: ['proc_feeding', 'proc_feast_route'],
        outcome: (ctx) =>
          `You lift the fork. ${ctx.firstName} opens her mouth and moans quiet when she swallows. Color climbs her neck. "I could get used to that," she whispers. She finishes heavier than she arrived, hand on her stomach, eyes on you.`,
        effects: { trust: 0.55, indulgence: 4.5, weight: 0.5, openness: 5 },
      },
      {
        id: 'approve_tray',
        label: 'Approve a regular after-hours tray',
        setsFlags: ['proc_budget'],
        outcome: (ctx) =>
          `${ctx.firstName} adds the tray to the schedule before you close the tab. She eats without guilt the next night and leaves a note on your desk: the numbers were worth it. And so was the cheesecake.`,
        effects: { trust: 0.35, money: -50, indulgence: 2.5, weeklyMomentum: 0.4 },
      },
      {
        id: 'send_home',
        label: 'Send her home with leftovers',
        outcome: (ctx) =>
          `${ctx.firstName} packs the tray and salutes you with a fork. She texts a photo of empty containers at ten. You save it before you can think.`,
        effects: { trust: 0.25, indulgence: 1.5, openness: 2 },
      },
    ],
  ),

  1: scene(
    (ctx) => {
      const name = ctx.firstName;
      if (ctx.flags.has('proc_body_proud')) {
        return `${name} meets you in the hallway with scrubs that fit last month. She holds them up, then holds herself, palms at her waist.\n\n"I'm getting thicker," she says, pleased. "Say you still want me on the floor."`;
      }
      return `${name} meets you in the hallway with scrubs bunched in her hands. The tag is her old size.\n\n"It fit in March," she says. She steps to the mirror and pulls the top on. It stops short. "New size. Please. Before Friday."`;
    },
    [
      {
        id: 'order',
        label: 'Order the next size immediately',
        setsFlags: ['proc_body_proud'],
        outcome: (ctx) =>
          `${ctx.firstName} watches the confirmation email land and exhales. She donates the old scrubs without shame. "Someone starting out can use them," she says.`,
        effects: { trust: 0.45, openness: 4, indulgence: 2 },
      },
      {
        id: 'praise',
        label: 'Tell her she looks good filling out',
        requires: { flags: ['proc_feast_route'] },
        setsFlags: ['proc_body_proud', 'proc_flirt'],
        outcome: (ctx) =>
          `${ctx.firstName} blushes hard. "Keep looking at me like that," she says, voice low, "and I'll need two sizes up." She means it as a promise.`,
        effects: { trust: 0.55, openness: 6, indulgence: 3.5, weight: 0.3 },
      },
      {
        id: 'fitting',
        label: 'Schedule a staff fitting',
        outcome: (ctx) =>
          `The tailor measures ${ctx.firstName} in the back office. She jokes through it and orders two cuts. Both fit by Friday. She eats lunch in the new set like a small celebration.`,
        effects: { trust: 0.35, indulgence: 2.5, weight: 0.25, openness: 4 },
      },
      {
        id: 'stretch',
        label: 'Try stretch-fit first',
        outcome: (ctx) =>
          `${ctx.firstName} picks stretch fabric and shrugs. "Temporary," she says. It lasts three weeks. She asks for the regular cut without embarrassment.`,
        effects: { trust: 0.3, indulgence: 2.5, weight: 0.35, weeklyMomentum: 0.4 },
      },
    ],
  ),

  2: scene(
    (ctx) => {
      const name = ctx.firstName;
      if (ctx.flags.has('proc_flirt')) {
        return `${name} finds you near the break room couch with a tray on her knee. The couch groans when she shifts.\n\n"I claimed this spot," she says. "And I claimed extra lunch." She runs a hand over her stomach. "Want to help me finish?"`;
      }
      return `${name} finds you near the break room with a full tray. The couch groans when she sits.\n\n"I claimed this spot," she says. "Fair warning, it might not survive the month." She offers you a fry without looking up.`;
    },
    [
      {
        id: 'join_couch',
        label: 'Sit with her and eat',
        setsFlags: ['proc_shared'],
        outcome: (ctx) =>
          `You talk schedules while ${ctx.firstName} finishes the tray. The couch survives. Her mood improves. She volunteers for a closing shift you did not ask for.`,
        effects: { trust: 0.45, indulgence: 3.5, weight: 0.4, weeklyMomentum: 0.5 },
      },
      {
        id: 'feed_couch',
        label: 'Feed her until the tray is empty',
        requires: { flags: ['proc_feeding'] },
        outcome: (ctx) =>
          `You feed ${ctx.firstName} bite after bite. She leans into your shoulder, stuffed and glowing. "More next week," she murmurs against your sleeve.`,
        effects: { trust: 0.6, indulgence: 5, weight: 0.65, openness: 6 },
      },
      {
        id: 'new_couch',
        label: 'Budget for a sturdier couch',
        outcome: (ctx) =>
          `A reinforced couch arrives the following week. ${ctx.firstName} tests it with a full tray and nods approval. Staff gather there more often.`,
        effects: { trust: 0.4, money: -90, indulgence: 2.5, openness: 3 },
      },
      {
        id: 'break_timer',
        label: 'Set a real break timer for her shifts',
        outcome: (ctx) =>
          `${ctx.firstName} rolls her eyes at the timer and uses it anyway. She eats full meals on schedule. Her work improves. She thanks you later without making a speech.`,
        effects: { trust: 0.35, appetite: 0.15, indulgence: 2, openness: 3 },
      },
    ],
  ),

  3: scene(
    (ctx) => {
      const name = ctx.firstName;
      if (ctx.flags.has('proc_feeding')) {
        return `${name} texts after shift: Break room. Bring nothing.\n\nYou find her with two trays warming. "I thought about you feeding me all day," she says. She pats her thigh. "Sit close. Don't stop until I say."`;
      }
      return `${name} catches you before clock-out, hand on her stomach.\n\n"Hunger feels like part of the job now," she says. "I want the clinic to keep up with me. Can it?"`;
    },
    [
      {
        id: 'accept_feeding',
        label: 'Feed her until she says stop',
        requires: { flags: ['proc_feeding'] },
        setsFlags: ['proc_lovers'],
        outcome: (ctx) =>
          `${ctx.firstName} takes every bite you offer, moaning soft, fingers laced over yours on her belly. "I could get so much bigger for you," she whispers. You believe her.`,
        effects: { trust: 0.65, indulgence: 6, weight: 0.85, openness: 7, weeklyMomentum: 0.9 },
      },
      {
        id: 'yes_budget',
        label: 'Yes, and expand the snack budget',
        setsFlags: ['proc_budget'],
        outcome: (ctx) =>
          `${ctx.firstName} exhales and smiles. She helps pick trays for next week. Her weight climbs. Her work stays sharp.`,
        effects: { trust: 0.5, indulgence: 4, money: -80, weight: 0.45, weeklyMomentum: 0.6 },
      },
      {
        id: 'yes_plan',
        label: 'Yes, with a personal comfort plan',
        outcome: (ctx) =>
          `You write ${ctx.firstName} the same plan you give patients. She signs it and tapes it in her locker. She follows it better than most patients.`,
        effects: { trust: 0.45, openness: 5, indulgence: 3.5, weight: 0.35 },
      },
      {
        id: 'slow',
        label: 'Ask her to pace herself',
        outcome: (ctx) =>
          `${ctx.firstName} nods without arguing. She keeps eating. She adds one rest day to her calendar and shows you like proof.`,
        effects: { trust: 0.35, indulgence: 2.5, openness: 4 },
      },
    ],
  ),

  4: scene(
    (ctx) => {
      const name = ctx.firstName;
      if (ctx.flags.has('proc_lovers')) {
        return `The clinic is empty. ${name} locked the break room and set out three trays.\n\n"Finish me," she says, cardigan open, belly heavy on her lap. "Then tell me you'll keep feeding me."`;
      }
      return `After close, ${name} waits with a bakery box and a tired, happy smile.\n\n"I made it through the week," she says. "Feed me something stupid and sweet. I earned it."`;
    },
    [
      {
        id: 'lovers_feast',
        label: 'Feed her all three trays',
        requires: { flags: ['proc_lovers'] },
        outcome: (ctx) =>
          `${ctx.firstName} slumps against you, stuffed and glowing. "I love this," she murmurs. "I love you feeding me." You stay until the lights click off.`,
        effects: { trust: 0.7, indulgence: 7, weight: 1.1, openness: 7, weeklyMomentum: 1 },
      },
      {
        id: 'celebrate_box',
        label: 'Celebrate with the whole bakery box',
        outcome: (ctx) =>
          `You eat half the box together. ${ctx.firstName} licks sugar from her thumb and grins. "Best job I ever took," she says.`,
        effects: { trust: 0.55, indulgence: 5, weight: 0.7, weeklyMomentum: 0.75 },
      },
      {
        id: 'budget_perm',
        label: 'Make her snack budget permanent',
        requires: { flags: ['proc_budget'] },
        outcome: (ctx) =>
          `${ctx.firstName} watches the line item save and kisses the air toward you. Thursday becomes a standing feast. Her weight climbs steady.`,
        effects: { trust: 0.5, indulgence: 4, money: -75, weight: 0.6 },
      },
      {
        id: 'photo',
        label: 'Take a staff photo for the board',
        setsFlags: ['proc_public'],
        outcome: (ctx) =>
          `${ctx.firstName} poses with pastry in hand, hips wide, grin unapologetic. Patients book faster. She pins the print inside her locker.`,
        effects: { trust: 0.45, reputation: 2, indulgence: 3.5, openness: 5 },
      },
    ],
  ),
};
