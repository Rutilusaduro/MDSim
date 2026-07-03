# THE ULTIMATE PLAN

**Authors:** The Implementer & The Dreamer (negotiated in the room, signed by both)
**Date:** 2026-07-03
**Supersedes:** `GAME_SHORE_UP_MASTER_PLAN.md` phasing; incorporates `FABLE_REVIEW_MEMO.md` amendments; merges The Implementer's Plan and The Dreamer's Plan.
**Mode:** Plan only. Agents implement from Section 3.

---

## 1. The discussion

**IMPLEMENTER:** Let's start where we already agree, because I think you missed that we do. My plan has "diegetic charting at checkout" — one choice at the end of each visit, what do you write in her chart. Your dual ledger is the same instinct. The difference is you made it load-bearing: two numbers in state, a per-patient gap, an audit that sums it, a confession assembled from the entries. I wrote a garnish. You wrote a mechanic.

**DREAMER:** Then say the word.

**IMPLEMENTER:** I changed my mind. The dual ledger is better than my version and I want it. *But* — I want to argue about the confession before I sign. "Procedurally assembled from the player's own lies" is either the best scene in the game or a mad-libs disaster, and the difference is invisible until render time. My WS1 acceptance criterion was that the confession must be, by read-aloud test, the best scene in the game. A free-assembly procedural scene cannot clear that bar reliably. Sample-render review demands 20/20 grammatical and state-true and 18+/20 fresh. Slot soup fails "fresh" on the third playthrough.

**DREAMER:** You're imagining full generation. I'm describing citation. The sceneEngine already takes `ctx` functions — the doorway wedge branches on mindset today. The confession has a hand-authored emotional spine: she arrives, she doesn't sit, she has her phone out with the patient portal open. The procedural part is *which entries she reads aloud* — real rows from her own chart, week-stamped, in your handwriting. "Fluid retention. Four visits running. I read my chart in the portal." The spine is authored once per archetype family. The knife is that the quotes are *hers* — I mean yours. The player's.

**IMPLEMENTER:** A hand-authored spine with slotted citations from real ledger rows — that I can gate. Concretely: the scene template declares citation slots; each slot is filled from actual `chartedWeight` entries with authored connective tissue per entry-type; if the player never lied, there's an authored honest-variant of the scene, because "no data" cannot render as an empty accusation. That last case is where procedural scenes die and nobody notices until a player hits it.

**DREAMER:** Accepted — and the honest variant is a gift, not a fallback. A player who charted every pound truthfully gets a *different* confession: she noticed you never once covered for her, and that's its own kind of intimacy. Two ceremonies for the price of one guard clause.

**IMPLEMENTER:** Good. That's adopted, amended. Now the tuning question, because "the gap is a per-patient heat reservoir" is the kind of sentence that costs three balance passes. Two weight numbers per patient, a gap feeding heat, an audit summing gaps across the roster — how does the player *see* any of this before it kills them? My rule from the mole critique applies here too: no game-over may cite a number the player never saw.

**DREAMER:** The chart IS the display. The visit modal is already a chart; show both columns in it — her real trend line and the charted line, diverging. The gap isn't hidden, it's the most visible thing in the room, drawn as two lines pulling apart. The audit reads the summed gap, sure, but the player watched every entry get written because *they wrote it*.

**IMPLEMENTER:** Two lines diverging on a chart the player authored — that's honest, and it's cheap. Fine, but I'm constraining the math: the gap does exactly two things at launch. It scales that patient's heat contribution, and the audit reads the roster sum. No third coupling, no reservoir that "discharges," no interest rate. If playtests want more, we add more. Simple systems earn their complexity.

**DREAMER:** Signed. Now defend your sequence, because your WS0 is my Phase 0 with the interesting parts stripped out. You put the unified mutator first — good — but your callback plan is `setsFlags` strings and hand-wired reads. You'll ship eight scenes in WS2 that each hand-wire their echoes, and by WS3 you'll have the flag spaghetti I'm trying to prevent. The Memory Ledger — `{id, week, characterId, data}` with a query API — costs nearly nothing at Phase 0 and makes remembering the *default*. Your own acceptance criterion says "every scene sets a flag a future visit reads back." I'm giving you the infrastructure your criterion assumes.

