import { describe, expect, it } from 'vitest';
import './helpers.js';
import { createNewGame, createRng } from '../src/state.js';
import {
  bodyTypes,
  createPatient,
  describeCharacter,
  weightForStageIndex,
  STAGE_COUNT,
} from '../src/characters.js';
import { VISIT_ACTIONS } from '../src/patientVisit.js';
import { getVisitNarrative, getVisitOpening, getVisitClosing, getWeighRitualReaction } from '../src/patientVisitDialogue.js';
import { SCENE_CATALOG } from '../src/scenes/catalog.js';
import { buildSceneContext, resolveScene } from '../src/sceneEngine/index.js';

const BAD_TEXT = /undefined|\[object|NaN|\{\w+\}/;

function patientAt({ bodyType = 'pear', stageIndex = 0, framing = 'clinical' } = {}) {
  const rng = createRng(1234);
  const patient = createPatient(rng, { bodyType, week: 1 });
  patient.weight = weightForStageIndex(patient, stageIndex) + 1;
  if (framing === 'clinical_plus') patient.visits = 2;
  if (framing === 'warming') patient.indulgence = 35;
  if (framing === 'complicit') patient.indulgence = 60;
  return patient;
}

describe('describeCharacter sweep', () => {
  const cells = [];
  for (const bodyType of Object.keys(bodyTypes)) {
    for (let stage = 0; stage < STAGE_COUNT; stage += 1) cells.push([bodyType, stage]);
  }

  it.each(cells)('%s stage %i renders clean prose', (bodyType, stage) => {
    const patient = patientAt({ bodyType, stageIndex: stage });
    const text = describeCharacter(patient);
    expect(typeof text).toBe('string');
    expect(text.length).toBeGreaterThan(10);
    expect(text).not.toMatch(BAD_TEXT);
  });
});

describe('visit narrative sweep', () => {
  const FRAMINGS = ['clinical', 'clinical_plus', 'warming', 'complicit'];
  const ATTITUDES = ['early', 'mid', 'late', 'immobile', 'blob'];

  it('every action x framing x attitude renders without artifacts', () => {
    for (const action of VISIT_ACTIONS) {
      for (const framing of FRAMINGS) {
        for (const attitude of ATTITUDES) {
          const state = createNewGame({ seed: 555 });
          const patient = patientAt({ framing });
          const { narrative, reply } = getVisitNarrative(state, action.id, patient, attitude);
          expect(typeof narrative, `${action.id}/${framing}/${attitude}`).toBe('string');
          expect(typeof reply).toBe('string');
          expect(narrative).not.toMatch(BAD_TEXT);
          expect(reply).not.toMatch(BAD_TEXT);
        }
      }
    }
  });

  it('core actions always produce visible text', () => {
    const CORE = ['say_hi', 'review_chart', 'offer_water', 'weigh_patient'];
    for (const actionId of CORE) {
      for (const framing of ['clinical', 'warming', 'complicit']) {
        const state = createNewGame({ seed: 777 });
        const patient = patientAt({ framing, stageIndex: framing === 'complicit' ? 5 : 1 });
        const { narrative, reply } = getVisitNarrative(state, actionId, patient, 'mid');
        expect(
          (narrative + reply).trim().length,
          `${actionId} at ${framing} rendered empty`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it('openings, closings, and weigh reactions render at every framing', () => {
    for (const framing of FRAMINGS) {
      const state = createNewGame({ seed: 999 });
      const patient = patientAt({ framing, stageIndex: framing === 'complicit' ? 5 : 1 });
      for (const text of [
        getVisitOpening(state, patient),
        getVisitClosing(state, patient, {}),
        getWeighRitualReaction(state, patient),
      ]) {
        expect(text.length, framing).toBeGreaterThan(0);
        expect(text).not.toMatch(BAD_TEXT);
      }
    }
  });
});

describe('scene catalog sweep', () => {
  const sceneIds = Object.keys(SCENE_CATALOG);

  it.each(sceneIds)('%s resolves with clean text and choices', (sceneId) => {
    const state = createNewGame({ seed: 4242 });
    const patient = patientAt({ framing: 'warming', stageIndex: 4 });
    state.patients.push(patient);
    const ctx = buildSceneContext(state, patient);
    const scene = resolveScene(sceneId, ctx);
    expect(scene, sceneId).toBeTruthy();
    expect(scene.opening.trim().length).toBeGreaterThan(0);
    expect(scene.opening).not.toMatch(BAD_TEXT);
    expect(Array.isArray(scene.choices)).toBe(true);
    for (const choice of scene.choices) {
      expect(choice.label).not.toMatch(BAD_TEXT);
      expect(choice.outcome).not.toMatch(BAD_TEXT);
    }
  });
});
