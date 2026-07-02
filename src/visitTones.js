import { getVisitNarrative } from './patientVisitDialogue.js';
import { applyFramingErosion } from './patientFraming.js';
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
    clinical: 'Hydration protocol. Fine.',
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

const TONE_NARRATIVE_PREFIX = {
  gentle: 'You keep your voice soft. Permission without pressure.',
  clinical: 'You speak in chart language. Normal PCP rhythm.',
  shameless: 'You name appetite openly. The cover thins.',
  cruel: 'You tell the plain truth. No comfort offered.',
};

export function actionSupportsTone(actionId) {
  return ['say_hi', 'offer_water', 'weigh_patient'].includes(actionId);
}

export function getToneEffects(toneId) {
  return { ...(TONE_EFFECTS[toneId] || {}) };
}

export function getToneReply(actionId, toneId) {
  return TONE_REPLIES[actionId]?.[toneId] || '';
}

export function buildToneNarrative(patient, actionId, tier, toneId) {
  const base = getVisitNarrative(actionId, patient, tier);
  const prefix = TONE_NARRATIVE_PREFIX[toneId] || '';
  const narrative = prefix ? `${prefix} ${base.narrative}` : base.narrative;
  const reply = getToneReply(actionId, toneId) || base.reply;
  return { narrative, reply };
}

export function applyToneEffects(state, patient, toneId) {
  const effects = getToneEffects(toneId);
  if (effects.trust) patient.trust = Math.round((patient.trust + effects.trust) * 100) / 100;
  if (effects.openness) patient.openness = Math.min(100, patient.openness + effects.openness);
  if (effects.indulgence) patient.indulgence = Math.min(100, patient.indulgence + effects.indulgence);
  if (effects.coverRating && state) {
    state.coverRating = Math.max(0, Math.min(100, (state.coverRating ?? 100) + effects.coverRating));
  }
  if (effects.heat && state) {
    state.heat = Math.min(100, (state.heat || 0) + effects.heat);
    if (effects.heat > 0 && state.coverRating != null) {
      state.coverRating = Math.max(0, state.coverRating - Math.floor(effects.heat / 4));
    }
  }
  if (effects.framingErosion) {
    applyFramingErosion(patient, effects.framingErosion);
  }
  if (toneId === 'shameless' || toneId === 'cruel') {
    patient.slimMindset = false;
  }
  checkAuditGameOver(state);
}
