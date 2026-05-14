import React, { useState } from 'react';
import {
  PalletFilledIcon,
  DraganddropDefaultIcon,
  CalendarDefaultOutlinedIcon,
} from '@component-library/core';

// ── Inline SVGs for shapes not in the icon library ────────────────────────────

function ChevronRight() {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M1.5 1.5L6.5 6L1.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Small inbound/outbound arrow to the left of the direction label */
function DirectionArrow({ inbound }: { inbound: boolean }) {
  return (
    <svg
      width="12"
      height="10"
      viewBox="0 0 12 10"
      fill="none"
      aria-hidden="true"
      style={{
        display: 'block',
        flexShrink: 0,
        transform: inbound ? 'scaleX(-1)' : undefined,
        transformOrigin: 'center',
      }}
    >
      <path d="M1 5h10M6 1l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** IB (and segments like "IB / DL") → inbound arrow left; OB → outbound arrow right; otherwise default right. */
function isInboundDirection(direction: string): boolean {
  const trimmed = direction.trim();
  const firstSeg = trimmed.split(/\s*\/\s*/)[0]?.toUpperCase().trim() ?? '';
  if (firstSeg.startsWith('IB')) return true;
  if (firstSeg.startsWith('OB')) return false;
  if (/\bIB\b/i.test(direction)) return true;
  if (/\bOB\b/i.test(direction)) return false;
  return false;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ShipmentItemProps {
  /** Shipment ID / reference number — the primary label */
  id: string;
  /** Secondary line, e.g. "Created 5/23/2024 08:12am" */
  createdAt?: string;
  /**
   * Direction / type badge shown on the right side of the row,
   * e.g. "IB / DL", "OB", "IB".
   */
  direction?: string;
  /**
   * Left accent bar color.  Defaults to the neutral gray `#ccc`.
   * Pass a status color to communicate urgency, type, or category.
   */
  barColor?: string;
  /** Whether the item appears in a selected/active state */
  selected?: boolean;
  /** Drag handle visible — set false to hide */
  showDragHandle?: boolean;
  /** Leading icon — defaults to PalletFilledIcon */
  icon?: React.ReactNode;
  /** Right-side leading icon — defaults to PalletFilledIcon (the second pallet in Figma) */
  rightIcon?: React.ReactNode;
  /** Whether to show the calendar icon in the action area */
  showCalendar?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

// ── ShipmentItem ──────────────────────────────────────────────────────────────

/**
 * ShipmentItem
 *
 * A single row in the shipment side-panel list.  Matches the `commonListItem`
 * pattern (node 84:6776) in the Enterprise Color Tokens Figma file.
 *
 * Each row consists of:
 * - A 6 px left accent bar (color-coded by status / type)
 * - Drag-handle + leading icon
 * - ID label + created-at subtitle
 * - Direction badge (e.g. "IB / DL", "OB") with a small arrow: **left** for inbound (IB), **right** for outbound (OB)
 *
 * @example
 * ```tsx
 * <ShipmentItem
 *   id="010203040506"
 *   createdAt="Created 5/23/2024 08:12am"
 *   direction="IB / DL"
 *   barColor="#009cde"
 *   onClick={() => openShipment('010203040506')}
 * />
 * ```
 */
export const ShipmentItem: React.FC<ShipmentItemProps> = ({
  id,
  createdAt,
  direction,
  barColor = '#cccccc',
  selected = false,
  showDragHandle = true,
  icon,
  rightIcon,
  showCalendar = true,
  onClick,
  className,
  style,
}) => {
  const [hovered, setHovered] = useState(false);

  const bg = selected
    ? 'var(--accent-subtle-bg, #e0eeff)'
    : hovered
      ? 'var(--surface-hover, rgba(255,255,255,0.9))'
      : 'var(--surface-card, rgba(255,255,255,0.75))';

  const borderColor = selected
    ? 'var(--accent-primary, #0a76db)'
    : 'var(--accent-border-light, #d3e4f2)';

  const inboundArrow = direction ? isInboundDirection(direction) : false;

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      onKeyDown={(e) => { if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick(); }}
      className={className}
      style={{
        display:        'flex',
        alignItems:     'stretch',
        gap:            10,
        padding:        '8.75px 4.75px 8.75px 8.75px',
        borderRadius:   12,
        border:         `0.75px solid ${borderColor}`,
        background:     bg,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        boxShadow:      selected
          ? `0 0 0 1.5px var(--accent-primary, #0a76db), 0px 1px 2px rgba(0,0,0,0.05)`
          : '0px 1px 2px rgba(0,0,0,0.05)',
        cursor:         onClick ? 'pointer' : 'default',
        transition:     'background 0.12s, box-shadow 0.12s, border-color 0.12s',
        userSelect:     'none',
        ...style,
      }}
    >
      {/* Left accent bar */}
      <div style={{ width: 6, borderRadius: 4, background: barColor, flexShrink: 0, alignSelf: 'stretch' }} />

      {/* Content */}
      <div style={{ flex: '1 0 0', display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, padding: '6px 0' }}>

        {/* Drag handle */}
        {showDragHandle && (
          <div style={{ display: 'flex', flexShrink: 0, color: 'var(--icon-muted, rgba(0,0,0,0.4))' }}>
            <DraganddropDefaultIcon size={24} />
          </div>
        )}

        {/* Leading icon */}
        <div style={{ flexShrink: 0, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-dark, #143c5c)' }}>
          {icon ?? <PalletFilledIcon size={24} />}
        </div>

        {/* Secondary icon (right of leading) */}
        {rightIcon && (
          <div style={{ flexShrink: 0, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-dark, #143c5c)' }}>
            {rightIcon}
          </div>
        )}

        {/* Text */}
        <div style={{ flex: '1 0 0', display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <div style={{
            fontSize:     16,
            fontWeight:   600,
            lineHeight:   '21px',
            letterSpacing: '0.0066px',
            color:        'var(--text-primary, rgba(0,0,0,0.8))',
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            whiteSpace:   'nowrap',
          }}>
            {id}
          </div>
          {createdAt && (
            <div style={{
              fontSize:     12,
              fontStyle:    'italic',
              lineHeight:   '16px',
              color:        'var(--text-muted, rgba(0,0,0,0.4))',
              overflow:     'hidden',
              textOverflow: 'ellipsis',
              whiteSpace:   'nowrap',
            }}>
              {createdAt}
            </div>
          )}
        </div>

        {/* Right section: direction badge + calendar + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {direction && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary, rgba(0,0,0,0.6))' }}>
              <DirectionArrow inbound={inboundArrow} />
              <span style={{ fontSize: 12, fontWeight: 700, lineHeight: '16px', letterSpacing: '0.0066px', whiteSpace: 'nowrap' }}>
                {direction}
              </span>
            </div>
          )}

          {showCalendar && (
            <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary, rgba(0,0,0,0.6))' }}>
              <CalendarDefaultOutlinedIcon size={24} />
            </div>
          )}

          <div style={{ color: 'var(--text-muted, rgba(0,0,0,0.4))', display: 'flex', alignItems: 'center' }}>
            <ChevronRight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentItem;
