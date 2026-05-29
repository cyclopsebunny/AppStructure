import React, { useState, useRef, useEffect } from 'react';
import {
  FilterDefaultIcon,
  ReorderV3DefaultIcon,
} from '@component-library/core';
import { FilterButtonBar } from '../components/FilterButtonBar';
import { DockItemGrid } from '../components/DockItemGrid';
import { DockDetailPanel } from '../components/DockDetailPanel';
import { SearchBar } from '../components/SearchBar';
import { IconButton } from '../components/IconButton';
import { Switch } from '../components/Switch';
import { MobileSlidePanel } from '../components/MobileSlidePanel';
import { useBreakpoint } from '../hooks/useBreakpoint';
import type { FilterButtonGroup } from '../components/FilterButtonBar';
import type { DockItemData } from '../components/DockItemGrid';

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
  const [sidePanelWidth,  setSidePanelWidth]  = useState(426);
  const [isDragging,      setIsDragging]      = useState(false);
  const panelDragRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const selectedDock = selectedDockId
    ? MOCK_DOCKS.find((d) => d.id === selectedDockId) ?? null
    : null;

  // Keep the last selected dock alive during the panel close animation.
  const [frozenDock, setFrozenDock] = useState<typeof selectedDock>(selectedDock);
  const dockExitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (selectedDock) {
      if (dockExitTimer.current) { clearTimeout(dockExitTimer.current); dockExitTimer.current = null; }
      setFrozenDock(selectedDock);
    } else {
      dockExitTimer.current = setTimeout(() => setFrozenDock(null), 370);
    }
    return () => { if (dockExitTimer.current) clearTimeout(dockExitTimer.current); };
  }, [selectedDock]);

  const breakpoint = useBreakpoint();
  const isMobile   = breakpoint === 'mobile';

  const handlePanelResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    panelDragRef.current = { startX: e.clientX, startWidth: sidePanelWidth };
    const onMove = (ev: MouseEvent) => {
      if (!panelDragRef.current) return;
      const delta = panelDragRef.current.startX - ev.clientX;
      setSidePanelWidth(Math.min(700, Math.max(280, panelDragRef.current.startWidth + delta)));
    };
    const onUp = () => {
      setIsDragging(false);
      panelDragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

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
        <div style={{ flex: 1, display: 'flex', gap: 0, minHeight: 0 }}>
          <DockMainColumn selectedDockId={selectedDockId} onDockClick={handleDockClick} />
          {/* Animated panel wrapper — always rendered so it can slide in/out */}
          <div style={{
            width:      selectedDock ? sidePanelWidth + 16 : 0,
            flexShrink: 0,
            overflow:   'hidden',
            display:    'flex',
            transition: isDragging ? 'none' : 'width 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <div
              onMouseDown={handlePanelResizeStart}
              aria-hidden="true"
              style={{ width: 16, flexShrink: 0, cursor: 'col-resize', position: 'relative' }}
            >
              <div
                style={{ position: 'absolute', inset: '0 5px', borderRadius: 2, transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.10)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              />
            </div>
            {frozenDock && (
              <DockDetailPanel
                dock={frozenDock}
                onClose={() => setSelectedDockId(undefined)}
                style={{ width: sidePanelWidth, flexShrink: 0 }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DockPositionsPage;
