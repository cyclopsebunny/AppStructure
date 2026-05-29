import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

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

const GAP = 16; // flex gap between filter sets

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
  label, count, color, textColor, active = false, onClick,
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
        display: 'flex', alignItems: 'center', gap: 8,
        height: 40, paddingLeft: 6, paddingRight: 12, paddingTop: 6, paddingBottom: 6,
        maxWidth: 150, flexShrink: 0,
        borderRadius: 10, border: `1px solid ${borderColor}`, background: bg,
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: 'inherit', textAlign: 'left', overflow: 'hidden',
        transition: 'background 0.12s, border-color 0.12s',
      }}
    >
      <div style={{
        width: 6, alignSelf: 'stretch', borderRadius: 30,
        background: barColor, flexShrink: 0, transition: 'background 0.12s',
      }} />
      <span style={{
        flex: '1 0 0', minWidth: 0, fontSize: 14, fontWeight: 500, lineHeight: '15px',
        color: labelColor, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis',
        whiteSpace: 'nowrap', transition: 'color 0.12s',
      }}>
        {label}
      </span>
      {count !== undefined && (
        <span style={{
          fontSize: 20, fontWeight: 700, lineHeight: '24px', color: countColor,
          flexShrink: 0, transition: 'color 0.12s',
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
  wrapChips?: boolean;
}

const FilterSet: React.FC<FilterSetProps> = ({
  data, selected = false, activeChipIds, onSetClick, onChipClick, wrapChips,
}) => {
  const boxShadow = selected
    ? '0px 2px 48px 0px var(--shadow-card), 0 0 0 1px var(--accent-primary, #0a76db), inset 0 0 0 1px var(--accent-primary, #0a76db)'
    : '0px 2px 48px 0px var(--shadow-card)';
  const borderColor = selected
    ? 'var(--accent-primary, #0a76db)'
    : 'var(--accent-border-light, #d3e4f2)';

  return (
    <div
      role="button"
      tabIndex={onSetClick ? 0 : undefined}
      onClick={onSetClick}
      onKeyDown={onSetClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSetClick(); } } : undefined}
      aria-pressed={selected}
      aria-label={data.label}
      style={{
        display: 'flex', alignItems: 'center', flexWrap: wrapChips ? 'wrap' : 'nowrap', gap: 6, padding: 6,
        borderRadius: 16, border: `1px solid ${borderColor}`, boxShadow,
        background: 'var(--surface-card, rgba(255,255,255,0.75))',
        cursor: onSetClick ? 'pointer' : 'default',
        fontFamily: 'inherit', flexShrink: 0,
        transition: 'border-color 0.15s, box-shadow 0.15s',
        userSelect: 'none',
      }}
    >
      {data.chips.map((chip) => (
        <FilterSetChip
          key={chip.id}
          {...chip}
          active={activeChipIds.has(chip.id)}
          onClick={selected && onChipClick ? (e) => {
            e.stopPropagation();
            onChipClick(chip.id);
          } : undefined}
        />
      ))}
    </div>
  );
};

// ── MoreButton ────────────────────────────────────────────────────────────────

const MoreButton: React.FC<{ open: boolean; onClick: () => void; activeCount?: number; label?: string }> = ({ open, onClick, activeCount = 0, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-expanded={open}
    aria-label="More filter sets"
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: label ? 8 : 0,
      padding: 6, paddingLeft: label ? 24 : 6, borderRadius: 16,
      border: '1px solid transparent',
      background: 'var(--surface-card, rgba(255,255,255,0.75))',
      boxShadow: '0px 2px 48px 0px var(--shadow-card, rgba(0,0,0,0.15))',
      cursor: 'pointer', fontFamily: 'inherit',
      flexShrink: 0, transition: 'background 0.12s',
      position: 'relative',
    }}
  >
    {label && (
      <span style={{
        fontSize: 10, fontWeight: 600, lineHeight: '16px',
        letterSpacing: '0.5px', textTransform: 'uppercase',
        color: '#94a3b8', whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
    )}
    {/* Inner chip matching FilterSetChip height so the pill is the same height as peers */}
    <div style={{
      height: 40, padding: '0 14px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 10,
      border: `1px solid ${open || activeCount > 0 ? 'var(--accent-primary, #0a76db)' : 'var(--accent-border-light, #d3e4f2)'}`,
      background: open ? 'var(--surface-hover, rgba(240,247,255,0.9))' : 'var(--surface-elevated, rgba(255,255,255,0.5))',
      fontSize: 16, fontWeight: 700, letterSpacing: '0.1em', lineHeight: 1,
      color: open || activeCount > 0 ? 'var(--accent-primary, #0a76db)' : 'var(--text-secondary, #64748b)',
      transition: 'border-color 0.12s, background 0.12s, color 0.12s',
      flexShrink: 0,
    }}>
      •••
    </div>
    {activeCount > 0 && (
      <div style={{
        position: 'absolute', top: -2, right: -2,
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
        {activeCount}
      </div>
    )}
  </button>
);

// ── FilterSetBar ──────────────────────────────────────────────────────────────

export const FilterSetBar: React.FC<FilterSetBarProps> = ({
  sets, selectedSetId, activeChipIds, onSetClick, onChipClick, className, style,
}) => {
  const activeSet = new Set<string>(
    activeChipIds === undefined
      ? []
      : Array.isArray(activeChipIds) ? activeChipIds : [activeChipIds],
  );

  const containerRef   = useRef<HTMLDivElement>(null);
  const itemRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const moreRef        = useRef<HTMLDivElement>(null);
  const moreWrapperRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(sets.length);
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left?: number; right?: number } | null>(null);

  const recalc = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const available = container.offsetWidth;
    const n = sets.length;
    const widths = Array.from({ length: n }, (_, i) => itemRefs.current[i]?.offsetWidth ?? 0);
    const moreW  = (moreRef.current?.offsetWidth ?? 48) + GAP;

    // Check if all items fit without the overflow button
    const totalNoMore = widths.reduce((s, w, i) => s + w + (i > 0 ? GAP : 0), 0);
    if (totalNoMore <= available) { setVisibleCount(n); return; }

    // Reserve space for the overflow button and fit as many as possible
    const effectiveWidth = available - moreW;
    let used = 0, count = 0;
    for (let i = 0; i < n; i++) {
      const spacing = i > 0 ? GAP : 0;
      if (used + spacing + widths[i] <= effectiveWidth) { used += spacing + widths[i]; count++; }
      else break;
    }
    setVisibleCount(Math.max(0, count));
  }, [sets]);

  useLayoutEffect(() => { recalc(); }, [recalc]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [recalc]);

  // Close dropdown when clicking outside or scrolling
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

  const hasOverflow = visibleCount < sets.length;
  const overflowActiveCount = sets
    .slice(visibleCount)
    .flatMap(s => s.chips)
    .filter(c => activeSet.has(c.id))
    .length;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: GAP, ...style }}
    >
      {/* Hidden measurement layer — always renders all items so widths are always available */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0,
          visibility: 'hidden', pointerEvents: 'none',
          display: 'flex', alignItems: 'center', gap: GAP,
        }}
      >
        {sets.map((set, i) => (
          <div key={set.id} ref={el => { itemRefs.current[i] = el; }}>
            <FilterSet data={set} selected={false} activeChipIds={new Set()} />
          </div>
        ))}
        <div ref={moreRef}>
          <MoreButton open={false} onClick={() => {}} />
        </div>
      </div>

      {/* Visible items */}
      {sets.slice(0, visibleCount).map(set => (
        <FilterSet
          key={set.id}
          data={set}
          selected={set.id === selectedSetId}
          activeChipIds={activeSet}
          onSetClick={onSetClick ? () => onSetClick(set.id) : undefined}
          onChipClick={onChipClick ? chipId => onChipClick(chipId, set.id) : undefined}
        />
      ))}

      {/* Overflow button + portal dropdown */}
      {hasOverflow && (
        <div
          ref={moreWrapperRef}
          style={{ flexShrink: 0 }}
        >
          <MoreButton
            open={open}
            activeCount={overflowActiveCount}
            label={visibleCount === 0 ? 'Quick Filters' : undefined}
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
          />
          {open && dropdownPos && createPortal(
            <div
              data-filter-dropdown
              style={{
                position: 'fixed', top: dropdownPos.top, zIndex: 9999,
                ...(dropdownPos.left !== undefined ? { left: dropdownPos.left } : { right: dropdownPos.right }),
                display: 'flex', flexDirection: 'column', gap: 8, padding: 8,
                borderRadius: 24,
                background: 'var(--surface-card, rgba(255,255,255,0.95))',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0px 8px 32px rgba(0,0,0,0.15)',
                border: '1px solid var(--accent-border-light, #d3e4f2)',
                maxWidth: 'calc(100vw - 16px)',
              }}
            >
              {sets.slice(visibleCount).map(set => (
                <FilterSet
                  key={set.id}
                  data={set}
                  selected={set.id === selectedSetId}
                  activeChipIds={activeSet}
                  onSetClick={onSetClick ? () => onSetClick(set.id) : undefined}
                  onChipClick={onChipClick ? (chipId) => { onChipClick(chipId, set.id); setOpen(false); } : undefined}
                  wrapChips
                />
              ))}
            </div>,
            document.body,
          )}
        </div>
      )}
    </div>
  );
};

export default FilterSetBar;
