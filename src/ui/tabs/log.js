import { e } from '../dom.js';

export function renderLog(state) {
  const notes = state.thisWeek.length
    ? state.thisWeek
    : [{ title: 'Quiet week', text: 'No notes yet. Spend AP or end the week.' }];
  return `
    <section>
      <div class="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm text-amber-200/70">Narrative feed</p>
          <h2 class="mt-2 text-3xl font-black text-stone-50">This Week</h2>
        </div>
        <div class="flex gap-3">
          <button class="dark-button rounded-2xl px-4 py-3 text-sm font-bold" data-action="export-week">Export Week</button>
          <button class="dark-button rounded-2xl px-4 py-3 text-sm font-bold" data-action="save">Save Game</button>
          <button class="dark-button rounded-2xl px-4 py-3 text-sm font-bold" data-action="load">Load Game</button>
          <button class="dark-button rounded-2xl px-4 py-3 text-sm font-bold" data-action="new-game">New Game</button>
        </div>
      </div>
      <div class="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <div class="glass-panel rounded-[2rem] p-5">
          <h3 class="text-xl font-bold text-amber-100">Current week notes</h3>
          <div class="mt-4 space-y-4">
            ${notes
              .map(
                (note) => `
                  <article class="soft-card rounded-3xl p-4">
                    <h4 class="font-bold text-stone-50">${e(note.title)}</h4>
                    <p class="mt-2 text-sm leading-7 text-stone-300">${e(note.text)}</p>
                  </article>
                `,
              )
              .join('')}
          </div>
        </div>
        <div class="glass-panel rounded-[2rem] p-5">
          <h3 class="text-xl font-bold text-amber-100">Clinic archive</h3>
          <div class="mt-4 max-h-[45rem] space-y-4 overflow-auto pr-1">
            ${state.log
              .map(
                (entry) => `
                  <article class="soft-card rounded-3xl p-4">
                    <p class="ui-label">Week ${entry.week} - ${e(entry.type)}</p>
                    <h4 class="mt-1 font-bold text-stone-50">${e(entry.title)}</h4>
                    <div class="rich-copy mt-2 text-sm">${entry.type === 'resolution' ? entry.text : `<p>${e(entry.text)}</p>`}</div>
                  </article>
                `,
              )
              .join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

