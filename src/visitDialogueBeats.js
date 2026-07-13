/**
 * Visit dialogue beats: doctor speaks, patient responds logically.
 * Used for clinical / warming tiers before legacy pools.
 */

import { pickSeen } from './proseSelect.js';

function pickBeat(state, character, poolId, pool) {
  return pickSeen(state, character?.id || 'world', poolId, pool) || null;
}

const CLINICAL_BEATS = {
  say_hi: [
    {
      doctor: 'You greet her by name and ask what brought her in today.',
      patient: 'Annual follow-up. I have my insurance card and the lab paperwork from last month.',
    },
    {
      doctor: 'You introduce yourself and confirm her date of birth on the chart.',
      patient: 'That is right. I am here for a blood pressure check and a refill if we are due.',
    },
    {
      doctor: 'You shake her hand and ask how she has been since her last visit.',
      patient: 'Busy week at work, but nothing alarming. I figured I should keep the appointment.',
    },
    {
      doctor: 'You welcome her to the exam room and ask whether she found the suite easily.',
      patient: 'No trouble. Parking was fine. I am ready whenever you are.',
    },
  ],
  review_chart: [
    {
      doctor: 'You open her chart and walk through medications, allergies, and her last visit note.',
      patient: 'Lisinopril still works. No new allergies. I think the thyroid dose is the same.',
    },
    {
      doctor: 'You scroll the problem list and ask if anything on file needs updating.',
      patient: 'Seasonal allergies are back. Otherwise the list still looks right to me.',
    },
    {
      doctor: 'You review prior vitals with her and ask whether any numbers worried her at home.',
      patient: 'I bought a cuff after last time. Readings have been steady. I logged a few in the portal.',
    },
    {
      doctor: 'You confirm pharmacy, emergency contact, and the reason for today\'s visit on the chart.',
      patient: 'Pharmacy is still CVS on Maple. Today is mostly the routine check and lab follow-up.',
    },
  ],
  offer_water: [
    {
      doctor: 'You offer water before vitals and ask if she needs a moment to sit.',
      patient: 'Yes, please. I rushed from work. A minute would help.',
    },
    {
      doctor: 'You pour room-temperature water and tell her vitals come next.',
      patient: 'That is fine. I had coffee earlier, so I am not dehydrated.',
    },
    {
      doctor: 'You set a cup on the side table and ask if she wants ice.',
      patient: 'No ice, thanks. Plain is better before the blood pressure cuff.',
    },
  ],
  personal_talk: [
    {
      doctor: 'You ask about family history — hypertension, diabetes, anything that runs in her line.',
      patient:
        'My mom has high blood pressure. I watch mine because of her. She jokes I inherited the worry gene, and she is probably right.',
    },
    {
      doctor: 'You ask how stress and sleep have been since her last visit.',
      patient:
        'Work picked up. I am sleeping, but later than I should. I notice it more in the afternoon than the morning.',
    },
    {
      doctor: 'You ask about her home routine — meals, exercise, what a normal week looks like.',
      patient:
        'I cook when I can. Walks when the weather cooperates. Weekends are looser than weekdays.',
    },
    {
      doctor: 'You ask whether anything has been weighing on her outside of the physical complaints.',
      patient:
        'My father had a heart scare last year. He is fine now, but it made me pay closer attention to my own numbers.',
    },
  ],
  review_symptoms: [
    {
      doctor: 'You run through review of systems — fatigue, appetite, weight change, sleep, mood.',
      patient:
        'A little more tired than usual. Appetite is fine. Weight might be up slightly. Sleep is hit or miss.',
    },
    {
      doctor: 'You ask about chest pain, shortness of breath, swelling, and bowel habits.',
      patient: 'None of that. Breathing is normal. No swelling I have noticed.',
    },
    {
      doctor: 'You ask whether she has had headaches, dizziness, or changes in thirst or urination.',
      patient: 'Occasional tension headaches. No dizziness. Bathroom habits are normal.',
    },
  ],
  order_labs: [
    {
      doctor: 'You order a routine panel — CMP, lipids, A1c, TSH — and explain fasting if needed.',
      patient: 'I can fast tomorrow morning. Should I keep taking my regular medications tonight?',
    },
    {
      doctor: 'You send the lab requisition and tell her where to go for the draw.',
      patient: 'In-house is fine. I will come back before lunch if that works.',
    },
    {
      doctor: 'You add thyroid and metabolic screens and ask if she has had labs recently elsewhere.',
      patient: 'Not since last year. I can bring those records if you want them scanned in.',
    },
  ],
  weigh_patient: [
    {
      doctor: 'You ask her to step on the scale in flat shoes and hold still for the reading.',
      patient: 'Shoes on or off? Either way is fine with me.',
    },
    {
      doctor: 'You note height and weight for the chart and tell her the number when it settles.',
      patient: 'Higher than last year. Not surprised. I have felt it in my clothes.',
    },
    {
      doctor: 'You record vitals and read the weight aloud for her confirmation.',
      patient: 'Go ahead and log it. I would rather know than guess.',
    },
  ],
  estimate_weight: [
    {
      doctor:
        'She cannot stand on the platform today. You measure across the chair arms and consult the reinforced pad for an estimate.',
      patient: 'Whatever you need for the chart. Just tell me when you have a number.',
    },
    {
      doctor: 'You take tape and caliper readings, then cross-check against the couch scale reading.',
      patient: 'I figured it crept up. I am not shocked if the estimate is higher than last visit.',
    },
    {
      doctor: 'You log an estimated weight from the seated measurement and read it back for her chart.',
      patient: 'Write it down. I would rather track it than pretend it stayed the same.',
    },
  ],
  prescribe_mirtazapine: [
    {
      doctor:
        'You discuss mirtazapine for insomnia and poor appetite — fifteen milligrams at bedtime, side effects included.',
      patient:
        'I have heard it can help sleep. I am willing to try if you think it fits.',
    },
    {
      doctor: 'You explain the indication, dosing, and that you will follow up in a few weeks.',
      patient: 'I will take it at night like you said. I will call if the grogginess is too much.',
    },
  ],
  nutrition_counseling: [
    {
      doctor:
        'You counsel on calorie-dense options — nut butters, whole milk, avocado, smaller frequent meals.',
      patient: 'That sounds manageable. I can add those without changing everything at once.',
    },
    {
      doctor: 'You review portion sizes and ask what meals are easiest for her to adjust first.',
      patient: 'Breakfast is the easiest place to start. I can add peanut butter and whole milk there.',
    },
  ],
  bill_consultation: [
    {
      doctor: 'You summarize the visit, document the exam, and post the office-visit charge.',
      patient: 'Thank you. Will the summary show up in the portal?',
    },
    {
      doctor: 'You bill the consult and hand her the checkout paperwork.',
      patient: 'I will pay at the desk. Do I need to schedule the lab draw today?',
    },
  ],
  schedule_followup: [
    {
      doctor: 'You recommend a follow-up interval and ask what days work best for her.',
      patient: 'Thursday afternoons are best. I can do two weeks out if you have it.',
    },
    {
      doctor: 'You book the return visit before she leaves and confirm the time by text.',
      patient: 'Text is perfect. I will put it on my calendar now.',
    },
  ],
  end_visit: [
    {
      doctor: 'You walk her to checkout, remind her of the follow-up plan, and wish her well.',
      patient: 'Thank you, doctor. I will see you at the next visit.',
    },
  ],
};

