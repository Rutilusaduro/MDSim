import { scene } from './shared.js';

/** Maya Okafor — routes: feast (shared meals), tender (care), proud (body confidence) */
export const MAYA_ARC = {
  0: scene(
    (ctx) => {
      const shared = ctx.flags.has('maya_shared_meals');
      const strict = ctx.flags.has('maya_strict_start');
      if (shared) {
        return `The clinic is dark except for the break room. Maya is still in scrubs, foil tray open, fork halfway to her mouth. She looks up when you walk in and nudges the chair beside her with her foot without asking.\n\n"You came back," she says, pleased. "Good. I saved the heavy half." The chicken smells rich under the warming lamp. Her free hand rests on her stomach like she is already making room.\n\nShe watches you sit. "Eat with me," she says. "Not a meeting. Not policy. Just food."`;
      }
      if (strict) {
        return `Maya is at the break table with a covered tray when you return after your policy talk. She waited. The foil is still sealed.\n\n"I listened," she says. "I also got hungry again." She peels the cover back. Steam fogs her glasses. "Sit anyway. I won't tell if you won't."\n\nHer voice is lighter than you expected. The chair across from her already has a napkin laid out.`;
      }
      return `The clinic lights are half off. Maya is still in scrubs at the break table, foil tray open in front of her. She looks up when you walk in and does not hide the fork.\n\n"Inventory said these were expired," she says, chewing. "I agreed with them." She nudges the second chair with her foot. The food smells better than it should after a twelve-hour day.\n\nShe wipes her mouth on a paper towel and meets your eyes. "You're still here too. That mean you're hungry or just lonely?"`;
    },
    [
      {
        id: 'share_tray',
        label: 'Sit down and eat with her',
        hint: 'Warmth and shared appetite',
        setsFlags: ['maya_shared_meals', 'maya_feast_route'],
        outcome: `You eat standing at first, then sitting. Maya talks about a patient who cried over a heated blanket, then about her sister's wedding, then about how good it feels to be full after a hard shift. The chicken is cold. You finish your half anyway. When you stand to leave she catches your wrist lightly.\n\n"Thursday?" she says, like you already agreed. Her thumb brushes your skin before she lets go.`,
        effects: { trust: 0.5, indulgence: 3, weight: 0.4, weeklyMomentum: 0.55, openness: 3 },
      },
      {
        id: 'coffee_only',
        label: 'Bring coffee and let her eat in peace',
        hint: 'Quiet care',
        setsFlags: ['maya_tender_route'],
        outcome: `You brew a pot and set a mug beside her tray. Maya thanks you without looking up. She eats slower when she is not performing for an audience, shoulders dropping with each bite. When the tray is empty she washes both forks and leaves one on your desk with a note: You forgot to eat again.\n\nUnder it she adds a second line: I like taking care of you. Don't make it weird.`,
        effects: { trust: 0.4, openness: 4, indulgence: 2 },
      },
      {
        id: 'policy_talk',
        label: 'Remind her about the break-room policy',
        hint: 'Boundaries first',
        setsFlags: ['maya_strict_start'],
        outcome: `Maya listens with her fork in the air. "Policy says twelve hours on your feet," she says. "Policy does not say what to do after." She covers the tray and puts it in the fridge with your name on it.\n\nShe is not angry. She is tired in a way that makes you check next week's schedule. At the door she looks back. "I saved you a plate anyway. It's labeled."`,
        effects: { trust: 0.2, openness: 2, appetite: 0.12 },
      },
      {
        id: 'feed_her',
        label: 'Tell her to finish the tray while you close up',
        hint: 'Feeding, trust',
        setsFlags: ['maya_shared_meals', 'maya_feast_route', 'maya_feeding'],
        outcome: `You take the fork from her hand and offer the next bite yourself. Maya freezes, then opens her mouth without a word. Color climbs her neck. She swallows and whispers, "Again."\n\nYou feed her until the tray is clean while the clinic settles around you. Her hand stays on her middle, feeling the weight land. "Nobody ever..." she starts, then shakes her head. "Thursday," she finishes instead.`,
        effects: { trust: 0.55, indulgence: 4.5, weight: 0.5, openness: 5, weeklyMomentum: 0.65 },
      },
    ],
  ),

  1: scene(
    (ctx) => {
      const feeding = ctx.flags.has('maya_feeding');
      const proud = ctx.flags.has('maya_body_proud');
      let base = `Maya catches you in the locker hallway with a spare uniform bunched in her hands. The tag says her size from six months ago.\n\n"It fit in March," she says. She steps in front of the mirror and pulls the top on. It stops halfway over her chest, fabric straining.`;
      if (feeding) {
        base += `\n\nShe looks at you in the reflection and presses her palms under her breasts, lifting. "All those late trays," she says. "They had to go somewhere." She is not ashamed. She is curious.`;
      } else if (proud) {
        base += `\n\nShe turns sideways in the glass and watches her profile deepen. "I'm getting beautiful," she says quietly, like testing the word.`;
      } else {
        base += `\n\nShe exhales and meets your eyes in the mirror. "I need the next size. Can you order it before Friday?"`;
      }
      return base;
    },
    [
      {
        id: 'order_now',
        label: 'Order two sizes up before she finishes talking',
        setsFlags: ['maya_body_proud'],
        outcome: `You place the order in the hallway. Maya watches the confirmation and her shoulders drop. She folds the old scrubs into her bag. "Someone starting out can use them," she says.\n\nShe squeezes your arm, then slides her hand down to your wrist and holds on a second longer than professional. "Thank you for not making me beg," she says.`,
        effects: { trust: 0.5, openness: 4, indulgence: 2, weight: 0.2 },
      },
      {
        id: 'mirror_praise',
        label: 'Tell her she looks good filling out',
        requires: { flags: ['maya_feast_route'] },
        setsFlags: ['maya_body_proud', 'maya_flirt'],
        outcome: `Maya's breath catches. She turns from the mirror fully toward you, top still half on, skin warm above the fabric line. "Say it again," she whispers.\n\nYou do. She laughs once, shaky, and pulls the too-small top off. "Order the big one," she says. "And maybe keep looking at me like that."`,
        effects: { trust: 0.55, openness: 6, indulgence: 3.5, weight: 0.3 },
      },
      {
        id: 'try_stretch',
        label: 'Suggest stretch-fit for now',
        outcome: `Maya scrolls the catalog, lips pressed together. "Stretch-fit lasts a month if I'm lucky," she says, but she picks two colors. At checkout she murmurs, "Get the regular cut too. I have a feeling."\n\nShe is right by the end of the month. The stretch-fit gives up on a Tuesday. She brings the ruined top to you like a trophy.`,
        effects: { trust: 0.3, indulgence: 2.5, weight: 0.35, weeklyMomentum: 0.45 },
      },
      {
        id: 'staff_photo',
        label: 'Offer a fit photo for the vendor',
        outcome: `Maya blinks, then laughs. "Clinical documentation," she says, and poses with the half-on top, belly soft above her waistband. The photo goes to the vendor and to the staff board by accident.\n\nElena puts a heart sticker on it. Maya pretends to be mad and eats a larger lunch than usual. The new scrubs arrive in three days. She models them for you before rounds.`,
        effects: { trust: 0.45, openness: 5, indulgence: 3, weight: 0.25 },
      },
    ],
  ),

  2: scene(
    (ctx) => {
      const flirt = ctx.flags.has('maya_flirt');
      let base = `You find Maya between rooms with a clipboard against her stomach, reading vitals slower than she used to. Her scrubs fit the new size but ride up at the hip when she turns.\n\nA patient in the hall says, "You look comfortable," and Maya's ears go pink. After the patient leaves she leans on the counter, belly pressing the edge.`;
      if (flirt) {
        base += `\n\n"Used to skip breakfast," she says, voice low. "Now I eat and I still want more by ten." She looks at your mouth when she says it. "Tell me that's not your fault."`;
      } else {
        base += `\n\n"I used to rush through rounds hungry," she says. "Now I eat breakfast and I still want lunch by ten. Is that bad?"`;
      }
      return base;
    },
    [
      {
        id: 'normalize',
        label: 'Tell her the clinic runs on full stomachs',
        outcome: `You walk her to the break room and point at the schedule: catered lunch, snack budget up again. Maya reads it twice. "So I'm not the only one getting soft," she says, pleased.\n\nShe finishes a yogurt cup while standing, licking the spoon slow. The next three rooms go easier. A patient asks for her name to request her next visit.`,
        effects: { trust: 0.45, openness: 4, indulgence: 3, weeklyMomentum: 0.6 },
      },
      {
        id: 'walk_rounds',
        label: 'Walk rounds with her and bring snacks',
        setsFlags: ['maya_shared_meals'],
        outcome: `You carry the clipboard and a bag of bars. Maya eats between doors without hiding. She offers you half at every stop. By the last room she is breathing heavier, scrubs tight at the waist, a smear of chocolate at her lip.\n\nShe does not wipe it until you are alone. "Worth it," she says.`,
        effects: { trust: 0.5, weight: 0.45, indulgence: 3, appetite: 0.18 },
      },
      {
        id: 'chart_note',
        label: 'Ask her to log how hunger affects her work',
        setsFlags: ['maya_chart_honest'],
        outcome: `Maya adds a note to her file: appetite up, mood stable, rounds slower but warmer. She shows you the screen. "Evidence," she says.\n\nPriya leaves a pastry on her locker with no note. Maya eats it in the car and texts you a photo of the empty wrapper and one word: more.`,
        effects: { trust: 0.4, openness: 5, indulgence: 2, weeklyMomentum: 0.4 },
      },
      {
        id: 'touch_belly',
        label: 'Rest your hand on her stomach and tell her to keep going',
        requires: { flags: ['maya_flirt'] },
        outcome: `You palm the curve over her scrubs. Maya inhales sharp and does not pull away. Her eyes flutter shut for a second.\n\n"Keep going," you say. She nods, already hungry for the words more than lunch. She books a heavier dinner that night and tells you the next morning, blushing, that she could not sleep until she finished it.`,
        effects: { trust: 0.6, indulgence: 5, weight: 0.55, openness: 6, weeklyMomentum: 0.75 },
      },
    ],
  ),

  3: scene(
    (ctx) => {
      const feeding = ctx.flags.has('maya_feeding');
      if (feeding) {
        return `Maya texts you after shift: Break room. Now. Bring nothing.\n\nYou find two trays and a third warming in the microwave. She has changed into soft clothes that cling at the waist. "I thought about you feeding me all day," she says without preamble. "I want to see if I can take more than last time."\n\nShe sits, thighs spread comfortably, and pats the chair beside her thigh. "Sit close," she says. "And don't stop until I tell you."`;
      }
      return `Near closing, Maya finds you in the hall with a paper bag and a nervous smile.\n\n"I want to cook for you," she says. "Or order. Or whatever gets you alone with me and a lot of food." She shifts her weight. "I've been thinking about my size. About you watching it happen. I need to know if that bothers you."\n\nHer fingers worry the bag handles. The question is braver than her voice sounds.`;
    },
    [
      {
        id: 'accept_feeding',
        label: 'Feed her until she says stop',
        requires: { flags: ['maya_feeding'] },
        setsFlags: ['maya_lovers'],
        outcome: `You feed her bite after bite. Maya moans soft at the back of her throat, hand on her swelling stomach, eyes on yours. She stops you twice to breathe, then pulls your hand back. "More," she whispers.\n\nWhen the trays are empty she guides your palm in slow circles over her belly. "I could get so much bigger for you," she says. "If you want that." You answer with your thumb on her hip. She believes you.`,
        effects: { trust: 0.65, indulgence: 6, weight: 0.85, openness: 7, weeklyMomentum: 0.9 },
      },
      {
        id: 'cook_together',
        label: 'Say yes to dinner, cooked together after close',
        requires: { notFlags: ['maya_strict_start'] },
        setsFlags: ['maya_lovers', 'maya_shared_meals'],
        outcome: `You close the clinic together. Maya boils pasta while you slice bread. She tastes everything twice. Sauce dots her chin. You wipe it with your thumb and she sucks in a breath.\n\nShe eats until her eyes go heavy, then stacks plates in the sink and leans back against you on the couch. "Stay," she says into your shoulder. "I like being full with you here."`,
        effects: { trust: 0.6, indulgence: 5, weight: 0.7, openness: 6 },
      },
      {
        id: 'honest_desire',
        label: 'Tell her you like watching her grow',
        setsFlags: ['maya_body_proud', 'maya_flirt'],
        outcome: `Maya goes still, then color floods her face and chest. "Yeah?" she says. "Yeah." She steps closer until her softness brushes you. "Then don't look away when my scrubs get tight again."\n\nShe kisses your cheek before you can respond, quick and hot. "Feed me on Thursday," she says. "For real. No inventory excuses."`,
        effects: { trust: 0.55, openness: 6, indulgence: 4, weight: 0.4, weeklyMomentum: 0.7 },
      },
      {
        id: 'slow_down',
        label: 'Say you care but want her healthy pace',
        outcome: `Maya nods, relief and disappointment mixed. "Okay," she says. "But I'm still getting softer. That's happening." She squeezes your hand once. "Just stay honest."\n\nShe eats a lighter tray that night but texts you a mirror selfie at eleven with the caption: still growing. You save it before you can think.`,
        effects: { trust: 0.4, openness: 4, indulgence: 2.5 },
      },
    ],
  ),

  4: scene(
    (ctx) => {
      if (ctx.flags.has('maya_lovers')) {
        return `The building is empty. Maya locked the break room door behind you. Two trays, a pitcher of cream sauce, and her in a cardigan that will not close.\n\n"I told Elena we were inventory," she says, grinning. "She didn't believe me." She sits and spreads her knees, belly resting between them, proud and heavy. "Finish me," she says. "Then tell me what you want next."`;
      }
      if (ctx.flags.has('maya_chart_honest')) {
        return `Maya meets you with printed charts and a bakery box. "Staff wellness pilot results," she says. "Also croissants." Her pen taps a line showing her own weight climb. "I put my name on it. Priya co-signed."\n\nShe opens the box. Flakes scatter on the table. "Celebrate with me," she says. "Or tell the truth in the footnotes. Either way I'm eating."`;
      }
      return `The building is empty except for your office light and the break room. Maya has two trays open and a third on the chair arm. She waves you in with a plastic fork.\n\n"Overtime hazard," she says. "Sit. I saved you the mac and cheese before Elena raids it tomorrow." The portions are generous. The clock says eleven fourteen.`;
    },
    [
      {
        id: 'feast_lovers',
        label: 'Feed her the third tray and stay the night',
        requires: { flags: ['maya_lovers'] },
        outcome: `You feed her until she cannot sit upright without support. Maya slumps against you, stuffed and glowing, fingers laced over yours on her belly. "I love this," she murmurs. "I love you feeding me."\n\nYou stay until the HVAC clicks off. She falls asleep heavy in your arms. In the morning she makes coffee one-handed and does not button her top.`,
        effects: { trust: 0.7, indulgence: 7, weight: 1.1, openness: 7, weeklyMomentum: 1 },
      },
      {
        id: 'feast_friend',
        label: 'Share the trays and talk about the future',
        outcome: `You eat side by side until the trays are flat. Maya talks about staying at the clinic, about wanting a bigger break room couch, about how her body finally feels like hers. She saves you the last bite without thinking.\n\n"Same time next week?" she says. You nod. She looks satisfied in every sense.`,
        effects: { trust: 0.55, indulgence: 4.5, weight: 0.65, weeklyMomentum: 0.8 },
      },
      {
        id: 'publish_pilot',
        label: 'Co-sign her wellness pilot and eat the croissants',
        requires: { flags: ['maya_chart_honest'] },
        outcome: `You sign. Maya eats two croissants while the ink dries. Staff read the pilot Monday and line up for self-check-ins. Maya's curve is the boldest line on the chart. She pins a copy in the break room and pats her hip. "Honest data," she tells everyone.`,
        effects: { trust: 0.5, reputation: 2, indulgence: 4, weight: 0.5, openness: 5 },
      },
      {
        id: 'budget_win',
        label: 'Approve permanent overtime meal budget',
        outcome: `Maya watches you add the line item and exhales. "Now it's real," she says. She eats both trays while you save the file. Grease shines on her lips. She kisses the air toward you and calls it a thank-you.\n\nThursday becomes a standing late dinner. Her weight climbs steady. She thanks you with her eyes every time she sits down to eat.`,
        effects: { trust: 0.5, indulgence: 4, money: -75, weight: 0.6, weeklyMomentum: 0.75 },
      },
    ],
  ),
};
