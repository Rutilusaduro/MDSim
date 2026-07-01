/**
 * Compositional patient appearance.
 * Prose is built from small fragments (top + bottom + behavior + strain + optional hair/height).
 * Body-type stage text stays in characters.js; wardrobe layers on top.
 */

export const HEIGHT_RANGE_IN = [58, 74];

/** Six bands cover stages 0–11 (two stages per band). */
export const STAGE_BANDS = [
  { id: 'slim', label: 'slim', stages: [0, 1] },
  { id: 'softening', label: 'softening', stages: [2, 3] },
  { id: 'rounded', label: 'rounded', stages: [4, 5] },
  { id: 'plush', label: 'plush', stages: [6, 7] },
  { id: 'heavy', label: 'heavy', stages: [8, 9] },
  { id: 'abundant', label: 'abundant', stages: [10, 11] },
];

export function getStageBand(stageIndex) {
  const idx = Math.max(0, Math.min(11, stageIndex));
  return STAGE_BANDS.find((b) => b.stages.includes(idx)) || STAGE_BANDS[0];
}

// --- Hair (color + style snippets, composed) ---

export const HAIR_COLORS = {
  honey_blonde: { label: 'honey blonde', snippet: 'honey blonde' },
  chestnut: { label: 'chestnut brown', snippet: 'chestnut brown' },
  jet_black: { label: 'jet black', snippet: 'jet black' },
  auburn: { label: 'auburn', snippet: 'auburn' },
  copper: { label: 'copper red', snippet: 'copper red' },
  silver_streak: { label: 'silver-streaked', snippet: 'silver-streaked' },
  rose_gold: { label: 'rose-gold', snippet: 'rose-gold' },
  espresso: { label: 'espresso brown', snippet: 'espresso brown' },
  platinum: { label: 'platinum blonde', snippet: 'platinum blonde' },
  strawberry: { label: 'strawberry blonde', snippet: 'strawberry blonde' },
  raven: { label: 'raven black', snippet: 'raven black' },
  warm_caramel: { label: 'warm caramel', snippet: 'warm caramel' },
};

export const HAIR_STYLES = {
  long_straight: { label: 'long straight hair', snippet: 'Long straight hair brushes her shoulders' },
  soft_waves: { label: 'soft waves', snippet: 'Soft waves frame her face' },
  pixie: { label: 'pixie cut', snippet: 'A pixie cut bares her neck' },
  blunt_bob: { label: 'blunt bob', snippet: 'A blunt bob skims her collar' },
  high_pony: { label: 'high ponytail', snippet: 'A high ponytail sways when she walks' },
  messy_bun: { label: 'messy bun', snippet: 'A messy bun holds loose strands' },
  curtain_bangs: { label: 'curtain bangs', snippet: 'Curtain bangs part around her cheeks' },
  curly_volume: { label: 'curly volume', snippet: 'Curly volume resists humidity' },
  sleek_bun: { label: 'sleek low bun', snippet: 'A sleek low bun looks tidy' },
  braided: { label: 'loose braid', snippet: 'A loose braid hangs over one shoulder' },
};

/** Optional band tweak for hair (heavy stages only). */
export const HAIR_BAND_MOD = {
  slim: '',
  softening: '',
  rounded: '',
  plush: ' and looks thicker against a softer jaw',
  heavy: ' with new weight in her face',
  abundant: ', heavy and glossy, unmistakable',
};

// --- Height (tier + band posture, composed) ---

export function formatHeight(inches) {
  const ft = Math.floor(inches / 12);
  const inch = inches % 12;
  return `${ft}'${inch}"`;
}

function heightTier(inches) {
  if (inches >= 68) return 'tall';
  if (inches <= 62) return 'petite';
  return 'average';
}

