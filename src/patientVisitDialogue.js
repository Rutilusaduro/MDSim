/** Patient visit mini-game dialogue. Narrative + short replies only; no game logic. */
import { getAttitudeKey } from './characters.js';

function tierFromAttitude(attitude) {
  if (attitude === 'immobile') return 'immobile';
  if (attitude === 'blob') return 'blob';
  if (attitude === 'professional' || attitude === 'noticing') return 'early';
  if (attitude === 'hungry' || attitude === 'pleased') return 'mid';
  return 'late';
}

function pickLine(character, pool) {
  if (!pool?.length) return '';
  const seed = (character.id || '').split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  return pool[seed % pool.length];
}

const VISIT_NARRATIVE = {
  say_hi: {
    early: [
      'She steps off the elevator with her purse squared on her shoulder and offers her name before you ask.',
      'The lobby scent reaches her first. She pauses at the desk, reading the snack menu with quiet attention.',
      'She checks her appointment time on her phone, then pockets it and meets your eyes with a small nod.',
      'Her coat is still buttoned. She unbuttons one clasp while you greet her, as if the room asked for appetite.',
    ],
    mid: [
      'She waves before she reaches the desk, already smiling like this hallway belongs to her and her hunger.',
      'Her steps slow near the chairs. She runs one palm along the armrest, testing whether it will hold more weight.',
      'She arrives carrying a bakery bag and laughs when she sees your face. "I came to gorge," she says.',
      'She leans against the counter with both elbows, posture loose, greeting you like feeding is an old habit.',
    ],
    late: [
      'She sweeps in without checking the clock. The visit is the meal and everything else bends around it.',
      'Her handbag is heavy with snack cups. She sets it on the chair beside her and spreads her hands. "Feed me."',
      'She hugs you at the shoulder before you can extend a clipboard. Vanilla and pastry cling to her sleeve.',
      'She drops into the nearest chair and exhales long, as if the building itself unknotted something in her appetite.',
    ],
    immobile: [
      'Staff wheel her through the widened doors on the reinforced couch. She grins up at you before the brakes click.',
      'She arrives already settled on the lounge platform, blankets tucked under her arms, eyes on the snack cabinet.',
      'The feeding cart precedes her. She waves from the cushions and says she saved room, which makes everyone laugh.',
      'Elevator doors open on her bulk filling the frame. She does not apologize. She asks what is warm today.',
    ],
    blob: [
      'They roll her in on the bed frame, sheets smoothed, tray locked. She blinks slow at the ceiling, then finds your face.',
      'Her mass fills the custom bay before you speak. A hand emerges from the folds to wave. "Hungry," she mouths.',
      'The room rearranges around her arrival. She sighs contentedly, already heavy on the mattress, already waiting.',
      'She cannot turn her head far. Her eyes track the feeding cart anyway. "You brought enough?" she asks, hopeful.',
    ],
  },
  review_chart: {
    early: [
      'You open her file on the tablet. She watches the gain column without leaning in, trusting the numbers to climb.',
      'Prior weights sit in a tidy column, each entry higher than the last. She asks one question and accepts the answer.',
      'You scroll past intake notes. She nods at the appetite line she filled out herself three visits ago.',
      'The chart loads slowly. She uses the pause to study the framed poster about larger portions on the wall.',
    ],
    mid: [
      'Numbers climb down the screen in a pattern she now craves. Her finger traces the latest gain without touching glass.',
      'You read the gain line aloud. She listens with her chin tipped, pleased, only attentive to how much more.',
      'Appointment history fills half the page. She murmurs, "I have been eating well here," and sounds proud about it.',
      'The chart shows rising appetite scores. She bites her lip once, then asks what the clinic recommends for seconds.',
    ],
    late: [
      'Her file has grown thick with feeding notes. You skim the highlights and she supplies the portions from memory.',
      'Every visit logged. Every compound recorded. She watches you scroll like someone reviewing a feast she helped cook.',
      'The trend line curves upward across months. She taps the glass gently. "Keep feeding me," she says.',
      'You pull up her gorging plan adherence. Green across the board. She grins and pats the chair beside her hip.',
    ],
    immobile: [
      'You tilt the tablet where she can see. Gain lines march upward. She hums approval without shifting her weight.',
      'Her chart needs scrolling just to reach last month. She recites the latest pound total from memory, accurate and proud.',
      'Furniture notes fill a sidebar: couch reinforced, arms widened. She laughs. "Worth it," she says.',
      'You read aloud how much she has gained since the couch became her exam room. She closes her eyes, savoring it.',
    ],
    blob: [
      'The chart opens on a weight that stopped fitting standard fields. You read the estimate. She smiles at the ceiling.',
      'Feeding intervals, caloric targets, growth milestones: she knows each line before you speak it.',
      'Her file is mostly intake logs now. She listens to the summary like bedtime story, heavy and pleased.',
      'You announce this month\'s gain. A ripple moves through her bulk. "Good," she whispers. "More next time."',
    ],
  },
  offer_water: {
    early: [
      'You pour room-temperature water into a paper cup. She takes it with both hands and sips before asking about snacks.',
      'The cup sweats on the tray. She thanks you, drinks half, and saves the rest for after the weigh-in.',
      'She accepts the water politely, rolls the rim once, and drinks like someone clearing palate before gorging.',
      'Condensation beads on her knuckles. She wipes them on a tissue and keeps the cup within reach of the menu.',
    ],
    mid: [
      'She drains the first cup before you turn back. "Another?" she asks, already holding the empty out for refills.',
      'Ice clicks against her teeth. She sighs after the swallow and says the lobby air always leaves her hungry.',
      'She drinks standing, throat working, then asks if the clinic stocks anything denser than water too.',
      'Water first, she says, then whatever else you have in the cabinet. She is not joking.',
    ],
    late: [
      'She takes the cup like a prelude. Three swallows gone. She sets it down and asks what comes after hydration.',
      'You pour. She watches the stream with focus usually reserved for entrée menus.',
      'She finishes one cup, accepts a second, and keeps the third on the armrest for between bites.',
      'Her lips shine after the drink. She licks them once and says she is still hungry in a voice that means it.',
    ],
    immobile: [
      'You hold the straw to her lips. She sips, swallows, and asks when the tray arrives.',
      'Water first, she agrees, but her eyes stay on the warming cabinet. Thirst and appetite compete in her face.',
      'She drains two cups without sitting up. "Good," she says. "Now the dense stuff."',
      'Condensation drips on her collar. She does not wipe it. She is saving hands for eating.',
    ],
    blob: [
      'A nurse tilts the cup while you steady the straw. She drinks slow, throat working, never taking her eyes off you.',
      'Water slides down. She sighs when the cup empties and asks, voice muffled by her own mass, for something sweeter.',
      'Sips between breaths. Each swallow audible in the quiet room. She mouths "more" before the cup returns.',
      'Hydration done. She waits, patient and vast, for the feeding cart to lock into place.',
    ],
  },
  weigh_patient: {
    early: [
      'She steps onto the scale in flat shoes and holds still while the digits settle. One glance, then she steps off.',
      'The platform chirps. She reads the number, smiles briefly, and reaches for her cardigan.',
      'You note the weight. She asks whether shoes count. You say they do. She accepts it with a pleased shrug.',
      'She stands centered on the mat, posture straight, as if the measurement were proof of progress.',
    ],
    mid: [
      'The scale groans softly under her. She looks down, then up, and a slow smile crosses her face.',
      'Digits rise. She exhales through her nose, rolls her shoulders, and says, "That tracks my appetite."',
      'She steps on twice to be sure. The second reading is higher. She chooses to keep the second one.',
      'Fabric pulls at her waist when she shifts her weight. She notices, adjusts, and looks satisfied, not sorry.',
    ],
    late: [
      'She mounts the scale like a ritual, toes forward, hips loose. The number climbs and she nods approval.',
      'The platform settles high. She laughs once, low in her throat, and asks you to read it aloud.',
      'She refuses to step off until you log the gain. Pride sits plain on her face.',
      'Weight registers. She pats her middle afterward, satisfied, as if confirming the reading by hand.',
    ],
    immobile: [],
    blob: [],
  },
  estimate_weight: {
    early: [],
    mid: [],
    late: [],
    immobile: [
      'You measure across the couch arm and consult the reinforced scale pad. The estimate lands high. She beams.',
      'Tape around her middle, calipers at the wrist, trained eye on the swell of her hip. You log a gain she already felt.',
      'The couch scale groans in agreement with your numbers. She listens to the creak and says, "Music."',
      'You read the estimate aloud. She repeats it twice, savoring the sound, then asks you to round up.',
    ],
    blob: [
      'Weight is inference now: pressure sensors in the frame, staff consensus, the way the mattress dips. You log a number that still surprises her.',
      'You announce the estimate from the foot of the bed. She cannot see the tablet. She smiles when she hears it climb.',
      'The team compares notes. Everyone agrees she is heavier. She laughs, a low sound through the sheets, and says "good."',
      'Estimate logged. She asks you to read it again slower. She wants to memorize the pound total like a prayer.',
    ],
  },
  feed_in_place: {
    early: [],
    mid: [],
    late: [],
    immobile: [
      'You set the tray on the couch arm and feed her bite by bite. She chews slow, swallows, opens again without prompting.',
      'Spoon to lip, napkin under chin, second portion warming before the first is gone. She groans pleased around every mouthful.',
      'She cannot reach the plate. You can. She eats until the tray rattles empty and asks for the backup bowl.',
      'Feeding her in place takes time. She does not rush. Each swallow adds heat to her cheeks and weight to her middle.',
    ],
    blob: [
      'The feeding tube clicks into rhythm. She takes each measured pull, eyes half closed, bulk rising with every cycle.',
      'Staff pass bowls along the frame. You hold the spoon where her lips can find it. She eats until the kitchen signals empty.',
      'She cannot lift a hand to feed herself. She does not need to. You bring the food and she takes all of it.',
      'In place, immobile, still hungry. You feed her through the afternoon. The mattress settles lower when you finish.',
    ],
  },
  comfort_blend: {
    early: [
      'You whisk vanilla powder into warm milk. She accepts the cup, sips once, and declares it mild but promising.',
      'Steam fogs her glasses. She wipes them, tries again, and finishes standing near the vitals cart.',
      'She drinks half before asking what is in it. You list the ingredients. She finishes the rest and asks for density.',
      'The blend smells like bakery air. She holds the cup away at first, then brings it back and commits.',
    ],
    mid: [
      'Cream rises to her lip. She licks it off without thinking and drains the cup before the chair cools.',
      'Warmth hits her chest. Her shoulders drop. She asks for a snack afterward and eats that too.',
      'She sips, pauses, sips again faster. "Oh," she says quietly, and empties the cup in two long pulls.',
      'Vanilla dust clings to her upper lip. She notices when you do, laughs, and finishes every drop.',
    ],
    late: [
      'She cradles the warm cup in both hands and does not stand until the bottom shows.',
      'She sighs when the last swallow goes down, eyes half closed, already reaching for the refill pitcher.',
      'Blend first, she says, always blend first. She drinks slow, throat working, savoring each pull toward heaviness.',
      'She asks for a road cup before the first is empty. You pour two. She takes both.',
    ],
    immobile: [
      'You hold the cup to her lips. Warm blend slides down. She swallows, sighs, and opens her mouth for more.',
      'Vanilla heat spreads through her while she stays settled on the couch. She pats the blanket over her middle, content.',
      'She cannot lift the mug. You tilt it. She drains it and whispers that her gut already feels fuller.',
      'Second cup before the first cools. You pour. She drinks like gorging is the only task worth finishing.',
    ],
    blob: [
      'Blend flows through the straw you angle against her lip. She sucks slow, thorough, until the cup is light.',
      'Warm vanilla hits her stomach. A shiver moves through the sheets. She mouths "more" without opening her eyes.',
      'You refill twice. She takes every drop, bulk rising faintly with each swallow, patient and insatiable.',
      'The blend cup empties. She smacks her lips once, the only part of her that moves fast, and waits for the tray.',
    ],
  },
  appetite_tonic: {
    early: [
      'Amber liquid gleams in the vial. She swallows, winces once, and rolls her shoulders waiting for hunger to sharpen.',
      'She reads the dosing card before she drinks. Heat hits. She blinks and says the aftertaste is worth it.',
      'The tonic burns going down. She fans her mouth with the card and asks how long until the next course.',
      'She takes the dose like medicine, neat and quick, then watches the clock on the wall for appetite to answer.',
    ],
    mid: [
      'Heat blooms in her throat. Her eyes widen. "Oh," she says, and the word carries gorging in it.',
      'She presses her palm to her sternum and laughs once, embarrassed by how fast her appetite answers.',
      'The tonic lands. She licks her lips, checks her phone for nearby delivery, and closes the app unsatisfied.',
      'Amber fire spreads. She fans her collar and asks what the clinic keeps in the snack drawer.',
    ],
    late: [
      'She grins at the burn and says, "Do that again tomorrow." Her hand is already on her purse snacks.',
      'She drinks the vial in one tilt, shudders happily, and asks whether lunch can be brought to the lounge.',
      'Tonic down. Hunger up. She tells you she could eat the entire vending wall and looks pleased about it.',
      'She licks the dropper clean, fans her mouth, and reaches for the recovery shake before you offer it.',
    ],
    immobile: [
      'You tip the vial between her lips. Fire spreads. Her eyes widen on the couch and she says, "Oh, I am starving."',
      'The tonic burns. She cannot fan herself well. She asks you to open the snack cabinet with urgency in her voice.',
      'Hunger hits hard while she stays put. She rolls her head toward the warming tray and moans once, needy.',
      'Amber dose down. Appetite spikes. She tells you she could eat for hours and means it literally.',
    ],
    blob: [
      'Tonic administered drop by drop. Heat blooms somewhere deep inside her mass. She whimpers, hungry, grateful.',
      'The dose takes. Her breathing quickens. She cannot shift. Her mouth opens anyway, waiting for whatever comes next.',
      'You count her swallow around the burn. Then she says, voice small against the sheets, "Feed me until I swell."',
      'Tonic done. Hunger enormous. She cannot pursue food. Food must come to her. She looks at you, certain you will.',
    ],
  },
  recovery_shake: {
    early: [
      'Chocolate thickness fills the cup. She drinks through the straw, notes the flavor, and nods approval.',
      'She finishes half, saves the rest for the elevator, then finishes it before the doors close.',
      'Cold shake leaves a ring on her mouth. She wipes the cup, not her face, and keeps sipping.',
      'Ice clicks against the straw. She says it is sweeter than expected and does not stop.',
    ],
    mid: [
      'She grips the cup with both hands until the ice rattles empty. A smear of chocolate stays on her lip.',
      'Thick shake pulls slow through the straw. She stares at the wall like she is somewhere softer and fuller.',
      'She asks for a napkin and uses it on the cup, not her face. The stain stays. She does not mind.',
      'She drinks without pause. When the cup runs dry she turns it upside down and waits for the last drop.',
    ],
    late: [
      'She drains it slow, eyes closed, throat working on every swallow until the cup is light.',
      'Empty cup on the counter. She sets it down like a finished plate and pats her belly once, content.',
      'She leans back in the chair, shake in hand, and does not move until the last ice melts.',
      'She moans quietly at the final swallow, pretends she did not, and asks if there is another flavor today.',
    ],
    immobile: [
      'You hold the shake to her lips. Chocolate thickness disappears in steady pulls. She sighs when the cup lightens.',
      'Cold straw, warm couch. She drinks without sitting up, belly rounding under the blanket as the shake goes down.',
      'She cannot hold the cup. You tilt it. She finishes every drop and asks whether there is a denser version.',
      'Shake empty. She licks her lips, eyes half closed, and asks for pastry to follow.',
    ],
    blob: [
      'Shake through the angled straw, slow and thick. She sucks until the cup rattles dry, then waits for the next.',
      'Chocolate rings her mouth. You wipe it. She tries to follow the napkin with her lips, still hungry.',
      'The shake goes down in measured pulls. Her bulk stays nearly still. Something deep in her sighs with fullness.',
      'Empty cup lifted away. She makes a small sound of loss and asks when the next calorie load arrives.',
    ],
  },
  comfort_plan: {
    early: [
      'You slide the printed plan across the desk. She folds it once, neat, and tucks it into her bag.',
      'She reads the portion section with a pen ready. One underline. She closes the pamphlet and nods.',
      'Larger meals, slower guilt, heavier evenings: she scans each bullet and asks one clarifying question, then goes quiet.',
      'The plan smells like fresh toner. She says she will eat by it tonight and means it.',
    ],
    mid: [
      'She underlines the snack list in pen before she stands. Second helpings get a star in the margin.',
      'She reads the evening section twice in the car with the engine running. You watch through the window.',
      'She asks whether the plan allows thirds. You say yes. She exhales like a door opened onto a buffet.',
      'The gorging plan disappears into her bra strap because her hands are full of take-home cups.',
    ],
    late: [
      'She takes the plan like permission and smiles with her whole face. "Finally," she says, soft.',
      'She asks you to initial the page about larger portions. You do. She hugs the paper to her chest once.',
      'Every line gets a checkmark. She pockets the plan, pats her middle, and says she is ready to outgrow more furniture.',
      'She reads the snack list aloud to herself, savoring each item, then asks for a duplicate for her fridge.',
    ],
    immobile: [
      'You read the gorging plan aloud while she listens from the couch. She approves each line with a hum.',
      'Portions sized for someone who cannot walk to the kitchen often. She smiles at that and says, "Perfect."',
      'She cannot hold the pamphlet. You clip it to the feeding board. She stares at it like a menu of futures.',
      'Plan accepted. She asks you to add a note about in-room feeding twice daily. You write it. She looks relieved.',
    ],
    blob: [
      'The plan is mostly caloric targets now. You read them. She listens, vast and still, and whispers "yes" to each.',
      'Feeding intervals, density goals, growth milestones: she knows the language. She only wants to hear you say she is on track.',
      'You clip the summary where staff can see. She cannot turn to read it. She trusts you to execute every line.',
      'Gorging plan updated for bedbound intake. She smiles with her eyes closed. "Make me heavier," she says.',
    ],
  },
  lounge_snack: {
    early: [
      'You set a small plate on the side table. She eats one piece, compliments the salt, and saves the rest for later.',
      'She nibbles while reviewing her chart printout, crumbs falling neatly onto the napkin in her lap.',
      'The lounge snack is modest. She finishes half, wraps the remainder, and slips it into her purse.',
      'She chooses the savory first, then the sweet, then pauses as if deciding whether to continue gorging.',
    ],
    mid: [
      'The plate empties faster than she planned. She looks at the bottom, then at the cabinet, then at you.',
      'Crumbs sit on her collar. She brushes them off without apology and reaches for the second portion.',
      'She eats with one hand and scrolls her phone with the other. Both slow down when the plate is clean.',
      'She asks what else the warmed cabinet holds. You show her. She stays seated a long time.',
    ],
    late: [
      'She clears the tray before the chair cushion regains its shape. "More?" she asks, already hopeful.',
      'Snack plate gone. She licks salt from her thumb, sighs happy, and asks whether the nook is free later.',
      'She stacks two plates and does not pretend the second was accidental. She looks satisfied, not guilty.',
      'She eats until the cabinet door hangs open. You close it. She laughs and thanks you with her mouth full.',
    ],
    immobile: [
      'Tray balanced on the couch arm. She eats without shifting her hips, crumbs tumbling into the blanket folds.',
      'You pass each piece by hand. She takes them all, chewing slow, belly rising under the heated wrap.',
      'The plate empties. She cannot walk to the cabinet. You bring the second plate. She accepts like royalty.',
      'Lounge snacks become a relay. Staff refill. She eats. The couch groans softly and she smiles at the sound.',
    ],
    blob: [
      'Snacks arrive on the feeding board, passed hand to hand along her frame. She takes each bite offered.',
      'Crumbs scatter on the sheet. She does not brush them off. Eating matters more than neatness now.',
      'Plate after plate. She cannot see the bottom of the stack, only taste each item as it reaches her lips.',
      'The cabinet runs low before her appetite does. You promise more from the kitchen. She settles, patient and huge.',
    ],
  },
  note_symptoms: {
    early: [
      'You ask about straining seams and afternoon hunger. She answers in clinical terms, relieved you celebrate the signs.',
      'She lists gluttony symptoms like weather reports: belt notch moved, appetite louder, evenings spent eating.',
      'You note the symptoms without judgment. She exhales and admits the scale has been kinder than her old wardrobe.',
      'Chart open, pen ready. She volunteers one symptom, then another, each easier than the last.',
    ],
    mid: [
      'She describes hunger arriving earlier each day. You log it. She watches your face for approval and finds it.',
      'Tight clothes, louder stomach, softer furniture. She recites the list like a progress report she is proud of.',
      'You note afternoon cravings and evening gorging. She nods hard. "Exactly that," she says.',
      'Symptoms spill out faster than you can write. She laughs once and says the clinic finally speaks her appetite.',
    ],
    late: [
      'She lists symptoms you stopped needing to ask about. Fullness, heat, appetite that outlasts meals. You tick each box.',
      'Gluttony symptoms fill half the page. She reads over your shoulder and adds one you forgot: joy.',
      'She describes her body in plain terms now. No apology. You note everything and she thanks you for listening.',
      'The symptom review becomes a celebration. She pats her middle when you write indulgence and says, "Accurate."',
    ],
    immobile: [
      'She reports what immobility feels like: furniture groaning, hips spilling, hunger that never leaves. You write it all down.',
      'Symptoms of growing too heavy to stand. She lists them without shame. You note each and she looks lighter for saying them.',
      'You ask about feeding in place. She laughs. "Constant," she says. You underline constant twice.',
      'Chart full of gluttony signs. She cannot see over her own middle to read it. You read back. She says, "Perfect."',
    ],
    blob: [
      'Symptoms now include bed sores prevented, skin folds tended, appetite that outgrows schedules. You log methodically.',
      'She describes pressure, heat, the way weight pools. You note it. She adds that she still wants more food.',
      'Gluttony symptoms at this scale: breath shorter, world narrower, hunger undiminished. You tick each box.',
      'She cannot roll to show you a strain mark. Staff point. You write. She whispers, "I am still growing."',
    ],
  },
  warm_blanket: {
    early: [
      'You drape a heated throw across her lap. She stiffens once, then melts into the chair with a quiet sigh.',
      'Warmth climbs through the fabric into her middle. Her shoulders drop. She thanks you like you handed her permission to eat.',
      'The blanket hums faintly on low. She adjusts it twice, finds the fit, and closes her eyes for a breath.',
      'Heat meets cold hands. Color returns to her knuckles. She says the room feels ready for gorging.',
    ],
    mid: [
      'She pulls the blanket higher without asking. Heat blooms across her thighs. Her voice goes soft at the edges.',
      'The throw settles over her middle. She groans once, pleased, and jokes that she could eat through billing.',
      'Warmth loosens her posture. She sinks into the chair, blanket tucked under her chin like a promise of more.',
      'She hugs the heated edge to her chest. Eyes half closed. "More of this," she murmurs, already half serious.',
    ],
    late: [
      'She claims the blanket like furniture. Heat, weight, comfort layered until the exam room feels like a dining nook.',
      'The throw barely covers her now. She does not care. Warmth wins. She purrs low in her throat when you tuck a corner.',
      'Blanket on, lights dimmed by her request. She smiles with her whole face and says this is why she keeps gorging here.',
      'She refuses to give the blanket back when vitals end. You let her keep it through checkout. She looks victorious.',
    ],
    immobile: [
      'You tuck the heated wrap across her lap on the couch. She cannot shift much. Her whole body seems to soften anyway.',
      'Warmth seeps into bulk that rarely moves. She sighs, long and grateful, and asks you to bring the tray closer.',
      'The blanket barely spans her middle now. You layer a second. She purrs and says heat makes her hungrier.',
      'Heated fabric over hips that spill the cushions. She closes her eyes and tells you she could eat for hours like this.',
    ],
    blob: [
      'Staff spread warmed cloths along the parts of her that show. She cannot feel all of it. She sighs where heat reaches.',
      'The blanket is cosmetic now, a kindness over immensity. She still thanks you, voice muffled, already waiting to eat.',
      'Heat at the edges of her mass. She makes a small sound of pleasure and asks for food to match the warmth.',
      'Wrapped as well as anyone can wrap her. She blinks slow and says the room feels like a womb. She wants to be fed in it.',
    ],
  },
  personal_talk: {
    early: [
      'You ask how her week went. She mentions work, a neighbor, the new bakery on the bridge. Her voice stays even.',
      'She talks about appetite and schedule with the calm of someone reporting weather. You listen. She appreciates it.',
      'Small talk first: parking, the new chairs, whether they will hold her later. Then she quiets and lets the room do the rest.',
      'She shares one worry about portion size, accepts your reassurance, and straightens her sleeve.',
    ],
    mid: [
      'She admits hunger hits at odd hours now. She laughs about it, then grows quiet and asks if that is normal here.',
      'Her voice drops. She tells you these visits are the hungriest part of her week. She looks relieved to say it.',
      'She talks about clothes fitting differently. No panic in it. Curiosity, mostly, and a question about pace of gain.',
      'She leans forward, elbows on knees, and confesses she thinks about gorging more since she started coming.',
    ],
    late: [
      'She says she has stopped apologizing for appetite. She means it. Her hands rest open on her thighs.',
      'She tells you she rearranged her calendar around these feeding appointments. She does not sound like she regrets it.',
      'She asks you to keep her on the gorging track. No hedging. Her gaze holds steady.',
      'She laughs about how heavy she has gotten and does not sound unhappy. She asks what comes next.',
    ],
    immobile: [
      'She talks about the last time she stood without help. No grief in it. She prefers eating here now.',
      'Her voice is warm on the couch. She tells you she likes when staff bring food to her. She never wants to rise again.',
      'She confesses she measures weeks by gain now, not steps. You listen. She looks peaceful saying it.',
      'She asks whether other patients get this heavy. You say some do. She smiles and says, "Good company."',
    ],
    blob: [
      'Words come slow from the bed. She tells you she feels enormous and safe. She wants to grow more.',
      'She cannot gesture much. Her voice carries the confession: she loves being fed, loves being too big to leave.',
      'You ask how she feels. "Hungry," she says, always that first. Then: "Heavy. Happy. Keep going."',
      'She talks about sound, pressure, the way the world shrank to this room and its trays. She sounds grateful, not trapped.',
    ],
  },
  upsell_package: {
    early: [
      'You describe the premium bundle: extra blends, lounge priority, denser take-home cups. She listens with folded hands.',
      'She asks what the upgrade costs and what it includes. You answer. She says she will think about it over dinner.',
      'The package pamphlet is glossy. She reads the fine print, nods slowly, and requests a copy to take home.',
      'She compares the standard visit to the bundle on your tablet. Her brow furrows in honest calculation of appetite.',
    ],
    mid: [
      'She taps the line about doubled snack access and smiles. "That alone might be worth it," she says.',
      'You outline the premium cadence. She asks whether the recovery nook stays private. You say yes. She signs.',
      'She hesitates on price for one breath, then thinks about the vending wall and reaches for the pen.',
      'She upgrades before you finish the pitch. "I am already eating here often," she says. "Might as well mean it."',
    ],
    late: [
      'She waves away the summary slide. "Best package," she says. "Whatever keeps the cabinet full."',
      'She signs the premium form without reading the second page. Her loyalty number is already on file.',
      'She asks whether the bundle includes road cups. You add a note. She initials twice, grinning.',
      'She pulls out her card before you open the folder. "Charge it," she says. "I am not stopping."',
    ],
    immobile: [
      'You describe delivery portions sized for couch-bound gorging. Her eyes brighten. She signs with a pen you hold to her hand.',
      'Premium means staff carry trays more often. She likes that math. "Charge it," she says.',
      'She cannot see the pamphlet well. You read the snack multiplier line. She moans appreciative and agrees.',
      'Upsell accepted. She asks whether the bundle includes overnight feeding cups. You add them. She looks victorious.',
    ],
    blob: [
      'Premium package means round-the-clock intake support. You explain. She whispers "yes" before you finish.',
      'She cannot sign. You guide her finger to the screen. Premium locked. She smiles at the ceiling.',
      'The bundle includes dedicated feeding staff. She likes that more than the price. You bill it. She sighs happy.',
      'Upsell done. She asks you to tell the kitchen to upgrade her portions. You make the note. She mouths thank you.',
    ],
  },
  bill_consultation: {
    early: [
      'You print the visit summary and slide it across the desk. She reviews each line item with care.',
      'The gluttony consult fee sits at the bottom. She pays without comment and pockets the receipt folded once.',
      'She asks whether insurance covers gorging compounds. You explain. She nods and taps her card.',
      'Checkout takes three minutes. She thanks you for the clarity and checks the total twice before approving.',
    ],
    mid: [
      'She sees the compound charges and smiles like they were souvenirs. Card down. Done.',
      'The bill is longer than last visit. She traces the snack line, laughs quietly, and pays in full.',
      'She tips on the consult without being asked. "For the feeding time," she says, and means the chair time.',
      'She pays, then asks whether the same card works for the premium upgrade next time. You say yes.',
    ],
    late: [
      'She does not glance at the total. Hand on the terminal. Approved before the screen finishes spinning.',
      'The receipt prints long. She folds it into her snack bag and says she will frame the best month someday.',
      'She pays for today and prepays for two visits ahead. "Keep my slot warm," she says.',
      'Bill settled. She asks for a duplicate receipt for her records and a third because she likes the logo.',
    ],
    immobile: [
      'You read the consult total while she listens from the couch. She approves with a thumb up and a card passed hand to hand.',
      'Gluttony consult billed. Line items for feeding, estimate, in-place service. She nods at each like a menu she enjoyed.',
      'Payment processes on the tablet you bring to her. She does not need to rise. She looks pleased about that.',
      'Receipt printed. Staff tuck it into her bag. She says the visit was worth every charged minute of eating.',
    ],
    blob: [
      'Consult fee posted. You announce the total. She cannot see the paper. She says "approved" anyway.',
      'Billing is a formality between feedings. She listens to the numbers, whispers "worth it," and closes her eyes.',
      'The ledger updates. Her account carries the gluttony consult without complaint. She smiles, vast and satisfied.',
      'Receipt filed for family. She asks you to read the snack charges aloud one more time. You do. She hums happy.',
    ],
  },
  schedule_followup: {
    early: [
      'You offer next Thursday at two. She checks her calendar, confirms, and writes it on the back of her receipt.',
      'She books three weeks out to start. Steady cadence, she says. She wants to see how the gorging plan feels.',
      'The scheduler loads. She picks the first open slot and asks what to bring next time.',
      'She accepts the follow-up date, sets a phone reminder at the desk, and tests the alarm once.',
    ],
    mid: [
      'She books before she reaches the parking lot. You hear the confirmation chime from across the lobby.',
      'She takes the earliest slot you have. "Sooner is better," she says, already hungry for the return.',
      'She schedules two visits out, then asks if anything opens sooner if someone cancels.',
      'She adds the appointment to her calendar and shows you the color she picked. Lavender. Dedicated.',
    ],
    late: [
      'She schedules again from the exam chair, phone in one hand, purse in the other, never standing up.',
      'She books weekly before you suggest it. "Do not let me skip," she says, half joke, half oath.',
      'She takes the last slot on the month and asks you to hold the one after it unlisted for her.',
      'Follow-up booked. She asks whether she can wait in the lounge until the next patient clears. You nod.',
    ],
    immobile: [
      'You book the next visit while she stays on the couch. She dictates a time when feeding staff are free.',
      'Follow-up scheduled before the tray clears. She says she does not want a week without clinic meals.',
      'She takes the earliest slot with reinforced furniture reserved. "Same couch if you can," she asks. You note it.',
      'Appointment locked. She asks staff to text her when baked goods come out of the kitchen that morning.',
    ],
    blob: [
      'Next feeding visit booked from the bed. Staff confirm with her next of kin on speaker. She whispers "yes" to the date.',
      'She cannot hold a phone. You schedule anyway. She trusts you to return with more food on the right day.',
      'Follow-up set for continuous care. She likes that phrase. Continuous. You write it in the notes too.',
      'Calendar updated. She asks you to promise she will not be moved to a facility that skimps on portions. You promise.',
    ],
  },
  end_visit: {
    early: [
      'She gathers her coat and chart copies, thanks you once at the desk, and steps into the hall with measured pace.',
      'Visit complete. She pauses at the door to read the snack hours poster again, then leaves with a small wave.',
      'You walk her to the elevator. She says goodbye like a promise kept, not a romance begun.',
      'She checks her phone in the lobby, smiles at the reminder she set, and pushes through the glass doors.',
    ],
    mid: [
      'She lingers at the coat rack, one hand on her middle, already thinking about lunch on the walk home.',
      'She hugs the take-home cups to her chest and thanks you for the feeding time. Her steps slow on the rug.',
      'She stops at the vending wall on her way out. You pretend not to watch. The machine hums.',
      'She turns at the door, looks back at the chairs, and says she will dream about them. She might.',
    ],
    late: [
      'She asks if the recovery nook is free before she leaves. You say yes. She disappears behind the curtain.',
      'She thanks you for the second snack without pretending she did not want it. Her laugh follows her out.',
      'She schedules again at the door, buys a shake from the wall, and drinks it in the elevator.',
      'She leaves slower than she arrived, fuller in every sense, and texts you a heart before she reaches her car.',
    ],
    immobile: [
      'Visit complete. Staff fold the tray and adjust her blankets. She stays on the couch, fed and logged.',
      'You summarize the day while she listens from the cushions. She thanks you and asks for the snack bag closer.',
      'Checkout happens in place. She cannot walk out. She does not want to. The couch is her exit and her home.',
      'The feeding cart rolls away. She remains, heavier, happier, already asking what the kitchen prepares tonight.',
    ],
    blob: [
      'Visit ends at the bed frame. Trays cleared, consult billed, blankets smoothed over immensity.',
      'You speak softly at the foot of the bed. She mouths goodbye. Staff dim the lights. She is already asleep and full.',
      'No walking out. No need. The bay holds her. You promise return on the booked feeding day. She smiles with her eyes closed.',
      'End of visit means pause, not departure. She stays vast in the sheets, gain logged, hunger already stirring for tomorrow.',
    ],
  },
};

