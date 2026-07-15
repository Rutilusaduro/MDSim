import { getItem } from '../../clinic.js';
import { ROOMS, getRoomBonusSummary } from '../../rooms.js';
import { e } from '../dom.js';

export function renderFloorPlan(state) {
  const summary = getRoomBonusSummary(state);
  const unassigned = state.ownedUpgrades.filter((id) => !Object.values(state.rooms || {}).flat().includes(id));
  return `
    <section>
      <div class="mb-5">
        <p class="text-sm text-amber-200/70">Clinic layout</p>
        <h2 class="mt-2 text-3xl font-black text-stone-50">Floor plan</h2>
        <p class="mt-2 max-w-3xl text-stone-300">Assign owned furniture to rooms for stacked bonuses (~35% of item effects per placement).</p>
      </div>
      <div class="grid gap-5 md:grid-cols-2">
        ${summary
          .map(
            ({ room, items, filled, slots }) => `
          <article class="soft-card rounded-3xl p-5" data-drop-room="${e(room.id)}">
            <h3 class="text-xl font-bold text-amber-100">${e(room.name)}</h3>
            <p class="mt-1 text-sm text-stone-400">${e(room.blurb)}</p>
            <p class="mt-2 text-xs text-stone-500">${filled} / ${slots} slots · drop items here</p>
            <ul class="mt-4 min-h-16 space-y-2 rounded-2xl border border-dashed border-amber-100/15 p-3 text-sm text-stone-300">
              ${items.length ? items.map((i) => `<li class="draggable-chip cursor-grab rounded-xl bg-stone-900/60 px-2 py-1" draggable="true" data-drag-item="${e(i.id)}">${e(i.name)}</li>`).join('') : '<li class="text-stone-500">Empty — drag furniture here</li>'}
            </ul>
          </article>
        `,
          )
          .join('')}
      </div>
      ${
        unassigned.length
          ? `
        <div class="mt-8">
          <h3 class="mb-3 text-xl font-bold text-amber-100">Unassigned upgrades</h3>
          <div class="grid gap-3 md:grid-cols-2">
            ${unassigned
              .map((id) => {
                const item = getItem(id);
                return `
              <div class="soft-card draggable-chip cursor-grab rounded-2xl p-4" draggable="true" data-drag-item="${e(id)}">
                <p class="font-bold text-stone-50">${e(item?.name || id)}</p>
                <p class="mt-2 text-xs text-stone-500">Drag to a room or use buttons</p>
                <div class="mt-3 flex flex-wrap gap-2">
                  ${ROOMS.map(
                    (r) => `
                    <button class="dark-button rounded-xl px-3 py-2 text-xs font-bold" data-action="assign-room" data-item="${e(id)}" data-room="${e(r.id)}">
                      → ${e(r.name)}
                    </button>
                  `,
                  ).join('')}
                </div>
              </div>`;
              })
              .join('')}
          </div>
        </div>`
          : ''
      }
    </section>
  `;
}

