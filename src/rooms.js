import { getItem } from './clinic.js';

export const ROOMS = [
  {
    id: 'waiting',
    name: 'Waiting Lounge',
    blurb: 'Patients linger. Waistbands loosen before the exam.',
    slots: 2,
  },
  {
    id: 'break',
    name: 'Break Room',
    blurb: 'Staff trays, couch naps, shared calories.',
    slots: 2,
  },
  {
    id: 'exam',
    name: 'Exam Suite',
    blurb: 'Clinical dignity. Generous tables. Long consults.',
    slots: 2,
  },
  {
    id: 'lobby',
    name: 'Lobby',
    blurb: 'First impressions. Scent, seating, appetite.',
    slots: 2,
  },
];

export const ITEM_ROOM_AFFINITY = {
  'reinforced-lounge-chairs': 'waiting',
  'plush-breakroom-couch': 'break',
  'wellness-vending-wall': 'break',
  'amber-scent-system': 'lobby',
  'wide-exam-tables': 'exam',
  'private-recovery-nook': 'exam',
  'staff-uniform-upgrade': 'break',
};

const ROOM_BONUS_MULT = 0.35;

export function defaultRoomLayout() {
  return { waiting: [], break: [], exam: [], lobby: [] };
}

export function ensureRooms(state) {
  if (!state.rooms) state.rooms = defaultRoomLayout();
  for (const room of ROOMS) {
    if (!state.rooms[room.id]) state.rooms[room.id] = [];
  }
}

export function getRoom(roomId) {
  return ROOMS.find((r) => r.id === roomId);
}

export function getAssignableItems(state) {
  ensureRooms(state);
  const assigned = new Set(Object.values(state.rooms).flat());
  return state.ownedUpgrades.filter((id) => ITEM_ROOM_AFFINITY[id] && !assigned.has(id));
}

export function autoAssignNewItems(state, itemIds) {
  ensureRooms(state);
  for (const id of itemIds) {
    const preferred = ITEM_ROOM_AFFINITY[id];
    if (!preferred) continue;
    const room = state.rooms[preferred];
    const cap = getRoom(preferred)?.slots || 2;
    if (room.length < cap && !room.includes(id)) {
      room.push(id);
    } else {
      for (const r of ROOMS) {
        if (state.rooms[r.id].length < r.slots && !state.rooms[r.id].includes(id)) {
          state.rooms[r.id].push(id);
          break;
        }
      }
    }
  }
}

export function assignItemToRoom(state, itemId, roomId) {
  ensureRooms(state);
  if (!state.ownedUpgrades.includes(itemId)) {
    return { ok: false, message: 'You do not own that upgrade.' };
  }
  if (!ITEM_ROOM_AFFINITY[itemId]) {
    return { ok: false, message: 'Compounds and campaigns are not room-placed.' };
  }
  const room = getRoom(roomId);
  if (!room) return { ok: false, message: 'Unknown room.' };

  for (const r of ROOMS) {
    state.rooms[r.id] = state.rooms[r.id].filter((id) => id !== itemId);
  }
  if (state.rooms[roomId].length >= room.slots) {
    return { ok: false, message: `${room.name} is full (${room.slots} slots).` };
  }
  state.rooms[roomId].push(itemId);
  return { ok: true, message: `Placed ${getItem(itemId)?.name || itemId} in ${room.name}.` };
}

export function computeRoomEffects(state) {
  ensureRooms(state);
  const effects = {
    gainMultiplier: 0,
    staffGain: 0,
    patientGain: 0,
    staffMomentum: 0,
    patientMomentum: 0,
    trust: 0,
    reputation: 0,
    weeklyRevenue: 0,
  };

  for (const room of ROOMS) {
    const items = (state.rooms[room.id] || [])
      .map(getItem)
      .filter(Boolean);
    if (!items.length) continue;

    const roomMult = 1 + (items.length - 1) * 0.08;
    items.forEach((item) => {
      Object.entries(item.effects || {}).forEach(([key, value]) => {
        if (key === 'actionPointsMax') return;
        if (key in effects) {
          effects[key] += value * ROOM_BONUS_MULT * roomMult;
        }
      });
    });
  }

  return effects;
}

export function getRoomBonusSummary(state) {
  ensureRooms(state);
  return ROOMS.map((room) => {
    const items = (state.rooms[room.id] || []).map(getItem).filter(Boolean);
    return {
      room,
      items,
      filled: items.length,
      slots: room.slots,
    };
  });
}
