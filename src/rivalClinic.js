import { addWeekNote } from './state.js';

export const RIVAL_CLINIC_ACTIONS = [
  {
    id: 'counter_market',
    label: 'Counter-Marketing Blitz',
    cost: 220,
    ap: 0,
    text: 'You run print ads with generous seating and zero shame copy. ThriveWell loses a few curious walk-ins.',
    effect: (state) => {
      state.reputation += 3;
      if (state.rivalState) state.rivalState.reputation = Math.max(10, state.rivalState.reputation - 2);
      state.money -= 220;
    },
  },
  {
    id: 'pastry_push',
    label: 'Lobby Pastry Push',
    cost: 140,
    ap: 0,
    text: 'Fresh pastry wall samples. Patients cancel annex appointments from the waiting chairs.',
    effect: (state) => {
      state.patients.forEach((p) => {
        p.trust += 0.15;
        p.loyalty = Math.min(10, (p.loyalty || 0) + 1);
      });
      state.money -= 140;
    },
  },
  {
    id: 'poach_back',
    label: 'Poach Patient Back',
    cost: 0,
    ap: 1,
    text: 'You call a patient who left for ThriveWell. She returns heavier and happier. The annex seethes.',
    effect: (state, rng) => {
      state.reputation += 2;
      if (state.rivalState) state.rivalState.reputation = Math.max(8, state.rivalState.reputation - 3);
      if (state.rivalClinic) state.rivalClinic.patientsRecovered += 1;
    },
  },
];

export function defaultRivalClinicState() {
  return {
    phase: 0,
    maxPhase: 4,
    patientsRecovered: 0,
    actionsTaken: 0,
    complete: false,
  };
}

export function ensureRivalClinic(state) {
  if (!state.rivalClinic) state.rivalClinic = defaultRivalClinicState();
}

export function getRivalClinicProgress(state) {
  ensureRivalClinic(state);
  const rc = state.rivalClinic;
  return {
    phase: rc.phase,
    maxPhase: rc.maxPhase,
    patientsRecovered: rc.patientsRecovered,
    actionsTaken: rc.actionsTaken,
    complete: rc.complete,
    percent: Math.round((rc.phase / rc.maxPhase) * 100),
  };
}

export function canUseRivalClinic(state) {
  return state.week >= 6 && state.chapter >= 2;
}

export function performRivalClinicAction(state, actionId, spendAp) {
  if (!canUseRivalClinic(state)) {
    return { ok: false, message: 'Annex ops unlock in Chapter 2.' };
  }
  const action = RIVAL_CLINIC_ACTIONS.find((a) => a.id === actionId);
  if (!action) return { ok: false, message: 'Unknown action.' };
  if (state.money < action.cost) return { ok: false, message: 'Not enough money.' };
  if (action.ap && state.actionPoints < action.ap) return { ok: false, message: 'Need 1 AP.' };

  if (action.ap && !spendAp(state)) return { ok: false, message: 'No AP remaining.' };

  action.effect(state);
  ensureRivalClinic(state);
  state.rivalClinic.actionsTaken += 1;
  state.rivalClinic.phase = Math.min(state.rivalClinic.maxPhase, state.rivalClinic.phase + 1);

  if (state.rivalClinic.phase >= state.rivalClinic.maxPhase) {
    state.rivalClinic.complete = true;
    state.reputation += 4;
    if (state.rivalState) state.rivalState.defeated = true;
  }

  addWeekNote({ type: 'rival_ops', title: action.label, text: action.text }, state);
  return { ok: true, message: action.text };
}
