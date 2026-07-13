import {
  STAFF_ROLE_SLOTS,
  ensureRecruitmentState,
  getRoleSlot,
  getUnfilledUnlockedSlots,
  isSlotFilled,
  slotUnlockMet,
} from './clinicProgression.js';
import { generateStaffCandidate, staffCandidateSummary } from './characters.js';
import { addWeekNote, formatMoney, spendActionPoint } from './state.js';
import { bumpStyle, styleFromInteraction } from './clinicStyle.js';

const CANDIDATES_PER_SLOT = 3;

export function refreshRecruitmentOffers(state, rng) {
  ensureRecruitmentState(state);
  if (state.recruitment.openSlotId && state.recruitment.candidates?.length) {
    return state.recruitment;
  }

  const open = getUnfilledUnlockedSlots(state).find((slot) => !slot.startsFilled || !isSlotFilled(state, slot.id));
  if (!open) {
    state.recruitment.openSlotId = null;
    state.recruitment.candidates = [];
    return state.recruitment;
  }

  state.recruitment.openSlotId = open.id;
  state.recruitment.candidates = Array.from({ length: CANDIDATES_PER_SLOT }, () =>
    generateStaffCandidate(rng, open),
  );
  return state.recruitment;
}

export function getRecruitmentPanel(state) {
  ensureRecruitmentState(state);
  const slot = state.recruitment.openSlotId ? getRoleSlot(state.recruitment.openSlotId) : null;
  const candidates = state.recruitment.candidates || [];
  const upcoming = STAFF_ROLE_SLOTS.filter((s) => !isSlotFilled(state, s.id) && !s.startsFilled).map((s) => ({
    ...s,
    unlocked: slotUnlockMet(state, s),
  }));
  return { slot, candidates, upcoming, moleSlot: slot?.moleSlot || false };
}

export function hireCandidate(state, candidateId) {
  ensureRecruitmentState(state);
  const slot = getRoleSlot(state.recruitment.openSlotId);
  if (!slot) return { ok: false, message: 'No open position.' };

  const candidate = state.recruitment.candidates.find((c) => c.id === candidateId);
  if (!candidate) return { ok: false, message: 'Candidate not found.' };

  const cost = slot.hireCost || 0;
  if (state.money < cost) return { ok: false, message: `Need ${formatMoney(cost)} to hire.` };
  if (!spendActionPoint(state)) return { ok: false, message: 'No action points remain.' };

  state.money -= cost;
  const staff = { ...candidate, type: 'staff', arc: { completedBeats: [], choices: {}, flags: [] } };
  delete staff.candidateId;

  if (slot.moleSlot) {
    staff.isMole = true;
    staff.moleRevealed = false;
    staff.moleLoyalty = 0;
  }

  state.staff.push(staff);
  state.salaries += slot.salary;
  state.reputation += 2;
  state.recruitment.filledSlots.push(slot.id);
  state.recruitment.openSlotId = null;
  state.recruitment.candidates = [];

  bumpStyle(state, styleFromInteraction('recruit'));

  let moleNote = '';
  if (staff.isMole) {
    moleNote = ' Annex may have eyes on you. Time will tell if she belongs here.';
  }

  const text = `${staff.name} hired as ${slot.role}. ${staffCandidateSummary(staff)}.${moleNote}`;
  addWeekNote({ type: 'hire', title: `Hired: ${staff.name}`, text }, state);

  return { ok: true, message: text, staff };
}


export { STAFF_ROLE_SLOTS, CANDIDATES_PER_SLOT };
