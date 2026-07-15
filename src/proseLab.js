import {
  archetypes,
  bodyTypes,
  defaultPreferences,
  describeCharacter,
  getAttitudeKey,
  getCharacterDialogue,
  getStageInfo,
  STAGE_MAX,
  summarizeStageChange,
  weightForStageIndex,
} from './characters.js';
import { previewInteractionFlavor, interactionCatalog } from './events.js';
import {
  composePatientAppearance,
  generatePatientAppearance,
  getPatientAppearanceSummary,
} from './patientAppearance.js';
import { getArcProgress } from './arcs.js';
import { getStaffArcScene } from './staffArcs/index.js';
import { getLoyaltyArcProgress } from './loyaltyArcs.js';
import { ALL_WEEKLY_EVENTS, WARDROBE_EVENTS } from './weeklyContent.js';
import { createRng, gameState } from './state.js';
import { renderRosterDebugPanel } from './debugTools.js';

const REPO = 'Rutilusaduro/MDSim';

export const TEXT_TYPES = [
  {
    id: 'character_dialogue',
    label: 'Character dialogue (quote)',
    files: ['src/characters.js', 'src/patientDialogue.js'],
    needsCharacter: true,
  },
  {
    id: 'character_profile',
    label: 'Character profile (full HTML)',
    files: ['src/characters.js', 'src/patientDialogue.js', 'src/patientAppearance.js'],
    needsCharacter: true,
  },
  {
    id: 'stage_description',
    label: 'Stage description (card text)',
    files: ['src/characters.js', 'src/patientAppearance.js'],
    needsCharacter: true,
  },
  {
    id: 'stage_change',
    label: 'Stage change summary',
    files: ['src/characters.js', 'src/patientDialogue.js'],
    needsCharacter: true,
  },
  {
    id: 'wardrobe_line',
    label: 'Patient wardrobe line',
    files: ['src/patientAppearance.js'],
    needsCharacter: true,
    patientOnly: true,
  },
  {
    id: 'appearance_summary',
    label: 'Patient appearance chip',
    files: ['src/patientAppearance.js'],
    needsCharacter: true,
    patientOnly: true,
  },
  {
    id: 'action_flavor',
    label: 'Interaction outcome flavor',
    files: ['src/events.js', 'src/characters.js', 'src/patientDialogue.js'],
    needsCharacter: true,
    needsAction: true,
  },
  {
    id: 'staff_arc_beat',
    label: 'Staff arc next beat',
    files: ['src/arcs.js'],
    needsCharacter: true,
    staffOnly: true,
  },
  {
    id: 'loyalty_arc_beat',
    label: 'Patient loyalty arc next beat',
    files: ['src/loyaltyArcs.js'],
    needsCharacter: true,
    patientOnly: true,
  },
  {
    id: 'weekly_event',
    label: 'Weekly event (random)',
    files: ['src/weeklyContent.js', 'src/v3WeeklyContent.js'],
    needsCharacter: false,
  },
  {
    id: 'wardrobe_event',
    label: 'Wardrobe event (random)',
    files: ['src/weeklyContent.js'],
    needsCharacter: false,
  },
  {
    id: 'body_type_line',
    label: 'Body type description (raw)',
    files: ['src/characters.js'],
    needsCharacter: true,
  },
];

export const bodyTypeKeys = Object.keys(bodyTypes);
export const archetypeKeys = Object.keys(archetypes);
export const actionKeys = Object.keys(interactionCatalog);

export const proseLabState = {
  textType: 'character_dialogue',
  characterType: 'patient',
  bodyType: 'hourglass',
  archetype: 'nurturer',
  stageIndex: 0,
  actionId: 'consult',
  eventIndex: 0,
  seed: Date.now(),
  output: '',
  outputFormat: 'text',
  vars: {},
  issueText: '',
};

export function isDebugMode() {
  if (typeof window === 'undefined') return false;
  if (new URLSearchParams(window.location.search).get('debug') === '1') return true;
  return localStorage.getItem('indulgecare-debug') === '1';
}

