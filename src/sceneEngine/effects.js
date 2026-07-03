import { addWeekNote } from '../state.js';
import { applyCharacterEffects } from '../mechanics/applyEffects.js';

export function applySceneEffects(state, character, effects = {}, meta = {}) {
  applyCharacterEffects(state, character, effects, meta);
}

export function recordSceneNote(state, title, text, choiceId) {
  addWeekNote(
    {
      type: 'scene',
      title,
      text,
      choiceId,
    },
    state,
  );
}
