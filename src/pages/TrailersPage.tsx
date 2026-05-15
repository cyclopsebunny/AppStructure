import { useState, useEffect } from 'react';
import { PlusMinusPlusIcon, PalletFilledIcon } from '@component-library/core';
import { FacilityCanvas, getFacilityState, subscribeFacilityState, clearFacilitySelection, setSidePanelsVisible } from '../features/facility-canvas/FacilityCanvas';
import type { FacilityPublicState } from '../features/facility-canvas/FacilityCanvas';
import { FilterSetBar } from '../components/FilterSetBar';
import type { FilterSetData } from '../components/FilterSetBar';
import { IconButton } from '../components/IconButton';
import { ShipmentPanel } from '../components/ShipmentPanel';
import type { ShipmentItemData } from '../components/ShipmentPanel';
import { UnassignedTrailerPanel } from '../components/UnassignedTrailerPanel';

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

// ── TrailersPage ──────────────────────────────────────────────────────────────

export function TrailersPage() {
  const [selectedSetId,  setSelectedSetId]  = useState<string | undefined>();
  const [activeChipIds,  setActiveChipIds]  = useState<string[]>([]);
  const [openPanel, setOpenPanel]           = useState<OpenPanel>('trailers');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | undefined>();

  const [facilityState, setFacilityState] = useState<FacilityPublicState>(getFacilityState);

  useEffect(() => {
    // Sync in case FacilityCanvas's initial emit fired before this subscription was registered.
    setFacilityState(getFacilityState());
    return subscribeFacilityState(setFacilityState);
  }, []);

  const userWantsPanels = facilityState.sidePanelsVisible;
  const hasSelection    = facilityState.selectedTrailer != null;
  const showSidePanels  = facilityState.appMode === 'operations' && (userWantsPanels || hasSelection);

  const handleClosePanels = () => setSidePanelsVisible(false);

  const handleSetClick = (id: string) => {
    setSelectedSetId((prev) => {
      if (prev === id) return undefined;
      // Switching to a different set — clear chips from the outgoing set.
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

  const togglePanel = (panel: OpenPanel) => {
    setOpenPanel(panel);
  };

  return (
    <div
      style={{
        flex:          1,
        display:       'flex',
        flexDirection: 'column',
        gap:           12,
        minHeight:     0,
        width:         '100%',
      }}
    >
      {/* ── Filter bar — standalone row, not wrapped in the canvas card ──── */}
      <div
        style={{
          flexShrink: 0,
          display:    'flex',
          alignItems: 'center',
          gap:        8,
        }}
      >
        <FilterSetBar
          sets={FILTER_SETS}
          selectedSetId={selectedSetId}
          activeChipIds={activeChipIds}
          onSetClick={handleSetClick}
          onChipClick={handleChipClick}
        />
        <IconButton
          icon={<PlusMinusPlusIcon size={16} />}
          onClick={() => {}}
          aria-label="Add filter"
        />
      </div>

      {/* ── Main content row — canvas + stacked side panels ─────────────── */}
      <div
        style={{
          flex:      1,
          display:   'flex',
          gap:       16,
          minHeight: 0,
        }}
      >
        {/* Facility canvas — fills remaining horizontal space */}
        <div
          style={{
            flex:      1,
            minWidth:  0,
            minHeight: 0,
          }}
        >
          <FacilityCanvas />
        </div>

        {/* Stacked side panels — only visible in operations mode with a layout */}
        {showSidePanels && (
          <div
            style={{
              width:         426,
              flexShrink:    0,
              display:       'flex',
              flexDirection: 'column',
              gap:           8,
            }}
          >
            {/* Unassigned Trailers panel */}
            <UnassignedTrailerPanel
              items={facilityState.unassignedTrailers}
              externalSelectedTrailer={facilityState.selectedTrailer}
              onDeselect={clearFacilitySelection}
              onClose={handleClosePanels}
              collapsed={openPanel !== 'trailers'}
              onToggle={() => togglePanel('trailers')}
              width="100%"
            />

            {/* Shipments panel */}
            <ShipmentPanel
              title="Shipments"
              headerIcon={<PalletFilledIcon size={24} />}
              items={SHIPMENTS}
              selectedId={selectedShipmentId}
              onItemClick={(id) => setSelectedShipmentId(id)}
              onClose={handleClosePanels}
              collapsed={openPanel !== 'shipments'}
              onToggle={() => togglePanel('shipments')}
              width="100%"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TrailersPage;
