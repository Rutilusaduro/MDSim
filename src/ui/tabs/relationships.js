import { e } from '../dom.js';
import { getRelationshipWeb, renderRelationshipGraphSvg } from '../../relationships.js';

export function renderRelationships(state) {
  const edges = getRelationshipWeb(state);
  return `
    <section>
      <div class="mb-5">
        <p class="text-sm text-amber-200/70">Staff dynamics</p>
        <h2 class="mt-2 text-3xl font-black text-stone-50">Relationship web</h2>
        <p class="mt-2 text-stone-300">${edges.length} active edges. Green = admires, pink = envies.</p>
      </div>
      <div class="soft-card mb-6 rounded-3xl p-4">${renderRelationshipGraphSvg(state)}</div>
      <div class="grid gap-4 md:grid-cols-2">
        ${edges
          .map(
            (edge) => `
          <article class="soft-card rounded-3xl p-4">
            <p class="text-xs uppercase tracking-widest ${edge.type === 'admires' ? 'text-emerald-300' : 'text-pink-300'}">${e(edge.type)}</p>
            <h4 class="mt-1 font-bold text-stone-50">${e(edge.from)} → ${e(edge.to)}</h4>
            <p class="mt-2 text-sm text-stone-300">${e(edge.note)}</p>
            ${
              edge.history.length
                ? `<ul class="mt-3 space-y-1 text-xs text-stone-400">${edge.history.map((h) => `<li>Week ${h.week}: ${e(h.title)}</li>`).join('')}</ul>`
                : ''
            }
          </article>
        `,
          )
          .join('')}
      </div>
    </section>
  `;
}

