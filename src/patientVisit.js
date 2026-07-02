import { addWeekNote, formatMoney, rngForState, spendActionPoint } from './state.js';
import { findCharacter } from './events.js';
import {
  bumpLoyalty,
  getGainTemperament,
  getAttitudeKey,
  isCharacterImmobile,
  isCharacterBlob,
} from './characters.js';
import { advanceLoyaltyArc } from './loyaltyArcs.js';
import { bumpStyle, consultReputationBonus, styleFromInteraction } from './clinicStyle.js';
import { computeClinicEffects } from './clinic.js';
import {
  getVisitClosing,
  getVisitNarrative,
  getMissedVisitPenalty,
} from './patientVisitDialogue.js';

function tierFromAttitude(attitude) {
  if (attitude === 'immobile') return 'immobile';
  if (attitude === 'blob') return 'blob';
  if (attitude === 'professional' || attitude === 'noticing') return 'early';
  if (attitude === 'hungry' || attitude === 'pleased') return 'mid';
  return 'late';
}

export const VISIT_PHASES = ['greeting', 'intake', 'exam', 'services', 'checkout'];

const CONSULT_FEE = 225;

export const VISIT_ACTIONS = [
  {
    id: 'say_hi',
    label: 'Warm Greeting',
    description: 'Meet her at the door. Her name on your lips. Appetite in the room before the chart opens.',
    apCost: 1,
    phase: 'greeting',
    effects: { trust: 0.2, openness: 1.5, loyalty: 0 },
    once: true,
    advancesPhase: true,
  },
  {
    id: 'review_chart',
    label: 'Review Chart',
    description: 'Read gain lines aloud. She hears you celebrate every logged pound.',
    apCost: 1,
    phase: 'intake',
    effects: { trust: 0.15, openness: 1 },
    once: true,
    advancesPhase: true,
  },
  {
    id: 'offer_water',
    label: 'Offer Water and Snack Menu',
    description: 'Chilled water, printed menu. Hunger stirs before the first weigh-in.',
    apCost: 1,
    phase: 'intake',
    effects: { appetite: 0.08, indulgence: 1.5, openness: 0.5 },
    once: true,
  },
  {
    id: 'personal_talk',
    label: 'Personal Check-In',
    description: 'No charting. Ask how her appetite has been. Listen until she fills the silence with cravings.',
    apCost: 1,
    phase: 'intake',
    effects: { trust: 0.35, openness: 3, indulgence: 1.5, weeklyMomentum: 0.4 },
    once: true,
  },
  {
    id: 'note_symptoms',
    label: 'Note Gluttony Symptoms',
    description: 'Straining seams. Constant hunger. Record each sign of growing heavy without alarm.',
    apCost: 1,
    phase: 'intake',
    effects: { trust: 0.1, openness: 2, indulgence: 0.5 },
    once: true,
  },
  {
    id: 'weigh_patient',
    label: 'Weigh Patient',
    description: 'Scale under bare feet. Numbers climb. She watches your face for approval.',
    apCost: 1,
    phase: 'exam',
    effects: { trust: 0.2, openness: 1, weight: 0.15 },
    once: true,
    advancesPhase: true,
  },
  {
    id: 'estimate_weight',
    label: 'Estimate Weight',
    description: 'Couch scale, tape measure, trained eye. Log the gain without asking her to stand.',
    apCost: 1,
    phase: 'exam',
    effects: { trust: 0.2, openness: 1, weight: 0.12 },
    once: true,
    advancesPhase: true,
  },
  {
    id: 'feed_in_place',
    label: 'Feed In Place',
    description: 'Tray to the couch. Spoon in hand. Seconds arrive before she asks.',
    apCost: 1,
    phase: 'exam',
    effects: { trust: 0.3, indulgence: 6, appetite: 0.25, weightRoll: 0.75 },
    once: true,
  },
  {
    id: 'warm_blanket',
    label: 'Heated Lap Wrap',
    description: 'Heated throw across her middle. Warmth loosens her into eating. Shoulders drop. Jaw unclenches.',
    apCost: 1,
    phase: 'exam',
    effects: { trust: 0.25, indulgence: 2, openness: 1 },
    once: true,
  },
  {
    id: 'comfort_blend',
    label: 'Serve Gorging Blend',
    description: 'Vanilla powder in warm milk. Heavy gut. Heavier lids. Room for more.',
    apCost: 1,
    phase: 'exam',
    effects: { trust: 0.2, openness: 2, indulgence: 4, weightRoll: 0.45 },
    requires: { inventory: 'comfortBlend' },
    once: true,
  },
  {
    id: 'appetite_tonic',
    label: 'Dose Appetite Tonic',
    description: 'Amber vial. Hunger arrives fast, stays loud, demands feeding.',
    apCost: 1,
    phase: 'exam',
    effects: { appetite: 0.35, openness: 2, indulgence: 5, weightRoll: 0.55 },
    requires: { inventory: 'appetiteTonic' },
    once: true,
  },
  {
    id: 'lounge_snack',
    label: 'Lounge Snack Tray',
    description: 'Pastry plate within arm\'s reach. She finishes what you bring and asks what follows.',
    apCost: 1,
    phase: 'services',
    effects: { indulgence: 3.5, appetite: 0.2, weightRoll: 0.65 },
    once: true,
  },
  {
    id: 'comfort_plan',
    label: 'Gorging Meal Plan',
    description: 'Written plan: larger portions, slower chewing, growing heavy without apology.',
    apCost: 1,
    phase: 'services',
    effects: { trust: 0.25, openness: 2.5, indulgence: 3, weeklyMomentum: 0.5 },
    once: true,
  },
  {
    id: 'recovery_shake',
    label: 'Recovery Shake',
    description: 'Thick shake. Sweet. Labeled for recovery. Fills the stomach for the next course.',
    apCost: 1,
    phase: 'services',
    effects: { trust: 0.15, indulgence: 2.5, weightRoll: 0.5 },
    requires: { inventory: 'recoveryShake' },
    once: true,
  },
  {
    id: 'upsell_wellness_kit',
    label: 'Bill Gorging Kit',
    description: 'Take-home bars and cream cups. Upsell code on the invoice. More eating at home.',
    apCost: 1,
    phase: 'services',
    effects: { money: 85, indulgence: 1, trust: 0.1 },
    once: true,
  },
  {
    id: 'bill_consultation',
    label: 'Bill Gluttony Consult',
    description: 'Standard gorging consult code. Visit fee posts to the ledger.',
    apCost: 1,
    phase: 'services',
    effects: { money: CONSULT_FEE, trust: 0.15, reputation: 1 },
    requires: { actions: ['weigh_patient'] },
    once: true,
    advancesPhase: true,
  },
  {
    id: 'schedule_followup',
    label: 'Schedule Follow-Up',
    description: 'Next feeding slot on the calendar before she reaches the lobby doors.',
    apCost: 0,
    phase: 'checkout',
    effects: { trust: 0.15, loyalty: 1, openness: 1 },
    once: true,
  },
  {
    id: 'end_visit',
    label: 'End Visit',
    description: 'Walk her out, or roll the cart back. Receipt in hand. Follow-up on the calendar.',
    apCost: 0,
    phase: 'checkout',
    effects: {},
    requires: { actions: ['bill_consultation'] },
    once: true,
  },
];

