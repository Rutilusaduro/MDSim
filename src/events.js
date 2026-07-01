import {
  addLog,
  addWeekNote,
  formatMoney,
  rngForState,
  saveGame,
  spendActionPoint,
} from './state.js';
import { applyPendingInstallations, computeClinicEffects } from './clinic.js';
import {
  createPatient,
  getAttitudeKey,
  getCharacterDialogue,
  getGainTemperament,
  getStageIndex,
  getStageInfo,
  summarizeStageChange,
} from './characters.js';

export const interactionCatalog = {
  consult: {
    label: 'Standard Comfort Consultation',
    scope: ['patient'],
    money: 225,
    description: 'Earns income, builds trust, and frames comfort as a serious care goal.',
  },
  personalTalk: {
    label: 'Private Staff Check-In',
    scope: ['staff'],
    description: 'A warm one-on-one talk that makes the staff member feel seen and safe.',
  },
  cateredBreak: {
    label: 'Catered Break Tray',
    scope: ['staff'],
    cost: 180,
    description: 'A quiet staff-only spread of rich favorites and generous portions.',
  },
  comfortPlan: {
    label: 'Holistic Comfort Plan',
    scope: ['staff', 'patient'],
    cost: 90,
    description: 'Personalized advice: slower evenings, richer meals, and permission to be full.',
  },
  comfortBlend: {
    label: 'Use Comfort Blend',
    scope: ['staff', 'patient'],
    inventory: 'comfortBlend',
    description: 'A vanilla powder that supports calm appetite, warmth, and heavy rest.',
  },
  appetiteTonic: {
    label: 'Use Appetite Tonic',
    scope: ['staff', 'patient'],
    inventory: 'appetiteTonic',
    description: 'An amber dose for participants ready to enjoy stronger hunger cues.',
  },
  recoveryShake: {
    label: 'Use Recovery Shake',
    scope: ['staff', 'patient'],
    inventory: 'recoveryShake',
    description: 'A creamy shake that makes nourishment feel restorative and professional.',
  },
};

export function findCharacter(state, id) {
  return [...state.staff, ...state.patients].find((character) => character.id === id);
}

export function getInteractionOptions(state, character) {
  return Object.entries(interactionCatalog)
    .filter(([, action]) => action.scope.includes(character.type))
    .map(([id, action]) => {
      const inventoryMissing = action.inventory && (state.inventory[action.inventory] || 0) <= 0;
      const moneyMissing = action.cost && state.money < action.cost;
      return {
        id,
        ...action,
        disabled:
          state.actionPoints <= 0 ||
          inventoryMissing ||
          moneyMissing ||
          (id === 'consult' && character.seenThisWeek),
        reason:
          state.actionPoints <= 0
            ? 'No AP remaining'
            : inventoryMissing
              ? 'Out of stock'
              : moneyMissing
                ? 'Insufficient funds'
                : id === 'consult' && character.seenThisWeek
                  ? 'Already seen this week'
                  : '',
      };
    });
}

function actionFlavor(character, actionId) {
  const stage = getStageInfo(character);
  const name = character.name;
  const dialogue = getCharacterDialogue(character);
  const preference = character.preference;
  const attitude = getAttitudeKey(character);
  const early = attitude === 'professional' || attitude === 'noticing';
  const mid = attitude === 'hungry' || attitude === 'pleased';

  const copy = {
    consult: early
      ? `${name} leaves the consultation on schedule, satisfied with the visit and easy to talk to. She mentions liking the clinic atmosphere. "${dialogue}"`
      : mid
        ? `${name} lingers a moment after the consult, still thinking about food and the way her clothes fit lately. "${dialogue}"`
        : `${name} leaves glowing, clearly enjoying how her body fills the chair and the conversation alike. The talk drifts to ${preference} and how good it feels to stop holding back. "${dialogue}"`,
    personalTalk: early
      ? `${name} settles into the check-in easily — professional, warm, happy to be here. She talks about the team and how much she likes the work. "${dialogue}"`
      : mid
        ? `${name} opens up more than usual, venting about hunger, tighter scrubs, and not understanding what her body is doing. "${dialogue}"`
        : `${name} relaxes completely into the private talk, speaking openly about weight, appetite, and how much she is starting to want more. "${dialogue}"`,
    cateredBreak: early
      ? `${name} enjoys the break-room spread politely, chatting with coworkers between bites of ${preference}.`
      : mid
        ? `${name} demolishes the catered tray faster than she meant to, surprised by her own appetite. ${preference} disappears first.`
        : `The catered tray arrives glossy and fragrant. ${name} lingers over ${preference}, growing drowsy and pleased as her ${stage.bodyType.toLowerCase()} body settles heavier into the break-room cushions.`,
    comfortPlan: early
      ? `${name} listens to the wellness advice with a nod — sensible, routine, nothing she would think twice about.`
      : mid
        ? `${name} receives the comfort plan and goes quiet, already imagining richer meals and softer evenings.`
        : `${name} takes the plan like a gift: richer snacks, slower nights, and full permission to keep growing. Her expression turns openly eager.`,
    comfortBlend: early
      ? `${name} drinks the supplement without fuss, remarking that it tastes fine.`
      : mid
        ? `The Comfort Blend goes down easy. ${name} blinks, suddenly aware of how hungry she already is again.`
        : `The Comfort Blend tastes of vanilla cream and warm sleep. ${name} drinks slowly, one hand resting near her middle as the clinic seems to soften around her.`,
    appetiteTonic: early
      ? `${name} takes the tonic as directed, treating it like any other clinic supplement.`
      : mid
        ? `The amber tonic hits fast. ${name} exhales, embarrassed by how immediately she wants lunch.`
        : `The amber tonic leaves a honeyed heat behind. ${name} blushes at the sudden clarity of wanting more, then laughs softly at how natural it feels.`,
    recoveryShake: early
      ? `${name} finishes the shake between tasks, appreciative but otherwise unchanged.`
      : mid
        ? `${name} holds the recovery shake with both hands and does not want it to end. By the last sip she looks heavier-lidded and hungry.`
        : `${name} takes the recovery shake in both hands, savoring its thick sweetness. By the final sip she looks steadier, warmer, and pleasantly heavy-lidded.`,
  };

  return copy[actionId];
}

