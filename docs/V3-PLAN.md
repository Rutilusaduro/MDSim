# IndulgeCare Clinic — V3 Plan (for review)

**Status:** Implemented on branch `cursor/v3-full-implementation-59c3`. See `docs/V1-V2-AUDIT.md` and `docs/V4-PLAN.md`.

**Note:** Insurance and medical billing sim mechanics are **explicitly out of scope** per design direction. Economy stays fun, tactile, and fetish-forward.

---

## V3 vision

V2 added arcs, events, recruitment, reputation gates, achievements, and silhouettes. V3 turns the clinic into a **place with layout, rivalry, and chapters**: rooms matter spatially, someone competes with you, and staff have multi-week storylines that collide.

---

## Agent proposals (brainstorm)

### Fun & Quality agent

| Feature | Why |
|---------|-----|
| **Room placement map** | Drag-or-assign furniture to Waiting / Break / Exam / Lobby. Bonuses stack by room, not just ownership. |
| **Rival wellness clinic** | NPC practice steals patients if your reputation stalls. Win by out-indulging them (events, not spreadsheets). |
| **Patient loyalty tracks** | Repeat visitors unlock VIP scenes and recruitment shortcuts. |
| **Clinic "style" identity** | Hidden score: Softness vs Speed vs Spectacle. Affects which patients arrive and which events fire. |
| **Challenge weeks** | Optional modifiers: "Caterer's Convention Week" (double food events), "Button Crisis Week" (wardrobe strain everywhere). |

### Polish & UX agent

| Feature | Why |
|---------|-----|
| **Room map tab** | Visual floor plan with upgrade slots. See at a glance why gains tick up. |
| **Relationship web** | Simple graph: who admires / envies whom. Click edge for history. |
| **Chapter select** | Campaign structure: Chapter 1 "Soft Opening", Chapter 2 "Word Spreads", etc. with clear goals. |
| **Sound stubs** | Optional UI clicks, week-end chime, stage-up swell (howler.js or bare audio tags). |
| **Compare silhouettes** | Before/after ghost outline when stage changes. |

### Content agent

| Feature | Why |
|---------|-----|
| **4+ new archetypes** | Rival doctor's mole, food blogger patient, gym-defector staff hire, bored housewife donor. |
| **20+ new weekly events** | Seasonal: holiday feast, summer ice cream truck, corporate "wellness retreat" sabotage. |
| **Group scenes** | 3-character modal scenes with branching choices (who eats most, who confesses first). |
| **Full arc tracks for all staff** | 4 beats each, not just starting five names. |
| **Rival clinic counter-events** | Narrative arms race: they install a juice bar, you install a pastry wall. |
| **Ending cards** | NG+ summaries: "Your clinic became a temple of appetite" / "Every staff member reached devoted." |

---

## Proposed V3 scope (recommended)

### Must ship

1. Room placement map (4 rooms, assign owned furniture, room bonuses)
2. Rival clinic arc (lightweight: 6-week narrative thread, reputation race, 3 rival events)
3. Relationship web (staff pairs + jealousy/admiration flags, 8 scripted beats)
4. Chapter 1–2 campaign structure with win conditions
5. Expand arcs to all staff templates (procedural arc titles for non-named hires)
6. 15 additional weekly events + 2 seasonal weeks

### Should ship

7. Clinic style identity (3 hidden axes, affects flavor text)
8. Silhouette before/after on stage-up
9. Group scene system (1 modal, 3 characters, 2–3 choices)
10. 3 new archetypes (Rival Spy, Food Blogger, Gym Defector)
11. Ending card + NG+ carry (one bonus: +1 AP or 5% gain)

### Deferred to V4

- Full rival clinic management sim
- Voice/ambient audio pack
- External share/export of week summaries
- Custom character creator

---

## Out of scope (permanent)

- Insurance contracts, claims, billing codes
- Shame/degradation mechanics
- Non-consensual progression

---

## Technical notes

- Save migration v2 → v3: add `rooms` object, `rivalState`, `chapter`, `relationships`
- New skill candidate: `.cursor/skills/event-authoring/SKILL.md` for weekly event tone
- New module: `src/rooms.js`, `src/rival.js`, `src/chapters.js`

---

## Acceptance criteria (V3 done when)

- [ ] Player can assign furniture to rooms and see bonus breakdown
- [ ] Rival arc plays across 6+ weeks without soft-lock
- [ ] At least 8 relationship beats fire across a full playthrough
- [ ] Chapter 2 goal achievable in 30–45 minutes of play
- [ ] `npm run lint:prose` passes on all new narrative
- [ ] v2 saves migrate cleanly

---

## Your approval

Reply **"Approved — build V3"** or edit this doc (cut/add/reorder). Implementation starts only after approval.
