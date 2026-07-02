import {
  addLog,
  addWeekNote,
  formatMoney,
  rngForState,
  saveGame,
  spendActionPoint,
  updateInstallableAchievement,
} from './state.js';
import { applyPendingInstallations, computeClinicEffects } from './clinic.js';
import {
  createPatient,
  bumpLoyalty,
  getAttitudeKey,
  getGainTemperament,
  getStageIndex,
  getStageInfo,
  loyaltyRecruitDiscount,
  summarizeStageChange,
} from './characters.js';
import { getInteractionBanter } from './interactionDialogue.js';
import { advanceArc, canAdvanceArc, getArcProgress } from './arcs.js';
import { checkAchievements } from './achievements.js';
import {
  fireRelationshipBeat,
  fireWardrobeEvents,
  pickWeeklyEvent,
} from './weeklyContent.js';
import { fireWorldImpactEvents } from './worldImpact.js';
import { fireEarlyGainEvents } from './earlyGameEvents.js';
import { weeklyNewPatientCount, getPatientCap } from './clinicProgression.js';
import { refreshRecruitmentOffers } from './recruitment.js';
import { tickRival, rivalBlocksRecruitment } from './rival.js';
import { checkChapterAdvance } from './chapters.js';
import { bumpStyle, styleFromInteraction, applyStyleWeekTick, stylePatientArchetypeBias } from './clinicStyle.js';
import { pickGroupScene, setPendingGroupScene } from './groupScenes.js';
import { getActiveSeasonalWeek } from './v3WeeklyContent.js';
import { canShowEnding, computeEnding } from './endings.js';
import { startNewWeekChallenge } from './challenges.js';
import { advanceLoyaltyArc, loyaltyRecruitVisitShortcut } from './loyaltyArcs.js';
import { consultReputationBonus } from './clinicStyle.js';
import { visitWeekPenalty, getUnvisitedPatients } from './patientVisit.js';
import { pickWeeklyInteractiveScene } from './sceneEngine/triggers.js';
import { ensureSceneState } from './sceneEngine/flags.js';
import { setWeekInterrupt, getWeekInterrupt } from './weekScenes.js';
import { SCENE_CATALOG } from './scenes/catalog.js';
import { checkAuditGameOver } from './gameOver.js';

const RECRUIT_ROLES = [
  'Patient Care Coordinator',
  'Wellness Associate',
  'Clinical Support Staff',
  'Outreach Liaison',
];

export const interactionCatalog = {
  consult: {
    label: 'Routine Office Visit',
    scope: [],
    money: 225,
    description: 'Legacy consult. Patients use the visit desk instead.',
  },
  personalTalk: {
    label: 'Private Staff Check-In',
    scope: ['staff'],
    description: 'One-on-one talk. No charting. Just time and attention.',
  },
  cateredBreak: {
    label: 'Catered Break Tray',
    scope: ['staff'],
    cost: 180,
    description: 'Staff-only tray, heaped high with rich food and portions built for gorging.',
  },
  comfortPlan: {
    label: 'Holistic Feeding Plan',
    scope: ['staff'],
    cost: 90,
    description: 'A written plan for growing: slower evenings, fuller plates, and second helpings taken without a shred of guilt.',
  },
  comfortBlend: {
    label: 'Use Gorging Blend',
    scope: ['staff'],
    inventory: 'comfortBlend',
    description: 'Vanilla powder. Calms nerves. Opens appetite.',
  },
  appetiteTonic: {
    label: 'Use Appetite Tonic',
    scope: ['staff'],
    inventory: 'appetiteTonic',
    description: 'Amber dose. Hunger arrives fast and stays.',
  },
  recoveryShake: {
    label: 'Use Recovery Shake',
    scope: ['staff'],
    inventory: 'recoveryShake',
    description: 'Thick shake. Sweet. Labeled for recovery. Fills the stomach.',
  },
  arcScene: {
    label: 'Advance Personal Arc',
    scope: ['staff'],
    description: 'Branching scene with multiple paths. Prior choices shape later beats. Costs 1 AP when you commit.',
  },
  feedMole: {
    label: 'Annex Quiet Tray',
    scope: ['staff'],
    moleOnly: true,
    cost: 120,
    description: 'She reports to ThriveWell. Keep her full and loyal. No firing. Only feeding.',
  },
  recruit: {
    label: 'Recruit to Staff',
    scope: ['patient'],
    cost: 750,
    description: 'Offer a job. Trust high, appetite higher, body already spreading. She stays to keep growing for good.',
  },
};

