# IndulgeCare — Unified Shore-Up Master Plan

**Mode:** Plan only (no implementation in this document)  
**Date:** 2026-07-03  
**Method:** 4 domain experts × 7 chunks → cross-chunk synthesis → Fable 5 fiction review (see appendix)

---

## North star

The game’s best unique hook is **clinical mask → indulgence reveal**: patients believe they are at a PCP; the player steers appetite under chart language. Staff and late-game systems should support that arc, not undermine it on week one.

**Success criteria (from skills 01 + 07):**
- Player can answer “what am I working toward?” at any moment
- Every ladder crossing feels like an **event**, not resolution footnotes
- Clinical early voice stays clean until framing earns indulgence
- Endgame has ≥3 live choice systems (not adjective walls)
- Code changes don’t fracture the visit desk (single source of truth)

---

## Cross-cutting themes (all agents agreed)

| Theme | UI | Gameplay | Prose | Code |
|-------|----|----------|-------|------|
| Invisible ladders | Framing/cover not shown | Silent stage crossings | No `warming` prose tier | No rung-scene hook |
| Week 1 dead zone | Empty patients, wrong tab | 0 patients week 1 | N/A | `clinicProgression` |
| Modal / flow fatigue | Timer overwrite, double checkout | Crisis queue | N/A | `ui.js` god-file |
| Dual-frame unmapped | Staff gorging vs patient clinical | Mole/rival orphaned | Staff≈patient blob copy | Duplicate effects |
| Broadcast vs interactive | Log-tab burying | 4 scenes vs 20+ events | Scene catalog starved | Two scene resolvers |
| Patient arc gap | Loyalty chip only | Generic loyalty template | 16× blob duplicate | `loyaltyArcs.js` thin |

---

## Unified priority stack (P0 → P2)

### P0 — Ship feel breakers

1. **Week 1 onboarding** — Explain no patients until week 2; default to Interact; 3-step guided flow (`ui.js`, `clinicProgression.js`)
2. **Surface framing ladder in UI** — Tier chip + chart note in visit modal; ghost rows for locked gorging actions (`patientVisitUi.js`, `visitClinical.js`, `patientFraming.js`)
3. **Add `warming` prose tier** — Full narrative + reply pools; scrub `early` pools of gorging/gluttony (`patientVisitDialogue.js`, `visitTones.js`)
4. **Expand scene catalog** — 4 → 15+ interactive scenes; migrate `earlyGameEvents` premises (`scenes/`, `sceneEngine/triggers.js`)
5. **Rung-crossing ceremonies** — Fire scene on `newStage > oldStage` in `endWeek`, priority over random weekly (`events.js`, `characters.js`)
6. **Mole loyalty payoff** — Read `moleLoyalty` each week: leak / convert / betrayal (`events.js`, `gameOver.js`, UI meter)
7. **Appetite / hunger loop (v1)** — Hunger tier, fullness decay, visit interrupts (`src/appetite.js` new)
8. **De-duplicate blob/immobile monologues** — Persona peaks + generics (`patientDialogue.js`, `staffDialogue.js`)
9. **Fix end-week modal queue** — Resolution → group → crisis → ending (no timer overwrite) (`ui.js`)
10. **Unify effect mutator** — Single apply path for cover/heat/framing (`mechanics/applyEffects.js`)

### P1 — Cohesion & depth

11. Merge patient visit checkout (one End Visit control)
12. Cover/heat telegraph + tone consequence preview in visit UI
13. Visit choice architecture: mutually exclusive clinical vs indulgent clusters (not all-once checklist)
14. Patient arc parity: archetype-keyed loyalty tracks + flag callbacks into visit dialogue
15. Wardrobe mechanical model (`fitLbs`, integrity) tied to interactive scenes
16. Wire challenge `gainMult`, rival `counter` tags, persistent annex pressure
17. Split `ui.js` into shell/tabs/actions (maintainability)
18. Merge `sceneEngine` + `staffArcs/engine` resolvers
19. Group scenes: two NPC reaction stances + voiced outcomes
20. Style ledger CI extension (gorging in clinical contexts, banned phrases)

### P2 — Polish & scale

