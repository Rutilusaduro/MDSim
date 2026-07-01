import { createPatientRoster, createStartingStaff } from './characters.js';

export const SAVE_KEY = 'indulgecare-clinic-save-v1';

export function createRng(seed = Date.now()) {
  let value = Math.abs(Math.floor(seed)) % 2147483647;
  if (value === 0) value = 1;

  return {
    get seed() {
      return value;
    },
    next() {
      value = (value * 48271) % 2147483647;
      return value / 2147483647;
    },
    int(min, max) {
      return Math.floor(this.next() * (max - min + 1)) + min;
    },
    pick(items) {
      return items[this.int(0, items.length - 1)];
    },
    chance(percent) {
      return this.next() * 100 < percent;
    },
  };
}

export function createNewGame(options = {}) {
  const rng = createRng(options.seed ?? Date.now());
  const staff = createStartingStaff(rng);
  const patients = createPatientRoster(rng, 5);

  return {
    version: 1,
    clinicName: options.clinicName || 'IndulgeCare Clinic',
    doctorName: options.doctorName || 'Dr. Vale',
    week: 1,
    money: 4200,
    reputation: 22,
    actionPointsMax: 9,
    actionPoints: 9,
    rent: 725,
    salaries: 1420,
    supplyCost: 340,
    ownedUpgrades: [],
    pendingInstallations: [],
    inventory: {
      comfortBlend: 0,
      appetiteTonic: 0,
      recoveryShake: 0,
    },
    staff,
    patients,
    archivedPatients: [],
    log: [
      {
        id: 'welcome',
        week: 1,
        type: 'system',
        title: 'Grand opening',
        text: 'IndulgeCare Clinic opens its doors — polished floors, a competent staff, and a waiting room that already feels busy. Week one begins.',
      },
    ],
    thisWeek: [],
    lastResolution: null,
    rngSeed: rng.seed,
  };
}

export let gameState = createNewGame();

export function rngForState(state = gameState) {
  const rng = createRng(state.rngSeed);
  const wrap = {
    get seed() {
      return rng.seed;
    },
    next() {
      const value = rng.next();
      state.rngSeed = rng.seed;
      return value;
    },
    int(min, max) {
      return Math.floor(this.next() * (max - min + 1)) + min;
    },
    pick(items) {
      return items[this.int(0, items.length - 1)];
    },
    chance(percent) {
      return this.next() * 100 < percent;
    },
  };
  return wrap;
}

export function addLog(entry, state = gameState) {
  state.log.unshift({
    id: entry.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    week: state.week,
    type: entry.type || 'note',
    title: entry.title,
    text: entry.text,
  });
  state.log = state.log.slice(0, 80);
}

export function addWeekNote(entry, state = gameState) {
  state.thisWeek.unshift({
    id: entry.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type: entry.type || 'action',
    title: entry.title,
    text: entry.text,
  });
}

export function spendActionPoint(state = gameState) {
  if (state.actionPoints <= 0) return false;
  state.actionPoints -= 1;
  return true;
}

export function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function saveGame(state = gameState) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function normaliseState(raw) {
  const fresh = createNewGame();
  const merged = {
    ...fresh,
    ...raw,
    inventory: { ...fresh.inventory, ...(raw.inventory || {}) },
  };

  merged.staff = raw.staff?.length ? raw.staff : fresh.staff;
  merged.patients = raw.patients?.length ? raw.patients : fresh.patients;
  merged.log = raw.log?.length ? raw.log : fresh.log;
  merged.pendingInstallations = raw.pendingInstallations || [];
  merged.ownedUpgrades = raw.ownedUpgrades || [];
  merged.thisWeek = raw.thisWeek || [];
  merged.archivedPatients = raw.archivedPatients || [];
  merged.actionPointsMax = raw.actionPointsMax || fresh.actionPointsMax;
  merged.actionPoints = Math.min(raw.actionPoints ?? fresh.actionPoints, merged.actionPointsMax);
  return merged;
}

export function loadGame() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (!saved) return null;
  gameState = normaliseState(JSON.parse(saved));
  return gameState;
}

export function resetGame(options = {}) {
  gameState = createNewGame(options);
  saveGame(gameState);
  return gameState;
}
