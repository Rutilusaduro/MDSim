import { addWeekNote, formatMoney } from './state.js';

export const shopItems = [
  {
    id: 'reinforced-lounge-chairs',
    name: 'Reinforced Lounge Chairs',
    category: 'Furniture',
    cost: 900,
    install: true,
    maintenance: 35,
    tagline: 'Wide caramel leather seats that make every waiting-room visit feel slow and safe.',
    description:
      'Patients settle in deeper, linger longer, and leave faint warm impressions in the cushions.',
    effects: { patientGain: 0.07, reputation: 1, trust: 0.25 },
  },
  {
    id: 'plush-breakroom-couch',
    name: 'Plush Break Room Couch',
    category: 'Staff Comfort',
    cost: 1250,
    install: true,
    maintenance: 45,
    tagline: 'A deep velvet couch for long lunches, warm naps, and staff-only trays.',
    description:
      'Staff breaks become softer and more indulgent, with cushions that encourage another bite before returning to rounds.',
    effects: { staffGain: 0.16, staffMomentum: 0.35 },
  },
  {
    id: 'wellness-vending-wall',
    name: 'Wellness Vending Wall',
    category: 'Nutrition',
    cost: 1100,
    install: true,
    maintenance: 60,
    tagline: 'A glowing wall of fortified shakes, honeyed bars, and creamy "recovery" snacks.',
    description:
      'The machine hums like a promise. Everyone passes it; almost everyone leaves with something rich in hand.',
    effects: { patientGain: 0.11, staffGain: 0.09, weeklyRevenue: 95 },
  },
  {
    id: 'amber-scent-system',
    name: 'Amber Appetite Diffusers',
    category: 'Atmosphere',
    cost: 675,
    install: true,
    maintenance: 25,
    tagline: 'Subtle notes of vanilla, toasted sugar, and warm bread in every hallway.',
    description:
      'The clinic smells quietly irresistible, softening resolve before anyone notices.',
    effects: { gainMultiplier: 0.08, trust: 0.15, reputation: 1 },
  },
  {
    id: 'wide-exam-tables',
    name: 'Wider Exam Tables',
    category: 'Clinical',
    cost: 1550,
    install: true,
    maintenance: 50,
    tagline: 'Warm, reinforced exam tables with generous padding and rose-gold rails.',
    description:
      'Check-ups feel dignified at any size, and larger bodies are treated as expected, welcome, and beautiful.',
    effects: { patientGain: 0.06, reputation: 3, trust: 0.45 },
  },
  {
    id: 'private-recovery-nook',
    name: 'Private Recovery Nook',
    category: 'Rooms',
    cost: 1850,
    install: true,
    maintenance: 70,
    tagline: 'A curtained room with a recliner, dim lights, blankets, and a warmed snack cabinet.',
    description:
      'One-on-one care becomes intimate and unhurried, especially after comfort-focused consultations.',
    effects: { staffGain: 0.08, patientGain: 0.1, actionPointsMax: 1 },
  },
  {
    id: 'comfort-blend-pack',
    name: 'Comfort Blend Pack',
    category: 'Compounds',
    cost: 420,
    install: false,
    stock: { comfortBlend: 6 },
    tagline: 'Six doses of vanilla supplement powder for calm appetite and heavy rest.',
    description:
      'Best used during personal check-ins or patient care plans to increase weekly momentum.',
  },
  {
    id: 'appetite-tonic-pack',
    name: 'Appetite Tonic Pack',
    category: 'Compounds',
    cost: 620,
    install: false,
    stock: { appetiteTonic: 4 },
    tagline: 'Four amber vials that make second helpings feel medically reasonable.',
    description:
      'A stronger option for patients or staff who are ready to lean into fuller appetites.',
  },
  {
    id: 'recovery-shake-crate',
    name: 'Recovery Shake Crate',
    category: 'Compounds',
    cost: 520,
    install: false,
    stock: { recoveryShake: 5 },
    tagline: 'Five rich shakes labeled for energy restoration and soft-tissue support.',
    description:
      'Reliable, sweet, and warmly filling. A low-risk boost to weekly gain.',
  },
  {
    id: 'luxury-comfort-campaign',
    name: 'Luxury Comfort Campaign',
    category: 'Marketing',
    cost: 850,
    install: false,
    campaign: { reputation: 4, newPatients: 2 },
    tagline: 'Glossy ads promising compassionate care, generous seating, and no judgment.',
    description:
      'Draws curious adult patients who want a clinic where comfort is treated as medicine.',
  },
  {
    id: 'concierge-followups',
    name: 'Concierge Follow-Up Letters',
    category: 'Marketing',
    cost: 500,
    install: false,
    campaign: { reputation: 2, patientMomentum: 0.35 },
    tagline: 'Handwritten reminders with meal suggestions, soft encouragement, and elegant branding.',
    description:
      'Patients feel personally seen and return warmer, more trusting, and more receptive.',
  },
];

