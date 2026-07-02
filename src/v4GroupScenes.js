export const V4_GROUP_SCENES = [
  {
    id: 'exam_trio',
    title: 'Exam Room Snack Debate',
    minWeek: 7,
    characters: 3,
    text: 'Three staff duck into an exam room with a forbidden snack tray. Someone knocks. Nobody moves.',
    choices: [
      {
        id: 'share',
        label: 'Open the door and share',
        text: 'You join them. Professional pretense dies. Trays empty. Scrubs tighten.',
        effect: (state, chars) => {
          chars.forEach((c) => {
            c.weight += 0.9;
            c.trust += 0.25;
          });
        },
      },
      {
        id: 'hide',
        label: 'Let them finish in secret',
        text: 'They eat faster. Guiltless. Fuller. The knock was a patient anyway.',
        effect: (state, chars) => {
          chars.forEach((c) => {
            c.weight += 0.7;
            c.indulgence += 2;
          });
        },
      },
    ],
  },
  {
    id: 'vending_raid',
    title: 'Vending Wall Raid',
    minWeek: 8,
    characters: 3,
    text: 'The vending wall restocks at dawn. Three staff "supervise" the delivery. Bags disappear.',
    choices: [
      {
        id: 'stock_break',
        label: 'Redirect to break room',
        text: 'Official policy: break room only. Unofficial result: everyone gains.',
        effect: (state, chars) => {
          chars.forEach((c) => {
            c.weight += 1.1;
            c.weeklyMomentum += 0.35;
          });
        },
      },
      {
        id: 'sell_patient',
        label: 'Mark up for patients',
        text: 'You sell bars at markup. Patients buy. Staff sample "quality control."',
        effect: (state, chars) => {
          state.money += 180;
          chars.forEach((c) => (c.weight += 0.6));
        },
      },
    ],
  },
  {
    id: 'scale_bet',
    title: 'Break Room Bet',
    minWeek: 10,
    characters: 3,
    text: 'Someone revives the break room scale as a game. Highest number buys dinner. Everyone wins weight.',
    choices: [
      {
        id: 'encourage',
        label: 'Sponsor the pot',
        text: 'You add cash to the pot. Appetites spike. Dignity optional.',
        effect: (state, chars) => {
          state.money -= 100;
          chars.forEach((c) => {
            c.weight += 1.3;
            c.openness += 4;
          });
        },
      },
      {
        id: 'observe',
        label: 'Watch quietly',
        text: 'You observe for "morale research." Notes include waist measurements.',
        effect: (state, chars) => {
          chars.forEach((c) => {
            c.weight += 0.85;
            c.indulgence += 2;
          });
        },
      },
    ],
  },
  {
    id: 'patient_trio_lobby',
    title: 'Lobby Regulars Club',
    minWeek: 11,
    characters: 3,
    scope: 'patient',
    text: 'Three loyal patients compare notes on which chair molds best to their hips. They start a club.',
    choices: [
      {
        id: 'charter',
        label: 'Charter the club',
        text: 'Official regulars board. Snack dues mandatory. Loyalty spikes.',
        effect: (state, chars) => {
          chars.forEach((c) => {
            c.loyalty = Math.min(10, (c.loyalty || 0) + 2);
            c.weight += 0.8;
            c.trust += 0.3;
          });
          state.reputation += 2;
        },
      },
      {
        id: 'tray',
        label: 'Fund a welcome tray',
        text: 'You fund a tray. They recruit a fourth before dessert.',
        effect: (state, chars) => {
          state.money -= 90;
          chars.forEach((c) => {
            c.weight += 1.0;
            c.indulgence += 3;
          });
        },
      },
    ],
  },
  {
    id: 'annex_spies',
    title: 'Annex Spies Eat Here',
    minWeek: 12,
    characters: 3,
    text: 'Three staff spot rival-clinic moles in the lobby. Solution: feed them until they defect.',
    choices: [
      {
        id: 'feed',
        label: 'Feed them into loyalty',
        text: 'Trays appear. Moles stay. ThriveWell loses another spy.',
        effect: (state, chars) => {
          chars.forEach((c) => {
            c.weight += 0.75;
            c.trust += 0.2;
          });
          if (state.rivalState) state.rivalState.reputation -= 2;
          state.reputation += 3;
        },
      },
      {
        id: 'confront',
        label: 'Confront with pastry',
        text: 'Confrontation via pastry tray. Hostile. Delicious. Effective.',
        effect: (state, chars) => {
          chars.forEach((c) => (c.openness += 3));
          state.reputation += 2;
        },
      },
    ],
  },
];
