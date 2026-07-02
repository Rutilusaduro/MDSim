import { MAYA_ARC } from './maya.js';
import { ELENA_ARC } from './elena.js';
import { PRIYA_ARC } from './priya.js';
import { NADIA_ARC } from './nadia.js';
import { JASMINE_ARC } from './jasmine.js';
import { PROCEDURAL_ARC } from './procedural.js';
import { getArcContext, resolveScene, formatArcSceneNote, applyChoiceFlags, getRouteLabel } from './engine.js';

export const STAFF_ARC_SCENES = {
  maya: MAYA_ARC,
  elena: ELENA_ARC,
  priya: PRIYA_ARC,
  nadia: NADIA_ARC,
  jasmine: JASMINE_ARC,
};

export function getStaffArcScene(character, beat) {
  const ctx = getArcContext(character, beat.id);
  const key = character.arcSlot || legacyArcKeyForName(character.name);
  const named = STAFF_ARC_SCENES[key]?.[beat.id];
  if (named) return resolveScene(named, ctx);
  const procedural = PROCEDURAL_ARC[beat.id];
  return resolveScene(procedural, ctx);
}

function legacyArcKeyForName(name) {
  const map = {
    'Maya Okafor': 'maya',
    'Elena Ruiz': 'elena',
    'Priya Shah': 'priya',
    'Nadia Volkov': 'nadia',
    'Jasmine Brooks': 'jasmine',
  };
  return map[name] || null;
}

export { formatArcSceneNote, applyChoiceFlags, getRouteLabel };
