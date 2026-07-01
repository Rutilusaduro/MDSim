# Patient Appearance — Prose Manifest

**System:** Compositional. Outfits are **not** hand-written per stage. The game assembles:

```
[top fragment] + [bottom fragment] + [optional behavior fragment] + [strain fragment]
```

Hair and height use the same idea: **style snippet + color label + optional band modifier**.

Body-type weight prose stays in `src/characters.js` (`bodyTypes.*.descriptions`). This file covers **patients only**.

---

## How composition works

### Stage bands (6)

| Band ID | Stages | Used for |
|---------|--------|----------|
| `slim` | 0–1 | Early / flat |
| `softening` | 2–3 | First tight clothes |
| `rounded` | 4–5 | Obvious curves |
| `plush` | 6–7 | Heavy softness |
| `heavy` | 8–9 | Strain, gaps |
| `abundant` | 10–11 | Maximum |

**File:** `src/patientAppearance.js` → `STAGE_BANDS`, `getStageBand()`

### Wardrobe line formula

1. **Top** — `TOPS.{topId}.bands.{bandId}` → e.g. `"a cropped tee she refuses to retire"`
2. **Bottom** — `BOTTOMS.{bottomId}.bands.{bandId}` **OR** if behavior `lengthen_hem`: `HEM_LENGTH.{bandId}` + `SKIRT_HEM_EXTRA.{bandId}`
3. **Behavior add-on** — e.g. `stubborn_crop` adds `MIDRIFF.{bandId}`
4. **Strain** — always appends `STRAIN.{bandId}`

**Example (crop + jeans, stubborn_crop, rounded band):**

> a crop top she refuses to retire · high-waist jeans · Soft belly meets open air. · Seams work harder than she admits.

### Intermittent hair / height

On each description refresh, `appearanceBeat()` picks what shows:

- **Always:** wardrobe line (composed)
- **Sometimes:** hair (`showHair`) or height (`showHeight`)

Height summary (`5'4" · honey blonde · …`) always appears in the character header.

---

## Fragment inventory (replace any string below)

### `TOPS` — 8 tops × 6 bands = 48 strings

Each key: `TOPS.{id}.bands.{slim|softening|rounded|plush|heavy|abundant}`

| Top ID | Label |
|--------|-------|
| `crop_top` | crop top |
| `fitted_tee` | fitted tee |
| `blouse` | blouse |
| `sweater` | sweater |
| `wrap_top` | wrap top |
| `hoodie` | hoodie |
| `tank` | tank top |
| `bodycon` | bodycon top |

### `BOTTOMS` — 8 bottoms × 6 bands = 48 strings

Each key: `BOTTOMS.{id}.bands.{band}`

| Bottom ID | Label |
|-----------|-------|
| `jeans` | jeans |
| `leggings` | leggings |
| `mini_skirt` | mini skirt |
| `skirt` | skirt (generic; used with lengthen_hem) |
| `shorts` | shorts |
| `maxi` | maxi skirt |
| `joggers` | joggers |
| `dress` | dress |

### Universal clauses (6 bands each)

| Pool | Keys | Purpose |
|------|------|---------|
| `STRAIN` | slim → abundant | Fit tension; appended to every outfit |
| `MIDRIFF` | slim → abundant | Crop-top behavior only |
| `HEM_LENGTH` | slim → abundant | Adjective for lengthen_hem skirts |
| `SKIRT_HEM_EXTRA` | slim → abundant | Second half of lengthen_hem skirt clause |
| `HAIR_BAND_MOD` | plush, heavy, abundant only (others empty) | Optional hair suffix |
| `HEIGHT_BAND_POSTURE` | tall / petite / average × 6 bands | Height line body |

### `BEHAVIORS`

| ID | Effect | Hook (flavor) |
|----|--------|----------------|
| `none` | top + bottom + strain | classic mix |
| `stubborn_crop` | forces crop top, adds `MIDRIFF` | keeps the crop |
| `lengthen_hem` | skirt hem from `HEM_LENGTH` + `SKIRT_HEM_EXTRA` | longer hems |
| `denim_loyal` | forces `jeans` bottom | denim loyal |
| `leggings_layer` | forces `leggings` bottom | leggings always |
| `oversized_shift` | top band +1 (bigger tops sooner) | sizes up late |

Each: `BEHAVIORS.{id}.hook`

### `WARDROBE_PRESETS` (curated combos — still composed)

| Preset ID | Label | top | bottom | behavior |
|-----------|-------|-----|--------|----------|
| `crop_and_jeans` | Crop top devotee | crop_top | jeans | stubborn_crop |
| `skirt_lengthener` | Skirt lengthener | blouse | skirt | lengthen_hem |
| `denim_purist` | Denim purist | fitted_tee | jeans | denim_loyal |
| `bodycon_pair` | Bodycon pride | bodycon | leggings | none |
| `cozy_layers` | Oversized cozy | sweater | leggings | oversized_shift |
| `leggings_forever` | Leggings forever | tank | leggings | leggings_layer |
| `wrap_romantic` | Wrap romantic | wrap_top | skirt | none |
| `vintage_skirt` | Vintage skirts | blouse | mini_skirt | lengthen_hem |
| `athleisure` | Athleisure relic | hoodie | joggers | none |
| `maxi_flow` | Maxi cling | tank | maxi | none |

### Hair — composed from two snippets

**Colors** — `HAIR_COLORS.{id}.snippet` + `.label` (12 colors)

**Styles** — `HAIR_STYLES.{id}.snippet` + `.label` (10 styles)

**Compose rule:** `{style.snippet}{HAIR_BAND_MOD[band]}; {color.label}.`

### Height

**Range:** 58–74 inches (4'10" – 6'2")

**Compose rule:** `{formatHeight(inches)}: {HEIGHT_BAND_POSTURE[tier][band]}.`

Tier from inches: `petite` ≤62, `tall` ≥68, else `average`.

---

## Adding new content without explosion

| Want | Add | Do NOT add |
|------|-----|------------|
| New top | 6 band strings in `TOPS` | 12× body type lines |
| New skirt behavior | `HEM_LENGTH` tweak or new `BEHAVIORS` entry | Full outfit per stage |
| New patient look | New `WARDROBE_PRESETS` row reusing existing fragments | 120-line outfit block |
| New hair color | 1 `snippet` + 1 `label` | Per-stage hair lines |

---

## Optional custom wardrobe (future)

`appearance.wardrobe` can be set directly:

```json
{ "top": "wrap_top", "bottom": "skirt", "behavior": "lengthen_hem" }
```

Behaviors validate / override pieces (`denim_loyal` forces jeans, etc.).

---

## Your replacement worksheet

Copy this checklist when supplying custom prose. Keep keys **exact**; change string values only.

- [ ] `TOPS.*.bands.*` (48)
- [ ] `BOTTOMS.*.bands.*` (48)
- [ ] `STRAIN.*` (6)
- [ ] `MIDRIFF.*` (6)
- [ ] `HEM_LENGTH.*` (6)
- [ ] `SKIRT_HEM_EXTRA.*` (6)
- [ ] `HAIR_COLORS.*.snippet` (12)
- [ ] `HAIR_STYLES.*.snippet` (12)
- [ ] `HAIR_BAND_MOD.plush|heavy|abundant` (3)
- [ ] `HEIGHT_BAND_POSTURE.*.*` (18)
- [ ] `BEHAVIORS.*.hook` (6)
- [ ] `WARDROBE_PRESETS.*.label` (10)

**Total authored clauses: ~175 small fragments** → thousands of readable combinations.

Current strings live in `src/patientAppearance.js`.
