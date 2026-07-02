import { createTinyClinicStaff, defaultPreferences } from './characters.js';
import { shopItems } from './clinic.js';
import { defaultRoomLayout } from './rooms.js';
import { defaultRivalState } from './rival.js';
import { defaultClinicStyle } from './clinicStyle.js';
import { defaultRivalClinicState } from './rivalClinic.js';
import { ensurePatientAppearance } from './patientAppearance.js';
import { refreshRecruitmentOffers } from './recruitment.js';

export const SAVE_KEY = 'indulgecare-clinic-save-v6';
export const GAME_VERSION = 6;

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

function defaultStats() {
  return {
    arcBeatsCompleted: 0,
    patientsRecruited: 0,
    compoundsUsed: 0,
    wardrobeEvents: 0,
    relationshipBeats: 0,
    allInstallablesOwned: false,
    groupScenesPlayed: 0,
    chaptersCompleted: 0,
    loyaltyArcBeats: 0,
    rivalOpsActions: 0,
    earlyGainEvents: 0,
    visitCount: 0,
    scenesResolved: 0,
    interruptsHandled: 0,
  };
}

export function createNewGame(options = {}) {
  const rng = createRng(options.seed ?? Date.now());
  const staff = createTinyClinicStaff(rng);
  const patients = [];

  const game = {
    version: GAME_VERSION,
    clinicName: options.clinicName || 'Vale Family Medicine',
    doctorName: options.doctorName || 'Dr. Vale',
    week: 1,
    money: 2400,
    reputation: 8,
    actionPointsMax: 7,
    actionPoints: 7,
    rent: 420,
    salaries: 280,
    supplyCost: 95,
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
    achievements: { unlocked: [] },
    stats: defaultStats(),
    firedEvents: [],
    apSpentThisWeek: 0,
    weekConsultIncome: 0,
    log: [
      {
        id: 'welcome',
        week: 1,
        type: 'system',
        title: 'Lease signed',
        text: 'Strip-mall suite. One reception desk. Fluorescents hum. Your sign says primary care. Week one.',
      },
    ],
    thisWeek: [],
    lastResolution: null,
    pendingStageHighlights: [],
    rngSeed: rng.seed,
    rooms: defaultRoomLayout(),
    rivalState: { ...defaultRivalState(), reputation: 14, active: false },
    chapter: 1,
    chapterGoalsMet: [],
    clinicStyle: defaultClinicStyle(),
    relationshipHistory: [],
    pendingGroupScene: null,
    ngPlus: 0,
    ngPlusGain: 0,
    needsChallengePick: true,
    challengeWeek: null,
    audioMuted: false,
    rivalClinic: defaultRivalClinicState(),
    recruitment: { openSlotId: null, candidates: [], filledSlots: [] },
    coverRating: 100,
    heat: 0,
    sceneState: { resolved: [], weekInterrupt: null },
    globalFlags: [],
    gameOver: null,
  };

  refreshRecruitmentOffers(game, rng);
  return game;
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
  state.apSpentThisWeek = (state.apSpentThisWeek || 0) + 1;
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
  localStorage.removeItem('indulgecare-clinic-save-v1');
  localStorage.removeItem('indulgecare-clinic-save-v2');
  localStorage.removeItem('indulgecare-clinic-save-v3');
  localStorage.removeItem('indulgecare-clinic-save-v4');
  localStorage.removeItem('indulgecare-clinic-save-v5');
}

function migrateCharacter(c) {
  if (!c.preferences) c.preferences = defaultPreferences();
  if (!c.arc) c.arc = { completedBeats: [] };
  if (c.type === 'staff' && !c.arc.completedBeats) c.arc = { completedBeats: [] };
  if (c.type === 'staff' && !c.arcSlot) {
    const legacy = {
      'Maya Okafor': 'maya',
      'Elena Ruiz': 'elena',
      'Priya Shah': 'priya',
      'Nadia Volkov': 'nadia',
      'Jasmine Brooks': 'jasmine',
    };
    c.arcSlot = legacy[c.name] || null;
  }
  if (c.type === 'patient' && c.loyalty == null) c.loyalty = Math.min(3, c.visits || 0);
  if (c.type === 'patient' && !c.loyaltyArc) c.loyaltyArc = { completedBeats: [] };
  if (c.type === 'patient') ensurePatientAppearance(c);
  return c;
}