**IMPLEMENTER:** My resistance was to shipping infrastructure before a vertical slice proves it's needed. But you're right that this one is different: the slice itself needs it. The confession cites ledger rows; the weigh-in writes them; the worldEcho reads them. It's not speculative infrastructure, it's the slice's data model. Adopted at Phase 0 — with one condition: it ships *dark*. No migration drama, flags API keeps working as a shim over it, and the first consumer is the weigh-in, in the same phase-1 slice that proves it. Second concession from me, and it's the last free one you get.

**DREAMER:** Then spend me down. The waiting room.

**IMPLEMENTER:** The waiting room is where I push back hardest. "Patient-to-patient influence network" is a simulation. Mindset contagion across relationship edges is hidden math acting on hidden state — the player sees a patient arrive "pre-warmed" and has no idea why. That's the numbers-wallpaper failure mode wearing a social graph. And it's unbounded tuning: every archetype pair is a coupling constant.

**DREAMER:** The player *would* see it — whisper notes, patient nodes on the relationship SVG we already render for staff. The waiting room is the most under-designed room in the game. Two women who've never shared a scene sit eight feet apart every week and the game says nothing.

**IMPLEMENTER:** The *observation* is dead right and I'm keeping it. The fix is scope. Version one: whisper notes are authored prose keyed to the pair's mindsets — visible, no hidden math — plus exactly one mechanical edge: complicit patients recruit, and referrals arrive pre-warmed with a whisper note that says so in fiction. "She came in asking for Dr. — by name. Said her friend Renata swears by the meal plans." The player sees the cause in the same sentence as the effect. Full contagion simulation is deferred, with a trigger: if playtests show players tracking pairs and wanting to *work* them, the appetite for the system exists and we build it. If nobody reads the whispers, we saved ourselves the coupling constants.

**DREAMER:** I'll take visible whispers plus recruitment as v1 — on the condition that whisper notes write to the Memory Ledger like everything else, so if we do build contagion later, the history is already there. Concession one from me, but I'm framing it as a down payment.

**IMPLEMENTER:** Ledger-backed whispers, agreed. Clinic-as-character next, and this one I mostly like because you did my favorite trick: *derived* state. Sterile → hospitable → indulgent → shrine computed from decor, style, roster framing — no new sim, no new save fields. The tagline rewriting itself is one function. Ambient lines per tier, cheap. What I'm killing is "drives patient generation and rival behavior" — that's the clinic label growing feedback loops before it's even proven players notice the label.

**DREAMER:** The label without teeth is a mood ring.

**IMPLEMENTER:** A mood ring the player reads every session because it's in the header. Here's the player-felt case, in your terms: when the tagline rewrites itself from "Primary care with a personal touch" to something the shrine tier would say, that's the *building* confessing — the same beat as the patient confession, at architectural scale. It doesn't need to drive spawns to land. If the label proves legible — players screenshot it, quote it — teeth come in a later pass, trigger condition stated in the table. Deferred, not killed.

**DREAMER:** Fine — but the epilogue matrix keys on it. If the clinic is a character, it gets an ending. Stage × mindset × chart-gap for patients, clinic tier for the building itself.

**IMPLEMENTER:** Epilogue keyed on clinic tier, adopted — endings are exactly where derived labels earn their keep, it's authored content against a computed key. Appetite weather now. You want summed roster appetite driving supply cost, lobby smell, and style drift. I deferred appetite v1 in my plan because it was a new decay loop nobody would see. Your version is better because it's *derived again* — sum the stat that already exists. I'm taking supply cost and the "food bill beats rent" chapter beat, because a line item in the weekly resolution is player-felt every single week. I'm taking one ambient lobby line per appetite band. I'm cutting the style-drift coupling — that's two systems holding hands under the table where no player can see.

**DREAMER:** Two out of three and the chapter beat survives — that's the part I actually cared about. The week the food bill beats the rent should feel like a chapter title. Concession two, cheerfully.