export function findCharacter(state, id) {
  return [...state.staff, ...state.patients].find((character) => character.id === id);
}

export function getInteractionOptions(state, character) {
  return Object.entries(interactionCatalog)
    .filter(([, action]) => {
      if (!action.scope.includes(character.type)) return false;
      if (action.moleOnly && !(character.isMole && character.moleRevealed)) return false;
      return true;
    })
    .map(([id, action]) => {
      const inventoryMissing = action.inventory && (state.inventory[action.inventory] || 0) <= 0;
      let extraDisabled = false;
      let extraReason = '';

      if (id === 'consult' && character.seenThisWeek) {
        extraDisabled = true;
        extraReason = 'Already seen this week';
      }
      if (id === 'arcScene') {
        const arcCheck = canAdvanceArc(character);
        if (!arcCheck.ok) {
          extraDisabled = true;
          extraReason = arcCheck.reason;
        }
      }
      if (id === 'recruit') {
        if (character.trust < 8) {
          extraDisabled = true;
          extraReason = 'Need trust 8+';
        } else if (getStageIndex(character) < 4) {
          extraDisabled = true;
          extraReason = 'Need stage 5+';
        } else if ((character.visits || 0) < 3 - loyaltyRecruitVisitShortcut(character) && (character.loyalty || 0) < 5) {
          extraDisabled = true;
          extraReason = 'Need 3+ visits or loyalty 5+';
        } else if (state.staff.length >= 8) {
          extraDisabled = true;
          extraReason = 'Staff roster full';
        } else if (rivalBlocksRecruitment(state)) {
          extraDisabled = true;
          extraReason = 'Reputation below rival. Win the race first.';
        }
      }

      const recruitCost =
        id === 'recruit' ? Math.max(400, 750 - loyaltyRecruitDiscount(character)) : action.cost;

      return {
        id,
        ...action,
        cost: recruitCost,
        disabled:
          state.actionPoints <= 0 ||
          inventoryMissing ||
          (recruitCost && state.money < recruitCost) ||
          extraDisabled,
        reason:
          state.actionPoints <= 0
            ? 'No AP remaining'
            : inventoryMissing
              ? 'Out of stock'
              : recruitCost && state.money < recruitCost
                ? 'Insufficient funds'
                : extraReason,
      };
    });
}