export function setDebugMode(enabled) {
  if (enabled) localStorage.setItem('indulgecare-debug', '1');
  else localStorage.removeItem('indulgecare-debug');
}

export function initDebugModeFromUrl() {
  if (typeof window === 'undefined') return;
  if (new URLSearchParams(window.location.search).get('debug') === '1') {
    setDebugMode(true);
  }
}

export function getTextType(id) {
  return TEXT_TYPES.find((t) => t.id === id) || TEXT_TYPES[0];
}

export function randomizeProseLabVars() {
  const rng = createRng(Date.now());
  const type = rng.pick(['patient', 'staff']);
  proseLabState.characterType = type;
  proseLabState.bodyType = rng.pick(bodyTypeKeys);
  proseLabState.archetype = rng.pick(archetypeKeys);
  proseLabState.stageIndex = rng.int(0, STAGE_MAX);
  const actions = actionKeys.filter((id) => interactionCatalog[id].scope.includes(type));
  proseLabState.actionId = rng.pick(actions.length ? actions : actionKeys);
  proseLabState.eventIndex = rng.int(0, Math.max(0, ALL_WEEKLY_EVENTS.length - 1));
  proseLabState.seed = Date.now();
  return proseLabState;
}

export function buildMockCharacter(state = proseLabState) {
  const rng = createRng(state.seed);
  const profile = bodyTypes[state.bodyType] || bodyTypes.hourglass;
  const baselineWeight = rng.int(profile.baseRange[0], profile.baseRange[1]);
  const stub = { baselineWeight, bodyType: state.bodyType };
  const weight = weightForStageIndex(stub, state.stageIndex);

  const character = {
    id: 'prose-lab-mock',
    type: state.characterType,
    name: state.characterType === 'patient' ? 'Arielle Bennett' : 'Maya Okafor',
    role: state.characterType === 'patient' ? 'gallery curator' : 'Head Nurse',
    age: rng.int(26, 48),
    ethnicity: rng.pick(['Black', 'Latina', 'East Asian', 'White', 'Mixed heritage']),
    bodyType: state.bodyType,
    archetype: state.archetype,
    baselineWeight,
    weight,
    appetite: rng.int(4, 9),
    trust: rng.int(5, 11),
    indulgence: rng.int(0, 6),
    openness: rng.int(10, 24),
    weeklyMomentum: Math.round(rng.next() * 20) / 10,
    preference: rng.pick([
      'cream pastries',
      'savory noodles',
      'buttery breads',
      'milk tea',
      'comfort casseroles',
    ]),
    preferences: defaultPreferences(),
    visits: Math.max(1, state.stageIndex),
    loyalty: Math.min(10, state.stageIndex),
    loyaltyArc: { completedBeats: [] },
    arc: { completedBeats: [] },
    seenThisWeek: false,
    consent: 'Debug mock character for prose lab.',
    lastStage: Math.max(0, state.stageIndex - 1),
  };

  if (state.characterType === 'patient') {
    character.appearance = generatePatientAppearance(rng);
  }

  return character;
}

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function generateProseLabText(state = proseLabState) {
  const textType = getTextType(state.textType);
  const character = textType.needsCharacter ? buildMockCharacter(state) : null;
  const vars = {
    textType: state.textType,
    characterType: state.characterType,
    bodyType: state.bodyType,
    archetype: state.archetype,
    archetypeLabel: archetypes[state.archetype]?.label,
    stageIndex: state.stageIndex,
    stageName: character ? getStageInfo(character).name : null,
    attitude: character ? getAttitudeKey(character) : null,
    actionId: state.actionId,
    seed: state.seed,
    characterName: character?.name,
    weight: character?.weight,
  };

  let output = '';
  let outputFormat = 'text';

  switch (state.textType) {
    case 'character_dialogue':
      output = getCharacterDialogue(character);
      break;
    case 'character_profile':
      output = describeCharacter(character);
      outputFormat = 'html';
      break;
    case 'stage_description':
      output = getStageInfo(character).description;
      break;
    case 'stage_change':
      output = summarizeStageChange(character, Math.max(0, state.stageIndex - 1), state.stageIndex);
      break;
    case 'wardrobe_line':
      output = composePatientAppearance(character, state.stageIndex).clothingLine;
      break;
    case 'appearance_summary':
      output = getPatientAppearanceSummary(character);
      break;
    case 'action_flavor':
      output = previewInteractionFlavor(character, state.actionId);
      break;
    case 'staff_arc_beat': {
      const progress = getArcProgress(character);
      if (!progress?.nextBeat) {
        output = '(No next beat — raise trust/stage or arc complete)';
        break;
      }
      const scene = getStaffArcScene(character, progress.nextBeat);
      output = scene?.opening || progress.nextBeat.title;
      break;
    }
    case 'loyalty_arc_beat': {
      const progress = getLoyaltyArcProgress(character);
      output = progress?.nextBeat?.text || '(No next beat — raise loyalty/visits or arc complete)';
      break;
    }
    case 'weekly_event': {
      const event = ALL_WEEKLY_EVENTS[state.eventIndex % ALL_WEEKLY_EVENTS.length];
      output = `${event.title}\n\n${event.text}`;
      vars.eventId = event.id;
      vars.eventTitle = event.title;
      break;
    }
    case 'wardrobe_event': {
      const event = WARDROBE_EVENTS[state.eventIndex % WARDROBE_EVENTS.length];
      output = event.text.replace('{name}', character?.name || 'She');
      vars.eventId = event.id;
      break;
    }
    case 'body_type_line':
      output = bodyTypes[state.bodyType]?.descriptions[state.stageIndex] || '';
      break;
    default:
      output = 'Unknown text type.';
  }

  state.output = output;
  state.outputFormat = outputFormat;
  state.vars = vars;
  return { output, outputFormat, vars };
}

