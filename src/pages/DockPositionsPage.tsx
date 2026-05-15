import React, { useState } from 'react';
import {
  FilterDefaultIcon,
  ReorderV3DefaultIcon,
  DockMgmtDockNumberIcon,
} from '@component-library/core';
import { FilterButtonBar } from '../components/FilterButtonBar';
import { DockItemGrid } from '../components/DockItemGrid';
import { SearchBar } from '../components/SearchBar';
import { IconButton } from '../components/IconButton';
import { Switch } from '../components/Switch';
import { MobileSlidePanel } from '../components/MobileSlidePanel';
import { useBreakpoint } from '../hooks/useBreakpoint';
import type { FilterButtonGroup } from '../components/FilterButtonBar';
import type { DockItemData } from '../components/DockItemGrid';
import type { DockStatus } from '../components/DockItem';

// ── Filter data ───────────────────────────────────────────────────────────────

const FILTER_GROUPS: FilterButtonGroup[] = [
  {
    id: 'dock-traffic',
    label: 'Dock Traffic',
    filters: [
      { id: 'available', label: 'Available',  count: 23, color: '#009cde' },
      { id: 'in-use',    label: 'In Use',     count: 28, color: '#43ac1d', textColor: '#348516' },
      { id: 'blocked',   label: 'Blocked',    count: 12, color: '#909090', textColor: '#6b6b6b' },
    ],
  },
  {
    id: 'efficiency',
    label: 'Efficiency',
    filters: [
      { id: 'in-detention',       label: 'In Detention',       count: 23, color: '#dc7a09' },
      { id: 'close-to-detention', label: 'Close to Detention', count: 28, color: '#fae366', textColor: '#695900' },
    ],
  },
  {
    id: 'safety',
    label: 'Safety',
    filters: [
      { id: 'restraint-bypass', label: 'Restraint Bypass', count: 23, color: '#d13b0b' },
    ],
  },
];

// ── Search options ────────────────────────────────────────────────────────────

const SEARCH_OPTIONS = [
  { value: 'dock',    label: 'Dock',    placeholder: 'Search by dock number…' },
  { value: 'carrier', label: 'Carrier', placeholder: 'Search by carrier name…' },
  { value: 'trailer', label: 'Trailer', placeholder: 'Search by trailer ID…' },
];

// ── Actions dropdown ──────────────────────────────────────────────────────────

const DOCK_ACTIONS = [
  { id: 'assign',      label: 'Assign Trailer'  },
  { id: 'checkout',    label: 'Checkout'         },
  { id: 'close',       label: 'Close Session'    },
  { id: 'maintenance', label: 'Set Maintenance', dividerBefore: true },
];

// ── Mock dock data ────────────────────────────────────────────────────────────

