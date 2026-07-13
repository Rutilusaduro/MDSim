import { beforeEach, describe, expect, it } from 'vitest';
import { clearStorage } from './helpers.js';
import { loadFixture } from './scaffold.test.js';
import { normaliseState, loadGame, GAME_VERSION } from '../src/state.js';

const FIXTURES = ['fresh', 'mid', 'endgame'];

describe('save round-trip', () => {
  it.each(FIXTURES)('%s survives stringify → normalise unchanged', (name) => {
    const original = loadFixture(name);
    const restored = normaliseState(JSON.parse(JSON.stringify(original)));
    expect(restored).toEqual(original);
  });

  it.each(FIXTURES)('%s normalisation is idempotent', (name) => {
    const once = normaliseState(loadFixture(name));
    const twice = normaliseState(JSON.parse(JSON.stringify(once)));
    expect(twice).toEqual(once);
  });
});

describe('v6 → v7 migration', () => {
  beforeEach(() => clearStorage());

  it('loads a v6 save and defaults every v7 field', () => {
    const v6 = loadFixture('mid');
    v6.version = 6;
    delete v6.seenLines;
    delete v6.history;
    delete v6.difficulty;
    delete v6.pendingLetters;
    delete v6.coverOps;
    localStorage.setItem('indulgecare-clinic-save-v6', JSON.stringify(v6));

    const loaded = loadGame();
    expect(loaded.version).toBe(GAME_VERSION);
    expect(loaded.seenLines).toEqual({});
    expect(loaded.history).toEqual([]);
    expect(loaded.difficulty).toBe('attending');
    expect(loaded.pendingLetters).toEqual([]);
    expect(loaded.coverOps).toEqual({ activeBuffs: [] });
    expect(loaded.week).toBe(v6.week);
    expect(loaded.patients.map((p) => p.id)).toEqual(v6.patients.map((p) => p.id));
  });

  it('cleans up the v6 key only after the v7 write landed', () => {
    const v6 = loadFixture('fresh');
    v6.version = 6;
    localStorage.setItem('indulgecare-clinic-save-v6', JSON.stringify(v6));
    loadGame();
    expect(localStorage.getItem('indulgecare-clinic-save-v7')).toBeTruthy();
    expect(localStorage.getItem('indulgecare-clinic-save-v6')).toBeNull();
  });
});
