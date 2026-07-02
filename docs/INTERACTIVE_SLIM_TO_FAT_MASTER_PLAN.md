# Interactive Slim-to-Fat Master Plan
## IndulgeCare Clinic: 6 → 10 Initiative

**Status:** Design only (no implementation in this document)  
**Agents:** Systems/Game Design · VN/Branching Narrative · Prose/Content  
**North star:** Interactivity is paramount. Every dramatic beat is a choice with lasting consequences.

---

## Roundtable: How the Three Agents Align

### Where all three agree

| Principle | Systems | Narrative | Prose |
|-----------|---------|-----------|-------|
| **One engine, many surfaces** | Interactive Scene Engine (ISE) | Reuse `staffArcs/engine.js` for patients + interrupts | Content lives in data files, not scattered `effect()` fns |
| **Slim phase is underwritten** | Mindset axis gates choices | Voice tiers 0–3 need 3–4 options per beat | ~15k words needed in transitional band (+25–50 lb) |
| **PCP double life** | `coverRating` / `secrecy` stats | Framing erosion is *choice-driven* | Clinical verbs mask feeding in visit copy |
| **Doorway wedge = vertical slice** | First full interactive conversion | 8-scenario anchor #1 | Jeans/button/zipper micro-beats feed it |
| **Staff = patient parity** | Same flag/effect schema | Loyalty arcs become scenes | Staff slim mirror lines in break room |

### Productive tensions (resolved)

**Tension 1: How many layers?**  
- Narrative proposed 4 layers (arc / visit interrupt / world / ambient erosion).  
- Systems proposed 1 ISE with priority queue.  
- **Resolution:** One engine, four *trigger types* (`arc_beat`, `visit_interrupt`, `week_interrupt`, `ambient_choice`). Same resolver, different enqueue rules.

**Tension 2: When does clinical mask break?**  
- Prose wants explicit diet/gym guilt through stage 3.  
- Narrative wants erosion from player choices, not stats alone.  
- **Resolution:** `framingErosion` 0–100 on each character; stats set *ceilings*, choices set *pace*. A player who always charts edema can keep a patient clinical through stage 4.

**Tension 3: Passive events — delete or upgrade?**  
- Systems: deprecate passive `fire*` over 3 versions.  
- Prose: keep 40 event *premises*, expand prose.  
- **Resolution:** Migrate `earlyGameEvents.js` + `WARDROBE_EVENTS` to scene catalog; `defer` choice falls back to old passive text (player chose not to engage).