const MOCK_DOCKS: DockItemData[] = [
  { id: 'C01', status: 'active',             title: 'SAJACKS TRANS',       reference: '451138784778598', statusLabel: 'Truck at Dock',       time: '1 hrs'                },
  { id: 'C02', status: 'in-detention',       title: 'CTS Transportation',  reference: '4511388854232',   statusLabel: 'Door Closed',          time: '30 min in Detention'  },
  { id: 'C03', status: 'available',          statusLabel: 'Door Open'                                                                                                        },
  { id: 'C04', status: 'close-to-detention', title: 'Schneider',           reference: '71253489',        statusLabel: 'Truck at Dock',        time: '4 hrs 45 min'         },
  { id: 'C05', status: 'active',             title: 'Werner Enterprises',  reference: '891234567',       statusLabel: 'Loading',              time: '45 min'               },
  { id: 'C06', status: 'maintenance',        title: 'Maintenance',                                       statusLabel: 'Out of Service'                                      },
  { id: 'C07', status: 'active',             title: 'J.B. Hunt',           reference: '560912345',       statusLabel: 'Unloading',            time: '2 hrs 10 min'         },
  { id: 'C08', status: 'available',          statusLabel: 'Door Closed'                                                                                                     },
  { id: 'C09', status: 'active',             title: 'Old Dominion',        reference: '341298765',       statusLabel: 'Truck at Dock',        time: '55 min'               },
  { id: 'C10', status: 'in-detention',       title: 'XPO Logistics',       reference: '229876543',       statusLabel: 'Door Open',            time: '1 hr 20 min'          },
  { id: 'C11', status: 'restraint-bypass',   title: 'FedEx Freight',       reference: '118765432',       statusLabel: 'Bypass Active',        time: '15 min'               },
  { id: 'C12', status: 'active',             title: 'UPS Freight',         reference: '337654321',       statusLabel: 'Loading',              time: '1 hr 5 min'           },
  { id: 'C13', status: 'available',          statusLabel: 'Door Open'                                                                                                       },
  { id: 'C14', status: 'offline',            title: 'Offline',                                           statusLabel: 'Device Offline'                                      },
  { id: 'C15', status: 'active',             title: 'Estes Express',       reference: '456543210',       statusLabel: 'Truck at Dock',        time: '30 min'               },
  { id: 'C16', status: 'close-to-detention', title: 'SAIA Freight',        reference: '567432109',       statusLabel: 'Door Closed',          time: '4 hrs 55 min'         },
  { id: 'C17', status: 'active',             title: 'ABF Freight',         reference: '678321098',       statusLabel: 'Unloading',            time: '1 hr 40 min'          },
  { id: 'C18', status: 'available',          statusLabel: 'Door Closed'                                                                                                     },
  { id: 'C19', status: 'in-detention',       title: 'Averitt Express',     reference: '789210987',       statusLabel: 'Truck at Dock',        time: '2 hrs 15 min'         },
  { id: 'C20', status: 'active',             title: 'R+L Carriers',        reference: '890109876',       statusLabel: 'Loading',              time: '20 min'               },
  { id: 'C21', status: 'maintenance',        title: 'Maintenance',                                       statusLabel: 'Scheduled Service'                                   },
  { id: 'C22', status: 'active',             title: 'Dayton Freight',      reference: '901098765',       statusLabel: 'Truck at Dock',        time: '50 min'               },
  { id: 'C23', status: 'available',          statusLabel: 'Door Open'                                                                                                       },
  { id: 'C24', status: 'active',             title: 'Southeastern Freight', reference: '012987654',      statusLabel: 'Unloading',            time: '1 hr 25 min'          },
  { id: 'C25', status: 'close-to-detention', title: 'Forward Air',         reference: '123876543',       statusLabel: 'Door Closed',          time: '4 hrs 30 min'         },
  { id: 'C26', status: 'available',          statusLabel: 'Door Closed'                                                                                                     },
  { id: 'B01', status: 'active',             title: 'McLane Company',      reference: '234765432',       statusLabel: 'Loading',              time: '35 min'               },
  { id: 'B02', status: 'available',          statusLabel: 'Door Open'                                                                                                       },
  { id: 'B03', status: 'in-detention',       title: 'Cardinal Health',     reference: '345654321',       statusLabel: 'Truck at Dock',        time: '1 hr 50 min'          },
  { id: 'B04', status: 'active',             title: 'McKesson Corp',       reference: '456543210',       statusLabel: 'Unloading',            time: '1 hr 15 min'          },
  { id: 'B05', status: 'maintenance',        title: 'Maintenance',                                       statusLabel: 'Out of Service'                                      },
  { id: 'B06', status: 'available',          statusLabel: 'Door Closed'                                                                                                     },
  { id: 'B07', status: 'active',             title: 'Sysco Corporation',   reference: '567432109',       statusLabel: 'Loading',              time: '2 hrs'                },
  { id: 'B08', status: 'available',          statusLabel: 'Door Open'                                                                                                       },
  { id: 'B09', status: 'active',             title: 'Performance Food',    reference: '678321098',       statusLabel: 'Truck at Dock',        time: '40 min'               },
  { id: 'B10', status: 'offline',            title: 'Offline',                                           statusLabel: 'Device Offline'                                      },
  { id: 'B11', status: 'active',             title: 'US Foods',            reference: '789210987',       statusLabel: 'Unloading',            time: '1 hr 30 min'          },
  { id: 'B12', status: 'available',          statusLabel: 'Door Closed'                                                                                                     },
  { id: 'B13', status: 'active',             title: 'Gordon Food Service', reference: '890109876',       statusLabel: 'Loading',              time: '25 min'               },
];

// ── X close icon ──────────────────────────────────────────────────────────────

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

// ── Dock detail panel ─────────────────────────────────────────────────────────

interface DockDetailPanelProps {
  dock: DockItemData;
  onClose: () => void;
  /** When provided a chevron-left back button replaces the X close (mobile). */
  onBack?: () => void;
  style?: React.CSSProperties;
}

