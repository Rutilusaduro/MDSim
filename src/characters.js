import {
  composePatientAppearance,
  ensurePatientAppearance,
  generatePatientAppearance,
  getPatientAppearanceSummary,
} from './patientAppearance.js';
import { patientArchetypeLines, getPatientEarlyBodyLine, getPatientHook } from './patientDialogue.js';
import { getClinicalPatientLine, shouldUseClinicalPatientVoice } from './patientClinicalVoice.js';
import { staffArchetypeLines } from './staffDialogue.js';
import { staffBodyDescriptions, patientBodyDescriptions } from './bodyProse.js';

export { getPatientAppearanceSummary };

export const STAGE_MAX = 11;
export const STAGE_COUNT = 12;
export const IMMOBILE_STAGE = 10;
export const BLOB_STAGE = 11;

/** Weight floors for 12 stages. Stage 11 (index 10) immobile; stage 12 (index 11) bedbound blob. */
export const STAGE_WEIGHT_FLOORS = [0, 165, 195, 230, 270, 310, 350, 430, 540, 700, 920, 1250];
export const STAGE_WEIGHT_CEILING = 2400;

export const weightStageNames = [
  'Still Hungry',
  'First Bites',
  'Growing Appetite',
  'Heavy Habit',
  'Shameless Glutton',
  'Swollen & Soft',
  'Outgrowing Everything',
  'Gorge Queen',
  'Massive & Spreading',
  'Too Wide to Walk',
  'Immobile Blob',
  'Titanic Mass',
];

