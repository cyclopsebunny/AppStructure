import React, { useState } from 'react';

// ── Helpers ───────────────────────────────────────────────────────────────────

function isLightColor(hex: string): boolean {
  const raw = hex.replace(/^#/, '');
  if (raw.length !== 6) return false;
  const r = parseInt(raw.slice(0, 2), 16) / 255;
  const g = parseInt(raw.slice(2, 4), 16) / 255;
  const b = parseInt(raw.slice(4, 6), 16) / 255;
  const toLinear = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return L > 0.35;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FilterSetChipData {
  /** Unique identifier */
  id: string;
  /** Chip label */
  label: string;
  /** Numeric count shown to the right of the label */
  count?: number;
  /**
   * Accent color used for the left bar.
   * Also drives label / count color in the default state.
   */
  color: string;
  /**
   * Override the label/count text color in the default (inactive) state.
   * Useful when `color` is too saturated for readable body text.
   */
  textColor?: string;
}

export interface FilterSetData {
  /** Unique identifier for this set */
  id: string;
  /** Optional accessible name for the set (not visually rendered) */
  label?: string;
  /** Chips contained in this set */
  chips: FilterSetChipData[];
}

export interface FilterSetBarProps {
  /** The sets to display */
  sets: FilterSetData[];
  /**
   * The currently active set id.
   * The selected set gets a 2px accent-primary border.
   */
  selectedSetId?: string;
  /**
   * Id(s) of the chips that are currently active (filtered on).
   * Supports single-select (string) or multi-select (string[]).
   */
  activeChipIds?: string | string[];
  /** Called when a set is clicked */
  onSetClick?: (setId: string) => void;
  /** Called when a chip inside a set is clicked */
  onChipClick?: (chipId: string, setId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

// ── FilterSetChip ─────────────────────────────────────────────────────────────

interface FilterSetChipProps extends FilterSetChipData {
  active?: boolean;
  onClick?: () => void;
}

const FilterSetChip: React.FC<FilterSetChipProps> = ({
  label,
  count,
  color,
  textColor,
  active = false,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);

  const resolvedTextColor = textColor ?? color;
  const activeTextColor   = isLightColor(color) ? resolvedTextColor : '#ffffff';

  const bg          = active ? color : hovered ? 'var(--surface-hover, rgba(255,255,255,0.9))' : 'var(--surface-elevated, rgba(255,255,255,0.5))';
  const barColor    = active ? (isLightColor(color) ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.5)') : color;
  const labelColor  = active ? activeTextColor : resolvedTextColor;
  const countColor  = active ? activeTextColor : resolvedTextColor;
  const borderColor = active ? 'transparent' : 'var(--accent-border-light, #d3e4f2)';

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display:       'flex',
        alignItems:    'center',
        gap:           8,
        height:        40,
        paddingLeft:   6,
        paddingRight:  12,
        paddingTop:    6,
        paddingBottom: 6,
        maxWidth:      150,
        flexShrink:    0,
        borderRadius:  10,
        border:        `1px solid ${borderColor}`,
        background:    bg,
        cursor:        onClick ? 'pointer' : 'default',
        fontFamily:    'inherit',
        textAlign:     'left',
        overflow:      'hidden',
        transition:    'background 0.12s, border-color 0.12s',
      }}
    >
      {/* Colored bar */}
      <div style={{
        width:        6,
        alignSelf:    'stretch',
        borderRadius: 30,
        background:   barColor,
        flexShrink:   0,
        transition:   'background 0.12s',
      }} />

      {/* Label */}
      <span style={{
        flex:         '1 0 0',
        minWidth:     0,
        fontSize:     14,
        fontWeight:   500,
        lineHeight:   '15px',
        color:        labelColor,
        textAlign:    'center',
        overflow:     'hidden',
        textOverflow: 'ellipsis',
        whiteSpace:   'nowrap',
        transition:   'color 0.12s',
      }}>
        {label}
      </span>

      {/* Count */}
      {count !== undefined && (
        <span style={{
          fontSize:   20,
          fontWeight: 700,
          lineHeight: '24px',
          color:      countColor,
          flexShrink: 0,
          transition: 'color 0.12s',
        }}>
          {count}
        </span>
      )}
    </button>
  );
};

// ── FilterSet ─────────────────────────────────────────────────────────────────

interface FilterSetProps {
  data: FilterSetData;
  selected?: boolean;
  activeChipIds: Set<string>;
  onSetClick?: () => void;
  onChipClick?: (chipId: string) => void;
}

const FilterSet: React.FC<FilterSetProps> = ({
  data,
  selected = false,
  activeChipIds,
  onSetClick,
  onChipClick,
}) => {
  // 2px accent selected ring via box-shadow — no layout shift
  const boxShadow = selected
    ? '0 0 0 1px var(--accent-primary, #0a76db), inset 0 0 0 1px var(--accent-primary, #0a76db)'
    : 'none';

  const borderColor = selected
    ? 'var(--accent-primary, #0a76db)'
    : 'var(--accent-border-light, #d3e4f2)';

  return (
    <button
      type="button"
      onClick={onSetClick}
      aria-pressed={selected}
      aria-label={data.label}
      style={{
        display:       'flex',
        alignItems:    'center',
        gap:           6,
        padding:       6,
        borderRadius:  16,
        border:        `1px solid ${borderColor}`,
        boxShadow,
        background:    'var(--surface-card, rgba(255,255,255,0.75))',
        cursor:        onSetClick ? 'pointer' : 'default',
        fontFamily:    'inherit',
        flexShrink:    0,
        transition:    'border-color 0.15s, box-shadow 0.15s',
      }}
    >
      {data.chips.map((chip) => (
        <FilterSetChip
          key={chip.id}
          {...chip}
          active={activeChipIds.has(chip.id)}
          onClick={selected && onChipClick ? (e) => {
            (e as unknown as React.MouseEvent).stopPropagation();
            onChipClick(chip.id);
          } : undefined}
        />
      ))}
    </button>
  );
};

// ── FilterSetBar ──────────────────────────────────────────────────────────────

/**
 * FilterSetBar
 *
 * A row of selectable filter-set pills. Each pill groups several stat chips
 * under a single selection; clicking a pill makes it the "active" set
 * (shown with a 2px accent-primary border). Within the selected set chips
 * can be individually toggled on/off.
 *
 * Matches node 98:9320 in the Enterprise Color Tokens Figma file.
 *
 * @example
 * ```tsx
 * const SETS = [
 *   {
 *     id: 'trailer-status',
 *     label: 'Trailer Status',
 *     chips: [
 *       { id: 'in-yard',       label: 'In Yard',     count: 23, color: '#0a76db' },
 *       { id: 'at-dock',       label: 'At Dock',     count: 28, color: '#43ac1d', textColor: '#348516' },
 *       { id: 'checked-out',   label: 'Checked Out', count: 12, color: '#909090', textColor: '#6b6b6b' },
 *     ],
 *   },
 *   {
 *     id: 'dock-fill',
 *     label: 'Dock Fill',
 *     chips: [
 *       { id: 'full',  label: 'Full',  count: 32, color: '#003b5c' },
 *       { id: 'empty', label: 'Empty', count: 27, color: '#d78207' },
 *     ],
 *   },
 * ];
 *
 * <FilterSetBar
 *   sets={SETS}
 *   selectedSetId="dock-fill"
 *   activeChipIds={['full']}
 *   onSetClick={(id) => selectSet(id)}
 *   onChipClick={(chipId, setId) => toggleChip(chipId, setId)}
 * />
 * ```
 */
export const FilterSetBar: React.FC<FilterSetBarProps> = ({
  sets,
  selectedSetId,
  activeChipIds,
  onSetClick,
  onChipClick,
  className,
  style,
}) => {
  const activeSet = new Set<string>(
    activeChipIds === undefined
      ? []
      : Array.isArray(activeChipIds)
        ? activeChipIds
        : [activeChipIds],
  );

  return (
    <div
      className={className}
      style={{
        display:    'flex',
        alignItems: 'center',
        gap:        16,
        flexWrap:   'wrap',
        ...style,
      }}
    >
      {sets.map((set) => (
        <FilterSet
          key={set.id}
          data={set}
          selected={set.id === selectedSetId}
          activeChipIds={activeSet}
          onSetClick={onSetClick ? () => onSetClick(set.id) : undefined}
          onChipClick={onChipClick ? (chipId) => onChipClick(chipId, set.id) : undefined}
        />
      ))}
    </div>
  );
};

export default FilterSetBar;
