# IndulgeCare Clinic — V4 Plan (draft)

**Status:** Implemented on branch `cursor/v4-full-implementation-59c3`. See `docs/V3-AUDIT.md` and `docs/V5-PLAN.md`.

**Prerequisite:** V3 campaign (Chapters 1–2), floor plan, rival arc, relationship web, group scenes, endings.

---

## V4 vision

V3 gave the clinic **layout, rivalry, and chapters**. V4 makes it a **living world**: deeper rival sim, full audio mood, player-driven challenge weeks, custom hires, and exportable week stories — still no insurance/billing.

---

## Agent proposals

### Fun & Quality

| Feature | Why |
|---------|-----|
| **Playable rival clinic** | Light management on ThriveWell Annex: steal patients back, counter-marketing |
| **Patient loyalty chapters** | Per-patient 3-beat loyalty arcs unlocking recruitment shortcuts |
| **Player-picked challenge weeks** | Choose Caterer / Button / Quiet week at week start |
| **Clinic style perks** | Unlock passive bonuses at Softness/Speed/Spectacle thresholds |
| **Chapter 3–4** | "City Whisper" and "Temple of Appetite" with unique win cards |

### Polish & UX

| Feature | Why |
|---------|-----|
| **Sound pack** | UI click, week-end chime, stage-up swell (optional mute) |
| **Room drag-and-drop** | Replace assign buttons with draggable chips on floor plan |
| **Relationship graph viz** | SVG nodes/edges instead of card list |
| **Week summary export** | Copy markdown recap for sharing |
| **Arc chip on sidebar cards** | See beat progress without opening modal |

### Content

| Feature | Why |
|---------|-----|
| **4th beat on named staff arcs** | Maya, Elena, Priya, Nadia, Jasmine get finale scenes |
| **10+ group scenes** | Branching 3-character modals with roster-specific text |
| **20 more weekly events** | Rival counter-events, seasonal holidays, staff birthdays |
| **4 new archetypes** | Bored housewife donor, rival doctor, food truck owner, sleep clinic defector |
| **NG+ mutators** | Faster rival, double wardrobe, "devoted only" dialogue mode |

---

## Recommended V4 scope

### Must ship

1. Chapter 3 campaign + 1 new ending card
2. 4th beat on all named staff arcs
3. Player-selected challenge week (3 options)
4. 5 new group scenes
5. Loyalty mini-arcs for patients (3 beats, procedural titles)

### Should ship

6. Sound stubs (mute toggle)
7. Drag-and-drop floor plan
8. Relationship graph visualization
9. Week summary markdown export
10. Playable rival clinic (simplified 4-week arc)

### Deferred to V5

- Full custom character creator
- Voice acting / ambient loops
- Multi-clinic franchise mode
- External API / cloud saves

---

## Out of scope (permanent)

- Insurance, billing codes, claims
- Shame or non-consensual progression

---

## Technical notes

- Save migration v3 → v4: `loyaltyArcs`, `challengePick`, `rivalClinicState`, `audioMuted`
- New modules: `src/rivalClinic.js`, `src/loyaltyArcs.js`, `src/audio.js`, `src/export.js`

---

## Approval

Reply **"Approved — build V4"** or edit this doc.