export const bodyTypes = {
  hourglass: {
    label: 'Hourglass',
    baseRange: [148, 178],
    stageSize: 18,
    descriptions: [
      'She wears her scrubs like a uniform. Posture straight. Waist and hips where they belong.',
      'Long shifts leave a mark. The fabric sits closer at the hips. She has not said a word about it.',
      'Softness gathers at her waist and hips. Small enough to blame on the dryer.',
      'Weight lands on thighs, belly, chest. Her waist still pinches in. The hourglass deepens.',
      'Hips catch chair arms when she sits. The top button fights her chest. Her walk slows.',
      'Her belly meets the waistband when she exhales. Hips roll crossing the linoleum.',
      'Heavy chest. Wide hips. A waist that still dips but fills in. Flesh shifts when she shifts.',
      'Seams strain at hip and bust. Sweat darkens her collar after one long hall.',
      'She arrives before her voice does. Belly and hips sway. Breath fogs the air between words.',
      'Chairs complain under her. Heat trails her through the clinic.',
      'Belly, arms, hips: all thick now. She takes space without asking.',
      'Each step sends weight through her frame. Plush. Warm. Impossible to miss.',
    ],
  },
  pear: {
    label: 'Pear',
    baseRange: [142, 172],
    stageSize: 19,
    descriptions: [
      'Slim shoulders. Clean scrubs. A figure that still looks like the hire photo.',
      'Her hips and thighs feel fuller. Laundry shrinks things. That is the story she tells.',
      'Weight settles low. Her walk picks up a sway she keeps noticing in window glass.',
      'Hips widen into chairs. Waistbands ride up over a belly that was flat in March.',
      'Most of the gain lives below the belt: thick thighs, a heavy seat, hips that spread on the cushion.',
      'Her hips brush doorframes. Belly adds a forward curve. Balance takes thought now.',
      'Thighs rub when she walks. Fabric pulls smooth over hip and flank.',
      'Lower body outruns the top. The contrast makes every skirt a negotiation.',
      'She overflows chair edges. Belly folds soft over her lap when she sits.',
      'Steps come slower. Hips roll visible under thin scrubs.',
      'Thick thighs. Deep belly crease. A seat that fills any room she enters.',
      'Hips define the doorway. Weight in every stride. Statuesque and dense.',
    ],
  },
  apple: {
    label: 'Apple',
    baseRange: [150, 182],
    stageSize: 20,
    descriptions: [
      'Flat middle. Brisk step. She still looks like someone new to the job.',
      'Her blouse tents slightly at the front. She smooths it down without thinking.',
      'Belly softens and pushes forward. She tugs her top down twice a shift now.',
      'Her middle thickens. Chest lifts with it. Seated breaths move fabric in small waves.',
      'Belly leads when she walks. It brushes the counter edge. Color rises in her cheeks.',
      'Abdomen settles into her lap when she sits. She sighs. Stays seated longer.',
      'Torso dominates the silhouette: round belly, full cheeks, cardigans that gap.',
      'One hand rests on her middle when she stands, as if checking the weight is still there.',
      'Belly nudges tables. Clothes round over it. Every outfit looks one size too small.',
      'Hall work leaves her breathing loud. Chest heaves over a middle that sways when she stops.',
      'Belly heavy on every chair. Warm. Serene. She does not suck it in anymore.',
      'Rounded torso. Soft arms. Full face. She carries her weight high and proud.',
    ],
  },
  athletic: {
    label: 'Athletic',
    baseRange: [145, 176],
    stageSize: 17,
    descriptions: [
      'Athletic build. Firm posture. Scrubs fit the way they should.',
      'Stomach less flat. Thighs fill the pant leg. Definition blurs at the edges.',
      'Softness replaces muscle lines across middle and hip. Uniform fabric works harder.',
      'Strength still shows in her shoulders. Belly and chest bounce when she moves.',
      'Power and padding share the same body. Quick strides turn into a heavier sway.',
      'Muscle hides under warm flesh. Waistband digs in after lunch.',
      'Thick legs. Soft arms. Full belly. She carries mass with new ease.',
      'Sharp lines gone. Dense softness rolls over what muscle remains.',
      'Capable still. Slower. Warmer. Cushioned in a way she cannot hide.',
      'Each step ripples through a body that once ran miles for fun.',
      'Old strength holds up new weight. Limbs thick. Belly heavy. Sway constant.',
      'Plush and powerful. Every footfall lands with earned mass.',
    ],
  },
  willowy: {
    label: 'Willowy',
    baseRange: [126, 152],
    stageSize: 16,
    descriptions: [
      'Slender. Long limbs. Light on her feet. A normal Tuesday body.',
      'Padding at hip and lower belly. She pokes it in the bathroom mirror.',
      'Her narrow frame rounds. Fitted clothes tell the story she will not.',
      'Limbs stay long. They carry plush now. Movement looks slower, deliberate.',
      'Once-slight silhouette swells at chest, belly, thigh, face.',
      'Weight hangs on her bones. Rounded belly. Soft arms. Warmer in every room.',
      'No longer slight. She drapes into chairs. Flesh settles where it lands.',
      'Every pound shows: blouse strain, thighs touching mid-stride.',
      'Long frame packed soft. Low belly sways. Cheeks flush after meals.',
      'Steps drag with new mass. More body than she thought she could hold.',
      'Slender memory buried in folds. Deep curves. Slow confidence.',
      'Tall column of fat from cheek to thigh. She owns the hallway now.',
    ],
  },
  compact: {
    label: 'Compact',
    baseRange: [136, 162],
    stageSize: 18,
    descriptions: [
      'Petite. Scrubs tidy. Still matches the photo on her ID badge.',
      'A few pounds land fast on a short frame. Waistband snug. Face softer.',
      'Belly and hips press the uniform. The gain is obvious now.',
      'Each pound stacks dense. She looks shorter. Rounder. Fuller.',
      'Curves push the fabric outward. Chairs fill fast when she sits.',
      'Belly rests on her lap. Thighs thick. Arms soften every gesture.',
      'Softness packed tight. Warm. Bounce in every step.',
      'Grounded presence. Dense flesh. Breath shallow in reinforced chairs.',
      'Belly and hips hit the desk first. She does not apologize for it.',
      'Compact jiggle when she moves. Small rooms feel smaller.',
      'Rounded belly. Full cheeks. Thick thighs. Pleasure in her posture.',
      'Short body. Grand weight. Appetite written in every seam.',
    ],
  },
};

for (const key of Object.keys(bodyTypes)) {
  if (staffBodyDescriptions[key]) {
    bodyTypes[key].descriptions = staffBodyDescriptions[key];
  }
}