function actionFlavor(character, actionId) {
  const name = character.name;
  const banter = getInteractionBanter(character, actionId);
  const preference = character.preference;
  const attitude = getAttitudeKey(character);
  const early = attitude === 'professional' || attitude === 'noticing';
  const mid = attitude === 'hungry' || attitude === 'pleased';
  const immobile = attitude === 'immobile' || attitude === 'blob';
  const isPatient = character.type === 'patient';
  const quote = banter ? ` ${banter}` : '';

  if (isPatient) {
    const patientCopy = {
      consult: early
        ? `${name} checks out after the visit. Follow-up on the calendar.${quote}`
        : mid
          ? `${name} lingers in the lobby after checkout, hand at her middle.${quote}`
          : immobile
            ? `${name} finishes the visit from the widened lounge couch, tray balanced on her belly.${quote}`
            : `${name} fills the exam chair, cheeks flushed.${quote}`,
      comfortPlan: early
        ? `${name} takes the feeding plan home, reassured.${quote}`
        : mid
          ? `${name} reads the plan in the car, engine running.${quote}`
          : immobile
            ? `${name} keeps the plan within reach on the couch, already planning seconds.${quote}`
            : `${name} hugs the plan to her chest before she stands.${quote}`,
      comfortBlend: early
        ? `${name} drinks the blend in the exam room, unhurried.${quote}`
        : mid
          ? `${name} finishes the cup and blinks at the empty bottom.${quote}`
          : immobile
            ? `${name} drains the blend without sitting up, cup handed back empty.${quote}`
            : `${name} savors the last swallow, eyes half closed.${quote}`,
      appetiteTonic: early
        ? `${name} takes the dose at the sink, clinical and brief.${quote}`
        : mid
          ? `${name} exhales after the tonic, already thinking about lunch.${quote}`
          : `${name} laughs at the heat in her throat.${quote}`,
      recoveryShake: early
        ? `${name} finishes the shake before she leaves.${quote}`
        : mid
          ? `${name} grips the cup until the ice rattles empty.${quote}`
          : `${name} leans back, belly rising with the last swallow.${quote}`,
      recruit: `${name} accepts the offer on the spot, already picturing the break room trays she will never have to leave.${quote}`,
    };
    return patientCopy[actionId];
  }

  const copy = {
    consult: early
      ? `${name} leaves on time. Visit went fine.${quote}`
      : mid
        ? `${name} lingers at the door, distracted.${quote}`
        : immobile
          ? `${name} stays put on the reinforced couch, visit notes taken between bites.${quote}`
          : `${name} fills the chair, talk turning to ${preference}.${quote}`,
    personalTalk: early
      ? `${name} checks in easy after a long shift.${quote}`
      : mid
        ? `${name} unloads about hunger and tight scrubs.${quote}`
        : `${name} speaks plain about weight and want.${quote}`,
    cateredBreak: early
      ? `${name} eats from the tray between bites of ${preference}.${quote}`
      : mid
        ? `${name} clears the tray faster than she planned.${quote}`
        : `Tray lands heavy. ${name} sinks into cushions over ${preference}.${quote}`,
    comfortPlan: early
      ? `${name} nods through the feeding advice and files it.${quote}`
      : mid
        ? `${name} reads the plan twice, quiet.${quote}`
        : immobile
          ? `${name} pins the plan to the tray table and keeps eating.${quote}`
          : `${name} takes the plan like permission.${quote}`,
    comfortBlend: early
      ? `${name} drinks it down between tasks.${quote}`
      : mid
        ? `Blend goes down smooth. ${name} blinks, hungry again.${quote}`
        : immobile
          ? `Vanilla and cream. ${name} drinks from the straw without shifting her weight.${quote}`
          : `Vanilla and cream. ${name} drinks slow, hand on her middle.${quote}`,
    appetiteTonic: early
      ? `${name} swallows the dose between rooms.${quote}`
      : mid
        ? `Tonic hits. ${name} exhales. Lunch urgent.${quote}`
        : `Amber heat in the throat. ${name} laughs, wanting more.${quote}`,
    recoveryShake: early
      ? `${name} finishes the shake on the walk to the next room.${quote}`
      : mid
        ? `${name} grips the cup with both hands until it is empty.${quote}`
        : `Thick shake. Sweet. ${name} drains it, heavy-lidded.${quote}`,
    feedMole: `Tray lands heavy. ${name} eats slow, eyes on the door. Loyalty bought in pastry and cream.${quote}`,
    arcScene: (() => {
      const progress = getArcProgress(character);
      return `${name}: ${progress?.track.title || 'Arc'}. Beat ${(progress?.completed || 0) + 1}.${quote}`;
    })(),
    recruit: `${name} accepts the offer, hungry for a place that will only feed her fuller. Paperwork waits.${quote}`,
  };

  return copy[actionId];
}

export function previewInteractionFlavor(character, actionId) {
  return actionFlavor(character, actionId) || `No flavor for action "${actionId}".`;
}

