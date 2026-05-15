import React, { useState, useMemo } from 'react';

// ── Types (mirrors FacilityCanvas internals) ──────────────────────────────────

type SpaceVisualState =
  | 'default'
  | 'occupied'
  | 'move-task'
  | 'pull-task'
  | 'in-progress'
  | 'issue'
  | 'blocked';

export interface TrailerRow {
  key: string;
  trailerNumber: string;
  carrierName: string;
  usdotNumber: string;
  driverName: string;
  driverPhone: string;
  arrivalTime: string;
  groupName: string;
  slotLabel: string;
  locationType: 'dock' | 'yard';
  state: SpaceVisualState;
  isEmpty: boolean;
}

export interface TrailerListViewProps {
  rows: TrailerRow[];
  searchQuery?: string;
  searchField?: 'trailerNumber' | 'carrier' | 'usdot';
  selectedKey?: string;
  onRowClick?: (key: string) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATE_META: Record<SpaceVisualState, { label: string; color: string }> = {
  'default':     { label: 'Empty',       color: '#909090' },
  'occupied':    { label: 'Occupied',    color: '#43ac1d' },
  'move-task':   { label: 'Moving',      color: '#f59e0b' },
  'pull-task':   { label: 'Pulling Out', color: '#009cde' },
  'in-progress': { label: 'In Progress', color: '#009cde' },
  'issue':       { label: 'Issue',       color: '#dc7a09' },
  'blocked':     { label: 'Blocked',     color: '#d9210b' },
};

function formatArrival(iso: string): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return iso;
  }
}

// ── Column definitions ────────────────────────────────────────────────────────

interface ColDef {
  key: string;
  label: string;
  width: number;
  flex?: boolean;
}

const COLUMNS: ColDef[] = [
  { key: 'status',        label: 'Status',    width: 140 },
  { key: 'trailerNumber', label: 'Trailer #', width: 120 },
  { key: 'carrier',       label: 'Carrier',   width: 200 },
  { key: 'location',      label: 'Location',  width: 140 },
  { key: 'type',          label: 'Type',      width: 80  },
  { key: 'arrival',       label: 'Arrival',   width: 170 },
  { key: 'driver',        label: 'Driver',    width: 180, flex: true },
];

const MIN_TABLE_WIDTH = COLUMNS.reduce((sum, c) => sum + c.width, 0);

// ── Cell renderers ────────────────────────────────────────────────────────────

function StatusCell({ state }: { state: SpaceVisualState }) {
  const { label, color } = STATE_META[state] ?? STATE_META['default'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span>{label}</span>
    </div>
  );
}

// ── TrailerListView ───────────────────────────────────────────────────────────

