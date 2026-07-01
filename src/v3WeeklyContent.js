export const V3_WEEKLY_EVENTS = [
  {
    id: 'holiday_feast',
    title: 'Holiday Feast Tray',
    weight: 0.9,
    seasonal: 'winter',
    text: 'A donor sends a holiday feast tray. Staff and patients share. Portion control dies with the first bite.',
    effect: (state) => {
      [...state.staff, ...state.patients].forEach((c) => {
        c.weight += 0.5 + Math.random() * 0.8;
        c.indulgence += 1;
      });
    },
  },
  {
    id: 'ice_cream_truck',
    title: 'Ice Cream Truck',
    weight: 0.85,
    seasonal: 'summer',
    text: 'An ice cream truck parks outside. Someone orders for the whole lobby. Sticky fingers. Fuller middles.',
    effect: (state) => {
      state.patients.forEach((p) => {
        p.weight += 0.6;
        p.trust += 0.15;
      });
    },
  },
  {
    id: 'corporate_sabotage',
    title: 'Wellness Retreat Flyer',
    weight: 0.8,
    text: 'A corporate wellness retreat flyer lands on your desk. "Detox weekend." Staff use it as a placemat for pizza.',
    effect: (state) => {
      state.reputation += 1;
      state.staff.forEach((s) => {
        s.openness += 2;
        s.weight += 0.4;
      });
    },
  },
  {
    id: 'pastry_wall',
    title: 'Pastry Wall Install',
    weight: 0.7,
    rivalCounter: 'juice_bar',
    text: 'You commission a pastry wall for the lobby. ThriveWell Annex goes quiet for a day.',
    effect: (state) => {
      state.reputation += 3;
      state.patients.forEach((p) => {
        p.weeklyMomentum += 0.35;
      });
    },
  },
  {
    id: 'blogger_visit',
    title: 'Blogger Visit',
    weight: 0.75,
    text: 'A food blogger films in the waiting lounge. Your chairs trend. Three new patients call before lunch.',
    effect: (state) => {
      state.reputation += 4;
    },
  },
  {
    id: 'mole_defection',
    title: 'Mole Defection',
    weight: 0.6,
    minWeek: 5,
    text: 'A patient admits she was sent from ThriveWell. She stayed for the vending wall. She wants an appointment card.',
    effect: (state) => {
      if (state.rivalState) state.rivalState.reputation = Math.max(12, state.rivalState.reputation - 3);
      state.reputation += 2;
    },
  },
  {
    id: 'caterer_convention',
    title: 'Caterer Convention',
    weight: 0.85,
    text: 'A caterer convention books the block. Sample trays flood the break room. Nobody skips.',
    effect: (state) => {
      state.staff.forEach((s) => {
        s.weight += 1.0 + Math.random() * 0.5;
      });
    },
  },
  {
    id: 'button_crisis',
    title: 'Button Crisis Monday',
    weight: 0.7,
    text: 'Three staff report button failures before nine a.m. Safety pins sell out at the corner store.',
    effect: (state) => {
      state.staff.forEach((s) => {
        s.openness += 2;
        s.weeklyMomentum += 0.5;
      });
      if (state.stats) state.stats.wardrobeEvents = (state.stats.wardrobeEvents || 0) + 1;
    },
  },
  {
    id: 'donor_brunch',
    title: 'Donor Brunch',
    weight: 0.8,
    text: 'A donor hosts brunch in your lobby. Quiche. Pastries. Patients arrive early and stay late.',
    effect: (state) => {
      state.money += 200;
      state.patients.forEach((p) => {
        p.weight += 0.7;
        p.trust += 0.2;
      });
    },
  },
  {
    id: 'midnight_delivery',
    title: 'Midnight Delivery',
    weight: 0.65,
    text: 'A midnight supply delivery includes "bonus" dessert crates. Staff on late shift find them. Morning shift finds crumbs.',
    effect: (state) => {
      state.staff.forEach((s) => {
        s.weight += 0.55;
        s.appetite += 0.1;
      });
    },
  },
  {
    id: 'vip_lounge',
    title: 'VIP Waiting Upgrade',
    weight: 0.6,
    rivalCounter: 'poach_attempt',
    text: 'You rope off a VIP waiting corner with heated seats and a private snack cabinet. Regulars pretend not to notice. They notice.',
    effect: (state) => {
      state.reputation += 3;
      state.patients.filter((p) => (p.loyalty || 0) >= 3).forEach((p) => {
        p.trust += 0.4;
        p.loyalty = Math.min(10, (p.loyalty || 0) + 1);
      });
    },
  },
  {
    id: 'staff_bakeoff',
    title: 'Staff Bake-Off',
    weight: 0.9,
    text: 'Nadia declares a staff bake-off. Nobody wins. Everyone eats. The couch suffers.',
    effect: (state) => {
      state.staff.forEach((s) => {
        s.weight += 0.9;
        s.trust += 0.15;
      });
    },
  },
  {
    id: 'scale_removed',
    title: 'Scale Removed',
    weight: 0.7,
    text: 'Someone removes the break room scale. Morale rises. Snack runs rise faster.',
    effect: (state) => {
      state.staff.forEach((s) => {
        s.indulgence += 2;
        s.weeklyMomentum += 0.3;
      });
    },
  },
  {
    id: 'food_truck_friday',
    title: 'Food Truck Friday',
    weight: 0.85,
    text: 'You invite a food truck for Friday lunch. The line wraps into the exam hall.',
    effect: (state) => {
      [...state.staff, ...state.patients].forEach((c) => {
        if (Math.random() > 0.3) c.weight += 0.65;
      });
      state.money -= 80;
    },
  },
  {
    id: 'annex_rumor',
    title: 'Annex Rumor Mill',
    weight: 0.75,
    minWeek: 4,
    text: 'Rumor: ThriveWell patients sneak over for your vending wall. Reputation ticks up without ad spend.',
    effect: (state) => {
      state.reputation += 2;
      if (state.rivalState) state.rivalState.reputation -= 1;
    },
  },
];

