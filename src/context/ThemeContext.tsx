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
  /** The active index for the *current* mode */
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

// Legacy keys for migration
const OLD_PRESETS_KEY = 'accent-presets';
const OLD_INDEX_KEY   = 'accent-active-index';
const OLD_HUE_KEY     = 'accent-hue';

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface StoredTheme {
  dayPresets: AccentPreset[];
  dayActiveIndex: number;
  nightPresets: AccentPreset[];
  nightActiveIndex: number;
  mode: ColorMode;
}

function readStored(): StoredTheme {
  let mode: ColorMode = 'day';
  try {
    const rawMode = localStorage.getItem(MODE_KEY);
    if (rawMode === 'night') mode = 'night';
  } catch { /* noop */ }

  let dayPresets: AccentPreset[] = [...DEFAULT_PRESETS];
  let dayActiveIndex = DEFAULT_ACTIVE_INDEX;
  let nightPresets: AccentPreset[] = [...DEFAULT_NIGHT_PRESETS];
  let nightActiveIndex = DEFAULT_ACTIVE_INDEX;

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
          dayActiveIndex = nearest;
          nightActiveIndex = nearest;
        } else {
          dayPresets = [...DEFAULT_PRESETS];
          dayPresets[0] = { label: 'Custom', primary: hex };
          dayActiveIndex = 0;
        }
        return { dayPresets, dayActiveIndex, nightPresets, nightActiveIndex, mode };
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
        if (idx >= 0 && idx < dayPresets.length) dayActiveIndex = idx;
      }
      localStorage.removeItem(OLD_PRESETS_KEY);
      localStorage.removeItem(OLD_INDEX_KEY);
      return { dayPresets, dayActiveIndex, nightPresets, nightActiveIndex, mode };
    }

    // Read day presets
    const rawDay = localStorage.getItem(DAY_PRESETS_KEY);
    if (rawDay) {
      const parsed = JSON.parse(rawDay) as AccentPreset[];
      if (Array.isArray(parsed) && parsed.length > 0) dayPresets = parsed;
    }
    const rawDayIdx = localStorage.getItem(DAY_INDEX_KEY);
    if (rawDayIdx !== null) {
      const idx = Number(rawDayIdx);
      if (idx >= 0 && idx < dayPresets.length) dayActiveIndex = idx;
    }

    // Read night presets
    const rawNight = localStorage.getItem(NIGHT_PRESETS_KEY);
    if (rawNight) {
      const parsed = JSON.parse(rawNight) as AccentPreset[];
      if (Array.isArray(parsed) && parsed.length > 0) nightPresets = parsed;
    }
    const rawNightIdx = localStorage.getItem(NIGHT_INDEX_KEY);
    if (rawNightIdx !== null) {
      const idx = Number(rawNightIdx);
      if (idx >= 0 && idx < nightPresets.length) nightActiveIndex = idx;
    }
  } catch { /* privacy mode / SSR */ }

  return { dayPresets, dayActiveIndex, nightPresets, nightActiveIndex, mode };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [stored] = useState(readStored);
  const [dayPresets, setDayPresets]         = useState<AccentPreset[]>(stored.dayPresets);
  const [dayActiveIndex, setDayActiveIndex] = useState(stored.dayActiveIndex);
  const [nightPresets, setNightPresets]         = useState<AccentPreset[]>(stored.nightPresets);
  const [nightActiveIndex, setNightActiveIndex] = useState(stored.nightActiveIndex);
  const [mode, setMode] = useState<ColorMode>(stored.mode);

  const presets     = mode === 'night' ? nightPresets : dayPresets;
  const activeIndex = mode === 'night' ? nightActiveIndex : dayActiveIndex;
  const defaults    = mode === 'night' ? DEFAULT_NIGHT_PRESETS : DEFAULT_PRESETS;

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
      localStorage.setItem(DAY_INDEX_KEY,     String(dayActiveIndex));
      localStorage.setItem(NIGHT_PRESETS_KEY, JSON.stringify(nightPresets));
      localStorage.setItem(NIGHT_INDEX_KEY,   String(nightActiveIndex));
      localStorage.setItem(MODE_KEY, mode);
    } catch { /* noop */ }
  }, [palette, dayPresets, dayActiveIndex, nightPresets, nightActiveIndex, mode]);

  const setActiveIndex = useCallback((i: number) => {
    if (mode === 'night') setNightActiveIndex(i);
    else setDayActiveIndex(i);
  }, [mode]);

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
      setNightActiveIndex(DEFAULT_ACTIVE_INDEX);
    } else {
      setDayPresets([...DEFAULT_PRESETS]);
      setDayActiveIndex(DEFAULT_ACTIVE_INDEX);
    }
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'day' ? 'night' : 'day'));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ presets, activeIndex, setActiveIndex, updatePreset, resetPresets, palette, mode, setMode, toggleMode }),
    [presets, activeIndex, setActiveIndex, updatePreset, resetPresets, palette, mode, toggleMode],
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