function DockDetailPanel({ dock, onClose, onBack, style }: DockDetailPanelProps) {
  const [actionsHovered, setActionsHovered] = useState(false);
  const [closeHovered,   setCloseHovered]   = useState(false);
  const [backHovered,    setBackHovered]     = useState(false);

  const titleText = dock.title
    ? `${dock.id} · ${dock.title}`
    : `Dock ${dock.id}`;

  // Derive a session start time label from the time field
  const sessionAge = dock.time ?? null;

  const directionLabel =
    dock.status === 'in-detention' || dock.status === 'close-to-detention'
      ? 'IB / DL'
      : dock.status === 'active'
        ? 'IB'
        : null;

  // Fake appointment time relative to "now"
  const appointmentTime = '08:30 AM';
  const scheduledDate   = 'May 15, 2026';

  return (
    <div
      style={{
        width:         426,
        flexShrink:    0,
        display:       'flex',
        flexDirection: 'column',
        background:    'var(--surface-card, rgba(255,255,255,0.75))',
        backdropFilter:       'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        border:        '1px solid var(--border-default, rgba(0,0,0,0.08))',
        borderRadius:  20,
        boxShadow:     '0px 2px 48px 0px var(--shadow-card, rgba(0,0,0,0.15))',
        overflow:      'hidden',
        ...style,
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display:      'flex',
          alignItems:   'center',
          gap:          4,
          padding:      '8px 8px 8px 0',
          height:       52,
          flexShrink:   0,
          borderBottom: '1px solid var(--border-default, rgba(0,0,0,0.08))',
        }}
      >
        {/* Back button (mobile) — replaces X close */}
        {onBack && (
          <button
            type="button"
            aria-label="Go back"
            onMouseEnter={() => setBackHovered(true)}
            onMouseLeave={() => setBackHovered(false)}
            onClick={onBack}
            style={{
              width:      36,
              height:     36,
              flexShrink: 0,
              border:     'none',
              background: backHovered ? 'var(--surface-hover, rgba(255,255,255,0.9))' : 'transparent',
              color:      'var(--text-secondary, rgba(0,0,0,0.6))',
              borderRadius: 10,
              cursor:     'pointer',
              display:    'flex',
              alignItems:     'center',
              justifyContent: 'center',
              transition: 'background 0.12s',
              marginLeft: 4,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Title */}
        <div
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        12,
            flex:       '1 0 0',
            minWidth:   0,
            paddingLeft: onBack ? 4 : 16,
          }}
        >
          <div
            style={{
              width:   24,
              height:  24,
              flexShrink: 0,
              display: 'flex',
              alignItems:     'center',
              justifyContent: 'center',
              color: 'var(--accent-dark, #143c5c)',
            }}
          >
            <DockMgmtDockNumberIcon size={24} />
          </div>
          <span
            style={{
              fontSize:     14,
              fontWeight:   500,
              lineHeight:   '24px',
              color:        'var(--accent-dark, #143c5c)',
              overflow:     'hidden',
              textOverflow: 'ellipsis',
              whiteSpace:   'nowrap',
              letterSpacing: '0.0066px',
            }}
          >
            {titleText}
          </span>
        </div>

        {/* Actions dropdown */}
        <div style={{ flexShrink: 0 }}>
          <IconButton
            label="Actions"
            items={DOCK_ACTIONS}
            onItemClick={() => {}}
          />
        </div>

        {/* X close — hidden on mobile when onBack is provided */}
        {!onBack && (
          <button
            type="button"
            aria-label="Close panel"
            onMouseEnter={() => setCloseHovered(true)}
            onMouseLeave={() => setCloseHovered(false)}
            onClick={onClose}
            style={{
              width:      36,
              height:     36,
              flexShrink: 0,
              border:     'none',
              background: closeHovered ? 'var(--surface-hover, rgba(255,255,255,0.9))' : 'transparent',
              color:      'var(--text-secondary, rgba(0,0,0,0.6))',
              borderRadius: 10,
              cursor:     'pointer',
              display:    'flex',
              alignItems:     'center',
              justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <XIcon />
          </button>
        )}
      </div>

      {/* ── Body ── */}
      <div
        style={{
          flex:      1,
          overflowY: 'auto',
          overflowX: 'hidden',
          minHeight: 0,
          padding:   16,
          display:   'flex',
          flexDirection: 'column',
          gap:       12,
        }}
      >
        {/* Status card */}
        <div
          style={{
            background:   'var(--surface-elevated, rgba(255,255,255,0.5))',
            border:       '1px solid var(--border-default, rgba(0,0,0,0.08))',
            borderRadius: 12,
            padding:      '12px 16px',
            display:      'flex',
            flexDirection: 'column',
            gap:          8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted, rgba(0,0,0,0.4))', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Status
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: getStatusColor(dock.status) }}>
              {dock.statusLabel ?? dock.status}
            </span>
          </div>
          {sessionAge && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted, rgba(0,0,0,0.4))', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Session Time
              </span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary, rgba(0,0,0,0.8))' }}>
                {sessionAge}
              </span>
            </div>
          )}
          {directionLabel && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted, rgba(0,0,0,0.4))', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Direction
              </span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary, rgba(0,0,0,0.8))' }}>
                {directionLabel}
              </span>
            </div>
          )}
        </div>

        {/* Appointment card */}
        {dock.title && (
          <div
            style={{
              background:   'var(--surface-elevated, rgba(255,255,255,0.5))',
              border:       '1px solid var(--border-default, rgba(0,0,0,0.08))',
              borderRadius: 12,
              padding:      '12px 16px',
              display:      'flex',
              flexDirection: 'column',
              gap:          8,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary, rgba(0,0,0,0.6))', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Appointment
            </span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted, rgba(0,0,0,0.4))', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Carrier
              </span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary, rgba(0,0,0,0.8))' }}>
                {dock.title}
              </span>
            </div>
            {dock.reference && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted, rgba(0,0,0,0.4))', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Reference
                </span>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary, rgba(0,0,0,0.8))', fontFamily: 'monospace' }}>
                  {dock.reference}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted, rgba(0,0,0,0.4))', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Scheduled
              </span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary, rgba(0,0,0,0.8))' }}>
                {scheduledDate} · {appointmentTime}
              </span>
            </div>
          </div>
        )}

        {/* Dock info card */}
        <div
          style={{
            background:   'var(--surface-elevated, rgba(255,255,255,0.5))',
            border:       '1px solid var(--border-default, rgba(0,0,0,0.08))',
            borderRadius: 12,
            padding:      '12px 16px',
            display:      'flex',
            flexDirection: 'column',
            gap:          8,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary, rgba(0,0,0,0.6))', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Dock Info
          </span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted, rgba(0,0,0,0.4))', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Dock ID
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary, rgba(0,0,0,0.8))' }}>
              {dock.id}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted, rgba(0,0,0,0.4))', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Group
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary, rgba(0,0,0,0.8))' }}>
              {dock.id.startsWith('C') ? 'Bottom Row' : 'Left Row'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted, rgba(0,0,0,0.4))', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Restraint
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, color: dock.status === 'restraint-bypass' ? '#d13b0b' : 'var(--text-primary, rgba(0,0,0,0.8))' }}>
              {dock.status === 'restraint-bypass' ? 'Bypassed' : 'Active'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: DockStatus): string {
  const map: Record<DockStatus, string> = {
    'active':             '#348516',
    'in-detention':       '#ac6008',
    'close-to-detention': '#806c00',
    'available':          '#0078ab',
    'maintenance':        '#6b6b6b',
    'offline':            '#9e2d08',
    'restraint-bypass':   '#9e2d08',
    'other':              '#6b6b6b',
  };
  return map[status] ?? 'var(--text-secondary)';
}

