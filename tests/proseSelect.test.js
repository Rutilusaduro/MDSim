import { describe, expect, it } from 'vitest';
import './helpers.js';
import { createNewGame } from '../src/state.js';
import { pickSeen, pickStable } from '../src/proseSelect.js';

const POOL = ['alpha', 'beta', 'gamma', 'delta'];

describe('pickSeen', () => {
  it('shows every line once before any repeat', () => {
    const state = createNewGame({ seed: 42 });
    const seen = new Set();
    for (let i = 0; i < POOL.length; i += 1) {
      seen.add(pickSeen(state, 'char-1', 'greet.early', POOL));
    }
    expect(seen.size).toBe(POOL.length);
  });

  it('resets rotation after exhaustion and keeps cycling', () => {
    const state = createNewGame({ seed: 42 });
    for (let i = 0; i < POOL.length; i += 1) pickSeen(state, 'c', 'p', POOL);
    const secondRound = new Set();
    for (let i = 0; i < POOL.length; i += 1) secondRound.add(pickSeen(state, 'c', 'p', POOL));
    expect(secondRound.size).toBe(POOL.length);
  });

  it('tracks scopes and pools independently', () => {
    const state = createNewGame({ seed: 7 });
    pickSeen(state, 'a', 'p1', POOL);
    pickSeen(state, 'b', 'p1', POOL);
    pickSeen(state, 'a', 'p2', POOL);
    expect(state.seenLines.a.p1).toHaveLength(1);
    expect(state.seenLines.b.p1).toHaveLength(1);
    expect(state.seenLines.a.p2).toHaveLength(1);
  });

  it('peek selects without recording', () => {
    const state = createNewGame({ seed: 7 });
    pickSeen(state, 'a', 'p', POOL, { peek: true });
    expect(state.seenLines.a?.p ?? []).toHaveLength(0);
  });

  it('caps per-pool history at 64', () => {
    const state = createNewGame({ seed: 7 });
    const bigPool = Array.from({ length: 200 }, (_, i) => `line-${i}`);
    for (let i = 0; i < 150; i += 1) pickSeen(state, 'a', 'big', bigPool);
    expect(state.seenLines.a.big.length).toBeLessThanOrEqual(64);
  });

  it('handles empty and single-line pools', () => {
    const state = createNewGame({ seed: 7 });
    expect(pickSeen(state, 'a', 'p', [])).toBe('');
    expect(pickSeen(state, 'a', 'p', ['only'])).toBe('only');
  });
});

describe('pickStable', () => {
  it('returns the same line for the same character forever', () => {
    const character = { id: 'patient-abc' };
    expect(pickStable(character, POOL)).toBe(pickStable(character, POOL));
  });
});
