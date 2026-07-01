/** Patient visit mini-game dialogue. Narrative + short replies only; no game logic. */
import { getAttitudeKey } from './characters.js';

function tierFromAttitude(attitude) {
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
      'The lobby scent reaches her first. She pauses at the desk, reading the welcome plaque with quiet attention.',
      'She checks her appointment time on her phone, then pockets it and meets your eyes with a small nod.',
      'Her coat is still buttoned. She unbuttons one clasp while you greet her, as if the room asked for it.',
    ],
    mid: [
      'She waves before she reaches the desk, already smiling like this hallway belongs to her.',
      'Her steps slow near the chairs. She runs one palm along the armrest before she turns to you.',
      'She arrives carrying a bakery bag and laughs when she sees your face. "I came hungry," she says.',
      'She leans against the counter with both elbows, posture loose, greeting you like an old habit.',
    ],
    late: [
      'She sweeps in without checking the clock. The visit is the appointment and everything else bends around it.',
      'Her handbag is heavy with snack cups. She sets it on the chair beside her and spreads her hands. "Ready."',
      'She hugs you at the shoulder before you can extend a clipboard. Warmth and vanilla cling to her sleeve.',
      'She drops into the nearest chair and exhales long, as if the building itself unknotted something in her chest.',
    ],
  },
  review_chart: {
    early: [
      'You open her file on the tablet. She watches the screen without leaning in, trusting the process to explain itself.',
      'Prior weights sit in a tidy column. She asks one question about the unit of measure and accepts the answer.',
      'You scroll past intake notes. She nods at the allergy line she filled out herself three visits ago.',
      'The chart loads slowly. She uses the pause to fold her hands and study the framed wellness poster on the wall.',
    ],
    mid: [
      'Numbers climb down the screen in a pattern she now recognizes. Her finger traces the latest entry without touching glass.',
      'You read the gain line aloud. She listens with her chin tipped, neither proud nor defensive, only attentive.',
      'Appointment history fills half the page. She murmurs, "I have been busy here," and sounds pleased about it.',
      'The chart shows rising appetite scores. She bites her lip once, then asks what the clinic recommends next.',
    ],
    late: [
      'Her file has grown thick with notes. You skim the highlights and she supplies the details from memory, accurate and unhurried.',
      'Every visit logged. Every compound recorded. She watches you scroll like someone reviewing a story she helped write.',
      'The trend line curves upward across months. She taps the glass gently. "Keep going," she says.',
      'You pull up her comfort plan adherence. Green across the board. She grins and pats the chair beside her hip.',
    ],
  },
  offer_water: {
    early: [
      'You pour room-temperature water into a paper cup. She takes it with both hands and sips once before setting it down.',
      'The cup sweats on the tray. She thanks you, drinks half, and saves the rest for after vitals.',
      'She accepts the water politely, rolls the rim once, and drinks like someone finishing a small task well.',
      'Condensation beads on her knuckles. She wipes them on a tissue and keeps the cup within reach.',
    ],
    mid: [
      'She drains the first cup before you turn back. "Another?" she asks, already holding the empty out.',
      'Ice clicks against her teeth. She sighs after the swallow and says the lobby air always leaves her thirsty.',
      'She drinks standing, throat working, then asks if the clinic stocks flavored water too.',
      'Water first, she says, then whatever else you have in the cabinet. She is only half joking.',
    ],
    late: [
      'She takes the cup like a prelude. Three swallows gone. She sets it down and asks what comes with hydration here.',
      'You pour. She watches the stream with focus usually reserved for dessert menus.',
      'She finishes one cup, accepts a second, and keeps the third on the armrest for later without asking permission.',
      'Her lips shine after the drink. She licks them once and says she is still thirsty in a voice that means something else.',
    ],
  },
  weigh_patient: {
    early: [
      'She steps onto the scale in flat shoes and holds still while the digits settle. One glance, then she steps off.',
      'The platform chirps. She reads the number, frowns briefly at nothing in particular, and reaches for her cardigan.',
      'You note the weight. She asks whether shoes count. You say they do. She accepts it with a small shrug.',
      'She stands centered on the mat, posture straight, as if the measurement were a photograph.',
    ],
    mid: [
      'The scale groans softly under her. She looks down, then up, and a slow smile crosses her face.',
      'Digits rise. She exhales through her nose, rolls her shoulders, and says, "That tracks."',
      'She steps on twice to be sure. The second reading is higher. She chooses to keep the second one.',
      'Fabric pulls at her waist when she shifts her weight. She notices, adjusts, and does not apologize.',
    ],
    late: [
      'She mounts the scale like a ritual, toes forward, hips loose. The number climbs and she nods approval.',
      'The platform settles high. She laughs once, low in her throat, and asks you to read it aloud.',
      'She refuses to step off until you log the gain. Pride sits plain on her face.',
      'Weight registers. She pats her middle afterward, satisfied, as if confirming the reading by hand.',
    ],
  },
  comfort_blend: {
    early: [
      'You whisk vanilla powder into warm milk. She accepts the cup, sips once, and declares it mild.',
      'Steam fogs her glasses. She wipes them, tries again, and finishes standing near the vitals cart.',
      'She drinks half before asking what is in it. You list the ingredients. She finishes the rest.',
      'The blend smells like bakery air. She holds the cup away at first, then brings it back and commits.',
    ],
    mid: [
      'Cream rises to her lip. She licks it off without thinking and drains the cup before the chair cools.',
      'Warmth hits her chest. Her shoulders drop. She asks for water afterward and drinks that too.',
      'She sips, pauses, sips again faster. "Oh," she says quietly, and empties the cup in two long pulls.',
      'Vanilla dust clings to her upper lip. She notices when you do, laughs, and finishes every drop.',
    ],
    late: [
      'She cradles the warm cup in both hands and does not stand until the bottom shows.',
      'She sighs when the last swallow goes down, eyes half closed, already reaching for the refill pitcher.',
      'Blend first, she says, always blend first. She drinks slow, throat working, savoring each pull.',
      'She asks for a road cup before the first is empty. You pour two. She takes both.',
    ],
  },
  appetite_tonic: {
    early: [
      'Amber liquid gleams in the vial. She swallows, winces once, and rolls her shoulders waiting for effect.',
      'She reads the dosing card before she drinks. Heat hits. She blinks and says the aftertaste is interesting.',
      'The tonic burns going down. She fans her mouth with the card and asks how long until lunch.',
      'She takes the dose like medicine, neat and quick, then watches the clock on the wall for changes.',
    ],
    mid: [
      'Heat blooms in her throat. Her eyes widen. "Oh," she says, and the word carries hunger in it.',
      'She presses her palm to her sternum and laughs once, embarrassed by how fast her appetite answers.',
      'The tonic lands. She licks her lips, checks her phone for nearby cafes, and closes the app unsatisfied.',
      'Amber fire spreads. She fans her collar and asks what the clinic keeps in the snack drawer.',
    ],
    late: [
      'She grins at the burn and says, "Do that again tomorrow." Her hand is already on her purse snacks.',
      'She drinks the vial in one tilt, shudders happily, and asks whether lunch can be brought to the lounge.',
      'Tonic down. Hunger up. She tells you she could eat the entire vending wall and looks pleased about it.',
      'She licks the dropper clean, fans her mouth, and reaches for the recovery shake before you offer it.',
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
      'Thick shake pulls slow through the straw. She stares at the wall like she is somewhere softer.',
      'She asks for a napkin and uses it on the cup, not her face. The stain stays. She does not mind.',
      'She drinks without pause. When the cup runs dry she turns it upside down and waits for the last drop.',
    ],
    late: [
      'She drains it slow, eyes closed, throat working on every swallow until the cup is light.',
      'Empty cup on the counter. She sets it down like a finished plate and pats her belly once, content.',
      'She leans back in the chair, shake in hand, and does not move until the last ice melts.',
      'She moans quietly at the final swallow, pretends she did not, and asks if there is another flavor today.',
    ],
  },
  comfort_plan: {
    early: [
      'You slide the printed plan across the desk. She folds it once, neat, and tucks it into her bag.',
      'She reads the evening section with a pen ready. One underline. She closes the pamphlet and nods.',
      'Portions, rest, richer evenings: she scans each bullet and asks one clarifying question, then goes quiet.',
      'The plan smells like fresh toner. She says she will read it tonight and means it.',
    ],
    mid: [
      'She underlines the snack list in pen before she stands. Larger portions get a star in the margin.',
      'She reads the evening section twice in the car with the engine running. You watch through the window.',
      'She asks whether the plan allows second helpings. You say yes. She exhales like a door opened.',
      'The comfort plan disappears into her bra strap because her hands are full of take-home cups.',
    ],
    late: [
      'She takes the plan like permission and smiles with her whole face. "Finally," she says, soft.',
      'She asks you to initial the page about richer evenings. You do. She hugs the paper to her chest once.',
      'Every line gets a checkmark. She pockets the plan, pats her middle, and says she is ready for all of it.',
      'She reads the snack list aloud to herself, savoring each item, then asks for a duplicate for her fridge.',
    ],
  },
  lounge_snack: {
    early: [
      'You set a small plate on the side table. She eats one piece, compliments the salt, and saves the rest.',
      'She nibbles while reviewing her chart printout, crumbs falling neatly onto the napkin in her lap.',
      'The lounge snack is modest. She finishes half, wraps the remainder, and slips it into her purse.',
      'She chooses the fruit first, then the cracker, then pauses as if deciding whether to continue.',
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
  },
  note_symptoms: {
    early: [
      'You ask about tight waistbands and afternoon hunger. She answers in clinical terms, relieved you are not alarmed.',
      'She lists comfort symptoms like weather reports: belt notch moved, sleep deeper, appetite steadier.',
      'You note the symptoms without judgment. She exhales and admits the scale has been kinder than her mirror.',
      'Chart open, pen ready. She volunteers one symptom, then another, each easier than the last.',
    ],
    mid: [
      'She describes hunger arriving earlier each day. You log it. She watches your face for approval and finds it.',
      'Tight clothes, louder stomach, softer evenings. She recites the list like a progress report she is proud of.',
      'You note afternoon crashes and evening cravings. She nods hard. "Exactly that," she says.',
      'Symptoms spill out faster than you can write. She laughs once and says the clinic finally speaks her language.',
    ],
    late: [
      'She lists symptoms you stopped needing to ask about. Fullness, heat, appetite that outlasts meals. You tick each box.',
      'Comfort symptoms fill half the page. She reads over your shoulder and adds one you forgot: joy.',
      'She describes her body in plain terms now. No apology. You note everything and she thanks you for listening.',
      'The symptom review becomes a celebration. She pats her middle when you write indulgence and says, "Accurate."',
    ],
  },
  warm_blanket: {
    early: [
      'You drape a heated throw across her lap. She stiffens once, then melts into the chair with a quiet sigh.',
      'Warmth climbs through the fabric. Her shoulders drop. She thanks you like you handed her permission to rest.',
      'The blanket hums faintly on low. She adjusts it twice, finds the fit, and closes her eyes for a breath.',
      'Heat meets cold hands. Color returns to her knuckles. She says the room feels kinder already.',
    ],
    mid: [
      'She pulls the blanket higher without asking. Heat blooms across her thighs. Her voice goes soft at the edges.',
      'The throw settles over her middle. She groans once, pleased, and jokes that she could nap through billing.',
      'Warmth loosens her posture. She sinks into the chair, blanket tucked under her chin like a secret.',
      'She hugs the heated edge to her chest. Eyes half closed. "More of this," she murmurs, already half serious.',
    ],
    late: [
      'She claims the blanket like furniture. Heat, weight, comfort layered until the exam room feels like a lounge.',
      'The throw barely covers her now. She does not care. Warmth wins. She purrs low in her throat when you tuck a corner.',
      'Blanket on, lights dimmed by her request. She smiles with her whole face and says this is why she keeps coming back.',
      'She refuses to give the blanket back when vitals end. You let her keep it through checkout. She looks victorious.',
    ],
  },
  personal_talk: {
    early: [
      'You ask how her week went. She mentions work, a neighbor, the traffic on the bridge. Her voice stays even.',
      'She talks about sleep and stress with the calm of someone reporting weather. You listen. She appreciates it.',
      'Small talk first: weather, parking, the new chairs. Then she quiets and lets the room do the rest.',
      'She shares one worry about scheduling, accepts your reassurance, and straightens her sleeve.',
    ],
    mid: [
      'She admits hunger hits at odd hours now. She laughs about it, then grows quiet and asks if that is normal here.',
      'Her voice drops. She tells you these visits are the calmest part of her week. She looks relieved to say it.',
      'She talks about clothes fitting differently. No panic in it. Curiosity, mostly, and a question about pace.',
      'She leans forward, elbows on knees, and confesses she thinks about food more since she started coming.',
    ],
    late: [
      'She says she has stopped apologizing for appetite. She means it. Her hands rest open on her thighs.',
      'She tells you she rearranged her calendar around these appointments. She does not sound like she regrets it.',
      'She asks you to keep her on the comfort track. No hedging. Her gaze holds steady.',
      'She laughs about how soft she has gotten and does not sound unhappy. She asks what comes next.',
    ],
  },
  upsell_package: {
    early: [
      'You describe the premium bundle: extra blends, lounge priority, handwritten follow-ups. She listens with folded hands.',
      'She asks what the upgrade costs and what it includes. You answer. She says she will think about it.',
      'The package pamphlet is glossy. She reads the fine print, nods slowly, and requests a copy to take home.',
      'She compares the standard visit to the bundle on your tablet. Her brow furrows in honest calculation.',
    ],
    mid: [
      'She taps the line about doubled snack access and smiles. "That alone might be worth it," she says.',
      'You outline the premium cadence. She asks whether the recovery nook stays private. You say yes. She signs.',
      'She hesitates on price for one breath, then thinks about the vending wall and reaches for the pen.',
      'She upgrades before you finish the pitch. "I am already here often," she says. "Might as well mean it."',
    ],
    late: [
      'She waves away the summary slide. "Best package," she says. "Whatever keeps the cabinet full."',
      'She signs the premium form without reading the second page. Her loyalty number is already on file.',
      'She asks whether the bundle includes road cups. You add a note. She initials twice, grinning.',
      'She pulls out her card before you open the folder. "Charge it," she says. "I am not going anywhere."',
    ],
  },
  bill_consultation: {
    early: [
      'You print the visit summary and slide it across the desk. She reviews each line item with care.',
      'The consultation fee sits at the bottom. She pays without comment and pockets the receipt folded once.',
      'She asks whether insurance covers comfort compounds. You explain. She nods and taps her card.',
      'Checkout takes three minutes. She thanks you for the clarity and checks the total twice before approving.',
    ],
    mid: [
      'She sees the compound charges and smiles like they were souvenirs. Card down. Done.',
      'The bill is longer than last visit. She traces the snack line, laughs quietly, and pays in full.',
      'She tips on the consultation without being asked. "For the time," she says, and means the chair time.',
      'She pays, then asks whether the same card works for the premium upgrade next time. You say yes.',
    ],
    late: [
      'She does not glance at the total. Hand on the terminal. Approved before the screen finishes spinning.',
      'The receipt prints long. She folds it into her snack bag and says she will frame the best month someday.',
      'She pays for today and prepays for two visits ahead. "Keep my slot warm," she says.',
      'Bill settled. She asks for a duplicate receipt for her records and a third because she likes the logo.',
    ],
  },
  schedule_followup: {
    early: [
      'You offer next Thursday at two. She checks her calendar, confirms, and writes it on the back of her receipt.',
      'She books three weeks out to start. Steady cadence, she says. She wants to see how the plan feels.',
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
  },
  end_visit: {
    early: [
      'She gathers her coat and chart copies, thanks you once at the desk, and steps into the hall with measured pace.',
      'Visit complete. She pauses at the door to read the hours poster again, then leaves with a small wave.',
      'You walk her to the elevator. She says goodbye like a promise kept, not a romance begun.',
      'She checks her phone in the lobby, smiles at the reminder she set, and pushes through the glass doors.',
    ],
    mid: [
      'She lingers at the coat rack, one hand on her middle, already thinking about lunch on the walk home.',
      'She hugs the take-home cups to her chest and thanks you for the time. Her steps slow on the rug.',
      'She stops at the vending wall on her way out. You pretend not to watch. The machine hums.',
      'She turns at the door, looks back at the chairs, and says she will dream about them. She might.',
    ],
    late: [
      'She asks if the recovery nook is free before she leaves. You say yes. She disappears behind the curtain.',
      'She thanks you for the second snack without pretending she did not want it. Her laugh follows her out.',
      'She schedules again at the door, buys a shake from the wall, and drinks it in the elevator.',
      'She leaves slower than she arrived, fuller in every sense, and texts you a heart before she reaches her car.',
    ],
  },
};

const VISIT_REPLIES = {
  say_hi: 'Good to see you. I have been looking forward to this.',
  review_chart: 'Show me what changed since last time.',
  offer_water: 'Yes, please. My throat is dry already.',
  weigh_patient: 'Go ahead. I want the real number.',
  comfort_blend: 'I will try whatever you are mixing today.',
  appetite_tonic: 'If it works fast, I am in.',
  recovery_shake: 'Chocolate sounds perfect right now.',
  comfort_plan: 'I want the full plan, not the summary.',
  lounge_snack: 'What do you have out today?',
  personal_talk: 'Can we talk for a minute before I go?',
  note_symptoms: 'Write down the tight waistband thing. It is real.',
  warm_blanket: 'Oh, that is nice. Can you leave it on?',
  upsell_package: 'Tell me what the premium visit includes.',
  bill_consultation: 'Walk me through the charges once.',
  schedule_followup: 'Book me before I lose my nerve.',
  end_visit: 'Thank you. Same time next visit?',
};

const VISIT_OPENING = {
  early: [
    'She arrives on time with questions folded in her purse and patience in her posture.',
    'The lobby still feels new to her. She reads the signage, then your face, then nods hello.',
    'She checks in quietly, coat neat, voice low, ready to be guided.',
    'First impressions matter to her. She notices the chairs, the scent, the calm, and decides to stay open.',
  ],
  mid: [
    'She walks in like someone who knows which chair yields and which cabinet hums.',
    'Her appetite arrives before she does. She smiles at the desk and asks what is warm today.',
    'She settles into the lobby with a sigh that says the week can wait outside.',
    'She greets you by name and glances toward the lounge before she finishes saying hello.',
  ],
  late: [
    'She comes through the door already softer, already hungry, already yours for the hour.',
    'No preamble. She drops her bag, kicks off her shoes by the chairs, and grins.',
    'She books her body into the nearest seat and looks up like the visit is home.',
    'She arrives carrying snacks for the wait and appetite for whatever you offer after.',
  ],
};

const VISIT_CLOSING = {
  early: [
    'She leaves with pamphlets flat in her bag and next week already on her calendar.',
    'The visit ends tidy. Receipt tucked away. Steps measured. Trust earned in small pieces.',
    'She pauses at the door, thanks you once more, and walks out into ordinary air.',
    'Checkout complete. She buttons her coat and carries the calm with her to the elevator.',
  ],
  mid: [
    'She lingers in the lobby after payment, hand at her middle, savoring the afterglow.',
    'She leaves fuller than she came, schedule heavier, smile harder to hide.',
    'The door closes behind her. The vending wall hums. You suspect she will be back before Friday.',
    'She texts a thank-you before she reaches her car. The message includes a croissant emoji.',
  ],
  late: [
    'She signs, snacks, schedules, and somehow stays another ten minutes without asking.',
    'Checkout is a formality. She has already moved into the next appointment in her head.',
    'She hugs you at the desk, takes two road cups, and promises to return hungry.',
    'She leaves the bill paid, the nook visited, and the calendar full through next month.',
  ],
};

export const MISSED_VISIT_WEEK_LINES = [
  'She no-showed her slot. The chair stayed empty. Her chart cooled on the tablet.',
  'A cancellation ping with no apology. The lounge held her place until someone else took it.',
  'Her name stayed on the board all afternoon, then came down. Momentum slipped a size.',
  'The reminder went unanswered. When you called, voicemail. The week moved on without her.',
  'She skipped without rescheduling. Trust thinned. The next opening went to someone hungrier.',
];

export function getVisitNarrative(actionId, patient, tier) {
  const actionPool = VISIT_NARRATIVE[actionId];
  if (!actionPool) return { narrative: '', reply: '' };
  const resolvedTier = tier || tierFromAttitude(getAttitudeKey(patient));
  const pool = actionPool[resolvedTier] || actionPool.mid || actionPool.late || [];
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
      'She pats the compound line on her receipt and says it was worth every drop.',
      'Take-home cups rattle in her bag. She shakes them once, listening, then laughs.',
    ];
  }
  if (visitSummary.premiumSold) {
    pool = [
      ...pool,
      'Premium card tucked in her wallet. She taps it twice, like a superstition.',
      'She leaves on the upgraded plan, already asking what the longer slot includes.',
    ];
  }
  if (visitSummary.followupSkipped) {
    pool = [
      ...pool,
      'She leaves without a follow-up booked. The desk feels briefly too quiet.',
      'No next date on the calendar. You note it and hope she calls before the week turns.',
    ];
  }

  return pickLine(patient, pool);
}

export function getMissedVisitPenalty(patient) {
  return pickLine(patient, MISSED_VISIT_WEEK_LINES);
}
