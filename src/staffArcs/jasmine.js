import { scene } from './shared.js';

/** Jasmine Brooks - "Needle and Dough" - routes: donut (draw rewards), lab (meal-planned lab days), lovers (feeding) */
export const JASMINE_ARC = {
  0: scene(
    (ctx) => {
      const donut = ctx.flags.has('jasmine_donut');
      const lab = ctx.flags.has('jasmine_lab_route');
      if (donut) {
        return `The phlebotomy station is quiet after the morning rush. Jasmine Brooks sits on her stool with a pink bakery box balanced on the supply cart, gloves off, a donut already in hand.\n\n"Twelve clean draws before ten," she says around a mouthful, grinning. "That's a two-donut morning, minimum." She licks glaze off her thumb and nudges the box toward you with her elbow. "Sit. I don't celebrate a good run alone anymore. Bad luck."\n\nThe stool beside hers has a napkin waiting on it, and the biggest donut in the box is sitting right on top, like it's been set aside on purpose.`;
      }
      if (lab) {
        return `Lab day, and Jasmine has the whole schedule taped to the cabinet with meals penciled between blood draws. She looks up from a vacutainer rack when you walk in, cheeks already fuller than the badge photo clipped to her scrubs.\n\n"Mapped the whole shift," she says, tapping the sheet. "Draw block, then donuts. Draw block, then noodles. I run smoother when I'm fed, and I draw better with something to look forward to." She snaps a fresh glove. "Pull up the stool. You're on my meal plan now whether you like it or not."`;
      }
      return `You find Jasmine Brooks reorganizing the phlebotomy tray at the end of a long lab day, a half-eaten donut parked on a paper towel beside the tourniquets. She is the clinic's best stick, and she runs on sugar.\n\n"Nervous patient this morning," she says, not hiding the donut. "Told him if he held still I'd eat one in solidarity. He held still. Deal's a deal." She wipes glaze from her lip with the back of her wrist. "There's a whole box in the break room going stale. Feels like a crime to let it."\n\nShe spins on her stool to face you. "So. You gonna help me commit it, or just watch?"`;
    },
    [
      {
        id: 'share_the_box',
        label: 'Grab the box and celebrate the clean run with her',
        hint: 'Warmth and shared appetite',
        setsFlags: ['jasmine_donut', 'jasmine_feeding'],
        outcome: `You bring the box over and take the stool beside hers. Jasmine lights up, peeling back the lid to show you the good ones. She talks between bites, about a toddler who didn't cry, about a hard vein she finally caught, about how a draw always goes easier when there's a donut waiting at the end.\n\nShe finishes hers and eyes the last bite of yours. "Standing tradition now," she decides, brushing crumbs off her scrubs where they've gone snug at the waist. "Good run, we split a box. Bad run, we split two. I already know which one I'm hoping for."`,
        effects: { trust: 0.5, indulgence: 3, weight: 0.4, weeklyMomentum: 0.55, openness: 3 },
      },
      {
        id: 'plan_lab_day',
        label: 'Ask how she keeps her energy up through lab days',
        hint: 'Meal-planned draws',
        setsFlags: ['jasmine_donut', 'jasmine_lab_route'],
        outcome: `Jasmine pulls the schedule off the cabinet and walks you through it. Every draw block has a snack penciled after it, every lunch bracketed by rewards. "Blood sugar's real," she says, mostly joking. "I stick better fed. Nobody wants a shaky phlebotomist."\n\nShe taps the last block of the day. "That one's donuts, always. End on a high note." She pats her stomach where the scrubs pull. "The plan's been working. On the numbers, and on me. Want in? I'll pencil you a seat."`,
        effects: { trust: 0.4, openness: 3, indulgence: 2, appetite: 0.12 },
      },
      {
        id: 'clean_station_first',
        label: 'Remind her the station has to stay sterile',
        hint: 'Boundaries first',
        setsFlags: ['jasmine_lab_route'],
        outcome: `Jasmine holds up sticky hands in mock surrender. "Fair. Food stays off the tray." She caps the sharps, wipes the counter down twice, and moves the donut to the far break room where the rules let her. "Better?"\n\nShe wraps the box and tucks it in the fridge with a sticky note in loopy handwriting: SHARE w/ me, do NOT let go stale. Your name is on it. "For when you're off the clock and done being responsible," she says, grinning.`,
        effects: { trust: 0.2, openness: 2, appetite: 0.1 },
      },
      {
        id: 'feed_her_first',
        label: 'Hand her the biggest donut and tell her she earned it',
        hint: 'Feeding, trust',
        setsFlags: ['jasmine_donut', 'jasmine_lab_route', 'jasmine_feeding'],
        outcome: `You lift the biggest donut out of the box and hold it out to her. "Twelve clean sticks," you say. "You earned this one." Jasmine blinks, then takes it from your hand instead of the box, and something about being handed it directly makes her flush.\n\nShe eats it slow, glaze on her fingers, watching you watch her. "Nobody ever picks the big one out for me," she says, licking her thumb clean. "Do that again tomorrow." Her free hand rests on her stomach, feeling it settle. "I could get real used to being rewarded like this."`,
        effects: { trust: 0.55, indulgence: 4.5, weight: 0.5, openness: 5, weeklyMomentum: 0.65 },
      },
    ],
  ),

  1: scene(
    (ctx) => {
      const feeding = ctx.flags.has('jasmine_feeding');
      const lab = ctx.flags.has('jasmine_lab_route');
      let base = `Jasmine flags you down by the supply closet, tugging at the hem of her scrub top. It sits higher than it used to, riding up over a rounder middle every time she reaches for the top shelf.\n\n"These shrank," she says, not believing it herself. She rolls the waistband down and it rolls right back up. "Or I didn't. One of those."`;
      if (feeding) {
        base += `\n\nShe pats the soft curve peeking below the hem and grins. "All those donut rewards," she says. "I know exactly where they went. Look." She lifts her arms to show the top pull tight across her. "Say something honest."`;
      } else if (lab) {
        base += `\n\n"I draw better with a little cushion, apparently," she jokes, patting her stomach. "Steadier hands, steadier stool. But I need scrubs that'll button. Can you order me the next size?"`;
      } else {
        base += `\n\nShe sighs and smooths the top down. "I need the next size ordered before the health fair Friday. Can you make it quick and not make it a thing?"`;
      }
      return base;
    },
    [
      {
        id: 'order_scrubs_up',
        label: 'Order the next size of scrubs right away',
        setsFlags: ['jasmine_public'],
        outcome: `You put the order in from the closet. Jasmine reads the confirmation over your shoulder and exhales. "Thank you. No lecture, no weird look." She peels off the tight top and balls it up. "Someone new can have these."\n\nThen she pauses. "Actually, order the size past that too. Keep it in the closet." She meets your eyes, half a dare, half hope. You don't ask. She looks relieved, and a little delighted, that you just knew.`,
        effects: { trust: 0.5, openness: 4, indulgence: 2, weight: 0.2 },
      },
      {
        id: 'praise_the_cushion',
        label: 'Tell her the softness looks good on her',
        requires: { flags: ['jasmine_donut'] },
        setsFlags: ['jasmine_public', 'jasmine_flirt'],
        outcome: `Jasmine's grin falters into something warmer. "Good on me," she echoes, and runs both hands down her stomach where the top strains. "You mean that, or you being nice?" You mean it, and you say so plainer. Her cheeks go pink to the ears.\n\n"Order the roomy cut," she says, already reaching into her pocket for a wrapped donut she'd been saving. She takes a bite right in front of you, deliberate, watching your face. "And keep noticing. I like when you notice."`,
        effects: { trust: 0.55, openness: 6, indulgence: 3.5, weight: 0.3 },
      },
      {
        id: 'stretch_scrubs',
        label: 'Suggest the stretch-waist scrubs for now',
        outcome: `Jasmine scrolls the catalog, chewing her lip. "Stretch waist buys me maybe a month," she says, but she orders two sets anyway. "Add the drawstring pants too. I've got a feeling about how this quarter's going."\n\nShe's right. The stretch gives out mid-draw on a Thursday, a quiet little seam-pop nobody else hears. She shows you the split like a badge. "Reorder," she says, patting her stomach. "Bigger. The donut plan's working."`,
        effects: { trust: 0.3, indulgence: 2.5, weight: 0.35, weeklyMomentum: 0.45 },
      },
      {
        id: 'health_fair',
        label: 'Offer to swap her off the health fair booth',
        outcome: `Jasmine waves you off. "No way, I love the fair." She works the booth Friday in her snug scrubs, rounder and beaming, drawing samples faster than anyone. A regular tells her she looks happy and healthy. She emails you a photo of the booth with the caption: best sticker in the building.\n\nShe eats two donuts on her break in plain view and offers passersby the box. The new scrubs arrive Monday. She models the tightest set for you before her first draw.`,
        effects: { trust: 0.45, openness: 5, indulgence: 3, weight: 0.25 },
      },
    ],
  ),

  2: scene(
    (ctx) => {
      const flirt = ctx.flags.has('jasmine_flirt');
      let base = `Midday lab rush, and Jasmine works the chair with a donut box open on the far counter, well clear of the sterile field. Between patients she wheels her stool over, takes a bite, wheels back. The rhythm is practiced.\n\nHer scrubs pull when she leans for a fresh needle, and the stool creaks under her a little more than it did last month. She doesn't seem to notice. A patient thanks her for the painless stick and she rewards herself with another bite the second they're gone.`;
      if (flirt) {
        base += `\n\nShe catches you watching and rolls close on the stool, knee brushing yours. "Draw, donut, repeat," she says, low, glaze at the corner of her mouth. "Best system I ever built. I stick clean and I get softer doing it." She looks at your lips. "Tell me that's not the smartest workflow in this clinic."`;
      } else {
        base += `\n\nShe rolls close on the stool and offers you the box. "Draw, donut, repeat," she says. "I used to white-knuckle these rushes. Now I reward every clean stick and I've never worked better. That a problem, or am I onto something?"`;
      }
      return base;
    },
    [
      {
        id: 'endorse_system',
        label: 'Tell her the reward system is why she is the best stick',
        outcome: `You lay it out for her: fewer redraws, calmer patients, a phlebotomist who actually looks forward to a full rack. Jasmine glows at the tally. "See? Onto something." She takes a triumphant bite and wheels back to the chair for the next patient.\n\nBy afternoon she's gone through the box and patted her fuller stomach twice, satisfied. "Best workflow in the building," she says, quoting herself. "I'll keep proving it, one donut at a time."`,
        effects: { trust: 0.45, openness: 4, indulgence: 3, weeklyMomentum: 0.6 },
      },
      {
        id: 'stock_the_box',
        label: 'Set up a standing donut delivery for lab days',
        setsFlags: ['jasmine_donut'],
        outcome: `You arrange a standing order with the bakery, delivered every lab morning. Jasmine nearly hugs you. "A guaranteed box? You're gonna ruin me." She says it like the best possible outcome.\n\nThe lab days get sweeter after that. She rewards every clean run, then every hard one too, and the stool creaks a little louder each week. Her scrubs go from snug to straining. She stops pretending to be surprised about it.`,
        effects: { trust: 0.5, weight: 0.45, indulgence: 3, appetite: 0.18 },
      },
      {
        id: 'chart_the_rewards',
        label: 'Ask her to log how the rewards affect her draws',
        setsFlags: ['jasmine_chart_honest'],
        outcome: `Jasmine keeps a tally sheet for a week: clean sticks up, redraws down, and a wry column at the bottom for donuts consumed. She shows you the numbers. "Correlation's gorgeous," she says. "Evidence."\n\nNext morning an anonymous coworker leaves a bigger box on her chair. She eats two before the first patient and texts you a photo of the tally with the donut column circled: the science checks out.`,
        effects: { trust: 0.4, openness: 5, indulgence: 2, weeklyMomentum: 0.4 },
      },
      {
        id: 'reward_the_stick',
        label: 'Feed her a donut yourself after her next clean draw',
        requires: { flags: ['jasmine_flirt'] },
        outcome: `You wait until she caps the tube and peels her gloves, then hold a donut to her lips yourself. Jasmine's eyes flick to yours, and she takes the bite from your hand right there at the station, cheeks coloring. "Managing my rewards now," she murmurs.\n\n"Clean stick, you get fed," you tell her, and offer the rest. She finishes it from your fingers, glaze on her lip, hand pressed to her tightening waistband. That night she texts you a photo of an empty box and a line: couldn't stop thinking about your hands. Reward me again tomorrow.`,
        effects: { trust: 0.6, indulgence: 5, weight: 0.55, openness: 6, weeklyMomentum: 0.75 },
      },
    ],
  ),

  3: scene(
    (ctx) => {
      const feeding = ctx.flags.has('jasmine_feeding');
      if (feeding) {
        return `Jasmine texts you after the lab closes: Back room's clear. Brought two boxes and one bad idea. Come see.\n\nYou find her perched on the reinforced stool with a spread laid out on clean towels, pink boxes stacked, cheeks flushed with anticipation. She's changed out of scrubs into a soft shirt that stopped covering her middle weeks ago. "I thought about you feeding me through every single draw today," she says. "I want to see how many I can take when I'm not counting sticks."\n\nShe settles on the stool, thighs spread wide, and pats the seat beside her. "Sit close. And this time, don't hand me the biggest one and stop. Keep going till I tap out."`;
      }
      return `After the last patient, Jasmine finds you in the back with a bakery box and a nervousness that doesn't fit her usual grin.\n\n"I want to do this off the clock," she says. "Not a reward, not a lab-day system. Just you and me and way too many donuts, and me eating like I actually want to." She smooths her shirt over a stomach that keeps outgrowing her scrubs. "I've gotten a lot softer since we started this. I need to know that's not going to make you look at me different, because I'm not slowing down."\n\nHer hand rests on the box. The question is braver than her grin lets on.`;
    },
    [
      {
        id: 'accept_feeding',
        label: 'Feed her donut after donut until she taps out',
        requires: { flags: ['jasmine_feeding'] },
        setsFlags: ['jasmine_lovers'],
        outcome: `You feed her from the box, one after another, glaze and sugar on your fingers and hers. Jasmine hums low in her throat, one hand on her rounding stomach, eyes fixed on yours. She waves a box away and you nudge it back. "One more," she breathes. Then another after that.\n\nWhen the towels are covered in crumbs she guides your palm in slow circles over her full belly. "I could get so much bigger doing this with you," she says. "Feed me there." You press your thumb to her hip and she believes every bit of it.`,
        effects: { trust: 0.65, indulgence: 6, weight: 0.85, openness: 7, weeklyMomentum: 0.9 },
      },
      {
        id: 'dinner_and_dough',
        label: 'Take her out for a real meal, dessert first',
        requires: { notFlags: ['jasmine_lab_route'] },
        setsFlags: ['jasmine_lovers', 'jasmine_donut'],
        outcome: `You take her somewhere good and let her order dessert first, because she asks and you can't say no to the grin. Jasmine works through a real dinner after, then a second plate when you nod. Chocolate catches at the corner of her mouth and you wipe it with your thumb. She goes still under the touch.\n\nShe eats until her shirt pulls tight and her eyes go heavy, then leans into your side on the way out. "No draws, no rewards, no rules," she says softly. "Just full and happy with you. Let's keep doing exactly this."`,
        effects: { trust: 0.6, indulgence: 5, weight: 0.7, openness: 6 },
      },
      {
        id: 'honest_desire',
        label: 'Tell her you love watching her get softer',
        setsFlags: ['jasmine_public', 'jasmine_flirt'],
        outcome: `Jasmine's grin cracks into something raw and glad. "Yeah?" she says. "Yeah." She steps in until her softness presses against you. "Then don't look away when the next size gets tight too. Because I'm gonna keep giving them a reason." She laughs, shaky and warm.\n\nShe kisses your cheek, quick and sweet as glaze. "Dinner Thursday," she says. "Off the clock. I'll bring the biggest box they've got, and it's all for me."`,
        effects: { trust: 0.55, openness: 6, indulgence: 4, weight: 0.4, weeklyMomentum: 0.7 },
      },
      {
        id: 'steady_pace',
        label: 'Say you are all in, at whatever pace she wants',
        outcome: `Jasmine's shoulders drop with relief, and the grin comes back softer. "Okay," she says. "But heads up, I'm still getting rounder either way. That part's decided." She squeezes your hand once, glaze-sticky and sure. "Just stay honest with me, yeah?"\n\nShe eats a lighter box that night but texts you a mirror photo at eleven, shirt riding up over a fuller middle, captioned: still growing, best stick in the building. You save it before you can second-guess it.`,
        effects: { trust: 0.4, openness: 4, indulgence: 2.5 },
      },
    ],
  ),

  4: scene(
    (ctx) => {
      if (ctx.flags.has('jasmine_lovers')) {
        return `The lab is dark and locked, the reinforced stool pulled up to a counter buried in pink boxes. Jasmine waits in a soft robe that gave up closing a while ago, belly resting full and proud in her lap, glaze already on her fingers.\n\n"Told the night crew I was restocking supplies," she says, laughing. "Technically true." She spreads her knees and pats the stool beside her. "Finish me off, best stick in the building's off the clock. Then tell me what we do next, you and me and every bakery in town."`;
      }
      if (ctx.flags.has('jasmine_chart_honest')) {
        return `Jasmine meets you with a tidy tally binder and a two-box tower of donuts. "Full quarter of draw data," she says. "Also, I may have bribed the bakery." Her pen traces the line where clean sticks climb, and beside it the donut column she left in on purpose, right next to a note about her own growing scrubs order.\n\nShe pries open the top box and takes the biggest one first, of course. "Celebrate the numbers with me," she says. "I put my name on all of it, including the part about the phlebotomist who eats her rewards."`;
      }
      return `The clinic is empty except for the lab light. Jasmine has two donut boxes open on the clean counter and a third bag on the stool beside her. She waves you in with sticky fingers.\n\n"Bakery overordered for the blood drive," she says. "Can't let a box like this go stale, that's basically a sin." She slides one box your way and keeps the two fuller ones for herself. The stool creaks as she settles in. The clock reads eleven fourteen.`;
    },
    [
      {
        id: 'feast_lovers',
        label: 'Feed her the last box and stay the night',
        requires: { flags: ['jasmine_lovers'] },
        outcome: `You feed her until she can't slide off the stool without your arm. Jasmine sags back, stuffed and glowing, her fingers laced over yours on the curve of her belly. "Best stick in the building," she murmurs, "and this is the best I've ever felt being the one who gets taken care of."\n\nYou stay until the building goes quiet around you. She dozes heavy against your shoulder, and in the morning she works the first draw of the day one-handed, robe still open, and orders a bigger box before her gloves are even on.`,
        effects: { trust: 0.7, indulgence: 7, weight: 1.1, openness: 7, weeklyMomentum: 1 },
      },
      {
        id: 'feast_partners',
        label: 'Split the boxes and plan the next lab season',
        outcome: `You eat side by side until both boxes are crumbs. Jasmine talks about a standing bakery contract, a sturdier stool, a break room chair that fits "a phlebotomist who's thriving." She sets aside the last donut for you without thinking, then takes it back with a grin and splits it in half.\n\n"Same time next lab season," she says, patting her full stomach. "Longer, if the sticks stay this clean." They will. She'll make sure of it, one reward at a time.`,
        effects: { trust: 0.55, indulgence: 4.5, weight: 0.65, weeklyMomentum: 0.8 },
      },
      {
        id: 'publish_tally',
        label: 'Co-sign her draw-data report and split the tower',
        requires: { flags: ['jasmine_chart_honest'] },
        outcome: `You sign beneath her name. Jasmine eats two donuts while the ink dries, then pins the tally to the lab board with the donut column proudly intact. The staff read it Monday and quit apologizing for keeping snacks at their stations. Jasmine's clean-stick line is the boldest on the chart, and she points to it at the meeting with a hand on her rounder hip, glaze on her grin.`,
        effects: { trust: 0.5, reputation: 2, indulgence: 4, weight: 0.5, openness: 5 },
      },
      {
        id: 'standing_bakery',
        label: 'Approve a permanent lab-day bakery budget',
        outcome: `Jasmine watches you set the bakery order to recurring and lock it in. "Now it's official," she says, delighted. She works through both boxes while you save the file, sugar on her fingers, and initials the approval with the sticky hand.\n\nDonut rewards become a fixed part of every lab day after that. Her weight climbs steady with the standing order, and every time the stool creaks under her, she thanks you with a glaze-bright grin that no report could ever capture.`,
        effects: { trust: 0.5, indulgence: 4, money: -75, weight: 0.6, weeklyMomentum: 0.75 },
      },
    ],
  ),
};
