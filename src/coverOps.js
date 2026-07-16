import { addWeekNote, spendActionPoint } from './state.js';
import { getPatientFramingTier } from './patientFraming.js';
import { ledgerFor, ledgerWhere, recordLedger } from './memoryLedger.js';

/**
 * C3: heat counterplay. Three verbs, none free, all of them leave a
 * paper trail the confession and the audit can read back.
 */

export const COVER_OPS = [
  {
    id: 'clean_charts',
    label: 'Clean the charts',
    apCost: 2,
    moneyCost: 150,
    hint: 'Heat -12. Every rewritten entry stays in the ledger.',
    description: 'An evening with correction fluid and a shredder. The record improves. The memory of improving it does not go away.',
  },
  {
    id: 'coach_front_desk',
    label: 'Coach the front desk',
    apCost: 1,
    moneyCost: 0,
    hint: '+2 cover per week for three weeks.',
    description: 'Scripts for the phone. What we say when someone asks why the chairs are so wide.',
  },
  {
    id: 'ask_to_vouch',
    label: 'Ask a regular to vouch',
    apCost: 1,
    moneyCost: 0,
    hint: 'Heat -8. Costs her trust. She keeps count.',
    description: 'A complicit patient makes one call on your behalf. Favors like this have a balance.',
  },
];

export function getCoverOp(id) {
  return COVER_OPS.find((op) => op.id === id) || null;
}

function vouchCount(state, patientId) {
  return ledgerFor(state, patientId).filter((row) => row.id === 'asked_to_vouch').length;
}

export function getCoverOpAvailability(state, opId) {
  const op = getCoverOp(opId);
  if (!op) return { ok: false, reason: 'Unknown operation.' };
  if (state.actionPoints < op.apCost) return { ok: false, reason: 'Not enough AP.' };
  if (op.moneyCost && state.money < op.moneyCost) return { ok: false, reason: 'Not enough cash.' };
  if (opId === 'clean_charts' && (state.heat || 0) < 6) {
    return { ok: false, reason: 'Nothing worth shredding yet.' };
  }
  if (opId === 'coach_front_desk' && state.coverOps?.activeBuffs?.some((b) => b.id === 'coached')) {
    return { ok: false, reason: 'The desk is already on script.' };
  }
  if (opId === 'ask_to_vouch') {
    const witness = state.patients.find((p) => getPatientFramingTier(p) === 'complicit');
    if (!witness) return { ok: false, reason: 'Nobody complicit enough to make the call.' };
  }
  return { ok: true };
}

export function performCoverOp(state, opId) {
  const op = getCoverOp(opId);
  const check = getCoverOpAvailability(state, opId);
  if (!op || !check.ok) return { ok: false, message: check.reason || 'Unavailable.' };

  for (let i = 0; i < op.apCost; i += 1) {
    if (!spendActionPoint(state)) return { ok: false, message: 'Not enough AP.' };
  }
  state.money -= op.moneyCost || 0;

  if (opId === 'clean_charts') {
    state.heat = Math.max(0, (state.heat || 0) - 12);
    const count = ledgerWhere(state, (row) => row.id === 'cover_scrub').length + 1;
    recordLedger(state, { id: 'cover_scrub', data: { count } });
    const message = `The charts read cleaner by midnight. Scrub number ${count} sits in your own memory, filed under things the board must never ask about.`;
    addWeekNote({ type: 'cover', title: 'Charts cleaned', text: message }, state);
    return { ok: true, message };
  }

  if (opId === 'coach_front_desk') {
    if (!state.coverOps) state.coverOps = { activeBuffs: [] };
    state.coverOps.activeBuffs.push({ id: 'coached', weeksLeft: 3 });
    const message = 'The front desk has its script now. For three weeks, every curious phone call meets the same warm wall.';
    addWeekNote({ type: 'cover', title: 'Front desk coached', text: message }, state);
    return { ok: true, message };
  }

  // ask_to_vouch
  const witness = state.patients
    .filter((p) => getPatientFramingTier(p) === 'complicit')
    .sort((a, b) => vouchCount(state, a.id) - vouchCount(state, b.id))[0];
  witness.trust = Math.max(0, Math.round((witness.trust - 2) * 100) / 100);
  state.heat = Math.max(0, (state.heat || 0) - 8);
  recordLedger(state, { id: 'asked_to_vouch', characterId: witness.id, data: { week: state.week } });
  const uses = vouchCount(state, witness.id);
  let message = `${witness.name} makes the call. Whatever she says, it works.`;
  if (uses >= 3) {
    witness.trust = Math.max(0, witness.trust - 2);
    message = `${witness.name} makes the call again. Third time. Her voice does the work; her eyes tell you the account is overdrawn.`;
  }
  addWeekNote({ type: 'cover', title: `A favor: ${witness.name}`, text: message }, state);
  return { ok: true, message };
}

/** Weekly tick: buffs pay out and expire. Called from endWeek. */
export function tickCoverOps(state) {
  if (!state.coverOps?.activeBuffs?.length) return;
  for (const buff of state.coverOps.activeBuffs) {
    if (buff.id === 'coached') {
      state.coverRating = Math.min(100, (state.coverRating ?? 100) + 2);
    }
    buff.weeksLeft -= 1;
  }
  state.coverOps.activeBuffs = state.coverOps.activeBuffs.filter((b) => b.weeksLeft > 0);
}
