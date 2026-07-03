# IndulgeCare — Implementation Guide

**Source of truth for the shore-up vision.** Derived from `THE_ULTIMATE_PLAN.md` (negotiated), `FABLE_REVIEW_MEMO.md`, and `GAME_SHORE_UP_MASTER_PLAN.md`. This document is self-contained: someone with only this file and the repo can implement everything.

**Ground rules for every implementer:**

- Read `.cursor/skills/02-prose-voice.md` before writing ANY player-facing text. No em dashes, no "It's not just X, it's Y", no "you both know", no "suddenly", no clinical vocabulary (BMI, obesity), no engine labels ("blob tier", stat names) in prose.
- `npm run build` and `npm run lint:prose` must pass before every commit.
- All characters are adults; consensual fiction; no health-consequence framing (see skills `00-README.md` hard rules).
- Do not resurrect anything in the Cut Registry (§9) without an explicit new decision.

**The one sentence the whole plan serves:**

> **She stops pretending by reading your own chart back to you.**

Every phase below either feeds that moment (the confession scene) or echoes it. If a proposed feature does neither, it waits.

---

## 0. Codebase orientation (what exists today)

| System | Where | Status |
|---|---|---|
| Game state, save v6, migrations | `src/state.js` (`createNewGame`, `normaliseState`, `SAVE_KEY`) | Working. `coverRating`, `heat`, `sceneState`, `globalFlags`, `gameOver` present |
| Patient visit desk (phases, actions, AP) | `src/patientVisit.js` (`VISIT_ACTIONS`, `performVisitAction`, `getVisitActions`) | Working. All actions `once:true` (checklist problem). `weigh_patient` is a flat action |
| Framing tiers (clinical → clinical_plus → warming → complicit) | `src/patientFraming.js` (`getPatientFramingTier`) + `src/visitClinical.js` (`getVisitActionGate`, `WARMING_GATED_ACTIONS`, `ACTION_FRAMING_COPY`) | Working. Gated actions return `{visible:false}` — invisible to player |
| Visit dialogue by tier | `src/patientVisitDialogue.js` (`VISIT_NARRATIVE`, tier-keyed `VISIT_REPLIES`) | `clinical` pools clean; **no `warming` pools** — falls through to `early` which has indulgence bleed |
| Visit tones (gentle/clinical/shameless/cruel) | `src/visitTones.js`, tone list in `src/scenes/catalog.js` | Working on 3 actions. Not gated by framing tier |
| Scene engine | `src/sceneEngine/` (`index.js` resolveScene/applySceneChoice, `effects.js`, `flags.js`, `triggers.js`) | Working. Supports `requires.flags`, `enqueueScene` chaining, ctx-function prose |
| Scene catalog | `src/scenes/catalog.js` — 4 scenes (doorway wedge + escalated, button pop, jeans tight) | Doorway wedge is the quality bar |
| Weekly loop | `src/events.js` `endWeek` (gains, events, mole reveal, heat decay, achievements) | Working. `moleLoyalty` written but never read |
| Mindset ladder | `src/mindset.js` (`getMindset`: slim→denial→curiosity→complicity→devoted, `getCharacterRouteLabel`) | Working, derived |
| Relationships | `src/relationships.js` — procedural all-pairs edges + SVG graph | Staff-only today |
| Clinic style | `src/clinicStyle.js` (softness/speed/spectacle axes, `getDominantStyle`, `getStyleFlavor`) | Working, used as stat modifier only |
| World impact events | `src/worldImpact.js` (chair collapse, doorway, scale overload…) | Broadcast text, light effects |
| UI | `src/ui.js` (~1,580 lines, god-file), `src/patientVisitUi.js` | Working. End-week modals overwrite each other via setTimeout |
| Game over | `src/gameOver.js` (`checkAuditGameOver` at cover ≤ 0) | Working |
| Prose lint | `scripts/lint-prose.mjs` | String-scan on hardcoded file list |

