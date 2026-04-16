import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { LOCATIONS } from '../config/locations';
import { useAppContext } from '../context/AppContext';

/** Accent color for the selected location — driven by ThemeContext CSS vars */
const SELECTED_LOCATION_ACCENT = 'var(--accent-dark)';

interface LocationPickerProps {
  /** px distance from the left edge of the viewport to the right edge of the sidebar */
  offsetLeft: number;
  /** When true, renders as a full-width panel just below the mobile top bar */
  mobile?: boolean;
  /** Bounding rect of the trigger button — used on mobile to anchor below it */
  anchorRect?: DOMRect | null;
  onClose: () => void;
  /** Called with the selected location id; caller is responsible for navigation */
  onSelect?: (id: string) => void;
}

export function LocationPicker({ offsetLeft, mobile = false, anchorRect, onClose, onSelect }: LocationPickerProps) {
  const { selectedLocation, setSelectedLocationId } = useAppContext();
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    // Small delay so the same click that opened us doesn't immediately close us
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener('mousedown', handler);
    };
  }, [onClose]);

  const handleSelect = (id: string) => {
    setSelectedLocationId(id); // update context
    onSelect?.(id);            // caller handles navigation
    onClose();
  };

  return createPortal(
    <div
      ref={ref}
      role="menu"
      aria-label="Select location"
      style={{
        position: 'fixed',
        // Mobile with anchor: drop 8px below the button, aligned to its left edge
        // Mobile fallback: just below the top bar
        // Desktop/tablet: to the right of the sidebar, below the logo area
        top:  mobile ? (anchorRect ? anchorRect.bottom + 8 : 48) : 88,
        left: mobile ? (anchorRect ? Math.min(anchorRect.left, window.innerWidth - 252) : 12) : offsetLeft + 8,
        width: 240,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        border: '0.75px solid var(--accent-border-light)',
        borderRadius: 12,
        boxShadow: '0px 4px 20px rgba(149, 172, 188, 0.3)',
        padding: 6,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* Pointer arrow — border layer */}
      <div style={mobile && anchorRect ? {
        // Points up toward the button
        position: 'absolute', top: -9, left: 24,
        width: 0, height: 0,
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderBottom: '9px solid var(--accent-border-light)',
      } : !mobile ? {
        // Points left toward the sidebar
        position: 'absolute', top: 20, left: -9,
        width: 0, height: 0,
        borderTop: '8px solid transparent',
        borderBottom: '8px solid transparent',
        borderRight: '9px solid var(--accent-border-light)',
      } : undefined} />
      {/* Pointer arrow — fill layer (covers border to match background) */}
      <div style={mobile && anchorRect ? {
        position: 'absolute', top: -7, left: 25,
        width: 0, height: 0,
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        borderBottom: '8px solid rgba(255,255,255,0.95)',
      } : !mobile ? {
        position: 'absolute', top: 21, left: -7,
        width: 0, height: 0,
        borderTop: '7px solid transparent',
        borderBottom: '7px solid transparent',
        borderRight: '8px solid rgba(255,255,255,0.95)',
      } : undefined} />
      {LOCATIONS.map((loc) => {
        const isSelected = loc.id === selectedLocation.id;
        return (
          <button
            key={loc.id}
            role="menuitem"
            onClick={() => handleSelect(loc.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 10px',
              border: 'none',
              borderRadius: 8,
              backgroundColor: isSelected ? 'var(--accent-bg-selected)' : 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background-color 0.12s ease',
            }}
            onMouseEnter={(e) => {
              if (!isSelected)
                (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              if (!isSelected)
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: isSelected ? SELECTED_LOCATION_ACCENT : '#64748b',
              }}
            >
              {loc.icon}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: 13,
                  color: isSelected ? SELECTED_LOCATION_ACCENT : '#191919',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {loc.name}
              </div>
              <div
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 400,
                  fontSize: 11,
                  color: '#64748b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginTop: 1,
                }}
              >
                {loc.appType === 'enterprise' ? 'Enterprise' : 'Community'} · {loc.location}
              </div>
            </div>

            {/* Active checkmark */}
            {isSelected && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                style={{ flexShrink: 0 }}
              >
                <path
                  d="M3 8L6.5 11.5L13 4.5"
                  stroke={SELECTED_LOCATION_ACCENT}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        );
      })}
    </div>,
    document.body,
  );
}

export default LocationPicker;
