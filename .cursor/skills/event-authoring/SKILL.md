---
name: event-authoring
description: Guidelines for writing IndulgeCare weekly events, wardrobe beats, and relationship scenes. Use with Beautiful Prose skill.
---

# Event Authoring (IndulgeCare)

Use alongside **Beautiful Prose** (`literary_modern`, `HEAT: warm`).

## Event types

| Type | Length | Tone |
|------|--------|------|
| Weekly random | 1–2 sentences + mechanical effect | Concrete, clinic-grounded |
| Wardrobe strain | 1–2 sentences | Embarrassment → acceptance arc |
| Relationship beat | 2–4 sentences | Personality-driven, physical detail |
| Arc scene | 3–6 sentences | Slow burn, staff-specific |

## Rules

- Name the body part or garment when relevant: button, seam, waistband, couch.
- Effects must map to existing stats: weight, trust, openness, momentum, indulgence.
- No insurance, billing, or clinical detachment.
- No em dashes. No filler pivots.

## File locations

- `src/weeklyContent.js` — pool definitions
- `src/arcs.js` — staff arc beats

Run `npm run lint:prose` after edits.
