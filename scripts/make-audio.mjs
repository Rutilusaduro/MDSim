/**
 * Generate the foley set as small mono 16-bit WAVs in public/audio/.
 * Synthesized in-repo: no licensing questions, regenerate anytime.
 * Usage: node scripts/make-audio.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'audio');
mkdirSync(outDir, { recursive: true });

const RATE = 22050;

function wav(samples) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(RATE, 24);
  buf.writeUInt32LE(RATE * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i += 1) {
    buf.writeInt16LE(Math.max(-1, Math.min(1, samples[i])) * 32767, 44 + i * 2);
  }
  return buf;
}

const sec = (s) => Math.floor(RATE * s);
let seedState = 48271;
const rand = () => {
  seedState = (seedState * 48271) % 2147483647;
  return seedState / 2147483647 - 0.5;
};

/** One-pole lowpass on white noise: paper and cloth textures. */
function noise(length, { lp = 0.2, decay = 6, gain = 0.5, attack = 0.005 } = {}) {
  const out = new Array(length);
  let y = 0;
  for (let i = 0; i < length; i += 1) {
    const t = i / RATE;
    y += lp * (rand() * 2 - y);
    const env = Math.min(1, t / attack) * Math.exp(-decay * t);
    out[i] = y * env * gain;
  }
  return out;
}

/** Damped sine thump. */
function thump(length, { freq = 90, decay = 18, gain = 0.7, drift = -30 } = {}) {
  const out = new Array(length);
  let phase = 0;
  for (let i = 0; i < length; i += 1) {
    const t = i / RATE;
    phase += ((freq + drift * t) * 2 * Math.PI) / RATE;
    out[i] = Math.sin(phase) * Math.exp(-decay * t) * gain;
  }
  return out;
}

function mix(...layers) {
  const length = Math.max(...layers.map((l) => l.length));
  const out = new Array(length).fill(0);
  for (const layer of layers) {
    for (let i = 0; i < layer.length; i += 1) out[i] += layer[i];
  }
  return out;
}

function tone(length, freq, { decay = 3, gain = 0.25, delay = 0 } = {}) {
  const out = new Array(length).fill(0);
  const start = sec(delay);
  for (let i = start; i < length; i += 1) {
    const t = (i - start) / RATE;
    out[i] = Math.sin((freq * 2 * Math.PI * (i - start)) / RATE) * Math.exp(-decay * t) * gain;
  }
  return out;
}

const files = {
  // the scale takes her weight
  'scale-clunk': mix(thump(sec(0.35), { freq: 70, decay: 14, gain: 0.8 }), noise(sec(0.06), { lp: 0.5, decay: 60, gain: 0.25 })),
  // pen on the chart line
  'pen-scratch': noise(sec(0.28), { lp: 0.65, decay: 12, gain: 0.3, attack: 0.02 }),
  // a chart folder opens / closes
  'folder-open': mix(noise(sec(0.18), { lp: 0.4, decay: 22, gain: 0.35 }), thump(sec(0.12), { freq: 140, decay: 40, gain: 0.2 })),
  'folder-close': mix(thump(sec(0.16), { freq: 110, decay: 30, gain: 0.5 }), noise(sec(0.1), { lp: 0.45, decay: 40, gain: 0.2 })),
  // page turn for scenes and the week
  'page-turn': noise(sec(0.4), { lp: 0.3, decay: 8, gain: 0.32, attack: 0.06 }),
  // week-end close: soft two-note chime over a page
  'week-close': mix(tone(sec(0.9), 392, { decay: 4, gain: 0.18 }), tone(sec(0.9), 523.25, { decay: 4, gain: 0.15, delay: 0.12 }), noise(sec(0.35), { lp: 0.3, decay: 9, gain: 0.18, attack: 0.05 })),
  // purchase / achievement stamp
  stamp: mix(thump(sec(0.14), { freq: 180, decay: 45, gain: 0.55 }), noise(sec(0.05), { lp: 0.6, decay: 80, gain: 0.2 })),
  // stage-up swell: three rising soft tones
  'stage-swell': mix(tone(sec(1.1), 262, { decay: 3.2, gain: 0.14 }), tone(sec(1.1), 330, { decay: 3.2, gain: 0.13, delay: 0.1 }), tone(sec(1.1), 392, { decay: 3, gain: 0.13, delay: 0.22 })),
  // small ui tick
  tick: mix(thump(sec(0.05), { freq: 660, decay: 90, gain: 0.12 })),
};

let total = 0;
for (const [name, samples] of Object.entries(files)) {
  const data = wav(samples);
  writeFileSync(join(outDir, `${name}.wav`), data);
  total += data.length;
  console.log(`${name}.wav  ${(data.length / 1024).toFixed(1)} kB`);
}
console.log(`total ${(total / 1024).toFixed(1)} kB`);
