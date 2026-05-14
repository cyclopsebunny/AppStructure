import { FacilityCanvas } from '../features/facility-canvas/FacilityCanvas';

// ── Filter chip ───────────────────────────────────────────────────────────────
// Colors are intentionally hardcoded to match CT3's dock/yard state palette so
// the left-bar color on each chip aligns with the corresponding trailer slot
// color on the facility canvas.
//
//   In Yard      → yard-occupied (#009cde, CT3 teal)
//   At Dock      → dock-occupied / in-progress (#43ac1d, CT3 green)
//   Checked Out  → departed (neutral gray)
//   In 30        → arriving-soon (amber)
//   Empty        → unloaded / default (muted gray)

const FILTER_CHIPS: { label: string; count: number; color: string }[] = [
  { label: 'In Yard',     count: 23, color: '#009cde' },
  { label: 'At Dock',     count: 28, color: '#43ac1d' },
  { label: 'Checked Out', count: 12, color: '#a6a6a6' },
  { label: 'In 30',       count: 32, color: '#f59e0b' },
  { label: 'Empty',       count: 37, color: '#8b8b8b' },
];

function FilterChip({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div
      style={{
        display:     'flex',
        alignItems:  'stretch',
        height:       40,
        borderRadius: 8,
        border:      '1px solid var(--border-default)',
        background:  'var(--surface-elevated)',
        overflow:    'hidden',
        cursor:      'pointer',
        userSelect:  'none',
        flexShrink:   0,
      }}
    >
      {/* Colored left accent bar */}
      <div style={{ width: 6, background: color, flexShrink: 0 }} />

      {/* Label + count */}
      <div
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:         6,
          padding:    '0 10px 0 8px',
        }}
      >
        <span
          style={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            fontSize:   12,
            color:      'var(--text-secondary)',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily:  '"Inter", sans-serif',
            fontWeight:  700,
            fontSize:    12,
            color:       'var(--text-primary)',
            minWidth:    16,
            textAlign:   'right',
          }}
        >
          {count}
        </span>
      </div>
    </div>
  );
}

// ── TrailersPage ──────────────────────────────────────────────────────────────

export function TrailersPage() {
  return (
    <div
      style={{
        flex:          1,
        display:       'flex',
        flexDirection: 'column',
        minWidth:      0,
        minHeight:     0,
        height:        '100%',
        width:         '100%',
      }}
    >
      {/* Frosted glass card — mirrors SectionLayout's standard card style */}
      <div
        style={{
          flex:                 1,
          display:              'flex',
          flexDirection:        'column',
          minHeight:            0,
          background:           'var(--surface-card)',
          backdropFilter:       'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          border:               '1px solid var(--border-default)',
          borderRadius:          20,
          boxShadow:            '0px 2px 48px 0px var(--shadow-card)',
          overflow:             'hidden',
        }}
      >
        {/* ── Filter bar ─────────────────────────────────────────────────── */}
        <div
          style={{
            flexShrink:   0,
            display:      'flex',
            alignItems:   'center',
            gap:           6,
            padding:      '8px 16px',
            borderBottom: '1px solid var(--border-default)',
          }}
        >
          {FILTER_CHIPS.map((chip) => (
            <FilterChip key={chip.label} {...chip} />
          ))}

          <button
            type="button"
            aria-label="Add filter"
            style={{
              width:          32,
              height:         32,
              border:         '1px solid var(--border-default)',
              borderRadius:    6,
              background:     'transparent',
              cursor:         'pointer',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              color:          'var(--text-secondary)',
              fontSize:        18,
              lineHeight:      1,
              padding:         0,
              flexShrink:      0,
            }}
          >
            +
          </button>
        </div>

        {/* ── Facility canvas — fills remaining card height ───────────────── */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <FacilityCanvas />
        </div>
      </div>
    </div>
  );
}

export default TrailersPage;
