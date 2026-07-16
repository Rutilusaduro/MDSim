import { e } from './dom.js';

/**
 * Scene presentation tiers (TENX B8):
 *   sheet    - routine results, rendered inline where they happened
 *   page     - a scene on paper: title as chart tab, serif prose,
 *              choices as written lines
 *   ceremony - the screen goes dark around the page; the scene's own
 *              choices are the only way out
 */

const CEREMONY_PREFIXES = ['warming_confession', 'confession_', 'mole_flip', 'rung_immobility', 'ending_', 'audit_'];

export function sceneTier(sceneId) {
  if (CEREMONY_PREFIXES.some((p) => (sceneId || '').startsWith(p))) return 'ceremony';
  return 'page';
}

function choiceLine(choice, action) {
  const meta = [
    choice.hint ? e(choice.hint) : null,
    choice.apCost ? `${choice.apCost} AP` : null,
  ]
    .filter(Boolean)
    .join(' · ');
  return `
    <button class="scene-choice" data-action="${e(action)}" data-choice="${e(choice.id)}">
      <span class="scene-choice-label">${e(choice.label)}</span>
      ${meta ? `<span class="scene-choice-meta">${meta}</span>` : ''}
    </button>`;
}

/**
 * Render a resolved scene as a paper page.
 * opts: { kicker, subline, choiceAction, tier }
 */
export function renderScenePage(scene, opts = {}) {
  const tier = opts.tier || sceneTier(scene.id);
  const paragraphs = String(scene.opening || '')
    .split(/\n\n+/)
    .map((p) => `<p>${e(p)}</p>`)
    .join('');
  const page = `
    <div class="scene-page paper-surface p-6 md:p-8">
      <p class="ui-label" style="color: var(--ink-soft)">${e(opts.kicker || 'Scene')}</p>
      <h2 class="scene-title">${e(scene.title)}</h2>
      ${opts.subline ? `<p class="mt-1 text-sm" style="color: var(--ink-soft)">${e(opts.subline)}</p>` : ''}
      <div class="prose-page mt-5">${paragraphs}</div>
      <div class="mt-6 grid gap-1">
        ${(scene.choices || []).map((c) => choiceLine(c, opts.choiceAction || 'scene-choice')).join('')}
      </div>
      ${scene.epilogue ? `<p class="prose-page mt-5 text-sm italic">${e(scene.epilogue)}</p>` : ''}
    </div>`;
  if (tier === 'ceremony') {
    return `<div class="ceremony">${page}</div>`;
  }
  return page;
}