export const HEIGHT_BAND_POSTURE = {
  tall: {
    slim: 'carries height like a clean line',
    softening: 'still tall; softness gathers along her limbs',
    rounded: 'folds into chairs with careful knees',
    plush: 'takes vertical space without apology',
    heavy: 'rises into rooms before her voice',
    abundant: 'a tall, warm presence that blocks light',
  },
  petite: {
    slim: 'compact and quick on her feet',
    softening: 'small frame; new curves show fast',
    rounded: 'rounds fill petite space early',
    plush: 'dense and curvy for her height',
    heavy: 'short and wide; chairs feel smaller',
    abundant: 'petite only in memory; plush in fact',
  },
  average: {
    slim: 'average height; easy to overlook',
    softening: 'height steady while width creeps in',
    rounded: 'neither tall nor small; simply fuller',
    plush: 'grounded, thickened, hard to miss',
    heavy: 'weight arrived without adding inches',
    abundant: 'solid height; massive softness',
  },
};

// --- Wardrobe pieces (fragments per band, not full outfits) ---

export const TOPS = {
  crop_top: {
    label: 'crop top',
    bands: {
      slim: 'a cropped tee',
      softening: 'the same cropped tee',
      rounded: 'a crop top she refuses to retire',
      plush: 'a stretched crop top',
      heavy: 'a crop top mostly suggestion',
      abundant: 'a crop top that lost the war',
    },
  },
  fitted_tee: {
    label: 'fitted tee',
    bands: {
      slim: 'a fitted tee',
      softening: 'a tee that tucks now',
      rounded: 'a tee riding up at the hem',
      plush: 'a tee skimming soft belly',
      heavy: 'a tee strained at the bust',
      abundant: 'a tee surviving on stretch',
    },
  },
  blouse: {
    label: 'blouse',
    bands: {
      slim: 'a tucked blouse',
      softening: 'a blouse with one loose button',
      rounded: 'a blouse gaping slightly at the chest',
      plush: 'a blouse worn open over softness',
      heavy: 'a blouse with a safety pin',
      abundant: 'a blouse surrendered to comfort',
    },
  },
  sweater: {
    label: 'sweater',
    bands: {
      slim: 'a fine knit sweater',
      softening: 'a sweater clinging at lunch',
      rounded: 'a sweater hugging new curves',
      plush: 'a cozy sweater stretched thin',
      heavy: 'an oversized sweater',
      abundant: 'a sweater like a tent',
    },
  },
  wrap_top: {
    label: 'wrap top',
    bands: {
      slim: 'a wrap top tied at the waist',
      softening: 'a wrap tie loosened after meals',
      rounded: 'a wrap top over a soft belly',
      plush: 'a wrap with a migrating knot',
      heavy: 'a wrap that gaps when she leans',
      abundant: 'a wrap top holding on by pins',
    },
  },
  hoodie: {
    label: 'hoodie',
    bands: {
      slim: 'a fitted hoodie',
      softening: 'a hoodie bunched at the hips',
      rounded: 'a hoodie over leggings',
      plush: 'a zip hoodie worn open',
      heavy: 'a hoodie that will not zip',
      abundant: 'a hoodie stretched across her back',
    },
  },
  tank: {
    label: 'tank top',
    bands: {
      slim: 'a ribbed tank',
      softening: 'a tank with thin straps',
      rounded: 'a tank clinging to soft middle',
      plush: 'a tank with belly peeking below',
      heavy: 'a tank riding high',
      abundant: 'a tank and nothing else pretending to work',
    },
  },
  bodycon: {
    label: 'bodycon top',
    bands: {
      slim: 'a bodycon knit top',
      softening: 'bodycon that remembers lunch',
      rounded: 'bodycon tracing new hips',
      plush: 'bodycon with ruching that failed',
      heavy: 'bodycon painted on',
      abundant: 'bodycon as second skin',
    },
  },
};

