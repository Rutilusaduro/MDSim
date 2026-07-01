# IndulgeCare Clinic

IndulgeCare Clinic is a premium browser prototype for an adult, sensual, weight-gain-focused clinic management sim. You play as Dr. Vale by default, owner of a small primary care practice whose public mission is compassionate comfort care and whose private design philosophy turns the clinic into a warm engine of indulgence, softness, and growth.

Alternative title directions:

- **Velvet Practice**
- **The Softness Protocol**
- **Opulent Care Clinic**

All characters in the prototype are adults 21+ and are framed as opt-in participants in comfort-forward care. The tone is celebratory, sensual, and positive: no shame, no cruelty, no degradation.

## V4 features (current)

- **Chapter 3** — "City Whisper" campaign + new ending card
- **4th staff arc beats** — Finale scenes for all five named starters
- **Player challenge weeks** — Pick Caterer / Button / Quiet each week
- **7 group scenes** — 5 new branching modals (staff + patients)
- **Patient loyalty arcs** — 3-beat procedural stories; recruitment shortcuts
- **Annex Ops** — Playable 4-action rival clinic counter-arc
- **Style perks** — Passive bonuses at 65+ on Softness/Speed/Spectacle
- **Drag-and-drop floor plan** — Drop furniture into room zones
- **Relationship graph** — SVG node map + detail cards
- **Week export** — Copy markdown summary to clipboard
- **Sound stubs** — UI click, week-end chime, stage-up swell (mute toggle)
- **4 new archetypes** — Housewife Donor, Rival Doctor, Food Truck Owner, Sleep Clinic Defector
- **21 achievements** — Chapter 3, loyalty arc, Annex ops
- **Save migration** — v1–v3 saves upgrade to v4

See `docs/V5-PLAN.md` for the post-v4 roadmap.

## V3 features

- **Floor plan** — Assign owned furniture to 4 rooms for stacked bonuses
- **Rival clinic arc** — ThriveWell Annex, 3 events, reputation race
- **Chapters 1–2** — Campaign goals, rewards, Campaign tab
- **Relationship web** — Staff admires/envies edges + 8 scripted beats
- **Clinic style** — Softness / Speed / Spectacle affects patients and flavor
- **25 weekly events** — 15 new + 2 seasonal week modifiers
- **Group scenes** — 2 branching 3-character modals
- **Procedural staff arcs** — 4 beats for recruited hires
- **3 new archetypes** — Rival Spy, Food Blogger, Gym Defector
- **Patient loyalty** — Tracks visits; recruitment discount
- **Silhouette compare** — Ghost before/after on stage-up
- **Ending cards + NG+** — Campaign ending with +1 AP or gain bonus
- **18 achievements** — Chapter, rival, group scene milestones
- **Save migration** — v1/v2 saves upgrade to v3

See `docs/V3-PLAN.md` for V3 scope. See `docs/V5-PLAN.md` for the post-v4 roadmap.

## V2 features

- **Character arcs** — 3-beat personal stories for each starting staff member (trust + stage gates)
- **Weekly random events** — 10 weighted events tied to clinic upgrades
- **Patient → staff recruitment** — Trust 8+, stage 5+, 3 visits, $750
- **Reputation tiers** — 5 tiers unlock shop items (no insurance sim)
- **Achievements** — 15 milestones with unlock toasts at week end
- **Wardrobe strain** — 6 stage-gated text events
- **Staff relationship beats** — 4 scripted multi-staff scenes
- **Comfort preferences** — Pace / focus / public toggles per character
- **Abstract silhouettes** — Body-type SVG in character modal
- **Stage-change polish** — Glow highlight on week resolution
- **2 new archetypes** — Donor's Niece, Returning VIP
- **Save migration** — v1 saves upgrade to v2 automatically

See `docs/V3-PLAN.md` for V3 scope. See `docs/V5-PLAN.md` for the post-v4 roadmap (review before we build v5).

## Current playable features (v1 core)

- Week-based management loop with money, reputation, bills, salaries, supplies, and action points.
- Generated all-adult staff and patient rosters.
- 8 personality archetypes with unique reaction lines.
- 6 base body types with 12 weight stages each and body-type-specific sensual descriptions.
- Management shop for furniture, clinic atmosphere, compounds, staff comfort, and marketing.
- Installations that arrive at End Week and alter gain rates, trust, upkeep, AP, revenue, or reputation.
- Staff and patient interaction modals with AP-spending choices.
- End Week resolution with:
  - pending installation completion
  - staff and patient gain calculations
  - stage-change detection
  - expenses and passive revenue
  - new patient generation
  - fetish-forward narrative summary
- Local save/load plus autosave after End Week.
- Vite + Tailwind CSS + vanilla JavaScript implementation.

## Project structure