**Tension 4: Mole slot**  
- Systems: mole choices in break room + visit checkout.  
- Narrative: closet scene (#5) promotes into Jasmine arc if present.  
- **Resolution:** Phlebotomist hire = mole; `mole_supply_closet` scene week 6+; choices affect `moleLoyalty` and rival rep.

---

## Part I: Unified Architecture (Systems Lead)

### Interactive Scene Engine (ISE)

**New modules (proposed):**

```
src/sceneEngine/
  index.js          # resolveScene, applyEffects, enqueue, once-keys
  triggers.js       # evaluateTriggers(context) — week, visit, profile
  flags.js          # global / char / clinic namespaces

src/scenes/
  catalog.js        # re-exports all scene defs
  world.js          # doorway, chair, maintenance
  wardrobe.js       # button, jeans, zipper, scrubs
  patientSocial.js  # friend shock, diet referral, scale lie
  staffBreak.js     # closet, fridge raid, scale removal
  loyalty.js        # patient loyalty beats as scenes

src/slimFatScenes.js   # prose-heavy event DB (Content lead)
src/mindset.js         # getMindset(), bridges attitude + framing
```

**Scene definition schema:**

```js
{
  id: 'world_doorway_wedge',
  scope: 'character',           // character | visit | clinic | group
  priority: 80,                 // visit interrupt > mole > group > ambient
  onceKey: (ctx) => `doorway_${ctx.character.id}`,
  trigger: {
    minGainFromBaseline: 18,
    maxGainFromBaseline: 80,
    minStage: 7,
    mobility: ['waddling', 'assisted'],
    chance: 0.28,
    notFlags: ['global:doorway_widened'],
  },
  opening: (ctx) => tierVoice(ctx),
  choices: [{
    id: 'push_hips',
    label: 'Push from behind — gentle pressure',
    hint: '+openness · −cover',
    apCost: 1,
    requires: { staffCount: 2, mindsetMin: 'curiosity' },
    setsFlags: ['char:{id}:wedge_push_helped'],
    effects: { openness: 3, coverRating: -5, weight: 0.2 },
    outcome: (ctx) => '...',
  }],
  beat2: { /* conditional on choice id */ },
}
```

### Save state v6 additions

```js
state.sceneState = { pending: [], resolved: [], weekInterrupt: null };
state.coverRating = 100;      // PCP plausibility
state.secrecy = 50;           // inverse public heat
state.globalFlags = [];

character.scenes = { flags: [], choices: {}, firedOnce: [] };
character.framingErosion = 0;
character.mindsetCache = null; // optional perf
```

### Mindset progression (unified ladder)

| Mindset | Gates | Player label |
|---------|-------|----------------|
| `slim` | stage 0–1, framing clinical | "Still believes the dryer" |
| `denial` | stage 2, openness < 25 | "Must be swelling" |
| `curiosity` | stage 3–4 OR openness 25–50 | "Why am I so hungry?" |
| `complicity` | warming/complicit OR indulgence 40+ | "I know what I come for" |
| `devoted` | indulgence 70+ or stage 9+ | "Feed me until…" |

Maps to existing `getAttitudeKey()` + `getPatientFramingTier()` via `getMindset(character)`.

### AP economy (interactive tax)

| Action | AP | Notes |
|--------|-----|-------|
| Visit phase action | 1 | unchanged |
| Resolve visit interrupt | 0–2 | crisis beats often 0, feeding branches 1–2 |
| Week interrupt (mandatory) | 1 | blocks end-week until resolved |
| Defer scene | 0 | escalates next week (−rep, +heat) |
| Staff arc choice | 1 | unchanged |

### Risk axes

1. **Reputation** — public success, patient cap, rival race  
2. **Cover rating** — PCP audit risk; high = slim patients stay clinical  
3. **Heat** — mole reports, viral moments, lobby incidents  

Choice hints show tradeoffs: `+rep · −cover`, `+indulgence · +heat`.

### UI patterns

| Pattern | Use | File |
|---------|-----|------|
| **Visit interrupt (inline)** | Mid-exam crisis | `patientVisitUi.js` — replaces action grid |
| **Arc modal** | Staff beats, loyalty beats | `ui.js` — extract `openSceneModal()` |
| **Week interrupt (blocking)** | Mole, rival, group | `endWeek` → resolution modal "Handle now" |
| **Digest chip** | Low-stakes wardrobe | `thisWeek` note + Resolve button |
| **Route panel** | Character profile | `getRouteLabel()` + framing badge + codex |

---

## Part II: Narrative & Branching (VN Lead)

### Four trigger types, one resolver

1. **Arc beats** (slow) — staff 5-beat tracks; patient loyalty 3-beat interactive  
2. **Visit interrupts** (medium) — pause phase rail, 1–3 beats, log to `visit.interruptLog`  
3. **Week interrupts** (fast clinic) — doorway, fridge raid, friend shock  
4. **Ambient erosion** — no modal; `framingErosion += N` from visit action tone

### Choice design rules

- **Always 3–4 options:** indulge / clinical cover / pragmatic / gated (trust, route flag, inventory)  
- **Visible gates:** disabled + hint ("Needs trust 8+")  
- **Hidden gates:** filtered by `choiceAvailable()` — secret routes  
- **Soft gates:** `(?)` label until `state.stats.routesDiscovered`  

### Flag vocabulary (canonical)

**Patient:** `patient_plan_adjusted`, `patient_scale_lie`, `patient_wedge_push_helped`, `patient_diet_referral_sent`, `patient_button_praised`, `patient_loyalty_motive_food`  

**Staff:** `staff_closet_joined`, `staff_fed_first`, `staff_witnessed_scale_lie`  

**Clinic:** `clinic_door_widening_queued`, `clinic_chart_scrutiny_risk`, `clinic_lobby_incident`, `clinic_fridge_lock_installed`  

**Routes (UI epithets):** "Gorging Plan Convert", "PCP Cover Story", "Honest Numbers", "Hands-On Care", "Break Room Complicit"

### PCP framing erosion (choice-driven)

| Choice | Erosion Δ | Effect |
|--------|-----------|--------|
| Chart in clinical language | +0 | Maintains cover |
| Offer snack menu on BP visit | +8 | Skips clinical greeting sooner |
| Feed in place before billing | +25 | Complicit tier early |
| Tell friend "specialty metabolic plan" | +10 | Patient may overhear rumor |
| Send real dietitian referral | +0 | Rival diet support event |

### Eight flagship scenarios (full trees)

Detailed beat-by-beat trees are in the Narrative agent output. Summary:

| # | Scene ID | Trigger | Core tension |
|---|----------|---------|--------------|
| 1 | `world_doorway_wedge` | gain 18–80, stage 7+ | push / snack-wait / widen / chart edema / defer |
| 2 | `exam_button_pop` | weigh or symptoms, gain 14–38 | clinical deflect / praise / fetch button / clinic tunic |
| 3 | `bathroom_jeans_zip` | gain 50+, ashamed voice | oil / scrubs swap / hands-on zip / cut loose |
| 4 | `diet_referral_ask` | intake, visits 2+, clinical framing | comply / delay / adjust gorging plan / refuse blunt |
| 5 | `staff_closet_snack` | week 5+, nurse stage 2+ | cover / policy / join eat / blackmail playful |
| 6 | `scale_wont_read` | exam weigh, over cap | lie / truth / deflect / celebrate overflow |
| 7 | `lobby_thin_friend` | visits 3+, checkout | defend PCP / validate gain / humiliate |
| 8 | `break_fridge_raid` | week 6+, 3 staff | feed A/B/C first / split equal → jealousy beat |

Each scenario has **Beat 2 aftermath** branching on Beat 1 choice. Sequels chain (`doorway_escalated` if deferred).

### Staff arc + body branches

Procedural hires: same 5-beat skeleton, **one body-specific choice per beat** injected via `bodyBranch(beatId, bodyType)`:

- Pear: hip wedge, skirt zipper  
- Apple: stethoscope blocked by belly  
- Hourglass: bra strap, button gap  
- Athletic: jacket won't zip, denial lasts longer  

Cross-contamination: clinic flag `door_widening_queued` unlocks bulk uniform order in Maya beat 1.

### Replayability

- **Fixed skeleton:** choice IDs, flags, gates  
- **Procedural skin:** names, `bodyType`, `getPatientPublicReason()`, friend NPC from pool  
- **Codex:** discovered routes/scenarios without spoiling locked content  

---

## Part III: Prose & Content (Writing Lead)

### Voice bible (six stages)

| Stage | Gain band | Voice |
|-------|-----------|-------|
| S1 Slim denial | +0 | Diet lexicon, gym guilt, dryer blame |
| S2 Noticing | +6–25 | Names seam, explains away |
| S3 Transitional | +25–50 | **Largest content gap** — war between voices |
| S4 Surrender | +50–90 | "I used to count almonds" |
| S5 Fat pride | +90–150 | Wardrobe stops fighting |
| S6 Devoted | +150+ | Growth is plot; shorter, heavier verbs |

### 12 archetypes × 6 stages

Full matrix in Writing agent output (72 sample lines). Wire via:

```js
// patientDialogue.js or slimFatScenes.js
patientSlimMatrix[archetype][stage] → string[]
getCharacterDialogue() prefers when slimMindset && gain < 50
```

### Body-type early physicality

First signal by type: pear seat, apple belly, hourglass waist softening, athletic thigh fill, willowy visible hip, compact face/waist.

Use `composeWardrobeLine()` + `STRAIN`/`FIT_VISUAL` bands — don't hand-write outfits in events.

### Clinical masking table (visit actions)

| Chart says | Action | Hidden meaning |
|------------|--------|----------------|
| Nutrition counseling | comfort_plan | Gorging plan as discharge paperwork |
| Hydration protocol | offer_water | Pre-meal palate wash |
| Appetite stimulation trial | appetite_tonic | Hunger dose, logged as study |
| Thermal comfort intervention | warm_blanket | Lowers resistance to tray |
| Documenting adipose redistribution | note_symptoms | Celebrates tight clothes in SOAP |

### Interactive choice voice (four tones)

Every visit action gets reply templates:

| Tone | Stat skew | When |
|------|-----------|------|
| Gentle push | +openness, +trust | slimMindset, low indulgence |
| Clinical deflection | +trust, low openness | clinical framing |
| Shameless encouragement | +indulgence, +weightRoll | warming/complicit |
| Cruel honesty | +openness spike | high trust, perfectionist/rebel |

### 40-event prose pack

Migrate existing 8 `earlyGameEvents` + add 32 (gym bag, fitbit, dressing room, exam gown gap, parking lot snack, etc.). **12 flagged interactive** with 3 choices × 3 prose lengths each.

**Target:** ~15,800 words new prose.

### Lint-safe authoring

- No em dashes, no "not X but Y" reversals  
- Denial stack: claim → evidence → silent action  
- Clinical mask: chart term → food object → her echo  

---

## Part IV: Integrated Content Catalog (60+ Scenes)

### Tier A — Ship in v1 (vertical slice)

| ID | Type | AP | Notes |
|----|------|-----|-------|
| `world_doorway_wedge` | week/visit | 1–2 | Full tree + escalate sequel |
| `world_doorway_escalated` | week | 2 | After defer |
| `early_jeans_tight_interactive` | week | 1 | Upgrade existing event |
| `exam_button_pop` | visit interrupt | 1 | During exam phase |
| `visit_tone_branch` | visit | 0 | Gentle/clinical/shameless/cruel on ANY action |

### Tier B — v2 parity

| ID | Type |
|----|------|
| `bathroom_jeans_zip` | visit interrupt |
| `diet_referral_ask` | visit intake |
| `scale_wont_read` | visit exam |
| `staff_closet_snack` | week |
| `lobby_thin_friend` | visit checkout |
| `break_fridge_raid` | week group |
| `mole_supply_closet` | week |
| `rival_juice_bar_counter` | week |
| `loyalty_beat_0_motive` | visit checkout |
| `loyalty_beat_1_regular_tray` | visit checkout |
| Wardrobe upgrades (12) | week |
| Early gain upgrades (8) | week |

### Tier C — v3 depth

- Full archetype × mindset route trees  
- Audit week chain (low cover)  
- NG+ devoted scene variants  
- Challenge week pool modifiers  
- Scene compendium UI + 24 more ambient scenes  

---

## Part V: Example — Doorway Wedge (All Three Lenses)

### Systems

- Trigger: `getMobilityTier >= waddling`, stage 7+, 28% roll  
- Priority 80 visit interrupt if exam in progress  
- Effects feed `coverRating`, `reputation`, `money`, `global:doorway_widened`  
- Defer → enqueue escalated scene, +heat  

### Narrative (choice tree)

```
Beat 1: Stuck
  push_hips      → Beat 2a: reassure_clinical | reassure_appetite | order_wider_door
  snack_wait     → Beat 2b: feed_while_stuck (hidden if menu unlocked)
  call_maintenance → Beat 2c: bill_clinic | bill_patient
  pull_through   → gated trust 7+ or complicit route
  chart_edema    → cover +8, moleLoyalty −5 if mole present
  defer          → escalated next week

Beat 2a (push): "Do it again when I swell" if shameless
```

### Prose (opening samples by mindset)

**Denial:** "This door was always narrow. The frame shrunk." She smooths her blouse. The fabric does not cooperate.

**Transitional:** She laughs once, breathless. Her hip catches the jamb. She blames the humidity. Her hand stays on the snack tray.

**Complicit:** She presses forward. Wood scrapes. She does not apologize. "Worth it," she says.

**Choice outcome (gentle push):** You set your palms at her hips. Heat through the scrubs. She exhales. The frame groans. Maintenance will send an invoice. She whispers thank you like it is a secret.

---

## Part VI: Module Ownership & Migration

| File | Change |
|------|--------|
| `sceneEngine/index.js` | NEW — core resolver |
| `scenes/*.js` | NEW — content |
| `slimFatScenes.js` | NEW — prose DB |
| `mindset.js` | NEW — getMindset, erosion |
| `patientFraming.js` | ADD applyFramingErosion, getClinicalCoverPhrase |
| `patientVisit.js` | ADD interrupt stack, tone param on actions |
| `patientVisitUi.js` | ADD interrupt UI shell |
| `patientVisitDialogue.js` | ADD clinical pools, choiceOutcomes |
| `patientDialogue.js` | ADD slimMatrix / slimLines |
| `earlyGameEvents.js` | REFACTOR → triggers only |
| `worldImpact.js` | REFACTOR doorway → scene |
| `weeklyContent.js` | REFACTOR wardrobe/break → scenes |
| `loyaltyArcs.js` | REFACTOR beats → scenes |
| `groupScenes.js` | UNIFY renderer with ISE |
| `staffArcs/engine.js` | ADAPTER to ISE or merge |
| `events.js` | Trigger pipeline in endWeek |
| `ui.js` | openSceneModal, route panel, codex |
| `state.js` | v6 save |
| `achievements.js` | Scene/cover/mindset achievements |

---

## Part VII: Phased Roadmap

### Phase v1 — "Prove interactivity" (1 engine + 1 crisis)

**Player promise:** "The clinic fights back. You choose how."

- [ ] ISE core + save v6 migration  
- [ ] `getMindset()` + `coverRating`  
- [ ] Doorway wedge full tree (visit + week)  
- [ ] Button pop visit interrupt  
- [ ] Visit tone selector (4 tones) on 3 actions (greet, snack, weigh)  
- [ ] `jeans_tight` interactive upgrade  
- [ ] UI: visit interrupt inline + route label on profile  
- [ ] Achievements: `first_interrupt`, `doorframe_hero`  

**Content:** ~3 scenes, ~2k words, 12 visit tone variants  

### Phase v2 — "Parity & erosion" (patients = staff)

**Player promise:** "Every week something needs your hands."

- [ ] All 8 flagship scenarios  
- [ ] Loyalty beats 0–2 interactive  
- [ ] Wardrobe + early gain → scenes (defer = passive fallback)  
- [ ] Mole closet + one rival counter-scene  
- [ ] Framing erosion wired to choices  
- [ ] 12×6 slim dialogue matrix (subset: 6 archetypes × 4 stages)  
- [ ] Week interrupt blocking in resolution modal  

**Content:** +20 scenes, ~8k words  

### Phase v3 — "10/10 consequence web"

**Player promise:** "Your clinic remembers every lie."

- [ ] Full archetype routes  
- [ ] Audit chain (low cover)  
- [ ] Arc body branches for all procedural hires  
- [ ] NG+ scene variants  
- [ ] Scene compendium + relationship web edges from witnesses  
- [ ] 40-event prose pack complete  
- [ ] Challenge weeks modify pools  

**Content:** 60+ scenes, ~15k words total initiative  

---

## Part VIII: Success Metrics (What "10/10" Feels Like)

| Week | Experience |
|------|------------|
| 2 | First patient clinical visit; player picks gentle vs clinical tone; jeans event fires with 3 choices |
| 4 | Receptionist button strain; player charts edema or praises; slim patient overhears |
| 6 | Nurse hire from 3 candidates; first loyalty motive choice at checkout |
| 8 | Phlebotomist mole hired; doorway wedge during exam; AP tight — feed while stuck vs widen door |
| 12 | Friend shock in lobby; cover vs validation; fridge raid jealousy flags color staff arcs |
| 16 | Audit risk from scale lies; rival + devoted patient convergence |

**Quantitative targets:**

- ≥1 meaningful player choice per patient visit (avg) by v2  
- ≥40% of weekly fires interactive by v2  
- ≥60 scenes in catalog by v3  
- 0 passive-only stage transitions in slim band (+0–90 lb) by v3  

---

## Part IX: Agent Production Workflow (When Implementing)

1. **Systems agent:** ISE schema, save v6, trigger pipeline, doorway vertical slice  
2. **Narrative agent:** Beat trees for 8 flagships, flag vocabulary, loyalty scene specs  
3. **Writing agent:** Slim matrix, clinical visit lines, choice outcome templates  
4. **Systems + Narrative:** Wire scenes to triggers  
5. **Writing:** Lint pass (`npm run lint:prose`)  
6. **All:** Prose Lab spot-check, week 1–12 sim playtest  

---

## Appendix A: Relationship to Existing Code

Already strong (keep):

- `staffArcs/engine.js` — choice gating, flags, hints  
- `patientVisit.js` — phase spine, immobile/blob actions  
- `patientFraming.js` — clinical tier  
- `earlyGameEvents.js` — gain band triggers  
- `patientAppearance.js` — wardrobe composition  

Underwritten (this plan fills):

- Transitional voice (+25–50 lb)  
- Player agency on events  
- `slimMindset` unused in dialogue selection  
- Loyalty arcs passive  
- Group scenes disconnected from visit flags  

---

## Appendix B: Open Questions for User

1. **Tone of "cruel honesty"** — always available or archetype-gated?  
2. **Mole permanence** — can player fire mole, or only feed/double-agent?  
3. **Fail states** — game over on audit, or just reputation crash?  
4. **Visit tone UI** — sub-buttons on each action vs separate "approach" picker at visit start?  
5. **Explicit content ceiling** — shameless tier heat cap for public-facing copy?  

---

*Document synthesized from three agent plans. Ready for implementation prioritization.*
