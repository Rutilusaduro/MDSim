export const CHALLENGE_WEEKS = [
  {
    id: 'caterer',
    name: 'Caterer Convention',
    blurb: 'Food events weigh double. Staff hunger runs hot.',
    eventBoost: (ev) => ev.id.includes('feast') || ev.id.includes('food') || ev.id.includes('cater') || ev.id.includes('snack') || ev.id.includes('lunch') || ev.id.includes('brunch') || ev.id.includes('delivery') || ev.id.includes('truck') || ev.id.includes('bake'),
    wardrobeMult: 1,
    gainMult: 1.05,
  },
  {
    id: 'button',
    name: 'Button Crisis',
    blurb: 'Wardrobe strain everywhere. Openness rises with every pop.',
    eventBoost: (ev) => ev.id.includes('button') || ev.id.includes('wardrobe') || ev.id.includes('scrub') || ev.id.includes('uniform') || ev.id.includes('seam'),
    wardrobeMult: 2,
    gainMult: 1,
  },
  {
    id: 'quiet',
    name: 'Quiet Week',
    blurb: 'Fewer spectacle events. Trust and loyalty deepen.',
    eventBoost: () => false,
    wardrobeMult: 0.6,
    gainMult: 0.92,
    trustBonus: 0.15,
    loyaltyBonus: 1,
  },
];

export function getChallenge(id) {
  return CHALLENGE_WEEKS.find((c) => c.id === id);
}

export function getChallengeLabel(id) {
  return getChallenge(id)?.name || 'Normal week';
}

export function needsChallengePick(state) {
  return state.needsChallengePick === true;
}

export function pickChallengeWeek(state, challengeId) {
  const challenge = getChallenge(challengeId);
  if (!challenge) return { ok: false, message: 'Unknown challenge.' };
  state.challengeWeek = challengeId;
  state.needsChallengePick = false;
  return { ok: true, message: `${challenge.name} selected.` };
}

export function startNewWeekChallenge(state) {
  state.challengeWeek = null;
  state.needsChallengePick = true;
}
