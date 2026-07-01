const BODY_SHAPES = {
  hourglass: { bust: 1, waist: 0.72, hip: 1.15, belly: 0.85 },
  pear: { bust: 0.85, waist: 0.8, hip: 1.35, belly: 0.95 },
  apple: { bust: 1.05, waist: 1.05, hip: 0.95, belly: 1.35 },
  athletic: { bust: 1, waist: 0.88, hip: 1.05, belly: 1.05 },
  willowy: { bust: 0.9, waist: 0.78, hip: 1.05, belly: 0.9 },
  compact: { bust: 1.05, waist: 1.05, hip: 1.15, belly: 1.15 },
};

function stageScale(stageIndex) {
  if (stageIndex <= 2) return 0.85 + stageIndex * 0.04;
  if (stageIndex <= 5) return 0.97 + (stageIndex - 2) * 0.05;
  if (stageIndex <= 8) return 1.12 + (stageIndex - 5) * 0.06;
  return 1.3 + (stageIndex - 8) * 0.08;
}

export function renderSilhouette(character, stageIndex) {
  const shape = BODY_SHAPES[character.bodyType] || BODY_SHAPES.hourglass;
  const scale = stageScale(stageIndex);
  const bust = 22 * shape.bust * scale;
  const waist = 14 * shape.waist * scale;
  const hip = 26 * shape.hip * scale;
  const belly = 8 * shape.belly * scale;
  const height = 120 + stageIndex * 4;

  return `
    <svg viewBox="0 0 80 ${height + 20}" class="mx-auto w-24" aria-hidden="true">
      <ellipse cx="40" cy="18" rx="11" ry="13" fill="currentColor" opacity="0.35"/>
      <path d="M ${40 - bust / 2} 32 Q ${40 - waist / 2} 52 ${40 - hip / 2} 72 L ${40 + hip / 2} 72 Q ${40 + waist / 2} 52 ${40 + bust / 2} 32 Z" fill="currentColor" opacity="0.5"/>
      <ellipse cx="40" cy="58" rx="${belly}" ry="${belly * 1.2}" fill="currentColor" opacity="0.25"/>
      <rect x="${40 - hip / 2 + 4}" y="72" width="${hip / 2 - 6}" height="${height - 72}" rx="6" fill="currentColor" opacity="0.4"/>
      <rect x="40" y="72" width="${hip / 2 - 6}" height="${height - 72}" rx="6" fill="currentColor" opacity="0.4"/>
    </svg>
  `;
}
