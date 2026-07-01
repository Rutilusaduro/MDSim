import { addWeekNote } from './state.js';

export function defaultClinicStyle() {
  return { softness: 50, speed: 50, spectacle: 50 };
}

export function ensureStyle(state) {
  if (!state.clinicStyle) state.clinicStyle = defaultClinicStyle();
}

const STYLE_ITEM_BIAS = {
  'reinforced-lounge-chairs': { softness: 4 },
  'plush-breakroom-couch': { softness: 6 },
  'wellness-vending-wall': { speed: 5 },
  'amber-scent-system': { spectacle: 5 },
  'wide-exam-tables': { softness: 3 },
  'private-recovery-nook': { softness: 5, spectacle: 2 },
  'luxury-comfort-campaign': { spectacle: 6 },
  'staff-uniform-upgrade': { softness: 2 },
};

export function bumpStyle(state, deltas) {
  ensureStyle(state);
  for (const [key, val] of Object.entries(deltas)) {
    if (key in state.clinicStyle) {
      state.clinicStyle[key] = Math.max(0, Math.min(100, state.clinicStyle[key] + val));
    }
  }
}

export function styleFromPurchase(state, itemId) {
  const bias = STYLE_ITEM_BIAS[itemId];
  if (bias) bumpStyle(state, bias);
}

export function styleFromInteraction(actionId) {
  const map = {
    cateredBreak: { softness: 2 },
    comfortPlan: { softness: 1, speed: -1 },
    appetiteTonic: { speed: 3 },
    consult: { spectacle: 1 },
    recruit: { spectacle: 2, softness: 2 },
  };
  return map[actionId] || {};
}

export function getDominantStyle(state) {
  ensureStyle(state);
  const s = state.clinicStyle;
  const entries = Object.entries(s).sort((a, b) => b[1] - a[1]);
  const [top, val] = entries[0];
  const labels = { softness: 'Softness', speed: 'Speed', spectacle: 'Spectacle' };
  return { axis: top, label: labels[top], value: val };
}

export function stylePatientArchetypeBias(state) {
  ensureStyle(state);
  const dom = getDominantStyle(state);
  if (dom.axis === 'softness') return ['dreamer', 'nurturer', 'hedonist'];
  if (dom.axis === 'speed') return ['athlete', 'rebel', 'gymDefector'];
  return ['socialite', 'vip', 'foodBlogger'];
}

export function getStyleFlavor(state) {
  const dom = getDominantStyle(state);
  const flavors = {
    softness: 'The clinic smells like warm bread. Patients arrive ready to settle in.',
    speed: 'Quick consults. Fast trays. Hunger keeps pace with the schedule.',
    spectacle: 'Word travels. Mirrors catch curves. Everyone performs appetite.',
  };
  return flavors[dom.axis] || flavors.softness;
}

export function applyStyleWeekTick(state) {
  ensureStyle(state);
  if (state.staff.length >= 5) bumpStyle(state, { softness: 1 });
  if (state.reputation >= 48) bumpStyle(state, { spectacle: 1 });
}

const STYLE_PERK_THRESHOLD = 65;

export function getStylePerks(state) {
  ensureStyle(state);
  const perks = [];
  const s = state.clinicStyle;
  if (s.softness >= STYLE_PERK_THRESHOLD) {
    perks.push({ axis: 'softness', label: 'Warm Welcome', effect: '+8% staff gain' });
  }
  if (s.speed >= STYLE_PERK_THRESHOLD) {
    perks.push({ axis: 'speed', label: 'Fast Trays', effect: '+6% patient momentum' });
  }
  if (s.spectacle >= STYLE_PERK_THRESHOLD) {
    perks.push({ axis: 'spectacle', label: 'Buzz Factor', effect: '+2 rep on consult' });
  }
  return perks;
}

export function applyStylePerksToEffects(state, effects) {
  ensureStyle(state);
  const s = state.clinicStyle;
  if (s.softness >= STYLE_PERK_THRESHOLD) effects.staffGain += 0.04;
  if (s.speed >= STYLE_PERK_THRESHOLD) effects.patientMomentum += 0.12;
  return effects;
}

export function consultReputationBonus(state) {
  ensureStyle(state);
  return state.clinicStyle.spectacle >= STYLE_PERK_THRESHOLD ? 1 : 0;
}
