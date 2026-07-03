import { getDominantStyle, defaultClinicStyle } from './clinicStyle.js';
import { rosterAverageFraming } from './roster.js';
import { getPatientFramingTier } from './patientFraming.js';
import { worldLedger } from './memoryLedger.js';

function ensureClinicStyle(state) {
  if (!state.clinicStyle) state.clinicStyle = defaultClinicStyle();
  return state.clinicStyle;
}

function hasUpgrade(state, id) {
  return (state.ownedUpgrades || []).includes(id);
}

const SHRINE_UPGRADES = [
  'reinforced-lounge-chairs',
  'plush-breakroom-couch',
  'wide-exam-tables',
  'private-recovery-nook',
  'luxury-comfort-campaign',
];

function shrineUpgradeCount(state) {
  return SHRINE_UPGRADES.filter((id) => hasUpgrade(state, id)).length;
}

function worldLedgerHasScars(state) {
  const wl = worldLedger(state);
  const scarIds = ['flag:global_doorway_widened', 'flag:global_furniture_upgraded', 'flag:global_home_visits_active', 'flag:global_clinic_custom_wardrobe'];
  return wl.some((row) => scarIds.includes(row.id));
}

/**
 * Four tiers: sterile < hospitable < indulgent < shrine
 *
 * Derived from clinic style axes, owned upgrades, roster framing level,
 * and world-ledger scars (permanent structural changes).
 */
export function getClinicTierLabel(state) {
  const style = ensureClinicStyle(state);
  const dom = getDominantStyle(state);
  const rosterFrame = rosterAverageFraming(state, getPatientFramingTier);
  const upgradeCount = shrineUpgradeCount(state);
  const scars = worldLedgerHasScars(state);

  const softness = style.softness;
  const spectacle = style.spectacle;

  if (
    upgradeCount >= 3 ||
    scars ||
    rosterFrame === 'complicit' ||
    (softness >= 75 && spectacle >= 65)
  ) {
    return 'shrine';
  }

  if (
    upgradeCount >= 2 ||
    rosterFrame === 'warming' ||
    (dom.axis === 'softness' && softness >= 60) ||
    (dom.axis === 'spectacle' && spectacle >= 60)
  ) {
    return 'indulgent';
  }

  if (
    upgradeCount >= 1 ||
    rosterFrame === 'clinical_plus' ||
    softness >= 55 ||
    spectacle >= 55
  ) {
    return 'hospitable';
  }

  return 'sterile';
}

const TIER_TAGLINES = {
  sterile:
    'Primary care for adults. Vitals, refills, chronic disease management. No surprises.',
  hospitable:
    'Primary care with something extra. Comfortable seating. Warm staff. Patients tend to linger.',
  indulgent:
    'Wellness-forward primary care. Extended nutrition consultations. An appetite for good outcomes.',
  shrine:
    'Luxury wellness clinic. Custom care plans. Discretion guaranteed. Some things the chart does not say.',
};

export function getClinicTagline(state) {
  const tier = getClinicTierLabel(state);
  return TIER_TAGLINES[tier];
}

const TIER_AMBIENT_LINES = {
  sterile: [
    'The fluorescents hum. The chairs are standard-issue. Nothing has been chosen for pleasure.',
    'A laminated poster about blood pressure covers a water stain. The desk smells like hand sanitizer.',
    'Patients leave on time. Nobody lingers. The supply closet is organized by audit date.',
  ],
  hospitable: [
    'The chairs are padded. The music is low. The snack tray refills itself without anyone calling it a snack tray.',
    'A patient stays thirty minutes after checkout to finish her tea. Nobody asks her to leave.',
    'Warm light from somewhere you cannot pinpoint. The waiting room smells faintly of bread.',
  ],
  indulgent: [
    'The reinforced chair by the window is never empty for long. Word has gotten out about the afternoon tray.',
    'A patient shows up without an appointment because she knows you will fit her in. You do.',
    'The staff uniform has softened to separates that give where they need to. Nobody mentions it. Everyone notices.',
  ],
  shrine: [
    'The lobby does not look like a clinic anymore. It looks like a decision.',
    'A new patient walks in, looks around, and sits down without needing to be asked. She knew before she arrived.',
    'The chart says primary care. The frame says something else. Both are true. Only one gets billed.',
  ],
};

export function getClinicAmbientLine(state) {
  const tier = getClinicTierLabel(state);
  const lines = TIER_AMBIENT_LINES[tier];
  const week = state.week || 1;
  return lines[week % lines.length];
}
