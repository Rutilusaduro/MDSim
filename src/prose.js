/**
 * Beautiful Prose skill integration for IndulgeCare Clinic.
 * Style contract: concrete, verb-forward, no em dashes, no AI filler.
 */

export const GAME_PROSE = {
  register: 'literary_modern',
  density: 'standard',
  heat: 'warm',
};

const EM_DASH = /—|\s--\s/;

const BANNED_TRANSITIONS = [
  'at its core',
  "in today's world",
  'in a world where',
  'that said',
  "let's explore",
  'ultimately',
  'what this means is',
  "it's important to note",
  'on the one hand',
];

const BANNED_THERAPY = [
  'i hear you',
  'that sounds hard',
  "you're valid",
  'give yourself grace',
  'be kind to yourself',
];

const BANNED_META = [
  'in this essay',
  'this piece explores',
  'as a writer',
  'we will discuss',
  'here are the key takeaways',
];

const REVERSAL_PATTERNS = [
  /this isn'?t about .+?\.?\s*it'?s about/i,
  /it'?s not .+?,\s*it'?s /i,
  /not .+? but .+/i,
];

/**
 * @param {string} text
 * @returns {{ rule: string; detail: string }[]}
 */
export function lintProse(text) {
  if (!text || typeof text !== 'string') return [];

  const violations = [];
  const lower = text.toLowerCase();

  if (EM_DASH.test(text)) {
    violations.push({ rule: 'em-dash', detail: 'Em dashes are banned. Use periods, commas, or colons.' });
  }

  for (const phrase of BANNED_TRANSITIONS) {
    if (lower.includes(phrase)) {
      violations.push({ rule: 'filler-transition', detail: `Banned phrase: "${phrase}"` });
    }
  }

  for (const phrase of BANNED_THERAPY) {
    if (lower.includes(phrase)) {
      violations.push({ rule: 'therapy-voice', detail: `Banned phrase: "${phrase}"` });
    }
  }

  for (const phrase of BANNED_META) {
    if (lower.includes(phrase)) {
      violations.push({ rule: 'meta-commentary', detail: `Banned phrase: "${phrase}"` });
    }
  }

  for (const pattern of REVERSAL_PATTERNS) {
    if (pattern.test(text)) {
      violations.push({ rule: 'reversal-pivot', detail: 'Banned "not X, Y" reversal pattern.' });
    }
  }

  return violations;
}

/**
 * Scan narrative source files for prose violations in string literals.
 * @param {string} source
 * @param {string} fileLabel
 * @returns {{ file: string; line: number; text: string; violations: ReturnType<typeof lintProse> }[]}
 */
export function lintSourceStrings(source, fileLabel) {
  const results = [];
  const lines = source.split('\n');
  const stringPattern = /'([^'\\]|\\.)*'|"([^"\\]|\\.)*"|`([^`\\]|\\.)*`/g;

  lines.forEach((line, index) => {
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;

    let match;
    while ((match = stringPattern.exec(line)) !== null) {
      const raw = match[0];
      const unquoted = raw.slice(1, -1);
      if (unquoted.length < 24) continue;
      if (!/[a-zA-Z]{4,}/.test(unquoted)) continue;

      const violations = lintProse(unquoted);
      if (violations.length) {
        results.push({
          file: fileLabel,
          line: index + 1,
          text: unquoted.slice(0, 120) + (unquoted.length > 120 ? '…' : ''),
          violations,
        });
      }
    }
  });

  return results;
}

/**
 * Join prose fragments with a single space. Prefer short declarative beats.
 * @param {...string} parts
 */
export function stitch(...parts) {
  return parts.filter(Boolean).join(' ');
}