export const archetypes = {
  nurturer: {
    label: 'Nurturer',
    appetiteMod: 0.8,
    trustMod: 1.2,
    hook: 'Warm, reliable, and always checking on everyone else before herself.',
    lines: {
      professional: 'I love it here. The team is wonderful and the patients actually listen.',
      noticing: 'Huh... my scrubs feel a little tighter? Probably just shrank in the dryer.',
      hungry: 'Why am I so hungry lately? Oh my god. I could eat the entire break room.',
      pleased: 'I feel calmer when I am full. Softer, steadier... I think I am starting to like it.',
      indulgent: 'I am getting so fat and I do not even mind. Feed me before rounds, please.',
      devoted: 'I am so fucking fat now and I love it. I just want to eat and grow until the ground cracks beneath me.',
    },
  },
  perfectionist: {
    label: 'Perfectionist',
    appetiteMod: 0.55,
    trustMod: 0.8,
    hook: 'Precise, organized, and proud of running a tight ship.',
    lines: {
      professional: 'Good clinic, clear protocols. I am exactly where I want to be.',
      noticing: 'My waistband is snugger than last month. That is... statistically odd.',
      hungry: 'I cannot stop thinking about food between shifts. This is not in my schedule.',
      pleased: 'The weight is off-plan, but I cannot deny how good fullness feels lately.',
      indulgent: 'Screw the old metrics. I want bigger portions and softer results.',
      devoted: 'I am enormous now and I love every pound. Keep feeding me until nothing fits. I do not care.',
    },
  },
  socialite: {
    label: 'Socialite',
    appetiteMod: 1,
    trustMod: 1,
    hook: 'Charming, social, and always first to greet patients at the door.',
    lines: {
      professional: 'Best job I have had. Great coworkers, gorgeous lobby. I am happy here!',
      noticing: 'Has anyone else noticed their uniform fitting differently? ...Just me?',
      hungry: 'I am STARVING by noon every single day. It is honestly kind of embarrassing.',
      pleased: 'Okay, the curves are doing something. People keep staring and I am not mad about it.',
      indulgent: 'I am getting huge and I look incredible. Bring pastries to my desk.',
      devoted: 'I am so fucking fat now, I love it, and I want the whole world to watch me grow.',
    },
  },
  rebel: {
    label: 'Rebel',
    appetiteMod: 0.9,
    trustMod: 0.7,
    hook: 'Blunt, independent, and slow to trust authority. She still shows up on time.',
    lines: {
      professional: 'Yeah, it is fine. Better than my last place. I will stick around.',
      noticing: 'These scrubs did not used to pull across my hips like this. Weird.',
      hungry: 'I am hungry all the time and I do not know why. It is driving me insane.',
      pleased: 'Fine. The extra weight feels good. You still do not get to say you were right.',
      indulgent: 'I am fat as hell now and I do not want to stop. Keep the snacks coming.',
      devoted: 'I am so fucking fat I can barely waddle and I love it. More. Always more.',
    },
  },
  scholar: {
    label: 'Scholar',
    appetiteMod: 0.65,
    trustMod: 1.1,
    hook: 'Quiet, observant, and always reading something between patient calls.',
    lines: {
      professional: 'Fascinating practice. I am glad I accepted this position.',
      noticing: 'I have logged a measurable change in fit. Could still be fabric variance.',
      hungry: 'My appetite has spiked beyond any reasonable model. I need answers. And lunch.',
      pleased: 'The data on my body is compelling. Fullness correlates strongly with contentment.',
      indulgent: 'Hypothesis confirmed: I want to be fatter. Proceed with maximum calories.',
      devoted: 'I am morbidly, gloriously obese and I want to study how much fatter I can get.',
    },
  },
  dreamer: {
    label: 'Dreamer',
    appetiteMod: 1.05,
    trustMod: 1.1,
    hook: 'Gentle and a little absent-minded, but patients find her calming.',
    lines: {
      professional: 'It is so peaceful here. I feel lucky to work somewhere this warm.',
      noticing: 'I keep adjusting my belt. When did that start happening?',
      hungry: 'I drift through the day thinking about lunch... then dinner... then more food...',
      pleased: 'It feels like being wrapped in myself. Warm, slow, safe. I want more of this.',
      indulgent: 'I am so soft now. I just want to sit and eat until I cannot move.',
      devoted: 'I am impossibly fat and deliriously happy. Feed me until the floor groans.',
    },
  },
  athlete: {
    label: 'Former Athlete',
    appetiteMod: 1.15,
    trustMod: 0.85,
    hook: 'Disciplined and energetic. She still moves like someone who used to train daily.',
    lines: {
      professional: 'Solid hours, good benefits. Happy to be on the team.',
      noticing: 'My scrubs are tighter across the thighs. Huh. That is new.',
      hungry: 'I used to skip meals without thinking. Now I cannot. I am hungry constantly.',
      pleased: 'Different kind of conditioning, I guess. And my body is responding fast.',
      indulgent: 'I am getting huge and I feel powerful. Do not slow down the meal plan.',
      devoted: 'I am so fucking fat now and I love it. I want to grow until I am immovable.',
    },
  },
  hedonist: {
    label: 'Hedonist',
    appetiteMod: 1.35,
    trustMod: 1,
    hook: 'Easygoing and pleasure-seeking, though nothing suspicious yet.',
    lines: {
      professional: 'Honestly? Great job, nice people, good coffee. No complaints at all.',
      noticing: 'Okay, my pants are definitely snugger. When did that happen?',
      hungry: 'Why am I so hungry oh my god. I already ate and I want more right now.',
      pleased: 'Everything feels tighter and softer. Honestly? It is kind of delicious.',
      indulgent: 'I am fat, happy, and not apologizing. Bring me everything on the menu.',
      devoted: 'I am so fucking fat now I love it. I just want to eat and grow until the ground cracks beneath me.',
    },
  },
  patron: {
    label: "Donor's Niece",
    appetiteMod: 1.1,
    trustMod: 1.15,
    hook: 'Connected, polished, used to getting what she asks for.',
    lines: {
      professional: 'My aunt funded the wing. I am here to learn. And eat, apparently.',
      noticing: 'These designer scrubs were tailored in March. Tailored tight now.',
      hungry: 'The catering here is better than my gym meal plan. That is not a compliment to the gym.',
      pleased: 'I posted a mirror pic. Deleted it. Reposted it. The curves won.',
      indulgent: 'Bill it to the foundation. I want the rich stuff. All of it.',
      devoted: 'Tell my aunt her clinic made me enormous. I want to thank her in person. Naked appetite.',
    },
  },
  vip: {
    label: 'Returning VIP',
    appetiteMod: 1.25,
    trustMod: 1.05,
    hook: 'She came back on purpose. She knows what this place does.',
    lines: {
      professional: 'Last clinic bored me. You people seem to understand comfort.',
      noticing: 'Already up a belt notch. Good. That is why I returned.',
      hungry: 'I dream about your break room. That is not normal. I do not care.',
      pleased: 'Other patients stare. Let them. I am the success story walking.',
      indulgent: 'Double my plan. I am on vacation from skinny.',
      devoted: 'I fly in monthly now. Fatter every time. Keep me on your best schedule.',
    },
  },
  rivalSpy: {
    label: "Rival's Mole",
    appetiteMod: 0.95,
    trustMod: 0.6,
    hook: 'Sent from ThriveWell Annex. Curiosity wins over loyalty fast.',
    lines: {
      professional: 'Just researching wellness trends. Your lobby is... different.',
      noticing: 'Okay. The chairs are nicer. And the snacks. Stop looking at me.',
      hungry: 'I was supposed to report back. I ordered seconds instead.',
      pleased: 'ThriveWell can wait. I am learning things about appetite.',
      indulgent: 'Fine. I am a convert. Their juice bar can rot.',
      devoted: 'I work for you now. Fat, happy, and done with detox culture.',
    },
  },
  foodBlogger: {
    label: 'Food Blogger',
    appetiteMod: 1.2,
    trustMod: 1.1,
    hook: 'Reviews clinics like restaurants. Yours is trending.',
    lines: {
      professional: 'Great lighting. Good vibes. Content potential is insane.',
      noticing: 'My ring light catches new curves. Engagement is up. So is my waist.',
      hungry: 'I came for a post. Stayed for the casserole. Filmed both.',
      pleased: 'The comments love my softness. I love the trays.',
      indulgent: 'Sponsor me or feed me. Ideally both. I am not stopping.',
      devoted: 'My channel is just me getting fatter here. Subscribers thank you.',
    },
  },
  gymDefector: {
    label: 'Gym Defector',
    appetiteMod: 1.3,
    trustMod: 0.9,
    hook: 'Cancelled the membership. Kept the hunger.',
    lines: {
      professional: 'My trainer fired me. I needed a softer practice.',
      noticing: 'Leggings dig in now. Good. That is data.',
      hungry: 'I replaced cardio with your vending wall. No regrets yet.',
      pleased: 'Muscle memory fading. Softness memory strong.',
      indulgent: 'I want to be the cautionary tale that makes people jealous.',
      devoted: 'Immobility is a goal now. Feed me like a retirement plan.',
    },
  },
  housewifeDonor: {
    label: 'Bored Housewife Donor',
    appetiteMod: 1.15,
    trustMod: 1.2,
    hook: 'Funded a wing out of boredom. Stayed for the trays.',
    lines: {
      professional: 'My husband thinks I volunteer. I do. The snacks are the volunteer part.',
      noticing: 'Designer waistbands lie. These curves do not.',
      hungry: 'Book club can wait. Your casserole cannot.',
      pleased: 'I donate and dine. Tax write-off and waistline both grow.',
      indulgent: 'Money buys trays. Trays buy softness. I buy more trays.',
      devoted: 'I fund the clinic with one hand and feed myself with the other. Both are full.',
    },
  },
  rivalDoctor: {
    label: "Rival Doctor's Patient",
    appetiteMod: 1.05,
    trustMod: 0.75,
    hook: 'Sent by ThriveWell. Curiosity became appetite.',
    lines: {
      professional: 'My doctor says you are bad for discipline. I am checking.',
      noticing: 'Discipline is losing. Comfort is winning.',
      hungry: 'I was supposed to report back. I ordered seconds.',
      pleased: 'ThriveWell can wait. I am learning appetite.',
      indulgent: 'Tell my doctor I defected. Bring dessert.',
      devoted: 'I switched clinics permanently. Fat and happy. No refunds.',
    },
  },
  foodTruckOwner: {
    label: 'Food Truck Owner',
    appetiteMod: 1.25,
    trustMod: 1.0,
    hook: 'She samples everything. Including your policy.',
    lines: {
      professional: 'Good parking. Good foot traffic. Great smells.',
      noticing: 'I taste-test for work. I taste-test for pleasure now too.',
      hungry: 'My truck makes money. Your clinic makes me hungry.',
      pleased: 'I park outside on Fridays. We both profit.',
      indulgent: 'Free samples for staff. Paid samples for me. All calories welcome.',
      devoted: 'I sold the truck. I eat here full time now.',
    },
  },
  sleepClinicDefector: {
    label: 'Sleep Clinic Defector',
    appetiteMod: 1.2,
    trustMod: 1.05,
    hook: 'Left a sleep clinic. Found appetite instead of rest.',
    lines: {
      professional: 'I used to treat insomnia. Now I treat hunger.',
      noticing: 'Sleep is overrated. Fullness is not.',
      hungry: 'Midnight snacks became midday feasts. I am not going back.',
      pleased: 'My old patients would not recognize me. Good.',
      indulgent: 'Wake me for meals. Nothing else.',
      devoted: 'I defected from rest culture entirely. Feed me until I nap happy.',
    },
  },
};