**Known landmines:**

- Effect application is **triplicated** with inconsistent math: `applyVisitEffects` (`patientVisit.js`), `applyToneEffects` (`visitTones.js`, heat→cover at `/4`), `applySceneEffects` (`sceneEngine/effects.js`, heat→cover at `/3`).
- Weight gain math is duplicated: `calculateGain` (`events.js`) vs `visitWeightBump` (`patientVisit.js`).
- `tierFromAttitude` is copy-pasted in 4 files.
- Week 1 spawns zero patients (`weeklyNewPatientCount` in `clinicProgression.js`) with no explanation in UI.
- `state.archivedPatients` is written, never read.

---

## 1. Phase 0 — Substrate & Trust

*Outcome: a new player reaches their first visit without confusion, and the game grows a memory nobody sees yet.*

### 1.1 Unified effect mutator

**New file:** `src/mechanics/applyEffects.js`

One exported function `applyCharacterEffects(state, character, effects, meta)` that handles every stat delta currently spread across three files: `trust`, `openness`, `indulgence`, `appetite`, `weight`, `weightRoll`, `money`, `reputation`, `coverRating`, `heat` (heat→cover penalty: pick **one** divisor, `/3`, and use it everywhere), `framingErosion`, `moleLoyalty`, `loyalty`, `weeklyMomentum`, `slimMindset`, `setsFlags`.

Then refactor `applyVisitEffects`, `applyToneEffects`, and `applySceneEffects` to delegate to it. Keep their signatures so call sites don't change. Also extract:

- `src/mechanics/attitudeTier.js` — single `tierFromAttitude`; update the 4 copies to import it.
- `src/roster.js` — move `findCharacter` out of `events.js` (breaks the domain→events dependency).

**Done when:** grep shows every stat delta flows through `applyCharacterEffects`; build passes; a scripted before/after comparison of one visit + one scene choice produces identical stat outcomes (modulo the deliberate `/4`→`/3` heat unification).

### 1.2 Memory Ledger (ships dark)

**New file:** `src/memoryLedger.js`

```js
// state.ledger = [{ id, week, characterId, data }]
// id: event key e.g. 'chart_entry', 'button_pop', 'chair_collapse', 'whisper'
// characterId: null for building/world rows
recordLedger(state, { id, characterId, data })   // stamps week automatically
ledgerFor(state, characterId)                    // all rows for a character, oldest first
worldLedger(state)                               // characterId == null rows
ledgerWhere(state, predicate)                    // general query
```

- Add `ledger: []` to `createNewGame` and `normaliseState` in `state.js`.
- Shim: `setGlobalFlag`/`setCharFlag` in `sceneEngine/flags.js` ALSO write a ledger row (`{id: flagKey, characterId}`) so existing scenes populate history for free. Flag reads stay on the old arrays — no behavior change.
- Cap ledger at ~400 rows (drop oldest world rows first) to keep saves small.

**Done when:** ledger rows round-trip through save/load; every existing `setsFlags` writes a row; nothing player-visible changed.

### 1.3 Dual-ledger state (ships dark)

In `state.js` migration and patient creation: every patient gets `chartedWeight` initialized to `weight`. In `patientVisit.js`, when `weigh_patient`/`estimate_weight` completes, set `chartedWeight = weight` (mirror for now — the choice comes in Phase 1) and `recordLedger(state, {id:'chart_entry', characterId, data:{weight, charted: chartedWeight}})`.

Add derived helper in `patientFraming.js`: `chartGap(patient)` → `Math.max(0, patient.weight - patient.chartedWeight)`.

**Done when:** saves migrate cleanly (old saves get `chartedWeight = weight`); chart entries appear in the ledger; no UI change.

### 1.4 Trust fixes (UI)

All in `src/ui.js` unless noted:

