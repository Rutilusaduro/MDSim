import { scene } from './shared.js';

/** Nadia Volkov - "Manager on a Meal Plan" - routes: budget (snack budgets), boss (power dynamic), lovers (leading by example) */
export const NADIA_ARC = {
  0: scene(
    (ctx) => {
      const budget = ctx.flags.has('nadia_budget');
      const boss = ctx.flags.has('nadia_boss_route');
      if (budget) {
        return `The manager's office smells like takeout again. Nadia Volkov has the door propped with a box of pastries and a spreadsheet glowing behind her. She waves you in without looking up.\n\n"Snack line came in under budget," she says, pleased, tapping a cell. "So I reinvested." Three containers sit open on her desk, one already half gone. She spins her chair toward you and props her feet on the drawer. "Sit. I don't do lunch alone anymore. Bad for morale."\n\nShe pushes the biggest container an inch in your direction, then decides against it and pulls it back to her side of the desk.`;
      }
      if (boss) {
        return `Nadia's office door is closed, blinds down, the little OCCUPIED sign flipped. When you knock she calls you in and does not stand. She is behind the desk with a tray balanced on the arm of her chair, blazer open, one button undone since morning.\n\n"Close it behind you," she says. "I run this clinic on two things: numbers and lunch. You're about to learn how I protect both." She gestures to the chair across from her with her fork. "Sit where I can see you eat."`;
      }
      return `You find Nadia Volkov in her office past six, blazer draped over the chair, a paper bag from the good deli open on the desk. She is the manager, and she eats like a manager: efficiently, and a lot.\n\n"Budget review ran long," she says, mouth half full, not embarrassed. "I ordered for two on purpose." She nudges the second sandwich across the desk with one manicured finger. "I hate eating in front of people who won't join me. Makes me feel watched."\n\nShe leans back. The chair creaks. "So. Are you watching, or are you eating?"`;
    },
    [
      {
        id: 'closed_door_lunch',
        label: 'Close the door and share the deli order',
        hint: 'Warmth and shared appetite',
        setsFlags: ['nadia_budget', 'nadia_feeding'],
        outcome: `You shut the door and take the second sandwich. Nadia relaxes the moment the latch clicks, kicking her heels off under the desk. She talks numbers between bites, then stops talking numbers entirely, then just eats with you in the low lamp light.\n\n"This is the first time all day nobody wanted anything from me," she says, wiping mustard from her thumb. She finishes hers and eyes the last quarter of yours. "Closed door, standing order. Same time tomorrow. That an order, not a question."`,
        effects: { trust: 0.5, indulgence: 3, weight: 0.4, weeklyMomentum: 0.55, openness: 3 },
      },
      {
        id: 'approve_budget',
        label: 'Ask about the snack budget she keeps growing',
        hint: 'Numbers and provision',
        setsFlags: ['nadia_budget', 'nadia_boss_route'],
        outcome: `Nadia pulls up the ledger and turns the monitor toward you. The snack line has doubled since spring, each increase initialed in her tidy hand. "Happy staff, low turnover," she says. "The pastries pay for themselves."\n\nShe scrolls to a highlighted row. "And I test everything I order. Quality control." She pats her stomach where the blazer no longer closes. "The budget's been very good to me. Approve the next bump and I'll cut you in on the tasting."`,
        effects: { trust: 0.4, openness: 3, indulgence: 2, appetite: 0.12 },
      },
      {
        id: 'boundaries_first',
        label: 'Note that management skips too many real breaks',
        hint: 'Boundaries first',
        setsFlags: ['nadia_boss_route'],
        outcome: `Nadia sets the sandwich down and folds her hands. "You're right. I eat at my desk because I never leave it." She says it like a diagnosis, not a defense. "So the desk gets the lunch. That's the compromise I've made with myself."\n\nShe wraps the second sandwich and sets it in her mini fridge with a sticky note bearing your name. "For when you stop lecturing and start joining. It'll keep." Her mouth twitches toward a smile.`,
        effects: { trust: 0.2, openness: 2, appetite: 0.1 },
      },
      {
        id: 'feed_the_boss',
        label: 'Tell her to keep eating while you handle the door',
        hint: 'Feeding, trust',
        setsFlags: ['nadia_budget', 'nadia_boss_route', 'nadia_feeding'],
        outcome: `You flip the OCCUPIED sign and lean against the door. "Finish it," you tell her. "I've got the room." Nadia blinks at being managed for once. Then something in her shoulders drops and she picks the sandwich back up.\n\nShe eats slower with you guarding the door, savoring it, a woman who never gets to be off duty. "Nobody tells me to sit and eat," she murmurs, licking her fingertip. "Do it again tomorrow." Her hand settles on the swell of her middle. "I could get used to being looked after."`,
        effects: { trust: 0.55, indulgence: 4.5, weight: 0.5, openness: 5, weeklyMomentum: 0.65 },
      },
    ],
  ),

  1: scene(
    (ctx) => {
      const feeding = ctx.flags.has('nadia_feeding');
      const boss = ctx.flags.has('nadia_boss_route');
      let base = `Nadia calls you into her office during the morning meeting prep. Her blazer is on the coat hook, abandoned. The button gave up sometime last week and she stopped fighting it.\n\n"I ordered new suiting," she says, standing to show you. The blouse pulls at the buttons across a softer stomach than the one that ran last quarter's review. She turns, unhurried.`;
      if (feeding) {
        base += `\n\n"All those closed-door lunches," she says, running a palm down the strained placket. "They found a home." She catches you looking and does not tug the fabric straight. "Say something useful."`;
      } else if (boss) {
        base += `\n\n"A manager should look like she's thriving," she says, planting a hand on her hip. "Lean and hungry reads like the clinic can't feed its own. I'd rather look fed." She waits for you to agree.`;
      } else {
        base += `\n\nShe sighs at the mirror. "I need the next size ordered on the corporate card. Before the board photo Friday. Can you make that quiet and quick?"`;
      }
      return base;
    },
    [
      {
        id: 'order_up',
        label: 'Order the next size on the clinic account',
        setsFlags: ['nadia_public'],
        outcome: `You place the order and expense it under staff uniforms. Nadia watches the confirmation and exhales. "Good. Efficient." She folds the too-small blouse and drops it in the donation bin without ceremony.\n\nThen she pauses, hand on the bin. "Order a size beyond that too. Hold it in the closet." She meets your eyes, daring you to ask why. You don't. She looks grateful and a little thrilled that you understood.`,
        effects: { trust: 0.5, openness: 4, indulgence: 2, weight: 0.2 },
      },
      {
        id: 'praise_thriving',
        label: 'Tell her the clinic looks well-run on her',
        requires: { flags: ['nadia_budget'] },
        setsFlags: ['nadia_public', 'nadia_flirt'],
        outcome: `Nadia's chin lifts. "Well-run," she repeats, tasting it. She smooths both hands over her middle, deliberate now, letting the buttons strain. "That's exactly the message. Prosperity. Provision." Her voice drops. "Say it plainer, though. Off the record."\n\nYou tell her she looks good getting bigger. Her ears go pink above her collar. "Order the roomy cut," she says, already reaching for a pastry from the meeting tray. "And keep your assessments to yourself. Or to me."`,
        effects: { trust: 0.55, openness: 6, indulgence: 3.5, weight: 0.3 },
      },
      {
        id: 'discreet_tailor',
        label: 'Suggest a tailor with stretch panels for now',
        outcome: `Nadia scrolls the tailor's site, lips pursed like a negotiation. "Stretch panels buy me a month," she says, but she orders two suits anyway. At checkout she adds, "Get the pull-on trousers as well. I have a feeling about the quarter."\n\nShe is right. The panels surrender by month's end during a vendor call. She brings you the split seam like a status report. "Reorder," she says. "Bigger. The clinic's doing well and so am I."`,
        effects: { trust: 0.3, indulgence: 2.5, weight: 0.35, weeklyMomentum: 0.45 },
      },
      {
        id: 'board_photo',
        label: 'Offer to reschedule the board photo',
        outcome: `Nadia waves it off. "No. I'll take the photo as I am." She stands for it that Friday, softer and prouder, one hand resting on her stomach where the blazer parts. The board comments that she looks confident. She emails you the proof with a single line: Confidence photographs well.\n\nShe orders a celebratory lunch afterward, two entrees, and eats both at her desk with the door open for once. The new suits arrive Monday. She models the tightest one for you before rounds.`,
        effects: { trust: 0.45, openness: 5, indulgence: 3, weight: 0.25 },
      },
    ],
  ),

  2: scene(
    (ctx) => {
      const flirt = ctx.flags.has('nadia_flirt');
      let base = `Staff meeting runs at ten. Nadia arrives last, carrying a sheet cake she ordered "for morale," and sets it at the head of the table like an agenda item. She cuts herself the corner piece with the most frosting before anyone else moves.\n\n"Eat while I talk," she tells the room, and eats while she talks. By the third slide she has gone back for a second slice. Nobody comments. The snack budget speaks for itself.`;
      if (flirt) {
        base += `\n\nAfter, she lingers at the cake with you. "I used to run these meetings on black coffee," she says, low, licking frosting off her fork. "Now I run them on this. And I lead better full." She looks at your mouth. "Tell me that's a good management decision."`;
      } else {
        base += `\n\nAfter the room clears she stays at the cake with you. "I used to run on coffee and adrenaline," she says. "Now I actually eat during meetings and I think clearer. Is that a problem, or is that leadership?"`;
      }
      return base;
    },
    [
      {
        id: 'lead_by_example',
        label: 'Tell her the whole staff eats better watching her',
        outcome: `You point out what she has built: the catered tray, the standing cake order, three staff who stopped skipping lunch because the manager stopped skipping it first. Nadia reads the room in her head and smiles. "Leading by example," she says. "I like that framing."\n\nShe cuts a third slice, unhurried, and eats it standing while the intern refills the tray. "Then I'll keep setting the example," she says, patting the curve of her stomach. "Someone has to go first."`,
        effects: { trust: 0.45, openness: 4, indulgence: 3, weeklyMomentum: 0.6 },
      },
      {
        id: 'standing_cake',
        label: 'Add a standing cake order to every staff meeting',
        setsFlags: ['nadia_budget'],
        outcome: `You add the line item and forward it for her signature. Nadia signs before you finish the sentence. "Weekly. The good bakery, not the grocery sheet cakes." She eats another corner piece to celebrate the approval.\n\nThe meetings get longer and warmer after that. Nadia always takes the first and biggest slice, and always the last. Her blazers stop closing entirely. She stops bringing them.`,
        effects: { trust: 0.5, weight: 0.45, indulgence: 3, appetite: 0.18 },
      },
      {
        id: 'log_it',
        label: 'Suggest she document the morale-and-meals link',
        setsFlags: ['nadia_chart_honest'],
        outcome: `Nadia drafts a memo: catering up, absenteeism down, manager morale "measurably improved." She adds, dry, a footnote about her own expanding wardrobe budget. She shows you the screen. "Evidence," she says.\n\nThe next morning a bakery box sits on her desk from an anonymous staffer. She eats two before the meeting and texts you a photo of the empty box: The data speaks for itself.`,
        effects: { trust: 0.4, openness: 5, indulgence: 2, weeklyMomentum: 0.4 },
      },
      {
        id: 'private_slice',
        label: 'Cut her a bigger slice and tell her to keep going',
        requires: { flags: ['nadia_flirt'] },
        outcome: `You slide the knife deep and lift a corner slab onto her plate, more than she'd cut herself. Nadia raises an eyebrow, then takes the fork you offer. "Managing the manager," she murmurs, and eats it anyway, every bite, with you watching.\n\n"Keep going," you tell her, and cut another. Her breath catches. She finishes that too, hand pressed to her tightening waistband. That night she books a heavy dinner and confesses the next morning, flushed, that she could not stop thinking about the cake, or your hands on the knife.`,
        effects: { trust: 0.6, indulgence: 5, weight: 0.55, openness: 6, weeklyMomentum: 0.75 },
      },
    ],
  ),

  3: scene(
    (ctx) => {
      const feeding = ctx.flags.has('nadia_feeding');
      if (feeding) {
        return `Nadia texts you after close: My office. Door's already locked. Bring your appetite for watching.\n\nYou find the blinds down and the desk cleared except for food, a spread ordered on the corporate card and expensed as "leadership retreat, party of one." She has changed into a soft dress that stopped hiding her stomach weeks ago. "I thought about you feeding me through the entire budget call," she says. "I want to see how much your manager can take."\n\nShe lowers herself into the big chair, thighs spread, and pats the arm of it. "Sit close. And don't let me stop early. That's your only job tonight."`;
      }
      return `Near closing, Nadia flags you into her office and shuts the door herself. There is a bakery box on the desk and an uncertainty on her face you have never seen in a meeting.\n\n"I want a real dinner with you," she says. "Not a working lunch. Not morale. Me, off the clock, eating too much on purpose while you watch me do it." She smooths her blouse over a stomach that keeps outgrowing her plans. "I've been getting bigger since you started joining me. I need to know if that's a problem for you, because it isn't for me."\n\nHer hand rests on the box lid. The question costs her more than she lets on.`;
    },
    [
      {
        id: 'accept_feeding',
        label: 'Feed her past every point she would stop',
        requires: { flags: ['nadia_feeding'] },
        setsFlags: ['nadia_lovers'],
        outcome: `You feed her from the arm of her own chair, bite after bite, the manager who commands the whole clinic surrendering the pace to you. Nadia sighs low in her throat, one hand splayed on her swelling stomach, eyes locked on yours. She tries to wave off a container and you push it closer. "More," she breathes.\n\nWhen the desk is bare she guides your palm in slow circles over her full belly. "I could run this clinic twice this size," she says. "Get me there. That's a directive." You answer with your thumb at her hip, and for once she takes the order instead of giving it.`,
        effects: { trust: 0.65, indulgence: 6, weight: 0.85, openness: 7, weeklyMomentum: 0.9 },
      },
      {
        id: 'dinner_off_clock',
        label: 'Say yes to a real dinner, off the clock',
        requires: { notFlags: ['nadia_boss_route'] },
        setsFlags: ['nadia_lovers', 'nadia_budget'],
        outcome: `You take her out somewhere with cloth napkins and no spreadsheets. Nadia orders like she means it, two courses and then a third when you nod. Sauce catches at the corner of her mouth and you reach across to wipe it. She stills under your thumb.\n\nShe eats until her dress goes tight and her eyes go soft, then leans into your side in the car. "No agenda," she says against your shoulder. "I forgot I was allowed to just be full and happy. Keep reminding me."`,
        effects: { trust: 0.6, indulgence: 5, weight: 0.7, openness: 6 },
      },
      {
        id: 'honest_desire',
        label: 'Tell her you love watching her outgrow her suits',
        setsFlags: ['nadia_public', 'nadia_flirt'],
        outcome: `Nadia goes still, then heat climbs her neck and chest. "Yeah?" she says, unguarded for once. "Yeah." She steps around the desk until her softness presses against you. "Then don't look away next time the buttons go. I plan to keep giving them reason to."\n\nShe kisses your cheek, quick and warm, all the manager's polish gone. "Dinner Thursday," she says. "For real. I'll clear the whole evening. And the whole menu."`,
        effects: { trust: 0.55, openness: 6, indulgence: 4, weight: 0.4, weeklyMomentum: 0.7 },
      },
      {
        id: 'steady_pace',
        label: 'Say you are in, at whatever pace feels good',
        outcome: `Nadia nods, relief and something warmer moving over her face. "Okay," she says. "But understand, I'm still getting softer either way. That decision's made." She squeezes your hand once, firm, a handshake that became something else. "Just stay honest with me."\n\nShe eats a lighter box that night but texts you a mirror photo at eleven, blazer open over a rounder middle, captioned: still growing the clinic. And me. You save it before you can talk yourself out of it.`,
        effects: { trust: 0.4, openness: 4, indulgence: 2.5 },
      },
    ],
  ),

  4: scene(
    (ctx) => {
      if (ctx.flags.has('nadia_lovers')) {
        return `The clinic is dark and the office door is locked from the inside. Nadia has the desk covered end to end, a spread expensed under a line item only she can approve. She wears a robe that will not begin to close, belly resting heavy and proud in her lap.\n\n"I told the board I was working late on the annual review," she says, grinning. "I am, technically." She spreads her knees and pats the chair beside her. "Finish me off. Then tell me what we grow next, you and me and this ridiculous snack budget."`;
      }
      if (ctx.flags.has('nadia_chart_honest')) {
        return `Nadia meets you with a bound report and a two-tier cake. "Annual wellness and morale figures," she says. "Also, I bribed the bakery." Her pen taps a chart where absenteeism drops as catering climbs, and beside it, in a footnote she left in on purpose, her own steadily rising numbers.\n\nShe cuts the first slice, the biggest, of course. "Celebrate the results with me," she says. "I signed my name to all of it. Including the parts about the manager setting the example."`;
      }
      return `The building is empty except for the office lamp. Nadia has two takeout spreads open on the desk and a third bag on the guest chair. She waves you in with a plastic fork.\n\n"Year-end surplus," she says. "The snack line came in flush again, so we're not letting it go to waste." She nudges a container toward you and keeps the two largest for herself. The portions are managerial. The clock reads eleven fourteen.`;
    },
    [
      {
        id: 'feast_lovers',
        label: 'Feed her the last of it and stay the night',
        requires: { flags: ['nadia_lovers'] },
        outcome: `You feed her until she cannot rise from the chair without your arm. Nadia slumps back, stuffed and glowing, her fingers laced over yours on the dome of her belly. "I built a whole career on control," she murmurs. "And this is the best I've felt losing it."\n\nYou stay until the building's systems click off around you. She dozes heavy against your shoulder, and in the morning she runs the clinic one-handed, robe still open, and cuts the standing budget increase before her first coffee.`,
        effects: { trust: 0.7, indulgence: 7, weight: 1.1, openness: 7, weeklyMomentum: 1 },
      },
      {
        id: 'feast_partners',
        label: 'Split the surplus and plan next year together',
        outcome: `You eat side by side until the containers are scraped flat. Nadia talks about a bigger break room, a permanent catering vendor, a chair for her office that "accommodates a thriving manager." She saves you the last dumpling without thinking about it.\n\n"Same time next quarter close," she says, patting her full middle. "Longer, if the numbers stay this good." They will. She'll make sure of it.`,
        effects: { trust: 0.55, indulgence: 4.5, weight: 0.65, weeklyMomentum: 0.8 },
      },
      {
        id: 'publish_wellness',
        label: 'Co-sign her morale report and cut the cake',
        requires: { flags: ['nadia_chart_honest'] },
        outcome: `You sign beneath her name. Nadia eats two slices while the ink dries, then pins the report to the staff board with the footnote intact. Staff read it Monday and stop apologizing for their lunches. Nadia's own numbers are the boldest line on the chart, and she points to them at the next meeting with pride, one hand on the hip that outgrew last year's suit.`,
        effects: { trust: 0.5, reputation: 2, indulgence: 4, weight: 0.5, openness: 5 },
      },
      {
        id: 'permanent_budget',
        label: 'Approve a permanent expanded snack budget',
        outcome: `Nadia watches you add the line item and lock it in as recurring. "Now it's structural," she says, satisfied. She eats both large spreads while you save the file, grease shining on her fingers, and signs the approval with the other hand.\n\nClosed-door lunches become a standing fixture on the calendar. Her weight climbs steady with the budget, and every time she settles into her reinforced chair to eat, she thanks you with a look that no memo could hold.`,
        effects: { trust: 0.5, indulgence: 4, money: -75, weight: 0.6, weeklyMomentum: 0.75 },
      },
    ],
  ),
};
