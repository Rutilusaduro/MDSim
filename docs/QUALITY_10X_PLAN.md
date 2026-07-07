# The 10x Plan — Quality, Content, Fun, and the De-AI Polish Pass

**Scope:** How to make IndulgeCare Clinic ten times better across quality, content, and fun, and how to polish it until nothing about it reads as machine-generated.
**Relationship to prior docs:** This plan does not replace `THE_ULTIMATE_PLAN.md`. Phases 3–4 of that plan remain the content backbone and are scheduled inside Milestone 3 below. This plan wraps around it: it covers everything the fiction-systems plan deliberately ignored — presentation, game feel, balance, variety engineering, production craft — plus a standing doctrine for why the game currently smells like a template and how to fix that at the root.

---

## 1. Diagnosis: where the AI smell actually comes from

Be precise about the enemy. "Feels AI generated" is not one problem; in this codebase it is five, and each has a file and line number.

### 1.1 Determinism wearing a variety costume

Four modules pick dialogue with the same function: sum the character id's char codes, mod the pool length.

- `src/patientVisitDialogue.js:10`
- `src/interactionDialogue.js:7`
- `src/visitDialogueBeats.js:8`
- `src/staffCheckInDialogue.js:7`

Consequence: a given character says **the same line for the same action every single time, forever, across every playthrough**. The pools of 4 variants per tier exist, but any individual player experiences exactly one of them per character. The game has thousands of lines of prose and plays like it has a quarter of that. Worse, two characters whose ids happen to collide mod 4 are word-for-word identical. This single function is the biggest quality lever in the repo.

### 1.2 The grid

Open `patientVisitDialogue.js` and look at the shape: every action × five tiers × exactly four lines. `bodyProse.js`: six body types × twelve stages, one line each, all the same length and cadence. `weeklyContent.js`: events all built from the same `{id, title, text, effect}` mold. Perfectly uniform coverage is the number-one tell of generated content. Human-authored games are lumpy: the writer fell in love with one character and gave her nine lines; another gets two but they're perfect; one event breaks the template entirely because the idea demanded it. The grid must be broken deliberately.

### 1.3 The default-Tailwind identity

`styles.css`: Inter, dark glassmorphism (`backdrop-filter: blur(18px)`), amber-to-pink gradient buttons named `gold-button`, `rounded-2xl` everywhere, uppercase `tracking-[0.28em]` micro-labels, toast notifications sliding in at bottom-right. This is the 2024–2025 AI-app house style, recognizable at a glance from across the room. The game's prose voice contract is disciplined and specific; its visual voice is a stock photo.

### 1.4 The instrument panel reading experience

The prose is the product, and it is rendered as `text-sm` gray sans-serif inside dashboard cards and stacked modals. Line lengths run full-container. Numbers, meters, pills, and chips crowd every surface. The best writing in the game (the confession, the rung ceremonies) displays in the same visual register as the supply-cost line item.

### 1.5 Placeholder sensory layer

`audio.js` is raw oscillator beeps. Silhouettes are abstract SVG blobs. There are no transitions, no motion design, no week-turn moment. The game reads; it never *feels*.

Also noted, lower severity: the staff name grid (Okafor/Ruiz/Shah/Volkov/Brooks — the demographically balanced five-pack), stage names that escalate on a perfectly even ramp, a docs folder with eleven planning documents and three alternative titles still listed in the README. Players never see the docs, but the title indecision leaks into the product: the header, the README, and the save key currently disagree about what the game is called.

**What is already good and must be protected:** the prose voice contract (`.cursor/skills/beautiful-prose`), the em-dash ban, the framing-tier ladder (clinical → warming → complicit), the dual ledger, the memory ledger substrate, the scene chain-or-cite lint, deterministic seeded RNG, save migration discipline, and a build that compiles in 240ms. None of this gets torn down.

---

## 2. The doctrine: five standing rules

