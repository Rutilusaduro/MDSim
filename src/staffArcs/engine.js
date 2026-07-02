/** Multipath staff arc resolver: flags, prior choices, gated branches. */

export function getArcContext(character, beatId = null) {
  const arc = character.arc || {};
  return {
    firstName: character.name.split(' ')[0],
    choices: { ...(arc.choices || {}) },
    flags: new Set(arc.flags || []),
    beatId,
  };
}

function hasFlags(ctx, flags = []) {
  return flags.every((flag) => ctx.flags.has(flag));
}

function lacksFlags(ctx, flags = []) {
  return flags.every((flag) => !ctx.flags.has(flag));
}

function hasChoice(ctx, requirements = []) {
  return requirements.every(({ beat, choice }) => ctx.choices[beat] === choice);
}

function resolveText(value, ctx) {
  if (typeof value === 'function') return value(ctx);
  return value ?? '';
}

function choiceAvailable(ctx, choice) {
  const req = choice.requires;
  if (!req) return true;
  if (req.flags?.length && !hasFlags(ctx, req.flags)) return false;
  if (req.notFlags?.length && !lacksFlags(ctx, req.notFlags)) return false;
  if (req.choices?.length && !hasChoice(ctx, req.choices)) return false;
  return true;
}

export function resolveScene(raw, ctx) {
  if (!raw) return null;

  const opening = resolveText(raw.opening, ctx);
  const choices = (raw.choices || [])
    .filter((choice) => choiceAvailable(ctx, choice))
    .map((choice) => ({
      ...choice,
      label: resolveText(choice.label, ctx),
      outcome: resolveText(choice.outcome, ctx),
      hint: choice.hint ? resolveText(choice.hint, ctx) : '',
    }));

  return {
    opening,
    choices,
    epilogue: raw.epilogue ? resolveText(raw.epilogue, ctx) : '',
  };
}

export function formatArcSceneNote(opening, outcome, epilogue = '') {
  const parts = [opening, outcome, epilogue].filter(Boolean);
  return parts.join('\n\n');
}

export function applyChoiceFlags(character, choice) {
  if (!character.arc) character.arc = { completedBeats: [], choices: {}, flags: [] };
  if (!character.arc.flags) character.arc.flags = [];
  if (!character.arc.choices) character.arc.choices = {};

  const newFlags = choice.setsFlags || [];
  for (const flag of newFlags) {
    if (!character.arc.flags.includes(flag)) character.arc.flags.push(flag);
  }
}

export function getRouteLabel(character) {
  const flags = character.arc?.flags || [];
  if (!flags.length) return null;
  const route = flags.find((f) => f.endsWith('_route'));
  if (!route) return null;
  return route.replace(/_/g, ' ').replace(' route', '');
}