export function performInteraction(state, characterId, actionId) {
  const character = findCharacter(state, characterId);
  const action = interactionCatalog[actionId];
  if (!character || !action) return { ok: false, message: 'That interaction is unavailable.' };
  const option = getInteractionOptions(state, character).find((item) => item.id === actionId);
  if (option?.disabled) return { ok: false, message: option.reason };
  if (!spendActionPoint(state)) return { ok: false, message: 'No action points remain.' };

  const cost = option?.cost ?? action.cost;
  if (cost) state.money -= cost;
  if (action.inventory) {
    state.inventory[action.inventory] -= 1;
    if (state.stats) state.stats.compoundsUsed = (state.stats.compoundsUsed || 0) + 1;
  }

  switch (actionId) {
    case 'consult':
      state.money += action.money;
      state.weekConsultIncome = (state.weekConsultIncome || 0) + action.money;
      state.reputation += 1 + consultReputationBonus(state);
      character.visits += 1;
      character.seenThisWeek = true;
      character.trust += 0.65;
      character.openness += 2.5;
      character.weeklyMomentum += 0.65;
      bumpLoyalty(character, 1);
      if (state.challengeWeek === 'quiet') bumpLoyalty(character, 1);
      {
        const loyaltyResult = advanceLoyaltyArc(character, state);
        if (loyaltyResult.ok) {
          addWeekNote(
            { type: 'loyalty', title: `Loyalty: ${character.name}`, text: loyaltyResult.text },
            state,
          );
        }
      }
      break;
    case 'personalTalk':
      character.trust += 0.7;
      character.openness += 5;
      character.indulgence += 2;
      character.weeklyMomentum += 0.75;
      break;
    case 'cateredBreak':
      character.appetite += 0.25;
      character.indulgence += 5;
      character.openness += 2;
      character.weeklyMomentum += 1.85;
      break;
    case 'comfortPlan':
      character.trust += 0.35;
      character.openness += 3.5;
      character.indulgence += 4;
      character.weeklyMomentum += 1.15;
      break;
    case 'comfortBlend':
      character.trust += 0.25;
      character.openness += 3;
      character.indulgence += 5;
      character.weeklyMomentum += 1.55;
      break;
    case 'appetiteTonic':
      character.appetite += 0.45;
      character.openness += 2.5;
      character.indulgence += 6;
      character.weeklyMomentum += 2.15;
      break;
    case 'recoveryShake':
      character.trust += 0.3;
      character.indulgence += 3;
      character.weeklyMomentum += 1.35;
      break;
    case 'feedMole':
      character.moleLoyalty = (character.moleLoyalty || 0) + 8;
      character.indulgence = Math.min(100, character.indulgence + 3);
      character.weight = Math.round((character.weight + 0.4) * 10) / 10;
      character.trust += 0.2;
      state.heat = Math.max(0, (state.heat || 0) - 4);
      state.coverRating = Math.min(100, (state.coverRating ?? 100) + 3);
      break;
    case 'arcScene':
      return { ok: false, message: 'Use the arc scene modal.' };
    case 'recruit': {
      const role = RECRUIT_ROLES[state.staff.length % RECRUIT_ROLES.length];
      character.type = 'staff';
      character.role = role;
      character.arc = { completedBeats: [] };
      state.patients = state.patients.filter((p) => p.id !== character.id);
      state.staff.push(character);
      state.salaries += 280;
      state.reputation += 3;
      if (state.stats) state.stats.patientsRecruited = (state.stats.patientsRecruited || 0) + 1;
      const hireText = actionFlavor(character, actionId);
      addWeekNote({ type: 'recruit', title: `Hired: ${character.name}`, text: hireText }, state);
      return { ok: true, message: hireText };
    }
    default:
      break;
  }

  const text = actionFlavor(character, actionId);
  let message = text;
  if (actionId === 'consult' && action.money) {
    message = `${text} Billed ${formatMoney(action.money)}.`;
  }
  bumpStyle(state, styleFromInteraction(actionId));
  addWeekNote({
    type: 'interaction',
    title: `${action.label}: ${character.name}`,
    text: message,
  }, state);

  return { ok: true, message };
}

