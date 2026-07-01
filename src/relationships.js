export const STAFF_RELATION_EDGES = [
  { from: 'Elena Ruiz', to: 'Maya Okafor', type: 'admires', note: 'Elena watches Maya eat without guilt.' },
  { from: 'Maya Okafor', to: 'Elena Ruiz', type: 'admires', note: 'Maya likes how Elena owns the lobby.' },
  { from: 'Priya Shah', to: 'Nadia Volkov', type: 'envies', note: 'Priya tracks Nadia\'s lunch log.' },
  { from: 'Nadia Volkov', to: 'Priya Shah', type: 'admires', note: 'Nadia respects Priya\'s clinical honesty.' },
  { from: 'Jasmine Brooks', to: 'Maya Okafor', type: 'envies', note: 'Jasmine wants Maya\'s break room stamina.' },
  { from: 'Maya Okafor', to: 'Jasmine Brooks', type: 'admires', note: 'Maya thinks Jasmine is fearless with pastry.' },
];

export function ensureRelationships(state) {
  if (!state.relationshipHistory) state.relationshipHistory = [];
}

export function getRelationshipWeb(state) {
  ensureRelationships(state);
  const staffByName = Object.fromEntries(state.staff.map((s) => [s.name, s]));

  const edges = STAFF_RELATION_EDGES.filter((e) => staffByName[e.from] && staffByName[e.to]).map((e) => ({
    ...e,
    fromChar: staffByName[e.from],
    toChar: staffByName[e.to],
    history: state.relationshipHistory.filter((h) => h.edgeKey === `${e.from}_${e.to}`),
  }));

  const procedural = [];
  for (let i = 0; i < state.staff.length; i++) {
    for (let j = i + 1; j < state.staff.length; j++) {
      const a = state.staff[i];
      const b = state.staff[j];
      const named = edges.some((e) => (e.from === a.name && e.to === b.name) || (e.from === b.name && e.to === a.name));
      if (named) continue;
      const type = (a.id.charCodeAt(0) + b.id.charCodeAt(0)) % 2 === 0 ? 'admires' : 'envies';
      procedural.push({
        from: a.name,
        to: b.name,
        type,
        note: type === 'admires' ? `${a.name.split(' ')[0]} watches ${b.name.split(' ')[0]} with interest.` : `${a.name.split(' ')[0]} quietly competes with ${b.name.split(' ')[0]}.`,
        fromChar: a,
        toChar: b,
        history: state.relationshipHistory.filter((h) => h.edgeKey === `${a.name}_${b.name}`),
      });
    }
  }

  return [...edges, ...procedural];
}

export function recordRelationshipBeat(state, beat) {
  ensureRelationships(state);
  const key = beat.pair.join('_');
  state.relationshipHistory.push({
    edgeKey: key,
    beatId: beat.id,
    title: beat.title,
    week: state.week,
    text: beat.text,
  });
  state.relationshipHistory = state.relationshipHistory.slice(0, 40);
}
