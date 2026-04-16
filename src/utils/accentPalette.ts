// Accent palette generator — derives a full color palette from a primary color's HSL.

export interface AccentPalette {
  primary: string;
  dark: string;
  hover: string;
  bgSelected: string;
  borderLight: string;
  gradientStart: string;
  gradientEnd: string;
  subtleBg: string;
  wash4: string;
  wash6: string;
  wash30: string;
  primaryRgb: string;
}

export interface AccentPreset {
  label: string;
  primary: string;
}

// ── HSL / RGB helpers ────────────────────────────────────────────────────────

function clamp(v: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, v));
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const sN = s / 100;
  const lN = l / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lN - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

function hsl(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb(h, s, l);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function rgbStr(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb(h, s, l);
  return `${r}, ${g}, ${b}`;
}

function rgba(h: number, s: number, l: number, a: number): string {
  const [r, g, b] = hslToRgb(h, s, l);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// ── Hex ↔ HSL conversion ────────────────────────────────────────────────────

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const raw = hex.replace(/^#/, '');
  const r = parseInt(raw.substring(0, 2), 16) / 255;
  const g = parseInt(raw.substring(2, 4), 16) / 255;
  const b = parseInt(raw.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;

  if (d === 0) return { h: 0, s: 0, l: Math.round(l * 100) };

  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r)      h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else                h = (r - g) / d + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hexToHue(hex: string): number {
  return hexToHsl(hex).h;
}

export function hueToHex(hue: number): string {
  return hsl(hue, 92, 45);
}

// ── Palette generation ───────────────────────────────────────────────────────
// All derived colors scale proportionally from the primary's saturation and
// lightness. Ratios are calibrated against the original blue primary
// (H=207, S=92, L=45) so that the default presets produce identical output.
//
// Dark variants: lightness scaled down from the primary's L.
// Light variants: lightness interpolated toward 100 (white).

// Interpolate from `base` toward 100 by fraction `t` (0 = base, 1 = 100)
function lerpToWhite(base: number, t: number): number {
  return clamp(base + (100 - base) * t);
}

export function generateAccentPalette(h: number, s: number, l: number): AccentPalette {
  return {
    primary:       hsl(h, s, l),
    dark:          hsl(h, clamp(s * 1.033), clamp(l * 0.711)),
    hover:         hsl(h, s,               clamp(l * 0.889)),
    bgSelected:    hsl(h, clamp(s * 0.75),  lerpToWhite(l, 0.8)),
    borderLight:   hsl(h, clamp(s * 0.87),  lerpToWhite(l, 0.836)),
    gradientStart: hsl(h, clamp(s * 0.783), lerpToWhite(l, 0.745)),
    gradientEnd:   hsl(h, clamp(s * 1.087), lerpToWhite(l, 0.945)),
    subtleBg:      hsl(h, clamp(s * 1.087), lerpToWhite(l, 0.891)),
    wash4:         rgba(h, s, l, 0.04),
    wash6:         rgba(h, s, l, 0.06),
    wash30:        rgba(h, s, l, 0.3),
    primaryRgb:    rgbStr(h, s, l),
  };
}

export function generateAccentPaletteFromHex(hex: string): AccentPalette {
  const { h, s, l } = hexToHsl(hex);
  return generateAccentPalette(h, s, l);
}

// ── CSS variable map ─────────────────────────────────────────────────────────

export function accentCssVars(palette: AccentPalette): Record<string, string> {
  return {
    '--accent-primary':        palette.primary,
    '--accent-dark':           palette.dark,
    '--accent-hover':          palette.hover,
    '--accent-bg-selected':    palette.bgSelected,
    '--accent-border-light':   palette.borderLight,
    '--accent-gradient-start': palette.gradientStart,
    '--accent-gradient-end':   palette.gradientEnd,
    '--accent-subtle-bg':      palette.subtleBg,
    '--accent-wash-4':         palette.wash4,
    '--accent-wash-6':         palette.wash6,
    '--accent-wash-30':        palette.wash30,
    '--accent-primary-rgb':    palette.primaryRgb,

    // Vendor library SDS tokens (picked up by var(...) fallbacks in index.esm)
    '--sds-color-background-brand-default':   palette.primary,
    '--sds-color-background-brand-hover':     palette.hover,
    '--sds-color-background-brand-secondary': palette.subtleBg,
    '--sds-color-border-brand-default':       palette.primary,
    '--sds-color-text-brand-on-brand':        '#ffffff',
  };
}

// ── 8 Default presets ────────────────────────────────────────────────────────

export const DEFAULT_PRESETS: AccentPreset[] = [
  { label: 'Blue',   primary: hueToHex(207) },
  { label: 'Indigo', primary: hueToHex(245) },
  { label: 'Purple', primary: hueToHex(275) },
  { label: 'Pink',   primary: hueToHex(330) },
  { label: 'Red',    primary: hueToHex(0) },
  { label: 'Orange', primary: hueToHex(25) },
  { label: 'Green',  primary: hueToHex(145) },
  { label: 'Teal',   primary: hueToHex(175) },
];

export const DEFAULT_ACTIVE_INDEX = 0;
