import { describe, expect, it } from 'vitest';
import './helpers.js';
import { createNewGame } from '../src/state.js';
import { endWeek } from '../src/events.js';

function play(seed, weeks) {
  const state = createNewGame({ seed });
  for (let i = 0; i < weeks; i += 1) endWeek(state);
  return JSON.stringify(state);
}

describe('seeded determinism', () => {
  it('two 12-week runs on one seed are byte-identical', () => {
    expect(play(20260713, 12)).toBe(play(20260713, 12));
  });

  it('different seeds diverge', () => {
    expect(play(1, 6)).not.toBe(play(2, 6));
  });
});
