import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import './helpers.js';

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), 'fixtures');

export function loadFixture(name) {
  return JSON.parse(readFileSync(join(fixturesDir, `${name}.json`), 'utf8'));
}

describe('scaffold', () => {
  it('fixtures exist and parse', () => {
    for (const name of ['fresh', 'mid', 'endgame']) {
      const state = loadFixture(name);
      expect(state.version).toBe(7);
      expect(Array.isArray(state.staff)).toBe(true);
    }
  });
});