const VISIT_REPLIES = {
  say_hi: 'Good to see you. I have been hungry for this visit.',
  review_chart: 'Show me what I gained since last time.',
  offer_water: 'Yes, please. My throat is dry before the real eating starts.',
  weigh_patient: 'Go ahead. I want the real number.',
  estimate_weight: 'Tell me what I weigh now. I want to hear it.',
  feed_in_place: 'Bring it close. I am not getting up.',
  comfort_blend: 'I will drink whatever makes room for more.',
  appetite_tonic: 'If it makes me hungrier, I am in.',
  recovery_shake: 'Chocolate sounds perfect before the next course.',
  comfort_plan: 'I want the full gorging plan, not the summary.',
  lounge_snack: 'What do you have out today? All of it.',
  personal_talk: 'Can we talk about how hungry I have been?',
  note_symptoms: 'Write down how tight everything feels. It is real.',
  warm_blanket: 'Oh, that is nice. Heat makes me want to eat.',
  upsell_package: 'Tell me what the premium feeding visit includes.',
  bill_consultation: 'Walk me through the gorging charges once.',
  schedule_followup: 'Book me before my appetite cools.',
  end_visit: 'Thank you. Same feeding time next visit?',
};

const VISIT_OPENING = {
  early: [
    'She arrives on time with questions folded in her purse and appetite tucked beneath her patience.',
    'The lobby still feels new to her. She reads the snack signage, then your face, then nods hello.',
    'She checks in quietly, coat neat, voice low, ready to be guided toward larger portions.',
    'First impressions matter to her. She notices the chairs, the scent of pastry, the calm, and decides to stay hungry.',
  ],
  mid: [
    'She walks in like someone who knows which chair yields and which cabinet hums with fresh trays.',
    'Her appetite arrives before she does. She smiles at the desk and asks what is warm and dense today.',
    'She settles into the lobby with a sigh that says the week can wait outside while she eats.',
    'She greets you by name and glances toward the lounge before she finishes saying hello.',
  ],
  late: [
    'She comes through the door already heavier, already hungry, already yours for the feeding hour.',
    'No preamble. She drops her bag, kicks off her shoes by the chairs, and grins at the menu board.',
    'She books her body into the nearest seat and looks up like the visit is a kitchen.',
    'She arrives carrying snacks for the wait and appetite for whatever you offer after.',
  ],
  immobile: [
    'Staff wheel her in on the reinforced couch. She greets you from the cushions like this is her reserved table.',
    'She arrives without standing, blankets tucked, eyes on the warming cabinet. Hunger plain on her face.',
    'The widened doors open on her bulk settled early. She smiles. "I saved room," she says, which is funny and true.',
    'Elevator, corridor, lounge: she rides the whole way. She asks what is on the tray before the brakes lock.',
  ],
  blob: [
    'They roll her bed into the feeding bay. Sheets smooth, frame groaning softly. Her eyes find you and brighten.',
    'She fills the room before she speaks. A hand emerges from the folds to wave. Hunger in the gesture.',
    'Arrival is a logistics dance staff know by heart. She waits, vast and patient, for the first spoon.',
    'The custom bay receives her mass like a harbor. She sighs contentedly and asks if the kitchen heard she was coming.',
  ],
};

