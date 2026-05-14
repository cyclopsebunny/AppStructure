import React from 'react';

// ── Status theming ────────────────────────────────────────────────────────────

/**
 * Each dock status maps to a fixed color theme derived from the Figma design
 * (node 101:17944, Enterprise Color Tokens file).
 */
export type DockStatus =
  | 'maintenance'        // gray header, gray tinted body
  | 'active'             // green header, white body
  | 'in-detention'       // orange header, white body
  | 'close-to-detention' // yellow header, white body
  | 'available'          // light gray header (prussian text), white body — no trailer assigned
  | 'offline'            // light gray header (muted text), gray body — dock offline
  | 'restraint-bypass'   // red header, red-tinted body
  | 'other';             // gray header (same as maintenance), gray tinted body

interface StatusTheme {
  headerBg:        string;
  headerTextColor: string;
  bodyBg:          string;
  cardBg:          string;
  /** Color used for the status label text */
  statusColor:     string;
  /** Optional override for the primary body/title text color */
  titleColor?:     string;
}

const STATUS_THEMES: Record<DockStatus, StatusTheme> = {
  'maintenance': {
    headerBg:       '#b0b0b0',
    headerTextColor:'#404040',
    bodyBg:         '#eaeaea',
    cardBg:         '#ffffff',
    statusColor:    '#6b6b6b',
  },
  'active': {
    headerBg:       '#43ac1d',
    headerTextColor:'#ffffff',
    bodyBg:         '#ffffff',
    cardBg:         '#ffffff',
    statusColor:    '#348516',
  },
  'in-detention': {
    headerBg:        '#dc7a09',
    headerTextColor: '#ffffff',
    bodyBg:          '#ffffff',
    cardBg:          '#ffffff',
    statusColor:     '#ac6008',
  },
  'close-to-detention': {
    headerBg:       '#fae366',
    headerTextColor:'#695900',
    bodyBg:         '#ffffff',
    cardBg:         '#ffffff',
    statusColor:    '#806c00',
  },
  'available': {
    headerBg:       '#eaeaea',
    headerTextColor:'#003b5c',
    bodyBg:         '#ffffff',
    cardBg:         '#ffffff',
    statusColor:    '#0078ab',
    titleColor:     '#0078ab',
  },
  'offline': {
    headerBg:       '#eaeaea',
    headerTextColor:'#909090',
    bodyBg:         '#f5f5f5',
    cardBg:         '#ffffff',
    statusColor:    '#9e2d08',
    titleColor:     '#909090',
  },
  'restraint-bypass': {
    headerBg:       '#d13b0b',
    headerTextColor:'#ffffff',
    bodyBg:         '#ffffff',
    cardBg:         '#f7dbd2',
    statusColor:    '#9e2d08',
  },
  'other': {
    headerBg:       '#b0b0b0',
    headerTextColor:'#404040',
    bodyBg:         '#eaeaea',
    cardBg:         '#ffffff',
    statusColor:    '#6b6b6b',
  },
};

// ── Props ─────────────────────────────────────────────────────────────────────