export function buildAgentFixPrompt(issueText, state = proseLabState) {
  const textType = getTextType(state.textType);
  const plainOutput = state.outputFormat === 'html' ? stripHtml(state.output) : state.output;
  const varLines = Object.entries(state.vars)
    .filter(([, v]) => v != null)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n');

  return `Fix prose in IndulgeCare Clinic (MDSim).

## Text type
${textType.label} (\`${state.textType}\`)

## Source files
${textType.files.map((f) => `- ${f}`).join('\n')}

## Issue
${issueText.trim() || '(No explanation provided — infer from sample.)'}

## Generated sample
\`\`\`
${plainOutput}
\`\`\`

## Variables used
${varLines}

## Request
Please fix the prose generation so this issue is resolved. Match existing voice rules (patients vs staff, early-stage patient gating). Run \`npm run build\` and \`npm run lint:prose\` after edits.`;
}

export function buildFixRequestMarkdown(issueText, state = proseLabState) {
  const prompt = buildAgentFixPrompt(issueText, state);
  return `# Prose fix request

Generated: ${new Date().toISOString()}
Seed: ${state.seed}

${prompt}

---
_Paste this into Cursor Agent chat, or save this file in the repo and ask the agent to fix it._
`;
}

export function getGithubIssueUrl(issueText, state = proseLabState) {
  const textType = getTextType(state.textType);
  const title = `Prose: ${textType.label}`;
  const body = buildAgentFixPrompt(issueText, state).slice(0, 12000);
  return `https://github.com/${REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

export async function copyAgentFixPrompt(issueText, state = proseLabState) {
  const prompt = buildAgentFixPrompt(issueText, state);
  await navigator.clipboard.writeText(prompt);
  return prompt;
}

export function downloadFixRequest(issueText, state = proseLabState) {
  const md = buildFixRequestMarkdown(issueText, state);
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `prose-fix-${state.textType}-${Date.now()}.md`;
  link.click();
  URL.revokeObjectURL(url);
}

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function renderProseLabPanel() {
  const s = proseLabState;
  const textType = getTextType(s.textType);
  const showCharacter = textType.needsCharacter;
  const showAction = textType.needsAction;
  const showEvent = s.textType === 'weekly_event' || s.textType === 'wardrobe_event';
  const outputBlock =
    s.outputFormat === 'html'
      ? `<div class="rich-copy rounded-2xl border border-amber-100/10 bg-stone-950/40 p-4 text-sm leading-7 text-stone-200">${s.output}</div>`
      : `<pre class="whitespace-pre-wrap rounded-2xl border border-amber-100/10 bg-stone-950/40 p-4 text-sm leading-7 text-stone-100">${esc(s.output || 'Hit Generate to preview text.')}</pre>`;

  const varSummary = Object.entries(s.vars)
    .filter(([, v]) => v != null)
    .map(([k, v]) => `<span class="rounded-full bg-stone-800 px-2 py-1 text-xs text-stone-300">${esc(k)}: ${esc(v)}</span>`)
    .join(' ');

  return `
    <section>
      <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="ui-label">Debug tool</p>
          <h2 class="mt-1 text-3xl font-black text-stone-50">Prose Lab</h2>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-stone-400">
            Pick a text type, tune or randomize variables, preview output, then flag an issue and send it to Cursor Agent.
            Enable with <code class="text-amber-200">?debug=1</code> in the URL.
          </p>
        </div>
        <button class="dark-button rounded-2xl px-4 py-2 text-sm font-bold" data-action="toggle-debug">${isDebugMode() ? 'Debug off' : 'Debug on'}</button>
      </div>

      <div class="grid gap-6 xl:grid-cols-[22rem_1fr]">
        <div class="soft-card space-y-4 rounded-3xl p-5">
          <label class="block text-sm">
            <span class="font-bold text-amber-100">Text type</span>
            <select data-prose-field="textType" class="mt-2 w-full rounded-xl border border-amber-100/10 bg-stone-950 p-2 text-stone-200">
              ${TEXT_TYPES.map((t) => `<option value="${esc(t.id)}" ${s.textType === t.id ? 'selected' : ''}>${esc(t.label)}</option>`).join('')}
            </select>
          </label>

          ${
            showCharacter
              ? `
          <label class="block text-sm">
            <span class="font-bold text-amber-100">Character type</span>
            <select data-prose-field="characterType" class="mt-2 w-full rounded-xl border border-amber-100/10 bg-stone-950 p-2 text-stone-200">
              <option value="patient" ${s.characterType === 'patient' ? 'selected' : ''}>Patient</option>
              <option value="staff" ${s.characterType === 'staff' ? 'selected' : ''}>Staff</option>
            </select>
          </label>
          <label class="block text-sm">
            <span class="font-bold text-amber-100">Body type</span>
            <select data-prose-field="bodyType" class="mt-2 w-full rounded-xl border border-amber-100/10 bg-stone-950 p-2 text-stone-200">
              ${bodyTypeKeys.map((k) => `<option value="${esc(k)}" ${s.bodyType === k ? 'selected' : ''}>${esc(bodyTypes[k].label)}</option>`).join('')}
            </select>
          </label>
          <label class="block text-sm">
            <span class="font-bold text-amber-100">Archetype</span>
            <select data-prose-field="archetype" class="mt-2 w-full rounded-xl border border-amber-100/10 bg-stone-950 p-2 text-stone-200">
              ${archetypeKeys.map((k) => `<option value="${esc(k)}" ${s.archetype === k ? 'selected' : ''}>${esc(archetypes[k].label)}</option>`).join('')}
            </select>
          </label>
          <label class="block text-sm">
            <span class="font-bold text-amber-100">Stage index (0–${STAGE_MAX})</span>
            <input type="range" min="0" max="${STAGE_MAX}" value="${s.stageIndex}" data-prose-field="stageIndex" class="mt-2 w-full" />
            <span class="text-xs text-stone-400">Stage ${s.stageIndex + 1}</span>
          </label>
          `
              : ''
          }

          ${
            showAction
              ? `
          <label class="block text-sm">
            <span class="font-bold text-amber-100">Interaction</span>
            <select data-prose-field="actionId" class="mt-2 w-full rounded-xl border border-amber-100/10 bg-stone-950 p-2 text-stone-200">
              ${actionKeys.map((k) => `<option value="${esc(k)}" ${s.actionId === k ? 'selected' : ''}>${esc(interactionCatalog[k].label)}</option>`).join('')}
            </select>
          </label>
          `
              : ''
          }

          ${
            showEvent
              ? `
          <label class="block text-sm">
            <span class="font-bold text-amber-100">Event index</span>
            <input type="number" min="0" max="${Math.max(0, (s.textType === 'weekly_event' ? ALL_WEEKLY_EVENTS : WARDROBE_EVENTS).length - 1)}" value="${s.eventIndex}" data-prose-field="eventIndex" class="mt-2 w-full rounded-xl border border-amber-100/10 bg-stone-950 p-2 text-stone-200" />
          </label>
          `
              : ''
          }

          <label class="block text-sm">
            <span class="font-bold text-amber-100">RNG seed</span>
            <input type="number" value="${s.seed}" data-prose-field="seed" class="mt-2 w-full rounded-xl border border-amber-100/10 bg-stone-950 p-2 text-stone-200" />
          </label>

          <div class="flex flex-wrap gap-2 pt-2">
            <button class="gold-button rounded-2xl px-4 py-2 text-sm font-bold" data-action="prose-generate">Generate</button>
            <button class="dark-button rounded-2xl px-4 py-2 text-sm font-bold" data-action="prose-randomize">Randomize vars</button>
          </div>

          <p class="text-xs text-stone-500">Sources: ${textType.files.map((f) => esc(f)).join(', ')}</p>
        </div>

        <div class="space-y-5">
          <div>
            <p class="mb-2 text-sm font-bold text-amber-100">Preview</p>
            ${outputBlock}
            ${varSummary ? `<div class="mt-3 flex flex-wrap gap-2">${varSummary}</div>` : ''}
          </div>

          <div class="soft-card rounded-3xl border border-pink-400/20 p-5">
            <p class="text-sm font-bold text-pink-100">Flag issue → send to agent</p>
            <p class="mt-1 text-xs leading-5 text-stone-400">
              Describe what is wrong (e.g. "patient sounds like staff", "mentions food too early").
              Then copy a ready-made prompt for Cursor Agent, open a pre-filled GitHub issue, or download a markdown file.
            </p>
            <textarea data-prose-field="issueText" rows="4" placeholder="What's wrong with this output?" class="mt-3 w-full rounded-2xl border border-amber-100/10 bg-stone-950 p-3 text-sm text-stone-100">${esc(s.issueText)}</textarea>
            <div class="mt-4 flex flex-wrap gap-2">
              <button class="gold-button rounded-2xl px-4 py-2 text-sm font-bold" data-action="prose-copy-agent">Copy for Cursor Agent</button>
              <button class="dark-button rounded-2xl px-4 py-2 text-sm font-bold" data-action="prose-github-issue">Open GitHub issue</button>
              <button class="dark-button rounded-2xl px-4 py-2 text-sm font-bold" data-action="prose-download">Download .md</button>
            </div>
          </div>
        </div>
      </div>
      ${renderRosterDebugPanel(gameState)}
    </section>
  `;
}

export function syncProseLabFromForm(root = document) {
  root.querySelectorAll('[data-prose-field]').forEach((el) => {
    const key = el.dataset.proseField;
    if (!key || !(key in proseLabState)) return;
    if (el.type === 'range' || el.type === 'number') proseLabState[key] = Number(el.value);
    else proseLabState[key] = el.value;
  });
}
