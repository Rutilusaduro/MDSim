export const AUDIT_GAME_OVER = {
  id: 'audit_shutdown',
  title: 'State Board Audit',
  text: 'Investigators found charts that did not match the waiting room. Feeding logs. Widened door receipts. Your license is suspended. The clinic closes.',
};

export function checkAuditGameOver(state) {
  if (state.gameOver) return state.gameOver;
  if ((state.coverRating ?? 100) <= 0) {
    state.gameOver = { ...AUDIT_GAME_OVER, week: state.week };
    return state.gameOver;
  }
  return null;
}

export function isGameOver(state) {
  return Boolean(state.gameOver);
}
