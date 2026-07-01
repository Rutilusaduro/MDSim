# V3 Audit (post-V4)

**Date:** After V4 implementation  
**Agents:** Fun & Quality, Polish & UX, Content

---

## V3 systems — status

| Feature | V3 finding | V4 action |
|---------|------------|-----------|
| Floor plan | Assign buttons only; bonuses worked | Drag-and-drop chips + drop zones |
| Rival arc | Passive events only | Annex Ops player actions (4-phase arc) |
| Chapters 1–2 | Worked; ending at week 14 | Chapter 3 "City Whisper" + week 20 ending |
| Relationship web | Card list only | SVG graph + card detail |
| Clinic style | Hidden axes, no perks | Perks at 65+ threshold on each axis |
| Weekly events (25) | Solid pool | Unchanged; challenge picker affects weights |
| Group scenes (2) | Too few for long runs | +5 scenes (7 total), patient roster scenes |
| Procedural staff arcs | 4 beats for hires only | Named staff now 4 beats each |
| Loyalty field | Visits + discount only | 3-beat loyalty mini-arcs per patient |
| Challenge weeks | Random 12% roll | Player picks Caterer / Button / Quiet each week |
| Silhouette compare | Worked on resolution | Unchanged |
| Ending + NG+ | Week 14 gate | Week 20 + City Whisper ending card |
| Sound | Deferred | Web Audio stubs + mute toggle |
| Export | None | Markdown week summary to clipboard |
| Sidebar arc chip | Missing | Staff arc + loyalty arc progress on cards |

## Deficiencies fixed in V4

1. **Challenge agency** — Campaign tab challenge picker; no more random-only modifiers.
2. **Named arc parity** — Maya, Elena, Priya, Nadia, Jasmine each have a 4th finale beat.
3. **Patient stories** — Loyalty arcs auto-advance on consult when gates met.
4. **Rival depth** — Annex Ops tab actions with money/AP costs and completion goal for Chapter 3.
5. **UX polish** — Drag furniture, relationship graph, export, sound toggle, arc chips.
6. **Save chain** — v3 → v4 migration adds `rivalClinic`, `audioMuted`, `needsChallengePick`, `loyaltyArc` on patients.
7. **Achievements** — +3 (Chapter 3, loyalty arc, Annex ops) → **21 total**.

## Known gaps (acceptable / V5)

- Chapter 4 "Temple of Appetite" not yet implemented (V5).
- 10+ group scenes target: 7 shipped (expand in V5).
- 20 more weekly events deferred.
- NG+ mutators (faster rival, devoted-only dialogue) deferred.
- Full drag reorder within rooms (swap slots) not implemented.

## Playtest checklist

- [ ] Pick challenge week on Campaign tab before spending AP
- [ ] Drag furniture from unassigned to a room drop zone
- [ ] Complete patient loyalty arc via repeat consults
- [ ] Run 4 Annex Ops actions to complete rival clinic arc
- [ ] Advance named staff to 4th arc beat
- [ ] Trigger new group scene (week 7+)
- [ ] Export week summary from Log tab
- [ ] Toggle sound; hear week-end chime
- [ ] Complete Chapter 3 by week 20
- [ ] Load v3 save → v4 fields present
