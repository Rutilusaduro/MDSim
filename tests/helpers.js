/**
 * Test helpers: localStorage shim (installed before any src import)
 * and a minimal week driver for building fixtures without the sim.
 */

const store = new Map();

if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => {
      store.set(key, String(value));
    },
    removeItem: (key) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}

export function clearStorage() {
  store.clear();
}

/** Advance a game N weeks with no visits or purchases. */
export async function playWeeks(state, weeks) {
  const { endWeek } = await import('../src/events.js');
  for (let i = 0; i < weeks; i += 1) {
    endWeek(state);
  }
  return state;
}
