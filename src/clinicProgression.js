/**
 * Clinic growth: role slots unlock over time; roster size drives patient capacity.
 */

export const STAFF_ROLE_SLOTS = [
  {
    id: 'receptionist',
    role: 'Front Desk Coordinator',
    arcSlot: 'elena',
    label: 'Receptionist',
    salary: 280,
    hireCost: 0,
    startsFilled: true,
    unlock: { week: 1, reputation: 0 },
  },
  {
    id: 'head_nurse',
    role: 'Head Nurse',
    arcSlot: 'maya',
    label: 'Head Nurse',
    salary: 320,
    hireCost: 450,
    unlock: { week: 2, reputation: 8 },
  },
  {
    id: 'physician_assistant',
    role: 'Physician Assistant',
    arcSlot: 'priya',
    label: 'Physician Assistant',
    salary: 380,
    hireCost: 550,
    unlock: { week: 4, reputation: 16 },
  },
  {
    id: 'clinic_manager',
    role: 'Clinic Manager',
    arcSlot: 'nadia',
    label: 'Clinic Manager',
    salary: 420,
    hireCost: 650,
    unlock: { week: 6, reputation: 24 },
  },
  {
    id: 'phlebotomist',
    role: 'Phlebotomist',
    arcSlot: 'jasmine',
    label: 'Phlebotomist',
    salary: 300,
    hireCost: 400,
    moleSlot: true,
    unlock: { week: 8, reputation: 32 },
  },
];

export const CLINIC_TIERS = [
  { id: 'strip_mall', label: 'Strip-mall suite', staffMin: 1, patientCap: 2, newPatientsBase: 0 },
  { id: 'corner_clinic', label: 'Corner clinic', staffMin: 2, patientCap: 4, newPatientsBase: 1 },
  { id: 'neighborhood', label: 'Neighborhood practice', staffMin: 3, patientCap: 7, newPatientsBase: 2 },
  { id: 'flagship', label: 'Flagship clinic', staffMin: 5, patientCap: 10, newPatientsBase: 3 },
];

export function getRoleSlot(slotId) {
  return STAFF_ROLE_SLOTS.find((s) => s.id === slotId) || null;
}

export function getFilledArcSlots(state) {
  return new Set(state.staff.map((s) => s.arcSlot).filter(Boolean));
}

export function isSlotFilled(state, slotId) {
  const slot = getRoleSlot(slotId);
  if (!slot) return true;
  return state.staff.some((s) => s.arcSlot === slot.arcSlot);
}

export function slotUnlockMet(state, slot) {
  const u = slot.unlock || {};
  if (state.week < (u.week || 1)) return false;
  if (state.reputation < (u.reputation || 0)) return false;
  return true;
}

export function getUnfilledUnlockedSlots(state) {
  return STAFF_ROLE_SLOTS.filter((slot) => {
    if (slot.startsFilled && state.week === 1 && state.staff.length <= 1) {
      if (isSlotFilled(state, slot.id)) return false;
    }
    if (isSlotFilled(state, slot.id)) return false;
    return slotUnlockMet(state, slot);
  });
}

export function getClinicTier(state) {
  const staffCount = state.staff.length;
  let tier = CLINIC_TIERS[0];
  for (const t of CLINIC_TIERS) {
    if (staffCount >= t.staffMin) tier = t;
  }
  return tier;
}

export function getPatientCap(state) {
  return getClinicTier(state).patientCap;
}

export function weeklyNewPatientCount(state, rng, effects = {}) {
  const tier = getClinicTier(state);
  const cap = getPatientCap(state);
  const room = Math.max(0, cap - state.patients.length);

  if (state.week === 1) {
    return Math.min(room, state.patients.length ? 0 : 1);
  }
  if (state.week < 2) return 0;
  let count = tier.newPatientsBase;
  if (state.week === 2 && state.patients.length === 0) count = Math.max(count, 1);
  count += Math.floor(state.reputation / 32);
  count += effects.newPatients || 0;
  count += rng.int(0, state.reputation >= 20 ? 1 : 0);
  return Math.min(room, Math.max(0, count));
}

export function ensureRecruitmentState(state) {
  if (!state.recruitment) {
    state.recruitment = { openSlotId: null, candidates: [], filledSlots: [] };
  }
  if (!state.recruitment.filledSlots) state.recruitment.filledSlots = [];
}

export function getMoleStaff(state) {
  return state.staff.find((s) => s.isMole) || null;
}