function calculateGain(state, character, effects, rng) {
  const isStaff = character.type === 'staff';
  const base = isStaff ? 1.15 : character.seenThisWeek ? 1.05 : 0.62;
  const environmental = isStaff ? effects.staffGain : effects.patientGain;
  const momentum = character.weeklyMomentum + (isStaff ? effects.staffMomentum : effects.patientMomentum);
  const temperament = getGainTemperament(character);
  const trustLift = Math.min(1.1, (character.trust + effects.trust) / 18);
  const roll = rng.next() * 1.35;
  const raw = (base + environmental * 5 + momentum + roll + trustLift) * temperament * effects.gainMultiplier;
  return Math.max(0.3, Math.round(raw * 10) / 10);
}

function buildResolutionHtml({
  state,
  installed,
  staffGains,
  patientGains,
  stageChanges,
  bills,
  clinicRevenue,
  weekConsultIncome,
  newPatients,
  weeklyEvent,
  wardrobeFired,
  relationshipBeat,
  rivalEvent,
  chapterAdvance,
  seasonal,
}) {
  const installedText = installed.length
    ? `Sunday night. ${installed.map((item) => item.name).join(', ')} slots into place.`
    : 'No new gear this week. The clinic runs on what it already has.';

  const bestStaff = staffGains.slice().sort((a, b) => b.gain - a.gain)[0];
  const bestPatient = patientGains.slice().sort((a, b) => b.gain - a.gain)[0];
  const stageText = stageChanges.length
    ? stageChanges.map((change) => `<p><strong>${change.name}</strong>: ${change.text}</p>`).join('')
    : '<p>No formal stage change this week. Tighter buttons. Louder stomachs. Small signs.</p>';

  const closingTone =
    state.week <= 3
      ? `${newPatients.length} new patients on the roster. Word of mouth. Busy rooms.`
      : `${newPatients.length} new patients waitlisted. Reputation does the recruiting now.`;

  const eventBlock = weeklyEvent
    ? `<p><strong>${weeklyEvent.title}:</strong> ${weeklyEvent.text}</p>`
    : '';
  const wardrobeBlock = wardrobeFired.length
    ? wardrobeFired
        .map((w) => `<p><strong>${w.character.name}:</strong> ${w.text}</p>`)
        .join('')
    : '';
  const relBlock = relationshipBeat
    ? `<p><strong>${relationshipBeat.beat.title}:</strong> ${relationshipBeat.beat.text}</p>`
    : '';
  const rivalBlock = rivalEvent
    ? `<p><strong>${rivalEvent.title}:</strong> ${rivalEvent.text}</p>`
    : '';
  const chapterBlock = chapterAdvance
    ? `<p><strong>Chapter complete:</strong> ${chapterAdvance.completed.name}. Reward ${formatMoney(chapterAdvance.reward.money || 0)}.</p>`
    : '';
  const seasonalBlock = seasonal
    ? `<p><strong>${seasonal.name}:</strong> ${seasonal.modifier}</p>`
    : '';

  const net = (weekConsultIncome || 0) + clinicRevenue - bills;
  const incomeLines = [
    weekConsultIncome ? `Visit fees ${formatMoney(weekConsultIncome)}` : null,
    clinicRevenue ? `Clinic revenue ${formatMoney(clinicRevenue)}` : null,
    `Bills ${formatMoney(bills)}`,
    `Net ${formatMoney(net)}`,
  ]
    .filter(Boolean)
    .join('. ');

  return `
    <p>${installedText}</p>
    ${seasonalBlock}
    ${eventBlock}
    ${rivalBlock}
    ${wardrobeBlock}
    ${relBlock}
    ${chapterBlock}
    <p>Week ${state.week} closes. ${
      bestStaff
        ? `<strong>${bestStaff.name}</strong> adds ${bestStaff.gain.toFixed(1)} lb.`
        : ''
    } ${
      bestPatient
        ? `<strong>${bestPatient.name}</strong> leaves ${bestPatient.gain.toFixed(1)} lb heavier.`
        : ''
    }</p>
    ${stageText}
    <p>${incomeLines}. ${closingTone}</p>
  `;
}