const staffEthnicities = [
  'Nigerian-American',
  'Mexican-American',
  'Indian-British',
  'Ukrainian',
  'Black American',
  'French-Caribbean',
  'Korean-American',
  'Italian-American',
  'Filipino-American',
  'Irish-American',
  'Persian-American',
  'Puerto Rican',
];

const staffTemplates = [
  ['Maya Okafor', 'Head Nurse', 34, 'Nigerian-American'],
  ['Elena Ruiz', 'Front Desk Coordinator', 29, 'Mexican-American'],
  ['Priya Shah', 'Physician Assistant', 38, 'Indian-British'],
  ['Nadia Volkov', 'Clinic Manager', 42, 'Ukrainian'],
  ['Jasmine Brooks', 'Phlebotomist', 26, 'Black American'],
  ['Camille Laurent', 'Nutrition Liaison', 45, 'French-Caribbean'],
];

const patientFirstNames = [
  'Arielle',
  'Bianca',
  'Celeste',
  'Daphne',
  'Farah',
  'Grace',
  'Hana',
  'Isabel',
  'Keiko',
  'Leona',
  'Marisol',
  'Noelle',
  'Opal',
  'Renee',
  'Sofia',
  'Talia',
  'Vivian',
  'Zara',
];

const patientLastNames = [
  'Adler',
  'Bennett',
  'Choi',
  'Diaz',
  'Ellis',
  'Frost',
  'Garcia',
  'Hale',
  'Ibrahim',
  'Jones',
  'Kim',
  'Lopez',
  'Mori',
  'Novak',
  'Patel',
  'Quinn',
  'Sato',
  'Wright',
];

