# V1 / V2 Audit (post-V3)

**Date:** After V3 implementation  
**Agents:** Fun & Quality, Polish & UX, Content

---

## V1 core loop — status

| Area | Finding | Action |
|------|---------|--------|
| Week loop (AP, money, bills) | Solid | No change |
| Shop / installations | Works; room placement now stacks bonuses (V3) | Documented in README |
| Character generation | 11 archetypes (V3 added 3) | OK |
| Save/load | v1 → v2 → v3 chain migrates | Verified in `state.js` |
| Dialogue attitude tiers | 6 tiers intact | OK |
| Prose lint | CI passes | OK |

## V2 features — status

| Feature | Finding | Action taken |
|---------|---------|--------------|
| Staff arcs | Named staff: 3 beats; recruits: 4-beat procedural arcs | Procedural expansion in V3 |
| Weekly events | 10 base + 15 V3 = 25 pool | Merged in `weeklyContent.js` |
| Recruitment | Loyalty now discounts cost; rival can block | Augmented in V3 |
| Reputation tiers | Unchanged; gates shop | OK |
| Achievements | 15 → 18 with chapter/rival/group | Added 3 |
| Wardrobe / relationship | 6 + 8 beats total | V3 added 4 relationship beats |
| Preferences | Persist; affect gain | OK |
| Silhouettes | Before/after on stage-up in resolution modal | V3 |
| patron / vip | Style bias can skew new patients | V3 clinic style |

## Deficiencies fixed in this pass

1. **Recruit cost** — UI now uses dynamic cost (loyalty discount) via `getInteractionOptions`.
2. **Room bonuses invisible** — Floor Plan tab shows assignments and unassigned items.
3. **Rival arc orphaned** — Campaign tab + sidebar rival rep; recruitment gated when behind.
4. **v2 save fields** — `rooms`, `rivalState`, `chapter`, `clinicStyle`, `loyalty` migrated on load.
5. **Relationship history** — Web tab shows edges + fired beat history.
6. **README** — Updated for V3 feature list and module map.

## Known gaps (acceptable / V4)

- Named staff arcs still 3 beats (procedural hires get 4).
- Sound stubs not implemented (deferred per V3 plan).
- Full rival clinic management sim deferred.
- Challenge weeks are lightweight (random modifier), not player-selected.
- Group scenes: 2 scripted; expandable in V4.

## Playtest checklist

- [ ] Assign furniture on Floor Plan after first install
- [ ] Complete Chapter 1 by week 8 + rep 32 + 1 arc beat
- [ ] Survive 3 rival events without soft-lock
- [ ] Trigger group scene after week 6 with 3+ staff
- [ ] Stage-up shows silhouette compare
- [ ] NG+ bonus applies from ending modal
- [ ] Load v2 save → v3 fields present
