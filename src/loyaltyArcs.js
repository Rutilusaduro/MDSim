const LOYALTY_BEAT_TEMPLATES = [
  {
    id: 0,
    loyaltyMin: 2,
    visitsMin: 2,
    title: 'Second Visit Smile',
    text: (name) =>
      `${name} books again without prompting. She mentions the chairs. You mention the menu. Both of you mean it.`,
  },
  {
    id: 1,
    loyaltyMin: 5,
    visitsMin: 4,
    title: 'Regular Status',
    text: (name) =>
      `${name} asks if you have a regular tray. You do now. She finishes it in the lobby where everyone can see.`,
  },
  {
    id: 2,
    loyaltyMin: 8,
    visitsMin: 6,
    title: 'Recruit Ready',
    text: (name) =>
      `${name} jokes she should work here. The joke lands soft. She is not entirely joking. Recruitment costs drop if you offer.`,
  },
];

export function buildLoyaltyArc(patient) {
  const first = patient.name.split(' ')[0];
  return {
    title: `${first}'s Return Arc`,
    beats: LOYALTY_BEAT_TEMPLATES.map((t) => ({
      ...t,
      title: t.title,
      text: t.text(patient.name),
    })),
  };
}

export function getLoyaltyArcProgress(patient) {
  if (patient.type !== 'patient') return null;
  const track = buildLoyaltyArc(patient);
  const completed = patient.loyaltyArc?.completedBeats || [];
  const nextBeat = track.beats.find((b) => !completed.includes(b.id));
  return {
    track,
    completed: completed.length,
    total: track.beats.length,
    nextBeat,
    done: completed.length >= track.beats.length,
  };
}

export function canAdvanceLoyaltyArc(patient) {
  const progress = getLoyaltyArcProgress(patient);
  if (!progress || progress.done || !progress.nextBeat) {
    return { ok: false, reason: 'Loyalty arc complete or unavailable.' };
  }
  const beat = progress.nextBeat;
  if ((patient.loyalty || 0) < beat.loyaltyMin) {
    return { ok: false, reason: `Need loyalty ${beat.loyaltyMin}+` };
  }
  if ((patient.visits || 0) < beat.visitsMin) {
    return { ok: false, reason: `Need ${beat.visitsMin}+ visits` };
  }
  return { ok: true, beat };
}

export function advanceLoyaltyArc(patient, state) {
  const check = canAdvanceLoyaltyArc(patient);
  if (!check.ok) return check;
  if (!patient.loyaltyArc) patient.loyaltyArc = { completedBeats: [] };
  patient.loyaltyArc.completedBeats.push(check.beat.id);
  patient.trust += 0.4;
  patient.openness += 3;
  patient.weeklyMomentum += 0.5;
  if (state?.stats) {
    state.stats.loyaltyArcBeats = (state.stats.loyaltyArcBeats || 0) + 1;
  }
  return { ok: true, beat: check.beat, text: check.beat.text };
}

export function loyaltyRecruitVisitShortcut(patient) {
  const done = patient.loyaltyArc?.completedBeats?.length || 0;
  if (done >= 3) return 2;
  if (done >= 2) return 1;
  return 0;
}
