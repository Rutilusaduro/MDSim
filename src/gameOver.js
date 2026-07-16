import { chartGap, getPatientFramingTier, getCoverLabel } from './patientFraming.js';
import { ledgerFor } from './memoryLedger.js';

export const AUDIT_GAME_OVER = {
  id: 'audit_shutdown',
  title: 'State Board Audit',
  text: 'Investigators found charts that did not match the waiting room. Feeding logs. Widened door receipts. Your license is suspended. The clinic closes.',
};

export function summedChartGap(state) {
  return (state.patients || []).reduce((sum, patient) => sum + chartGap(patient), 0);
}

export function complicitTestimonyCount(state) {
  return (state.patients || []).filter((p) => getPatientFramingTier(p) === 'complicit').length;
}

export function buildAuditVerdict(state) {
  const cover = state.coverRating ?? 100;
  const gap = Math.round(summedChartGap(state) * 10) / 10;
  const testimony = complicitTestimonyCount(state);
  const moleFlipped = (state.ledger || []).some((row) => row.id === 'mole_flip');
  const moleBetrayed = (state.heat || 0) >= 40 && !moleFlipped;

  let verdict = 'shutdown';
  if (testimony >= 2 && cover > 0) verdict = 'probation';
  if (moleFlipped && cover > 5) verdict = 'probation';
  if (moleBetrayed) verdict = 'shutdown';

  const lines = [
    `Cover rating: ${cover}. Chart gap across roster: ${gap} lb.`,
    testimony
      ? `${testimony} complicit patient${testimony === 1 ? '' : 's'} offered testimony.`
      : 'No patient testified on your behalf.',
  ];
  if (moleFlipped) lines.push('Your mole destroyed evidence before the board arrived.');
  if (moleBetrayed) lines.push('The Annex witness was thorough.');

  return { verdict, gap, testimony, lines: lines.join(' '), cover };
}

export function checkAuditGameOver(state) {
  if (state.gameOver) return state.gameOver;
  const cover = state.coverRating ?? 100;
  const gap = summedChartGap(state);
  if (cover <= 0 || (cover < 12 && gap >= 18)) {
    const audit = buildAuditVerdict(state);
    state.gameOver = {
      ...AUDIT_GAME_OVER,
      week: state.week,
      audit,
      text: `${AUDIT_GAME_OVER.text} ${audit.lines}`,
    };
    return state.gameOver;
  }
  return null;
}

export function isGameOver(state) {
  return Boolean(state.gameOver);
}

export function renderChartGapSvg(patient, state) {
  const entries = ledgerFor(state, patient.id).filter((row) => row.id === 'chart_entry');
  if (!entries.length) {
    return `<p class="text-xs text-stone-500">No weigh-ins charted yet.</p>`;
  }
  const maxW = Math.max(patient.weight, patient.chartedWeight ?? 0, ...entries.map((e) => e.data.weight || 0));
  const minW = Math.min(...entries.map((e) => Math.min(e.data.weight || 0, (e.data.charted ?? e.data.weight) || 0)));
  const range = Math.max(10, maxW - minW);
  const pointsReal = entries
    .map((e, i) => {
      const x = 10 + (i / Math.max(1, entries.length - 1)) * 180;
      const y = 90 - ((e.data.weight - minW) / range) * 70;
      return `${x},${y}`;
    })
    .join(' ');
  const pointsChart = entries
    .map((e, i) => {
      const x = 10 + (i / Math.max(1, entries.length - 1)) * 180;
      const y = 90 - (((e.data.charted ?? e.data.weight) - minW) / range) * 70;
      return `${x},${y}`;
    })
    .join(' ');
  const gap = chartGap(patient);
  return `
    <svg viewBox="0 0 200 100" class="w-full max-w-xs" aria-label="Weight vs chart trend">
      <polyline fill="none" stroke="var(--ink, #26221b)" stroke-width="2" points="${pointsReal}" />
      <polyline fill="none" stroke="var(--accent, #8a4b2d)" stroke-width="2" stroke-dasharray="4 3" points="${pointsChart}" />
    </svg>
    <p class="mt-2 text-xs" style="color: var(--ink-soft, #57503f)">Gap <strong class="chart-num">${gap} lb</strong> · solid = scale, dashed = what you charted</p>`;
}