21. Achievement progress bars; mid-week unlock toasts
22. Floor plan mobile/touch; sidebar collapse
23. Modal a11y (focus trap, aria, Escape)
24. Per-character epilogue matrix (`endings.js`)
25. Prose lint glob expansion; monolith detector (>800 lines)
26. Save round-trip tests; README v6 sync
27. Remove legacy `consult` path in `events.js`
28. NG+ both bonuses exposed in ending modal

---

## Chunk plans (unified)

### Chunk 1 — Onboarding & shell

**Goal:** Player knows the loop before week 2 patients arrive.

| Action | Owner domain | Files |
|--------|--------------|-------|
| First-run overlay (Interact → visit → End Week) | UI | `ui.js` |
| Week 1 copy: patients arrive week 2 | UI + gameplay | `renderInteract`, `clinicProgression.js` |
| Default tab Interact when week ≤ 2 | UI | `ui.js` `initUI` |
| Cover/Heat explainer in sidebar | UI | `renderSidebar`, `patientFraming.js` |
| Save/Load in header | UI | `renderTopNav` |
| Modal queue infrastructure | UI | `ui/modals/queue.js` (new) |
| Styled confirms (replace `prompt`/`confirm`) | UI | `ui.js` |

### Chunk 2 — Patient loop

**Goal:** Visit desk is the game; clinical→indulgence is visible and earned.

| Action | Owner domain | Files |
|--------|--------------|-------|
| Framing tier + chart note in visit header | UI + prose | `patientVisitUi.js` |
| Locked action previews (“unlocks warming”) | UI + gameplay | `visitClinical.js`, `patientVisitUi.js` |
| `warming` narrative pools | Prose | `patientVisitDialogue.js` |
| Tone gating: shameless/cruel until warming+ | Prose + gameplay | `visitTones.js` |
| Visit log expand; tone ±cover/heat preview | UI | `patientVisitUi.js` |
| Mutually exclusive visit paths | Gameplay | `patientVisit.js` |
| Rung scenes on stage cross | Gameplay | `events.js`, `sceneEngine/triggers.js` |
| Scene catalog growth (button, jeans, doorway, chair, scale…) | Gameplay + prose | `scenes/*` |
| Single checkout control | UI + gameplay | `patientVisit.js`, `patientVisitUi.js` |
| Compound clinical pools | Prose | `patientVisitDialogue.js` |

### Chunk 3 — Staff & recruitment

**Goal:** Staff wing feels intentional; mole and arcs pay off.

| Action | Owner domain | Files |
|--------|--------------|-------|
| Interact tab: “Exam floor” / “Staff wing” labels | UI | `ui.js` |
| Mole loyalty meter + thresholds | Gameplay | `events.js`, `ui.js` |
| Mole supply-closet scene (master plan) | Prose + gameplay | `scenes/`, `triggers.js` |
| Arc next-beat preview on profile | UI | `ui.js`, `arcs.js` |
| Staff blob voice rewrite (per archetype) | Prose | `staffDialogue.js` |
| Staff feed → micro-gain feedback | Gameplay | `events.js` |
| Procedural arc voice variants | Prose | `staffArcs/procedural.js` |

### Chunk 4 — Weekly economy

**Goal:** AP scarcity matters; money tightens midgame; rival/mole tie to cover.

| Action | Owner domain | Files |
|--------|--------------|-------|
| End-week modal queue | UI | `ui.js` |
| Challenge `gainMult` wired | Gameplay | `events.js`, `challenges.js` |
| Passive gain weighted by attention | Gameplay | `events.js` `calculateGain` |
| Rival counter mechanics | Gameplay | `rival.js` |
| Annex persistent meter (post-ops) | Gameplay | `rivalClinic.js` |
| Resolution sticky summary (bills, net, challenge) | UI | `openResolutionModal` |
| AP spend reminder before end week | UI | `ui.js` |

### Chunk 5 — World & events

**Goal:** World reacts with choices, not blurbs.

| Action | Owner domain | Files |
|--------|--------------|-------|
| earlyGameEvents → interactive scenes | Gameplay + prose | `earlyGameEvents.js`, `scenes/` |
| Wardrobe fit model + failure scenes | Gameplay + prose | `patientAppearance.js`, `weeklyContent.js` |
| World flags callbacks (`brokeOfficeChair`) | Gameplay + prose | `worldImpact.js` |
| Group scene expansion + dual reactions | Prose + gameplay | `groupScenes.js`, `v4GroupScenes.js` |
| Week note toasts for wardrobe/world/mole | UI | `ui.js`, `state.js` |
| Weekly event prose depth (interior + witness) | Prose | `weeklyContent.js` |

