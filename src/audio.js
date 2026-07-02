let audioCtx = null;
let muted = false;

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

function tone(freq, duration = 0.08, type = 'sine', gain = 0.04) {
  const ac = ctx();
  if (!ac || muted) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g);
  g.connect(ac.destination);
  osc.start();
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
  osc.stop(ac.currentTime + duration);
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
  tone(520, 0.05, 'triangle', 0.03);
}

export function playWeekEnd() {
  tone(330, 0.12, 'sine', 0.035);
  setTimeout(() => tone(440, 0.15, 'sine', 0.035), 80);
}

export function playStageUp() {
  tone(262, 0.1, 'sine', 0.04);
  setTimeout(() => tone(392, 0.14, 'sine', 0.04), 70);
  setTimeout(() => tone(523, 0.18, 'sine', 0.035), 150);
}

export function playPurchase() {
  tone(600, 0.06, 'square', 0.02);
}
