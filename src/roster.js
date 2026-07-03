/** Character lookup without pulling in events.js domain logic. */
export function findCharacter(state, id) {
  return [...state.staff, ...state.patients].find((character) => character.id === id);
}

export function allCharacters(state) {
  return [...state.staff, ...state.patients];
}

export function rosterAverageFraming(state, getFramingTier) {
  const patients = state.patients || [];
  if (!patients.length) return 'clinical';
  const tiers = patients.map((p) => getFramingTier(p));
  if (tiers.some((t) => t === 'complicit')) return 'complicit';
  if (tiers.filter((t) => t === 'warming').length >= patients.length / 2) return 'warming';
  if (tiers.some((t) => t === 'clinical_plus')) return 'clinical_plus';
  return 'clinical';
}