export const BOTTOMS = {
  jeans: {
    label: 'jeans',
    bands: {
      slim: 'high-waist jeans',
      softening: 'jeans snug at the waist',
      rounded: 'jeans straining at the seat',
      plush: 'stretch jeans',
      heavy: 'jeans with a hidden safety pin',
      abundant: 'elastic-waist "jeans"',
    },
  },
  leggings: {
    label: 'leggings',
    bands: {
      slim: 'black leggings',
      softening: 'leggings with a rolling waistband',
      rounded: 'leggings gone opaque at the thigh',
      plush: 'leggings under a long tee',
      heavy: 'leggings with a tunic cover-up',
      abundant: 'leggings under everything',
    },
  },
  mini_skirt: {
    label: 'mini skirt',
    bands: {
      slim: 'a short flared skirt',
      softening: 'a mini skirt riding up when she sits',
      rounded: 'a mini she tugs down often',
      plush: 'a mini fighting thick thighs',
      heavy: 'a mini mostly for photos now',
      abundant: 'a mini kept for courage',
    },
  },
  skirt: {
    label: 'skirt',
    bands: {
      slim: 'a fitted skirt',
      softening: 'a skirt snug at the waist',
      rounded: 'a skirt over soft hips',
      plush: 'a skirt with elastic backup',
      heavy: 'a skirt that sways with belly',
      abundant: 'a skirt pooling when she sits',
    },
  },
  shorts: {
    label: 'shorts',
    bands: {
      slim: 'tailored shorts',
      softening: 'shorts digging at the thigh',
      rounded: 'shorts with thigh rub',
      plush: 'stretch shorts',
      heavy: 'shorts rare but stubborn',
      abundant: 'shorts as a memory',
    },
  },
  maxi: {
    label: 'maxi skirt',
    bands: {
      slim: 'a flowing maxi',
      softening: 'a maxi clinging at the hip',
      rounded: 'a maxi printing belly shape',
      plush: 'a maxi with a high slit',
      heavy: 'a maxi draped like weather',
      abundant: 'a maxi that follows every curve',
    },
  },
  joggers: {
    label: 'joggers',
    bands: {
      slim: 'tapered joggers',
      softening: 'joggers with drawstring bow',
      rounded: 'joggers and a soft hoodie',
      plush: 'baggy joggers',
      heavy: 'joggers only, dress code lost',
      abundant: 'joggers as uniform',
    },
  },
  dress: {
    label: 'dress',
    bands: {
      slim: 'a simple fitted dress',
      softening: 'a dress tighter after lunch',
      rounded: 'a dress tracing new width',
      plush: 'a dress with side ruching',
      heavy: 'a dress that clings honest',
      abundant: 'a dress like a banner',
    },
  },
};

/** Hem length words when behavior is lengthen_hem (skirt gets longer as she gains). */
export const HEM_LENGTH = {
  slim: 'short',
  softening: 'short',
  rounded: 'knee-length',
  plush: 'midi',
  heavy: 'long',
  abundant: 'floor-length',
};

/** Universal fit / strain clauses (any outfit). */
export const STRAIN = {
  slim: 'Everything sits flat.',
  softening: 'Fabric pulls after she eats.',
  rounded: 'Seams work harder than she admits.',
  plush: 'Stretch fabric earns its name.',
  heavy: 'Buttons negotiate peace terms.',
  abundant: 'Clothes surrendered with grace.',
};

/** Drawable fit detail per band (hem, waist, skin, seams). */
export const FIT_VISUAL = {
  slim:
    'Hem hits mid-hip. Waistband lies flat. Collar sits square on her shoulders. No crease at the small of her back.',
  softening:
    'Tee hem rides up a finger width when she sits. Waistband leaves a pink line. Buttons stay closed. Thigh fabric pulls when she kneels.',
  rounded:
    'Side seam bows at the hip. Lower belly pushes the front hem outward. Neckline gap shows collarbone and the start of soft chest.',
  plush:
    'Stretch waistband rolls under her navel. Thighs fill the leg holes smooth and dark. Sleeve cuffs dig a faint ring at the upper arm.',
  heavy:
    'Top button strains with a horizontal wrinkle. Zipper bowed at the fly. Soft belly overlaps the waistband in a pale crescent when she exhales.',
  abundant:
    'Fabric thin at the seat and thighs. Belly rests on the waistband like a shelf. Short sleeves end high on thick upper arms. Hem cannot cover both hips at once.',
};

export const MIDRIFF_VISUAL = {
  slim: 'Bare strip of skin between hem and waistband, flat and tan.',
  softening: 'Soft curve of belly visible when she lifts both arms.',
  rounded: 'Crop hem ends above the navel. Rounded belly presses against the waistband.',
  plush: 'Several inches of bare midriff. Navel centered. Skin warm and lightly flushed.',
  heavy: 'Heavy belly spills over low jeans. Crop top barely covers the underside of her chest.',
  abundant: 'Wide bare middle between short top and stretched waistband. Belly domes forward, skin smooth and exposed.',
};

