import { addWeekNote } from './state.js';

export const RIVAL_NAME = 'ThriveWell Annex';

export const RIVAL_EVENTS = [
  {
    id: 'juice_bar',
    weekMin: 3,
    title: 'Rival Juice Bar',
    text: 'ThriveWell Annex installs a juice bar across the street. Your patients smell kale. Two skip appointments. Reputation dips unless you answer.',
    reputationHit: -2,
    counter: 'pastry_wall',
  },
  {
    id: 'stolen_poster',
    weekMin: 5,
    title: 'Poster War',
    text: 'Their new billboard shows thin models in yoga pants. "Real wellness," it says. Your front desk staff glare at it through the window.',
    reputationHit: -3,
    counter: 'comfort_campaign',
  },
  {
    id: 'poach_attempt',
    weekMin: 7,
    title: 'Patient Poach',
    text: 'ThriveWell offers your regulars a "detox month." One patient almost leaves. Elena blocks the door with her hips. Literally.',
    reputationHit: -4,
    counter: 'vip_lounge',
  },
];

export function defaultRivalState() {
  return {
    name: RIVAL_NAME,
    reputation: 28,
    phase: 0,
    eventsFired: [],
    active: true,
    defeated: false,
    weekStarted: 1,
  };
}

export function ensureRival(state) {
  if (!state.rivalState) state.rivalState = defaultRivalState();
}

export function getRivalProgress(state) {
  ensureRival(state);
  const r = state.rivalState;
  return {
    name: r.name,
    reputation: r.reputation,
    yours: state.reputation,
    lead: state.reputation - r.reputation,
    phase: r.phase,
    defeated: r.defeated,
    eventsLeft: RIVAL_EVENTS.filter((e) => !r.eventsFired.includes(e.id)).length,
  };
}

export function tickRival(state, rng) {
  ensureRival(state);
  const rival = state.rivalState;
  if (rival.defeated) return null;

  rival.reputation += rng.int(1, 3);
  if (state.reputation > rival.reputation + 8) {
    rival.reputation = Math.max(15, rival.reputation - 2);
  }

  const fired = [];
  for (const ev of RIVAL_EVENTS) {
    if (rival.eventsFired.includes(ev.id)) continue;
    if (state.week < ev.weekMin) continue;
    if (rng.next() > 0.42) continue;

    rival.eventsFired.push(ev.id);
    rival.phase += 1;
    state.reputation = Math.max(0, state.reputation + ev.reputationHit);

    if (state.ownedUpgrades.length >= 4 && state.reputation >= rival.reputation) {
      state.reputation += 2;
    }

    fired.push(ev);
    addWeekNote(
      { type: 'rival', title: ev.title, text: ev.text },
      state,
    );
    break;
  }

  if (rival.eventsFired.length >= RIVAL_EVENTS.length && state.reputation >= rival.reputation + 5) {
    rival.defeated = true;
    rival.active = false;
    state.reputation += 5;
    addWeekNote(
      {
        type: 'rival',
        title: 'Annex Quiet',
        text: 'ThriveWell Annex stops advertising. Word spreads that IndulgeCare wins on comfort. The rivalry cools. You keep the patients.',
      },
      state,
    );
  }

  return fired.length ? fired[0] : null;
}

export function rivalBlocksRecruitment(state) {
  ensureRival(state);
  if (state.rivalState.defeated) return false;
  return state.reputation < state.rivalState.reputation - 3;
}