export function performInteraction(state, characterId, actionId) {
  const character = findCharacter(state, characterId);
  const action = interactionCatalog[actionId];
  if (!character || !action) return { ok: false, message: 'That interaction is unavailable.' };
  const option = getInteractionOptions(state, character).find((item) => item.id === actionId);
  if (option?.disabled) return { ok: false, message: option.reason };
  if (!spendActionPoint(state)) return { ok: false, message: 'No action points remain.' };

  if (action.cost) state.money -= action.cost;
  if (action.inventory) state.inventory[action.inventory] -= 1;

  switch (actionId) {
    case 'consult':
      state.money += action.money;
      state.reputation += 1;
      character.visits += 1;
      character.seenThisWeek = true;
      character.trust += 0.65;
      character.openness += 2.5;
      character.weeklyMomentum += 0.65;
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
    default:
      break;
  }

  const text = actionFlavor(character, actionId);
  addWeekNote({
    type: 'interaction',
    title: `${action.label}: ${character.name}`,
    text,
  }, state);

  return { ok: true, message: text };
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
  newPatients,
}) {
  const installedText = installed.length
    ? `By Sunday evening, ${installed.map((item) => item.name).join(', ')} settles into the clinic like it always belonged there.`
    : 'No new installations arrive this week, leaving the clinic to hum with its existing comforts.';

  const bestStaff = staffGains.slice().sort((a, b) => b.gain - a.gain)[0];
  const bestPatient = patientGains.slice().sort((a, b) => b.gain - a.gain)[0];
  const stageText = stageChanges.length
    ? stageChanges.map((change) => `<p><strong>${change.name}</strong>: ${change.text}</p>`).join('')
    : '<p>No one crosses a formal stage threshold this week. Maybe a button sits tighter, maybe someone mentions being hungry — small changes, easy to shrug off.</p>';

  const closingTone =
    state.week <= 3
      ? `${newPatients.length} new patients join the roster, referred by word of mouth. The clinic feels busy, normal, promising.`
      : `${newPatients.length} new patients join the waiting list, drawn by the clinic's growing reputation for attentive, generous care.`;

  return `
    <p>${installedText}</p>
    <p>The clinic ends Week ${state.week} with the low hum of a good workweek behind it. ${
      bestStaff
        ? `<strong>${bestStaff.name}</strong> is up ${bestStaff.gain.toFixed(1)} lb since last Sunday.`
        : ''
    } ${
      bestPatient
        ? `<strong>${bestPatient.name}</strong> leaves ${bestPatient.gain.toFixed(1)} lb heavier after this week's visits.`
        : ''
    }</p>
    ${stageText}
    <p>Billing closes with ${formatMoney(clinicRevenue)} in clinic revenue and ${formatMoney(bills)} in rent, salaries, supplies, and upkeep. ${closingTone}</p>
  `;
}

export function endWeek(state) {
  const rng = rngForState(state);
  const installed = applyPendingInstallations(state);
  const effects = computeClinicEffects(state);
  const staffGains = [];
  const patientGains = [];
  const stageChanges = [];

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

  const clinicRevenue = effects.weeklyRevenue;
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

  const newPatientCount = Math.min(5, 2 + Math.floor(state.reputation / 28) + (effects.newPatients || 0) + rng.int(0, 1));
  const newPatients = Array.from({ length: newPatientCount }, () => {
    const patient = createPatient(rng);
    patient.weeklyMomentum += effects.patientMomentum || 0;
    return patient;
  });
  state.patients.push(...newPatients);
  while (state.patients.length > 10) {
    state.archivedPatients.push(state.patients.shift());
  }

  const resolutionHtml = buildResolutionHtml({
    state,
    installed,
    staffGains,
    patientGains,
    stageChanges,
    bills,
    clinicRevenue,
    newPatients,
  });

  const resolution = {
    week: state.week,
    installed,
    staffGains,
    patientGains,
    stageChanges,
    bills,
    clinicRevenue,
    newPatients,
    html: resolutionHtml,
  };

  addLog({
    type: 'resolution',
    title: `Week ${state.week} resolution`,
    text: resolutionHtml,
  }, state);

  state.lastResolution = resolution;
  state.week += 1;
  state.actionPoints = state.actionPointsMax;
  state.thisWeek = [];
  state.campaignBoost = null;
  saveGame(state);

  return resolution;
}