export const GARMENT_COLORS = [
  'black',
  'cream',
  'white',
  'dusty rose',
  'navy',
  'sage',
  'rust',
  'charcoal',
  'lavender',
  'camel',
];

/** For lengthen_hem: skirt clause beyond hem word. */
export const SKIRT_HEM_EXTRA = {
  slim: 'swings when she walks.',
  softening: 'needs a tug when she sits.',
  rounded: 'skims over wider hips.',
  plush: 'hides less than she hoped.',
  heavy: 'sways with her belly.',
  abundant: 'pools at her ankles when she stops.',
};

/** Wardrobe behaviors modify how bottom/top combine. */
export const BEHAVIORS = {
  none: { label: 'classic mix' },
  stubborn_crop: {
    label: 'keeps the crop',
    requires: { top: 'crop_top' },
    add: 'midriff',
  },
  lengthen_hem: {
    label: 'longer hems',
    requires: { bottom: 'skirt' },
    replaceBottom: 'hem_skirt',
  },
  denim_loyal: {
    label: 'denim loyal',
    forceBottom: 'jeans',
  },
  leggings_layer: {
    label: 'leggings always',
    forceBottom: 'leggings',
  },
  oversized_shift: {
    label: 'sizes up late',
    topBandOffset: 1,
  },
};

/** Curated presets = top + bottom + behavior (still composed from fragments). */
export const WARDROBE_PRESETS = {
  crop_and_jeans: { label: 'Crop top devotee', top: 'crop_top', bottom: 'jeans', behavior: 'stubborn_crop' },
  skirt_lengthener: { label: 'Skirt lengthener', top: 'blouse', bottom: 'skirt', behavior: 'lengthen_hem' },
  denim_purist: { label: 'Denim purist', top: 'fitted_tee', bottom: 'jeans', behavior: 'denim_loyal' },
  bodycon_pair: { label: 'Bodycon pride', top: 'bodycon', bottom: 'leggings', behavior: 'none' },
  cozy_layers: { label: 'Oversized cozy', top: 'sweater', bottom: 'leggings', behavior: 'oversized_shift' },
  leggings_forever: { label: 'Leggings forever', top: 'tank', bottom: 'leggings', behavior: 'leggings_layer' },
  wrap_romantic: { label: 'Wrap romantic', top: 'wrap_top', bottom: 'skirt', behavior: 'none' },
  vintage_skirt: { label: 'Vintage skirts', top: 'blouse', bottom: 'mini_skirt', behavior: 'lengthen_hem' },
  athleisure: { label: 'Athleisure relic', top: 'hoodie', bottom: 'joggers', behavior: 'none' },
  maxi_flow: { label: 'Maxi cling', top: 'tank', bottom: 'maxi', behavior: 'none' },
};

const presetKeys = Object.keys(WARDROBE_PRESETS);
const hairColorKeys = Object.keys(HAIR_COLORS);
const hairStyleKeys = Object.keys(HAIR_STYLES);

const LEGACY_STYLE_MAP = {
  crop_top_devotee: 'crop_and_jeans',
  skirt_lengthener: 'skirt_lengthener',
  denim_purist: 'denim_purist',
  bodycon_pride: 'bodycon_pair',
  oversized_cozy: 'cozy_layers',
  leggings_forever: 'leggings_forever',
  wrap_dress_romantic: 'wrap_romantic',
  vintage_pins: 'vintage_skirt',
  athleisure_relic: 'athleisure',
  maxi_cling: 'maxi_flow',
};

function topBandId(behavior, bandId) {
  if (behavior?.topBandOffset) {
    const order = STAGE_BANDS.map((b) => b.id);
    const idx = Math.min(order.length - 1, order.indexOf(bandId) + behavior.topBandOffset);
    return order[idx];
  }
  return bandId;
}

