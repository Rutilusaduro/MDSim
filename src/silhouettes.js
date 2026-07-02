import { weightStageNames } from './characters.js';

const BODY_SHAPES = {
  hourglass: { bust: 1, waist: 0.72, hip: 1.15, belly: 0.85 },
  pear: { bust: 0.85, waist: 0.8, hip: 1.35, belly: 0.95 },
  apple: { bust: 1.05, waist: 1.05, hip: 0.95, belly: 1.35 },
  athletic: { bust: 1, waist: 0.88, hip: 1.05, belly: 1.05 },
  willowy: { bust: 0.9, waist: 0.78, hip: 1.05, belly: 0.9 },
  compact: { bust: 1.05, waist: 1.05, hip: 1.15, belly: 1.15 },
};

const WEIGHT_SCALE_MIN = 350;
const WEIGHT_SCALE_MAX = 2400;

function weightSpan(weight, floor = WEIGHT_SCALE_MIN, ceiling = WEIGHT_SCALE_MAX) {
  return Math.max(0, Math.min(1, (weight - floor) / (ceiling - floor)));
}

/** Scale factor for 12 stages (0–11); weight interpolation from 350 lb upward. */
function stageScale(stageIndex, weight = 0) {
  if (stageIndex <= 1) return 0.85 + stageIndex * 0.04;
  if (stageIndex <= 3) return 0.93 + (stageIndex - 1) * 0.05;
  if (stageIndex <= 5) return 1.08 + (stageIndex - 3) * 0.06;
  if (stageIndex <= 8) {
    const base = 1.2 + (stageIndex - 5) * 0.07;
    const span = weightSpan(weight);
    return base + span * 0.12;
  }
  if (stageIndex === 9) {
    const span = weightSpan(weight, 540);
    return 1.41 + span * 0.14;
  }
  if (stageIndex === 10) {
    const span = weightSpan(weight, 920);
    return 1.62 + span * 0.38;
  }
  const span = weightSpan(weight, 1250);
  return 1.95 + span * 0.55;
}

function standingHeight(stageIndex, weight) {
  const base = 120 + stageIndex * 3;
  if (stageIndex >= 6) {
    const span = weightSpan(weight);
    return base + span * 28;
  }
  return base;
}

function stageLabel(stageIndex) {
  return weightStageNames[stageIndex] || `Stage ${stageIndex + 1}`;
}

function renderStandingSilhouette(shape, scale, stageIndex, weight, ghost) {
  const bust = 22 * shape.bust * scale;
  const waist = 14 * shape.waist * scale;
  const hip = 26 * shape.hip * scale;
  const belly = 8 * shape.belly * scale;
  const height = standingHeight(stageIndex, weight);
  const legH = height - 72;
  const legW = Math.max(4, hip / 2 - 6);

  return `
    <svg viewBox="0 0 80 ${height + 20}" class="mx-auto w-24" aria-hidden="true">
      <ellipse cx="40" cy="18" rx="11" ry="13" fill="currentColor" opacity="0.35"/>
      <path d="M ${40 - bust / 2} 32 Q ${40 - waist / 2} 52 ${40 - hip / 2} 72 L ${40 + hip / 2} 72 Q ${40 + waist / 2} 52 ${40 + bust / 2} 32 Z" fill="currentColor" opacity="0.5"/>
      <ellipse cx="40" cy="58" rx="${belly}" ry="${belly * 1.2}" fill="currentColor" opacity="0.25"/>
      <rect x="${40 - hip / 2 + 4}" y="72" width="${legW}" height="${legH}" rx="6" fill="currentColor" opacity="0.4"/>
      <rect x="40" y="72" width="${legW}" height="${legH}" rx="6" fill="currentColor" opacity="0.4"/>
    </svg>
  `;
}