// ── DockMainColumn ────────────────────────────────────────────────────────────

function DockMainColumn({
  selectedDockId,
  onDockClick,
}: {
  selectedDockId: string | undefined;
  onDockClick: (id: string) => void;
}) {
  return (
    <div
      style={{
        flex:                 1,
        minWidth:             0,
        display:              'flex',
        flexDirection:        'column',
        gap:                  8,
        background:           'var(--surface-card, rgba(255,255,255,0.7))',
        backdropFilter:       'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        border:               '1px solid var(--border-default, rgba(0,0,0,0.08))',
        borderRadius:         16,
        boxShadow:            '0px 2px 48px 0px var(--shadow-card, rgba(0,0,0,0.15))',
        padding:              8,
        overflow:             'hidden',
      }}
    >
      {/* Search / filter toolbar */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <SearchBar
          options={SEARCH_OPTIONS}
          style={{ flex: 1, minWidth: 0, padding: '5px 12px 5px 9px' }}
        />
        <IconButton icon={<FilterDefaultIcon size={16} />} label="Filter" onClick={() => {}} />
        <IconButton icon={<ReorderV3DefaultIcon size={16} />} label="Sort" onClick={() => {}} />
      </div>

      {/* Dock frame — header bar + grid body */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Header bar */}
        <div
          style={{
            flexShrink:     0,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            paddingTop:     6,
            paddingBottom:  6,
            paddingLeft:    24,
            paddingRight:   24,
            background:     'var(--surface-card, rgba(255,255,255,0.75))',
            borderTop:      '1px solid var(--border-default, rgba(0,0,0,0.08))',
            borderLeft:     '1px solid var(--border-default, rgba(0,0,0,0.08))',
            borderRight:    '1px solid var(--border-default, rgba(0,0,0,0.08))',
            borderRadius:   '16px 16px 0 0',
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 700, lineHeight: '19px', color: 'var(--text-primary, rgba(0,0,0,0.8))', whiteSpace: 'nowrap' }}>
            All Docks
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
            <span style={{ fontSize: 16, fontWeight: 500, lineHeight: '20px', letterSpacing: '0.0066px', color: 'var(--text-primary, rgba(0,0,0,0.8))', whiteSpace: 'nowrap' }}>
              Zone View
            </span>
            <Switch defaultChecked={false} />
          </div>
        </div>

        {/* Grid body */}
        <div
          style={{
            flex:         1,
            overflowY:    'auto',
            overflowX:    'hidden',
            minHeight:    0,
            padding:      '12px 24px 24px',
            background:   'var(--surface-card, rgba(255,255,255,0.75))',
            borderBottom: '1px solid var(--border-default, rgba(0,0,0,0.08))',
            borderLeft:   '1px solid var(--border-default, rgba(0,0,0,0.08))',
            borderRight:  '1px solid var(--border-default, rgba(0,0,0,0.08))',
            borderRadius: '0 0 8px 8px',
          }}
        >
          <DockItemGrid
            items={MOCK_DOCKS.map((d) => ({ ...d, selected: d.id === selectedDockId }))}
            onItemClick={onDockClick}
          />
        </div>
      </div>
    </div>
  );
}

// ── DockPositionsPage ─────────────────────────────────────────────────────────

export function DockPositionsPage() {
  const [activeFilterIds, setActiveFilterIds] = useState<string[]>([]);
  const [selectedDockId,  setSelectedDockId]  = useState<string | undefined>();

  const breakpoint = useBreakpoint();
  const isMobile   = breakpoint === 'mobile';

  const selectedDock = selectedDockId
    ? MOCK_DOCKS.find((d) => d.id === selectedDockId) ?? null
    : null;

  const handleFilterClick = (id: string) => {
    setActiveFilterIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const handleDockClick = (id: string) => {
    setSelectedDockId((prev) => (prev === id ? undefined : id));
  };

  return (
    <div
      style={{
        flex:          1,
        display:       'flex',
        flexDirection: 'column',
        gap:           16,
        minHeight:     0,
        width:         '100%',
      }}
    >
      {/* ── Filter bar ────────────────────────────────────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          display:    'flex',
          alignItems: 'center',
          gap:        8,
        }}
      >
        <FilterButtonBar
          groups={FILTER_GROUPS}
          activeIds={activeFilterIds}
          onFilterClick={handleFilterClick}
          style={{ padding: 6, border: '1px solid transparent' }}
        />
      </div>

      {/* ── Main content row ──────────────────────────────────────────────── */}
      {isMobile ? (
        /* Mobile: MobileSlidePanel owns both the main column and detail panel.
           The sentinel fills this flex row; actual content lives in the portal. */
        <MobileSlidePanel
          open={!!selectedDock}
          onBack={() => setSelectedDockId(undefined)}
          main={<DockMainColumn selectedDockId={selectedDockId} onDockClick={handleDockClick} />}
          detail={selectedDock ? (
            <DockDetailPanel
              dock={selectedDock}
              onClose={() => setSelectedDockId(undefined)}
              onBack={() => setSelectedDockId(undefined)}
              style={{ width: '100%', flex: 1 }}
            />
          ) : undefined}
        />
      ) : (
        <div style={{ flex: 1, display: 'flex', gap: 16, minHeight: 0 }}>
          <DockMainColumn selectedDockId={selectedDockId} onDockClick={handleDockClick} />
          {selectedDock && (
            <DockDetailPanel
              dock={selectedDock}
              onClose={() => setSelectedDockId(undefined)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default DockPositionsPage;