function resolveWardrobe(appearance) {
  if (appearance.wardrobe?.top) return appearance.wardrobe;
  const presetKey = appearance.preset || LEGACY_STYLE_MAP[appearance.clothingStyle] || 'crop_and_jeans';
  const preset = WARDROBE_PRESETS[presetKey] || WARDROBE_PRESETS.crop_and_jeans;
  const behavior = BEHAVIORS[preset.behavior] || BEHAVIORS.none;
  let top = preset.top;
  let bottom = behavior.forceBottom || preset.bottom;
  if (behavior.requires?.top) top = behavior.requires.top;
  if (behavior.requires?.bottom) bottom = behavior.requires.bottom;
  return { top, bottom, behavior: preset.behavior, presetKey, presetLabel: preset.label };
}

function composeBottom(bottomId, behaviorId, bandId) {
  const behavior = BEHAVIORS[behaviorId] || BEHAVIORS.none;
  if (behavior.replaceBottom === 'hem_skirt') {
    const hem = HEM_LENGTH[bandId];
    const extra = SKIRT_HEM_EXTRA[bandId];
    return `a ${hem} skirt ${extra}`;
  }
  const bottom = BOTTOMS[bottomId];
  if (!bottom) return '';
  return bottom.bands[bandId] || '';
}

function composeTop(topId, behaviorId, bandId) {
  const behavior = BEHAVIORS[behaviorId] || BEHAVIORS.none;
  const band = topBandId(behavior, bandId);
  const top = TOPS[topId];
  if (!top) return '';
  return top.bands[band] || top.bands.slim;
}

function withColor(phrase, color) {
  if (!phrase || !color) return phrase;
  if (phrase.startsWith('a ')) return `a ${color} ${phrase.slice(2)}`;
  if (phrase.startsWith('the ')) return `the ${color} ${phrase.slice(4)}`;
  return `a ${color} ${phrase}`;
}

export function composeWardrobeLine(appearance, stageIndex) {
  const band = getStageBand(stageIndex);
  const bandId = band.id;
  const { top, bottom, behavior: behaviorId, presetLabel } = resolveWardrobe(appearance);
  const behavior = BEHAVIORS[behaviorId] || BEHAVIORS.none;
  const topColor = appearance.topColor || 'black';
  const bottomColor = appearance.bottomColor || 'navy';

  const topPiece = withColor(composeTop(top, behavior, bandId), topColor);
  const bottomPiece = withColor(composeBottom(bottom, behaviorId, bandId), bottomColor);
  const sentences = [`She wears ${topPiece} with ${bottomPiece}.`];

  if (behavior.add === 'midriff' && MIDRIFF_VISUAL[bandId]) {
    sentences.push(MIDRIFF_VISUAL[bandId]);
  }
  if (FIT_VISUAL[bandId]) sentences.push(FIT_VISUAL[bandId]);

  const line = sentences.join(' ');
  return { line, presetLabel, behaviorHook: '' };
}

export function composeHairLine(hairColorId, hairStyleId, bandId) {
  const color = HAIR_COLORS[hairColorId];
  const style = HAIR_STYLES[hairStyleId];
  if (!color || !style) return '';
  const mod = HAIR_BAND_MOD[bandId] || '';
  const lengthNote =
    bandId === 'heavy' || bandId === 'abundant'
      ? 'Ends rest on her shoulders and upper back.'
      : 'Falls to shoulder length.';
  return `${style.snippet}${mod}. ${color.label} hair, ${lengthNote}`;
}

export function composeHeightLine(inches, bandId) {
  const tier = heightTier(inches);
  const posture = HEIGHT_BAND_POSTURE[tier]?.[bandId] || '';
  const stance =
    tier === 'tall'
      ? 'Long legs. Narrow ankles. Shoulders level.'
      : tier === 'petite'
        ? 'Short stride. Compact frame. Head height near the door handle.'
        : 'Average height. Hips square. Feet shoulder width.';
  return `She stands ${formatHeight(inches)}, ${posture}. ${stance}`;
}

