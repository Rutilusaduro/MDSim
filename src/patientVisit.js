import { addWeekNote, formatMoney, rngForState, spendActionPoint } from './state.js';
import { findCharacter } from './roster.js';
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
  getWeighRitualReaction,
} from './patientVisitDialogue.js';
import {
  actionSupportsTone,
  applyToneEffects,
  buildToneNarrative,
  isToneLocked,
} from './visitTones.js';
import { applySceneChoice, buildSceneContext, resolveScene } from './sceneEngine/index.js';
import { checkVisitInterrupt } from './sceneEngine/triggers.js';
import { checkAuditGameOver } from './gameOver.js';
import { getVisitActionGate, getFramingChipLabel } from './visitClinical.js';
import { applyCharacterEffects } from './mechanics/applyEffects.js';
import { tierFromAttitude } from './mechanics/attitudeTier.js';
import { recordLedger } from './memoryLedger.js';
import { chartGap, getPatientFramingTier } from './patientFraming.js';

export { getPatientVisitFraming, isClinicalVisit, getVisitActionGate, getFramingChipLabel } from './visitClinical.js';

export const VISIT_PHASES = ['greeting', 'intake', 'exam', 'services', 'checkout'];
export const TONE_ENABLED_ACTIONS = ['say_hi', 'offer_water', 'weigh_patient'];

const CONSULT_FEE = 225;

const CLINICAL_CLUSTER = new Set([
  'review_symptoms',
  'order_labs',
  'prescribe_mirtazapine',
  'nutrition_counseling',
]);
const INDULGENT_CLUSTER = new Set([
  'feed_in_place',
  'lounge_snack',
  'comfort_blend',
  'appetite_tonic',
  'warm_blanket',
  'recovery_shake',
  'offer_snack_menu',
]);

const FABRICATION_EXCUSES = [
  'fluid retention',
  'dryer shrinkage note',
  'scale recalibration',
  'muscle mass',
];

