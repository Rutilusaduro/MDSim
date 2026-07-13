const LEDGER_CAP = 400;

export function ensureLedger(state) {
  if (!state.ledger) state.ledger = [];
}

export function recordLedger(state, { id, characterId = null, data = {} }) {
  ensureLedger(state);
  state.ledger.push({
    id,
    week: state.week,
    characterId,
    data: { ...data },
  });
  trimLedger(state);
}

export function ledgerFor(state, characterId) {
  ensureLedger(state);
  return state.ledger.filter((row) => row.characterId === characterId);
}

export function worldLedger(state) {
  ensureLedger(state);
  return state.ledger.filter((row) => row.characterId == null);
}

export function ledgerWhere(state, predicate) {
  ensureLedger(state);
  return state.ledger.filter(predicate);
}

export function dishonestChartEntries(state, characterId) {
  return ledgerFor(state, characterId).filter(
    (row) => row.id === 'chart_entry' && row.data && row.data.honest === false,
  );
}

function trimLedger(state) {
  if (state.ledger.length <= LEDGER_CAP) return;
  const overflow = state.ledger.length - LEDGER_CAP;
  const worldRows = state.ledger
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => row.characterId == null);
  const toDrop = new Set();
  for (let i = 0; i < overflow && i < worldRows.length; i += 1) {
    toDrop.add(worldRows[i].index);
  }
  if (toDrop.size < overflow) {
    for (let i = 0; i < state.ledger.length && toDrop.size < overflow; i += 1) {
      if (!toDrop.has(i)) toDrop.add(i);
    }
  }
  state.ledger = state.ledger.filter((_, index) => !toDrop.has(index));
}