export function generatePatientAppearance(rng) {
  const presetKey = rng.pick(presetKeys);
  const preset = WARDROBE_PRESETS[presetKey];
  return {
    heightInches: rng.int(HEIGHT_RANGE_IN[0], HEIGHT_RANGE_IN[1]),
    hairColor: rng.pick(hairColorKeys),
    hairStyle: rng.pick(hairStyleKeys),
    topColor: rng.pick(GARMENT_COLORS),
    bottomColor: rng.pick(GARMENT_COLORS),
    preset: presetKey,
    wardrobe: {
      top: preset.top,
      bottom: preset.bottom,
      behavior: preset.behavior,
    },
  };
}

export function ensurePatientAppearance(character, rng = null) {
  if (character.type !== 'patient') return character;
  if (character.appearance?.heightInches) {
    if (!character.appearance.wardrobe && (character.appearance.preset || character.appearance.clothingStyle)) {
      character.appearance.wardrobe = resolveWardrobe(character.appearance);
    }
    if (!character.appearance.topColor) {
      const seed = character.id?.split('').reduce((s, c) => s + c.charCodeAt(0), 0) || 0;
      character.appearance.topColor = GARMENT_COLORS[seed % GARMENT_COLORS.length];
      character.appearance.bottomColor = GARMENT_COLORS[(seed + 3) % GARMENT_COLORS.length];
    }
    return character;
  }
  const seed = character.id?.split('').reduce((s, c) => s + c.charCodeAt(0), 0) || Date.now();
  const fakeRng = rng || {
    pick: (arr) => arr[seed % arr.length],
    int: (a, b) => a + (seed % (b - a + 1)),
  };
  character.appearance = generatePatientAppearance(fakeRng);
  return character;
}

export function appearanceBeat(character, stageIndex) {
  const visits = character.visits || 0;
  const seed = (stageIndex * 3 + visits + (character.appearance?.heightInches || 0)) % 6;
  return {
    showHair: seed === 0 || seed === 3,
    showHeight: seed === 1 || seed === 4,
    showClothing: true,
  };
}

export function composePatientAppearance(character, stageIndex = null) {
  ensurePatientAppearance(character);
  const stage = stageIndex ?? 0;
  const band = getStageBand(stage);
  const { heightInches, hairColor, hairStyle } = character.appearance;
  const beat = appearanceBeat(character, stage);
  const wardrobe = composeWardrobeLine(character.appearance, stage);
  const resolved = resolveWardrobe(character.appearance);

  return {
    height: formatHeight(heightInches),
    heightLine: composeHeightLine(heightInches, band.id),
    clothingLine: wardrobe.line,
    hairLine: composeHairLine(hairColor, hairStyle, band.id),
    clothingLabel: wardrobe.presetLabel,
    clothingHook: wardrobe.behaviorHook || BEHAVIORS[resolved.behavior]?.hook || '',
    beat,
    paragraph: [
      beat.showHeight ? composeHeightLine(heightInches, band.id) : '',
      wardrobe.line,
      beat.showHair ? composeHairLine(hairColor, hairStyle, band.id) : '',
    ]
      .filter(Boolean)
      .join(' '),
  };
}

export function getPatientAppearanceSummary(character) {
  ensurePatientAppearance(character);
  const a = character.appearance;
  const color = HAIR_COLORS[a.hairColor]?.label || a.hairColor;
  const style = HAIR_STYLES[a.hairStyle]?.label || a.hairStyle;
  const wardrobe = resolveWardrobe(a);
  const label = wardrobe.presetLabel || WARDROBE_PRESETS[wardrobe.presetKey]?.label || 'custom';
  return `${formatHeight(a.heightInches)} · ${color} · ${style} · ${label}`;
}

/** For prose authors: list all fragment keys in the manifest doc. */
export function listProseManifest() {
  return {
    stageBands: STAGE_BANDS.map((b) => b.id),
    tops: Object.keys(TOPS),
    bottoms: Object.keys(BOTTOMS),
    behaviors: Object.keys(BEHAVIORS),
    presets: Object.keys(WARDROBE_PRESETS),
    hairColors: hairColorKeys,
    hairStyles: hairStyleKeys,
    strain: Object.keys(STRAIN),
    midriff: Object.keys(MIDRIFF),
    hemLength: Object.keys(HEM_LENGTH),
  };
}
