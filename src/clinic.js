import { addWeekNote, formatMoney } from './state.js';
import { getReputationBlockReason, isItemUnlockedByReputation } from './reputation.js';
import { computeRoomEffects, autoAssignNewItems } from './rooms.js';
import { styleFromPurchase, applyStylePerksToEffects } from './clinicStyle.js';

export const shopItems = [
  {
    id: 'reinforced-lounge-chairs',
    name: 'Reinforced Lounge Chairs',
    category: 'Furniture',
    cost: 900,
    install: true,
    maintenance: 35,
    tagline: 'Wide caramel leather. Low arms. Built for bodies that keep spreading.',
    description: 'Cushions hold heat and swallow soft weight. Waistbands loosen. Nobody rushes back to their feet.',
    effects: { patientGain: 0.07, reputation: 1, trust: 0.25 },
  },
  {
    id: 'plush-breakroom-couch',
    name: 'Plush Break Room Couch',
    category: 'Staff Comfort',
    cost: 1250,
    install: true,
    maintenance: 45,
    tagline: 'Deep velvet. Long lunches. Staff trays welcome.',
    description: 'Breaks stretch. Bites multiply. Rounds start late.',
    effects: { staffGain: 0.16, staffMomentum: 0.35 },
  },
  {
    id: 'wellness-vending-wall',
    name: 'Wellness Vending Wall',
    category: 'Nutrition',
    cost: 1100,
    install: true,
    maintenance: 60,
    tagline: 'Shakes, bars, cream cups behind glowing glass.',
    description: 'The machine hums. Everyone passes it. Most stop.',
    effects: { patientGain: 0.11, staffGain: 0.09, weeklyRevenue: 160 },
  },
  {
    id: 'amber-scent-system',
    name: 'Amber Appetite Diffusers',
    category: 'Atmosphere',
    cost: 675,
    install: true,
    maintenance: 25,
    tagline: 'Vanilla, toasted sugar, warm bread in every hall.',
    description: 'Smell hits before thought. Resolve softens.',
    effects: { gainMultiplier: 0.08, trust: 0.15, reputation: 1 },
  },
  {
    id: 'wide-exam-tables',
    name: 'Wider Exam Tables',
    category: 'Clinical',
    cost: 1550,
    install: true,
    maintenance: 50,
    tagline: 'Reinforced tables. Generous padding. Rose-gold rails rated for real weight.',
    description: 'The widest bodies settle in without apology, spilling past the edges while exams stay dignified.',
    effects: { patientGain: 0.06, reputation: 3, trust: 0.45 },
  },
  {
    id: 'private-recovery-nook',
    name: 'Private Recovery Nook',
    category: 'Rooms',
    cost: 1850,
    install: true,
    maintenance: 70,
    tagline: 'Curtained nook. Wide recliner. A rolling feeding cart kept warm and full.',
    description: 'Consults run long and the feeding cart runs longer. Voices drop. Cabinets empty by dusk.',
    effects: { staffGain: 0.08, patientGain: 0.1, actionPointsMax: 1 },
  },
  {
    id: 'staff-uniform-upgrade',
    name: 'Staff Uniform Upgrade Program',
    category: 'Staff Comfort',
    cost: 680,
    install: true,
    maintenance: 30,
    tagline: 'Reinforced seams. Stretch panels. Sizes through 5X.',
    description: 'Wardrobe failures drop. Staff gain confidence when buttons stop popping.',
    effects: { staffGain: 0.05, staffMomentum: 0.2 },
  },
  {
    id: 'comfort-blend-pack',
    name: 'Comfort Blend Pack',
    category: 'Compounds',
    cost: 420,
    install: false,
    stock: { comfortBlend: 6 },
    tagline: 'Six vanilla doses. Calm gut. Heavy lids.',
    description: 'Use during check-ins. Momentum follows.',
  },
  {
    id: 'appetite-tonic-pack',
    name: 'Appetite Tonic Pack',
    category: 'Compounds',
    cost: 620,
    install: false,
    stock: { appetiteTonic: 4 },
    tagline: 'Four amber vials. Second helpings feel clinical.',
    description: 'Stronger hunger. Faster results. Use when they are ready.',
  },
  {
    id: 'recovery-shake-crate',
    name: 'Recovery Shake Crate',
    category: 'Compounds',
    cost: 520,
    install: false,
    stock: { recoveryShake: 5 },
    tagline: 'Five thick shakes. Labeled for tissue support.',
    description: 'Sweet. Filling. Low risk. Reliable gain.',
  },
  {
    id: 'luxury-comfort-campaign',
    name: 'Luxury Comfort Campaign',
    category: 'Marketing',
    cost: 850,
    install: false,
    campaign: { reputation: 4, newPatients: 2 },
    tagline: 'Print ads. Generous seating. No judgment copy.',
    description: 'Curious adults call. They want a clinic that expects softness.',
  },
  {
    id: 'concierge-followups',
    name: 'Concierge Follow-Up Letters',
    category: 'Marketing',
    cost: 500,
    install: false,
    campaign: { reputation: 2, patientMomentum: 0.35 },
    tagline: 'Handwritten notes. Meal ideas. Clinic letterhead.',
    description: 'Patients return warmer. Trust rises. Resistance thins.',
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
  if (!isItemUnlockedByReputation(state, id)) {
    return { ok: false, message: getReputationBlockReason(state, id) };
  }
  if (item.install && isOwnedOrPending(state, id)) {
    return { ok: false, message: `${item.name} is already owned or awaiting installation.` };
  }
  if (state.money < item.cost) {
    return { ok: false, message: `You need ${formatMoney(item.cost - state.money)} more.` };
  }

  state.money -= item.cost;

  if (item.install) {
    state.pendingInstallations.push({ id: item.id, weekPurchased: state.week });
    styleFromPurchase(state, item.id);
    addWeekNote({
      type: 'purchase',
      title: `${item.name} ordered`,
      text: `${item.tagline} Installs end of week.`,
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
  const newIds = [];
  installed.forEach((item) => {
    if (!state.ownedUpgrades.includes(item.id)) {
      state.ownedUpgrades.push(item.id);
      newIds.push(item.id);
      if (item.effects?.actionPointsMax) {
        state.actionPointsMax += item.effects.actionPointsMax;
      }
      if (item.effects?.reputation) {
        state.reputation += item.effects.reputation;
      }
    }
  });
  autoAssignNewItems(state, newIds);
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

  const roomFx = computeRoomEffects(state);
  Object.entries(roomFx).forEach(([key, value]) => {
    if (key === 'gainMultiplier') {
      effects.gainMultiplier += value;
    } else if (key in effects) {
      effects[key] += value;
    }
  });

  if (state.ngPlusGain) {
    effects.gainMultiplier += state.ngPlusGain;
  }

  applyStylePerksToEffects(state, effects);

  return effects;
}

export function getClinicRating(state) {
  if (state.reputation >= 70) return 'Renowned gorging practice';
  if (state.reputation >= 48) return 'Beloved local clinic';
  if (state.reputation >= 32) return 'Trusted neighborhood care';
  if (state.reputation >= 18) return 'Promising new practice';
  return 'Quiet startup clinic';
}
