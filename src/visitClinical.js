import { getPatientFramingTier } from './patientFraming.js';

export const VISIT_FRAMING_TIERS = ['clinical', 'clinical_plus', 'warming', 'complicit'];

const FRAMING_RANK = {
  clinical: 0,
  clinical_plus: 1,
  warming: 2,
  complicit: 3,
};

/** Hidden until patient reaches warming framing or higher. */
const WARMING_GATED_ACTIONS = new Set([
  'feed_in_place',
  'comfort_plan',
  'lounge_snack',
  'warm_blanket',
  'comfort_blend',
  'appetite_tonic',
  'recovery_shake',
  'upsell_wellness_kit',
  'offer_snack_menu',
]);

/**
 * Label/description overrides keyed by framing tier.
 * Base VISIT_ACTIONS carry clinical defaults; warming masks fattening; complicit exposes it.
 */
const ACTION_FRAMING_COPY = {
  say_hi: {
    warming: {
      label: 'Warm Greeting',
      description:
        'Meet her at the door. Her name on your lips. Appetite in the room before the chart opens.',
    },
  },
  review_chart: {
    warming: {
      label: 'Review Gain Chart',
      description: 'Read gain lines aloud. She hears you celebrate every logged pound.',
    },
    complicit: {
      label: 'Review Gain Chart',
      description: 'Read gain lines aloud. She hears you celebrate every logged pound.',
    },
  },
  offer_water: {
    warming: {
      label: 'Offer Water and Snack Menu',
      description: 'Chilled water, printed menu. Hunger stirs before the first weigh-in.',
    },
    complicit: {
      label: 'Offer Water and Snack Menu',
      description: 'Chilled water, printed menu. Hunger stirs before the first weigh-in.',
    },
  },
  personal_talk: {
    warming: {
      label: 'Personal Check-In',
      description:
        'No charting. Ask how her appetite has been. Listen until she fills the silence with cravings.',
    },
    complicit: {
      label: 'Personal Check-In',
      description:
        'No charting. Ask how her appetite has been. Listen until she fills the silence with cravings.',
    },
  },
  review_symptoms: {
    warming: {
      label: 'Note Appetite Symptoms',
      description: 'Straining seams. Constant hunger. Record each sign of growing heavy without alarm.',
    },
    complicit: {
      label: 'Note Gluttony Symptoms',
      description: 'Straining seams. Constant hunger. Record each sign of growing heavy without alarm.',
    },
  },
  nutrition_counseling: {
    warming: {
      label: 'Enhanced Nutrition Plan',
      description: 'Larger portions, calorie-dense meals, follow-up in two weeks. Discharge paperwork.',
    },
  },
  feed_in_place: {
    warming: {
      label: 'In-Room Nutrition Support',
      description: 'Tray to the couch. Comfort feeding logged as nutritional intervention.',
    },
    complicit: {
      label: 'Feed In Place',
      description: 'Tray to the couch. Spoon in hand. Seconds arrive before she asks.',
    },
  },
  warm_blanket: {
    warming: {
      label: 'Thermal Comfort Wrap',
      description:
        'Heated throw across her middle. Warmth loosens her into eating. Shoulders drop. Jaw unclenches.',
    },
    complicit: {
      label: 'Heated Lap Wrap',
      description:
        'Heated throw across her middle. Warmth loosens her into eating. Shoulders drop. Jaw unclenches.',
    },
  },
  comfort_blend: {
    warming: {
      label: 'Serve Comfort Blend',
      description: 'Vanilla powder in warm milk. Heavy gut. Heavier lids. Room for more.',
    },
    complicit: {
      label: 'Serve Gorging Blend',
      description: 'Vanilla powder in warm milk. Heavy gut. Heavier lids. Room for more.',
    },
  },
  appetite_tonic: {
    warming: {
      label: 'Appetite Stimulation Trial',
      description: 'Amber vial. Hunger arrives fast, stays loud, demands feeding.',
    },
    complicit: {
      label: 'Dose Appetite Tonic',
      description: 'Amber vial. Hunger arrives fast, stays loud, demands feeding.',
    },
  },
  lounge_snack: {
    warming: {
      label: 'Lounge Snack Tray',
      description: 'Pastry plate within arm\'s reach. She finishes what you bring and asks what follows.',
    },
    complicit: {
      label: 'Lounge Snack Tray',
      description: 'Pastry plate within arm\'s reach. She finishes what you bring and asks what follows.',
    },
  },
  comfort_plan: {
    warming: {
      label: 'Enhanced Meal Plan',
      description: 'Written plan: larger portions, calorie-dense meals, follow-up in two weeks.',
    },
    complicit: {
      label: 'Gorging Meal Plan',
      description: 'Written plan: larger portions, slower chewing, growing heavy without apology.',
    },
  },
  recovery_shake: {
    warming: {
      label: 'Recovery Shake',
      description: 'Thick shake. Sweet. Labeled for recovery. Fills the stomach for the next course.',
    },
    complicit: {
      label: 'Recovery Shake',
      description: 'Thick shake. Sweet. Labeled for recovery. Fills the stomach for the next course.',
    },
  },
  upsell_wellness_kit: {
    warming: {
      label: 'Bill Wellness Kit',
      description: 'Take-home bars and cream cups. Upsell code on the invoice. More eating at home.',
    },
    complicit: {
      label: 'Bill Gorging Kit',
      description: 'Take-home bars and cream cups. Upsell code on the invoice. More eating at home.',
    },
  },
  bill_consultation: {
    warming: {
      label: 'Bill Feeding Consult',
      description: 'Extended consult code. Visit fee posts to the ledger.',
    },
    complicit: {
      label: 'Bill Gluttony Consult',
      description: 'Standard gorging consult code. Visit fee posts to the ledger.',
    },
  },
};

export function getPatientVisitFraming(patient) {
  return getPatientFramingTier(patient);
}

export function isClinicalVisit(patient) {
  const tier = getPatientVisitFraming(patient);
  return tier === 'clinical' || tier === 'clinical_plus';
}

function framingRank(tier) {
  return FRAMING_RANK[tier] ?? 0;
}

/**
 * Gate and optionally relabel a visit action for the patient's framing tier.
 * @returns {{ visible: boolean, label?: string, description?: string, disabledReason?: string }}
 */
export function getVisitActionGate(actionId, patient) {
  const framing = getPatientVisitFraming(patient);

  if (WARMING_GATED_ACTIONS.has(actionId) && framingRank(framing) < framingRank('warming')) {
    return { visible: false };
  }

  const copyTable = ACTION_FRAMING_COPY[actionId];
  if (!copyTable) {
    return { visible: true };
  }

  const tierCopy =
    copyTable[framing] ||
    (framing === 'clinical_plus' ? copyTable.clinical : null) ||
    (framingRank(framing) >= framingRank('warming') ? copyTable.warming : null);

  if (!tierCopy) {
    return { visible: true };
  }

  return {
    visible: true,
    label: tierCopy.label,
    description: tierCopy.description,
  };
}
