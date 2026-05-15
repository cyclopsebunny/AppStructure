import React, { useState } from 'react';
import { DraganddropDefaultIcon, TrailerEmptyIcon } from '@component-library/core';

// ── Chevron right SVG ─────────────────────────────────────────────────────────

function ChevronRight() {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M1.5 1.5L6.5 6L1.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

/** A single unassigned trailer record */
export interface UnassignedTrailer {
  /** Unique identifier for the trailer */
  id: string;
  /** Carrier / company name, e.g. "JB Hunt" */
  carrier: string;
  /** Trailer unit number, e.g. "T-1234" */
  trailerNumber: string;
  /** Trailer asset/equipment ID shown as "ID# …", e.g. "1234567890" */
  trailerId: string;
  /**
   * Left accent bar color — used to communicate trailer type or urgency.
   * Defaults to `--accent-dark` navy.
   */
  barColor?: string;
}

export interface UnassignedTrailerItemProps extends UnassignedTrailer {
  /** Whether the row appears selected */
  selected?: boolean;
  /** Hide the drag handle (e.g. when drag is disabled) */
  showDragHandle?: boolean;
  /** Called when the row is clicked */
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

// ── UnassignedTrailerItem ─────────────────────────────────────────────────────

/**
 * UnassignedTrailerItem
 *
 * A single draggable row in the Unassigned Trailer panel. Displays carrier
 * name, trailer number, and trailer ID. The row is draggable via HTML5 DnD —
 * on drag start it writes `application/x-unassigned-trailer` JSON so the
 * FacilityCanvas can accept it when dropped on a dock or yard space.
 *
 * Matches the unassigned-trailer list item design in the Enterprise Color
 * Tokens Figma file (node 116:20083).
 *
 * @example
 * ```tsx
 * <UnassignedTrailerItem
 *   id="ut-001"
 *   carrier="JB Hunt"
 *   trailerNumber="T-1234"
 *   trailerId="1234567890"
 *   barColor="#143c5c"
 *   onClick={() => selectTrailer('ut-001')}
 * />
 * ```
 */
export const UnassignedTrailerItem: React.FC<UnassignedTrailerItemProps> = ({
  id,
  carrier,
  trailerNumber,
  trailerId,
  barColor = 'var(--accent-dark, #143c5c)',
  selected = false,
  showDragHandle = true,
  onClick,
  className,
  style,
}) => {
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);

  const bg = selected
    ? 'var(--accent-subtle-bg, #e0eeff)'
    : hovered
      ? 'var(--surface-hover, rgba(255,255,255,0.9))'
      : 'var(--surface-card, rgba(255,255,255,0.75))';

  const borderColor = selected
    ? 'var(--accent-primary, #0a76db)'
    : 'var(--accent-border-light, #d3e4f2)';

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData(
      'application/x-unassigned-trailer',
      JSON.stringify({ id, carrier, trailerNumber, trailerId, barColor }),
    );
    // Fallback text for targets that only read text/plain
    e.dataTransfer.setData('text/plain', trailerNumber);
  };

  const handleDragEnd = () => setDragging(false);

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      onKeyDown={(e) => { if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick(); }}
      className={className}
      style={{
        display:        'flex',
        alignItems:     'stretch',
        gap:            10,
        padding:        '8.75px 8.75px 8.75px 8.75px',
        borderRadius:   8,
        border:         `0.75px solid ${borderColor}`,
        background:     bg,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        boxShadow: selected
          ? '0 0 0 1.5px var(--accent-primary, #0a76db), 0px 1px 2px rgba(0,0,0,0.05)'
          : '0px 1px 2px rgba(0,0,0,0.05)',
        cursor:      onClick ? 'pointer' : 'grab',
        opacity:     dragging ? 0.5 : 1,
        transition:  'background 0.12s, box-shadow 0.12s, border-color 0.12s, opacity 0.1s',
        userSelect:  'none',
        ...style,
      }}
    >
      {/* Left accent bar */}
      <div style={{ width: 6, borderRadius: 4, background: barColor, flexShrink: 0, alignSelf: 'stretch' }} />

      {/* Content */}
      <div style={{ flex: '1 0 0', display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, padding: '4px 0' }}>

        {/* Drag handle */}
        {showDragHandle && (
          <div style={{ display: 'flex', flexShrink: 0, color: 'var(--icon-muted, rgba(0,0,0,0.4))', cursor: 'grab' }}>
            <DraganddropDefaultIcon size={24} />
          </div>
        )}

        {/* Trailer icon */}
        <div style={{ flexShrink: 0, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-dark, #143c5c)' }}>
          <TrailerEmptyIcon size={24} />
        </div>

        {/* Text column */}
        <div style={{ flex: '1 0 0', display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
          <span style={{
            fontSize:     14,
            fontWeight:   600,
            lineHeight:   '18px',
            color:        'var(--text-primary, rgba(0,0,0,0.8))',
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            whiteSpace:   'nowrap',
          }}>
            {carrier}
          </span>
          <span style={{
            fontSize:     13,
            fontWeight:   400,
            lineHeight:   '17px',
            color:        'var(--text-secondary, #636363)',
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            whiteSpace:   'nowrap',
          }}>
            {trailerNumber}
          </span>
          <span style={{
            fontSize:     12,
            fontWeight:   400,
            lineHeight:   '16px',
            color:        'var(--text-muted, rgba(0,0,0,0.45))',
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            whiteSpace:   'nowrap',
          }}>
            ID# {trailerId}
          </span>
        </div>

        {/* Chevron right */}
        <div style={{ flexShrink: 0, color: 'var(--text-muted, rgba(0,0,0,0.35))' }}>
          <ChevronRight />
        </div>

      </div>
    </div>
  );
};

export default UnassignedTrailerItem;