function getVisit(state) {
  return state.activePatientVisit || null;
}

function getPatientForVisit(state) {
  const visit = getVisit(state);
  if (!visit) return null;
  return findCharacter(state, visit.patientId);
}

function nextPhase(phase) {
  const index = VISIT_PHASES.indexOf(phase);
  if (index < 0 || index >= VISIT_PHASES.length - 1) return phase;
  return VISIT_PHASES[index + 1];
}

function actionById(actionId) {
  return VISIT_ACTIONS.find((action) => action.id === actionId);
}

function visitCompletedActions(visit) {
  return visit?.completedActions || [];
}

function hasCompletedAction(visit, actionId) {
  return visitCompletedActions(visit).includes(actionId);
}

function meetsActionRequirements(state, visit, action) {
  const requires = action.requires;
  if (!requires) return { ok: true };

  if (requires.actions?.length) {
    if (action.id === 'bill_consultation') {
      const hasWeight =
        hasCompletedAction(visit, 'weigh_patient') || hasCompletedAction(visit, 'estimate_weight');
      if (!hasWeight) {
        return {
          ok: false,
          reason: 'Complete Weigh Patient or Estimate Weight first.',
        };
      }
    } else {
      const missing = requires.actions.filter((id) => !hasCompletedAction(visit, id));
      if (missing.length) {
        return {
          ok: false,
          reason: `Complete ${missing.map((id) => actionById(id)?.label || id).join(', ')} first.`,
        };
      }
    }
  }

  if (requires.inventory) {
    if ((state.inventory[requires.inventory] || 0) <= 0) {
      return { ok: false, reason: 'Out of stock' };
    }
  }

  return { ok: true };
}

