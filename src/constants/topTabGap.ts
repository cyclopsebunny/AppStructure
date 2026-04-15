import type { Breakpoint } from '../hooks/useBreakpoint';

/**
 * Horizontal gap between top `Tabs` items (px).
 * Lower than the library default (16) so more labels fit before overflow.
 */
export const TOP_TAB_GAP_PX: Record<Breakpoint, number> = {
  mobile:  4,
  tablet:  6,
  desktop: 8,
};

export function topTabGapPx(breakpoint: Breakpoint): number {
  return TOP_TAB_GAP_PX[breakpoint];
}
