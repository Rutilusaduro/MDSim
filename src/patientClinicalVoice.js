import { getPatientFramingTier } from './patientFraming.js';

/** Profile quotes for patients still in normal PCP framing. */
const CLINICAL_LINES = {
  nurturer:
    'I put off my own checkup for months. My neighbor said you listen. I brought a list of questions.',
  perfectionist:
    'I printed my medication list and last lab results. I prefer visits that stay organized.',
  socialite:
    'My friend comes here for blood pressure follow-ups. I need a refill and a straight answer about fatigue.',
  rebel:
    'My last clinic rushed me out in ten minutes. I am giving this one a fair try.',
  scholar:
    'I read your intake forms online. I have questions about the thyroid panel before we start.',
  dreamer:
    'I have been tired lately. I thought a real visit might help more than another blog post.',
  athlete:
    'I tweaked my knee on a run. I also want to talk about why I am always hungry lately.',
  hedonist:
    'I need a sick note and a blood draw. I will try to behave in the waiting room.',
  patron:
    'My family physician retired. I need someone who will actually look at the chart.',
  vip:
    'I booked the first open slot. I expect the usual: vitals, labs, a plan I can follow.',
  rivalSpy:
    'Routine wellness exam. I have my insurance card and my patience.',
  foodBlogger:
    'I am here for a thyroid check. The food content can wait until after the draw.',
  gymDefector:
    'I want a physical. My trainer keeps telling me to see a real doctor.',
  housewifeDonor:
    'Annual exam. My husband thinks I skip these. I do not.',
  rivalDoctor:
    'Second opinion on a medication change. I am here as a patient today, not a critic.',
  foodTruckOwner:
    'Blood pressure follow-up. Long shifts, bad hours. I need practical advice.',
  sleepClinicDefector:
    'Insomnia for six weeks. I would like something that helps me sleep and eat normally again.',
};

const CLINICAL_PLUS_LINES = {
  nurturer:
    'I have been snacking more since my last visit. I am not sure if it is stress or the new schedule.',
  perfectionist:
    'My home scale ticked up two pounds. Probably noise, but I wanted it on the record.',
  socialite:
    'People keep asking if I changed something. I think my face looks softer. Is that the medication?',
  rebel:
    'My jeans are tighter. I am not thrilled about it. I am also not skipping lunch anymore.',
  scholar:
    'Appetite has trended up since the mirtazapine trial. I am tracking portions at home.',
  dreamer:
    'I sleep better, but I wake up hungry. I wanted to ask if that is expected.',
  athlete:
    'Recovery appetite is real. I am eating more than my meal plan allows.',
  hedonist:
    'I said I would cut back. The break room muffins did not get the memo.',
  patron:
    'My rings are snug. Small thing. I mention it because you asked me to track symptoms.',
  vip:
    'The nurse commented on my weight trend. I would like your read before I panic.',
  rivalSpy:
    'Follow-up labs and a honest conversation about appetite. That is all I need today.',
  foodBlogger:
    'Camera off today. I want numbers, not content.',
  gymDefector:
    'I stopped counting macros. I am here because my leggings do not lie.',
  housewifeDonor:
    'I have been picking at food all afternoon. New for me. I thought you should know.',
  rivalDoctor:
    'I am documenting side effects like a clinician. Increased appetite is on the list.',
  foodTruckOwner:
    'Tasting for work again. My belt notch moved. Practical question: what do I do about it?',
  sleepClinicDefector:
    'I sleep now. I also raid the kitchen at midnight. Trade-off I did not plan for.',
};

export function getClinicalPatientLine(character) {
  const framing = getPatientFramingTier(character);
  const table = framing === 'clinical_plus' ? CLINICAL_PLUS_LINES : CLINICAL_LINES;
  return table[character.archetype] || table.nurturer;
}

export function shouldUseClinicalPatientVoice(character) {
  if (character?.type !== 'patient') return false;
  const framing = getPatientFramingTier(character);
  return framing === 'clinical' || framing === 'clinical_plus';
}
