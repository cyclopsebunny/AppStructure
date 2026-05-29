import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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

// ── Shared sub-renders ────────────────────────────────────────────────────────

function GroupLabel({ label }: { label: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', height: '100%',
      paddingLeft: 16, paddingRight: 8, flexShrink: 0,
    }}>
      <span style={{
        fontSize: 10, fontWeight: 600, lineHeight: '16px',
        letterSpacing: '0.5px', textTransform: 'uppercase',
        color: '#94a3b8', whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
    </div>
  );
}

function GroupButtons({
  filters, activeSet, onFilterClick, closeDropdown, wrap,
}: {
  filters: FilterButtonItem[];
  activeSet: Set<string>;
  onFilterClick?: (id: string) => void;
  closeDropdown?: () => void;
  wrap?: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: wrap ? 'wrap' : 'nowrap', minHeight: 40, gap: 6, flexShrink: 0 }}>
      {filters.map((filter) => {
        const { id, ...rest } = filter;
        return (
          <FilterButton
            key={id}
            {...rest}
            active={activeSet.has(id)}
            onClick={onFilterClick ? () => { onFilterClick(id); closeDropdown?.(); } : undefined}
          />
        );
      })}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export const FilterButtonBar: React.FC<FilterButtonBarProps> = ({
  groups, activeIds, onFilterClick, className, style,
}) => {
  const activeSet = new Set(
    activeIds === undefined
      ? []
      : Array.isArray(activeIds) ? activeIds : [activeIds],
  );

  const outerRef       = useRef<HTMLDivElement>(null);
  const itemRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const moreRef        = useRef<HTMLDivElement>(null);
  const moreWrapperRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(groups.length);
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left?: number; right?: number } | null>(null);

  const recalc = useCallback(() => {
    const card = outerRef.current;
    const parent = card?.parentElement;
    if (!card || !parent) return;
    const parentCs = window.getComputedStyle(parent);
    const available = parent.clientWidth - parseFloat(parentCs.paddingLeft) - parseFloat(parentCs.paddingRight);
    const n = groups.length;
    const widths = Array.from({ length: n }, (_, i) => itemRefs.current[i]?.offsetWidth ?? 0);
    const moreW  = moreRef.current?.offsetWidth ?? 56;

    // Check if all groups fit without the overflow button
    const totalNoMore = widths.reduce((s, w) => s + w, 0);
    if (totalNoMore <= available) { setVisibleCount(n); return; }

    // Reserve space for overflow button and fit as many groups as possible
    const effectiveWidth = available - moreW;
    let used = 0, count = 0;
    for (let i = 0; i < n; i++) {
      if (used + widths[i] <= effectiveWidth) { used += widths[i]; count++; }
      else break;
    }
    setVisibleCount(Math.max(0, count));
  }, [groups]);

  useLayoutEffect(() => { recalc(); }, [recalc]);

  useEffect(() => {
    const parent = outerRef.current?.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver(recalc);
    ro.observe(parent);
    return () => ro.disconnect();
  }, [recalc]);


  // Close dropdown on outside click, scroll, or resize
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (
        !moreWrapperRef.current?.contains(e.target as Node) &&
        !(e.target as Element)?.closest?.('[data-filter-dropdown]')
      ) close();
    };
    window.addEventListener('pointerdown', onPointer);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  const hasOverflow = visibleCount < groups.length;
  const overflowActiveCount = groups
    .slice(visibleCount)
    .flatMap(g => g.filters)
    .filter(f => activeSet.has(f.id))
    .length;

  return (
    <div
      ref={outerRef}
      className={className}
      style={{
        position: 'relative',
        display: 'flex', alignItems: 'center',
        padding: 8, borderRadius: 16,
        background: 'var(--surface-card, rgba(255,255,255,0.75))',
        boxShadow: '0px 2px 48px 0px var(--shadow-card, rgba(0,0,0,0.15))',
        ...style,
      }}
    >
      {/* Hidden measurement layer — always renders all groups + overflow button */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0,
          visibility: 'hidden', pointerEvents: 'none',
          display: 'flex', alignItems: 'center',
        }}
      >
        {groups.map((group, i) => (
          <div
            key={group.id}
            ref={el => { itemRefs.current[i] = el; }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <GroupLabel label={group.label} />
            <GroupButtons filters={group.filters} activeSet={new Set()} />
          </div>
        ))}
        {/* Measure overflow button width */}
        <div ref={moreRef} style={{ marginLeft: 8 }}>
          <button type="button" style={{
            display: 'inline-flex', alignItems: 'center',
            height: 40, padding: '0 14px', borderRadius: 10,
            border: '1px solid transparent', background: 'transparent',
            fontFamily: 'inherit', fontSize: 16, fontWeight: 700, letterSpacing: '0.05em',
          }}>
            •••
          </button>
        </div>
      </div>

      {/* Visible groups */}
      {groups.slice(0, visibleCount).map((group) => (
        <React.Fragment key={group.id}>
          <GroupLabel label={group.label} />
          <GroupButtons
            filters={group.filters}
            activeSet={activeSet}
            onFilterClick={onFilterClick}
          />
        </React.Fragment>
      ))}

      {/* Overflow button + portal dropdown */}
      {hasOverflow && (
        <div ref={moreWrapperRef} style={{ flexShrink: 0, marginLeft: visibleCount === 0 ? 0 : 8, display: 'flex', alignItems: 'center' }}>
          {visibleCount === 0 && <GroupLabel label="Quick Filters" />}
          <div style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => {
                if (!open && moreWrapperRef.current) {
                  const r = moreWrapperRef.current.getBoundingClientRect();
                  const alignLeft = r.left < window.innerWidth / 2;
                  setDropdownPos(alignLeft
                    ? { top: r.bottom + 8, left: r.left }
                    : { top: r.bottom + 8, right: window.innerWidth - r.right },
                  );
                }
                setOpen(o => !o);
              }}
              aria-expanded={open}
              aria-label="More filters"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                height: 40, padding: '0 14px', flexShrink: 0,
                borderRadius: 10,
                border: `1px solid ${open || overflowActiveCount > 0 ? 'var(--accent-primary, #0a76db)' : 'var(--accent-border-light, #d3e4f2)'}`,
                background: open
                  ? 'var(--surface-hover, rgba(240,247,255,0.9))'
                  : 'var(--surface-elevated, rgba(255,255,255,0.5))',
                cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 16, fontWeight: 700, letterSpacing: '0.05em', lineHeight: 1,
                color: open || overflowActiveCount > 0 ? 'var(--accent-primary, #0a76db)' : '#94a3b8',
                transition: 'background 0.12s, border-color 0.12s, color 0.12s',
              }}
            >
              •••
            </button>
            {overflowActiveCount > 0 && (
              <div style={{
                position: 'absolute', top: -8, right: -8,
                minWidth: 18, height: 18, padding: '0 5px',
                borderRadius: 9,
                background: 'var(--accent-primary, #0a76db)',
                color: '#ffffff',
                fontSize: 11, fontWeight: 700, lineHeight: '18px',
                textAlign: 'center',
                boxShadow: '0 0 0 2px var(--surface-card, #ffffff)',
                pointerEvents: 'none',
                zIndex: 1,
              }}>
                {overflowActiveCount}
              </div>
            )}
          </div>

          {open && dropdownPos && createPortal(
            <div
              data-filter-dropdown
              style={{
                position: 'fixed', top: dropdownPos.top, zIndex: 9999,
                ...(dropdownPos.left !== undefined ? { left: dropdownPos.left } : { right: dropdownPos.right }),
                display: 'flex', flexDirection: 'column', gap: 0,
                padding: '8px 0',
                borderRadius: 12,
                background: 'var(--surface-card, rgba(255,255,255,0.95))',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0px 8px 32px rgba(0,0,0,0.15)',
                border: '1px solid var(--accent-border-light, #d3e4f2)',
                minWidth: 220,
                maxWidth: 'calc(100vw - 16px)',
              }}
            >
              {groups.slice(visibleCount).map((group, gi) => (
                <div key={group.id}>
                  {gi > 0 && (
                    <div style={{ height: 1, background: 'var(--accent-border-light, #d3e4f2)', margin: '4px 12px' }} />
                  )}
                  <div style={{ padding: '6px 12px' }}>
                    <div style={{
                      fontSize: 10, fontWeight: 600, letterSpacing: '0.5px',
                      textTransform: 'uppercase', color: '#94a3b8', marginBottom: 8,
                    }}>
                      {group.label}
                    </div>
                    <GroupButtons
                      filters={group.filters}
                      activeSet={activeSet}
                      onFilterClick={onFilterClick}
                      closeDropdown={() => setOpen(false)}
                      wrap
                    />
                  </div>
                </div>
              ))}
            </div>,
            document.body,
          )}
        </div>
      )}
    </div>
  );
};

export default FilterButtonBar;