These are permanent rules, not milestone items. Every content or UI change from now on is checked against them. Add them to `AGENTS.md` when Milestone 1 lands.

**Rule 1 — No line renders twice while another eligible line is unseen.** Variety is an engineering problem before it is a writing problem. The selection layer must track what each player has seen and prefer the unseen. (§3.1)

**Rule 2 — The asymmetry budget.** Every content batch (new event set, new archetype, new action pool) must include at least 20% off-template items: a line pool of 9 where the grid says 4, an event with no `effect` at all, a character who refuses the beat the template expects. Uniform batches are rejected in review even if every line is individually good.

**Rule 3 — Specificity beats sentiment.** A line earns its slot with one concrete detail that could not be swapped to another character: her particular brand of tea, the particular chair arm, the particular lie she told in week 3 (the memory ledger exists; cite it). Lines that could be said by anyone, to anyone, get cut. This is the read-aloud test made mechanical.

**Rule 4 — One visual voice.** Every pixel goes through the design tokens defined in §4. No raw Tailwind palette classes in feature code, no new gradients, no emoji in UI chrome. The clinical-chart art direction (§4.2) is the identity; anything that fights it is a bug.

**Rule 5 — Nothing ships without being played.** Every PR that touches content or UI includes a note: what the author saw when they played the affected beat, in a real run, not the debug panel. The balance harness (§5.4) automates the macro version of this.

---

## 3. Pillar A — The variety engine and the prose upgrade (quality)

### 3.1 Replace char-sum picking with a seen-line ledger

Build `src/proseSelect.js`, one module, and route all four call sites through it:

```js
// pick(state, character, poolId, pool) →
// 1. filter pool to lines this character has never rendered (tracked in
//    state.seenLines[characterId][poolId] as indices)
// 2. if all seen, filter to least-recently-seen
// 3. pick among candidates with rngForState (already seed-stable)
// 4. record the choice
```

Costs one new save field plus migration (the v6 pipeline in `state.js` already handles this pattern). Immediate effect: the existing thousands of lines of authored prose actually reach the player. This is the highest ratio of player-felt improvement to effort available anywhere in the project and it ships first.

Add a **repetition debt report** to the debug panel: which pools are too small for how often they fire (fire rate × roster size vs. pool size). That report becomes the writing backlog, so new lines go where players actually see repeats instead of where the grid has a gap.

### 3.2 Voice cards, then a rewrite pass with teeth

Thirteen speaking roles (5 named staff + 8 patient archetypes) get a half-page voice card each in `docs/VOICE_CARDS.md`: vocabulary she reaches for, sentence rhythm, the topic she deflects, the thing she never says, one verbal tic used at most once per scene. Cards are written by reading her existing best lines and keeping only what's distinct.

Then a targeted rewrite pass, ordered by exposure: run the string census (§6.2) to find the 100 most-rendered strings in a normal run, and rewrite those against the voice cards first. Not a full-corpus pass — the corpus is large and mostly unseen; polish where the player's eyes actually land.

### 3.3 Expand the prose linter into an AI-tell linter

`scripts/lint-prose.mjs` already catches em dashes and filler pivots. Add detection for the remaining machine tells:

- **Rule-of-three chains** ("warm, soft, and satisfied") above a per-file frequency threshold — the single most common generated-prose rhythm.
- **Cross-pool near-duplicates:** n-gram overlap (say, shared 5-grams) between lines in different pools. The same clause reused across archetypes is how sixteen characters collapse into one narrator.
- **Banned intensifier/abstraction list:** palpable, testament, tapestry, myriad, "a sense of", "couldn't help but", "found herself", "something shifted".
- **Uniform sentence-length variance:** flag pools where every line lands within ±15% of the same word count. Real pools are ragged.

Run in CI (§6.1). Existing content gets grandfathered with a burn-down list, new content gates hard.

### 3.4 Lumpy content by design

