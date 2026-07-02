import { getStageIndex } from './characters.js';

/**
 * Public framing: normal primary-care office.
 * Private reality: fattening under cover of routine medicine.
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

export function getPatientPublicReason(patient) {
  const reasons = [
    'annual physical',
    'blood pressure follow-up',
    'refill visit',
    'lab review',
    'sick visit',
    'diabetes screening',
    'thyroid panel',
    'routine wellness exam',
  ];
  const seed = (patient.id || '').split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  return reasons[seed % reasons.length];
}

export function getPatientFramingNote(patient) {
  const tier = getPatientFramingTier(patient);
  const reason = getPatientPublicReason(patient);
  switch (tier) {
    case 'clinical':
      return `Chart says ${reason}. She expects a normal PCP visit.`;
    case 'clinical_plus':
      return `Still here for ${reason}, but she lingers after vitals. Appetite questions feel less clinical now.`;
    case 'warming':
      return `She books under ${reason}. The meal tray gets as much attention as the stethoscope.`;
    case 'complicit':
      return `Insurance still codes ${reason}. She knows what she comes for.`;
    default:
      return `Routine visit.`;
  }
}

export function visitDialogueTier(patient, attitudeTier) {
  const framing = getPatientFramingTier(patient);
  if (framing === 'clinical' || framing === 'clinical_plus') return 'clinical';
  if (framing === 'warming' && (attitudeTier === 'early' || attitudeTier === 'mid')) return 'warming';
  return attitudeTier;
}

export function staffPublicFraming() {
  return 'Scrubs and smiles. The lobby looks like any busy primary-care office, if you ignore how tight the uniforms run.';
}
