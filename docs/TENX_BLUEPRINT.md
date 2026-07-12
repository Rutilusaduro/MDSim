# TENX BLUEPRINT — The Step-by-Step Build Order

**Scope:** Every change required to make the game 10x larger and better, enumerated as atomic steps an implementer (human or agent) can execute in order, commit by commit.
**Companion doc:** `docs/QUALITY_10X_PLAN.md` is the strategy (why). This is the execution order (what, exactly, in which file). Where the two disagree, this doc wins because it is newer and more specific.
**Ground truth:** Every count, line number, and function name below was measured against the repo at the commit this doc landed. If a referenced line has drifted, search for the symbol, not the number.

---

## Part 0 — How to use this document

- Steps are labeled `A1…F7` inside six workstreams. **One step = one commit** (message format: `A3: route visit narrative through proseSelect`). Steps inside a workstream are ordered; workstreams interleave per the schedule in Part 8.
- Every step has **Files** (what you touch), **Do** (the change, itemized), and **Accept** (how you know it's done). A step is not done until its Accept line passes.
- Never batch two steps into one commit, even small ones. The point of atomic steps is that any regression bisects to one name.
- Content steps (WS-D) additionally obey the standing rules from `QUALITY_10X_PLAN.md` §2: the asymmetry budget (≥20% of every batch off-template), specificity-beats-sentiment, and the read-aloud test.
- All prose obeys `.cursor/skills/beautiful-prose/SKILL.md`. Run `npm run lint:prose` and `npm run lint:scenes` before every commit; after E-steps land, `npm test` too.

---

## Part 1 — Measured inventory and 10x targets

Counted from source, not from READMEs:

| Category | Today (measured) | Target | Multiplier | Built in |
|---|---|---|---|---|
| Patient archetypes with line sets (`patientDialogue.js`) | 17 | 17 (deeper, not wider) | journeys ×4 | D1–D4 |
| Interactive scenes (`scenes/catalog.js` entries) | 16 | ~120 | 7.5x | D2–D4, D6, D8, D11 |
| Weekly events (`weeklyContent.js` 24 + `v3WeeklyContent.js` ~21) | ~45 | ~140 | 3x | D5 |
| Seasonal week modifiers | 2 | 10 | 5x | D5 |
| Group scenes (modal, branching) | 7 | 24 | 3.4x | D6 |
| Named staff arc beats (`arcs.js`: 26 beats / 6 tracks) | 26 | ~66 + 5 signature scenes | 2.5x | D7 |
| Confession scenes | 4 | 22 | 5.5x | D2 |
| Rung/threshold ceremonies | 4 | ~30 | 7.5x | D4 |
| Departure letters / shadow-life content | 0 | ~40 | new | D8 |
| Chapters / endings / epilogue cells | 3 / 6 / 0 | 5 / 6 / 60-cell matrix (24 authored) | — | D9 |
| Visit narrative lines (top actions × tiers, 4 per cell) | 4 per cell | 8 per cell where census shows repeats | ~2x targeted | D10 |
| Tone coverage (4 tones × 3 actions) | partial replies | full narrative grid × tiers | ~4x | D10 |
| Wardrobe chain scenes | 2 | 20 | 10x | D11 |
| Achievements / shop items / challenge weeks | 23 / 12 / 3 | 60 / 28 / 9 | ~2.5x | D12 |
| Loyalty arc templates | 1 (×3 beats) | 6 family templates (×3–5 beats) | 6x | D12 |
| Long-form narrative strings (≥60 chars, whole `src/`) | ~2,250 | ~9,000 | 4x corpus | all D |
| **Distinct lines a player actually sees in a 30-week run** | **~¼ of corpus, fixed per character** | **≥10x today's experienced variety** | **10x** | A2–A4 + D |
| Audio | 4 oscillator beeps | ~14 recorded samples + room tone | — | B12–B13 |
| Tests | 0 | ~40 assertions + 4-policy sim | new | E |

The honest math on "10x larger": the corpus grows ~4x, but experienced content grows far more, because today a character says the *same line forever* for a given action (char-sum picking, see A3) and whole subsystems (tones × tiers, refusals, letters, epilogues) are unreachable or empty. 10x is measured at the player, by the census tool (E6), not at `wc -l`.

---

## Part 2 — WS-A: Foundation, correctness, and the variety engine

Everything here is prerequisite plumbing. No visuals, no new content.

### A1 — Save format v7

**Files:** `src/state.js`
**Do:**
1. `SAVE_KEY` → `'indulgecare-clinic-save-v7'`; `GAME_VERSION` → `7`.
2. Add to `createNewGame()`: `seenLines: {}`, `history: []`, `difficulty: 'attending'`, `pendingLetters: []`, `coverOps: { activeBuffs: [] }`, `unseenWeeksById: {}` (or per-patient field, see C2).
3. In `normaliseState()`: default each new field (`raw.seenLines || {}`, etc.).
4. In `saveGame()`/`loadGame()`: add `-v6` to the legacy cleanup/fallback chains.
**Accept:** a v6 save in localStorage loads, plays a week, saves as v7; a fresh game has all new fields.

### A2 — `proseSelect.js`, the seen-line ledger

**Files:** new `src/proseSelect.js`
**Do:** implement and export:
```js
pickSeen(state, scopeId, poolId, pool)   // scopeId = character.id or 'world'
```
1. `state.seenLines[scopeId][poolId]` is an array of used indices.
2. Candidates = indices not yet used; if empty, reset the array (full rotation) and use all.
3. Choose among candidates with `rngForState(state)` so replays with one seed are stable.
4. Push chosen index; cap each pool's array at 64 entries (drop oldest).
5. Also export `pickStable(character, pool)` (the old char-sum behavior) for the few places where a *fixed* trait is correct (see A5).
**Accept:** unit test (E2): for a pool of 4, four consecutive picks return all four lines in some order before any repeat.

### A3 — Route visit narrative through proseSelect

**Files:** `src/patientVisitDialogue.js` (delete local `pickLine`, line 8–12), `src/patientVisit.js`, `src/patientVisitUi.js`
**Do:**
1. Replace `pickLine(character, pool)` calls with `pickSeen(state, character.id, poolKey, pool)` where `poolKey` is `"${actionId}.${tier}"`.
2. Thread `state` through `visitDialogue(...)` and every caller (`finishWeighAction`, `performVisitAction` at `patientVisit.js:721`, and the UI preview path in `patientVisitUi.js`). Rendering previews must NOT record seen-ness — add a `{ peek: true }` option that selects without writing.
**Accept:** in one visit, `say_hi` on two different patients with colliding id-sums no longer produces identical lines; repeat visits across weeks cycle the pool.

### A4 — Route the other three char-sum call sites

**Files:** `src/interactionDialogue.js:7`, `src/visitDialogueBeats.js:8`, `src/staffCheckInDialogue.js:7` + their callers in `src/events.js` (`previewInteractionFlavor`, `performInteraction`)
**Do:** same replacement as A3, one file per sub-commit is acceptable (A4a, A4b, A4c). Previews use `peek`.
**Accept:** grep `charCodeAt(0), 0)` returns matches only in `patientAppearance.js` and `patientFraming.js` (handled next).

### A5 — Stable traits become creation-time fields

Some char-sum picks are *correct* as stable traits (a patient's standing chart reason shouldn't reroll weekly) — but they should be rolled once with the seeded rng and stored, not derived from id text.
**Files:** `src/patientFraming.js` (`getPatientPublicReason`), `src/characters.js` (`createPatient`), `src/patientAppearance.js:710,716`
**Do:**
1. In `createPatient`: `patient.publicReason = rng.pick(REASONS)` (move the reasons array to `patientFraming.js` export).
2. `getPatientPublicReason(patient)` returns `patient.publicReason || fallback` (fallback keeps old saves working).
3. In `patientAppearance.js`, keep appearance stable but seed from `ensurePatientAppearance`'s rng path, not id char-sum, for *new* patients; existing appearance objects are already persisted.
**Accept:** two patients with different names can share a reason and two with similar names don't correlate; old saves unchanged.

### A6 — Restore seeded-RNG discipline in event effects

Today ~13 weekly-event `effect` bodies call `Math.random()`, which breaks seed-stable runs (bad for testing, replays, and the shared-seed culture the rest of the code maintains).
**Files:** `src/weeklyContent.js` (lines ~15, 28, 80, 116, 129 and the rest), `src/v3WeeklyContent.js` (~10, 81, 168), `src/events.js:523`
**Do:**
1. Change the event contract to `effect(state, rng)`; update `endWeek` to call `weeklyEvent.effect(state, rng)`.
2. Replace every `Math.random()` in effects with `rng.next()` / `rng.chance(...)`.
3. Replace the two `Math.random()` id generators in `state.js:158,169` with a module counter (`let idSeq = 0; … `${state.week}-${idSeq++}``) so the whole runtime is deterministic under a seed.
4. Add a grep gate to CI later (E8): `Math.random` is banned in `src/`.
**Accept:** two runs of the 12-week sim (E3) with the same seed produce byte-identical state JSON.

### A7 — Fix the loyalty-departure inversion

`events.js:715`: `shouldLeave = visits > 0 && rng.chance(18 + patient.visits * 5)` — the more a patient visits, the *more* likely she quits. This is backwards for a game about regulars.
**Files:** `src/events.js`
**Do:**
1. New formula: baseline 20%, minus loyalty and framing: `chance(clamp(22 - (patient.loyalty||0) * 6 - trustBonus - framingBonus, 3, 30))` where `framingBonus` = 0/4/8/12 for clinical/plus/warming/complicit.
2. On departure: `recordLedger(state, { id: 'patient_departed', characterId: patient.id, data: { week, stage: getStageIndex(patient), mindset: getMindset(patient), tier: getPatientFramingTier(patient), exitWeight: patient.weight } })` — D8 (letters, returns) reads this.
3. Complicit patients never leave silently: queue a one-line goodbye note into `state.pendingLetters`.
**Accept:** sim (E3): median tenure of complicit patients ≥ 3x that of clinical patients; departures all have ledger rows.

### A8 — Deduplicate framing rank

**Files:** `src/patientVisit.js` (local `framingRank`, ~line 502), `src/visitClinical.js` (`FRAMING_RANK`)
**Do:** export `framingRank(tier)` from `visitClinical.js`; delete the local copy; import.
**Accept:** one definition greps for `FRAMING_RANK|framingRank`.

### A9 — Split `ui.js` (1,641 lines) into modules

Pure mechanical extraction — no behavior change — so WS-B can work surface-by-surface.
**Files:** `src/ui.js` → new `src/ui/` modules
**Do:** extract in this order, one sub-commit each:
1. `src/ui/dom.js`: `e()` escaper, `app()`, `modalRoot()`, `openModal/closeModal`, toast.
2. `src/ui/components.js`: `stageMeter`, stat chips, shared card fragments.
3. `src/ui/tabs/management.js`, `interact.js`, `floorplan.js`, `relationships.js`, `campaign.js`, `achievements.js` (matching the `activeTab` values measured in ui.js).
4. `src/ui/characterModal.js`, `src/ui/resolutionModal.js`, `src/ui/header.js`.
5. `ui.js` keeps: `activeTab` state, `render()` orchestration, event delegation, `initUI()`. Target ≤250 lines.
**Accept:** `npm run build` green after each sub-commit; click-through of every tab and modal unchanged.

### A10 — Bundle split for a 4x corpus

Build already warns >500 kB single chunk; a 4x corpus makes it worse.
**Files:** `vite.config.js`
**Do:** configure manual chunks: `content` (everything under `src/content/` once D0 lands, plus `patientDialogue.js`, `bodyProse.js`, `patientAppearance.js`, dialogue modules), `engine` (state/events/visit), `ui`. If rolldown options differ, use `build.rolldownOptions.output.codeSplitting` per the build warning text.
**Accept:** initial JS request < 250 kB gzipped; content chunk lazy or parallel; game still boots on Pages (`base: '/MDSim/'` untouched).

### A11 — Reproducible playtest seeds

**Files:** `src/main.js` or `initUI` in `src/ui.js`, `src/state.js`
**Do:** read `?seed=N` from URL; when present and no save exists, `createNewGame({ seed: N })`; show the seed in the debug panel; add "copy seed" next to week export.
**Accept:** same seed + same choices ⇒ same week-12 state (A6 makes this true; this step makes it usable).

### A12 — Resolution history for recaps and census

**Files:** `src/state.js`, `src/events.js`
**Do:** in `endWeek`, push `{ week, money: state.money, heat, cover: state.coverRating, patientCount, summary: <plain-text 1-liner> }` to `state.history` (cap 200). `state.log` cap stays 80.
**Accept:** after 30 sim weeks, `state.history.length === 30`, save size growth < 40 kB.

### A13 — Dead-weight sweep

**Files:** various
**Do:** delete or wire up: unused exports found by a quick pass (`patientEarlyHooks` alias in `patientDialogue.js:333`, any unreferenced exports flagged by `npx knip` or hand-grep), the empty `public/` placeholder note if any, `.cursor/skills` stays (it's tooling, not shipping).
**Accept:** `npm run build` green; grep shows no orphan exports among the deleted names.

---

## Part 3 — WS-B: Presentation rebuild (the de-AI face)

Design direction (from QUALITY_10X_PLAN §4): **the chart, not the nightclub.** Paper, ink, manila, one accent. Serif prose, tabular numbers. Requires A9.

### B1 — Design tokens

**Files:** `src/styles.css`
**Do:** define at `:root`:
```css
--paper: #f6f1e7;  --paper-dim: #ece4d4;  --manila: #e8d9b0;
--ink: #26221b;    --ink-soft: #57503f;   --accent: #8a4b2d;   /* wax-seal rust */
--night: #17120f;  --night-panel: #241d18; /* after-hours shell */
--radius: 6px;     --measure: 66ch;
--font-prose: Charter, 'Iowan Old Style', Georgia, 'Times New Roman', serif;
--font-chrome: Inter, system-ui, sans-serif;
--font-chart: 'SF Mono', 'Cascadia Mono', Consolas, monospace;
--ease: cubic-bezier(0.2, 0, 0, 1); --t-fast: 160ms; --t-slow: 240ms;
```
Keep the dark `--night` shell as the app frame; chart/visit/scene surfaces go paper.
**Accept:** tokens exist; nothing visually changes yet.

### B2 — Kill the tell classes

**Files:** `src/styles.css`
**Do:** rewrite in place (same class names so feature code keeps working until B4–B9 retire them): `.glass-panel` → flat `--night-panel`, 1px border, **no** backdrop-filter, **no** 24px drop shadow; `.gold-button` → solid `--accent` fill, ink text, no gradient, no glow; `.nav-pill.active` → folder-tab look (paper fill, top radius only, 1px border, joined to panel); delete both radial `body` background glows; `.stage-bar` keeps function, restyled as a thin ruled gauge with tick marks every stage.
**Accept:** screenshot diff shows no gradients, no blur, no glow anywhere.

### B3 — Typography split

**Files:** `src/styles.css`, `src/ui/components.js`
**Do:**
1. `.prose-page { font-family: var(--font-prose); max-width: var(--measure); font-size: 1.0625rem; line-height: 1.65; color: var(--ink); }` on paper surfaces (dark-shell variant: `--paper` text on `--night-panel` is *not* allowed — prose always sits on paper).
2. `.chart-num { font-family: var(--font-chart); font-variant-numeric: tabular-nums; }` — apply to every weight, dollar, and percentage. `formatMoney` output always renders inside `.chart-num`.
3. Chrome (buttons, tabs, labels) stays `--font-chrome`. Remove every `tracking-[0.28em]`/`uppercase` label (grep for `tracking-\[`); replace with plain 13px labels, `--ink-soft`.
**Accept:** any narrative paragraph in the app measures 60–70ch, serif; every number in the resolution is tabular mono.

### B4 — Header as letterhead

**Files:** `src/ui/header.js`
**Do:** clinic name set in a small-caps serif wordmark, the self-rewriting tagline from `getClinicTagline` under it in italic, week/money/rep/heat as a single ruled "day line" in `--font-chart`. Cover label (`getCoverLabel`) renders as a rubber-stamp chip (1px border, slight rotation, `--accent` ink) — the game's one decorative flourish. Mute + save/load become quiet icon-text buttons, no emoji.
**Accept:** header contains zero emoji, zero gradient, and the stamp reads correctly at all five cover labels.

### B5 — Patient/staff cards as chart cards

**Files:** `src/ui/tabs/interact.js`, `src/ui/components.js`
**Do:** each roster card becomes a manila chart card: name on the tab notch, `publicReason` as the visible "reason for visit," framing chip as a paperclipped note, stage gauge, one-line appearance summary (`getPatientAppearanceSummary`) in prose serif. Remove stat-soup (openness/indulgence numbers leave the card — they live in the modal's chart view only).
**Accept:** a card shows ≤3 numbers (weight if charted, trust dots, week); everything else reads as words.

### B6 — Visit modal: two-pane chart

**Files:** `src/patientVisitUi.js`
**Do:**
1. Left pane (chart): the two-line weight chart (`renderChartGapSvg` from `gameOver.js`) always visible during the visit, charted vs. real lines diverging; framing note (`getPatientFramingNote`) as the chart header; completed actions list as chart entries in `--font-chart`.
2. Right pane (room): narrative log (`visit.visitLog`) in `.prose-page`, actions grouped by the 5 phases (`VISIT_PHASES`) as a checklist ribbon with the current phase underlined; ghost rows for warming-gated actions (`WARMING_GATED_ACTIONS`) shown locked with "unlocks as she warms" hint.
3. Tone picker (4 `VISIT_TONES`) becomes a pen-choice row (labels only) shown only for `TONE_ENABLED_ACTIONS`.
**Accept:** a full visit is playable with the chart never leaving the screen; phase progress readable at a glance.

### B7 — The weigh-in reveal

**Files:** `src/patientVisitUi.js`, `src/styles.css`
**Do:** `beginWeighRitual` UI becomes a two-step ceremony: step 1, dial/number area shows a settling animation (~400ms, CSS only, `prefers-reduced-motion` collapses to instant); scale-clunk sample plays (B12). Step 2, the number lands in large `--font-chart`, and the three chart choices (`chart_true` / `chart_hedge` / `chart_fabricate` from `applyWeighChartChoice`) render as *handwriting on the chart line* — the fabricate option shows its excuse text (from `FABRICATION_EXCUSES`) as the literal entry you'd sign. Locked fabricate (below `clinical_plus`) shows grayed with its unlock hint.
**Accept:** the beat plays dial → number → decision in three visually distinct moments; reduced-motion works.

### B8 — Scene tiering: sheet / page / ceremony

**Files:** `src/ui/modalQueue.js` callers, new `src/ui/scenePage.js`
**Do:**
1. **Sheet:** routine outcomes (`openDialogueModal` payloads) render inline in the visit/interact panel, not as modals. Retire `openDialogueModal` for action results.
2. **Page:** all `SCENE_CATALOG` scenes render through `scenePage.js`: full-width paper page, title as a chart-tab header, opening/citation/turn paragraphs in `.prose-page`, choices as written lines with hints, outcome + epilogue on the same page (no second modal).
3. **Ceremony:** scenes whose id starts with `warming_confession`, `confession_`, `mole_flip`, `rung_immobility`, plus audit and endings: backdrop `--night` at full opacity, page centered, header UI hidden, dismiss only via the scene's own choices.
**Accept:** three registers visibly distinct; no scene ever appears in the old glass modal.

### B9 — Resolution as the week's day sheet

**Files:** `src/ui/resolutionModal.js`, `src/events.js` (`buildResolutionHtml`)
**Do:** restructure `buildResolutionHtml` output into a paper day sheet: date line ("Week 12, Friday close"), narrative summary paragraph first (`.prose-page`), then ruled ledger lines (revenue/bills/supply) in `--font-chart`, stage changes as chart flags, achievements as a stamped footer row. The "supply beats rent" chapter beat (`supplyCostChapterFired`) renders as a underlined ledger anomaly, not a toast.
**Accept:** the week-end read order is story → numbers → flags; export (`copyWeekSummary`) unchanged.

### B10 — Toast retirement

**Files:** `src/ui/dom.js`, all `showToast` callers
**Do:** replace bottom-right toasts with a "day sheet note" — a single line that slides into the top of the This Week feed (already `addWeekNote` territory). Errors keep an inline red-ink note near the control that caused them.
**Accept:** grep `showToast` → 0 UI callers; purchases, saves, and errors all land as day-sheet or inline notes.

### B11 — Silhouettes in ink

**Files:** `src/silhouettes.js`
**Do:** keep the abstract SVG (it's the right level of explicitness for the default heat cap) but redraw: single 2px `--ink` contour on paper, subtle `--manila` fill, stage-compare ghost at 30% opacity behind the current outline (`renderSilhouetteCompare` already computes both). Consistent 3:4 viewBox across all 6 body types × 12 stages.
**Accept:** all 72 silhouette cells render inside their frames; compare view shows ghost + current cleanly.

### B12 — Real sound set

**Files:** new `public/audio/` (10–14 CC0 samples), new `src/audio/manifest.js`, rewrite `src/audio.js`
**Do:**
1. Samples: `pen-scratch`, `folder-open`, `folder-close`, `scale-clunk`, `page-turn`, `door-chime`, `cart-wheels`, `kettle`, `soft-chime` (week end), `stamp` (achievement/cover), `chair-creak`, `room-tone` (loop, −30 LUFS).
2. `audio.js`: preload via fetch+decodeAudioData on first user gesture; `play(id, { volume })` map in manifest; mute persists in `state.audioMuted` (existing field); `room-tone` loops at very low gain, toggled with mute.
3. Wire: weigh = `scale-clunk`; chart write = `pen-scratch`; open/close visit = `folder-open/close`; week end = `soft-chime` + `page-turn`; purchase = `stamp`; scene page = `page-turn`.
**Accept:** no oscillator code remains; total audio payload < 600 kB; mute kills room tone too.

### B13 — Motion pass

**Files:** `src/styles.css`, tab/modal modules
**Do:** one transition system: tab switches cross-fade at `--t-fast`; scene pages fade+rise 8px at `--t-slow`; week turn = day sheet slides off left, new one in from right (450ms, the only long animation); stage-up glow kept as-is. Global `@media (prefers-reduced-motion: reduce)` disables all of it.
**Accept:** no springs, no bounces; every animation ≤450ms; reduced-motion audit clean.

### B14 — Empty, loading, and first-run states

**Files:** `src/ui/tabs/*.js`
**Do:** every tab gets an authored empty state in-fiction (Relationships with <2 edges: "Nobody's said anything worth repeating yet."). Week-1 onboarding pointer sequence (already spec'd in IMPLEMENTATION_GUIDE Phase 0) restyled as three paperclip notes.
**Accept:** clicking through a brand-new game shows zero blank panels.

### B15 — Accessibility and input pass

**Files:** all `src/ui/` modules
**Do:** focus-visible rings (`--accent`, 2px) on every interactive element; modals trap focus and close on Esc (except ceremonies); tab order follows visual order; all actionable `div`s become `button`s; color contrast ≥ 4.5:1 on paper and night surfaces (check `--ink-soft`); hit targets ≥ 40px on coarse pointers; layout holds at 360px wide.
**Accept:** keyboard-only full week completed; Lighthouse a11y ≥ 95.

### B16 — Title and shell

**Files:** `index.html`, `README.md` (title section only)
**Do:** commit to **IndulgeCare Clinic** everywhere: `<title>IndulgeCare Clinic</title>`, meta description tightened, delete "Alternative title directions" from README, favicon = a simple ink clipboard mark (inline SVG data URI).
**Accept:** one name in header, tab title, README, export output.

---

## Part 4 — WS-C: The game layer (make the decisions hurt)

### C1 — The day sheet (week planning surface)

**Files:** new `src/daySheet.js`, `src/ui/tabs/interact.js`
**Do:** `buildDaySheet(state)` returns, computed from existing state only:
1. **Schedule:** patients sorted by urgency = (framing window cooling, C2) > (rung within 15 lb: `weightForStageIndex(c, stage+1) - c.weight < 15`) > (arc/loyalty beat ready: `canAdvanceArc`, `canAdvanceLoyaltyArc`) > rest.
2. **Arrivals:** `pendingInstallations` with ETA.
3. **Risk line:** heat, cover, rival delta this week (`rivalState.reputation - state.reputation`).
4. Each row shows its *cost of neglect* in words ("two weeks unseen; her warming is cooling").
Render as the top card of Interact and as a week-start page (through the modal queue) after each resolution.
**Accept:** a tester can answer "who must you see this week and why" from the day sheet alone.

### C2 — Framing windows cool

**Files:** `src/events.js` (`endWeek`), `src/characters.js` (`createPatient`)
**Do:**
1. Track `patient.unseenWeeks` (reset to 0 in `completeVisit`, +1 in `endWeek` when `seenThisWeek` false).
2. If `unseenWeeks ≥ 2` and tier is `warming`: `indulgence -= 3`, `openness -= 2` per week (floor at the tier boundary so a patient can slip back to `clinical_plus` but not to `clinical`); write ledger row `framing_cooled` once per episode; day sheet flags her.
3. Complicit patients don't cool; instead unseen complicit patients *raise heat* by 1/wk ("she's telling the story without you in the room" — whisper note).
**Accept:** sim: a neglect policy shows warming patients regressing; day sheet showed the flag ≥1 week before each regression.

### C3 — Cover operations (heat counterplay)

**Files:** new `src/coverOps.js`, `src/ui/tabs/management.js`, `src/gameOver.js`
**Do:** three player verbs, one panel:
1. `clean_charts` — 2 AP + $150: heat −12, and `recordLedger({ id: 'cover_scrub', data: { count } })`. The confession and audit *cite scrubs* ("Three entries rewritten in June alone").
2. `coach_front_desk` — 1 AP: `coverOps.activeBuffs.push({ id: 'coached', weeksLeft: 3 })`, +2 coverRating/week while active.
3. `ask_to_vouch` — requires a complicit patient, costs her 2 trust: heat −8, ledger `asked_to_vouch` (her arc and the audit reference it; overuse on one patient flips to resentment at 3 uses).
`buildAuditVerdict` extends to cite scrubs and vouches by count and week.
**Accept:** every mitigation both works numerically and leaves a fiction trace the audit reads back; no mitigation is strictly free.

### C4 — Complicity is cover (heat discount)

**Files:** `src/events.js` (`endWeek` heat block, ~line 638)
**Do:** scale gap heat: `gapHeat *= Math.max(0.5, 1 - 0.04 * complicitCount)` using `complicitTestimonyCount(state)` from `gameOver.js`. Cover label already flips to "They would never testify" — now it's mechanically true.
**Accept:** sim shows a high-complicity roster sustains a larger chart gap at equal heat; label and math agree.

### C5 — Difficulty starts

**Files:** `src/state.js`, new-game UI, `src/events.js`
**Do:** three presets chosen at new game (stored `state.difficulty`):
| Knob | resident | attending | audit season |
|---|---|---|---|
| Starting money | 3000 | 2400 | 1800 |
| Rent growth | none | +1.5%/wk from w8 | +2.5%/wk from w4 |
| Audit checks begin | week 20 | week 14 | week 8 |
| Gap-heat multiplier | 0.8 | 1.0 | 1.3 |
NG+ mutators (V5 draft) fold in as toggles on this screen. All knobs read from one `DIFFICULTY_TABLE` export.
**Accept:** sim runs all three; audit-season neglect run dies by week ~16 with 2 weeks of visible warning; resident balanced run never goes broke.

### C6 — The balance harness

**Files:** new `scripts/simulate.mjs`, `package.json` (`"sim": "node scripts/simulate.mjs"`)
**Do:**
1. Shim `globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} }` before importing `state.js`.
2. Import `createNewGame`, `endWeek`, visit/interaction functions; implement four policies: `greedy-money` (bill everything, minimum indulgence), `greedy-gain` (max feeding), `neglect` (end week immediately), `balanced` (visit by day-sheet order).
3. Run each for 52 weeks × 20 seeds; emit CSV (`week, money, heat, cover, reputation, patients, avgStage, distinctLinesRendered`) plus a summary table; `--assert` mode turns the Part 9 invariants into exit codes for CI.
**Accept:** `npm run sim -- --assert` exits 0 on a healthy build and fails when (e.g.) A7's formula is reverted.

### C7 — AP economy pass (sim-tuned)

**Files:** `src/patientVisit.js`, `src/state.js`
**Do:** current shape: 7 AP/week; a full visit checklist costs ~8+ AP, so completionism is impossible but the game never says so. Changes:
1. Visits are meant to be *partial*: surface "visit depth" — completing checkout with ≤5 AP spent grants +1 AP back ("efficient clinic day"), making breadth-vs-depth a real choice.
2. `getVisitActions` marks the mutually exclusive clinical/indulgent clusters visually (data already in `CLINICAL_CLUSTER`/`INDULGENT_CLUSTER`); picking from one cluster locks the other for that visit (the betrayal decision from the Fable memo), with the lock shown, not silent.
3. Tune AP max per difficulty via `DIFFICULTY_TABLE` after C6 curves are read.
**Accept:** sim: balanced policy sees 3–4 patients/week with meaningful variance; cluster lock renders and holds.

### C8 — The audit as a ceremony

**Files:** `src/gameOver.js`, `src/ui/scenePage.js`
**Do:** replace the terse `AUDIT_GAME_OVER` object with a full ceremony scene assembled from state: the summed gap (`summedChartGap`), the worst three per-patient gaps with their charted excuses quoted from ledger `chart_entry` rows, scrub/vouch citations (C3), then testimony — each complicit patient contributes one authored line (from a per-archetype pool, D-batch). Survivable audits (heat high but cover holds) become a *near-miss scene* instead of nothing.
**Accept:** a game-over audit names only numbers and entries the player watched happen; the near-miss fires at most once per 10 weeks and reads differently at different rosters.

---

## Part 5 — WS-D: Content scale-out to 10x

**Standing gates for every D-step:** voice cards exist first (D0b); every scene declares `heatBand` and chains-or-cites (existing `lint:scenes`); every batch ≥20% off-template; census (E6) reruns after each batch and its report is attached to the PR; `gameSettings.heatCap` is respected — content above the player's cap must have a warm-band variant or not fire.

### D0a — Content registry and pack layout

**Files:** new `src/content/` tree, `src/scenes/catalog.js`
**Do:**
1. Layout: `src/content/{scenes,events,weighIn,confessions,letters,testimony,groupScenes,epilogues}/…` — one module per family or batch, each exporting plain arrays/objects.
2. `src/content/registry.js` merges packs into the existing consumers: `SCENE_CATALOG` spread stays the single scene source; `WEEKLY_EVENTS` gains `…PACK_EVENTS`; a dev-only `validateContent()` asserts unique ids, `heatBand` presence, effect signature `(state, rng)`, and pool keys matching `proseSelect` conventions. Run it in `initUI` when `isDebugMode()`.
**Accept:** existing 16 scenes and ~45 events flow through the registry unchanged; `validateContent` passes; lint:scenes still green.

### D0b — Voice cards

**Files:** new `docs/VOICE_CARDS.md`
**Do:** one half-page card per speaking role: 17 patient archetypes (grouped into six families below) + 5 named staff. Card fields: register, three vocabulary reaches, sentence rhythm, what she deflects, what she never says, one tic (≤1 use per scene). Derive each card from her existing best lines.
Archetype families (used by D2–D4, D8, D12):
- **caregivers:** nurturer, housewifeDonor
- **strivers:** perfectionist, athlete, gymDefector
- **sensualists:** hedonist, socialite, vip, patron
- **observers:** scholar, foodBlogger
- **defiant:** rebel, rivalSpy, rivalDoctor
- **service:** foodTruckOwner, sleepClinicDefector, dreamer
**Accept:** blind test — given 3 unlabeled lines per role, a reader matches ≥80% to cards.

### D1 — The weigh-in ritual pack (~350 strings)

**Files:** `src/content/weighIn/<family>.js`, `src/patientVisitUi.js` (B7 consumes)
**Do:** per family × framing tier: dial-settle line, number-landing line, her reaction, and a chart-choice aside for hedge/fabricate ("She watches you write *fluid retention* and says nothing"). Full bespoke sets for the six families; the core six archetypes (nurturer, perfectionist, hedonist, scholar, rebel, dreamer) additionally get archetype-specific overrides (asymmetry budget). Pool keys: `weigh.<family>.<tier>.<slot>`.
**Accept:** census: no weigh-in line repeats within 6 consecutive weigh-ins of one patient; read-aloud pass on the core six.

### D2 — The confession matrix (4 → 22 scenes)

**Files:** `src/content/confessions/<family>.js`, registry
**Do:** per family: `warming_confession_<family>` (lied path, citing real `chart_entry` rows via the existing citation-slot pattern in `scenes/confession.js`), `warming_confession_honest_<family>`, and `complicit_crossing_<family>` (the second ceremony: she stops asking and starts telling). Existing 4 generic confessions become fallbacks. Selection in `endWeek`'s framing-crossing block keys on family.
**Accept:** confession sweep test (E5) passes per family: 20 randomized lie-histories + zero-lie path, 20/20 grammatical and state-true; read-aloud: each family's confession distinguishable with names redacted.

### D3 — Refusals and her-led beats (15 scenes)

**Files:** `src/content/scenes/refusals.js`, `herLed.js`; trigger wiring in `src/sceneEngine/triggers.js`
**Do:**
1. Six refusal scenes (one per family): low openness + an indulgent-cluster action attempted ⇒ she declines, in character; declining *well* (respecting it) banks trust, pushing twice costs it. Trigger via `checkVisitInterrupt` on first indulgent action when `openness < 20`.
2. Six her-led scenes: complicit patient books her own follow-up, arrives with demands; player choice is how to *chart* what she asks for.
3. Three devoted inversions: she runs the visit; the player's only choices are margins.
**Accept:** hostile playthrough encounters ≥2 refusals; her-led scenes fire only at complicit+ and cite ≥1 ledger row each.

### D4 — Rung ceremonies per family (4 → ~30)

**Files:** `src/content/scenes/rungs/<family>.js`, `src/events.js` rung mapping (~line 551)
**Do:** rung map gains a family dimension: `rung_first_softness`, `rung_wardrobe_stage5`, `rung_furniture_stage7`, new `rung_last_walk` (stage 9), `rung_immobility` — each with family variants (full bespoke for caregivers/strivers/sensualists; palette-varied shared spines for the rest, per asymmetry budget). Every rung writes `recordLedger({ id: 'rung', data: { stage } })` and later scenes cite the previous rung ("the chair conversation was four months ago").
**Accept:** no silent stage crossing (existing invariant) *and* no two families render the same rung text; each rung cites or is cited at least once in a full run.

### D5 — Weekly event expansion (~45 → ~140)

**Files:** `src/content/events/{early,mid,late,eraComplicit,seasonal,oneShots}.js`
**Do:**
1. +60 pool events tagged by era (gate on week + clinic tier from `clinicProgression.js`), all `effect(state, rng)`, ≥15 with **no mechanical effect** (pure texture — the asymmetry flagship).
2. Seasonal calendar: 10 in-world weeks (heat wave, county fair, flu season, holiday potluck…), replacing the 2 in `SEASONAL_WEEKS`, each with a start note, a modifier, and a closing echo the following week.
3. Twelve one-shots with unique triggers and hand-built consequences: the health inspector who is a former patient (reads `archivedPatients`); the week the scale breaks (every weigh-in estimates; dual ledger wobbles); a patient's sister books in to find out what changed; the Annex poaches your supplier; a food critic's review quotes your tagline (`getClinicTagline`).
**Accept:** census: in a 52-week run <10% event repeats; every one-shot fires exactly once across the 20-seed sim batch; texture events render without a ledger/effect footprint.

### D6 — Group scenes and whispers (7 → 24)

**Files:** `src/content/groupScenes/`, `src/relationships.js` (patient nodes), `src/ui/tabs/relationships.js`
**Do:**
1. Fifteen mindset-pair templates (5 pair classes × 3 each: slim×complicit, denial×devoted, curiosity×curiosity, complicit×complicit, staff×patient) rendered with the pair's names and one ledger citation each.
2. Waiting-room whisper notes: authored prose keyed to the mindset pair, written to the ledger (`id: 'whisper'`), surfaced as a day-sheet line and as edges on the relationship SVG (patient nodes join the staff graph).
3. Complicit recruitment: whisper note names the recruiter in the same sentence as the effect ("her friend Renata swears by the meal plans"); referral arrives `clinicalStart: false`, pre-warmed one tier.
**Accept:** persona attribution holds in group scenes (no interchangeable speakers); every referral's cause is readable in its whisper note.

### D7 — Staff depth (26 beats → ~66 + 5 signature scenes)

**Files:** `src/staffArcs/<name>.js`, `src/arcs.js`, new structures where noted
**Do:**
1. Each named staffer (Maya, Elena, Priya, Nadia, Jasmine) gets +4 beats extending her existing track past the current finale — the post-arc era where her choice settles in.
2. Five signature scenes, one per staffer, each structurally unique in the whole game: **Maya** — a three-week scene (three consecutive week-start pages, one choice each, outcome compounds); **Elena** — happens entirely in the log tab as entries that answer the player's actions; **Priya** — one page, no choices, the only scene where reading *is* the interaction; **Nadia** — the player is silent; every "choice" is which of *her* lines you let stand in the record; **Jasmine** — she reads your ledger aloud (cites 5 real rows) and asks one question.
3. Procedural hires (from `recruitment.js`): three guest-arc templates (×3 beats) keyed to role slot, replacing the single `PROCEDURAL_ARC`.
**Accept:** each signature scene's structure exists exactly once (lint: scene ids tagged `structure:` unique); staff census shows no beat text reuse across staffers.

### D8 — Letters and shadow lives (~40 items)

**Files:** `src/content/letters/`, `src/events.js` (departure hook from A7), `src/ui/tabs/interact.js` (mailbox)
**Do:**
1. Departure letters: family × exit-mindset templates (6 × 5, some cells merged ⇒ ~24 letters) with slots citing her ledger (last weigh-in, a scene she remembers). Delivered 1–3 weeks after departure into `state.pendingLetters`, read from a small mailbox panel; unread badge, no toast.
2. Six scripted returns: `weeks-away × rival gain rate` computes her new weight; the scene writes against it (she comes back changed and says how). Trigger: archived patient with `patient_departed` row, week gap 6–14, 20% per week window.
3. Rival cameos: two events where a defector is seen at the Annex; epilogue rows for never-returned patients (D9 consumes).
**Accept:** every letter renders with valid citations across 20 randomized departure states; returns recompute weight correctly at the boundaries (6 and 14 weeks).

### D9 — Chapters 4–5 and the epilogue matrix

**Files:** `src/chapters.js`, `src/endings.js`, `src/content/epilogues/`
**Do:**
1. Chapter 4 "Temple of Appetite" (V5 draft) and Chapter 5 "The Quiet Audit" — goals computable from existing stats (roster mindset mix, chart-gap sum, cover ops used).
2. Epilogue matrix: key = stage band (4) × mindset (5) × chart-gap band (honest / hedged / fabricated) = 60 cells. Author 24 flagship cells (all cells where mindset ∈ {complicity, devoted} or gap = fabricated); remaining cells compose from family spine + two slot sentences; every epilogue cites ≥1 ledger row ("Week 9. Fluid retention. You both kept the joke").
3. Clinic epilogue keyed on `clinicMindset` tier (4 variants), shown last.
**Accept:** finishing a run renders one epilogue per surviving patient with zero empty slots; the 24 flagship cells pass read-aloud; matrix coverage test renders all 60 keys without error.

### D10 — Census-driven pool deepening

**Files:** `src/patientVisitDialogue.js` pools, `src/content/` overrides
**Do:** run census after D1–D6; for every pool in the top-100 exposure list with <6 lines, deepen to 6–10 lines *unevenly* (per voice cards; some pools get 3 sharp lines instead — asymmetry). Complete the tone grid: 4 tones × 3 tone-enabled actions × 4 tiers narrative coverage (currently replies only, 3 entries).
**Accept:** census re-run: no top-100 pool below 6 effective variants (or flagged as intentionally sharp); tone play never falls back to toneless narrative.

### D11 — Wardrobe chains (2 → 20 scenes)

**Files:** `src/content/scenes/wardrobe/<bodyType>.js`
**Do:** per body type (6), a three-scene chain riding the existing appearance system (`patientAppearance.js` presets/behaviors): the garment that stops closing → the replacement shopping decision (chart it or don't) → the old garment resurfacing (cites chain start). Two extra chains for staff uniforms. Chains use `enqueueScene` (the existing scene-graph rule) rather than new machinery.
**Accept:** each chain completes across ≥3 weeks in sim; step 3 correctly quotes step 1's garment via ledger.

### D12 — Systems content rounding

**Files:** `src/achievements.js`, `src/clinic.js`, `src/challenges.js`, `src/loyaltyArcs.js`
**Do:**
1. Achievements 23 → 60: add cover-ops, confession (honest and lied), letters, returns, epilogue cells, signature scenes, sim-proof rare states (audit near-miss survived, zero-lie full run, all-complicit roster). ≤10 hidden.
2. Shop 12 → 28: three reputation tiers of furniture/compounds/marketing + room *sets* (owning a set adds a named room bonus via `rooms.js` affinities).
3. Challenges 3 → 9 (each with a named reward line, not just a modifier).
4. Loyalty arcs: 1 generic template → 6 family templates × 3–5 beats, using the D0b families.
**Accept:** all new checks fire in the 20-seed sim batch ≥ once except deliberately-rare ones (list them in the PR); shop tiers respect `reputation.js` gates.

---

## Part 6 — WS-E: Tests, lints, tooling

### E1 — Vitest scaffold

**Files:** `package.json` (add `vitest` devDependency, `"test": "vitest run"`), `tests/helpers.js` (localStorage shim, fixture builder)
**Do:** three save fixtures: `fresh` (createNewGame with fixed seed), `mid` (scripted 10 weeks), `endgame` (scripted 30 weeks) — generated by the sim, committed as JSON.
**Accept:** `npm test` runs green with one placeholder test.

### E2 — Core invariants suite

**Files:** `tests/state.test.js`, `tests/proseSelect.test.js`
**Do:** save round-trip identity on all three fixtures (`normaliseState(JSON.parse(JSON.stringify(s)))` deep-equals); v6→v7 migration; proseSelect full-rotation property (A2); rng determinism (A6): two 12-week sims same seed ⇒ identical JSON.
**Accept:** suite fails if anyone reintroduces `Math.random` into an effect (determinism test catches it).

### E3 — Render sweep

**Files:** `tests/render.test.js`
**Do:** `describeCharacter` across 6 body types × 12 stages × staff/patient; visit narrative for all 23 `VISIT_ACTIONS` × 4 framing tiers × 5 attitude tiers (skip empty-by-design cells listed explicitly); every `SCENE_CATALOG` scene resolves with a synthetic context (no `undefined`, no empty opening, no unresolved `{slot}`).
**Accept:** sweep green; the explicit skip-list is the only place empties are allowed.

### E4 — Scene and content lints extended

**Files:** `scripts/lint-scenes.mjs`, new `scripts/lint-content.mjs`
**Do:** lint-scenes covers `src/content/scenes/**` too; lint-content runs `validateContent()` headlessly (unique ids, heatBand, effect arity, pool-key format).
**Accept:** both wired into `npm test` and CI.

### E5 — Confession/citation sweep

**Files:** `tests/confession.test.js`
**Do:** the IMPLEMENTATION_GUIDE §2.5 gate, executable: for each confession family (D2), 20 randomized lie-histories + the zero-lie path; assert grammatical joins (no `..`, no dangling connectives), state-true citations (every quoted excuse exists in that run's ledger), and the honest variant fires only at zero dishonest entries. Same harness reused for letters (D8) and epilogues (D9).
**Accept:** 20/20 state-true per family; failures print the rendered scene for read-aloud debugging.

### E6 — The census

**Files:** new `scripts/census.mjs`
**Do:** instrument `proseSelect.pickSeen` (env flag `CENSUS=1`) to tally `(scopeId, poolId, index)`; run the sim's balanced policy 20 seeds × 30 weeks; report: top-100 most-rendered strings, pools never fired (dead content), repetition debt (fire rate ÷ pool size), distinct-lines-per-run. Output `docs/census/latest.md` (gitignored except when a D-batch PR attaches it).
**Accept:** census runs end-to-end in <60s; D-batch PRs include its delta.

### E7 — Prose lint → AI-tell lint

**Files:** `scripts/lint-prose.mjs`
**Do:** add detectors: rule-of-three chains above threshold (>2 per 40 lines per file); cross-pool 5-gram duplicates (whole `src/content` + dialogue files); banned list (`palpable`, `testament`, `tapestry`, `myriad`, `a sense of`, `couldn't help but`, `found herself`, `something shifted`, `if she was being honest`); sentence-length variance floor per pool (flag pools where every line is within ±15% of mean length). Grandfather existing files via a checked-in baseline file; new/changed lines gate hard.
**Accept:** lint passes on baseline, fails on a seeded fixture containing each tell.

### E8 — CI workflow

**Files:** new `.github/workflows/ci.yml`, edit `.github/workflows/deploy.yml`
**Do:**
1. `ci.yml` on push + PR to all branches: `npm ci` → `npm test` → `npm run lint:prose` → `npm run lint:scenes` → `node scripts/lint-content.mjs` → `npm run sim -- --assert --weeks 20 --seeds 5` (short mode) → `npm run build`.
2. `deploy.yml`: insert `npm test` and `lint:scenes` before build (today it runs only lint:prose).
3. Grep gates in ci.yml: `Math.random` banned in `src/`; raw Tailwind palette classes (`bg-amber-`, `text-stone-`, `rounded-2xl`, `tracking-[`) banned outside `styles.css` after B-steps land (add when B2 merges).
**Accept:** a PR that breaks any gate cannot merge green.

### E9 — Playtest telemetry (debug only)

**Files:** `src/debugTools.js`
**Do:** debug panel additions: seed display/copy (A11), repetition-debt table (census-lite, in-browser), heat/cover sparkline from `state.history`, "export run transcript" (all rendered narrative in order, for read-aloud QA).
**Accept:** transcript export of a 10-week run opens as clean markdown.

---

## Part 7 — WS-F: Ship posture

### F1 — Docs consolidation

**Do:** move to `docs/archive/`: `V3-PLAN.md`, `V4-PLAN.md`, `V5-PLAN.md`, `V1-V2-AUDIT.md`, `V3-AUDIT.md`, `GAME_SHORE_UP_MASTER_PLAN.md`, `INTERACTIVE_SLIM_TO_FAT_MASTER_PLAN.md`, `AGENT_PERSONAS.md`. Keep live: this doc, `QUALITY_10X_PLAN.md`, `THE_ULTIMATE_PLAN.md`, `IMPLEMENTATION_GUIDE.md`, `FABLE_REVIEW_MEMO.md`, `VOICE_CARDS.md`, `PATIENT-APPEARANCE-PROSE-MANIFEST.md`.
**Accept:** `docs/` root lists ≤8 files.

### F2 — README rewrite

**Do:** player-first: what the game is (two paragraphs, content boundaries prominent: all characters adults, opt-in framing, heat-cap setting), one screenshot (post-B), play link, run instructions, then a short contributor section pointing at AGENTS.md and this blueprint. Feature scrolls move to new `CHANGELOG.md`.
**Accept:** README < 120 lines; a stranger can find the live URL in the first screen.

### F3 — AGENTS.md doctrine update

**Do:** append the five standing rules (QUALITY_10X_PLAN §2), the content-pack layout (D0a), pool-key naming, and the commit format from Part 0.
**Accept:** an agent reading only AGENTS.md knows where new content goes and which lints will judge it.

### F4 — Consent and heat surfaces

**Files:** new-game screen (C5's), `src/ui/scenePage.js`
**Do:** `gameSettings.heatCap` (exists in state: `'charged'` default) gets a visible new-game control (warm / charged / explicit) with plain-language descriptions; every scene's `heatBand` is checked at fire time — above-cap scenes swap to their warm variant or skip with a fiction-neutral fallback; a settings drawer allows changing mid-run.
**Accept:** cap set to warm ⇒ zero charged+ scenes render across a full sim transcript (grep the E9 transcript by heatBand tags).

### F5 — Performance and save budget

**Do:** after all D-batches: verify initial gz payload (A10 target), `endWeek` under 16ms at endgame fixture, save JSON < 400 kB at week 52 (seenLines caps from A2 and ledger cap 400 hold it); if save exceeds, tighten caps, don't prune ledger citations that epilogues need (protect `chart_entry`, `rung`, scene rows in `trimLedger`'s keep-priority — extend it to prefer dropping `whisper`/texture rows first).
**Accept:** numbers measured and recorded in the PR.

### F6 — Final QA protocol

**Do:** run the six exit tests from QUALITY_10X_PLAN §9 (repeat, screenshot, read-aloud, lumpiness, memory, instrument) plus: keyboard-only run, 360px run, reduced-motion run, warm-cap run, and the three difficulty sims. File defects as issues tagged `exit-test`.
**Accept:** all six pass; zero open `exit-test` issues.

### F7 — Release

**Do:** tag `v2.0.0`, CHANGELOG entry, merge to `main`, verify Pages deploy, hard-refresh check on the live URL, README screenshot refreshed from production.
**Accept:** live site plays a full week with no console errors.

---

## Part 8 — Sequencing

Workstreams interleave; steps inside a stage can parallelize across implementers because they touch disjoint files.

| Stage | Steps | Why this order | Gate to advance |
|---|---|---|---|
| **S0 — Safety net** | A1, A2, E1, E2 | Migration + selection engine land behind tests before anything depends on them | `npm test` green; v6 save loads |
| **S1 — Correctness** | A3–A8, E3, C6 | Variety live, determinism restored, sim exists to watch everything after | Determinism test green; census-able |
| **S2 — Structure** | A9–A13, E4, E6, E7, E8 | UI split + full CI before the face changes | CI red/green trustworthy; bundle split |
| **S3 — The face** | B1–B16 | Visual identity in one continuous push (split commits per step) | M2 screenshot test (QUALITY_10X_PLAN) |
| **S4 — The game** | C1–C5, C7, C8 | Decisions sharpened, tuned against C6 curves | Sim curves sane on all difficulties |
| **S5 — Crown content** | D0a, D0b, D1, D2, E5 | Registry + voices, then the two beats the whole design orbits (weigh-in, confession) | Confession sweep 20/20 per family |
| **S6 — The cast** | D3–D6 | Refusals, rungs, events, whispers — the middle-game body | Census delta attached; attribution ≥80% |
| **S7 — The deep cuts** | D7–D9, D11 | Signature scenes, letters, epilogues, chains | Epilogue matrix renders all 60 keys |
| **S8 — Rounding** | D10, D12, E9 | Census-driven deepening last, when exposure data is real | No top-100 pool under target |
| **S9 — Ship** | F1–F7 | Hygiene, consent surfaces, QA, release | All exit tests pass |

Estimated shape (single implementer, focused): S0–S2 ≈ a week; S3 ≈ a week; S4 ≈ a week; S5–S8 is the long pole — several weeks of writing gated by lints and read-alouds; S9 ≈ days. Agents parallelize S5–S8 well because packs are disjoint files with mechanical gates.

---

## Part 9 — Definition of done (the numbers)

The build is 10x when all of these hold, measured, not vibed:

1. **Variety:** census distinct-lines-per-30-week-run ≥ 10× the pre-A3 baseline (record the baseline number in the S1 PR before fixing it).
2. **Scale:** scene catalog ≥ 110 entries; events ≥ 130; corpus ≥ 8,500 long strings; every category in Part 1's table at or past target.
3. **Determinism:** same seed ⇒ identical 52-week state hash, twice, in CI.
4. **Balance:** all four sim policies produce distinct money/heat curves; no policy exceeds $50k by week 52; neglect on audit-season dies with ≥2 weeks of visible warning; every death cites only numbers previously shown.
5. **Feel:** initial payload <250 kB gz; endWeek <16 ms at endgame; Lighthouse a11y ≥95; zero toasts; zero oscillator tones; zero raw palette classes outside `styles.css`.
6. **The six exit tests** from `QUALITY_10X_PLAN.md` §9 — repeat, screenshot, read-aloud, lumpiness, memory, instrument — all pass with a second reader.

When the last row checks, the game is not a bigger prototype. It is a small, obsessive, hand-made machine, ten times the game, with no grid showing.