function visitWeightBump(state, patient, scale = 0.4) {
  const rng = rngForState(state);
  const effects = computeClinicEffects(state);
  const base = 0.62;
  const environmental = effects.patientGain || 0;
  const momentum = patient.weeklyMomentum + (effects.patientMomentum || 0);
  const temperament = getGainTemperament(patient);
  const trustLift = Math.min(1.1, patient.trust / 18);
  const roll = rng.next() * 0.9;
  const raw =
    (base + environmental * 3 + momentum * 0.5 + roll + trustLift) *
    temperament *
    (effects.gainMultiplier || 1) *
    scale;
  return Math.max(0.15, Math.round(raw * 10) / 10);
}

function applyVisitEffects(state, patient, action) {
  const effects = action.effects || {};

  if (effects.money) {
    state.money += effects.money;
    if (action.id === 'bill_consultation' || action.id === 'upsell_wellness_kit') {
      state.weekConsultIncome = (state.weekConsultIncome || 0) + effects.money;
    }
  }

  if (effects.reputation) {
    const bonus = action.id === 'bill_consultation' ? consultReputationBonus(state) : 0;
    state.reputation += effects.reputation + bonus;
  }

  if (effects.weight) {
    patient.weight = Math.round((patient.weight + effects.weight) * 10) / 10;
  }

  if (effects.weightRoll) {
    const gain = visitWeightBump(state, patient, effects.weightRoll);
    patient.weight = Math.round((patient.weight + gain) * 10) / 10;
    patient.indulgence = Math.min(100, patient.indulgence + gain * 0.5);
  }

  if (effects.trust) patient.trust = Math.round((patient.trust + effects.trust) * 100) / 100;
  if (effects.openness) patient.openness = Math.min(100, patient.openness + effects.openness);
  if (effects.indulgence) patient.indulgence = Math.min(100, patient.indulgence + effects.indulgence);
  if (effects.appetite) patient.appetite = Math.round((patient.appetite + effects.appetite) * 100) / 100;
  if (effects.weeklyMomentum) patient.weeklyMomentum += effects.weeklyMomentum;

  if (effects.loyalty) bumpLoyalty(patient, effects.loyalty);
}

function consumeInventory(state, action) {
  const key = action.requires?.inventory;
  if (!key) return;
  state.inventory[key] -= 1;
  if (state.stats) state.stats.compoundsUsed = (state.stats.compoundsUsed || 0) + 1;
}

function visitDialogue(patient, actionId) {
  const tier = tierFromAttitude(getAttitudeKey(patient));
  const resolvedId = actionId === 'upsell_wellness_kit' ? 'upsell_package' : actionId;
  return getVisitNarrative(resolvedId, patient, tier);
}

function visitSummaryFromActions(visit) {
  const done = visit.completedActions || [];
  return {
    compoundsUsed: ['comfort_blend', 'appetite_tonic', 'recovery_shake'].filter((id) => done.includes(id))
      .length,
    premiumSold: done.includes('upsell_wellness_kit'),
    followupSkipped: !done.includes('schedule_followup'),
  };
}

export function startVisit(state, patientId) {
  const patient = findCharacter(state, patientId);
  if (!patient || patient.type !== 'patient') {
    return { ok: false, message: 'Patient not found.' };
  }
  if (patient.seenThisWeek) {
    return { ok: false, message: 'Already seen this week.' };
  }
  if (getVisit(state)) {
    return { ok: false, message: 'Another visit is already in progress.' };
  }

  state.activePatientVisit = {
    patientId,
    phase: 'greeting',
    completedActions: [],
    visitLog: [],
    startedWeek: state.week,
  };

  return { ok: true, message: `Visit started for ${patient.name}.` };
}

export function getVisitActions(state) {
  const visit = getVisit(state);
  if (!visit) return [];

  const patient = getPatientForVisit(state);
  if (!patient) return [];

  const mobilityRestricted = isCharacterImmobile(patient) || isCharacterBlob(patient);

  return VISIT_ACTIONS.filter((action) => {
    if (action.id === 'weigh_patient' && mobilityRestricted) return false;
    if (action.id === 'estimate_weight' && !mobilityRestricted) return false;
    return true;
  }).map((action) => {
    const wrongPhase = VISIT_PHASES.indexOf(action.phase) > VISIT_PHASES.indexOf(visit.phase);
    const alreadyDone = action.once && hasCompletedAction(visit, action.id);
    const requirement = meetsActionRequirements(state, visit, action);
    const needsAp = action.apCost > 0 && state.actionPoints < action.apCost;

    let disabled = wrongPhase || alreadyDone || !requirement.ok || needsAp;
    let reason = '';

    if (wrongPhase) reason = `Available in ${action.phase}`;
    else if (alreadyDone) reason = 'Already done this visit';
    else if (!requirement.ok) reason = requirement.reason;
    else if (needsAp) reason = 'No AP remaining';

    return {
      ...action,
      disabled,
      reason,
    };
  });
}

