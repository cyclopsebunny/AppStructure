import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  generateAccentPaletteFromHex,
  accentCssVars,
  DEFAULT_PRESETS,
  DEFAULT_NIGHT_PRESETS,
  DEFAULT_ACTIVE_INDEX,
  hexToHue,
  hueToHex,
} from '../utils/accentPalette';
import type { AccentPalette, AccentPreset, ColorMode } from '../utils/accentPalette';

interface ThemeContextValue {
  /** The presets for the *current* mode */
  presets: AccentPreset[];
  /** Selected preset slot (0–7); shared across day and night */
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  updatePreset: (index: number, primary: string) => void;
  resetPresets: () => void;
  palette: AccentPalette;
  mode: ColorMode;
  setMode: (m: ColorMode) => void;
  toggleMode: () => void;
}

const DAY_PRESETS_KEY   = 'accent-day-presets';
const DAY_INDEX_KEY     = 'accent-day-active-index';
const NIGHT_PRESETS_KEY = 'accent-night-presets';
const NIGHT_INDEX_KEY   = 'accent-night-active-index';
const MODE_KEY          = 'accent-mode';
/** Single slot index for both day and night (per-mode colors still in day/night preset arrays) */
const ACTIVE_PRESET_SLOT_KEY = 'accent-preset-slot';

// Legacy keys for migration
const OLD_PRESETS_KEY = 'accent-presets';
const OLD_INDEX_KEY   = 'accent-active-index';
const OLD_HUE_KEY     = 'accent-hue';

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface StoredTheme {
  dayPresets: AccentPreset[];
  nightPresets: AccentPreset[];
  activeIndex: number;
  mode: ColorMode;
}