const patientJobs = [
  'gallery curator',
  'software lead',
  'sommelier',
  'graduate advisor',
  'boutique owner',
  'architect',
  'voice actor',
  'event planner',
  'massage therapist',
  'pastry chef',
  'opera coach',
  'hotel director',
];

const preferences = [
  'cream pastries',
  'savory noodles',
  'buttery breads',
  'milk tea',
  'late-night desserts',
  'rich soups',
  'soft cheeses',
  'chocolate drinks',
  'sweet breakfast trays',
  'comfort casseroles',
];

const bodyTypeKeys = Object.keys(bodyTypes);
const archetypeKeys = Object.keys(archetypes);

export function defaultPreferences() {
  return { pace: 'gradual', focus: 'comfort', public: 'private' };
}

export function preferenceGainMod(prefs) {
  if (!prefs) return 1;
  let mod = 1;
  if (prefs.pace === 'eager') mod *= 1.12;
  if (prefs.focus === 'appetite') mod *= 1.1;
  if (prefs.public === 'open') mod *= 1.05;
  return mod;
}

function makeId(prefix, rng) {
  return `${prefix}-${Math.floor(rng.next() * 1000000).toString(16)}`;
}

export function createStartingStaff(rng) {
  return staffTemplates.slice(0, 5).map(([name, role, age, ethnicity]) => {
    const bodyType = rng.pick(bodyTypeKeys);
    const profile = bodyTypes[bodyType];
    const baselineWeight = rng.int(profile.baseRange[0], profile.baseRange[1]);
    const startingGain = rng.int(0, 4);
    const archetype = rng.pick(archetypeKeys);

    return {
      id: makeId('staff', rng),
      type: 'staff',
      name,
      role,
      age,
      ethnicity,
      bodyType,
      archetype,
      baselineWeight,
      weight: baselineWeight + startingGain,
      appetite: Math.round((5 + rng.int(0, 3) + archetypes[archetype].appetiteMod) * 10) / 10,
      trust: Math.round((4 + rng.int(0, 3) + archetypes[archetype].trustMod) * 10) / 10,
      indulgence: rng.int(0, 4),
      openness: rng.int(12, 24),
      weeklyMomentum: 0,
      preference: rng.pick(preferences),
      preferences: defaultPreferences(),
      arc: { completedBeats: [] },
      consent: 'Enrolled in IndulgeCare staff gluttony research program, 21+. Consent covers feeding, weighing, and public display of gain.',
      lastStage: 0,
    };
  });
}

