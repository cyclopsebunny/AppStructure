import React, { useState, useEffect, useRef } from 'react';
import { PalletFilledIcon } from '@component-library/core';
import { FacilityCanvas, getFacilityState, subscribeFacilityState, clearFacilitySelection, setSidePanelsVisible } from '../features/facility-canvas/FacilityCanvas';
import type { FacilityPublicState } from '../features/facility-canvas/FacilityCanvas';
import { FilterSetBar } from '../components/FilterSetBar';
import type { FilterSetData } from '../components/FilterSetBar';
import { ShipmentPanel } from '../components/ShipmentPanel';
import type { ShipmentItemData } from '../components/ShipmentPanel';
import { UnassignedTrailerPanel } from '../components/UnassignedTrailerPanel';
import { MobileSlidePanel } from '../components/MobileSlidePanel';
import { useBreakpoint } from '../hooks/useBreakpoint';

// ── Filter data ───────────────────────────────────────────────────────────────

const FILTER_SETS: FilterSetData[] = [
  {
    id: 'trailer-status',
    label: 'Trailer Status',
    chips: [
      { id: 'in-yard',     label: 'In Yard',     count: 23, color: '#0a76db' },
      { id: 'at-dock',     label: 'At Dock',     count: 28, color: '#43ac1d', textColor: '#348516' },
      { id: 'checked-out', label: 'Checked Out', count: 12, color: '#909090', textColor: '#6b6b6b' },
    ],
  },
  {
    id: 'dock-fill',
    label: 'Dock Fill',
    chips: [
      { id: 'full',  label: 'Full',  count: 32, color: '#003b5c' },
      { id: 'empty', label: 'Empty', count: 27, color: '#d78207' },
    ],
  },
];

// ── Mock shipments (static) ───────────────────────────────────────────────────

const SHIPMENTS: ShipmentItemData[] = [
  { id: '010203040506', createdAt: 'Created 5/23/2024 08:12am', direction: 'IB / DL', barColor: '#009cde' },
  { id: '020304050607', createdAt: 'Created 5/23/2024 09:45am', direction: 'OB',      barColor: '#43ac1d' },
  { id: '030405060708', createdAt: 'Created 5/23/2024 10:00am', direction: 'IB',      barColor: '#dc7a09' },
  { id: '040506070809', createdAt: 'Created 5/23/2024 11:15am', direction: 'IB / DL', barColor: '#d13b0b' },
  { id: '050607080910', createdAt: 'Created 5/23/2024 12:00pm', direction: 'OB',      barColor: '#909090' },
  { id: '060708091011', createdAt: 'Created 5/23/2024 01:30pm', direction: 'IB',      barColor: '#009cde' },
  { id: '070809101112', createdAt: 'Created 5/23/2024 02:45pm', direction: 'IB / DL', barColor: '#43ac1d' },
];

// ── Panel accordion key ───────────────────────────────────────────────────────

type OpenPanel = 'trailers' | 'shipments';

// ── FacilityCanvasWrapper ─────────────────────────────────────────────────────

function FacilityCanvasWrapper() {
  return (
    <div style={{ flex: 1, minWidth: 0, minHeight: 0 }}>
      <FacilityCanvas />
    </div>
  );
}

// ── TrailersPage ──────────────────────────────────────────────────────────────