export function getItem(id) {
  return shopItems.find((item) => item.id === id);
}

export function isOwnedOrPending(state, id) {
  return state.ownedUpgrades.includes(id) || state.pendingInstallations.some((item) => item.id === id);
}

export function buyManagementItem(state, id) {
  const item = getItem(id);
  if (!item) return { ok: false, message: 'Unknown purchase.' };
  if (item.install && isOwnedOrPending(state, id)) {
    return { ok: false, message: `${item.name} is already owned or awaiting installation.` };
  }
  if (state.money < item.cost) {
    return { ok: false, message: `You need ${formatMoney(item.cost - state.money)} more.` };
  }

  state.money -= item.cost;

  if (item.install) {
    state.pendingInstallations.push({ id: item.id, weekPurchased: state.week });
    addWeekNote({
      type: 'purchase',
      title: `${item.name} ordered`,
      text: `${item.tagline} Installation is scheduled for the end of the week.`,
    }, state);
    return { ok: true, message: `${item.name} ordered for ${formatMoney(item.cost)}.` };
  }

  if (item.stock) {
    Object.entries(item.stock).forEach(([key, amount]) => {
      state.inventory[key] = (state.inventory[key] || 0) + amount;
    });
    addWeekNote({
      type: 'purchase',
      title: `${item.name} stocked`,
      text: `${item.description}`,
    }, state);
  }

  if (item.campaign) {
    state.reputation += item.campaign.reputation || 0;
    state.campaignBoost = {
      newPatients: (state.campaignBoost?.newPatients || 0) + (item.campaign.newPatients || 0),
      patientMomentum:
        (state.campaignBoost?.patientMomentum || 0) + (item.campaign.patientMomentum || 0),
    };
    addWeekNote({
      type: 'purchase',
      title: `${item.name} launched`,
      text: `${item.description}`,
    }, state);
  }

  return { ok: true, message: `${item.name} purchased for ${formatMoney(item.cost)}.` };
}

export function applyPendingInstallations(state) {
  const installed = state.pendingInstallations.map((pending) => getItem(pending.id)).filter(Boolean);
  installed.forEach((item) => {
    if (!state.ownedUpgrades.includes(item.id)) {
      state.ownedUpgrades.push(item.id);
      if (item.effects?.actionPointsMax) {
        state.actionPointsMax += item.effects.actionPointsMax;
      }
      if (item.effects?.reputation) {
        state.reputation += item.effects.reputation;
      }
    }
  });
  state.pendingInstallations = [];
  return installed;
}

export function computeClinicEffects(state) {
  const effects = {
    gainMultiplier: 1,
    staffGain: 0,
    patientGain: 0,
    staffMomentum: 0,
    patientMomentum: state.campaignBoost?.patientMomentum || 0,
    trust: 0,
    reputation: 0,
    weeklyRevenue: 0,
    newPatients: state.campaignBoost?.newPatients || 0,
    maintenance: 0,
  };

  state.ownedUpgrades
    .map(getItem)
    .filter(Boolean)
    .forEach((item) => {
      effects.maintenance += item.maintenance || 0;
      Object.entries(item.effects || {}).forEach(([key, value]) => {
        if (key === 'gainMultiplier') {
          effects.gainMultiplier += value;
        } else if (key in effects) {
          effects[key] += value;
        }
      });
    });

  return effects;
}

export function getClinicRating(state) {
  if (state.reputation >= 70) return 'Renowned comfort practice';
  if (state.reputation >= 48) return 'Beloved local clinic';
  if (state.reputation >= 32) return 'Trusted neighborhood care';
  if (state.reputation >= 18) return 'Promising new practice';
  return 'Quiet startup clinic';
}
