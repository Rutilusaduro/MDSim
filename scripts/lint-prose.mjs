import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lintSourceStrings } from '../src/prose.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const targets = ['src/characters.js', 'src/events.js', 'src/state.js', 'src/clinic.js', 'src/patientDialogue.js'];

let failed = false;

for (const rel of targets) {
  const file = join(root, rel);
  const source = readFileSync(file, 'utf8');
  const hits = lintSourceStrings(source, rel);

  for (const hit of hits) {
    failed = true;
    console.error(`\n${hit.file}:${hit.line}`);
    console.error(`  "${hit.text}"`);
    for (const v of hit.violations) {
      console.error(`  ✗ [${v.rule}] ${v.detail}`);
    }
  }
}

if (failed) {
  console.error('\nProse lint failed. Apply the Beautiful Prose skill (.cursor/skills/beautiful-prose/SKILL.md).');
  process.exit(1);
}

console.log('Prose lint passed.');