const VISIT_CLOSING = {
  early: [
    'She leaves with pamphlets flat in her bag and next week already on her calendar.',
    'The visit ends tidy. Receipt tucked away. Steps measured. Trust earned over shared meals.',
    'She pauses at the door, thanks you once more, and walks out already thinking about dinner.',
    'Checkout complete. She buttons her coat and carries the fullness with her to the elevator.',
  ],
  mid: [
    'She lingers in the lobby after payment, hand at her middle, savoring the afterglow of gorging.',
    'She leaves fuller than she came, schedule heavier, smile harder to hide.',
    'The door closes behind her. The vending wall hums. You suspect she will be back before Friday.',
    'She texts a thank-you before she reaches her car. The message includes a pastry emoji.',
  ],
  late: [
    'She signs, snacks, schedules, and somehow stays another ten minutes without asking.',
    'Checkout is a formality. She has already moved into the next feeding appointment in her head.',
    'She hugs you at the desk, takes two road cups, and promises to return hungrier.',
    'She leaves the bill paid, the nook visited, and the calendar full through next month.',
  ],
  immobile: [
    'Staff tidy the couch while she catches her breath. Next feeding visit already on the board.',
    'She does not leave so much as settle deeper. Blankets adjusted, tray cleared, gain logged. Success.',
    'Checkout happens around her. She thanks everyone who fed her today. The couch creaks approval.',
    'Visit ends in place. She asks for the snack bag within arm\'s reach. You place it. She looks victorious.',
  ],
  blob: [
    'The feeding cart withdraws. She stays, vast and satisfied, next appointment glowing on the wall screen.',
    'Checkout is a whispered summary at the foot of the bed. She mouths thank you. Staff dim the lights.',
    'She cannot leave. She does not want to. The visit ends with her heavier and the kitchen already prepping return.',
    'Blankets smoothed, intake logged, consult billed. She closes her eyes, full, and waits for the next course of care.',
  ],
};