export function endWeek(state) {
  const rng = rngForState(state);
  const installed = applyPendingInstallations(state);
  updateInstallableAchievement(state);
  applyStyleWeekTick(state);
  const seasonal = getActiveSeasonalWeek(state);
  const effects = computeClinicEffects(state);
  const staffGains = [];
  const patientGains = [];
  const stageChanges = [];

  const weeklyEvent = pickWeeklyEvent(state, rng);
  if (weeklyEvent) {
    weeklyEvent.effect(state);
    addWeekNote({ type: 'event', title: weeklyEvent.title, text: weeklyEvent.text }, state);
  }

  const rivalEvent = state.week >= 4 ? tickRival(state, rng) : null;
  if (state.week >= 4 && state.rivalState && !state.rivalState.active) {
    state.rivalState.active = true;
    state.rivalState.reputation = Math.max(state.rivalState.reputation, state.reputation + 6);
  }

  [...state.staff, ...state.patients].forEach((character) => {
    const oldStage = getStageIndex(character);
    const gain = calculateGain(state, character, effects, rng);
    character.weight = Math.round((character.weight + gain) * 10) / 10;
    character.indulgence = Math.min(100, character.indulgence + gain * 0.65);
    character.openness = Math.min(100, character.openness + gain * 0.45);

    const newStage = getStageIndex(character);
    const record = { id: character.id, name: character.name, gain, oldStage, newStage };
    if (character.type === 'staff') staffGains.push(record);
    else patientGains.push(record);

    if (newStage > oldStage) {
      stageChanges.push({
        ...record,
        text: summarizeStageChange(character, oldStage, newStage),
      });
    }

    character.weeklyMomentum = 0;
    if (character.type === 'patient') character.seenThisWeek = false;
  });

  if (!state.firedEvents) state.firedEvents = [];
  const wardrobeFired = fireWardrobeEvents(state, rng);
  wardrobeFired.forEach((w) => state.firedEvents.push(w.key));

  fireWorldImpactEvents(state, rng);
  fireEarlyGainEvents(state, rng);

  ensureSceneState(state);
  if (!getWeekInterrupt(state)) {
    const roster = [...state.staff, ...state.patients];
    for (let i = roster.length - 1; i > 0; i -= 1) {
      const j = rng.int(0, i);
      [roster[i], roster[j]] = [roster[j], roster[i]];
    }
    for (const character of roster) {
      const pick = pickWeeklyInteractiveScene(state, character, rng);
      if (!pick) continue;
      setWeekInterrupt(state, pick.sceneId, pick.characterId);
      const sceneDef = SCENE_CATALOG[pick.sceneId];
      addWeekNote(
        {
          type: 'scene',
          title: `Weekly crisis: ${sceneDef?.title || pick.sceneId}`,
          text: `${character.name} needs your call before next week runs clean.`,
        },
        state,
      );
      break;
    }
  }

  if ((state.heat || 0) > 0) {
    state.coverRating = Math.max(0, (state.coverRating ?? 100) - Math.floor(state.heat / 5));
    state.heat = Math.max(0, state.heat - 8);
    checkAuditGameOver(state);
  }

  const relationshipBeat = fireRelationshipBeat(state, rng);

  const groupPick = pickGroupScene(state, rng);
  if (groupPick) setPendingGroupScene(state, groupPick);

  const chapterAdvance = checkChapterAdvance(state);
  if (chapterAdvance && state.stats) {
    state.stats.chaptersCompleted = (state.stats.chaptersCompleted || 0) + 1;
  }

  const ending = canShowEnding(state) ? computeEnding(state) : null;
  if (ending) state.pendingEnding = ending;

  const visitPenalty = visitWeekPenalty(state);
  if (visitPenalty.unvisited > 0) {
    state.reputation = Math.max(0, state.reputation - visitPenalty.reputation);
    getUnvisitedPatients(state).forEach((patient) => {
      patient.trust = Math.max(0, Math.round((patient.trust - visitPenalty.trustLossPerPatient) * 100) / 100);
    });
    addWeekNote({ type: 'penalty', title: 'Missed patient visits', text: visitPenalty.message }, state);
  }

  if (state.activePatientVisit) {
    state.activePatientVisit = null;
    addWeekNote({
      type: 'system',
      title: 'Visit abandoned',
      text: 'An in-progress patient visit was cleared at week end.',
    }, state);
  }

  const clinicRevenue = effects.weeklyRevenue;
  const weekConsultIncome = state.weekConsultIncome || 0;
  const bills = state.rent + state.salaries + state.supplyCost + effects.maintenance;
  state.money += clinicRevenue - bills;
  state.reputation = Math.max(0, state.reputation);

  const leaving = [];
  state.patients = state.patients.filter((patient) => {
    const shouldLeave = patient.visits > 0 && rng.chance(18 + patient.visits * 5);
    if (shouldLeave) {
      leaving.push(patient);
      return false;
    }
    return true;
  });
  state.archivedPatients.push(...leaving);

  const newPatientCount = weeklyNewPatientCount(state, rng, effects);
  const styleBias = stylePatientArchetypeBias(state);
  const newPatients = Array.from({ length: newPatientCount }, () => {
    const patient = createPatient(rng, { styleBias, week: state.week, clinicalStart: state.week < 12 });
    patient.weeklyMomentum += effects.patientMomentum || 0;
    return patient;
  });
  state.patients.push(...newPatients);
  while (state.patients.length > getPatientCap(state)) {
    state.archivedPatients.push(state.patients.shift());
  }

  refreshRecruitmentOffers(state, rng);

  const mole = state.staff.find((s) => s.isMole && !s.moleRevealed);
  if (mole && state.week >= 6 && rng.chance(14)) {
    mole.moleRevealed = true;
    addWeekNote(
      {
        type: 'mole',
        title: 'Annex eyes',
        text: `${mole.name} stepped into the supply closet on a long call. ThriveWell Annex knows your suite number. Feed her well or watch what she reports.`,
      },
      state,
    );
  }

  const resolutionHtml = buildResolutionHtml({
    state,
    installed,
    staffGains,
    patientGains,
    stageChanges,
    bills,
    clinicRevenue,
    weekConsultIncome,
    newPatients,
    weeklyEvent,
    wardrobeFired,
    relationshipBeat,
    rivalEvent,
    chapterAdvance,
    seasonal,
  });

  state.pendingStageHighlights = stageChanges;

  let hasDevoted = false;
  for (const c of [...state.staff, ...state.patients]) {
    if (getAttitudeKey(c) === 'devoted') hasDevoted = true;
  }
  const staffGainTotal = staffGains.reduce((s, i) => s + i.gain, 0);
  const perfectApWeek = (state.apSpentThisWeek || 0) >= state.actionPointsMax;
  const newAchievements = checkAchievements(state, {
    staffGainWeek: staffGainTotal,
    perfectApWeek,
    hasDevoted,
  });

  const resolution = {
    week: state.week,
    challengeWeek: state.challengeWeek,
    installed,
    staffGains,
    patientGains,
    stageChanges,
    bills,
    clinicRevenue,
    newPatients,
    weeklyEvent,
    wardrobeFired,
    relationshipBeat,
    rivalEvent,
    chapterAdvance,
    seasonal,
    ending,
    newAchievements,
    html: resolutionHtml,
    weekInterrupt: getWeekInterrupt(state),
    gameOver: state.gameOver || null,
  };

  addLog({
    type: 'resolution',
    title: `Week ${state.week} resolution`,
    text: resolutionHtml,
  }, state);

  state.lastResolution = resolution;
  state.week += 1;
  state.actionPoints = state.actionPointsMax;
  state.apSpentThisWeek = 0;
  state.weekConsultIncome = 0;
  state.thisWeek = [];
  state.campaignBoost = null;
  startNewWeekChallenge(state);
  saveGame(state);

  return resolution;
}
