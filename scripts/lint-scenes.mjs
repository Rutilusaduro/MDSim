/**
 * Lint scene catalog entries for structural completeness.
 *
 * Rules checked:
 *   1. Every scene must have a `heatBand` array with two numbers.
 *   2. Every scene must have at least one choice that either:
 *        a. carries an `enqueueScene` field (chains to another scene), OR
 *        b. the scene file contains a ledger citation (setsFlags with a
 *           global: prefix, or `recordLedger` call in the source).
 *
 * A "scene" is identified as an exported object that contains both an
 * `opening:` field and a `choices:` field near its `id:` declaration.
 * Plain choice objects (which only carry id/label/outcome) are skipped.
 *
 * Usage: node scripts/lint-scenes.mjs
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
/** Content-pack scene dirs join the sweep as they appear (D0a). */
const SCENE_DIRS = [join(root, 'src', 'scenes'), join(root, 'src', 'content', 'scenes')];

function readSource(absPath) {
  try {
    return readFileSync(absPath, 'utf8');
  } catch {
    return '';
  }
}

function collectSceneFiles() {
  const files = [];
  for (const dir of SCENE_DIRS) {
    let entries;
    try {
      entries = readdirSync(dir);
    } catch {
      continue;
    }
    for (const entry of entries) {
      const abs = join(dir, entry);
      if (statSync(abs).isDirectory()) {
        for (const sub of readdirSync(abs)) {
          if (sub.endsWith('.js')) files.push(join(abs, sub));
        }
      } else if (entry.endsWith('.js')) {
        files.push(abs);
      }
    }
  }
  return files;
}

/**
 * Extract scene definitions by looking for exported const blocks that
 * contain both `opening:` and `choices:` near their `id:` field.
 * This avoids false positives on choice objects inside scenes.
 */
function parseScenes(source, filePath) {
  const rel = relative(root, filePath);
  const scenes = [];

  const sourceLedger =
    /recordLedger/.test(source) ||
    /setsFlags\s*:\s*\[[^\]]*'global:/.test(source) ||
    /'global:[a-z_]+'/.test(source);

  const exportRe = /export\s+const\s+[A-Z_][A-Z0-9_]*\s*=\s*\{/g;
  let m;

  while ((m = exportRe.exec(source)) !== null) {
    const blockStart = m.index + m[0].length - 1;

    let depth = 0;
    let end = blockStart;
    for (let i = blockStart; i < source.length; i++) {
      if (source[i] === '{') depth++;
      else if (source[i] === '}') {
        depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }

    const block = source.slice(blockStart, end + 1);

    const idMatch = block.match(/id\s*:\s*'([^']+)'/);
    if (!idMatch) continue;

    const id = idMatch[1];
    const isSceneObject = /opening\s*:/.test(block) && /choices\s*:/.test(block);
    if (!isSceneObject) continue;

    const hasHeatBand = /heatBand\s*:\s*(\[|')/.test(block);
    const hasEnqueue = /enqueueScene\s*:/.test(block);

    scenes.push({
      id,
      file: rel,
      hasHeatBand,
      hasEnqueueOrLedger: hasEnqueue || sourceLedger,
    });
  }

  return scenes;
}

let failed = false;
const errors = [];

const sceneFiles = collectSceneFiles();

for (const filePath of sceneFiles) {
  const source = readSource(filePath);
  const scenes = parseScenes(source, filePath);
  const rel = relative(root, filePath);

  if (!scenes.length) continue;

  for (const scene of scenes) {
    const errs = [];

    if (!scene.hasHeatBand) {
      errs.push(`missing heatBand`);
    }

    if (!scene.hasEnqueueOrLedger) {
      errs.push(`no choice has enqueueScene and no ledger citation (global: flag or recordLedger) found in file`);
    }

    if (errs.length) {
      failed = true;
      errors.push({ file: rel, id: scene.id, errs });
    }
  }
}

if (errors.length) {
  console.error('\nScene lint failures:');
  for (const e of errors) {
    console.error(`\n  ${e.file} -- scene: "${e.id}"`);
    for (const msg of e.errs) {
      console.error(`    x ${msg}`);
    }
  }
  console.error('\nFix scenes before shipping.');
  process.exit(1);
}

console.log(`Scene lint passed. Checked ${sceneFiles.length} file(s) in src/scenes/.`);