### Chunk 6 — Progression meta

**Goal:** Campaign arc feels like a story with endings.

| Action | Owner domain | Files |
|--------|--------------|-------|
| Chapter goal tooltips (patients week 2) | UI | `chapters.js`, `ui.js` |
| Patient archetype loyalty arcs | Prose + gameplay | `loyaltyArcs.js` |
| Epilogue matrix per character | Gameplay + prose | `endings.js` |
| Loyalty arc UI panel | UI | `ui.js`, `loyaltyArcs.js` |
| Achievement progress + rename duplicate “City Whisper” | UI | `achievements.js` |
| Departure scenes for churned patients | Prose | `events.js` |
| Chapter transition prose | Prose | `chapters.js` |

### Chunk 7 — Codebase health

**Goal:** Refactors enable content scale without stat bugs.

| Action | Owner domain | Files |
|--------|--------------|-------|
| `ui.js` split (shell/tabs/actions/modals) | Code | `src/ui/*` |
| `mechanics/applyEffects.js` unified | Code | new + `sceneEngine/effects.js`, `visitTones.js`, `patientVisit.js` |
| `mechanics/gain.js` unified | Code | `events.js`, `patientVisit.js` |
| `mechanics/attitudeTier.js` shared | Code | dedupe 4 copies |
| `sceneEngine` absorbs staff arc resolver | Code | `staffArcs/engine.js` |
| Save migration hardening | Code | `state.js` |
| `patientVisitDialogue.js` split by phase | Code | `src/content/visit/*` |
| Tests: save round-trip, render smoke | Code | `tests/*` |
| Lint: prose glob, monolith gate | Code | `scripts/*` |
| Remove legacy consult | Code | `events.js` |

---

## Phased implementation (recommended)

### Phase A — Player trust (P0 UI + prose clinical)
Week 1 onboarding, framing UI, warming prose tier, early pool scrub, modal queue, single checkout, Cover/Heat telegraph.

**Touches:** chunks 1, 2 (UI/prose slices), minimal gameplay.

### Phase B — Game feel (P0 gameplay)
Scene catalog expansion, rung ceremonies, mole payoff, appetite v1, effect/gain unification.

**Touches:** chunks 2, 3, 4, 5 (interactive layer).

### Phase C — Narrative depth (P1 prose + arcs)
Patient arcs, staff blob rewrite, group scenes, flag callbacks, weekly depth.

**Touches:** chunks 3, 5, 6.

### Phase D — Engineering (P1–P2 code)
ui.js split, tests, lint gates, legacy removal, epilogue matrix.

**Touches:** chunk 7, supports all future content.

---

## Cohesion checklist (before any phase ships)

- [ ] New patient visit 1 reads clinical in UI labels, dialogue, and patient profile quote
- [ ] Staff interact copy labeled separately from patient exam floor
- [ ] Stage crossing fires at least one interactive or voiced ceremony per band jump
- [ ] Cover/heat changes always traceable to a player choice
- [ ] No gorging/gluttony in `clinical`/`clinical_plus` prose pools (lint grep)
- [ ] End week never drops resolution modal silently
- [ ] `moleLoyalty` and `coverRating` visible before game-over surprise
- [ ] One effect mutator for all stat deltas (no heat/3 vs heat/4 drift)

---

## Appendix

- **Fable 5 fiction review:** `docs/FABLE_REVIEW_MEMO.md` — **Verdict: Revise**
- **Fable amendments folded into priority stack:**
  - P0 add: Weigh-in ritual system (framing-tier keyed)
  - P0 add: Framing-tier crossing ceremonies (clinical→warming, warming→complicit)
  - P0 scene criterion: every new scene must include aftermath + callback flag
  - P1 add: Refusals & her-led beats
  - P1 add: Player consent / heat-band audit
  - Phase insert: **A′ vertical slice** (one archetype end-to-end) before horizontal scale
  - Move epilogue matrix to Phase C (fiction, not engineering)
