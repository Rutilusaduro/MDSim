import { getAchievementProgress } from '../../achievements.js';
import { e } from '../dom.js';

export function renderAchievements(state) {
  const progress = getAchievementProgress(state);
  return `
    <section>
      <div class="mb-5">
        <p class="text-sm text-amber-200/70">Milestones</p>
        <h2 class="mt-2 text-3xl font-black text-stone-50">Achievements</h2>
        <p class="mt-2 text-stone-300">${progress.unlocked} / ${progress.total} unlocked</p>
      ${progress.unlocked === 0 ? `<p class="mt-2 text-sm text-stone-400">The wall above the filing cabinet is bare. First frame goes up when the first week closes.</p>` : ''}
      </div>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        ${progress.list
          .map(
            (a) => `
          <article class="soft-card rounded-3xl p-4 ${a.done ? 'border-amber-300/30' : 'opacity-70'}">
            <div class="flex items-start justify-between gap-2">
              <h4 class="font-bold text-stone-50">${e(a.name)}</h4>
              <span class="text-xs ${a.done ? 'text-emerald-300' : 'text-stone-500'}">${a.done ? 'Done' : 'Locked'}</span>
            </div>
            <p class="mt-2 text-sm text-stone-300">${e(a.desc)}</p>
          </article>
        `,
          )
          .join('')}
      </div>
    </section>
  `;
}