1. **Modal queue.** New `src/ui/modalQueue.js`: `queueModal(html)` + `showNextModal()`. Rewrite the end-week handler: enqueue resolution → group scene → week crisis → ending → game over in order; each modal's close advances the queue. Delete the `setTimeout` chain.
2. **Week-1 onboarding.** When `state.week === 1 && state.patients.length === 0`: default `activeTab` to `interact`; render a banner in `renderInteract`: first patients arrive next week, this week is for hiring and setup. Add a dismissible 3-step first-run card (1. Visit patients on Interact. 2. Each visit: greet → chart → weigh → bill. 3. End Week when AP is spent).
3. **Single checkout.** In `patientVisit.js`: completing the `end_visit` action calls `completeVisit` directly. Remove the separate "Complete visit" header button from `patientVisitUi.js` (keep "Leave desk").
4. **Styled confirms.** Replace `window.confirm`/`window.prompt` (end-week warning, new game, renames) with a small `openConfirmModal(message, onYes)` using the existing modal system.
5. **Header:** move Save/Load buttons into `renderTopNav`; add an "unspent AP" nudge line to the end-week confirm when `actionPoints > 0`.

**Done when:** end week never silently drops a modal (queue test: force resolution + crisis + achievement in one week); fresh-player path to first visit involves zero dead-ends; build + lint pass.

---

## 2. Phase 1 — The Visit Is the Game (vertical slice)

*Outcome: ONE patient archetype plays clinical → confession → complicit → epilogue, and the confession is built from the player's own chart entries.*

**Pick the slice archetype:** `nurturer` (strongest existing voice in `patientDialogue.js` and `patientClinicalVoice.js`). Everything in this phase is built for her first; other archetypes get it in Phase 3.

### 2.1 Framing ladder made visible

- `visitClinical.js` `getVisitActionGate`: for warming-gated actions at clinical tiers, return `{visible: true, locked: true, lockHint: 'Unlocks as her guard drops'}` instead of `{visible:false}`. Vary `lockHint` by how close she is (visits/trust vs the warming thresholds in `getPatientFramingTier`).
- `patientVisit.js` `getVisitActions`: pass `locked`/`lockHint` through; locked actions render disabled.
- `patientVisitUi.js`: render locked rows ghosted (reduced opacity, lock hint under description). Add to the visit modal header: framing chip (`Clinical` / `Returning` / `Warming` / `Complicit` — player-facing names, not tier IDs) + the chart-note line from `getPatientFramingNote(patient)`.

### 2.2 Warming prose tier + early scrub

In `patientVisitDialogue.js`:

- Add `warming:` pools (4 lines each) for every action that has `clinical:` pools. Register: she has noticed and is deciding not to mind. She jokes about the snack tray, asks whether the "appetite thing" is a side effect she should worry about (and doesn't wait for the answer), watches the scale with interest instead of dread. NO gorging/gluttony vocabulary — the word bank is: appetite, second helping, softer, snug, warm, unhurried.
- `visitDialogueTier` in `patientFraming.js` already returns `'warming'` — verify all lookups hit the new pools.
- Scrub `early:` pools: remove every gorging/gluttony/feeding-explicit line (grep `gorging|gluttony|feed me|feeding` and rewrite each hit that lives in a pool reachable at clinical/clinical_plus/warming framing).
- `visitTones.js`: gate `shameless` and `cruel` tones — `actionSupportsTone` (or the UI) hides them when `getPatientFramingTier(patient)` is `clinical`/`clinical_plus`. Show them locked with hint "She isn't ready to hear it."
- **Ratchet (same day):** extend `scripts/lint-prose.mjs` with a check that `clinical`/`warming` pool blocks contain no banned indulgence vocabulary (simple regex scan between pool markers, or move pools to per-tier files and scan by filename).

### 2.3 Weigh-in ritual + chart-entry decision (the centerpiece)

Replace flat `weigh_patient` with a two-beat interaction:

**Beat 1 — the number lands.** In `patientVisitUi.js`, when the weigh action is clicked, render an interstitial panel in the visit modal (not a new modal): scale line, ~1s settle animation (CSS, a dial or number ticking up), then the number, then her reaction line keyed to framing tier × archetype from a new `WEIGH_RITUAL` pool in `patientVisitDialogue.js`:

- `clinical`: number appears plainly; her deflection ("Shoes on. That counts for something.")
- `clinical_plus`: she watches the dial; the number sits a beat before she speaks
- `warming`: she reads it before you do; unbothered, curious
- `complicit`: she's watching *you* watch the dial

**Beat 2 — what do you chart?** Immediately after, 2–3 choice buttons:

| Choice | Available | Effects |
|---|---|---|
| **Chart it true** (`chartedWeight = weight`) | always | `trust +0.2`; ledger row `{id:'chart_entry', data:{honest:true}}` |
| **Hedge** ("weight stable, minor fluctuation") | always | `chartedWeight` rises at most +0.5 lb from previous; `coverRating +2`; ledger row `{honest:false, kind:'hedge'}` |
| **Fabricate** ("fluid retention, continue current plan") | framing ≥ clinical_plus | `chartedWeight` unchanged; `coverRating +4`; `framingErosion +2`; ledger row `{honest:false, kind:'fabrication', excuse:'fluid retention'}` (rotate excuses: fluid retention / dryer shrinkage note / scale recalibration / muscle mass) |

**Gap mechanics — exactly two couplings, no more:**

1. In `events.js` `endWeek` heat step: per-patient heat contribution scaled by `chartGap(patient)` — e.g. `heatFromGaps = sum(min(6, gap/8))` added before the cover decay.
2. `checkAuditGameOver` (Phase 4 will finish this) reads roster-summed gap as part of the audit verdict.

**Chart view:** in the patient profile (`ui.js` `openCharacterModal`), render a simple two-line SVG or div-bar chart: real weight trend vs charted trend, from the ledger's `chart_entry` rows. The gap must be the most visible thing in the room — the player watched every entry get written because they wrote it.

### 2.4 Mutually exclusive visit clusters

In `patientVisit.js`: introduce `cluster` field on exam/services actions. Two clusters per phase: `clinical` (ROS, labs, mirtazapine, nutrition counseling) and `indulgent` (feed in place, snack tray, compounds, warm wrap). Completing any action in one cluster **locks the other cluster for this visit** (disabled with reason "You committed to the clinical script today" / "The tray is already out"). Greeting/intake/checkout stay shared. This turns each visit into a small betrayal decision instead of an all-once checklist.

### 2.5 The confession (crown jewel)

**New scene** `warming_confession` in a new `src/scenes/confession.js`, registered in `catalog.js`. Fires **once per patient** when `getPatientFramingTier` first returns `warming` (detect the crossing in `endWeek` or at visit start; ledger row `{id:'framing_crossed_warming'}` prevents refires). Priority over random weekly scenes.

**Structure — hand-authored spine + citation slots:**

1. Opening (authored, per archetype family): she arrives early, doesn't sit, has the patient-portal app open on her phone.
2. **Citation block (procedural):** pull the last 2–4 dishonest `chart_entry` rows from `ledgerFor(state, patient.id)`. Authored connective tissue per `kind`:
   - fabrication: `"${excuse}." She reads it flat. "Week ${week}. I was ${realWeight} pounds."`
   - hedge: `"Weight stable." She smiles at that one. "Stable. I'd split a seam that month."`
3. The turn (authored): she isn't angry. That's the scene's engine — she kept the receipts because she wanted to know if you'd keep covering for her.
4. Choices (3–4, per the doorway-wedge quality bar — every option is characterization): own it plainly / keep the clinical mask one more week / turn it back on her ("what do you want the chart to say?") — each with effects, flags, and a distinct outcome paragraph.

**The honest variant (mandatory):** if the ledger holds zero dishonest entries, a **different authored scene** fires: she noticed you never once covered for her, and that's its own intimacy. Not a fallback — its own reward.

**Also in the slice:**

- `warming → complicit` ceremony (shorter authored beat, fires on that crossing).
- **One refusal beat:** at low openness, offering the snack menu triggers an authored decline (written lovingly — refusals are content, skill 01 §4).
- **One her-led beat:** at complicit, a visit opens with her having already booked the follow-up and ordered from the menu; she dares you to chart it.
- **Her epilogue cells:** extend `endings.js` with per-character epilogue lookup keyed `finalStageBand × mindset × chartGapBand` (bands: clean 0–2 lb / smudged 2–15 / fiction 15+). Author the nurturer's cells (~9 short paragraphs).

### 2.6 Consent surfaces

- Tag every scene in `scenes/*.js` with `heatBand: 'warm' | 'charged' | 'explicit'`.
- New-game options (in the new-game confirm or a settings block in `ui.js`): heat cap (default `charged`). `pickWeeklyInteractiveScene` and `checkVisitInterrupt` filter scenes above the cap.

**Phase 1 done when:** the nurturer plays end-to-end (clinical intake → weigh-ins at every tier → confession → complicit → epilogue) with zero placeholder prose; the confession renders correctly across ≥20 randomized lie-histories AND the zero-lie path (write a quick script or Prose Lab harness for this); by read-aloud test the confession is the best scene in the game; every scene in the slice writes to and reads from the ledger.

---

## 3. Phase 2 — Thresholds & Memory

*Outcome: nothing important passes silently, and the building starts keeping receipts.*

### 3.1 Rung-crossing ceremonies

In `events.js` `endWeek`, inside the per-character gain loop, when `newStage > oldStage`: push to a `state.pendingRungScenes` queue. After the loop, the FIRST queued crossing sets the week interrupt (priority over `pickWeeklyInteractiveScene` — skip the random pick if a rung scene is pending). New ceremony scenes by stage band in `src/scenes/rungs.js`:

- Stage 2–3 crossing: first-softness ceremony (the most emotionally loaded band — over-invest here)
- Stage 5 crossing: the wardrobe reckoning
- Stage 7–8 crossing: furniture/logistics ceremony
- Stage 10/11: immobility/bedbound ceremony (one each, per patient AND staff variant)

Each keyed to `ctx.mindset` for at least two distinct openings (denial vs complicity).

### 3.2 Scene catalog to 8–10 under the chain-or-cite gate

**The gate (non-negotiable):** every new scene must either `enqueueScene` a consequence OR cite the Memory Ledger in its prose (via ctx functions reading `ledgerFor`) — most should do both.

Migrate the best `earlyGameEvents.js` premises into interactive scenes (bra strap, ID photo shock, chair pinch, scale wince); delete the migrated passive versions from `EARLY_GAIN_EVENTS`. Target beat families: scale, chair, button/waistband (exists), doorway (exists), booth/car, mirror moment. Quality bar: the doorway wedge (5 choices, every one characterization).

**Lint (same day):** add `scripts/lint-scenes.mjs` — static check that every scene in `SCENE_CATALOG` has `heatBand` and at least one of (`enqueueScene` in a choice, ledger citation marker). Wire into `package.json` as `lint:scenes`.

### 3.3 worldEcho + furniture memory

- `worldImpact.js` events write ledger rows (`{id:'chair_collapse', characterId, data:{room}}`).
- New `worldEcho(state, patient)` helper: returns one authored echo line if a relevant world row exists ("She eyed the reinforced chair. The one with the story."). Visit openings in `patientVisitDialogue.js` append it when present (once per visit).
- Furniture replacement: a shop item or room action that retires the echo row and fires a short devotion beat (money sink; `clinic.js` + `rooms.js`).

### 3.4 Anticipation surfaces

- Roster cards (`ui.js` `characterCard`): one state-keyed line per patient — next threshold ("Two pounds from the next line on her chart"), pending framing crossing ("She lingers at checkout lately"), or ledger echo ("Still tells the dryer story").
- Toasts for `wardrobe`/`world`/`mole` week notes (flag on `addWeekNote`, UI listens).

**Phase 2 done when:** continuity audit passes (cause three stateful events, visit every scene type, zero contradictions, ≥1 callback each); no stage crossing in a full playthrough passes silently; `lint:scenes` green; a player can name each patient's next threshold from the roster screen.

---

## 4. Phase 3 — The Conversation (cast scale + live loops)

*Outcome: the whole cast talks — to the player, to the chart, and to each other.*

### 4.1 Slice replication (the grid)

Per archetype (all patient archetypes in `patientDialogue.js`): warming pools, weigh-ritual reaction variants, confession spine variant (the citation mechanics are shared; the spine + connective tissue are per archetype family — group the 17 archetypes into ~5 families: nurturing, analytical, social, defiant, hedonic), one refusal, one her-led beat, epilogue cells. This is a grid; fill it. Sample-render review per family before moving on.

### 4.2 Voice de-duplication

- `patientDialogue.js` + `staffDialogue.js` blob/immobile tiers: rewrite from scratch. Budget: 2 persona-unique lines per archetype (distinct vocabulary, rhythm, taboo per skill 03 voice contracts) + shared generics. Kill every "reorganizes itself around the mass I have become" clone.
- Persona attribution test: strip names from 20 blob-tier lines, re-attribute — ≥80% or keep rewriting.
- `ui.js` Interact tab: label the two columns "Exam floor" (patients) and "Staff wing" (staff) with one framing line each, so the dual register reads as intentional.

### 4.3 Complicity is cover (Loop 1)

- In the unified mutator: when an indulgent action/scene generates heat during a visit, scale it by the patient's framing (`complicit` ×0.25, `warming` ×0.6, else ×1).
- `getCoverLabel` in `patientFraming.js`: when roster-average framing ≥ warming, swap vocabulary tier ("Plausible PCP" → "They'd never testify").
- Audit testimony: stub the beat now (used in Phase 4): complicit patients each contribute one authored testimony line to the audit scene.

### 4.4 Mole double-agent romance

Replaces any "loyalty meter" concept. In `events.js` `endWeek`:

- Leak scale: mole's weekly leak severity = f(`state.heat`) — she can only report what's visible.
- **Telegraph rule:** any leak consequence must be preceded ≥2 weeks by fiction (cagey line in her interactions, a whisper note "seen near the Annex lot"). No game-over may cite a number the player never saw.
- **Feed-to-flip:** at `moleLoyalty ≥ 40` AND her stage ≥ 4, fire the flip scene (`src/scenes/mole.js`, includes the supply-closet scene from the master plan): she chooses you. Following week: **Annex Defection** event — 1–2 ThriveWell patients arrive pre-warmed (`clinical_plus`, openness boosted).
- If loyalty stays low and heat stays high: betrayal path — a cover crash event (telegraphed), feeding the Phase 4 audit.

### 4.5 The waiting room, v1 (visible only)

- Extend `relationships.js` edge generation to patient pairs (it already iterates all pairs — remove the staff filter for a capped number of patient edges).
- **Whisper notes:** weekly, for one patient pair where `mindsetRank` differs by ≥2, emit an authored week note keyed to the pair's mindset classes ("Dana watched Priya order the second tray and didn't look away."). Write a ledger row. ~10 authored templates by mindset-pair class. NO hidden stat transfer — the whisper is prose only in v1.
- **Recruitment:** complicit patients can generate a referral — new patient arrives pre-warmed with the causal whisper in her intro note ("Her friend Renata swears by the meal plans."). Wire into `weeklyNewPatientCount`/`createPatient` via an `openness` boost + a ledger row.
- Patient nodes on the relationship SVG (`renderRelationshipGraphSvg`).
- Group patient scenes: 3–4 templates keyed to mindset-pair classes in `groupScenes.js` (denial × complicity is the priority template).

### 4.6 Appetite as weather (trimmed)

- `computeClinicEffects` or `endWeek`: `state.supplyCost` scales with summed roster appetite (gentle curve; visible movement week to week).
- One ambient lobby line per appetite band in the Interact tab header (3 bands).
- **Chapter beat:** the first week `foodCost > rent`, fire an authored chapter-title moment in the resolution ("The lease is no longer the biggest thing you feed."). One-shot flag.

### 4.7 Style gets its first tooth

- Dominant softness ≥ 65: passive `framingErosion +1/week` to all patients (the building un-convinces them). Surface in the style flavor line ("…and nobody asks about their labs anymore.").

### 4.8 Rival returns (authored mirror)

- When the rival poaches a patient, archive her with `exitWeight` + week.
- Scripted return event: weight on return = `exitWeight + weeksAway × rivalGainRate`; the scene prose is written against how much she changed. Her framing tier survives the trip.

**Phase 3 done when:** persona attribution ≥80%; no two patients render identical text for the same beat; three-playthrough test passes (rush one patient to ceiling / spread across cast / hostile-neglect) with the hostile run confirming mole betrayal was visible two weeks out; supply-cost line moves week over week.

---

## 5. Phase 4 — The Living Building

*Outcome: the clinic confesses too, and the run ends knowing everything you did.*

### 5.1 Clinic mindset ladder (derived only)

New `src/clinicMindset.js`: `getClinicTierLabel(state)` → `sterile | hospitable | indulgent | shrine`, computed from dominant style score, owned upgrades, roster framing distribution, and world-ledger scar count. **No new save fields.**

- `PUBLIC_CLINIC_TAGLINE` becomes `getClinicTagline(state)` — one authored tagline per tier ("Primary care for adults…" → "Comfort-first care. Walk-ins welcome. Bring your appetite."). Update the header + management tab call sites.
- Per-tier ambient line pools for week-start blurbs and the log header.
- NO feedback into patient generation or rival behavior (deferred, see §9).

### 5.2 The audit convergence

Rewrite the game-over flow in `gameOver.js` + a new audit scene: when cover hits the floor, the audit reads **summed chart-gap** (the dual ledger pays off), and the scene assembles:

- The verdict baseline from cover + gap.
- **Complicit patients testify** — one authored line each (Loop 1 payoff); enough testimony can downgrade shutdown to probation (a survivable near-miss ending).
- **Mole state changes the verdict scene**: flipped mole destroys evidence (one beat); betrayed-path mole is the star witness.

### 5.3 Epilogue matrix

`endings.js`: per-main-character epilogues keyed `stageBand × mindset × chartGapBand`, plus the clinic's own epilogue keyed on clinic tier. The chart-gap axis means the epilogue knows whether you lied to her, and says so ("Her chart says 180. The couch knows better. Neither of you has corrected the record.").

### 5.4 Archived shadow lives

`state.archivedPatients` finally gets read:

- **Letters:** occasional week event — a departed patient writes back, content keyed to her exit framing/mindset/route label ("the one who got away" kept the meal plan, or didn't).
- Rival cameos: an archived patient appears in a rival event.
- Epilogue rows for the departed.

### 5.5 Chapter prose

- 3-sentence authored transition on each chapter completion (cover state, rival state, roster snapshot).
- Chapter goal tooltips (e.g. "patients arrive week 2" on the visit goal).

**Phase 4 done when:** hostile playthrough produces a game-over the player saw coming ≥2 weeks out with every cited number previously visible; finishing a run makes you wonder what the other epilogue cells say; the tagline rewrites itself ≥2 times in a full run and reads correctly each time.

---

## 6. Continuous — The Ratchet

From Phase 0 onward, never a sprint:

| Gate | When it lands | What it checks |
|---|---|---|
| `lint:prose` (exists) | already | banned constructions, em dashes |
| Clinical-vocabulary grep | Phase 1 §2.2 | no gorging/gluttony in clinical/warming pools |
| `lint:scenes` | Phase 2 §3.2 | every scene has `heatBand` + chains or cites |
| Chart-gap sweep | Phase 1 §2.5 | confession renders across ≥20 randomized lie-histories + zero-lie path; no empty citations |
| Save round-trip | Phase 0 | load(save(state)) identity at 3 game states (fresh, mid, endgame fixture) |
| Render smoke | Phase 0–1 | `describeCharacter` + `getVisitNarrative` across stage × tier grid, no undefined/empty |

Rule: every hand-found bug becomes an automated check the same day. No phase ships with its greps dirty.

---

## 7. Prose quick-reference (for every content task)

- Second/third person, present tense. Sensual, unhurried, concrete. Verbs carry size (settles, spreads, overflows). Environment witnesses (chairs, doorways, waistbands) instead of restating "she is big".
- Escalation arc per scene: establish → pressure (2 beats) → threshold (shortest sentence in the scene) → aftermath (never skip — the aftermath is where the reader lives).
- Register by framing tier: `clinical` = pure PCP; `clinical_plus` = noticing, deflecting; `warming` = noticed, deciding not to mind; `complicit` = names it plainly.
- Banned: em dashes, "It's not just X", "you both know", "suddenly", "I have become the [noun]", clinical terms (BMI/obesity/calories-as-numbers), engine labels in prose, a salient word twice in one passage.
- Refusals are written as lovingly as yeses. Humor is intimacy.

---

## 8. Suggested commit/PR structure

One branch per phase (`cursor/phase-0-substrate-…` etc.), one PR per phase, commits per logical unit within (e.g. Phase 0: mutator / ledger / dual-state / modal queue / onboarding as 5 commits). Run build + all lints before every commit. Each PR description lists which "done when" criteria were verified and how.

---

## 9. Cut & deferred registry (do NOT implement without a new decision)

**Killed (player-felt reasons on file in THE_ULTIMATE_PLAN.md §2):**
wardrobe numeric fit model (`fitLbs`/integrity); floor-plan touch support; rival counter tags + persistent annex meter; achievement progress bars; NG+ bonus exposure; appetite→style coupling; free-assembly procedural prose; rival as a running simulation.

**Deferred, with triggers:**

| Item | Trigger to revisit |
|---|---|
| Full waiting-room contagion math | players demonstrably track pairs and try to work the lobby |
| Clinic tier driving patient generation / rival behavior | evidence players read the label (quotes, screenshots) |
| Appetite/hunger decay loop (fullness, hunger tiers, interrupts) | post-slice playtests report visits feel thin despite ritual + clusters |
| Spectacle contagion multiplier | contagion math exists |
| Scene-resolver merge (`staffArcs/engine` → `sceneEngine`); full `ui.js` split | a concrete task they block |
| Legacy `consult` removal from `events.js` | first commit that touches it |

---

## 10. The one-page mental model

```
The player writes chart entries (weigh-in decision, Phase 1)
        │
        ▼
The Memory Ledger keeps them (Phase 0, dark)
        │
        ├──► The confession quotes them back (Phase 1 crown jewel)
        ├──► Scenes chain-or-cite them (Phase 2 gate)
        ├──► The cast gossips about them (Phase 3 whispers)
        ├──► The audit sums them (Phase 4 climax)
        └──► The epilogue reads them one last time (Phase 4)
```

Everything else — onboarding, tones, ceremonies, the mole, the food bill, the tagline — exists to make those arrows land harder. If an implementation choice ever conflicts with this diagram, the diagram wins.
