import React, { useState } from 'react';
import { PalletFilledIcon } from '@component-library/core';
import { ShipmentItem } from './ShipmentItem';
import type { ShipmentItemProps } from './ShipmentItem';

// ── Icons ─────────────────────────────────────────────────────────────────────

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDown({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      style={{
        display:         'block',
        flexShrink:      0,
        transition:      'transform 0.2s ease',
        transform:       collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
        transformOrigin: '50% 50%',
      }}
    >
      <path
        d="M5 7.5l5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

/** Data shape for a single item in the panel list */
export interface ShipmentItemData extends Omit<ShipmentItemProps, 'selected' | 'onClick'> {
  /** Unique key for React list rendering — defaults to `id` if not supplied */
  key?: string;
}

export interface ShipmentPanelProps {
  /** Panel heading text */
  title?: string;
  /** Leading icon in the header.  Defaults to a pallet SVG. */
  headerIcon?: React.ReactNode;
  /** List of shipment rows to display */
  items?: ShipmentItemData[];
  /** Currently selected shipment ID */
  selectedId?: string;
  /** Called when a row is clicked — e.g. navigate to shipment details. Does not change collapse state. */
  onItemClick?: (id: string) => void;
  /**
   * Whether the panel body is hidden.  Control this externally or leave
   * `onToggle` undefined to make the chevron non-functional (display only).
   */
  collapsed?: boolean;
  onToggle?: () => void;
  /** Called when the X button is clicked — hides side panels entirely */
  onClose?: () => void;
  /** Panel width.  Defaults to 426px to match the Figma frame. */
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
}


// ── ShipmentPanelHeader ───────────────────────────────────────────────────────

export interface ShipmentPanelHeaderProps {
  title?: string;
  icon?: React.ReactNode;
  collapsed?: boolean;
  onToggle?: () => void;
  /** Called when X button is clicked — hides the side panels entirely */
  onClose?: () => void;
  /**
   * When true, renders the bottom border that visually separates the header
   * from the body. Should only be true when the body has been scrolled — i.e.
   * content is hidden above the visible area.
   */
  showDivider?: boolean;
  /** Extra style on the root element */
  style?: React.CSSProperties;
}

/**
 * ShipmentPanelHeader
 *
 * The header bar at the top of the shipment side panel.  Matches node
 * 84:6767 ("Title") in the Enterprise Color Tokens Figma file.
 *
 * - Icon + title text on the left
 * - Collapse/expand chevron on the right: points **down** when expanded (collapse),
 *   **up** when collapsed (expand).
 * - `data-theme` aware: text uses `--accent-dark` so it recolors with
 *   the rest of the app when the accent is changed.
 *
 * Can be used standalone (e.g. as a section header inside a larger panel)
 * or composed inside `ShipmentPanel`.
 *
 * @example
 * ```tsx
 * <ShipmentPanelHeader title="Shipments" collapsed={false} onToggle={toggle} />
 * ```
 */
export const ShipmentPanelHeader: React.FC<ShipmentPanelHeaderProps> = ({
  title = 'Shipments',
  icon,
  collapsed = false,
  onToggle,
  onClose,
  showDivider = false,
  style,
}) => {
  const [hovered, setHovered] = useState(false);

  const showX = !collapsed && !!onClose;

  return (
    <div
      style={{
        display:       'flex',
        alignItems:    'center',
        gap:           12,
        padding:       '8px 8px 8px 16px',
        height:        52,
        background:    'var(--surface-card, rgba(255,255,255,0.75))',
        borderRadius:  '12px 12px 0 0',
        borderBottom:  showDivider
          ? '1px solid var(--border-default, rgba(0,0,0,0.08))'
          : '1px solid transparent',
        flexShrink:    0,
        transition:    'border-color 0.15s',
        ...style,
      }}
    >
      {/* Icon + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 0 0', minWidth: 0 }}>
        <div style={{ width: 24, height: 24, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-dark, #143c5c)' }}>
          {icon ?? <PalletFilledIcon size={24} />}
        </div>
        <span style={{
          fontSize:     16,
          fontWeight:   500,
          lineHeight:   '19px',
          color:        'var(--accent-dark, #143c5c)',
          overflow:     'hidden',
          textOverflow: 'ellipsis',
          whiteSpace:   'nowrap',
          letterSpacing: '0.0066px',
        }}>
          {title}
        </span>
      </div>

      {/* X (close all panels) when expanded, chevron when collapsed */}
      <button
        type="button"
        onClick={showX ? onClose : onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={showX ? false : !onToggle}
        style={{
          width:        32,
          height:       32,
          flexShrink:   0,
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          border:       'none',
          borderRadius: 8,
          background:   hovered ? 'var(--accent-wash-6, rgba(10,118,219,0.06))' : 'transparent',
          color:        'var(--accent-dark, #143c5c)',
          cursor:       'pointer',
          transition:   'background 0.12s',
          padding:      0,
          marginRight:  8,
        }}
        aria-label={showX ? 'Hide side panels' : collapsed ? 'Expand panel' : 'Collapse panel'}
      >
        {showX ? <XIcon /> : <ChevronDown collapsed={collapsed} />}
      </button>
    </div>
  );
};

// ── ShipmentPanel ─────────────────────────────────────────────────────────────

/**
 * ShipmentPanel
 *
 * A collapsible side-panel that renders a `ShipmentPanelHeader` above a
 * scrollable list of `ShipmentItem` rows.  Matches the "item details" frame
 * (node 84:6766) in the Enterprise Color Tokens Figma file.
 *
 * @example
 * ```tsx
 * <ShipmentPanel
 *   title="Shipments"
 *   items={shipments}
 *   selectedId={activeId}
 *   onItemClick={(id) => navigate(`/shipments/${id}`)}
 * />
 * ```
 */
export const ShipmentPanel: React.FC<ShipmentPanelProps> = ({
  title = 'Shipments',
  headerIcon,
  items = [],
  selectedId,
  onItemClick,
  collapsed: collapsedProp,
  onToggle: onToggleProp,
  onClose,
  width = 426,
  className,
  style,
}) => {
  // Uncontrolled collapse state when no external control is provided
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = collapsedProp ?? internalCollapsed;
  const onToggle  = onToggleProp ?? (() => setInternalCollapsed((v) => !v));

  // Show the header divider only when the body has been scrolled
  const [scrolled, setScrolled] = useState(false);
  const handleBodyScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrolled(e.currentTarget.scrollTop > 0);
  };

  return (
    <div
      className={className}
      style={{
        width,
        display:      'flex',
        flexDirection: 'column',
        borderRadius: 12,
        overflow:     'hidden',
        boxShadow:    '0px 2px 48px 0px var(--shadow-card, rgba(0,0,0,0.15))',
        ...style,
      }}
    >
      {/* Header */}
      <ShipmentPanelHeader
        title={title}
        icon={headerIcon}
        collapsed={collapsed}
        onToggle={onToggle}
        onClose={onClose}
        showDivider={scrolled}
      />

      {/* Body — hidden when collapsed */}
      {!collapsed && (
        <div
          onScroll={handleBodyScroll}
          style={{
            flex:       '1 1 auto',
            overflowY:  'auto',
            background: 'var(--surface-card, rgba(255,255,255,0.75))',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            padding:    '0 8px 8px 8px',
            display:    'flex',
            flexDirection: 'column',
            gap:        4,
            scrollbarWidth: 'thin',
          }}
        >
          {items.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No shipments to display
            </div>
          ) : (
            items.map((item) => (
              <ShipmentItem
                key={item.key ?? item.id}
                {...item}
                selected={item.id === selectedId}
                onClick={onItemClick ? () => onItemClick(item.id) : undefined}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ShipmentPanel;
