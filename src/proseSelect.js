import { rngForState } from './state.js';

/**
 * Seen-line selection: every pool rotates fully before any line repeats.
 * state.seenLines[scopeId][poolId] holds the indices already shown.
 */

const POOL_HISTORY_CAP = 64;

function historyFor(state, scopeId, poolId) {
  if (!state.seenLines) state.seenLines = {};
  if (!state.seenLines[scopeId]) state.seenLines[scopeId] = {};
  if (!Array.isArray(state.seenLines[scopeId][poolId])) {
    state.seenLines[scopeId][poolId] = [];
  }
  return state.seenLines[scopeId][poolId];
}

/**
 * Pick a line the given scope has not seen yet; once the pool is
 * exhausted, the rotation resets. `peek: true` selects without
 * recording, for previews that must not burn a line.
 */
export function pickSeen(state, scopeId, poolId, pool, { peek = false } = {}) {
  if (!pool?.length) return '';
  if (pool.length === 1) return pool[0];
  if (!state) return pool[0];

  const history = historyFor(state, scopeId || 'world', poolId);
  const used = new Set(history.filter((index) => index < pool.length));
  let candidates = [];
  for (let i = 0; i < pool.length; i += 1) {
    if (!used.has(i)) candidates.push(i);
  }
  if (!candidates.length) {
    if (!peek) history.length = 0;
    candidates = pool.map((_, i) => i);
  }

  const rng = rngForState(state);
  const choice = candidates[rng.int(0, candidates.length - 1)];

  if (!peek) {
    history.push(choice);
    if (history.length > POOL_HISTORY_CAP) {
      history.splice(0, history.length - POOL_HISTORY_CAP);
    }
  }
  return pool[choice];
}

/**
 * Stable pick for fixed traits (a standing chart reason, a wardrobe
 * habit): same character, same line, forever. Prefer creation-time
 * fields for new data; this exists for legacy call sites.
 */
export function pickStable(character, pool) {
  if (!pool?.length) return '';
  const seed = (character?.id || '').split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return pool[seed % pool.length];
}