function normaliseState(raw) {
  const fresh = createNewGame();
  const merged = {
    ...fresh,
    ...raw,
    version: GAME_VERSION,
    inventory: { ...fresh.inventory, ...(raw.inventory || {}) },
  };

  merged.staff = (raw.staff?.length ? raw.staff : fresh.staff).map(migrateCharacter);
  merged.patients = (raw.patients?.length ? raw.patients : fresh.patients).map(migrateCharacter);
  merged.log = raw.log?.length ? raw.log : fresh.log;
  merged.pendingInstallations = raw.pendingInstallations || [];
  merged.ownedUpgrades = raw.ownedUpgrades || [];
  merged.thisWeek = raw.thisWeek || [];
  merged.archivedPatients = raw.archivedPatients || [];
  merged.achievements = raw.achievements || { unlocked: [] };
  merged.stats = { ...defaultStats(), ...(raw.stats || {}) };
  merged.firedEvents = raw.firedEvents || [];
  merged.apSpentThisWeek = raw.apSpentThisWeek || 0;
  merged.weekConsultIncome = raw.weekConsultIncome || 0;
  merged.pendingStageHighlights = raw.pendingStageHighlights || [];
  merged.actionPointsMax = raw.actionPointsMax || fresh.actionPointsMax;
  merged.actionPoints = Math.min(raw.actionPoints ?? fresh.actionPoints, merged.actionPointsMax);
  merged.rooms = raw.rooms || defaultRoomLayout();
  merged.rivalState = raw.rivalState || defaultRivalState();
  merged.chapter = raw.chapter || 1;
  merged.chapterGoalsMet = raw.chapterGoalsMet || [];
  merged.clinicStyle = raw.clinicStyle || defaultClinicStyle();
  merged.relationshipHistory = raw.relationshipHistory || [];
  merged.pendingGroupScene = raw.pendingGroupScene || null;
  merged.ngPlus = raw.ngPlus || 0;
  merged.ngPlusGain = raw.ngPlusGain || 0;
  merged.needsChallengePick = raw.needsChallengePick ?? !raw.challengeWeek;
  merged.challengeWeek = raw.challengeWeek || null;
  merged.audioMuted = raw.audioMuted ?? false;
  merged.rivalClinic = raw.rivalClinic || defaultRivalClinicState();
  merged.recruitment = raw.recruitment || { openSlotId: null, candidates: [], filledSlots: [] };
  merged.coverRating = raw.coverRating ?? 100;
  merged.heat = raw.heat ?? 0;
  merged.sceneState = raw.sceneState || { resolved: [], weekInterrupt: null };
  merged.globalFlags = raw.globalFlags || [];
  merged.gameOver = raw.gameOver || null;
  return merged;
}

export function loadGame() {
  let saved = localStorage.getItem(SAVE_KEY);
  if (!saved) saved = localStorage.getItem('indulgecare-clinic-save-v5');
  if (!saved) saved = localStorage.getItem('indulgecare-clinic-save-v4');
  if (!saved) saved = localStorage.getItem('indulgecare-clinic-save-v3');
  if (!saved) saved = localStorage.getItem('indulgecare-clinic-save-v2');
  if (!saved) saved = localStorage.getItem('indulgecare-clinic-save-v1');
  if (!saved) return null;
  gameState = normaliseState(JSON.parse(saved));
  saveGame(gameState);
  return gameState;
}

export function resetGame(options = {}) {
  gameState = createNewGame(options);
  saveGame(gameState);
  return gameState;
}

export function updateInstallableAchievement(state) {
  const installables = shopItems.filter((i) => i.install).map((i) => i.id);
  state.stats.allInstallablesOwned = installables.every((id) => state.ownedUpgrades.includes(id));
}