**IMPLEMENTER:** The mole. I want to concede this one properly, because my WS4 said "loyalty meter + thresholds" and you called it a progress bar in a trench coat, and — yes. It is. A meter that fills until a scene fires is the exact system-on-paper disease I claim to be allergic to. Your version — her gain arc IS her allegiance arc, feed-to-flip, the double-agent romance — costs barely more than mine, because the gain systems already exist for every other character. She's a character we point the existing machinery at, plus authored beats at the flip threshold. And "Annex Defection" as the inverted rival event is a real payoff. Adopted nearly whole. One amendment: the leak-scales-with-heat function needs to surface in fiction *before* it costs the player — she gets cagey, she's seen near the annex, a whisper note fires. Telegraphed, per my hostile-playthrough criterion.

**DREAMER:** Telegraphed betrayal is better drama anyway. The dread is the content. And the rival mirror-sim?

**IMPLEMENTER:** No sim. But your question — "poached patients return heavier, heavier HOW?" — deserves its answer as *content*: when a patient defects, she's archived with her exit weight; if she returns, a scripted return event computes weeks-away × rival gain rate and writes the scene against it. The rival's methods show in her body and her attitude — she comes back changed and the prose says how. That's your mirror, authored. Same treatment for archived shadow lives: the letters, adopted in the last phase because they're pure content on top of the archive that the defection system already creates. Rival cameos and epilogue entries ride the same data.

**DREAMER:** Authored mirror accepted — a simulation the player never opens is just a heater. Last one: scene graphs. Your WS2 said eight to ten scenes with aftermath + callback flags. Mine says a scene that neither chains nor cites is a longer menu.

**IMPLEMENTER:** That one's free, because it's my criterion with better teeth. Adopted verbatim as the scene gate: **every new scene must either `enqueueScene` a consequence or cite the Memory Ledger — most should do both.** It's even lintable: static check on the scene catalog, which makes the quality-gates skill happy. And loop 1 — complicity is cover — I haven't said yet: adopted whole. One modifier in the heat calculation, a cover label that turns into "They'd never testify," and complicit patients literally testifying at audit. Small code, enormous fiction. That's the ratio I want everywhere.

**DREAMER:** Then we agree on the shape: your discipline, my substrate. Ledger at the bottom, the visit on top of it, the confession as proof, the building last.

**IMPLEMENTER:** And one hill, not two. Yours is "the game remembers your lies, and one day someone reads them back to you." Mine was "the moment she stops pretending must be the best-felt moment in the game." They're the same scene. She stops pretending *by reading your chart back to you*. Write it as one sentence and I'll sign it.

---

## 2. Verdict table

Every Dreamer idea, dispositioned. "KILLED" reasons are stated as player-felt cost, per the rules of the room.