/** Stage 10: seated immobile — wide profile, shortened legs, belly spill. */
function renderImmobileSilhouette(shape, scale, weight, ghost) {
  const span = weightSpan(weight, 920);
  const bust = 20 * shape.bust * scale;
  const hip = 34 * shape.hip * scale;
  const bellyW = 14 * shape.belly * scale * (1 + span * 0.25);
  const bellyH = 18 * shape.belly * scale * (1 + span * 0.35);
  const seatY = 58;
  const legH = 10 + span * 4;
  const legW = Math.max(5, hip / 5);
  const viewH = 100;

  return `
    <svg viewBox="0 0 80 ${viewH}" class="mx-auto w-24" aria-hidden="true">
      <ellipse cx="40" cy="16" rx="12" ry="11" fill="currentColor" opacity="0.35"/>
      <path d="M ${40 - bust / 2} 28 Q ${40 - bust / 3} 42 ${40 - hip / 2} ${seatY} L ${40 + hip / 2} ${seatY} Q ${40 + bust / 3} 42 ${40 + bust / 2} 28 Z" fill="currentColor" opacity="0.5"/>
      <ellipse cx="40" cy="${seatY + 6}" rx="${bellyW}" ry="${bellyH}" fill="currentColor" opacity="0.3"/>
      <ellipse cx="40" cy="${seatY + bellyH * 0.55}" rx="${bellyW * 0.92}" ry="${bellyH * 0.45}" fill="currentColor" opacity="0.2"/>
      <rect x="${40 - hip / 2 + 6}" y="${seatY + 4}" width="${legW}" height="${legH}" rx="4" fill="currentColor" opacity="0.35"/>
      <rect x="${40 + hip / 2 - legW - 6}" y="${seatY + 4}" width="${legW}" height="${legH}" rx="4" fill="currentColor" opacity="0.35"/>
      <ellipse cx="40" cy="${seatY + legH + 6}" rx="${hip / 2.2}" ry="5" fill="currentColor" opacity="0.25"/>
    </svg>
  `;
}

/** Stage 11: bedbound blob — mound shape, minimal limbs, widest profile. */
function renderBlobSilhouette(shape, scale, weight, ghost) {
  const span = weightSpan(weight, 1250);
  const moundW = 36 * shape.hip * scale * (0.95 + span * 0.12);
  const moundH = 28 * shape.belly * scale * (0.9 + span * 0.2);
  const headRx = 10 + span * 2;
  const headRy = 8 + span * 1.5;
  const viewH = 88;

  return `
    <svg viewBox="0 0 80 ${viewH}" class="mx-auto w-28" aria-hidden="true">
      <ellipse cx="40" cy="${moundH * 0.55 + 14}" rx="${moundW / 2}" ry="${moundH / 2}" fill="currentColor" opacity="0.45"/>
      <ellipse cx="40" cy="${moundH * 0.62 + 12}" rx="${moundW / 2.3}" ry="${moundH / 2.8}" fill="currentColor" opacity="0.3"/>
      <ellipse cx="40" cy="14" rx="${headRx}" ry="${headRy}" fill="currentColor" opacity="0.35"/>
      <ellipse cx="${40 - moundW / 4}" cy="${moundH * 0.7 + 10}" rx="3" ry="2" fill="currentColor" opacity="0.2"/>
      <ellipse cx="${40 + moundW / 4}" cy="${moundH * 0.7 + 10}" rx="3" ry="2" fill="currentColor" opacity="0.2"/>
    </svg>
  `;
}

export function renderSilhouette(character, stageIndex, options = {}) {
  const shape = BODY_SHAPES[character.bodyType] || BODY_SHAPES.hourglass;
  const weight = character.weight || 0;
  const scale = stageScale(stageIndex, weight);
  const ghost = options.ghost ? 'opacity-35' : '';
  const labelText = options.label ?? '';
  const label = labelText ? `<p class="text-center text-xs text-stone-400">${labelText}</p>` : '';

  let svg;
  if (stageIndex >= 11) {
    svg = renderBlobSilhouette(shape, scale, weight, ghost);
  } else if (stageIndex >= 10) {
    svg = renderImmobileSilhouette(shape, scale, weight, ghost);
  } else {
    svg = renderStandingSilhouette(shape, scale, stageIndex, weight, ghost);
  }

  return `
    <div class="${ghost}">
      ${label}
      ${svg}
    </div>
  `;
}

export function renderSilhouetteCompare(character, oldStage, newStage) {
  return `
    <div class="flex items-end justify-center gap-6 text-pink-300">
      ${renderSilhouette(character, oldStage, { ghost: true, label: stageLabel(oldStage) })}
      <span class="text-stone-500">→</span>
      ${renderSilhouette(character, newStage, { label: stageLabel(newStage) })}
    </div>
  `;
}
