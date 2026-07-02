import { MAYA_ARC } from './maya.js';
import { ELENA_ARC } from './elena.js';
import { PRIYA_ARC } from './priya.js';
import { NADIA_ARC } from './nadia.js';
import { JASMINE_ARC } from './jasmine.js';
import { PROCEDURAL_ARC } from './procedural.js';
import { getArcContext, resolveScene, formatArcSceneNote, applyChoiceFlags, getRouteLabel } from './engine.js';

export const STAFF_ARC_SCENES = {
  'Maya Okafor': MAYA_ARC,
  'Elena Ruiz': ELENA_ARC,
  'Priya Shah': PRIYA_ARC,
  'Nadia Volkov': NADIA_ARC,
  'Jasmine Brooks': JASMINE_ARC,
};

export function getStaffArcScene(character, beat) {
  const ctx = getArcContext(character, beat.id);
  const named = STAFF_ARC_SCENES[character.name]?.[beat.id];
  if (named) return resolveScene(named, ctx);
  const procedural = PROCEDURAL_ARC[beat.id];
  return resolveScene(procedural, ctx);
}

export { formatArcSceneNote, applyChoiceFlags, getRouteLabel };
