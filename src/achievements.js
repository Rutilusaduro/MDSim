import { getStageIndex } from './characters.js';

export const ACHIEVEMENTS = [
  { id: 'first_week', name: 'Doors Open', desc: 'Complete your first week.', check: (s) => s.week >= 2 },
  { id: 'first_stage', name: 'First Bloom', desc: 'Any character reaches stage 4+.', check: (s, ctx) => ctx.maxStage >= 3 },
  { id: 'first_arc', name: 'Private Story', desc: 'Complete an arc beat.', check: (s) => s.stats?.arcBeatsCompleted >= 1 },
  { id: 'recruit_one', name: 'New Hire', desc: 'Recruit a patient to staff.', check: (s) => s.stats?.patientsRecruited >= 1 },
  { id: 'staff_six', name: 'Full Bench', desc: 'Employ 6 or more staff.', check: (s) => s.staff.length >= 6 },
  { id: 'tier_two', name: 'Neighborhood Name', desc: 'Reach Trusted Neighborhood tier.', check: (s) => s.reputation >= 32 },
  { id: 'tier_four', name: 'City Whisper', desc: 'Reach Renowned tier.', check: (s) => s.reputation >= 70 },
  { id: 'big_week_staff', name: 'Heavy Shift', desc: 'Staff gain 15+ lb in one week.', check: (s, ctx) => ctx.staffGainWeek >= 15 },
  { id: 'devoted_voice', name: 'No Filter', desc: 'Any character hits devoted attitude.', check: (s, ctx) => ctx.hasDevoted },
  { id: 'shop_full', name: 'Fully Stocked', desc: 'Own all installable upgrades.', check: (s) => s.stats?.allInstallablesOwned },
  { id: 'compound_user', name: 'Pharmacy Open', desc: 'Use 10 compounds total.', check: (s) => s.stats?.compoundsUsed >= 10 },
  { id: 'rich_clinic', name: 'In the Black', desc: 'Hold $8,000+ after week end.', check: (s) => s.money >= 8000 },
  { id: 'wardrobe_crisis', name: 'Button Pop', desc: 'Trigger a wardrobe strain event.', check: (s) => s.stats?.wardrobeEvents >= 1 },
  { id: 'relationship_spark', name: 'Office Tension', desc: 'Witness a staff relationship beat.', check: (s) => s.stats?.relationshipBeats >= 1 },
  { id: 'perfect_ap', name: 'Clean Week', desc: 'Spend every AP in a week.', check: (s, ctx) => ctx.perfectApWeek },
  { id: 'chapter_one', name: 'Soft Opening', desc: 'Complete Chapter 1.', check: (s) => (s.chapterGoalsMet || []).includes('chapter_1') },
  { id: 'rival_win', name: 'Annex Silenced', desc: 'Defeat ThriveWell Annex.', check: (s) => s.rivalState?.defeated },
  { id: 'group_scene', name: 'Crowd Scene', desc: 'Play a group scene.', check: (s) => (s.stats?.groupScenesPlayed || 0) >= 1 },
];

export function ensureAchievementState(state) {
  if (!state.achievements) state.achievements = { unlocked: [] };
  if (!state.stats) {
    state.stats = {
      arcBeatsCompleted: 0,
      patientsRecruited: 0,
      compoundsUsed: 0,
      wardrobeEvents: 0,
      relationshipBeats: 0,
      allInstallablesOwned: false,
    };
  }
}

export function buildAchievementContext(state, weekContext = {}) {
  const allChars = [...state.staff, ...state.patients];
  let maxStage = 0;
  for (const c of allChars) {
    const stage = getStageIndex(c);
    if (stage > maxStage) maxStage = stage;
  }
  return {
    maxStage,
    hasDevoted: weekContext.hasDevoted || false,
    staffGainWeek: weekContext.staffGainWeek || 0,
    perfectApWeek: weekContext.perfectApWeek || false,
  };
}

export function checkAchievements(state, context = {}) {
  ensureAchievementState(state);
  const ctx = buildAchievementContext(state, context);
  const newlyUnlocked = [];

  for (const ach of ACHIEVEMENTS) {
    if (state.achievements.unlocked.includes(ach.id)) continue;
    if (ach.check(state, ctx)) {
      state.achievements.unlocked.push(ach.id);
      newlyUnlocked.push(ach);
    }
  }
  return newlyUnlocked;
}

export function getAchievementProgress(state) {
  ensureAchievementState(state);
  return {
    unlocked: state.achievements.unlocked.length,
    total: ACHIEVEMENTS.length,
    list: ACHIEVEMENTS.map((a) => ({
      ...a,
      done: state.achievements.unlocked.includes(a.id),
    })),
  };
}