export function TrailersPage() {
  const [selectedSetId,  setSelectedSetId]  = useState<string | undefined>();
  const [activeChipIds,  setActiveChipIds]  = useState<string[]>([]);
  const [openPanel, setOpenPanel]           = useState<OpenPanel>('trailers');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | undefined>();

  const [facilityState, setFacilityState] = useState<FacilityPublicState>(getFacilityState);
  const [sidePanelWidth, setSidePanelWidth] = useState(426);
  const [isDragging,     setIsDragging]     = useState(false);
  const panelDragRef = useRef<{ startX: number; startWidth: number } | null>(null);

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

  useEffect(() => {
    setFacilityState(getFacilityState());
    return subscribeFacilityState(setFacilityState);
  }, []);

  const userWantsPanels = facilityState.sidePanelsVisible;
  const hasSelection    = facilityState.selectedTrailer != null;
  const showSidePanels  = !isMobile && facilityState.appMode === 'operations' && (userWantsPanels || hasSelection);

  const handleClosePanels = () => setSidePanelsVisible(false);

  const handleSetClick = (id: string) => {
    setSelectedSetId((prev) => {
      if (prev === id) return undefined;
      const outgoingSet = FILTER_SETS.find((s) => s.id === prev);
      if (outgoingSet) {
        const outgoingChipIds = new Set(outgoingSet.chips.map((c) => c.id));
        setActiveChipIds((chips) => chips.filter((c) => !outgoingChipIds.has(c)));
      }
      return id;
    });
  };

  const handleChipClick = (chipId: string) => {
    setActiveChipIds((prev) =>
      prev.includes(chipId) ? prev.filter((c) => c !== chipId) : [...prev, chipId],
    );
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
      {/* ── Filter bar ──────────────────────────────────────────────────────── */}
      <div style={{ flexShrink: 0 }}>
        <FilterSetBar
          sets={FILTER_SETS}
          selectedSetId={selectedSetId}
          activeChipIds={activeChipIds}
          onSetClick={handleSetClick}
          onChipClick={handleChipClick}
        />
      </div>

      {/* ── Main content row ─────────────────────────────────────────────────── */}
      {isMobile ? (
        /*
         * Mobile: MobileSlidePanel owns both the canvas and the detail panel.
         * The sentinel fills the flex row; both panels live in the portal and
         * animate together — canvas slides left, detail slides in from the right.
         */
        <MobileSlidePanel
          open={hasSelection}
          onBack={clearFacilitySelection}
          main={<FacilityCanvasWrapper />}
          detail={facilityState.selectedTrailer ? (
            <UnassignedTrailerPanel
              externalSelectedTrailer={facilityState.selectedTrailer}
              onDeselect={clearFacilitySelection}
              width="100%"
              style={{ flex: 1 }}
            />
          ) : undefined}
        />
      ) : (
        <div style={{ flex: 1, display: 'flex', gap: 0, minHeight: 0 }}>
          {/* Facility canvas */}
          <div style={{ flex: 1, minWidth: 0, minHeight: 0 }}>
            <FacilityCanvas />
          </div>

          {/* Animated panel wrapper — always rendered so it can slide in/out */}
          <div style={{
            width:      showSidePanels ? sidePanelWidth + 16 : 0,
            flexShrink: 0,
            overflow:   'hidden',
            display:    'flex',
            transition: isDragging ? 'none' : 'width 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            {/* Drag handle */}
            <div
              onMouseDown={handlePanelResizeStart}
              aria-hidden="true"
              style={{ width: 16, flexShrink: 0, cursor: 'col-resize', position: 'relative' }}
            >
              <div style={{
                position: 'absolute', inset: '0 5px',
                borderRadius: 2, transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.10)')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
              />
            </div>

            {/* Stacked side panels */}
            <div style={{
              width:         sidePanelWidth,
              flexShrink:    0,
              display:       'flex',
              flexDirection: 'column',
              gap:           8,
            }}>
              <UnassignedTrailerPanel
                items={facilityState.unassignedTrailers}
                externalSelectedTrailer={facilityState.selectedTrailer}
                onDeselect={clearFacilitySelection}
                onClose={handleClosePanels}
                collapsed={openPanel !== 'trailers'}
                onToggle={() => setOpenPanel('trailers')}
                width="100%"
              />
              <ShipmentPanel
                title="Shipments"
                headerIcon={<PalletFilledIcon size={24} />}
                items={SHIPMENTS}
                selectedId={selectedShipmentId}
                onItemClick={(id) => setSelectedShipmentId(id)}
                onClose={handleClosePanels}
                collapsed={openPanel !== 'shipments'}
                onToggle={() => setOpenPanel('shipments')}
                width="100%"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrailersPage;