function readStored(): StoredTheme {
  let mode: ColorMode = 'day';
  try {
    const rawMode = localStorage.getItem(MODE_KEY);
    if (rawMode === 'night') mode = 'night';
  } catch { /* noop */ }

  let dayPresets: AccentPreset[] = [...DEFAULT_PRESETS];
  let nightPresets: AccentPreset[] = [...DEFAULT_NIGHT_PRESETS];
  let activeIndex = DEFAULT_ACTIVE_INDEX;

  try {
    // Migrate from legacy single-hue format
    const oldHue = localStorage.getItem(OLD_HUE_KEY);
    if (oldHue !== null && localStorage.getItem(DAY_PRESETS_KEY) === null && localStorage.getItem(OLD_PRESETS_KEY) === null) {
      localStorage.removeItem(OLD_HUE_KEY);
      const hue = Number(oldHue);
      if (Number.isFinite(hue)) {
        const hex = hueToHex(hue);
        const nearest = DEFAULT_PRESETS.findIndex(
          (p) => Math.abs(hexToHue(p.primary) - hue) < 3,
        );
        if (nearest >= 0) {
          activeIndex = nearest;
        } else {
          dayPresets = [...DEFAULT_PRESETS];
          dayPresets[0] = { label: 'Custom', primary: hex };
          activeIndex = 0;
        }
        return { dayPresets, nightPresets, activeIndex, mode };
      }
    }

    // Migrate from old unified presets → day presets (night gets defaults)
    const oldPresets = localStorage.getItem(OLD_PRESETS_KEY);
    if (oldPresets !== null && localStorage.getItem(DAY_PRESETS_KEY) === null) {
      const parsed = JSON.parse(oldPresets) as AccentPreset[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        dayPresets = parsed;
      }
      const oldIdx = localStorage.getItem(OLD_INDEX_KEY);
      if (oldIdx !== null) {
        const idx = Number(oldIdx);
        if (idx >= 0 && idx < dayPresets.length) activeIndex = idx;
      }
      localStorage.removeItem(OLD_PRESETS_KEY);
      localStorage.removeItem(OLD_INDEX_KEY);
      return { dayPresets, nightPresets, activeIndex, mode };
    }

    // Read day presets
    const rawDay = localStorage.getItem(DAY_PRESETS_KEY);
    if (rawDay) {
      const parsed = JSON.parse(rawDay) as AccentPreset[];
      if (Array.isArray(parsed) && parsed.length > 0) dayPresets = parsed;
    }

    // Read night presets
    const rawNight = localStorage.getItem(NIGHT_PRESETS_KEY);
    if (rawNight) {
      const parsed = JSON.parse(rawNight) as AccentPreset[];
      if (Array.isArray(parsed) && parsed.length > 0) nightPresets = parsed;
    }

    // Shared slot: new key, or migrate from per-mode index keys (prefer current mode, then day, then night)
    const rawSlot = localStorage.getItem(ACTIVE_PRESET_SLOT_KEY);
    if (rawSlot !== null) {
      const idx = Number(rawSlot);
      const maxIdx = Math.min(dayPresets.length, nightPresets.length) - 1;
      if (Number.isFinite(idx) && idx >= 0 && idx <= maxIdx) activeIndex = idx;
    } else {
      const rawDayIdx = localStorage.getItem(DAY_INDEX_KEY);
      const rawNightIdx = localStorage.getItem(NIGHT_INDEX_KEY);
      const dayIdx = rawDayIdx !== null ? Number(rawDayIdx) : NaN;
      const nightIdx = rawNightIdx !== null ? Number(rawNightIdx) : NaN;
      const maxDay = dayPresets.length - 1;
      const maxNight = nightPresets.length - 1;
      if (mode === 'night' && Number.isFinite(nightIdx) && nightIdx >= 0 && nightIdx <= maxNight) {
        activeIndex = nightIdx;
      } else if (Number.isFinite(dayIdx) && dayIdx >= 0 && dayIdx <= maxDay) {
        activeIndex = dayIdx;
      } else if (Number.isFinite(nightIdx) && nightIdx >= 0 && nightIdx <= maxNight) {
        activeIndex = nightIdx;
      }
    }
  } catch { /* privacy mode / SSR */ }

  return { dayPresets, nightPresets, activeIndex, mode };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [stored] = useState(readStored);
  const [dayPresets, setDayPresets]     = useState<AccentPreset[]>(stored.dayPresets);
  const [nightPresets, setNightPresets] = useState<AccentPreset[]>(stored.nightPresets);
  const [activeIndex, setActiveIndex]   = useState(stored.activeIndex);
  const [mode, setMode]                 = useState<ColorMode>(stored.mode);

  const presets  = mode === 'night' ? nightPresets : dayPresets;
  const defaults = mode === 'night' ? DEFAULT_NIGHT_PRESETS : DEFAULT_PRESETS;

  const palette = useMemo(
    () => generateAccentPaletteFromHex(presets[activeIndex]?.primary ?? defaults[0].primary, mode),
    [presets, activeIndex, mode, defaults],
  );

  // Apply CSS vars + persist
  useEffect(() => {
    const vars = accentCssVars(palette, mode);
    const root = document.documentElement;
    root.setAttribute('data-theme', mode);
    for (const [prop, value] of Object.entries(vars)) {
      root.style.setProperty(prop, value);
    }
    try {
      localStorage.setItem(DAY_PRESETS_KEY,   JSON.stringify(dayPresets));
      localStorage.setItem(NIGHT_PRESETS_KEY, JSON.stringify(nightPresets));
      localStorage.setItem(ACTIVE_PRESET_SLOT_KEY, String(activeIndex));
      localStorage.setItem(MODE_KEY, mode);
    } catch { /* noop */ }
  }, [palette, dayPresets, nightPresets, activeIndex, mode]);

  const setActiveIndexCb = useCallback((i: number) => {
    setActiveIndex(i);
  }, []);

  const updatePreset = useCallback((index: number, primary: string) => {
    const setter = mode === 'night' ? setNightPresets : setDayPresets;
    setter((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], primary };
      return next;
    });
  }, [mode]);

  const resetPresets = useCallback(() => {
    if (mode === 'night') {
      setNightPresets([...DEFAULT_NIGHT_PRESETS]);
    } else {
      setDayPresets([...DEFAULT_PRESETS]);
    }
    setActiveIndex(DEFAULT_ACTIVE_INDEX);
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'day' ? 'night' : 'day'));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      presets,
      activeIndex,
      setActiveIndex: setActiveIndexCb,
      updatePreset,
      resetPresets,
      palette,
      mode,
      setMode,
      toggleMode,
    }),
    [presets, activeIndex, setActiveIndexCb, updatePreset, resetPresets, palette, mode],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
}
