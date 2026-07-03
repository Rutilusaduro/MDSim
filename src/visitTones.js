import { getVisitNarrative } from './patientVisitDialogue.js';
import { applyCharacterEffects } from './mechanics/applyEffects.js';
import { applyFramingErosion, visitDialogueTier, getPatientFramingTier } from './patientFraming.js';
import { checkAuditGameOver } from './gameOver.js';

const TONE_EFFECTS = {
  gentle: { trust: 0.1, openness: 1.2, framingErosion: 4, coverRating: -1 },
  clinical: { trust: 0.15, coverRating: 4, framingErosion: 0 },
  shameless: { indulgence: 2.5, openness: 2, framingErosion: 12, coverRating: -5, heat: 4 },
  cruel: { openness: 2.5, trust: -0.05, framingErosion: 8, coverRating: -4, heat: 3 },
};

const TONE_REPLIES = {
  say_hi: {
    gentle: 'Thank you. I was nervous. You made it easy.',
    clinical: 'Good morning. I have my insurance card ready.',
    shameless: 'I came hungry. I hope you stocked the tray.',
    cruel: 'Be honest. How bad do I look compared to last time?',
  },
  offer_water: {
    gentle: 'Water first. Then whatever you recommend.',
    clinical: 'Water is fine. Thank you.',
    shameless: 'Water is just to make room for more.',
    cruel: 'Will this make me gain faster? Tell me the truth.',
  },
  weigh_patient: {
    gentle: 'Go ahead. I trust you with the number.',
    clinical: 'For the chart only. Please.',
    shameless: 'Read it loud. I want to hear it climb.',
    cruel: 'If it is up, do not sugarcoat it.',
  },
};

const TONE_REPLIES_CLINICAL = {
  say_hi: {
    shameless: 'I skipped breakfast. If the waiting room has anything, I would not say no.',
    cruel: 'These pants felt fine last month. Tell me if you notice anything.',
  },
  offer_water: {
    shameless: 'Water is fine. Is there coffee while I wait?',
    cruel: 'I know water will not fix why my clothes are tight.',
  },
  weigh_patient: {
    shameless: 'I ate before I came. Tell me if that skews it.',
    cruel: 'Read it plain. I can tell the waistband is fighting me.',
  },
};

const TONE_NARRATIVE_PREFIX = {
  gentle: 'You keep your voice soft. Permission without pressure.',
  clinical: 'You speak in chart language. Normal PCP rhythm.',
  shameless: 'You name appetite openly. The cover thins.',
  cruel: 'You tell the plain truth. No comfort offered.',
};

const TONE_NARRATIVE_PREFIX_CLINICAL = {
  shameless: 'You keep it professional, but appetite slips into the small talk.',
  cruel: 'You name what she already feels in her clothes. Still chart-clean.',
};

export function actionSupportsTone(actionId, patient = null) {
  if (!['say_hi', 'offer_water', 'weigh_patient'].includes(actionId)) return false;
  return true;
}

export function isToneLocked(toneId, patient) {
  if (!patient) return false;
  if (toneId !== 'shameless' && toneId !== 'cruel') return false;
  const framing = getPatientFramingTier(patient);
  return framing === 'clinical' || framing === 'clinical_plus';
}

export function getToneLockHint() {
  return 'She is not ready to hear it.';
}

export function getToneEffects(toneId) {
  return { ...(TONE_EFFECTS[toneId] || {}) };
}

export function getToneReply(actionId, toneId, tier = 'early') {
  if (tier === 'clinical') {
    const clinicalReply = TONE_REPLIES_CLINICAL[actionId]?.[toneId];
    if (clinicalReply) return clinicalReply;
  }
  return TONE_REPLIES[actionId]?.[toneId] || '';
}

export function buildToneNarrative(patient, actionId, tier, toneId) {
  const base = getVisitNarrative(actionId, patient, tier);
  const dialogueTier = visitDialogueTier(patient, tier || 'early');
  const prefix =
    dialogueTier === 'clinical' && TONE_NARRATIVE_PREFIX_CLINICAL[toneId]
      ? TONE_NARRATIVE_PREFIX_CLINICAL[toneId]
      : TONE_NARRATIVE_PREFIX[toneId] || '';
  const narrative = prefix ? `${prefix} ${base.narrative}` : base.narrative;
  const reply = getToneReply(actionId, toneId, dialogueTier) || base.reply;
  return { narrative, reply };
}

export function applyToneEffects(state, patient, toneId) {
  const effects = getToneEffects(toneId);
  applyCharacterEffects(state, patient, effects);
  if (toneId === 'shameless' || toneId === 'cruel') {
    patient.slimMindset = false;
  }
  checkAuditGameOver(state);
}