export interface DockItemProps {
  /**
   * Dock identifier displayed in the header, e.g. "C01", "D06".
   */
  id: string;
  /**
   * Status determines the header color and body tint. Drives all theming automatically.
   */
  status: DockStatus;
  /**
   * Primary body text — typically the company name, trailer label, or "Maintenance" / "Offline".
   * Long values are truncated to two lines.
   */
  title?: string;
  /**
   * Secondary reference — trailer number, BOL, or a note (e.g. "Note: McCain").
   * Displayed on a second line below `title`.
   */
  reference?: string;
  /**
   * Colored status label (e.g. "Truck at Dock", "In Detention", "Door Open").
   * Color is derived automatically from `status`.
   */
  statusLabel?: string;
  /**
   * Time or elapsed duration string (e.g. "1 hrs", "27 min in Detention").
   */
  time?: string;
  /**
   * When true, renders a 3px border in the status's header color to indicate
   * the item is selected. The same formula applies to every status type —
   * the border color is always derived from `headerBg` for that status.
   */
  selected?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS class on the root element */
  className?: string;
  /** Additional inline styles on the root element */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * DockItem
 *
 * A compact dock status card used in the dock operations grid view.
 * All visual theming is driven by the `status` prop — callers only need to
 * supply data, not colors.
 *
 * Matches the `dock item revised` Figma component (node 101:17960–17995
 * in the Enterprise Color Tokens file).
 *
 * @example
 * ```tsx
 * <DockItem
 *   id="C07"
 *   status="active"
 *   title="SAJACKS TRANS"
 *   reference="451138784778598"
 *   statusLabel="Truck at Dock"
 *   time="1 hrs"
 * />
 *
 * <DockItem
 *   id="C06"
 *   status="in-detention"
 *   title="CTS Transportation"
 *   reference="4511388854232"
 *   statusLabel="Door Closed"
 *   time="30 min in Detention"
 *   selected
 * />
 * ```
 */
export const DockItem: React.FC<DockItemProps> = ({
  id,
  status,
  title,
  reference,
  statusLabel,
  time,
  selected = false,
  onClick,
  className,
  style,
}) => {
  const theme = STATUS_THEMES[status];
  const titleColor    = theme.titleColor ?? '#191919';

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      style={{
        // Sizing — fluid width, fixed height
        display:    'flex',
        flexDirection: 'column',
        minWidth:   160,
        maxWidth:   170,
        flex:       '1 0 0',
        height:     136,
        overflow:   'hidden',
        background:    theme.cardBg,
        // Border stays 1px always — content never shifts.
        // The selection ring is drawn with outline, which renders outside the
        // layout box and has zero impact on padding, size, or content position.
        border:        `1px solid ${selected ? theme.headerBg : '#c7c9cb'}`,
        outline:       selected ? `2px solid ${theme.headerBg}` : 'none',
        outlineOffset: '0px',
        borderRadius:  4,
        cursor:       onClick ? 'pointer' : 'default',
        // Typography reset
        fontFamily: 'inherit',
        textAlign:  'left',
        padding:    0,
        ...style,
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display:       'flex',
          alignItems:    'center',
          gap:           8,
          height:        32,
          paddingLeft:   6,
          paddingRight:  8,
          paddingTop:    6,
          paddingBottom: 6,
          flexShrink:    0,
          width:         '100%',
          background:    theme.headerBg,
          overflow:      'hidden',
        }}
      >
        <span
          style={{
            flex:       '1 0 0',
            minWidth:   0,
            fontSize:   16,
            fontWeight: 700,
            lineHeight: '22px',
            color:      theme.headerTextColor,
            overflow:   'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {id}
        </span>
      </div>

      {/* ── Body ── */}
      <div
        style={{
          flex:          '1 0 0',
          display:       'flex',
          flexDirection: 'column',
          gap:           1,
          paddingTop:    4,
          paddingBottom: 4,
          paddingLeft:   8,
          paddingRight:  8,
          background:    theme.bodyBg,
          width:      '100%',
          minHeight:  0,
          overflow:   'hidden',
        }}
      >
        {/* Title / company name */}
        <div
          style={{
            flex:       '1 0 0',
            fontSize:   14,
            fontWeight: 400,
            lineHeight: '20px',
            color:      titleColor,
            overflow:   'hidden',
            display:    '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight:  0,
          }}
        >
          {title}
          {reference && (
            <>
              {title ? <br /> : null}
              {reference}
            </>
          )}
        </div>

        {/* Status label */}
        <span
          style={{
            flexShrink: 0,
            fontSize:   12,
            fontWeight: 500,
            lineHeight: '16px',
            color:      theme.statusColor,
            whiteSpace: 'nowrap',
            overflow:   'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {statusLabel ?? '\u200b'}
        </span>

        {/* Time */}
        <span
          style={{
            flexShrink: 0,
            fontSize:   12,
            fontWeight: 400,
            lineHeight: '16px',
            color:      '#6d6f72',
            whiteSpace: 'nowrap',
            overflow:   'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {time ?? '\u200b'}
        </span>
      </div>
    </button>
  );
};

export default DockItem;
