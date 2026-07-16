/**
 * Sample-based audio: small synthesized foley WAVs in public/audio/,
 * decoded lazily on first use. Oscillator stubs are gone.
 */

let audioCtx = null;
let muted = false;
const buffers = new Map();
const pending = new Map();

const VOLUME = {
  tick: 0.5,
  'scale-clunk': 0.9,
  'pen-scratch': 0.7,
  'folder-open': 0.7,
  'folder-close': 0.7,
  'page-turn': 0.7,
  'week-close': 0.8,
  stamp: 0.8,
  'stage-swell': 0.8,
};

function ctx() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

function baseUrl() {
  try {
    return import.meta.env?.BASE_URL || '/';
  } catch {
    return '/';
  }
}

async function loadBuffer(name) {
  if (buffers.has(name)) return buffers.get(name);
  if (pending.has(name)) return pending.get(name);
  const ac = ctx();
  if (!ac) return null;
  const promise = fetch(`${baseUrl()}audio/${name}.wav`)
    .then((res) => (res.ok ? res.arrayBuffer() : Promise.reject(new Error(`audio ${name}`))))
    .then((data) => ac.decodeAudioData(data))
    .then((buffer) => {
      buffers.set(name, buffer);
      return buffer;
    })
    .catch(() => null);
  pending.set(name, promise);
  return promise;
}

function play(name) {
  if (muted) return;
  const ac = ctx();
  if (!ac) return;
  if (ac.state === 'suspended') ac.resume().catch(() => {});
  loadBuffer(name).then((buffer) => {
    if (!buffer || muted) return;
    const source = ac.createBufferSource();
    const gain = ac.createGain();
    gain.gain.value = VOLUME[name] ?? 0.7;
    source.buffer = buffer;
    source.connect(gain);
    gain.connect(ac.destination);
    source.start();
  });
}

export function initAudio(state) {
  muted = state.audioMuted === true;
}

export function isAudioMuted() {
  return muted;
}

export function setAudioMuted(state, value) {
  muted = value;
  state.audioMuted = value;
}

export function toggleAudioMuted(state) {
  setAudioMuted(state, !muted);
  return muted;
}

export function playUiClick() {
  play('tick');
}

export function playWeekEnd() {
  play('week-close');
}

export function playStageUp() {
  play('stage-swell');
}

export function playPurchase() {
  play('stamp');
}

export function playScaleClunk() {
  play('scale-clunk');
}

export function playPenScratch() {
  play('pen-scratch');
}

export function playPageTurn() {
  play('page-turn');
}

export function playFolderOpen() {
  play('folder-open');
}

export function playFolderClose() {
  play('folder-close');
}