export const VISIT_ACTIONS = [
  {
    id: 'say_hi',
    label: 'Greet Patient',
    description: 'Meet her at the door. Insurance card, appointment time, normal Tuesday energy.',
    apCost: 1,
    phase: 'greeting',
    effects: { trust: 0.2, openness: 0.5, loyalty: 0 },
    once: true,
    advancesPhase: true,
  },
  {
    id: 'review_chart',
    label: 'Review Chart',
    description: 'Open her record. Prior vitals, medications, and the reason for today\'s visit.',
    apCost: 1,
    phase: 'intake',
    effects: { trust: 0.15, openness: 0.5 },
    once: true,
    advancesPhase: true,
  },
  {
    id: 'offer_water',
    label: 'Offer Water',
    description: 'Paper cup from the cooler. Standard hydration before vitals.',
    apCost: 1,
    phase: 'intake',
    effects: { trust: 0.05, openness: 0.3 },
    once: true,
  },
  {
    id: 'offer_snack_menu',
    label: 'Offer Snack Menu',
    description: 'Printed lounge menu. Pastries and dense options within arm\'s reach.',
    apCost: 1,
    phase: 'intake',
    cluster: 'indulgent',
    effects: { appetite: 0.12, indulgence: 1.5, openness: 0.8 },
    once: true,
  },
  {
    id: 'personal_talk',
    label: 'Social History',
    description: 'Ask about sleep, stress, and eating patterns. Listen without charting every answer yet.',
    apCost: 1,
    phase: 'intake',
    effects: { trust: 0.25, openness: 1.5, weeklyMomentum: 0.15 },
    once: true,
  },
  {
    id: 'review_symptoms',
    label: 'Review of Systems',
    description: 'Run through ROS: fatigue, appetite changes, weight trend, sleep quality.',
    apCost: 1,
    phase: 'intake',
    cluster: 'clinical',
    effects: { trust: 0.1, openness: 1, appetite: 0.03 },
    once: true,
  },
  {
    id: 'order_labs',
    label: 'Order Labs',
    description: 'CMP, lipids, A1c, TSH. Routine panel before adjusting any appetite protocol.',
    apCost: 1,
    phase: 'intake',
    cluster: 'clinical',
    effects: { trust: 0.1, weight: 0.05 },
    once: true,
  },
  {
    id: 'weigh_patient',
    label: 'Record Vitals & Weight',
    description: 'Blood pressure, pulse, height. Scale under flat shoes. Numbers logged to the chart.',
    apCost: 1,
    phase: 'exam',
    effects: { trust: 0.2, openness: 0.5, weight: 0.1 },
    once: true,
    advancesPhase: true,
  },
  {
    id: 'estimate_weight',
    label: 'Estimate Weight',
    description: 'Couch scale, tape measure, trained eye. Estimate logged when standing is not safe.',
    apCost: 1,
    phase: 'exam',
    effects: { trust: 0.2, openness: 0.5, weight: 0.1 },
    once: true,
    advancesPhase: true,
  },
  {
    id: 'prescribe_mirtazapine',
    label: 'Prescribe Mirtazapine',
    description: '15mg at bedtime for insomnia and poor appetite. Document indication on the chart.',
    apCost: 1,
    phase: 'exam',
    cluster: 'clinical',
    effects: { trust: 0.15, appetite: 0.12, openness: 0.5 },
    once: true,
  },
  {
    id: 'feed_in_place',
    label: 'In-Room Nutrition Support',
    description: 'Tray to the couch. Comfort feeding logged as nutritional intervention.',
    apCost: 1,
    phase: 'exam',
    cluster: 'indulgent',
    effects: { trust: 0.3, indulgence: 6, appetite: 0.25, weightRoll: 0.75 },
    once: true,
  },
  {
    id: 'warm_blanket',
    label: 'Thermal Comfort Wrap',
    description: 'Heated throw across her lap. Warmth and comfort before the next intervention.',
    apCost: 1,
    phase: 'exam',
    cluster: 'indulgent',
    effects: { trust: 0.25, indulgence: 2, openness: 1 },
    once: true,
  },
  {
    id: 'comfort_blend',
    label: 'Serve Comfort Blend',
    description: 'Vanilla nutritional powder in warm milk. Caloric supplement per protocol.',
    apCost: 1,
    phase: 'exam',
    cluster: 'indulgent',
    effects: { trust: 0.2, openness: 2, indulgence: 4, weightRoll: 0.45 },
    requires: { inventory: 'comfortBlend' },
    once: true,
  },
  {
    id: 'appetite_tonic',
    label: 'Appetite Stimulation Trial',
    description: 'Amber vial from the formulary. Logged as appetite-stimulation study dose.',
    apCost: 1,
    phase: 'exam',
    cluster: 'indulgent',
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
    cluster: 'indulgent',
    effects: { indulgence: 3.5, appetite: 0.2, weightRoll: 0.65 },
    once: true,
  },
  {
    id: 'nutrition_counseling',
    label: 'Nutrition Counseling',
    description: 'Counsel on calorie-dense options: nut butters, whole milk, avocado, frequent small meals.',
    apCost: 1,
    phase: 'services',
    cluster: 'clinical',
    effects: { trust: 0.2, appetite: 0.1, openness: 1, indulgence: 0.5, weeklyMomentum: 0.2 },
    once: true,
  },
  {
    id: 'comfort_plan',
    label: 'Enhanced Meal Plan',
    description: 'Written plan: larger portions, calorie-dense meals, follow-up in two weeks.',
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
    cluster: 'indulgent',
    effects: { trust: 0.15, indulgence: 2.5, weightRoll: 0.5 },
    requires: { inventory: 'recoveryShake' },
    once: true,
  },
  {
    id: 'upsell_wellness_kit',
    label: 'Bill Wellness Kit',
    description: 'Take-home bars and supplement cups. Upsell code on the invoice.',
    apCost: 1,
    phase: 'services',
    effects: { money: 85, indulgence: 1, trust: 0.1 },
    once: true,
  },
  {
    id: 'bill_consultation',
    label: 'Bill Office Visit',
    description: 'Standard office visit code. Exam and counseling documented. Fee posts to the ledger.',
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
    description: 'Book the next appointment before she reaches the lobby doors.',
    apCost: 0,
    phase: 'checkout',
    effects: { trust: 0.15, loyalty: 1, openness: 0.5 },
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

/** Actions that clear each visit phase gate (any one is enough). */
const PHASE_GATE_ACTIONS = {
  greeting: ['say_hi'],
  intake: ['review_chart', 'review_symptoms', 'order_labs', 'personal_talk'],
  exam: ['weigh_patient', 'estimate_weight'],
  services: ['bill_consultation'],
  checkout: ['end_visit'],
};

function phaseGateMet(phase, completed) {
  const gates = PHASE_GATE_ACTIONS[phase];
  if (!gates) return false;
  return gates.some((id) => completed.includes(id));
}

export function syncVisitPhase(visit) {
  if (!visit) return;
  const completed = visit.completedActions || [];
  let guard = 0;
  while (guard < VISIT_PHASES.length) {
    guard += 1;
    const idx = VISIT_PHASES.indexOf(visit.phase);
    if (idx < 0) {
      visit.phase = 'greeting';
      continue;
    }
    if (!phaseGateMet(visit.phase, completed)) break;
    if (idx >= VISIT_PHASES.length - 1) break;
    visit.phase = VISIT_PHASES[idx + 1];
  }
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

function visitClusterLock(visit, action) {
  if (!action.cluster) return null;
  const done = visit.completedActions || [];
  const didClinical = done.some((id) => CLINICAL_CLUSTER.has(id));
  const didIndulgent = done.some((id) => INDULGENT_CLUSTER.has(id));
  if (action.cluster === 'clinical' && didIndulgent) {
    return 'The tray is already out.';
  }
  if (action.cluster === 'indulgent' && didClinical) {
    return 'You committed to the clinical script today.';
  }
  return null;
}

function applyVisitEffects(state, patient, action) {
  const effects = { ...(action.effects || {}) };

  if (effects.weightRoll) {
    const gain = visitWeightBump(state, patient, effects.weightRoll);
    effects.weight = (effects.weight || 0) + gain;
    effects.indulgence = (effects.indulgence || 0) + gain * 0.5;
    delete effects.weightRoll;
  }

  const reputationBonus =
    action.id === 'bill_consultation' ? consultReputationBonus(state) : 0;

  applyCharacterEffects(state, patient, effects, {
    consultIncome: action.id === 'bill_consultation' || action.id === 'upsell_wellness_kit',
    reputationBonus,
    framingScale: getIndulgentHeatScale(patient, action),
  });
}

function getIndulgentHeatScale(patient, action) {
  if (!action.cluster || action.cluster !== 'indulgent') return 1;
  const framing = getPatientFramingTier(patient);
  if (framing === 'complicit') return 0.25;
  if (framing === 'warming') return 0.6;
  return 1;
}

export function recordChartEntry(state, patient, { honest, kind, excuse, weight }) {
  const realWeight = weight ?? patient.weight;
  if (honest) {
    patient.chartedWeight = realWeight;
  } else if (kind === 'hedge') {
    const prev = patient.chartedWeight ?? patient.weight;
    patient.chartedWeight = Math.min(realWeight, Math.round((prev + 0.5) * 10) / 10);
  } else if (kind === 'fabrication') {
    // chartedWeight unchanged
  }
  recordLedger(state, {
    id: 'chart_entry',
    characterId: patient.id,
    data: {
      weight: realWeight,
      charted: patient.chartedWeight,
      honest,
      kind: kind || (honest ? 'true' : 'hedge'),
      excuse: excuse || null,
    },
  });
}

export function applyWeighChartChoice(state, choiceId) {
  const visit = getVisit(state);
  if (!visit?.pendingWeigh) return { ok: false, message: 'No weigh-in in progress.' };
  const patient = getPatientForVisit(state);
  if (!patient) return { ok: false, message: 'Patient not found.' };

  const realWeight = visit.pendingWeigh.weight;
  const framing = getPatientFramingTier(patient);

  if (choiceId === 'chart_fabricate' && framingRank(framing) < framingRank('clinical_plus')) {
    return { ok: false, message: 'Fabrication requires more familiarity.' };
  }

  if (choiceId === 'chart_true') {
    recordChartEntry(state, patient, { honest: true, weight: realWeight });
    applyCharacterEffects(state, patient, { trust: 0.2 });
  } else if (choiceId === 'chart_hedge') {
    recordChartEntry(state, patient, { honest: false, kind: 'hedge', weight: realWeight });
    applyCharacterEffects(state, patient, { coverRating: 2 });
  } else if (choiceId === 'chart_fabricate') {
    const excuse = FABRICATION_EXCUSES[state.week % FABRICATION_EXCUSES.length];
    recordChartEntry(state, patient, {
      honest: false,
      kind: 'fabrication',
      excuse,
      weight: realWeight,
    });
    applyCharacterEffects(state, patient, { coverRating: 4, framingErosion: 2 });
  } else {
    return { ok: false, message: 'Unknown chart choice.' };
  }

  visit.pendingWeigh = null;
  const tone = visit.pendingWeighTone || null;
  visit.pendingWeighTone = null;
  const result = finishWeighAction(state, visit, patient, tone);
  syncVisitPhase(visit);
  return result;
}

function framingRank(tier) {
  const ranks = { clinical: 0, clinical_plus: 1, warming: 2, complicit: 3 };
  return ranks[tier] ?? 0;
}

function finishWeighAction(state, visit, patient, toneId) {
  const action = actionById(visit.pendingWeighAction || 'weigh_patient');
  if (!action) return { ok: false, message: 'Weigh action missing.' };

  visit.completedActions.push(action.id);
  if (action.advancesPhase) visit.phase = nextPhase(visit.phase);

  let narrative;
  let reply;
  if (toneId && actionSupportsTone(action.id)) {
    const tier = tierFromAttitude(getAttitudeKey(patient));
    ({ narrative, reply } = buildToneNarrative(patient, action.id, tier, toneId));
  } else {
    ({ narrative, reply } = visitDialogue(patient, action.id));
  }

  if (!visit.visitLog) visit.visitLog = [];
  visit.visitLog.push({ label: action.label, narrative, reply, tone: toneId || null });
  visit.pendingWeighAction = null;
  syncVisitPhase(visit);

  const interrupt = checkVisitInterrupt(state, patient, action.id);
  if (interrupt) {
    visit.interrupt = { sceneId: interrupt.sceneId, triggerActionId: action.id };
  }

  addWeekNote(
    { type: 'visit', title: `${action.label}: ${patient.name}`, text: narrative },
    state,
  );

  return {
    ok: true,
    message: narrative,
    phase: visit.phase,
    interrupt: interrupt?.sceneId || null,
  };
}

export function beginWeighRitual(state, toneId = null) {
  const visit = getVisit(state);
  if (!visit) return { ok: false, message: 'No active visit.' };
  const patient = getPatientForVisit(state);
  if (!patient) return { ok: false, message: 'Patient not found.' };

  const actionId = hasCompletedAction(visit, 'weigh_patient') ? null : 'weigh_patient';
  const altId = hasCompletedAction(visit, 'estimate_weight') ? null : 'estimate_weight';
  const targetId = actionId || altId;
  if (!targetId) return { ok: false, message: 'Weight already recorded.' };

  const option = getVisitActions(state).find((item) => item.id === targetId);
  if (!option || option.disabled) {
    return { ok: false, message: option?.reason || 'Weigh-in unavailable.' };
  }

  const action = actionById(targetId);
  if (action.apCost > 0 && !spendActionPoint(state)) {
    return { ok: false, message: 'No action points remain.' };
  }

  applyVisitEffects(state, patient, action);
  patient.weight = Math.round(patient.weight * 10) / 10;

  visit.pendingWeigh = {
    weight: patient.weight,
    step: 'landing',
    toneId,
    reaction: getWeighRitualReaction(patient),
  };
  visit.pendingWeighAction = targetId;
  visit.pendingWeighTone = toneId;

  return {
    ok: true,
    weighRitual: true,
    weight: patient.weight,
    reaction: getWeighRitualReaction(patient),
  };
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
  if (visit.interrupt?.sceneId) return [];

  const patient = getPatientForVisit(state);
  if (!patient) return [];

  const mobilityRestricted = isCharacterImmobile(patient) || isCharacterBlob(patient);

  return VISIT_ACTIONS.filter((action) => {
    if (action.id === 'weigh_patient' && mobilityRestricted) return false;
    if (action.id === 'estimate_weight' && !mobilityRestricted) return false;
    const gate = getVisitActionGate(action.id, patient);
    return gate.visible !== false;
  }).map((action) => {
    const gate = getVisitActionGate(action.id, patient);
    const display = {
      ...action,
      label: gate.label ?? action.label,
      description: gate.description ?? action.description,
      locked: gate.locked || false,
      lockHint: gate.lockHint || '',
    };

    const wrongPhase = VISIT_PHASES.indexOf(display.phase) > VISIT_PHASES.indexOf(visit.phase);
    const alreadyDone = display.once && hasCompletedAction(visit, display.id);
    const requirement = meetsActionRequirements(state, visit, display);
    const needsAp = display.apCost > 0 && state.actionPoints < display.apCost;
    const clusterReason = visitClusterLock(visit, display);

    let disabled = wrongPhase || alreadyDone || !requirement.ok || needsAp || display.locked || Boolean(clusterReason);
    let reason = gate.disabledReason || '';

    if (display.locked) reason = display.lockHint || 'Locked';
    else if (clusterReason) reason = clusterReason;
    else if (wrongPhase) reason = `Available in ${display.phase}`;
    else if (alreadyDone) reason = 'Already done this visit';
    else if (!requirement.ok) reason = requirement.reason;
    else if (needsAp) reason = 'No AP remaining';

    return {
      ...display,
      disabled,
      reason,
    };
  });
}

export function getVisitInterruptScene(state) {
  const visit = getVisit(state);
  if (!visit?.interrupt?.sceneId) return null;
  const patient = getPatientForVisit(state);
  if (!patient) return null;
  const ctx = buildSceneContext(state, patient, { trigger: visit.interrupt.triggerActionId });
  return resolveScene(visit.interrupt.sceneId, ctx);
}

export function hasActiveVisitInterrupt(state) {
  return Boolean(getVisit(state)?.interrupt?.sceneId);
}

export function resolveVisitInterrupt(state, choiceId) {
  const visit = getVisit(state);
  if (!visit?.interrupt?.sceneId) return { ok: false, message: 'No crisis to resolve.' };

  const patient = getPatientForVisit(state);
  if (!patient) return { ok: false, message: 'Patient not found.' };

  const result = applySceneChoice(state, visit.interrupt.sceneId, choiceId, patient, {
    trigger: visit.interrupt.triggerActionId,
  });
  if (!result.ok) return result;

  if (state.stats) state.stats.interruptsHandled = (state.stats.interruptsHandled || 0) + 1;

  visit.visitLog.push({
    label: `Crisis: ${result.scene?.title || 'Scene'}`,
    narrative: result.text,
    reply: '',
  });

  visit.interrupt = null;
  checkAuditGameOver(state);

  return { ok: true, message: result.message, text: result.text };
}

export function performVisitAction(state, actionId, toneId = null) {
  const visit = getVisit(state);
  if (!visit) return { ok: false, message: 'No active visit.' };
  if (visit.interrupt?.sceneId) {
    return { ok: false, message: 'Resolve the crisis before other actions.' };
  }

  const patient = getPatientForVisit(state);
  if (!patient) return { ok: false, message: 'Patient not found.' };

  const action = actionById(actionId);
  if (!action) return { ok: false, message: 'Unknown visit action.' };

  if (actionId === 'weigh_patient' || actionId === 'estimate_weight') {
    return beginWeighRitual(state, toneId);
  }

  const option = getVisitActions(state).find((item) => item.id === actionId);
  if (!option || option.disabled) {
    return { ok: false, message: option?.reason || 'That action is unavailable.' };
  }

  if (action.apCost > 0 && !spendActionPoint(state)) {
    return { ok: false, message: 'No action points remain.' };
  }

  consumeInventory(state, action);
  applyVisitEffects(state, patient, action);

  if (toneId && actionSupportsTone(actionId)) {
    applyToneEffects(state, patient, toneId);
    checkAuditGameOver(state);
  }

  visit.completedActions.push(action.id);

  if (action.id === 'end_visit') {
    syncVisitPhase(visit);
    const result = completeVisit(state);
    return { ok: result.ok, message: result.message, visitComplete: true, phase: visit.phase };
  }

  if (action.advancesPhase) {
    visit.phase = nextPhase(visit.phase);
  }
  syncVisitPhase(visit);

  let narrative;
  let reply;
  if (toneId && actionSupportsTone(actionId)) {
    const tier = tierFromAttitude(getAttitudeKey(patient));
    ({ narrative, reply } = buildToneNarrative(patient, actionId, tier, toneId));
  } else {
    ({ narrative, reply } = visitDialogue(patient, actionId));
  }

  if (!narrative) {
    narrative = `${option.label} with ${patient.name}.`;
  }
  let message = narrative;
  if (reply) message = `${narrative} "${reply}"`;

  if (action.effects?.money) {
    message = `${message} Billed ${formatMoney(action.effects.money)}.`;
  }

  if (!visit.visitLog) visit.visitLog = [];
  visit.visitLog.push({ label: option.label, narrative, reply, tone: toneId || null });

  if (action.id === 'bill_consultation') {
    bumpStyle(state, styleFromInteraction('consult'));
  }

  const interrupt = checkVisitInterrupt(state, patient, actionId);
  if (interrupt) {
    visit.interrupt = {
      sceneId: interrupt.sceneId,
      triggerActionId: actionId,
    };
    message = `${message} A crisis needs your decision before you continue.`;
  }

  addWeekNote(
    {
      type: 'visit',
      title: `${action.label}: ${patient.name}`,
      text: message,
    },
    state,
  );

  return {
    ok: true,
    message,
    phase: visit.phase,
    interrupt: interrupt?.sceneId || null,
  };
}

export function canEndVisit(state) {
  const visit = getVisit(state);
  if (!visit || visit.phase !== 'checkout') return false;
  return hasCompletedAction(visit, 'bill_consultation');
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