export function performVisitAction(state, actionId) {
  const visit = getVisit(state);
  if (!visit) return { ok: false, message: 'No active visit.' };

  const patient = getPatientForVisit(state);
  if (!patient) return { ok: false, message: 'Patient not found.' };

  const action = actionById(actionId);
  if (!action) return { ok: false, message: 'Unknown visit action.' };

  const option = getVisitActions(state).find((item) => item.id === actionId);
  if (!option || option.disabled) {
    return { ok: false, message: option?.reason || 'That action is unavailable.' };
  }

  if (action.apCost > 0 && !spendActionPoint(state)) {
    return { ok: false, message: 'No action points remain.' };
  }

  consumeInventory(state, action);
  applyVisitEffects(state, patient, action);
  visit.completedActions.push(action.id);

  if (action.advancesPhase) {
    visit.phase = nextPhase(visit.phase);
  }

  let { narrative, reply } = visitDialogue(patient, actionId);
  if (!narrative) {
    narrative = `${action.label} with ${patient.name}.`;
  }
  let message = narrative;
  if (reply) message = `${narrative} "${reply}"`;

  if (action.effects?.money) {
    message = `${message} Billed ${formatMoney(action.effects.money)}.`;
  }

  if (!visit.visitLog) visit.visitLog = [];
  visit.visitLog.push({ label: action.label, narrative, reply });

  if (action.id === 'bill_consultation') {
    bumpStyle(state, styleFromInteraction('consult'));
  }

  addWeekNote(
    {
      type: 'visit',
      title: `${action.label}: ${patient.name}`,
      text: message,
    },
    state,
  );

  return { ok: true, message, phase: visit.phase };
}

export function canEndVisit(state) {
  const visit = getVisit(state);
  if (!visit || visit.phase !== 'checkout') return false;
  return hasCompletedAction(visit, 'bill_consultation') && hasCompletedAction(visit, 'end_visit');
}

export function completeVisit(state) {
  if (!canEndVisit(state)) {
    return { ok: false, message: 'Bill the consult and end the visit before checkout.' };
  }

  const visit = getVisit(state);
  const patient = getPatientForVisit(state);
  if (!patient) return { ok: false, message: 'Patient not found.' };

  patient.visits = (patient.visits || 0) + 1;
  patient.seenThisWeek = true;
  patient.trust = Math.round((patient.trust + 0.35) * 100) / 100;
  patient.openness = Math.min(100, patient.openness + 1.5);
  patient.weeklyMomentum += 0.45;
  bumpLoyalty(patient, 1);

  if (state.challengeWeek === 'quiet') bumpLoyalty(patient, 1);

  const loyaltyResult = advanceLoyaltyArc(patient, state);
  if (loyaltyResult.ok) {
    addWeekNote(
      {
        type: 'loyalty',
        title: `Loyalty: ${patient.name}`,
        text: loyaltyResult.text,
      },
      state,
    );
  }

  const summary = getVisitClosing(patient, visitSummaryFromActions(visit));
  addWeekNote(
    {
      type: 'visit',
      title: `Visit complete: ${patient.name}`,
      text: `${summary} Visit ${patient.visits} on the books.`,
    },
    state,
  );

  if (state.stats) state.stats.visitCount = (state.stats.visitCount || 0) + 1;

  state.activePatientVisit = null;
  return { ok: true, message: `${summary} Visit ${patient.visits} on the books.` };
}

export function getUnvisitedPatients(state) {
  return state.patients.filter((patient) => !patient.seenThisWeek);
}

export function allPatientsSeen(state) {
  if (!state.patients.length) return true;
  return state.patients.every((patient) => patient.seenThisWeek);
}

export function visitWeekPenalty(state) {
  const unvisited = getUnvisitedPatients(state);
  if (!unvisited.length) {
    return {
      unvisited: 0,
      reputation: 0,
      trustLossPerPatient: 0,
      message: null,
    };
  }

  const reputation = unvisited.length * 2;
  const trustLossPerPatient = 0.2;
  const names = unvisited.map((patient) => patient.name).join(', ');
  const penaltyLine = unvisited.length ? getMissedVisitPenalty(unvisited[0]) : '';

  return {
    unvisited: unvisited.length,
    reputation,
    trustLossPerPatient,
    message: `${unvisited.length} patient${unvisited.length === 1 ? '' : 's'} missed this week (${names}). Reputation -${reputation}. ${penaltyLine}`,
  };
}
