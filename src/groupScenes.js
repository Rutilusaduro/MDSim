import { addWeekNote, spendActionPoint } from './state.js';

export const GROUP_SCENES = [
  {
    id: 'break_room_trio',
    title: 'Break Room Standoff',
    minWeek: 6,
    characters: 3,
    text: 'Three staff circle a delivery bag. Six entrees. Two desserts. Someone has to choose first.',
    choices: [
      {
        id: 'maya_leads',
        label: 'Let the hungriest go first',
        text: 'Maya tears the bag open. The others follow. Plates empty. Belts lose.',
        effect: (state, chars) => {
          const lead = chars[0];
          if (lead) {
            lead.weight += 1.4;
            lead.indulgence += 4;
          }
          chars.forEach((c) => {
            c.weight += 0.7;
            c.weeklyMomentum += 0.4;
          });
        },
      },
      {
        id: 'share_even',
        label: 'Split everything evenly',
        text: 'Equal portions. Equal guilt abandoned. Equal gain by dessert.',
        effect: (state, chars) => {
          chars.forEach((c) => {
            c.weight += 1.0;
            c.trust += 0.2;
          });
        },
      },
      {
        id: 'save_later',
        label: 'Save half for tomorrow',
        text: 'Noble plan. Fails by midnight. The fridge empties anyway.',
        effect: (state, chars) => {
          chars.forEach((c) => {
            c.weight += 0.5;
            c.appetite += 0.2;
          });
          state.money -= 40;
        },
      },
    ],
  },
  {
    id: 'lobby_confession',
    title: 'Lobby Confession Hour',
    minWeek: 9,
    characters: 3,
    text: 'Closing time. Three patients still in the lobby. One admits she comes for the chairs. The others nod.',
    choices: [
      {
        id: 'encourage',
        label: 'Encourage honesty',
        text: 'You tell them appetite is clinical here. They book follow-ups before leaving.',
        effect: (state, chars) => {
          chars.forEach((c) => {
            c.trust += 0.5;
            c.openness += 5;
            c.weight += 0.6;
          });
          state.reputation += 2;
        },
      },
      {
        id: 'treat',
        label: 'Offer a parting tray',
        text: 'Trays appear. Confessions get louder. Waistbands surrender.',
        effect: (state, chars) => {
          chars.forEach((c) => {
            c.weight += 1.2;
            c.indulgence += 3;
          });
          state.money -= 120;
        },
      },
    ],
  },
];

export function pickGroupScene(state, rng) {
  if (!state.firedEvents) state.firedEvents = [];
  if (state.staff.length < 3) return null;

  const pool = GROUP_SCENES.filter((s) => {
    if (state.firedEvents.includes(`group_${s.id}`)) return false;
    if (state.week < s.minWeek) return false;
    return true;
  });
  if (!pool.length || rng.next() > 0.28) return null;

  const scene = rng.pick(pool);
  const staff = [...state.staff].sort(() => rng.next() - 0.5).slice(0, scene.characters);
  if (staff.length < scene.characters) return null;

  return { scene, characters: staff };
}

export function applyGroupChoice(state, scene, choiceId, characters) {
  const choice = scene.choices.find((c) => c.id === choiceId);
  if (!choice) return { ok: false, message: 'Invalid choice.' };
  if (!spendActionPoint(state)) return { ok: false, message: 'No action points left.' };

  choice.effect(state, characters);
  state.firedEvents.push(`group_${scene.id}`);
  addWeekNote(
    { type: 'group', title: scene.title, text: choice.text },
    state,
  );
  return { ok: true, message: choice.text, choice };
}

export function getPendingGroupScene(state) {
  return state.pendingGroupScene || null;
}

export function setPendingGroupScene(state, payload) {
  state.pendingGroupScene = payload;
}

export function clearPendingGroupScene(state) {
  state.pendingGroupScene = null;
}
