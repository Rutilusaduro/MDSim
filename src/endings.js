import { getAttitudeKey } from './characters.js';

export const ENDING_CARDS = [
  {
    id: 'temple',
    name: 'Temple of Appetite',
    check: (s) => s.reputation >= 70 && s.staff.length >= 6,
    blurb: 'Your clinic became a temple of appetite. Word of mouth does what ads never could.',
  },
  {
    id: 'devoted_roster',
    name: 'Devoted Bench',
    check: (s) => {
      if (s.staff.length < 4) return false;
      return s.staff.every((c) => getAttitudeKey(c) === 'devoted' || getAttitudeKey(c) === 'indulgent');
    },
    blurb: 'Every staff member reached indulgent voice or beyond. The break room never empties.',
  },
  {
    id: 'rival_crush',
    name: 'Annex Silenced',
    check: (s) => s.rivalState?.defeated && s.reputation >= 55,
    blurb: 'ThriveWell Annex fades. You won the neighborhood on comfort alone.',
  },
  {
    id: 'wealth',
    name: 'In the Black',
    check: (s) => s.money >= 12000 && s.week >= 12,
    blurb: 'Bills paid. Trays full. The clinic prints money and pounds.',
  },
  {
    id: 'default',
    name: 'Soft Opening Eternal',
    check: () => true,
    blurb: 'The doors stay open. Appetite stays welcome. Another week always waits.',
  },
];

export function computeEnding(state) {
  const card = ENDING_CARDS.find((c) => c.id !== 'default' && c.check(state)) || ENDING_CARDS.find((c) => c.id === 'default');
  return {
    card,
    week: state.week,
    reputation: state.reputation,
    staffCount: state.staff.length,
    recruited: state.stats?.patientsRecruited || 0,
    arcsDone: state.stats?.arcBeatsCompleted || 0,
  };
}

export function canShowEnding(state) {
  return state.chapter > 2 && state.week >= 14;
}

export const NG_PLUS_BONUSES = [
  { id: 'ap', label: '+1 max AP', apply: (s) => { s.actionPointsMax += 1; s.actionPoints += 1; } },
  { id: 'gain', label: '+5% gain multiplier', apply: (s) => { s.ngPlusGain = (s.ngPlusGain || 0) + 0.05; } },
];

export function applyNgPlus(state, bonusId = 'ap') {
  const bonus = NG_PLUS_BONUSES.find((b) => b.id === bonusId) || NG_PLUS_BONUSES[0];
  state.ngPlus = (state.ngPlus || 0) + 1;
  state.ngPlusBonus = bonusId;
  bonus.apply(state);
  return bonus;
}
