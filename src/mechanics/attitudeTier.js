/** Single source for attitude → dialogue tier mapping. */
export function tierFromAttitude(attitude) {
  if (attitude === 'immobile') return 'immobile';
  if (attitude === 'blob') return 'blob';
  if (attitude === 'professional' || attitude === 'noticing') return 'early';
  if (attitude === 'hungry' || attitude === 'pleased') return 'mid';
  return 'late';
}
