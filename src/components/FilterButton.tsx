import React from 'react';

/**
 * Returns true when a hex color is light enough that dark text is needed on top of it.
 * Uses the WCAG relative-luminance formula. Only handles 3- and 6-digit hex strings.
 */
function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '');
  const full = raw.length === 3
    ? raw.split('').map((c) => c + c).join('')
    : raw;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return L > 0.35;
}

export interface FilterButtonProps {
  /** Visible label text */
  label: string;
  /** Numeric count shown to the right of the label */
  count?: number;
  /**
   * Color of the left-side indicator bar, label, and count.
   * Pass a CSS color string (hex, rgb, var(…), etc.).
   */
  color: string;
  /**
   * Override just the text/count color when it differs from the indicator color.
   * Defaults to `color`.
   */
  textColor?: string;
  /** Whether this filter is currently active / selected */
  active?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles on the root element */
  style?: React.CSSProperties;
}

/**
 * FilterButton
 *
 * A stat+filter chip used inside a FilterButtonBar. Shows a colored left-side
 * indicator bar, a label, and an optional count.
 *
 * Matches the `pinnedFilters-currentDesign` Figma component
 * (node 102:19858 in the Enterprise Color Tokens file).
 *
 * @example
 * ```tsx
 * <FilterButton label="Available" count={23} color="#009cde" />
 * <FilterButton label="In Use"    count={28} color="#43ac1d" textColor="#348516" active />
 * ```
 */
export const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  count,
  color,
  textColor,
  active = false,
  onClick,
  className,
  style,
}) => {
  const resolvedTextColor = textColor ?? color;
  // Active: full color fill. Use white text on dark fills, dark text on light fills.
  // Luminance is computed from `color` (the active background) so callers never
  // have to think about it — yellow chips get dark text automatically.
  const activeTextColor = isLightColor(color) ? resolvedTextColor : '#ffffff';
  const activeIndicator = '#ffffff';
  const inactiveIndicator = color;

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      style={{
        // Layout
        display:        'inline-flex',
        alignItems:     'center',
        gap:            8,
        height:         40,
        maxWidth:       150,
        overflow:       'hidden',
        flexShrink:     0,
        // Spacing
        paddingTop:     6,
        paddingBottom:  6,
        paddingLeft:    6,
        paddingRight:   12,
        // Appearance
        background:     active
          ? color
          : 'var(--surface-elevated, rgba(255,255,255,0.5))',
        border:         '1px solid var(--accent-border-light, #d3e4f2)',
        borderRadius:   10,
        cursor:         onClick ? 'pointer' : 'default',
        // Typography reset
        fontFamily:     'inherit',
        // Transition
        transition:     'background 0.12s',
        ...style,
      }}
    >
      {/* Left indicator bar */}
      <span
        aria-hidden="true"
        style={{
          display:      'block',
          width:        6,
          height:       '100%',
          borderRadius: 30,
          background:   active ? activeIndicator : inactiveIndicator,
          flexShrink:   0,
          alignSelf:    'stretch',
          transition:   'background 0.12s',
        }}
      />

      {/* Label */}
      <span
        style={{
          flex:         '1 0 0',
          minWidth:     1,
          fontSize:     14,
          fontWeight:   500,
          lineHeight:   '15px',
          color:        active ? activeTextColor : resolvedTextColor,
          textAlign:    'center',
          whiteSpace:   'nowrap',
          overflow:     'hidden',
          textOverflow: 'ellipsis',
          transition:   'color 0.12s',
        }}
      >
        {label}
      </span>

      {/* Count */}
      {count !== undefined && (
        <span
          style={{
            fontSize:   20,
            fontWeight: 700,
            lineHeight: '24px',
            color:      active ? activeTextColor : resolvedTextColor,
            textAlign:  'center',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'color 0.12s',
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default FilterButton;
