export const STAFF_RELATION_EDGES = [
  { fromArcSlot: 'elena', toArcSlot: 'maya', type: 'admires', note: 'The receptionist watches the nurse eat without guilt.' },
  { fromArcSlot: 'maya', toArcSlot: 'elena', type: 'admires', note: 'The nurse likes how the receptionist owns the lobby.' },
  { fromArcSlot: 'priya', toArcSlot: 'nadia', type: 'envies', note: 'The PA tracks the manager\'s lunch log.' },
  { fromArcSlot: 'nadia', toArcSlot: 'priya', type: 'admires', note: 'The manager respects the PA\'s clinical honesty.' },
  { fromArcSlot: 'jasmine', toArcSlot: 'maya', type: 'envies', note: 'The phlebotomist wants the nurse\'s break room stamina.' },
  { fromArcSlot: 'maya', toArcSlot: 'jasmine', type: 'admires', note: 'The nurse thinks the phlebotomist is fearless with pastry.' },
];

export function ensureRelationships(state) {
  if (!state.relationshipHistory) state.relationshipHistory = [];
}

export function getRelationshipWeb(state) {
  ensureRelationships(state);
  const staffBySlot = Object.fromEntries(state.staff.filter((s) => s.arcSlot).map((s) => [s.arcSlot, s]));

  const edges = STAFF_RELATION_EDGES.filter((e) => staffBySlot[e.fromArcSlot] && staffBySlot[e.toArcSlot]).map((e) => ({
    from: staffBySlot[e.fromArcSlot].name,
    to: staffBySlot[e.toArcSlot].name,
    type: e.type,
    note: e.note,
    fromChar: staffBySlot[e.fromArcSlot],
    toChar: staffBySlot[e.toArcSlot],
    history: state.relationshipHistory.filter(
      (h) => h.edgeKey === `${staffBySlot[e.fromArcSlot].name}_${staffBySlot[e.toArcSlot].name}`,
    ),
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

export function renderRelationshipGraphSvg(state, width = 480, height = 320) {
  const edges = getRelationshipWeb(state);
  const names = [...new Set(edges.flatMap((e) => [e.from, e.to]))];
  const nodes = names.map((name, i) => {
    const angle = (i / Math.max(names.length, 1)) * Math.PI * 2 - Math.PI / 2;
    const r = Math.min(width, height) * 0.32;
    return {
      name,
      x: width / 2 + Math.cos(angle) * r,
      y: height / 2 + Math.sin(angle) * r,
    };
  });
  const byName = Object.fromEntries(nodes.map((n) => [n.name, n]));

  const edgeLines = edges
    .map((e) => {
      const a = byName[e.from];
      const b = byName[e.to];
      if (!a || !b) return '';
      const color = e.type === 'admires' ? '#6ee7b7' : '#f9a8d4';
      return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${color}" stroke-width="2" opacity="0.55"/>`;
    })
    .join('');

  const nodeDots = nodes
    .map(
      (n) => `
    <circle cx="${n.x}" cy="${n.y}" r="18" fill="#1c1917" stroke="#fbbf24" stroke-width="1.5"/>
    <text x="${n.x}" y="${n.y + 28}" text-anchor="middle" fill="#d6d3d1" font-size="9">${n.name.split(' ')[0]}</text>
  `,
    )
    .join('');

  return `<svg viewBox="0 0 ${width} ${height}" class="mx-auto w-full max-w-lg" aria-label="Relationship graph">${edgeLines}${nodeDots}</svg>`;
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
