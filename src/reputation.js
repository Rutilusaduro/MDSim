export const REPUTATION_TIERS = [
  { id: 0, name: 'Quiet Startup', min: 0, max: 17, unlocks: [] },
  { id: 1, name: 'Promising Practice', min: 18, max: 31, unlocks: ['wellness-vending-wall'] },
  { id: 2, name: 'Trusted Neighborhood', min: 32, max: 47, unlocks: ['private-recovery-nook', 'appetite-tonic-pack'] },
  { id: 3, name: 'Beloved Local Clinic', min: 48, max: 69, unlocks: ['luxury-comfort-campaign', 'staff-uniform-upgrade'] },
  { id: 4, name: 'Renowned Comfort Practice', min: 70, max: 999, unlocks: ['concierge-followups'] },
];

export function getReputationTier(reputation) {
  return (
    REPUTATION_TIERS.find((t) => reputation >= t.min && reputation <= t.max) ||
    REPUTATION_TIERS[REPUTATION_TIERS.length - 1]
  );
}

export function getTierForItem(itemId) {
  for (const tier of REPUTATION_TIERS) {
    if (tier.unlocks.includes(itemId)) return tier;
  }
  return null;
}

export function isItemUnlockedByReputation(state, itemId) {
  const required = getTierForItem(itemId);
  if (!required) return true;
  return getReputationTier(state.reputation).id >= required.id;
}

export function getReputationBlockReason(state, itemId) {
  const required = getTierForItem(itemId);
  if (!required || isItemUnlockedByReputation(state, itemId)) return '';
  return `Requires ${required.name} (${required.min}+ reputation)`;
}