/** Procedural hire candidate or starting receptionist. */
export function generateStaffCandidate(rng, roleSlot) {
  const bodyType = rng.pick(bodyTypeKeys);
  const profile = bodyTypes[bodyType];
  const thinCeiling = profile.baseRange[0] + Math.round((profile.baseRange[1] - profile.baseRange[0]) * 0.35);
  const baselineWeight = rng.int(profile.baseRange[0], thinCeiling);
  const startingGain = rng.int(0, 3);
  const archetype = rng.pick(archetypeKeys);
  const name = `${rng.pick(patientFirstNames)} ${rng.pick(patientLastNames)}`;

  return {
    id: makeId('cand', rng),
    candidateId: true,
    type: 'staff',
    name,
    role: roleSlot.role,
    arcSlot: roleSlot.arcSlot,
    age: rng.int(24, 44),
    ethnicity: rng.pick(staffEthnicities),
    bodyType,
    archetype,
    baselineWeight,
    weight: baselineWeight + startingGain,
    appetite: Math.round((4 + rng.int(0, 2) + archetypes[archetype].appetiteMod) * 10) / 10,
    trust: Math.round((4 + rng.int(0, 2) + archetypes[archetype].trustMod) * 10) / 10,
    indulgence: rng.int(0, 2),
    openness: rng.int(8, 18),
    weeklyMomentum: 0,
    preference: rng.pick(preferences),
    preferences: defaultPreferences(),
    slimMindset: true,
    consent: 'Standard clinic employment, 21+. HR file lists primary-care duties only.',
    lastStage: 0,
  };
}

export function staffCandidateSummary(candidate) {
  return `${Math.round(candidate.weight)} lb ${bodyTypes[candidate.bodyType]?.label || candidate.bodyType}, ${candidate.ethnicity}, age ${candidate.age}`;
}

/** Week-one strip-mall clinic: receptionist only. */
export function createTinyClinicStaff(rng) {
  const receptionistSlot = {
    role: 'Front Desk Coordinator',
    arcSlot: 'elena',
  };
  const receptionist = generateStaffCandidate(rng, receptionistSlot);
  receptionist.id = makeId('staff', rng);
  delete receptionist.candidateId;
  receptionist.arc = { completedBeats: [], choices: {}, flags: [] };
  receptionist.trust = Math.round((5 + rng.int(0, 2)) * 10) / 10;
  return [receptionist];
}

export function createPatient(rng, options = {}) {
  const bodyType = options.bodyType || rng.pick(bodyTypeKeys);
  let archetype = options.archetype || rng.pick(archetypeKeys);
  const clinicalStart = options.clinicalStart !== false && (options.week == null || options.week < 6);
  if (!options.archetype && clinicalStart) {
    archetype = rng.pick(['professional', 'perfectionist', 'nurturer', 'scholar', 'athlete'].filter((k) => archetypes[k]));
  } else if (!options.archetype && options.styleBias?.length && rng.next() < 0.35) {
    archetype = rng.pick(options.styleBias);
  } else if (!options.archetype && !clinicalStart && rng.next() < 0.18) {
    archetype = rng.pick(['patron', 'vip']);
  } else if (!options.archetype && !clinicalStart && rng.next() < 0.08) {
    archetype = rng.pick(['foodBlogger', 'gymDefector']);
  } else if (!options.archetype && !clinicalStart && rng.next() < 0.06) {
    archetype = rng.pick(['housewifeDonor', 'rivalDoctor', 'foodTruckOwner', 'sleepClinicDefector']);
  }
  const profile = bodyTypes[bodyType];
  const thinCeiling = profile.baseRange[0] + Math.round((profile.baseRange[1] - profile.baseRange[0]) * 0.4);
  const baselineWeight = clinicalStart
    ? rng.int(profile.baseRange[0], thinCeiling)
    : rng.int(profile.baseRange[0], profile.baseRange[1]);

  const weight = baselineWeight + rng.int(0, clinicalStart ? 3 : 6);

  return {
    id: makeId('patient', rng),
    type: 'patient',
    name: `${rng.pick(patientFirstNames)} ${rng.pick(patientLastNames)}`,
    role: rng.pick(patientJobs),
    age: rng.int(23, 58),
    ethnicity: rng.pick([
      'Black',
      'Latina',
      'East Asian',
      'South Asian',
      'Middle Eastern',
      'White',
      'Mixed heritage',
      'Pacific Islander',
    ]),
    bodyType,
    archetype,
    baselineWeight,
    weight,
    chartedWeight: weight,
    appetite: Math.round((3 + rng.int(0, 3) + archetypes[archetype].appetiteMod) * 10) / 10,
    trust: Math.round((2 + rng.int(0, 3) + archetypes[archetype].trustMod) * 10) / 10,
    indulgence: rng.int(0, clinicalStart ? 2 : 3),
    openness: rng.int(4, clinicalStart ? 14 : 20),
    weeklyMomentum: 0,
    preference: rng.pick(preferences),
    preferences: defaultPreferences(),
    seenThisWeek: false,
    visits: 0,
    loyalty: 0,
    loyaltyArc: { completedBeats: [] },
    appearance: generatePatientAppearance(rng),
    slimMindset: clinicalStart,
    consent: 'Adult patient, 21+. Intake forms list routine primary-care services.',
    lastStage: 0,
    publicReason: null,
  };
}

