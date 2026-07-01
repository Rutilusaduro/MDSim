/**
 * Side-profile female silhouettes — single filled SVG path, facing left.
 * Body type shapes bust, belly, seat, and thigh mass; stage scales overall fullness.
 */

const BODY_PROFILES = {
  hourglass: { bust: 1.08, waist: 0.78, belly: 0.9, seat: 1.14, thigh: 1.06 },
  pear: { bust: 0.84, waist: 0.9, belly: 0.94, seat: 1.32, thigh: 1.24 },
  apple: { bust: 1.0, waist: 1.04, belly: 1.34, seat: 0.98, thigh: 1.1 },
  athletic: { bust: 0.98, waist: 0.88, belly: 0.96, seat: 1.06, thigh: 1.16 },
  willowy: { bust: 0.88, waist: 0.76, belly: 0.84, seat: 0.94, thigh: 0.92 },
  compact: { bust: 1.04, waist: 1.0, belly: 1.1, seat: 1.16, thigh: 1.14 },
};

function stageScale(stageIndex, weight = 0) {
  if (stageIndex <= 1) return 0.86 + stageIndex * 0.05;
  if (stageIndex <= 3) return 0.96 + (stageIndex - 1) * 0.06;
  if (stageIndex <= 5) return 1.14 + (stageIndex - 3) * 0.08;
  if (stageIndex >= 6) {
    const span = Math.max(0, Math.min(1, (weight - 350) / (2000 - 350)));
    return 1.3 + span * 0.95;
  }
  return 1.2;
}

function profileMetrics(bodyType, stageIndex, weight) {
  const shape = BODY_PROFILES[bodyType] || BODY_PROFILES.hourglass;
  const s = stageScale(stageIndex, weight);
  const gain = Math.max(0, s - 0.86);

  return {
    s,
    gain,
    height: 164 + stageIndex * 3 + (stageIndex >= 6 ? Math.min(34, (weight - 350) / 48) : 0),
    head: 10.5 + gain * 2,
    bust: (6 + shape.bust * 5.5) * s,
    waist: (2.5 + shape.waist * 2.2) * (1.05 - gain * 0.06),
    belly: (4 + shape.belly * 9.5) * s,
    seat: (9 + shape.seat * 8.5) * s,
    thigh: (8 + shape.thigh * 5) * s,
    calf: (4.5 + shape.thigh * 2.4) * (0.9 + gain * 0.14),
  };
}

/** Build a smooth side-profile path facing left (nose points left). */
function buildSideProfilePath(m) {
  const x = (base) => 14 + base;

  const top = 12;
  const headH = m.head * 1.45;
  const chin = top + headH;
  const neck = chin + 7 + m.gain * 1.5;
  const bustY = neck + m.height * 0.1;
  const waistY = neck + m.height * 0.2;
  const bellyY = neck + m.height * 0.29 + m.gain * 4;
  const hipY = neck + m.height * 0.36;
  const seatY = hipY + m.height * 0.045;
  const kneeY = neck + m.height * 0.6;
  const ankleY = neck + m.height * 0.82;
  const footY = neck + m.height * 0.87;

  const nose = x(0);
  const brow = x(-1);
  const crown = x(2);
  const backHead = x(m.head * 0.95);
  const nape = x(m.head * 0.72);
  const throat = x(-0.5);
  const bust = x(m.bust);
  const waist = x(m.waist + 1);
  const belly = x(m.belly);
  const seat = x(m.seat);
  const lowerBack = x(m.seat * 0.92);
  const thighBack = x(m.thigh * 0.86);
  const kneeBack = x(m.thigh * 0.72);
  const ankleBack = x(m.calf * 0.58);
  const heel = x(m.calf * 0.62);
  const toe = x(-m.head * 0.32);
  const kneeFront = x(m.belly * 0.38);
  const thighFront = x(m.belly * 0.5);

  return [
    `M ${crown} ${top}`,
    `C ${x(m.head * 0.45)} ${top - 2}, ${backHead + 3} ${top + 1}, ${backHead} ${top + headH * 0.35}`,
    `C ${backHead + 2} ${top + headH * 0.55}, ${nape + 2} ${chin - 4}, ${nape} ${chin}`,
    `C ${nape - 1} ${chin + 5}, ${x(m.head * 0.5)} ${neck - 2}, ${throat} ${neck}`,
    `C ${nose - 1} ${neck + 3}, ${nose - 2} ${bustY - 10}, ${bust} ${bustY}`,
    `C ${bust + 1} ${bustY + 7}, ${waist + 1} ${waistY - 5}, ${waist} ${waistY}`,
    `C ${waist - 0.5} ${waistY + 6}, ${belly + 2} ${bellyY - 7}, ${belly} ${bellyY}`,
    `C ${belly + 1} ${bellyY + 9}, ${seat + 3} ${hipY}, ${seat} ${seatY}`,
    `C ${seat + 2} ${seatY + 8}, ${lowerBack + 4} ${hipY + 12}, ${lowerBack} ${hipY + m.height * 0.07}`,
    `C ${lowerBack - 1} ${seatY + m.height * 0.1}, ${thighBack + 2} ${kneeY - 14}, ${thighBack} ${kneeY}`,
    `C ${thighBack - 1} ${kneeY + 12}, ${kneeBack + 1} ${ankleY - 10}, ${kneeBack} ${ankleY}`,
    `C ${kneeBack + 1} ${ankleY + 5}, ${heel + 2} ${footY - 2}, ${heel} ${footY}`,
    `C ${heel - 2} ${footY + 3}, ${toe + 5} ${footY + 2}, ${toe} ${footY - 1}`,
    `C ${toe - 2} ${ankleY + 2}, ${kneeFront - 2} ${kneeY + 10}, ${kneeFront} ${kneeY}`,
    `C ${thighFront + 1} ${hipY + m.height * 0.08}, ${belly - 2} ${bellyY + 12}, ${belly - 3} ${bellyY}`,
    `C ${waist - 2} ${waistY + 8}, ${bust - 3} ${bustY + 10}, ${throat + 1} ${neck + 5}`,
    `C ${nose - 1} ${chin + 1}, ${brow} ${top + headH * 0.7}, ${crown} ${top}`,
    'Z',
  ].join(' ');
}

