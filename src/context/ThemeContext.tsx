import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  generateAccentPaletteFromHex,
  accentCssVars,
  DEFAULT_PRESETS,
  DEFAULT_ACTIVE_INDEX,
  hexToHue,
  hueToHex,
} from '../utils/accentPalette';
import type { AccentPalette, AccentPreset } from '../utils/accentPalette';

interface ThemeContextValue {
  presets: AccentPreset[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  updatePreset: (index: number, primary: string) => void;
  resetPresets: () => void;
  palette: AccentPalette;
}

const PRESETS_KEY = 'accent-presets';
const INDEX_KEY = 'accent-active-index';
const OLD_HUE_KEY = 'accent-hue';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStored(): { presets: AccentPreset[]; activeIndex: number } {
  try {
    // Migrate from old single-hue format
    const oldHue = localStorage.getItem(OLD_HUE_KEY);
    if (oldHue !== null && localStorage.getItem(PRESETS_KEY) === null) {
      localStorage.removeItem(OLD_HUE_KEY);
      const hue = Number(oldHue);
      if (Number.isFinite(hue)) {
        const hex = hueToHex(hue);
        const nearest = DEFAULT_PRESETS.findIndex(
          (p) => Math.abs(hexToHue(p.primary) - hue) < 3,
        );
        if (nearest >= 0) {
          return { presets: [...DEFAULT_PRESETS], activeIndex: nearest };
        }
        const presets = [...DEFAULT_PRESETS];
        presets[0] = { label: 'Custom', primary: hex };
        return { presets, activeIndex: 0 };
      }
    }

    const rawPresets = localStorage.getItem(PRESETS_KEY);
    const rawIndex = localStorage.getItem(INDEX_KEY);
    const presets = rawPresets ? JSON.parse(rawPresets) as AccentPreset[] : [...DEFAULT_PRESETS];
    const activeIndex = rawIndex !== null ? Number(rawIndex) : DEFAULT_ACTIVE_INDEX;
    if (!Array.isArray(presets) || presets.length === 0) {
      return { presets: [...DEFAULT_PRESETS], activeIndex: DEFAULT_ACTIVE_INDEX };
    }
    return {
      presets,
      activeIndex: activeIndex >= 0 && activeIndex < presets.length ? activeIndex : 0,
    };
  } catch { /* privacy mode / SSR */ }
  return { presets: [...DEFAULT_PRESETS], activeIndex: DEFAULT_ACTIVE_INDEX };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [stored] = useState(readStored);
  const [presets, setPresets] = useState<AccentPreset[]>(stored.presets);
  const [activeIndex, setActiveIndex] = useState(stored.activeIndex);

  const palette = useMemo(
    () => generateAccentPaletteFromHex(presets[activeIndex]?.primary ?? DEFAULT_PRESETS[0].primary),
    [presets, activeIndex],
  );

  useEffect(() => {
    const vars = accentCssVars(palette);
    const root = document.documentElement;
    for (const [prop, value] of Object.entries(vars)) {
      root.style.setProperty(prop, value);
    }
    try {
      localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
      localStorage.setItem(INDEX_KEY, String(activeIndex));
    } catch { /* noop */ }
  }, [palette, presets, activeIndex]);

  const updatePreset = useCallback((index: number, primary: string) => {
    setPresets((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], primary };
      return next;
    });
  }, []);

  const resetPresets = useCallback(() => {
    setPresets([...DEFAULT_PRESETS]);
    setActiveIndex(DEFAULT_ACTIVE_INDEX);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ presets, activeIndex, setActiveIndex, updatePreset, resetPresets, palette }),
    [presets, activeIndex, updatePreset, resetPresets, palette],
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