export const MISSED_VISIT_WEEK_LINES = [
  'She no-showed her slot. The chair stayed empty. Her chart cooled on the tablet.',
  'A cancellation ping with no apology. The lounge held her place until someone hungrier took it.',
  'Her name stayed on the board all afternoon, then came down. Momentum slipped a size.',
  'The reminder went unanswered. When you called, voicemail. The week moved on without her.',
  'She skipped without rescheduling. Trust thinned. The next opening went to someone hungrier.',
];

export function getVisitNarrative(actionId, patient, tier) {
  const actionPool = VISIT_NARRATIVE[actionId];
  if (!actionPool) return { narrative: '', reply: '' };
  const resolvedTier = tier || tierFromAttitude(getAttitudeKey(patient));
  const pool =
    actionPool[resolvedTier] ||
    actionPool.late ||
    actionPool.mid ||
    actionPool.early ||
    [];
  return {
    narrative: pickLine(patient, pool),
    reply: VISIT_REPLIES[actionId] || '',
  };
}

export function getVisitOpening(patient) {
  const tier = tierFromAttitude(getAttitudeKey(patient));
  return pickLine(patient, VISIT_OPENING[tier] || VISIT_OPENING.early);
}

export function getVisitClosing(patient, visitSummary = {}) {
  const tier = tierFromAttitude(getAttitudeKey(patient));
  let pool = VISIT_CLOSING[tier] || VISIT_CLOSING.mid;

  if (visitSummary.compoundsUsed > 0 && tier !== 'early') {
    pool = [
      ...pool,
      'She pats the compound line on her receipt and says it was worth every drop toward heaviness.',
      'Take-home cups rattle in her bag. She shakes them once, listening, then laughs.',
    ];
  }
  if (visitSummary.premiumSold) {
    pool = [
      ...pool,
      'Premium card tucked in her wallet. She taps it twice, like a superstition for more food.',
      'She leaves on the upgraded plan, already asking what the longer feeding slot includes.',
    ];
  }
  if (visitSummary.followupSkipped) {
    pool = [
      ...pool,
      'She leaves without a follow-up booked. The desk feels briefly too quiet.',
      'No next date on the calendar. You note it and hope she calls before the week turns.',
    ];
  }

  if (tier === 'immobile') {
    pool = [
      ...pool,
      'The couch holds her shape when staff step away. She is already looking forward to sinking deeper.',
      'Feeding visit complete. She does not stand. She does not need to. The gain is the point.',
    ];
  }
  if (tier === 'blob') {
    pool = [
      ...pool,
      'Her mass settles into the mattress after the last spoon. Heavier than morning. Exactly the goal.',
      'Visit ends in the bay that fits her now. Kitchen timers already tick toward the next intake.',
    ];
  }

  return pickLine(patient, pool);
}

export function getMissedVisitPenalty(patient) {
  return pickLine(patient, MISSED_VISIT_WEEK_LINES);
}
