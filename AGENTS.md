# Agent instructions — IndulgeCare Clinic

## Narrative prose

All game writing (character dialogue, body descriptions, event flavor, week summaries) must follow the **Beautiful Prose** skill:

**`.cursor/skills/beautiful-prose/SKILL.md`**

### Defaults for this project

```
REGISTER: literary_modern
DENSITY: standard
HEAT: warm
```

### Before committing narrative changes

```bash
npm run lint:prose
```

### Rules that matter most here

1. **No em dashes** (`—` or ` -- `). Use periods, commas, or colons.
2. **No filler pivots** ("This isn't about X, it's about Y").
3. **Concrete and physical.** Verbs and nouns over abstractions.
4. **No therapy voice** or AI meta-commentary.
5. **Vary sentence length.** Short sentences for impact.

### Where prose lives

| File | Content |
|------|---------|
| `src/characters.js` | Body descriptions, archetype dialogue, stage summaries |
| `src/events.js` | Interaction flavor, end-of-week narrative |
| `src/state.js` | Opening log, system messages |

### Lint utility

`src/prose.js` exports `lintProse()` and `lintSourceStrings()` for programmatic checks.
