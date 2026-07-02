export const CHAPTERS = [
  {
    id: 1,
    name: 'Soft Opening',
    tagline: 'Prove the clinic can indulge without chaos.',
    goals: [
      { id: 'week', label: 'Reach week 8', check: (s) => s.week >= 8 },
      { id: 'rep', label: 'Reputation 32+ (Trusted Neighborhood)', check: (s) => s.reputation >= 32 },
      { id: 'arc', label: 'Complete 1 staff arc beat', check: (s) => (s.stats?.arcBeatsCompleted || 0) >= 1 },
    ],
    reward: { money: 500, reputation: 2 },
  },
  {
    id: 2,
    name: 'Word Spreads',
    tagline: 'Outshine the annex. Grow the roster.',
    goals: [
      { id: 'week', label: 'Reach week 14', check: (s) => s.week >= 14 },
      { id: 'rep', label: 'Reputation 48+ (Beloved Local)', check: (s) => s.reputation >= 48 },
      { id: 'recruit', label: 'Recruit 1 patient to staff', check: (s) => (s.stats?.patientsRecruited || 0) >= 1 },
      { id: 'rival', label: 'Defeat ThriveWell Annex', check: (s) => s.rivalState?.defeated },
    ],
    reward: { money: 1200, reputation: 4, unlockNgPlus: true },
  },
  {
    id: 3,
    name: 'City Whisper',
    tagline: 'Become the name everyone repeats.',
    goals: [
      { id: 'week', label: 'Reach week 20', check: (s) => s.week >= 20 },
      { id: 'rep', label: 'Reputation 70+ (Renowned)', check: (s) => s.reputation >= 70 },
      { id: 'loyalty', label: 'Complete 2 patient loyalty arcs', check: (s) => (s.stats?.loyaltyArcBeats || 0) >= 6 },
      { id: 'rival_ops', label: 'Complete Annex ops arc', check: (s) => s.rivalClinic?.complete },
    ],
    reward: { money: 2000, reputation: 6 },
  },
];

export function ensureChapter(state) {
  if (state.chapter == null) state.chapter = 1;
  if (!state.chapterGoalsMet) state.chapterGoalsMet = [];
}

export function getChapterInfo(state) {
  ensureChapter(state);
  const idx = Math.min(state.chapter - 1, CHAPTERS.length - 1);
  const chapter = CHAPTERS[idx];
  const goals = chapter.goals.map((g) => ({
    ...g,
    done: g.check(state),
  }));
  const complete = goals.every((g) => g.done);
  return {
    chapter,
    index: state.chapter,
    goals,
    complete,
    allDone: state.chapter > CHAPTERS.length,
  };
}

export function checkChapterAdvance(state) {
  ensureChapter(state);
  if (state.chapter > CHAPTERS.length) return null;

  const info = getChapterInfo(state);
  if (!info.complete) return null;

  const key = `chapter_${info.chapter.id}`;
  if (state.chapterGoalsMet.includes(key)) return null;

  state.chapterGoalsMet.push(key);
  const reward = info.chapter.reward;
  state.money += reward.money || 0;
  state.reputation += reward.reputation || 0;
  state.chapter += 1;

  return {
    completed: info.chapter,
    reward,
    next: CHAPTERS[state.chapter - 1] || null,
  };
}

export function isCampaignComplete(state) {
  ensureChapter(state);
  return state.chapter > CHAPTERS.length;
}
