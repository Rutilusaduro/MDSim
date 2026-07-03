import { ledgerWhere } from './memoryLedger.js';

const ECHO_LINES = {
  chair_collapse: 'She eyed the reinforced chair. The one with the story.',
  doorway_wedge: 'She paused at the wide doorway. Someone had that frame opened once.',
  scale_overload: 'Her eyes flicked to the heavy-duty scale in the corner. It remembers names.',
};

export function worldEcho(state, patient) {
  const rows = ledgerWhere(
    state,
    (row) =>
      row.characterId === patient.id ||
      (row.characterId == null && ['chair_collapse', 'doorway_wedge', 'scale_overload'].includes(row.id)),
  );
  if (!rows.length) return '';
  const latest = rows[rows.length - 1];
  return ECHO_LINES[latest.id] || '';
}
