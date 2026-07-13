import { getStageIndex } from './characters.js';

/**
 * Patient visit framing tiers and in-world chart snippets.
 * Shifts per patient as trust, visits, and indulgence climb.
 */

export const PUBLIC_CLINIC_TAGLINE =
  'Primary care for adults. Annual visits, sick care, chronic disease management.';

export function getPatientFramingTier(patient) {
  const stage = getStageIndex(patient);
  const visits = patient.visits || 0;
  const indulgence = patient.indulgence || 0;
  const openness = patient.openness || 0;
  const trust = patient.trust || 0;

  if (stage >= 5 || indulgence >= 55 || openness >= 70) return 'complicit';
  if (stage >= 3 || indulgence >= 30 || visits >= 5) return 'warming';
  if (visits >= 2 || trust >= 6) return 'clinical_plus';
  return 'clinical';
}

export const PUBLIC_VISIT_REASONS = [
  'annual physical',
  'blood pressure follow-up',
  'refill visit',
  'lab review',
  'sick visit',
  'diabetes screening',
  'thyroid panel',
  'routine wellness exam',
];

export function getPatientPublicReason(patient) {
  if (patient.publicReason) return patient.publicReason;
  // Legacy saves: patients created before v7 carry no stored reason.
  const seed = (patient.id || '').split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  return PUBLIC_VISIT_REASONS[seed % PUBLIC_VISIT_REASONS.length];
}

export function getPatientFramingNote(patient) {
  const tier = getPatientFramingTier(patient);
  const reason = getPatientPublicReason(patient);
  switch (tier) {
    case 'clinical':
      return `Chart: ${reason}. Vitals and intake pending.`;
    case 'clinical_plus':
      return `Chart: ${reason}. Prior note: patient lingered after vitals; appetite screening added.`;
    case 'warming':
      return `Chart: ${reason}. Meal tray on standing order; vitals secondary.`;
    case 'complicit':
      return `Chart: ${reason}. Extended nutrition block approved; billing codes unchanged.`;
    default:
      return `Chart: routine visit.`;
  }
}

export function visitDialogueTier(patient, attitudeTier) {
  const framing = getPatientFramingTier(patient);
  if (framing === 'clinical' || framing === 'clinical_plus') return 'clinical';
  if (framing === 'warming' && (attitudeTier === 'early' || attitudeTier === 'mid')) return 'warming';
  return attitudeTier;
}

export function applyFramingErosion(patient, delta) {
  patient.framingErosion = Math.min(100, (patient.framingErosion || 0) + delta);
  if (patient.framingErosion >= 25) patient.slimMindset = false;
}

export function chartGap(patient) {
  const charted = patient.chartedWeight ?? patient.weight;
  return Math.max(0, Math.round((patient.weight - charted) * 10) / 10);
}

export function getCoverLabel(state) {
  const cover = state.coverRating ?? 100;
  const patients = state.patients || [];
  const warmingCount = patients.filter((p) => {
    const t = getPatientFramingTier(p);
    return t === 'warming' || t === 'complicit';
  }).length;
  const rosterWarming = patients.length && warmingCount >= patients.length / 2;

  if (cover >= 80) return rosterWarming ? 'They would never testify' : 'Spotless charting';
  if (cover >= 60) return rosterWarming ? 'Plausible until someone talks' : 'Plausible PCP';
  if (cover >= 35) return 'Board might notice';
  if (cover >= 15) return 'Audit risk';
  return 'Imminent shutdown';
}

