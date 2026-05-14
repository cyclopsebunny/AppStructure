import React from 'react';
import { FilterButton } from './FilterButton';
import type { FilterButtonProps } from './FilterButton';

// ── Public types ──────────────────────────────────────────────────────────────

export interface FilterButtonItem extends Omit<FilterButtonProps, 'active' | 'onClick'> {
  /** Unique identifier used for active-state tracking */
  id: string;
}

export interface FilterButtonGroup {
  /** Unique identifier for the group */
  id: string;
  /**
   * Uppercase section label rendered to the left of the group's buttons
   * (e.g. "DOCK TRAFFIC", "EFFICIENCY", "SAFETY").
   */
  label: string;
  /** Filter buttons in this group */
  filters: FilterButtonItem[];
}

export interface FilterButtonBarProps {
  /** One or more labeled groups of filter buttons */
  groups: FilterButtonGroup[];
  /**
   * Id(s) of the currently active filter(s).
   * Supports single-select (string) or multi-select (string[]).
   * Omit for uncontrolled / display-only usage.
   */
  activeIds?: string | string[];
  /** Called with the id of the clicked filter button */
  onFilterClick?: (id: string) => void;
  /** Additional CSS class on the root element */
  className?: string;
  /** Additional inline styles on the root element */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * FilterButtonBar
 *
 * A horizontal bar of grouped stat/filter chips. Each group has an uppercase
 * label and one or more `FilterButton` chips.
 *
 * Matches the `Filters` Figma component (node 102:19844 in the Enterprise Color
 * Tokens file). Uses project CSS custom properties for surface, shadow, and
 * accent tokens so it automatically adapts to theme changes.
 *
 * @example
 * ```tsx
 * const GROUPS: FilterButtonGroup[] = [
 *   {
 *     id: 'dock-traffic',
 *     label: 'Dock Traffic',
 *     filters: [
 *       { id: 'available',  label: 'Available', count: 23, color: '#009cde' },
 *       { id: 'in-use',     label: 'In Use',    count: 28, color: '#43ac1d', textColor: '#348516' },
 *       { id: 'blocked',    label: 'Blocked',   count: 12, color: '#909090', textColor: '#6b6b6b' },
 *     ],
 *   },
 * ];
 *
 * <FilterButtonBar
 *   groups={GROUPS}
 *   activeIds="available"
 *   onFilterClick={(id) => setActive(id)}
 * />
 * ```
 */
export const FilterButtonBar: React.FC<FilterButtonBarProps> = ({
  groups,
  activeIds,
  onFilterClick,
  className,
  style,
}) => {
  const activeSet = new Set(
    activeIds === undefined
      ? []
      : Array.isArray(activeIds)
        ? activeIds
        : [activeIds],
  );

  return (
    <div
      className={className}
      style={{
        display:      'inline-flex',
        alignItems:   'center',
        gap:          0,
        padding:      8,
        borderRadius: 16,
        background:   'var(--surface-card, rgba(255,255,255,0.75))',
        boxShadow:    '0px 2px 48px 0px var(--shadow-card, rgba(0,0,0,0.15))',
        ...style,
      }}
    >
      {groups.map((group, groupIndex) => (
        <React.Fragment key={group.id}>
          {/* Section label */}
          <div
            style={{
              display:    'flex',
              alignItems: 'center',
              height:     '100%',
              paddingLeft:  groupIndex === 0 ? 0 : 16,
              paddingRight: 8,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize:      10,
                fontWeight:    600,
                lineHeight:    '16px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                color:         '#94a3b8',
                whiteSpace:    'nowrap',
              }}
            >
              {group.label}
            </span>
          </div>

          {/* Filter buttons */}
          <div
            style={{
              display:    'flex',
              alignItems: 'center',
              height:     40,
              gap:        6,
              flexShrink: 0,
            }}
          >
            {group.filters.map((filter) => {
              const { id, ...rest } = filter;
              return (
                <FilterButton
                  key={id}
                  {...rest}
                  active={activeSet.has(id)}
                  onClick={onFilterClick ? () => onFilterClick(id) : undefined}
                />
              );
            })}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default FilterButtonBar;