export function bumpLoyalty(patient, amount = 1) {
  if (!patient || patient.type !== 'patient') return;
  patient.loyalty = Math.min(10, (patient.loyalty || 0) + amount);
}

export function loyaltyRecruitDiscount(patient) {
  const loyalty = patient.loyalty || 0;
  if (loyalty >= 8) return 200;
  if (loyalty >= 5) return 100;
  return 0;
}

export function createPatientRoster(rng, count = 4) {
  return Array.from({ length: count }, () => createPatient(rng));
}

export function isImmobileStage(stageIndex) {
  return stageIndex >= IMMOBILE_STAGE;
}

export function isBlobStage(stageIndex) {
  return stageIndex >= BLOB_STAGE;
}

export function isCharacterImmobile(character) {
  return isImmobileStage(getStageIndex(character));
}

export function isCharacterBlob(character) {
  return isBlobStage(getStageIndex(character));
}

export function weightForStageIndex(character, stageIndex) {
  const stage = Math.max(0, Math.min(STAGE_MAX, Math.floor(stageIndex)));
  if (stage === 0) return character.baselineWeight;
  if (stage === BLOB_STAGE) return STAGE_WEIGHT_CEILING;
  if (stage === IMMOBILE_STAGE) return 1100;
  if (stage === 6) return 380;
  const low = STAGE_WEIGHT_FLOORS[stage];
  const high = STAGE_WEIGHT_FLOORS[stage + 1];
  return Math.round((low + high) / 2);
}

export function getStageIndex(character) {
  const weight = character.weight;
  let stage = 0;
  for (let i = STAGE_WEIGHT_FLOORS.length - 1; i >= 0; i -= 1) {
    if (weight >= STAGE_WEIGHT_FLOORS[i]) {
      stage = i;
      break;
    }
  }
  return Math.min(STAGE_MAX, stage);
}

export function getStageInfo(character) {
  const stage = getStageIndex(character);
  const profile = bodyTypes[character.bodyType] || bodyTypes.hourglass;
  let description = profile.descriptions[stage];
  const floor = STAGE_WEIGHT_FLOORS[stage];
  const cap = stage < STAGE_MAX ? STAGE_WEIGHT_FLOORS[stage + 1] : STAGE_WEIGHT_CEILING;
  const progress =
    cap > floor ? Math.min(100, Math.round(((character.weight - floor) / (cap - floor)) * 100)) : 100;
  if (character.type === 'patient') {
    ensurePatientAppearance(character);
    const apparel = composePatientAppearance(character, stage);
    const attitude = getAttitudeKey(character);
    if (isEarlyPatientVoice(character)) {
      description = getPatientEarlyBodyLine(character.bodyType, attitude);
    } else {
      const patientBody =
        patientBodyDescriptions[character.bodyType] || patientBodyDescriptions.hourglass;
      description = patientBody[stage] || profile.descriptions[stage];
    }
    description = `${description} ${apparel.clothingLine}`;
  }
  return {
    index: stage,
    name: weightStageNames[stage],
    bodyType: profile.label,
    description,
    progress,
  };
}

export function getAttitudeKey(character) {
  const stage = getStageIndex(character);
  if (stage >= BLOB_STAGE) return 'blob';
  if (stage >= IMMOBILE_STAGE) return 'immobile';
  if (stage <= 0) return 'professional';
  if (stage <= 2) return 'noticing';
  if (stage <= 4) return 'hungry';
  if (stage <= 6) return 'pleased';
  if (stage <= 8) return 'indulgent';
  return 'devoted';
}

