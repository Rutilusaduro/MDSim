import { getStageIndex, staffCandidateSummary } from '../../characters.js';
import { COVER_OPS, getCoverOpAvailability } from '../../coverOps.js';
import { shopItems } from '../../clinic.js';
import { PUBLIC_CLINIC_TAGLINE } from '../../patientFraming.js';
import { getRecruitmentPanel } from '../../recruitment.js';
import { getReputationBlockReason, isItemUnlockedByReputation } from '../../reputation.js';
import { renderSilhouette } from '../../silhouettes.js';
import { formatMoney } from '../../state.js';
import { bodyTypesLabel } from '../components.js';
import { e } from '../dom.js';

function renderRecruitmentSection(state) {
  const { slot, candidates, upcoming, moleSlot } = getRecruitmentPanel(state);
  if (!slot && !upcoming.some((u) => !u.unlocked)) return '';

  const candidateHtml = slot
    ? `
      <p class="mt-2 text-sm text-stone-300">Open role: <strong>${e(slot.label)}</strong>. Same story arc every run; face and figure change. Pick who you want at the desk.</p>
      ${moleSlot ? '<p class="mt-2 text-xs text-red-200">This position draws outside attention. Hire carefully.</p>' : ''}
      <div class="mt-4 grid gap-4 md:grid-cols-3">
        ${candidates
          .map((candidate) => {
            const stageIdx = getStageIndex(candidate);
            return `
          <article class="soft-card flex flex-col rounded-3xl p-4">
            <div class="text-pink-300">${renderSilhouette(candidate, stageIdx)}</div>
            <h4 class="mt-2 text-lg font-bold text-stone-50">${e(candidate.name)}</h4>
            <p class="text-sm text-stone-300">${e(staffCandidateSummary(candidate))}</p>
            <p class="mt-1 text-xs text-stone-400">${e(bodyTypesLabel(candidate))} · ${e(candidate.archetype)}</p>
            <button class="gold-button mt-4 rounded-2xl px-4 py-2 text-sm font-bold" data-action="hire-candidate" data-id="${e(candidate.id)}">
              Hire · 1 AP · ${formatMoney(slot.hireCost || 0)}
            </button>
          </article>`;
          })
          .join('')}
      </div>`
    : '';

  const pipeline = upcoming.length
    ? `<p class="mt-4 text-xs text-stone-400">Coming roles: ${upcoming
        .map((u) => `${u.label}${u.unlocked ? '' : ` (wk ${u.unlock?.week || '?'}+)`}`)
        .join(' · ')}</p>`
    : '';

  return `
    <section class="mb-8 rounded-[2rem] border border-emerald-300/15 bg-emerald-950/15 p-6">
      <p class="text-sm text-emerald-200/70">Staff recruitment</p>
      <h3 class="mt-1 text-2xl font-black text-stone-50">Build the roster</h3>
      <p class="mt-2 max-w-3xl text-sm text-stone-300">${e(PUBLIC_CLINIC_TAGLINE)} Hire credentialed staff for intake, vitals, and charting. A full roster keeps the schedule moving.</p>
      ${candidateHtml || '<p class="mt-3 text-sm text-stone-400">No open roles this week. Grow reputation and advance the calendar to unlock hiring.</p>'}
      ${pipeline}
    </section>
  `;
}


function renderCoverOpsPanel(state) {
  const heat = state.heat || 0;
  return `
    <div class="soft-card mb-8 rounded-3xl p-5">
      <p class="ui-label">Cover</p>
      <h3 class="mt-1 text-xl font-bold text-stone-50">Keep the story straight</h3>
      <p class="mt-1 text-sm text-stone-400">Heat <span class="chart-num">${heat}</span> · cover <span class="chart-num">${state.coverRating ?? 100}</span>. Every fix below leaves its own paper.</p>
      <div class="mt-4 grid gap-3 md:grid-cols-3">
        ${COVER_OPS.map((op) => {
          const check = getCoverOpAvailability(state, op.id);
          return `
            <button class="soft-card rounded-2xl p-4 text-left ${check.ok ? '' : 'opacity-45'}" data-action="cover-op" data-id="${op.id}" ${check.ok ? '' : 'disabled'}>
              <div class="flex items-start justify-between gap-2">
                <strong class="text-sm text-stone-50">${e(op.label)}</strong>
                <span class="text-xs text-amber-100">${op.apCost} AP${op.moneyCost ? ` · $${op.moneyCost}` : ''}</span>
              </div>
              <p class="mt-1 text-xs leading-5 text-stone-400">${e(op.description)}</p>
              <p class="mt-2 text-xs ${check.ok ? 'text-emerald-200' : 'text-stone-500'}">${e(check.ok ? op.hint : check.reason)}</p>
            </button>`;
        }).join('')}
      </div>
    </div>`;
}

export function renderManagement(state) {
  const categories = [...new Set(shopItems.map((item) => item.category))];
  return `
    <section>
      ${renderRecruitmentSection(state)}
      ${renderCoverOpsPanel(state)}
      <div class="mb-5">
        <p class="text-sm text-amber-200/70">Management phase</p>
        <h2 class="mt-2 text-3xl font-black text-stone-50">Buy before the week turns</h2>
        <p class="mt-2 max-w-3xl text-stone-300">Money only. No AP. Furniture lands end of week. Stock and campaigns apply now.</p>
      </div>
      <div class="space-y-8">
        ${categories
          .map((category) => {
            const items = shopItems.filter((item) => item.category === category);
            return `
              <div>
                <h3 class="mb-3 text-xl font-bold text-amber-100">${e(category)}</h3>
                <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  ${items.map((item) => renderShopCard(state, item)).join('')}
                </div>
              </div>
            `;
          })
          .join('')}
      </div>
    </section>
  `;
}


function renderShopCard(state, item) {
  const owned = state.ownedUpgrades.includes(item.id);
  const pending = state.pendingInstallations.some((entry) => entry.id === item.id);
  const repBlocked = !isItemUnlockedByReputation(state, item.id);
  const disabled = owned || pending || state.money < item.cost || repBlocked;
  const status = owned
    ? 'Owned'
    : pending
      ? 'Installing'
      : repBlocked
        ? 'Locked'
        : formatMoney(item.cost);
  return `
    <article class="soft-card flex min-h-72 flex-col rounded-3xl p-5 transition duration-200">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="ui-label">${e(item.category)}</p>
          <h4 class="mt-1 text-xl font-black text-stone-50">${e(item.name)}</h4>
        </div>
        <span class="rounded-full bg-amber-300/12 px-3 py-1 text-sm font-bold text-amber-100">${status}</span>
      </div>
      <p class="mt-4 text-sm font-semibold leading-6 text-amber-50">${e(item.tagline)}</p>
      <p class="mt-3 flex-1 text-sm leading-6 text-stone-300">${e(item.description)}</p>
      ${repBlocked ? `<p class="mt-2 text-xs text-amber-200">${e(getReputationBlockReason(state, item.id))}</p>` : ''}
      <button class="mt-5 rounded-2xl px-4 py-3 font-bold transition ${disabled ? 'dark-button' : 'gold-button hover:scale-[1.01]'}" data-action="buy" data-id="${e(item.id)}" ${disabled ? 'disabled' : ''}>
        ${owned ? 'Installed' : pending ? 'Arrives End Week' : repBlocked ? 'Locked' : `Buy - ${formatMoney(item.cost)}`}
      </button>
    </article>
  `;
}