Apply Rule 2 retroactively to the highest-traffic grids: `say_hi`, `weigh_patient`, `review_chart` pools grow unevenly (the nurturer gets 9 greetings, the skeptic gets 3 sharp ones), and each named staff member gets **one signature scene that exists nowhere else structurally** — a scene whose UI, pacing, or choice structure is bespoke to her (one plays out over three consecutive weeks; one is a single screen with no choices at all; one happens in the log rather than a modal). Six bespoke structures is what makes a player say "a person made this."

---

## 4. Pillar B — Presentation: the game should look like what it is (polish)

### 4.1 One name

Pick the title. Recommendation: keep **IndulgeCare Clinic** (it's the save key, the README, the deployed URL) and delete the "alternative title directions" from the README. Header, `<title>`, ending cards, and export all use the one name. Indecision is a prototype smell.

### 4.2 Art direction: the chart, not the nightclub

The game is a primary-care clinic whose paperwork slowly stops being honest. That is a complete art direction, and it is not amber glassmorphism:

- **Surfaces:** manila folder, chart paper, tabbed dividers. Light-on-paper for chart/visit surfaces; the current warm dark can survive as the after-hours shell around them. The contrast between sterile paper and warm room *is the framing-tier ladder rendered visually.*
- **Type:** a serif or humanist text face for all narrative prose (system stack is fine: `Charter, Iowan Old Style, Georgia, serif` — zero bytes), measured at 60–70ch with 1.6+ leading, `text-base` minimum. A tabular/mono face for chart numbers so weigh-ins look like instrument output. Inter can keep the chrome. The moment prose gets book typography and numbers get chart typography, the whole game changes register.
- **The tell-kill list:** `gold-button` gradient → solid ink-on-paper buttons with one accent; toasts → a diegetic "note added to the day sheet" line; uppercase tracked micro-labels → small caps or plain labels; `rounded-2xl` → one radius token, small; both radial background glows → gone.
- **Tokens:** all of this lands as CSS custom properties in `styles.css` (`--paper`, `--ink`, `--accent`, `--radius`, `--measure`), and feature code uses the tokens. This is what makes Rule 4 enforceable.

### 4.3 Scene presentation tiering

Three visual registers, matched to fiction weight:

1. **Sheet** — routine actions and results, inline in the visit panel, no modal.
2. **Page** — scenes (rung ceremonies, arcs, whispers): full-width paper page, book typography, choices as written lines, gentle fade-in. The modal queue from Phase 0 already sequences these; this changes what they look like.
3. **Ceremony** — confessions, chapter turns, endings: the screen clears. Nothing else visible. The weigh-in dial-settle beat gets a two-step reveal (dial, then number) because the entire game is about that number landing.

### 4.4 Motion and sound, small but real

- One motion system: 150–250ms ease-out on panel changes, a deliberate week-turn transition (the day sheet slides off, the new week's slides on), the existing stage-glow kept. No springy bounce anywhere; this game moves like paper, not like an app.
- Replace oscillator beeps with a single small recorded set (10–15 samples, CC0: pen scratch, folder close, scale clunk, kettle, room tone). A `sounds.json` manifest with per-event volume, the existing mute toggle honored. The scale clunk on weigh-in alone will do more than every synth tone combined.

---

## 5. Pillar C — Fun: sharpen the decision layer (game)

The fiction systems are strong. The *game* underneath them is soft: money rarely threatens, AP spends feel interchangeable, and heat/cover — the central dramatic stat — mostly accumulates rather than confronts.

### 5.1 Make the week a plan, not a spend-down

Add a lightweight **day-sheet planning surface**: at week start the player sees who's on the schedule, what's pending (installations arriving, arcs ready to fire, rung thresholds within reach — computable from existing state), and commits AP with visible opportunity cost ("if you don't see Renata this week, her warming window cools"). Framing windows that can *decay* one notch after N ignored weeks turn the roster from a checklist into triage. Triage is fun; checklists are not.

### 5.2 Heat needs counterplay, not just a meter

Heat currently rises and the audit eventually reads it. Give the player verbs: the complicity-is-cover modifier (ULTIMATE_PLAN D14) plus two or three active mitigations with real tradeoffs (clean the charts — costs a week and writes a ledger row the confession can cite bitterly; lean on a complicit patient to vouch — spends her trust). Every mitigation writes to the memory ledger so the fiction can read the cover-up back later. Dread with agency is a game; dread without agency is a countdown.

### 5.3 A difficulty shape, chosen not defaulted

Three named starts (comfortable / standard / audit-season) varying starting cash, rent ramp, and audit cadence. The economy today has one implicit difficulty that playtests as "eventually comfortable." NG+ mutators from the V5 draft fold in here rather than as a separate system.

### 5.4 The balance harness — the only new infrastructure this plan asks for

A headless autoplayer, `scripts/simulate.mjs`: seeds a game, plays N policies (greedy-money, greedy-gain, neglect, balanced) for 52 weeks using the same exported functions the UI calls, and prints curves — money, heat, reputation, stage distribution, event-fire counts, lines-rendered histogram. Assertions turn into CI gates: no policy goes infinitely rich; neglect dies visibly (telegraphed ≥2 weeks, per the hostile-playthrough criterion); every weekly event fires at least once across the seed batch; no pool exhausts silently. This is how balance changes stop being vibes, and it doubles as the render-smoke test the IMPLEMENTATION_GUIDE already wanted.

---

## 6. Pillar D — Craft infrastructure (what makes the other pillars stick)

### 6.1 Tests and CI

Vitest, thin and fast, run in the deploy workflow before build:

- Save round-trip identity at three fixtures (fresh / mid / endgame).
- Render sweep: `describeCharacter` + visit narrative across the full stage × tier grid — no `undefined`, no empty string, no unresolved template slot.
- Confession sweep: ≥20 randomized lie-histories plus the zero-lie path (already specified in IMPLEMENTATION_GUIDE §2.5; make it executable).
- `lint:prose`, `lint:scenes`, and the new AI-tell checks.

### 6.2 String census

`scripts/census.mjs`: instrument the balance harness to count every rendered string. Output: top-100 most-seen lines (the rewrite worklist for §3.2), pools that never fired (dead content — cut or re-trigger), repetition debt per pool. Run it after every content batch.

### 6.3 Repo hygiene

`docs/` currently contains eleven planning documents including two superseded generations. Move everything superseded to `docs/archive/`; keep live only this plan, `THE_ULTIMATE_PLAN.md`, `IMPLEMENTATION_GUIDE.md`, `VOICE_CARDS.md`, and the audits. Rewrite the README top section for a player, not a changelog reader: what the game is, one screenshot, how to run it, content boundaries (the all-adult, opt-in framing stays prominent). Move the V2/V3/V4 feature scrolls into a `CHANGELOG.md`.

---

## 7. Pillar E — Content at 10x without 10x the smell

Ordering matters: **variety engine and voice cards land before any bulk content**, or new content inherits the grid disease at scale.

1. **Finish THE_ULTIMATE_PLAN Phases 3–4 first.** Cast-scale visit depth, whispers and recruitment, the mole's telegraphed betrayal, appetite weather, the audit climax with complicit testimony, the epilogue matrix. That plan's content is well-designed and partially built; the fastest honest 10x is finishing it under the new doctrine (every batch passes the asymmetry budget and the AI-tell lint).
2. **Depth over breadth for archetypes.** Eight archetypes with full framing-ladder journeys (each with a distinct confession spine, refusal beats, and her-led complicit beats per the Fable memo) beat sixteen shallow ones. No new archetypes until all eight clear that bar.
3. **One-shot events that break the mold** — the asymmetry budget's flagship deliverable. A dozen hand-built, once-per-run events with unique triggers and no shared template: the health inspector who is a former patient; the week the scale breaks and every weigh-in is estimated (the dual ledger gets interesting); a patient's sister books an appointment to find out what changed. Each cites the memory ledger, per the scene gate.
4. **The building keeps its promises.** worldEcho rows, furniture replacement retiring echoes into devotion beats, the self-rewriting tagline — all already specified; they are the ambient texture that makes the world feel authored, and they're cheap.

---

## 8. Milestones

Ordered so every milestone is player-felt on its own. No milestone starts until the previous one's gate passes.

| # | Name | Contents | Done when |
|---|------|----------|-----------|
| **M1** | **The Selection Fix** | §3.1 seen-line ledger + migration; repetition debt report; §6.1 test scaffold with render sweep + save round-trip in CI | Two full playthroughs of the same seed render <10% identical dialogue lines; CI red on any empty render |
| **M2** | **The New Face** | §4 in full: tokens, chart art direction, typography split, scene tiering, motion, sample-based sound, one title | Screenshot of a visit page is not identifiable as Tailwind-default; prose measures 60–70ch; weigh-in has its two-step reveal; zero raw palette classes in feature code (lintable) |
| **M3** | **The Backbone** | ULTIMATE_PLAN Phases 3–4 under the new doctrine; voice cards written first; §3.3 AI-tell lint gating the batches | Phase 3/4 "done when" criteria from IMPLEMENTATION_GUIDE pass; persona attribution ≥80%; asymmetry budget verified per batch |
| **M4** | **The Game Part** | §5.1 day sheet + decaying windows; §5.2 heat counterplay; §5.3 difficulty starts; §5.4 balance harness with CI assertions | All four sim policies produce distinct, sane 52-week curves; a playtester can articulate why they chose this week's plan over an alternative |
| **M5** | **The Lumpy Pass** | §3.2 top-100 rewrite; §3.4 six signature scenes; §7.3 one-shot events; string census wired into review | Census shows no top-100 line failing its voice card; six structurally unique scenes shipped; ≥12 one-shots live |
| **M6** | **Ship Posture** | §6.3 repo hygiene; README rewrite; CHANGELOG; content-boundary settings surfaced at new game (heat cap already in `gameSettings`); final full-run read-aloud QA | A stranger can find the game, understand it, run it, and finish a run hitting zero placeholder or repeated-verbatim text |

Rough weight: M1 is days; M2 and M4 are each a solid week-scale effort; M3 is the long pole (it was already the long pole); M5 and M6 are steady content/polish work that can interleave once M3's systems are in.

---

## 9. The exit test: "doesn't feel AI generated," measurably

The phrase becomes a checklist. The game passes when:

1. **The repeat test** — two consecutive full runs on different seeds; a reader diffing the transcripts finds the overlap in *structure*, not sentences.
2. **The screenshot test** — five screenshots shown cold to someone who builds web apps; they do not say "Tailwind template" or name the default look.
3. **The read-aloud test** — the top-100 census lines read aloud; zero rule-of-three autopilot, zero interchangeable-speaker lines, each named character identifiable blind from her three best lines.
4. **The lumpiness test** — a reviewer can point at five places where the game is *unevenly* generous (a scene structure that exists once, a pool that's strangely deep, an event with no mechanical payload) — the fingerprints of a human who cared about one thing more than the grid required.
5. **The memory test** — in one run, at least three moments where the game cites something specific the player did weeks earlier, in prose, unprompted. The substrate exists; this test proves it's felt.
6. **The instrument test** — numbers appear only where the fiction says they land (chart, scale, ledger); nowhere does a meter explain what a sentence should have.

When all six pass, the game will not merely avoid feeling generated — it will feel like the thing it's been trying to be since the first design doc: a small, obsessive, hand-made machine about the distance between what gets charted and what gets fed.
