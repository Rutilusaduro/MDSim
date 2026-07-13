/**
 * Regenerate the committed save fixtures used by the test suite.
 * Usage: node scripts/make-fixtures.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import '../tests/helpers.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fixturesDir = join(root, 'tests', 'fixtures');
mkdirSync(fixturesDir, { recursive: true });

const { createNewGame } = await import('../src/state.js');
const { endWeek } = await import('../src/events.js');

const FIXED_SEED = 1234567;

function build(weeks) {
  const state = createNewGame({ seed: FIXED_SEED });
  for (let i = 0; i < weeks; i += 1) endWeek(state);
  return state;
}

const fixtures = { fresh: build(0), mid: build(10), endgame: build(30) };

for (const [name, state] of Object.entries(fixtures)) {
  writeFileSync(join(fixturesDir, `${name}.json`), JSON.stringify(state, null, 1));
  console.log(`${name}.json  week=${state.week}  patients=${state.patients.length}`);
}