```text
index.html
vite.config.js
src/
  main.js
  state.js
  characters.js
  clinic.js
  events.js
  ui.js
  prose.js
  reputation.js
  achievements.js
  arcs.js
  silhouettes.js
  weeklyContent.js
  v3WeeklyContent.js
  rooms.js
  rival.js
  chapters.js
  relationships.js
  clinicStyle.js
  groupScenes.js
  endings.js
  challenges.js
  loyaltyArcs.js
  rivalClinic.js
  audio.js
  export.js
  v4GroupScenes.js
  styles.css
docs/V3-PLAN.md
docs/V4-PLAN.md
docs/V5-PLAN.md
docs/V1-V2-AUDIT.md
docs/V3-AUDIT.md
public/
.cursor/skills/beautiful-prose/
.cursor/skills/event-authoring/
AGENTS.md
```

## Local setup

Install dependencies:

```bash
npm install
```

Run the local dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Lint narrative prose (Beautiful Prose skill):

```bash
npm run lint:prose
```

## Writing style: Beautiful Prose

All game narrative follows the **Beautiful Prose** skill at `.cursor/skills/beautiful-prose/SKILL.md`.

- Concrete, muscular English. No em dashes. No AI filler or therapy voice.
- Default register for this project: `literary_modern`, `HEAT: warm`.
- Agents: see `AGENTS.md`. Run `npm run lint:prose` before committing dialogue or descriptions.
- Lint utility: `src/prose.js`.

## GitHub Pages deployment (automatic)

**Live URL after deploy:** https://rutilusaduro.github.io/MDSim/

This repo includes `.github/workflows/deploy.yml`, which builds the Vite app and publishes `dist/` on every push to `main`.

### One-time setup (do this once in GitHub)

1. Open **https://github.com/Rutilusaduro/MDSim/settings/pages**
2. Under **Build and deployment → Source**, choose **GitHub Actions** (not “Deploy from a branch” and not Jekyll).
3. Save. You are done. No other config needed.

### How deploys happen

- Push or merge to `main` → Actions runs `npm ci` → `npm run build` → uploads `dist` → publishes to Pages.
- Watch progress: **https://github.com/Rutilusaduro/MDSim/actions**
- Re-run manually anytime: Actions tab → **Deploy to GitHub Pages** → **Run workflow**.

### Important: `base` path

`vite.config.js` uses `base: '/MDSim/'` so assets load correctly at `username.github.io/MDSim/`. If you rename the repo, update that value to match.

### Troubleshooting

| Problem | Fix |
|--------|-----|
| Blank page / no styles | Pages Source must be **GitHub Actions**. Delete any old Jekyll workflow. |
| 404 on assets | Confirm `base: '/MDSim/'` matches the repo name exactly. |
| Workflow didn’t run | Check you pushed to `main`, not a feature branch only. |
| Old broken site still showing | Hard-refresh (Ctrl+Shift+R) or wait 1–2 min for CDN cache. |

## Example End Week narrative summaries

### Example 1

By Sunday evening, the reinforced lounge chairs settle into the waiting room like polished caramel thrones. The clinic smells of vanilla, clean linen, and warm bread. Maya gains 4.8 lb after a week of staff trays and private encouragement, her hips pressing deeper into the break-room couch while her breathing turns soft and pleased. Celeste leaves 3.1 lb heavier, one hand resting against the new curve of her belly as if checking that the fullness is still there.

No one crosses a formal stage threshold this week, but the smaller changes are everywhere: tighter waistbands, warmer cheeks, slower hallway turns, and the quiet satisfaction of women discovering that comfort can leave a beautiful trace.

### Example 2

The Wellness Vending Wall hums through its first full week, glowing with honeyed bars, fortified shakes, and late-afternoon promises. Elena reaches Plush Momentum. Weight gathers like velvet at her thighs, belly, and chest, making her silhouette fuller while her smile grows more openly indulgent. Every time she rises from the front desk, her uniform shifts over new softness with a faint, satisfying pull.

Billing closes cleanly, reputation climbs, and three new adult patients join the waiting list after hearing that IndulgeCare treats larger, softer bodies not as problems but as possibilities.

### Example 3

The private recovery nook changes the clinic's rhythm. Consultations stretch longer. Voices lower. The warmed snack cabinet empties twice. Priya gains 5.6 lb, her once-crisp posture softened by a rounded belly that now rests against her waistband when she sits. Talia leaves with a tailored comfort plan and a blush she cannot quite hide, already imagining richer dinners, slower evenings, and a body allowed to become lavish.

The week ends with bills paid, chairs fuller, and the whole practice glowing with the sense that something generous is taking root.

## V2 expansion ideas (shipped or superseded)

See **V4 features** above. Remaining ideas in `docs/V5-PLAN.md`.

Legacy wishlist items now in V3+ planning:

- Room placement UI
- Rival clinic / campaign chapters
- Group indulgence scenes as first-class system
- Visual stage art upgrades
- Doctor customization depth