function buildHairPath(m) {
  const x = (base) => 14 + base;
  const top = 12;
  const headH = m.head * 1.45;
  const crown = x(2);
  const backHead = x(m.head * 0.95);
  const brow = top + headH * 0.35;

  return [
    `M ${crown - 3} ${top + 2}`,
    `C ${x(-4)} ${top - 3}, ${backHead + 10} ${top}, ${backHead + 5} ${brow}`,
    `C ${backHead + 3} ${brow + 10}, ${backHead - 4} ${brow + 18}, ${backHead - 8} ${brow + 22}`,
    `C ${backHead - 14} ${brow + 10}, ${crown + 1} ${top + 8}, ${crown - 3} ${top + 2}`,
    'Z',
  ].join(' ');
}

export function renderSilhouette(character, stageIndex, options = {}) {
  const metrics = profileMetrics(character.bodyType, stageIndex, character.weight || 0);
  const bodyPath = buildSideProfilePath(metrics);
  const hairPath = buildHairPath(metrics);
  const viewH = Math.ceil(metrics.height + 40);
  const ghost = options.ghost ? 'opacity-35' : '';
  const label = options.label ? `<p class="text-center text-xs text-stone-400">${options.label}</p>` : '';
  const widthClass = options.wide ? 'w-32' : 'w-28';
  const gradId = `sil-${(character.id || 'x').replace(/[^a-z0-9]/gi, '')}-${stageIndex}`;

  return `
    <div class="${ghost}">
      ${label}
      <svg viewBox="0 0 88 ${viewH}" class="mx-auto ${widthClass}" aria-hidden="true" role="img">
        <defs>
          <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="currentColor" stop-opacity="0.88" />
            <stop offset="100%" stop-color="currentColor" stop-opacity="0.68" />
          </linearGradient>
        </defs>
        <ellipse cx="28" cy="${viewH - 6}" rx="20" ry="3.5" fill="currentColor" opacity="0.1" />
        <path d="${hairPath}" fill="currentColor" opacity="0.22" />
        <path d="${bodyPath}" fill="url(#${gradId})" />
      </svg>
    </div>
  `;
}

export function renderSilhouetteCompare(character, oldStage, newStage) {
  return `
    <div class="flex items-end justify-center gap-6 text-pink-300">
      ${renderSilhouette(character, oldStage, { ghost: true, label: `Stage ${oldStage + 1}`, wide: true })}
      <span class="text-stone-500">→</span>
      ${renderSilhouette(character, newStage, { label: `Stage ${newStage + 1}`, wide: true })}
    </div>
  `;
}