export const TrailerListView: React.FC<TrailerListViewProps> = ({
  rows,
  searchQuery = '',
  searchField = 'trailerNumber',
  selectedKey,
  onRowClick,
}) => {
  const [sortKey, setSortKey]   = useState<string>('location');
  const [sortAsc, setSortAsc]   = useState(true);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 3) return rows;
    return rows.filter((r) => {
      switch (searchField) {
        case 'carrier':       return r.carrierName.toLowerCase().includes(q);
        case 'usdot':         return r.usdotNumber.toLowerCase().includes(q);
        case 'trailerNumber':
        default:              return r.trailerNumber.toLowerCase().includes(q);
      }
    });
  }, [rows, searchQuery, searchField]);

  const sorted = useMemo(() => {
    const dir = sortAsc ? 1 : -1;
    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case 'status':        return dir * a.state.localeCompare(b.state);
        case 'trailerNumber': return dir * a.trailerNumber.localeCompare(b.trailerNumber);
        case 'carrier':       return dir * a.carrierName.localeCompare(b.carrierName);
        case 'location':      return dir * (`${a.groupName} ${a.slotLabel}`).localeCompare(`${b.groupName} ${b.slotLabel}`);
        case 'type':          return dir * a.locationType.localeCompare(b.locationType);
        case 'arrival':       return dir * a.arrivalTime.localeCompare(b.arrivalTime);
        case 'driver':        return dir * a.driverName.localeCompare(b.driverName);
        default:              return 0;
      }
    });
  }, [filtered, sortKey, sortAsc]);

  const handleSort = (key: string) => {
    if (key === sortKey) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(true); }
  };

  // ── Shared cell sizing ──────────────────────────────────────────────────────

  const cellBase: React.CSSProperties = {
    display:        'flex',
    alignItems:     'center',
    flexShrink:     0,
    padding:        '0 16px',
    height:         '100%',
    fontSize:       14,
    boxSizing:      'border-box',
    overflow:       'hidden',
    whiteSpace:     'nowrap',
    textOverflow:   'ellipsis',
  };

  return (
    /*
     * Single overflow container so the sticky header scrolls horizontally
     * in sync with the body rows, while staying vertically fixed.
     */
    <div style={{
      flex:       1,
      overflow:   'auto',
      borderRadius: 'inherit',
    }}>
      <div style={{ minWidth: MIN_TABLE_WIDTH }}>

        {/* ── Column header ── */}
        <div style={{
          display:      'flex',
          alignItems:   'center',
          height:       48,
          background:   'var(--accent-subtle-bg, #dfedf9)',
          borderBottom: '1px solid #c7c9cb',
          position:     'sticky',
          top:          0,
          zIndex:       2,
        }}>
          {COLUMNS.map((col) => (
            <button
              key={col.key}
              type="button"
              onClick={() => handleSort(col.key)}
              style={{
                ...cellBase,
                width:      col.flex ? undefined : col.width,
                flex:       col.flex ? '1 1 0' : undefined,
                minWidth:   col.flex ? col.width : undefined,
                gap:        6,
                background: 'transparent',
                border:     'none',
                cursor:     'pointer',
                fontFamily: 'inherit',
                fontSize:   13,
                fontWeight: 600,
                color:      'var(--text-primary, #656565)',
                textAlign:  'left',
              }}
            >
              {col.label}
              {sortKey === col.key && (
                <span style={{ fontSize: 10, opacity: 0.6 }}>{sortAsc ? '▲' : '▼'}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Rows ── */}
        {sorted.length === 0 ? (
          <div style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            height:         120,
            fontSize:       14,
            color:          'var(--text-muted, #b9b9b9)',
          }}>
            No trailers found.
          </div>
        ) : (
          sorted.map((row, i) => {
            const isSelected = row.key === selectedKey;
            const isHovered  = hoveredKey === row.key;

            let bg: string;
            if (isSelected) {
              bg = 'var(--accent-subtle-bg, #dfedf9)';
            } else if (isHovered) {
              bg = 'var(--surface-row-hover, rgba(255,255,255,0.9))';
            } else {
              bg = i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)';
            }

            return (
              <div
                key={row.key}
                role="button"
                tabIndex={0}
                onClick={() => onRowClick?.(row.key)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onRowClick?.(row.key); }}
                onMouseEnter={() => setHoveredKey(row.key)}
                onMouseLeave={() => setHoveredKey(null)}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  height:       48,
                  background:   bg,
                  borderBottom: '1px solid var(--accent-border-light, #d3e4f2)',
                  borderLeft:   isSelected
                    ? '3px solid var(--accent-primary, #0a76db)'
                    : '3px solid transparent',
                  cursor:       onRowClick ? 'pointer' : 'default',
                  transition:   'background 0.1s, border-color 0.1s',
                  boxSizing:    'border-box',
                }}
              >
                <div style={{ ...cellBase, width: COLUMNS[0].width, paddingLeft: isSelected ? 13 : 16, color: 'var(--text-primary, #656565)', fontWeight: 500 }}>
                  <StatusCell state={row.state} />
                </div>
                <div style={{ ...cellBase, width: COLUMNS[1].width, fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary, #656565)' }}>
                  {row.trailerNumber || '—'}
                </div>
                <div style={{ ...cellBase, width: COLUMNS[2].width, color: 'var(--text-primary, #656565)' }}>
                  {row.carrierName || '—'}
                </div>
                <div style={{ ...cellBase, width: COLUMNS[3].width, color: 'var(--text-primary, #656565)' }}>
                  {row.groupName} · {row.slotLabel}
                </div>
                <div style={{ ...cellBase, width: COLUMNS[4].width, textTransform: 'capitalize', color: 'var(--text-primary, #656565)' }}>
                  {row.locationType}
                </div>
                <div style={{ ...cellBase, width: COLUMNS[5].width, fontSize: 13, color: 'var(--text-primary, #656565)' }}>
                  {formatArrival(row.arrivalTime)}
                </div>
                <div style={{ ...cellBase, flex: '1 1 0', minWidth: COLUMNS[6].width, color: 'var(--text-primary, #656565)' }}>
                  {row.driverName || '—'}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TrailerListView;
