// Accent palette generator — derives a full color palette from a primary color's HSL.
// Supports day/night mode for both accent tints and surface neutrals.

export type ColorMode = 'day' | 'night';

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

export function hueToNightHex(hue: number): string {
  return hsl(hue, 85, 62);
}

// ── Palette generation ───────────────────────────────────────────────────────

function lerpToWhite(base: number, t: number): number {
  return clamp(base + (100 - base) * t);
}

const DARK_BASE = 15;
function lerpToDark(base: number, t: number): number {
  return clamp(base - (base - DARK_BASE) * t);
}

export function generateAccentPalette(h: number, s: number, l: number, mode: ColorMode = 'day'): AccentPalette {
  const isNight = mode === 'night';
  const lerp = isNight ? lerpToDark : lerpToWhite;

  return {
    primary:       hsl(h, s, l),
    dark:          hsl(h, clamp(s * 1.033), clamp(l * 0.711)),
    hover:         hsl(h, s,               clamp(l * 0.889)),
    bgSelected:    isNight ? rgba(h, s, l, 0.3) : hsl(h, clamp(s * 0.75), lerpToWhite(l, 0.8)),
    borderLight:   hsl(h, clamp(s * (isNight ? 0.45 : 0.87)),  lerp(l, 0.836)),
    gradientStart: hsl(h, clamp(s * (isNight ? 0.35 : 0.783)), lerp(l, 0.745)),
    gradientEnd:   hsl(h, clamp(s * (isNight ? 0.5  : 1.087)), lerp(l, 0.945)),
    subtleBg:      hsl(h, clamp(s * (isNight ? 0.5  : 1.087)), lerp(l, 0.891)),
    wash4:         rgba(h, s, l, isNight ? 0.08 : 0.04),
    wash6:         rgba(h, s, l, isNight ? 0.12 : 0.06),
    wash30:        rgba(h, s, l, isNight ? 0.4  : 0.3),
    primaryRgb:    rgbStr(h, s, l),
  };
}

export function generateAccentPaletteFromHex(hex: string, mode: ColorMode = 'day'): AccentPalette {
  const { h, s, l } = hexToHsl(hex);
  return generateAccentPalette(h, s, l, mode);
}

// ── Surface tokens (day / night) ─────────────────────────────────────────────

const SURFACE_DAY: Record<string, string> = {
  '--subnav-active-text':    'var(--accent-primary)',
  '--location-selected-text': 'var(--accent-dark)',
  '--surface-page':          '#f8fafc',
  '--surface-card':          'rgba(255, 255, 255, 0.7)',
  '--surface-popover':       'rgba(255, 255, 255, 0.97)',
  '--surface-elevated':      '#ffffff',
  '--surface-hover':         '#f1f5f9',
  '--surface-row-hover':     '#f8fafc',
  '--text-primary':          '#191919',
  '--text-secondary':        '#64748b',
  '--text-muted':            '#94a3b8',
  '--text-danger':           '#d9210b',
  '--border-default':        '#e2e8f0',
  '--icon-muted':            '#94A3B8',
  '--shadow-card':           'rgba(149, 172, 188, 0.15)',
  '--shadow-popover':        'rgba(149, 172, 188, 0.30)',
  '--scrollbar-thumb':       '#cbd5e1',
  '--scrollbar-thumb-hover': '#94a3b8',
};

const SURFACE_NIGHT: Record<string, string> = {
  '--subnav-active-text':    'rgba(255, 255, 255, 0.8)',
  '--location-selected-text': 'rgba(255, 255, 255, 0.9)',
  '--surface-page':          '#0f172a',
  '--surface-card':          'rgba(30, 41, 59, 0.88)',
  '--surface-popover':       'rgba(30, 41, 59, 0.97)',
  '--surface-elevated':      '#1e293b',
  '--surface-hover':         '#334155',
  '--surface-row-hover':     '#1e293b',
  '--text-primary':          '#f1f5f9',
  '--text-secondary':        '#94a3b8',
  '--text-muted':            '#64748b',
  '--text-danger':           '#f87171',
  '--border-default':        '#334155',
  '--icon-muted':            '#cbd5e1',
  '--shadow-card':           'rgba(0, 0, 0, 0.4)',
  '--shadow-popover':        'rgba(0, 0, 0, 0.5)',
  '--scrollbar-thumb':       '#475569',
  '--scrollbar-thumb-hover': '#64748b',
};

export function generateSurfaceVars(mode: ColorMode): Record<string, string> {
  return mode === 'night' ? { ...SURFACE_NIGHT } : { ...SURFACE_DAY };
}

// ── Combined CSS variable map ────────────────────────────────────────────────

export function accentCssVars(palette: AccentPalette, mode: ColorMode = 'day'): Record<string, string> {
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

    // Vendor library SDS tokens
    '--sds-color-background-brand-default':   palette.primary,
    '--sds-color-background-brand-hover':     palette.hover,
    '--sds-color-background-brand-secondary': palette.subtleBg,
    '--sds-color-border-brand-default':       palette.primary,
    '--sds-color-text-brand-on-brand':        '#ffffff',

    // Vendor neutral overrides
    '--sds-color-text-default-default':       mode === 'night' ? '#f1f5f9' : '#191919',
    '--sds-color-text-default-secondary':     mode === 'night' ? '#94a3b8' : '#636363',
    '--sds-color-text-default-tertiary':      mode === 'night' ? '#64748b' : '#999999',
    '--sds-color-border-default-default':     mode === 'night' ? '#334155' : '#e2e8f0',

    ...generateSurfaceVars(mode),
  };
}

// ── 8 Default presets ────────────────────────────────────────────────────────

export const DEFAULT_PRESETS: AccentPreset[] = [
  { label: 'Blue',   primary: '#1e5480' },
  { label: 'Indigo', primary: '#625abf' },
  { label: 'Purple', primary: '#60208d' },
  { label: 'Pink',   primary: '#b71f6b' },
  { label: 'Red',    primary: '#dc0909' },
  { label: 'Orange', primary: '#dc6109' },
  { label: 'Green',  primary: '#186337' },
  { label: 'Teal',   primary: '#27939b' },
];

export const DEFAULT_NIGHT_PRESETS: AccentPreset[] = [
  { label: 'Blue',   primary: '#58b3fd' },
  { label: 'Indigo', primary: '#7e73f2' },
  { label: 'Purple', primary: '#bb5cff' },
  { label: 'Pink',   primary: '#f91a8a' },
  { label: 'Red',    primary: '#f42a2a' },
  { label: 'Orange', primary: '#f48d43' },
  { label: 'Green',  primary: '#34bc6c' },
  { label: 'Teal',   primary: '#24c6b9' },
];

export const DEFAULT_ACTIVE_INDEX = 0;
