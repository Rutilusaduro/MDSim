/**
 * Prose lint: Beautiful Prose rules plus machine-tell detectors,
 * over EVERY .js file under src/ (a gate that cannot see new content
 * packs is not a gate).
 *
 * Detectors beyond the per-string rules in src/prose.js:
 *   - rule-of-three density per file ("x, y, and z" autopilot rhythm)
 *   - cross-file 5-gram duplicates in long narrative strings
 *
 * Existing debt is grandfathered in scripts/prose-baseline.json;
 * new or changed lines gate hard.
 *
 * Usage:
 *   node scripts/lint-prose.mjs
 *   node scripts/lint-prose.mjs --update-baseline
 */

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lintSourceStrings } from '../src/prose.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'src');
const baselinePath = join(root, 'scripts', 'prose-baseline.json');
const UPDATE = process.argv.includes('--update-baseline');

/** Non-narrative modules: rule definitions and the tools that quote them. */
const EXCLUDE = new Set(['prose.js', 'proseSelect.js', 'proseLab.js']);

function collectFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) files.push(...collectFiles(abs));
    else if (entry.endsWith('.js') && !EXCLUDE.has(entry)) files.push(abs);
  }
  return files;
}

const sha = (text) => createHash('sha1').update(text).digest('hex').slice(0, 12);

const files = collectFiles(srcDir).map((abs) => ({
  abs,
  rel: relative(root, abs).replaceAll('\\', '/'),
  source: readFileSync(abs, 'utf8'),
}));

// ---- per-string rules (src/prose.js) ---------------------------------------
const lineFindings = [];
for (const file of files) {
  for (const hit of lintSourceStrings(file.source, file.rel)) {
    for (const violation of hit.violations) {
      lineFindings.push({
        // Keyed on rule + text, not file: debt is the sentence, not its
        // address, so pure-move refactors don't resurface old findings.
        key: `${violation.rule}|${sha(hit.text)}`,
        display: `${hit.file}:${hit.line}\n  "${hit.text}"\n  x [${violation.rule}] ${violation.detail}`,
      });
    }
  }
}

// ---- rule-of-three density --------------------------------------------------
const TRIAD = /\b[\w']+, [\w']+, (?:and|or) [\w']+\b/g;
const fileFindings = [];
for (const file of files) {
  const lineCount = file.source.split('\n').length;
  const count = (file.source.match(TRIAD) || []).length;
  const allowed = Math.max(2, Math.ceil(lineCount / 40));
  if (count > allowed) {
    fileFindings.push({
      key: `${file.rel}|triad`,
      count,
      display: `${file.rel}\n  x [triad-density] ${count} "x, y, and z" chains (allowed ${allowed}). Break the rhythm.`,
    });
  }
}

// ---- cross-file 5-gram duplicates --------------------------------------------
// Per line, like lintSourceStrings: quote-pairing across lines would
// otherwise capture raw code between two real strings as a "string".
const STRING_LITERAL = /'((?:[^'\\]|\\.){40,})'|"((?:[^"\\]|\\.){40,})"|`((?:[^`\\]|\\.){40,})`/g;
const gramIndex = new Map();
for (const file of files) {
  for (const line of file.source.split('\n')) {
  let match;
  while ((match = STRING_LITERAL.exec(line)) !== null) {
    const raw = match[1] || match[2] || match[3];
    // Prose only: markup templates share class soup by design.
    if (raw.includes('<') || raw.includes('class=') || raw.includes('${')) continue;
    if (/(?:^|\s)(?:lg:|md:|sm:|px-|py-|mt-|mb-|rounded|text-\w)/.test(raw)) continue;
    const text = raw.toLowerCase();
    const words = text.replace(/[^a-z' ]+/g, ' ').split(/\s+/).filter(Boolean);
    if (words.length < 8) continue;
    const seen = new Set();
    for (let i = 0; i + 5 <= words.length; i += 1) {
      const gram = words.slice(i, i + 5).join(' ');
      if (seen.has(gram)) continue;
      seen.add(gram);
      if (!gramIndex.has(gram)) gramIndex.set(gram, new Set());
      gramIndex.get(gram).add(file.rel);
    }
  }
  }
}
const gramFindings = [];
for (const [gram, fileSet] of gramIndex) {
  if (fileSet.size >= 2) {
    gramFindings.push({
      key: `gram|${sha(gram)}`,
      display: `x [5-gram-dupe] "${gram}" appears in: ${[...fileSet].join(', ')}`,
    });
  }
}

// ---- baseline gate ------------------------------------------------------------
const baseline = existsSync(baselinePath)
  ? JSON.parse(readFileSync(baselinePath, 'utf8'))
  : { lines: [], filesCounts: {}, grams: [] };

if (UPDATE) {
  writeFileSync(
    baselinePath,
    JSON.stringify(
      {
        lines: lineFindings.map((f) => f.key).sort(),
        filesCounts: Object.fromEntries(fileFindings.map((f) => [f.key, f.count])),
        grams: gramFindings.map((f) => f.key).sort(),
      },
      null,
      1,
    ),
  );
  console.log(
    `Baseline updated: ${lineFindings.length} line findings, ${fileFindings.length} file findings, ${gramFindings.length} gram findings grandfathered across ${files.length} files.`,
  );
  process.exit(0);
}

const baselineLines = new Set(baseline.lines);
const baselineGrams = new Set(baseline.grams);
let failed = false;

for (const finding of lineFindings) {
  if (baselineLines.has(finding.key)) continue;
  failed = true;
  console.error(`\n${finding.display}`);
}
for (const finding of fileFindings) {
  const allowedCount = baseline.filesCounts?.[finding.key] ?? 0;
  if (finding.count <= allowedCount) continue;
  failed = true;
  console.error(`\n${finding.display} (baseline ${allowedCount})`);
}
for (const finding of gramFindings) {
  if (baselineGrams.has(finding.key)) continue;
  failed = true;
  console.error(`\n${finding.display}`);
}

if (failed) {
  console.error(
    '\nProse lint failed. Apply the Beautiful Prose skill (.cursor/skills/beautiful-prose/SKILL.md). Fix the lines; only regenerate the baseline for deliberate grandfathering.',
  );
  process.exit(1);
}

console.log(`Prose lint passed. Scanned ${files.length} files under src/.`);