export function isEarlyPatientVoice(character) {
  if (character?.type !== 'patient') return false;
  const attitude = getAttitudeKey(character);
  return attitude === 'professional' || attitude === 'noticing';
}

export function getCharacterDialogue(character) {
  const attitude = getAttitudeKey(character);
  if (character.type === 'patient') {
    if (shouldUseClinicalPatientVoice(character)) {
      return getClinicalPatientLine(character);
    }
    const patientLines =
      patientArchetypeLines[character.archetype] || patientArchetypeLines.nurturer;
    return patientLines[attitude];
  }
  const staffLines = staffArchetypeLines[character.archetype] || staffArchetypeLines.nurturer;
  return staffLines[attitude];
}

export function describeCharacter(character) {
  const stage = getStageInfo(character);
  const archetype = archetypes[character.archetype] || archetypes.nurturer;

  if (character.type === 'patient') {
    ensurePatientAppearance(character);
    const apparel = composePatientAppearance(character, stage.index);
    const extras = [];
    if (apparel.beat.showHair) extras.push(`<p>${apparel.hairLine}</p>`);
    if (apparel.beat.showHeight) extras.push(`<p>${apparel.heightLine}</p>`);
    const early = isEarlyPatientVoice(character);
    const preferenceLine = early ? '' : ` Favors ${character.preference}.`;
    const bodyLine = early
      ? getPatientEarlyBodyLine(character.bodyType, getAttitudeKey(character))
      : (patientBodyDescriptions[character.bodyType] || patientBodyDescriptions.hourglass)[
          stage.index
        ] || stage.description;
    const hookLine = getPatientHook(character.archetype);
    return `
    <p><strong>${character.name}</strong>, ${character.age}, ${character.ethnicity}. ${character.role}. ${archetype.label}. ${getPatientAppearanceSummary(character)}.${preferenceLine}</p>
    <p>${bodyLine}</p>
    <p><em>Wardrobe:</em> ${apparel.clothingLine}</p>
    ${extras.join('')}
    <p>${hookLine}</p>
    <p><em>"${getCharacterDialogue(character)}"</em></p>
  `;
  }

  return `
    <p><strong>${character.name}</strong>, ${character.age}, ${character.ethnicity}. ${character.role}. ${archetype.label}. Favors ${character.preference}.</p>
    <p>${stage.description}</p>
    <p>${archetype.hook}</p>
    <p><em>"${getCharacterDialogue(character)}"</em></p>
  `;
}

export function summarizeStageChange(character, oldStage, newStage) {
  const stage = getStageInfo(character);
  const profile = bodyTypes[character.bodyType] || bodyTypes.hourglass;
  const attitude = getAttitudeKey(character);
  let base = `${character.name} reaches ${stage.name}. ${profile.descriptions[newStage]}`;
  if (character.type === 'patient') {
    ensurePatientAppearance(character);
    const apparel = composePatientAppearance(character, newStage);
    if (isEarlyPatientVoice(character)) {
      base = `${character.name} reaches ${stage.name}. ${getPatientEarlyBodyLine(character.bodyType, attitude)}`;
    } else {
      const patientBody =
        patientBodyDescriptions[character.bodyType] || patientBodyDescriptions.hourglass;
      base = `${character.name} reaches ${stage.name}. ${patientBody[newStage] || profile.descriptions[newStage]}`;
    }
    base += ` ${apparel.clothingLine}`;
  }

  if (attitude === 'professional' || attitude === 'noticing') {
    return `${base} Something shifted. She has not named it yet.`;
  }
  if (attitude === 'hungry') {
    return `${base} The body changed. So did the appetite. Both follow her down the hall.`;
  }
  if (attitude === 'pleased' || attitude === 'indulgent') {
    return `${base} Slower steps. Softer posture. A body that stopped pretending it wants less.`;
  }
  return `${base} Weight made visible. Hunger made plain. No shame left in her.`;
}

export function getGainTemperament(character) {
  const archetype = archetypes[character.archetype] || archetypes.nurturer;
  const attitude = getAttitudeKey(character);
  const appetite = character.appetite + character.indulgence / 10;
  const trust = character.trust + character.openness / 12;
  const resistance =
    attitude === 'professional'
      ? 0.72
      : attitude === 'noticing'
        ? 0.85
        : attitude === 'hungry'
          ? 1.02
          : attitude === 'pleased'
            ? 1.1
            : attitude === 'indulgent'
              ? 1.18
              : 1.25;
  return Math.max(
    0.45,
    (appetite * 0.12 + trust * 0.08) * archetype.appetiteMod * resistance * preferenceGainMod(character.preferences),
  );
}
