import React, { useState, useRef, useEffect } from 'react';
import { TrailerFilledIcon } from '@component-library/core';
import { UnassignedTrailerItem } from './UnassignedTrailerItem';
import type { UnassignedTrailer } from './UnassignedTrailerItem';
import type { FacilitySelectedTrailer } from '../features/facility-canvas/FacilityCanvas';

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
      <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type { UnassignedTrailer };

export interface UnassignedTrailerItemData extends UnassignedTrailer {
  key?: string;
}

export interface UnassignedTrailerPanelProps {
  items?: UnassignedTrailerItemData[];
  /** Currently selected trailer ID from the list */
  selectedId?: string;
  /** Called when a list row is clicked */
  onItemClick?: (id: string) => void;
  /** Called when the user navigates back from the detail view */
  onDeselect?: () => void;
  /** Called when X button clicked — hides side panels entirely */
  onClose?: () => void;
  /**
   * If provided, the panel shows this trailer's details instead of the list.
   * Used to display a canvas-selected trailer without it being in the list.
   */
  externalSelectedTrailer?: FacilitySelectedTrailer | null;
  collapsed?: boolean;
  onToggle?: () => void;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

// ── Header ────────────────────────────────────────────────────────────────────

interface HeaderProps {
  count?: number;
  collapsed?: boolean;
  onToggle?: () => void;
  /** Called when X button is clicked — hides the side panels entirely */
  onClose?: () => void;
  showDivider?: boolean;
  isBackMode?: boolean;
  onBack?: () => void;
  style?: React.CSSProperties;
}

const ACTIONS = [
  { id: 'load',     label: 'Load Trailer'   },
  { id: 'assign',   label: 'Assign Trailer' },
  { id: 'checkout', label: 'Checkout'       },
  { id: 'edit',     label: 'Edit Trailer'   },
];

export const UnassignedTrailerPanelHeader: React.FC<HeaderProps> = ({
  count,
  collapsed = false,
  onToggle,
  onClose,
  showDivider = false,
  isBackMode = false,
  onBack,
  style,
}) => {
  const [chevronHovered, setChevronHovered] = useState(false);
  const [backHovered, setBackHovered]       = useState(false);
  const [actionsOpen, setActionsOpen]       = useState(false);
  const [actionsHovered, setActionsHovered] = useState(false);
  const actionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isBackMode) setBackHovered(false);
  }, [isBackMode]);

  useEffect(() => {
    if (!actionsOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) {
        setActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [actionsOpen]);

  const title = count !== undefined ? `Unassigned Trailer (${count})` : 'Unassigned Trailers';

  return (
    <div
      style={{
        display:       'flex',
        alignItems:    'center',
        gap:           4,
        padding:       '8px 8px 8px 0',
        height:        52,
        background:    'var(--surface-card, rgba(255,255,255,0.75))',
        borderRadius:  '12px 12px 0 0',
        borderBottom:  showDivider
          ? '1px solid var(--border-default, rgba(0,0,0,0.08))'
          : '1px solid transparent',
        flexShrink:    0,
        transition:    'border-color 0.15s',
        position:      'relative',
        ...style,
      }}
    >
      {/* Left: back button (detail mode) or static label (list mode) */}
      {isBackMode ? (
        <button
          type="button"
          onClick={onBack}
          onMouseMove={() => setBackHovered(true)}
          onMouseLeave={() => setBackHovered(false)}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            flex: '1 0 0', minWidth: 0,
            padding: '0 0 0 12px', height: '100%',
            border: 'none', background: backHovered ? 'var(--accent-wash-6, rgba(10,118,219,0.06))' : 'transparent',
            color: 'var(--accent-primary, #0a76db)',
            fontFamily: 'inherit', cursor: 'pointer',
            borderRadius: '8px 0 0 8px',
            transition: 'background 0.12s',
          }}
          aria-label="Back to trailer list"
        >
          <div style={{ width: 24, height: 24, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft />
          </div>
          <span style={{
            fontSize: 14, fontWeight: 500, lineHeight: '24px',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            Back
          </span>
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 0 0', minWidth: 0, paddingLeft: 16 }}>
          <div style={{ width: 24, height: 24, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-dark, #143c5c)' }}>
            <TrailerFilledIcon size={24} />
          </div>
          <span style={{
            fontSize: 16, fontWeight: 500, lineHeight: '19px',
            color: 'var(--accent-dark, #143c5c)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            letterSpacing: '0.0066px',
          }}>
            {title}
          </span>
        </div>
      )}

      {/* Actions dropdown — only in detail (back) mode */}
      {isBackMode && (
        <div ref={actionsRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setActionsOpen((v) => !v)}
            onMouseEnter={() => setActionsHovered(true)}
            onMouseLeave={() => setActionsHovered(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              height: 36, padding: '0 17px',
              border: '1px solid var(--accent-border-light, #d3e4f2)',
              borderRadius: 12,
              background: actionsHovered
                ? 'var(--accent-wash-6, rgba(10,118,219,0.06))'
                : 'var(--surface-card, rgba(255,255,255,0.75))',
              color: 'var(--accent-dark, #143c5c)',
              fontFamily: 'inherit', fontSize: 14, fontWeight: 500, lineHeight: '24px',
              cursor: 'pointer', transition: 'background 0.12s',
              whiteSpace: 'nowrap',
            }}
            aria-haspopup="true"
            aria-expanded={actionsOpen}
          >
            Actions
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
              style={{ display: 'block', flexShrink: 0, transition: 'transform 0.15s', transform: actionsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {actionsOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', right: 0,
              minWidth: 148,
              background: 'var(--surface-elevated, #fff)',
              border: '1px solid var(--accent-border-light, #d3e4f2)',
              borderRadius: 8,
              boxShadow: '0px 4px 16px rgba(0,0,0,0.12)',
              zIndex: 200,
              padding: '4px',
            }}>
              {ACTIONS.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => setActionsOpen(false)}
                  style={{
                    display: 'block', width: '100%',
                    padding: '7px 12px', textAlign: 'left',
                    border: 'none', borderRadius: 6, background: 'transparent',
                    fontFamily: 'inherit', fontSize: 13, fontWeight: 400,
                    color: 'var(--text-primary, rgba(0,0,0,0.8))',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-wash-6, rgba(10,118,219,0.06))'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Right: X when expanded (hides panels), chevron when collapsed */}
      {(() => {
        const showX = !collapsed && !!onClose;
        return (
          <button
            type="button"
            onClick={showX ? onClose : onToggle}
            onMouseEnter={() => setChevronHovered(true)}
            onMouseLeave={() => setChevronHovered(false)}
            disabled={showX ? false : !onToggle}
            style={{
              width: 32, height: 32, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', borderRadius: 8,
              background: chevronHovered ? 'var(--accent-wash-6, rgba(10,118,219,0.06))' : 'transparent',
              color: 'var(--accent-dark, #143c5c)',
              cursor: 'pointer',
              transition: 'background 0.12s', padding: 0, marginRight: 8,
            }}
            aria-label={showX ? 'Hide side panels' : collapsed ? 'Expand panel' : 'Collapse panel'}
          >
            {showX ? <XIcon /> : <ChevronDown collapsed={collapsed} />}
          </button>
        );
      })()}
    </div>
  );
};

// ── Detail view ───────────────────────────────────────────────────────────────

interface DetailRow { label: string; value: string | null | undefined }

function DetailField({ label, value }: DetailRow) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-muted, rgba(0,0,0,0.45))' }}>
        {label}
      </span>
      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary, rgba(0,0,0,0.8))' }}>
        {value || '—'}
      </span>
    </div>
  );
}

interface TrailerDetailViewProps {
  trailerNumber: string;
  carrierName: string;
  usdotNumber?: string;
  arrivalTime?: string;
  driverName?: string;
  driverPhone?: string;
  location?: string;
  status?: string;
  onBack: () => void;
}

function TrailerDetailView({
  trailerNumber, carrierName, usdotNumber, arrivalTime,
  driverName, driverPhone, location, status, onBack: _onBack,
}: TrailerDetailViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box', overflow: 'hidden', padding: '0 8px 8px 8px' }}>
      <div style={{
        flex: 1, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        background: 'var(--surface-elevated, rgba(255,255,255,0.5))',
        borderRadius: '16px 16px 8px 8px',
        border: '0.75px solid var(--accent-border-light, #d3e4f2)',
      }}>
        {/* Trailer identity */}
        <div style={{ padding: '16px 16px 14px', borderBottom: '1px solid var(--border-default, rgba(0,0,0,0.08))', flexShrink: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary, rgba(0,0,0,0.8))', marginBottom: 2 }}>
            {carrierName}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary, #636363)' }}>{trailerNumber}</div>
        </div>

        {/* Fields */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: 16,
          display: 'flex', flexDirection: 'column', gap: 14,
          scrollbarWidth: 'thin',
        }}>
          <DetailField label="Trailer #"    value={trailerNumber} />
          <DetailField label="Carrier"      value={carrierName} />
          <DetailField label="USDOT #"      value={usdotNumber} />
          {location && <DetailField label="Location" value={location} />}
          {status   && <DetailField label="Status"   value={status} />}
          {arrivalTime && <DetailField label="Arrival" value={arrivalTime} />}
          {driverName  && <DetailField label="Driver"  value={driverName} />}
          {driverPhone && <DetailField label="Phone"   value={driverPhone} />}
        </div>
      </div>
    </div>
  );
}

// ── UnassignedTrailerPanel ────────────────────────────────────────────────────

/**
 * UnassignedTrailerPanel
 *
 * Collapsible panel listing unassigned trailers. When a trailer is selected
 * (from the list or from the canvas via `externalSelectedTrailer`), the list
 * slides left and a detail view slides in from the right.
 *
 * Matches node 116:20083 in the Enterprise Color Tokens Figma file.
 */
export const UnassignedTrailerPanel: React.FC<UnassignedTrailerPanelProps> = ({
  items = [],
  selectedId,
  onItemClick,
  onDeselect,
  onClose,
  externalSelectedTrailer,
  collapsed: collapsedProp,
  onToggle: onToggleProp,
  width = 426,
  className,
  style,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [internalSelectedId, setInternalSelectedId] = useState<string | undefined>();
  const collapsed = collapsedProp ?? internalCollapsed;
  const onToggle  = onToggleProp ?? (() => setInternalCollapsed((v) => !v));

  const [scrolled, setScrolled] = useState(false);

  // Resolve the active selected trailer — external (canvas-selected) takes priority
  const activeSelectedId = selectedId ?? internalSelectedId;
  const listSelectedTrailer = activeSelectedId ? items.find((t) => t.id === activeSelectedId) : null;
  const showDetail = externalSelectedTrailer != null || listSelectedTrailer != null;

  const detailTrailer: TrailerDetailViewProps | null = externalSelectedTrailer
    ? {
        trailerNumber: externalSelectedTrailer.trailerNumber,
        carrierName:   externalSelectedTrailer.carrierName,
        usdotNumber:   externalSelectedTrailer.usdotNumber,
        arrivalTime:   externalSelectedTrailer.arrivalTime,
        driverName:    externalSelectedTrailer.driverName,
        driverPhone:   externalSelectedTrailer.driverPhone,
        location:      externalSelectedTrailer.location,
        status:        externalSelectedTrailer.status,
        onBack:        onDeselect ?? (() => {}),
      }
    : listSelectedTrailer
      ? {
          trailerNumber: listSelectedTrailer.trailerNumber,
          carrierName:   listSelectedTrailer.carrier,
          usdotNumber:   listSelectedTrailer.trailerId,
          onBack:        () => {
            setInternalSelectedId(undefined);
            onDeselect?.();
          },
        }
      : null;

  const handleListItemClick = (id: string) => {
    if (onItemClick) {
      onItemClick(id);
    } else {
      setInternalSelectedId(id);
    }
  };

  return (
    <div
      className={className}
      style={{
        width,
        display:       'flex',
        flexDirection: 'column',
        borderRadius:  12,
        overflow:      'hidden',
        boxShadow:     '0px 2px 48px 0px var(--shadow-card, rgba(0,0,0,0.15))',
        ...style,
      }}
    >
      <UnassignedTrailerPanelHeader
        count={items.length}
        collapsed={collapsed}
        onToggle={onToggle}
        onClose={onClose}
        showDivider={scrolled && !showDetail}
        isBackMode={showDetail}
        onBack={detailTrailer?.onBack ?? onDeselect}
      />

      {!collapsed && (
        /* Sliding viewport — one row wide, clips list vs detail */
        <div
          style={{
            flex:       '1 1 auto',
            overflow:   'hidden',
            position:   'relative',
            background: 'var(--surface-card, rgba(255,255,255,0.75))',
            backdropFilter:       'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          {/* Slide wrapper — translates based on showDetail */}
          <div
            style={{
              display:   'flex',
              width:     '200%',
              height:    '100%',
              transform: showDetail ? 'translateX(-50%)' : 'translateX(0)',
              transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* List pane (50% of wrapper = 100% of panel) */}
            <div
              style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
              <div
                onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 0)}
                style={{
                  flex: 1, overflowY: 'auto',
                  padding: '0 8px 8px 8px',
                  display: 'flex', flexDirection: 'column', gap: 4,
                  scrollbarWidth: 'thin',
                }}
              >
                {items.length === 0 ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                    No unassigned trailers
                  </div>
                ) : (
                  items.map((item) => (
                    <UnassignedTrailerItem
                      key={item.key ?? item.id}
                      {...item}
                      selected={item.id === activeSelectedId}
                      onClick={() => handleListItemClick(item.id)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Detail pane (50% of wrapper = 100% of panel) */}
            <div style={{ width: '50%', height: '100%', overflow: 'hidden' }}>
              {detailTrailer && <TrailerDetailView {...detailTrailer} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnassignedTrailerPanel;