| # | Dreamer idea | Verdict | Disposition |
|---|---|---|---|
| D1 | Weigh-in as a DECISION (chart-entry choice), not prose | **ADOPTED** | Merged with Implementer's weigh-in stage-craft: dial settles → number lands → player chooses what to chart. The ritual and the decision are one beat. Phase 1. |
| D2 | **Dual Ledger** — `weight` + `chartedWeight`, gap as per-patient heat reservoir, audit reads summed gap | **ADOPTED (amended)** | State ships dark in Phase 0; UI is two diverging lines in the chart view (nothing hidden). Gap does exactly two things at launch: scales that patient's heat contribution; audit reads roster sum. No third coupling until playtests demand it. |
| D3 | Confession **procedurally assembled from the player's own lies** | **ADOPTED (amended)** | Hand-authored spine per archetype family + citation slots filled from real ledger rows with authored connective tissue. Mandatory authored honest-variant for truthful players (its own reward scene, not a fallback). Gated by sample-render review: 20/20 grammatical + state-true, 18/20 fresh. |
| D4 | Memory Ledger substrate — flags → `{id, week, characterId, data}` + query API | **ADOPTED** | Phase 0, shipped dark behind a flags-API shim. First consumer is the Phase 1 weigh-in. Implementer's callback criteria assumed this existed; now it does. |
| D5 | Mole as double-agent romance; gain arc IS allegiance arc; feed-to-flip; Annex Defection event | **ADOPTED (amended)** | Replaces the "meter + thresholds" plan item. Existing gain/arc machinery pointed at her + authored flip beats. Amendment: leak-scales-with-heat must telegraph in fiction (cagey lines, whisper note) at least two weeks before it costs the player. |
| D6 | Scene GRAPHS — "chain or cite the ledger" rule | **ADOPTED** | The scene gate for all new scenes: must `enqueueScene` a consequence or cite the Memory Ledger; most do both. Enforced by static lint on the scene catalog. |
| D7 | Rival as mirror-sim (poached patients return heavier) | **AMENDED** | No simulation — an unwatched sim is a heater. Authored mirror: defectors archived with exit weight; scripted return events compute weeks-away × rival gain rate and write the scene against it. Player-felt identically; tuning cost near zero. |
| D8 | clinicStyle as personality, not coupon | **ADOPTED (amended)** | Softness ≥65 passive `framingErosion` adopted (one line, per dominant style). Spectacle's contagion multiplier **deferred** until contagion exists (see D10). Style also feeds the clinic-mindset derivation (D12). |
| D9 | Furniture ledger — week-stamped world flags, `worldEcho` dialogue slot, replacement retires echo + mints devotion beat | **ADOPTED** | Subsumed into the Memory Ledger (same table, `characterId: null` for building rows). worldEcho slot in visit dialogue Phase 2; replacement-retires-echo + devotion beat adopted whole — it's the ledger's best proof of life. |
| D10 | Waiting room: mindset contagion via patient-pair edges, whisper notes, patient nodes on relationship SVG | **AMENDED / DEFERRED** | v1 (Phase 3): authored whisper notes keyed to mindset pairs — visible prose, no hidden math — written to the Memory Ledger; patient nodes on the existing SVG. Full contagion math **deferred**; trigger: playtests show players tracking pairs and trying to seat-plan the lobby. |
| D11 | Complicit patients recruit friends who arrive pre-warmed | **ADOPTED** | Phase 3, with the causal whisper note in the same breath as the effect ("her friend Renata swears by the meal plans"). |
| D12 | Clinic-as-character: derived mindset ladder (sterile→hospitable→indulgent→shrine), ambient voice, self-rewriting tagline | **ADOPTED (amended)** | Derived-only: computed from decor, dominant style, roster framing — zero new save state. Tagline self-rewrite + per-tier ambient lines + clinic epilogue keyed on tier. "Drives patient generation and rival behavior" **deferred**; trigger: evidence players read the label (quotes, screenshots, playtest remarks). |
| D13 | Appetite as weather — summed roster appetite → supplyCost, lobby smell, style drift | **AMENDED** | Adopted: summed appetite → weekly supply cost line item + one ambient lobby line per appetite band + "food bill beats rent" chapter beat. **Killed:** appetite→style drift coupling — two systems influencing each other below the player's sightline produces outcomes no player can attribute, which reads as randomness, not depth. |
| D14 | Loop 1: complicity is cover — witnessed indulgence generates less heat; "They'd never testify" label; complicit patients testify at audit | **ADOPTED** | Whole. One heat modifier + one label + one audit beat. Best code-to-fiction ratio in either plan. Phase 3. |
| D15 | Loop 4: mole leak scales with heat | **ADOPTED (amended)** | Per D5 — must telegraph in fiction before it bites. |
| D16 | Loop 7: archivedPatients shadow lives — letters, rival cameos, epilogue entries | **ADOPTED (deferred to Phase 4)** | Pure content on top of the defection archive D7 creates. Letters first (cheapest, highest ache), cameos and epilogue rows ride the same data. |
| D17 | Patient loyalty arcs should use relationships.js all-pairs edges (not solo arcs) | **AMENDED** | Solo archetype arcs remain the Phase 3 backbone (they're the proven template from the slice). Pair edges surface through whispers (D10) and group patient scenes from mindset-crossed templates — one authored template per mindset-pair class, not per pair. |
| D18 | Epilogue matrix keyed stage × mindset × chart-gap | **ADOPTED** | The chart-gap axis is the dual ledger paying off at the end of the run: the epilogue knows whether you lied to her and says so. Phase 4. |
| D19 | Phase 0 SUBSTRATE ordering (mutator, ledger, dual-ledger dark, modal queue) | **ADOPTED (merged)** | Merged with Implementer WS0 trust fixes into a single Phase 0. Both halves are small; neither blocks the other. |
| D20 | "Every scene must cite the ledger or chain" as a standing rule | **ADOPTED** | See D6; promoted to a lint gate per quality-gates skill §6 (every mechanism gets a permanent self-check the day it lands). |

**Implementer positions revised in the room, for the record:** the dual ledger replaces (and is strictly better than) diegetic-charting-at-checkout; the Memory Ledger belongs at Phase 0, not "on demand"; the mole meter is dead, replaced by D5; deferred-appetite becomes derived-appetite (D13) instead of a new loop.

---

## 3. THE ULTIMATE PLAN

Five phases plus a continuous ratchet. Tags: **[IMPL]** from the Implementer's plan, **[DREAM]** from the Dreamer's, **[MERGED]** negotiated hybrids. Phases are strictly ordered; the ratchet runs throughout.

### Phase 0 — SUBSTRATE & TRUST [MERGED]

*Player-facing outcome: a new player reaches their first visit without confusion, and the game grows a memory nobody sees yet.*

| Item | Tag | Notes |
|---|---|---|
| Week-1 onboarding: patients-arrive-week-2 copy, default tab Interact (week ≤ 2), 3-step first-run pointer | [IMPL] | |
| Modal queue (`ui/modals/queue.js`): resolution → group → crisis → ending; kill timer overwrite | [IMPL] | |
| Single End Visit control (collapse bill → end double checkout) | [IMPL] | |
| Styled confirms replacing `prompt`/`confirm`; Save/Load in header; AP nudge before end week | [IMPL] | |
| Unified effect mutator `mechanics/applyEffects.js` — one apply path for visit actions, tones, scenes | [MERGED] | Both plans had it first; now it is. |
| **Memory Ledger**: `{id, week, characterId, data}` store + query API; existing `setsFlags` shimmed onto it | [DREAM] | Ships dark. First consumer: Phase 1 weigh-in. |
| **Dual-ledger state**: `chartedWeight` per patient, written by existing weigh actions (mirroring `weight` for now) | [DREAM] | Ships dark. Save-migration covered. |

**Done when:** fresh-player first ten minutes yields zero confusion notes; end week never silently drops a modal; all stat deltas flow through one mutator (grep proves it); ledger + `chartedWeight` round-trip through save/load at three game states.
**Depends on:** nothing. **Unblocks:** everything.

### Phase 1 — THE VISIT IS THE GAME (vertical slice, one archetype) [MERGED]

*Player-facing outcome: one patient plays clinical → confession → complicit → epilogue, and the confession is built from the player's own chart entries.*

| Item | Tag | Notes |
|---|---|---|
| Framing tier chip + chart note in visit header; ghost rows for warming-gated actions ("unlocks as her framing warms") | [IMPL] | `getVisitActionGate` returns locked previews instead of `{visible:false}`. |
| Warming prose tier: full narrative + reply pools; scrub gorging vocabulary from `clinical`/`clinical_plus`; tone gating (shameless/cruel locked until warming) | [IMPL] | Clinical-grep gate lands same day (ratchet). |
| **Weigh-in ritual + chart-entry decision**: dial settles → number lands (per framing tier × archetype) → player chooses what to chart; entry writes `chartedWeight` + a ledger row | [MERGED] | D1+D2. The visit's centerpiece. Replaces flat `weigh_patient`. |
| Chart view shows both lines — real trend and charted trend, diverging | [DREAM] | The gap is the most visible thing in the room. |
| Gap mechanics v1: scales this patient's heat contribution; audit reads roster-summed gap. Nothing else. | [DREAM] | Two couplings, hard cap, per negotiation. |
| Mutually exclusive clinical-vs-indulgent visit clusters (exam + services phases) | [IMPL] | Choosing is the visit. |
| **The confession (crown jewel)**: clinical→warming ceremony, hand-authored spine + citation slots reading her real chart rows; authored honest-variant for truthful players | [MERGED] | D3. Priority over random weeklies. |
| Warming→complicit ceremony; one refusal beat (low-openness snack decline); one her-led beat (she books the follow-up and dares you to chart it) | [IMPL] | Fable amendments, adopted in both plans. |
| Consent surfaces: heat-band labels (warm/charged/explicit) on scenes; new-game toggles | [MERGED] | Fable P1 item, pulled forward — it gates everything after. |
| This archetype's epilogue cells (stage × mindset × chart-gap minimum) | [MERGED] | Proves the D18 key shape early. |

**Done when:** the slice plays end-to-end with zero placeholder prose; sample-render review passes (20/20 grammatical + state-true, 18+/20 fresh) on every touched pool *including* the assembled confession across ≥20 distinct lie-histories plus the honest path; by read-aloud test the confession is the best scene in the game; every scene in the slice writes to and reads from the ledger.
**Depends on:** Phase 0. **Unblocks:** Phases 2–4.

### Phase 2 — THRESHOLDS & MEMORY [MERGED]

*Player-facing outcome: nothing important passes silently, and the building starts keeping receipts.*

| Item | Tag | Notes |
|---|---|---|
| Rung-crossing hook in `endWeek` (`newStage > oldStage` fires ceremony, priority over random weeklies) | [IMPL] | |
| Scene catalog to 8–10 at doorway-wedge quality, under the **chain-or-cite gate** (every scene `enqueueScene`s a consequence or cites the ledger; most both) | [MERGED] | D6 sharpening the Implementer's aftermath+callback criterion. Beat families: scale, chair, button/waistband, doorway (exists), car/booth, mirror. Best `earlyGameEvents` premises migrated; rest deleted. |
| `worldEcho` slot in visit dialogue citing week-stamped ledger rows; furniture replacement retires the echo + mints a devotion beat | [DREAM] | D9. The ledger's proof of life. |
| Anticipation lines on roster cards (state-keyed one-liners between visits) | [IMPL] | The skill-01 design test answered from the roster screen. |
| Toasts for wardrobe/world/mole notes (consequences leave the log tab) | [IMPL] | |
| Chain-or-cite static lint on the scene catalog | [MERGED] | Permanent self-check, same day as the gate. |

**Done when:** continuity audit passes (three stateful events → zero contradictions, ≥1 callback each); no stage crossing in a full playthrough passes silently; scene lint is green; a player can name each patient's next threshold from the roster.
**Depends on:** Phase 1 (ceremony template, ledger consumers proven).

### Phase 3 — THE CONVERSATION (horizontal scale + live loops) [MERGED]

*Player-facing outcome: the whole cast talks — to the player, to the chart, and to each other.*

| Item | Tag | Notes |
|---|---|---|
| Slice replication per archetype: warming pools, weigh-in variants, confession spine, refusal, her-led beat, epilogue cells | [IMPL] | A grid; fill it. Agents excel here — which is why it comes after the template, never before. |
| De-duplicate 16× blob/immobile monologues (persona peaks + shared generics); staff blob voice rewrite; Exam floor / Staff wing labels | [IMPL] | |
| Archetype-keyed loyalty arcs; departure scenes for churned patients (writing the archive D16 reads later) | [IMPL] | |
| **Complicity is cover**: witnessed indulgence heat modifier; cover label → "They'd never testify"; complicit patients testify at audit | [DREAM] | D14, adopted whole. |
| **Mole double-agent romance**: gain arc = allegiance arc; feed-to-flip threshold; leak scales with heat, telegraphed in fiction ≥2 weeks before it bites; supply-closet scene; Annex Defection event | [MERGED] | D5. Replaces the meter. |
| Whisper notes v1: authored mindset-pair prose, ledger-backed; patient nodes on relationship SVG; complicit patients recruit pre-warmed referrals with causal whisper | [MERGED] | D10/D11 scoped. Contagion math stays deferred. |
| Group patient scenes from mindset-crossed templates (one template per pair-class) | [DREAM] | D17 amended. |
| **Appetite as weather (trimmed)**: summed roster appetite → supply-cost line in weekly resolution; one lobby ambient line per band; "food bill beats rent" chapter beat | [MERGED] | D13. Derived, visible, cheap. |
| Softness ≥65 passive framingErosion (style as personality, first tooth) | [DREAM] | D8 partial. |
| Rival returns (authored mirror): defector archived with exit weight; scripted return event scaled by weeks-away × rival gain rate | [MERGED] | D7 amended. |

**Done when:** persona attribution ≥80% (name-stripped dialogue re-attributed); no two patients render identical text for the same beat; three-playthrough test — rush, spread, hostile — passes, with hostile confirming the mole's betrayal was visible two weeks out; the supply-cost line moves week over week and one playtester mentions the food bill unprompted.
**Depends on:** Phases 1–2. Whispers/recruitment additionally depend on the ledger (Phase 0).

### Phase 4 — THE LIVING BUILDING [MERGED]

*Player-facing outcome: the clinic confesses too, and the run ends knowing everything you did.*

| Item | Tag | Notes |
|---|---|---|
| Clinic mindset ladder (derived: sterile → hospitable → indulgent → shrine); self-rewriting `PUBLIC_CLINIC_TAGLINE`; per-tier ambient lines | [DREAM] | D12, derived-only. Teeth deferred pending legibility evidence. |
| Epilogue matrix per main character, keyed **stage × mindset × chart-gap**; clinic epilogue keyed on clinic tier | [MERGED] | D18 + Fable's move-to-fiction-phase. The ledger pays off at the end of the run: the epilogue knows whether you lied to her. |
| Audit endgame integration: summed chart-gap read; complicit patients testify (D14 payoff); mole flip state changes the verdict scene | [MERGED] | All three Phase-3 systems converge on one climax. |
| Archived shadow lives: letters from departed patients first; rival cameos + epilogue rows off the same archive | [DREAM] | D16. Pure content on existing data. |
| Chapter transition prose; chapter goal tooltips | [IMPL] | |

**Done when:** hostile playthrough produces a game-over the player saw coming for ≥2 weeks with every cited number previously visible; finishing a run makes you wonder what the other epilogue cells say; the tagline has rewritten itself at least twice in a full run and reads correctly for the clinic's state at each.
**Depends on:** Phase 3.

### Continuous — THE RATCHET [IMPL]

Runs from Phase 0, never a sprint (quality-gates skill §6):

- Style-ledger grep + clinical-language grep in CI from the day the Phase 1 scrub lands.
- Chain-or-cite scene lint from the day the gate exists (Phase 2).
- **Chart-gap sweep** (new, for the dual ledger): automated render sweep of the confession across randomized lie-histories including the zero-lie path — no empty citations, no contradictions, rate-based so RNG can't flake CI.
- Save round-trip at three game states; render smoke test; content-safety gate blocking every release.
- Every hand-found bug becomes an automated check the same day.

**Gate:** no phase ships with its greps dirty.

### Sequence at a glance

```
Phase 0 ──► Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4
(substrate    (the visit;  (thresholds  (the cast +  (the building
 + trust)     confession)   + memory)    live loops)   + endings)
RATCHET ═══════════════ continuous ═══════════════════════════
```

### Cut/deferred registry (so nothing resurrects silently)

- **Killed:** wardrobe numeric fit model; floor-plan touch support; rival counter tags + annex meter; achievement progress bars; NG+ exposure; appetite→style coupling; free-assembly procedural prose; rival as running simulation.
- **Deferred with triggers:** full waiting-room contagion math (trigger: players demonstrably work patient pairs); clinic mindset driving patient generation/rival behavior (trigger: label legibility evidence); appetite/hunger decay loop v1 (trigger: post-slice playtests report visits feel thin *despite* ritual + clusters); spectacle contagion multiplier (trigger: contagion exists); scene-resolver merge and full `ui.js` split (trigger: a concrete task they block); legacy consult removal (trigger: first commit that touches it).

---

## 4. Joint hill to die on

> **She stops pretending by reading your own chart back to you.**
>
> The clinical→warming confession — the genre's best single scene — must be the best-felt moment in the game, and it must be assembled from the player's own recorded lies. The Dreamer's substrate guarantees the game remembers (dual ledger and Memory Ledger at Phase 0, so memory is the default, not a feature). The Implementer's discipline guarantees it lands (hand-authored spine, honest-variant, sample-render gates, and the whole vertical slice ordered so this one scene gets more iterations than anything else in the project). Every phase after either feeds that moment or echoes it — the weigh-in writes the entries, the ceremonies spend them, the audit sums them, the epilogue reads them back one last time. If a feature does none of those things, it waits.

*Signed,*
**The Implementer** — fewer strokes, deeper.
**The Dreamer** — and every stroke remembered.