const WARMING_BEATS = {
  personal_talk: [
    {
      doctor: 'You ask how her appetite has been lately — any change she has noticed herself.',
      patient:
        'It picked up after my last visit here. I eat more now, and I stopped fighting it as hard. I was not sure if that was a problem.',
    },
    {
      doctor: 'You ask whether the snack tray in the lobby is new to her or something she has started expecting.',
      patient:
        'I noticed it last visit. I told myself one pastry would not matter. Then I came back hungry for another.',
    },
    {
      doctor: 'You ask what feels different about eating since she started coming here regularly.',
      patient:
        'Portions feel smaller at home now. Here they do not. I leave fuller than I used to, and I think about the next visit sooner.',
    },
  ],
  review_symptoms: [
    {
      doctor: 'You run through review of systems and ask whether appetite or weight have shifted since last time.',
      patient:
        'Appetite is up. Weight too, I think. I am not alarmed yet, but I notice my clothes fitting tighter.',
    },
    {
      doctor: 'You ask about fatigue, cravings, and whether she has been eating more between meals.',
      patient:
        'Cravings hit in the afternoon now. I snack more. Sleep is fine, but I wake up thinking about breakfast.',
    },
  ],
  offer_water: [
    {
      doctor: 'You offer water before vitals and mention the lounge has denser options if she wants them after.',
      patient: 'Water first, please. Then maybe whatever is warm in the cabinet. I came a little hungry.',
    },
  ],
  offer_snack_menu: [
    {
      doctor: 'You mention the lounge menu and ask if she wants anything while she waits.',
      patient: 'If it is not trouble, something savory would be great. I skipped breakfast.',
    },
  ],
};

export function getVisitBeat(state, actionId, patient, resolvedTier) {
  if (resolvedTier === 'clinical' || resolvedTier === 'clinical_plus') {
    const beat = pickBeat(state, patient, `beat.${actionId}.clinical`, CLINICAL_BEATS[actionId]);
    if (beat) return { narrative: beat.doctor, reply: beat.patient };
  }
  if (resolvedTier === 'warming') {
    const beat = pickBeat(state, patient, `beat.${actionId}.warming`, WARMING_BEATS[actionId]);
    if (beat) return { narrative: beat.doctor, reply: beat.patient };
  }
  return null;
}