export const SEASONAL_WEEKS = [
  {
    id: 'winter',
    name: 'Feast Season',
    months: [11, 12, 1],
    eventBoost: 'winter',
    modifier: 'Double food event weight. Wardrobe strain +10%.',
  },
  {
    id: 'summer',
    name: 'Ice Cream Summer',
    months: [6, 7, 8],
    eventBoost: 'summer',
    modifier: 'Patient trust gains +15% from events.',
  },
];

export const V3_RELATIONSHIP_BEATS = [
  {
    id: 'maya_priya_chart',
    title: 'Chart Compare',
    pair: ['Maya Okafor', 'Priya Shah'],
    minWeek: 7,
    text: 'Priya shows Maya her appetite graph. Maya shows her waist. They order takeout to celebrate.',
    effect: (state, chars) => {
      chars.forEach((c) => {
        c.weight += 0.7;
        c.trust += 0.2;
      });
    },
  },
  {
    id: 'elena_jasmine_lobby',
    title: 'Lobby Gossip',
    pair: ['Elena Ruiz', 'Jasmine Brooks'],
    minWeek: 6,
    text: 'Elena and Jasmine rate patient outfits in whispers. Then rate their own. Then order matching lunches.',
    effect: (state, chars) => {
      chars.forEach((c) => {
        c.openness += 3;
        c.weight += 0.55;
      });
    },
  },
  {
    id: 'nadia_jasmine_budget',
    title: 'Snack Budget Victory',
    pair: ['Nadia Volkov', 'Jasmine Brooks'],
    minWeek: 9,
    text: 'Nadia wins a budget fight for premium snacks. Jasmine is first to tear the box open.',
    effect: (state, chars) => {
      chars.forEach((c) => {
        c.indulgence += 2;
        c.weight += 0.85;
      });
    },
  },
  {
    id: 'full_roster_lunch',
    title: 'Full Roster Lunch',
    pair: ['Maya Okafor', 'Elena Ruiz', 'Priya Shah', 'Nadia Volkov'],
    minWeek: 10,
    text: 'Four staff claim one long lunch table. Plates stack. Phones go dark. Nobody returns on time.',
    effect: (state, chars) => {
      chars.forEach((c) => {
        c.weight += 1.0;
        c.trust += 0.25;
      });
    },
  },
];

export function getActiveSeasonalWeek(state) {
  const month = ((state.week - 1) % 12) + 1;
  return SEASONAL_WEEKS.find((s) => s.months.includes(month)) || null;
}
