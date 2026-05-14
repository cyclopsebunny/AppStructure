import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

// ── Chevron SVG (inline — not in the icon library) ───────────────────────────

function ChevronDown({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path
        d="M2 4l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Dropdown item type ────────────────────────────────────────────────────────

export interface IconButtonItem {
  /** Unique identifier */
  id: string;
  /** Visible label */
  label: string;
  /** Optional leading icon */
  icon?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Render the label in danger/red color */
  destructive?: boolean;
  /** Render a divider line above this item */
  dividerBefore?: boolean;
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface IconButtonProps {
  /**
   * Visible label text. When omitted the button renders icon-only.
   */
  label?: string;
  /**
   * Leading icon element (16 × 16 recommended).
   * Rendered before the label.
   */
  icon?: React.ReactNode;
  /**
   * When provided, the button renders a trailing chevron and opens a dropdown
   * panel containing these items. Mutually exclusive with a plain `onClick`.
   */
  items?: IconButtonItem[];
  /**
   * Called when a dropdown item is selected. Receives the item's `id`.
   */
  onItemClick?: (id: string) => void;
  /**
   * Whether the button is in an active / selected state.
   * Applies accent background + border + text color.
   */
  active?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /**
   * Click handler for non-dropdown buttons.
   * Ignored when `items` is provided (the button toggles the dropdown instead).
   */
  onClick?: () => void;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles on the root element */
  style?: React.CSSProperties;
}

// ── Tokens ────────────────────────────────────────────────────────────────────

const T = {
  surface:       'var(--surface-elevated, rgba(255,255,255,0.5))',
  surfaceHover:  'var(--surface-hover, rgba(255,255,255,0.9))',
  surfaceActive: 'var(--accent-subtle-bg, #e0eeff)',
  border:        'var(--accent-border-light, #d3e4f2)',
  borderActive:  'var(--accent-primary, #0a76db)',
  text:          'var(--text-primary, #656565)',
  textActive:    'var(--accent-primary, #0a76db)',
  textDisabled:  'var(--text-muted, rgba(0,0,0,0.35))',
  popover:       'var(--surface-popover, rgba(255,255,255,0.95))',
  itemHover:     'var(--surface-row-hover, rgba(255,255,255,0.9))',
  danger:        'var(--text-danger, #d9210b)',
};

// ── Dropdown panel ────────────────────────────────────────────────────────────

interface DropdownPanelProps {
  items: IconButtonItem[];
  anchorRect: DOMRect;
  onItemClick?: (id: string) => void;
  onClose: () => void;
}

function DropdownPanel({ items, anchorRect, onItemClick, onClose }: DropdownPanelProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Position: align right edge of panel with right edge of anchor, open below
  const top   = anchorRect.bottom + 6 + window.scrollY;
  const right = window.innerWidth - anchorRect.right;

  const panel = (
    <div
      role="menu"
      style={{
        position:       'fixed',
        top,
        right,
        minWidth:       160,
        background:     T.popover,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border:         `1px solid ${T.border}`,
        borderRadius:   12,
        boxShadow:      '0px 4px 24px 0px rgba(0,0,0,0.12)',
        padding:        '6px 0',
        zIndex:         9999,
        overflow:       'hidden',
      }}
    >
      {items.map((item) => (
        <React.Fragment key={item.id}>
          {item.dividerBefore && (
            <div style={{ height: 1, background: 'var(--border-default, rgba(0,0,0,0.08))', margin: '4px 0' }} />
          )}
          <button
            type="button"
            role="menuitem"
            disabled={item.disabled}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => {
              if (item.disabled) return;
              onItemClick?.(item.id);
              onClose();
            }}
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        10,
              width:      '100%',
              padding:    '8px 16px',
              border:     'none',
              background: hoveredId === item.id && !item.disabled ? T.itemHover : 'transparent',
              color:      item.disabled ? T.textDisabled : item.destructive ? T.danger : T.text,
              fontSize:   14,
              fontWeight: 500,
              fontFamily: 'inherit',
              lineHeight: '20px',
              textAlign:  'left',
              cursor:     item.disabled ? 'default' : 'pointer',
              transition: 'background 0.1s',
            }}
          >
            {item.icon && (
              <span style={{ display: 'flex', flexShrink: 0, opacity: item.disabled ? 0.4 : 1 }}>
                {item.icon}
              </span>
            )}
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );

  return createPortal(panel, document.body);
}

// ── IconButton ────────────────────────────────────────────────────────────────

/**
 * IconButton
 *
 * A frosted-glass action button with an optional leading icon and an optional
 * dropdown panel. Covers three patterns from the Figma design:
 *
 * - **Icon + label** (e.g. "Filter", "Sort") — pass `icon` and `label`
 * - **Label + chevron dropdown** (e.g. "Actions ∨") — pass `label` and `items`
 * - **Icon only** — pass `icon` alone
 *
 * Hover, active (selected), and disabled states are all handled internally.
 *
 * Matches nodes 106:19959, 106:19970, 106:19982 in the Enterprise Color Tokens file.
 *
 * @example
 * ```tsx
 * // Plain icon+label button
 * <IconButton icon={<FilterDefaultIcon />} label="Filter" onClick={openFilter} />
 *
 * // Dropdown
 * <IconButton
 *   label="Actions"
 *   items={[
 *     { id: 'edit',   label: 'Edit' },
 *     { id: 'delete', label: 'Delete', destructive: true, dividerBefore: true },
 *   ]}
 *   onItemClick={(id) => handleAction(id)}
 * />
 * ```
 */
export const IconButton: React.FC<IconButtonProps> = ({
  label,
  icon,
  items,
  onItemClick,
  active = false,
  disabled = false,
  onClick,
  className,
  style,
}) => {
  const [hovered,      setHovered]      = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [anchorRect,   setAnchorRect]   = useState<DOMRect | null>(null);
  const rootRef = useRef<HTMLButtonElement>(null);

  const hasDropdown = Boolean(items?.length);

  // Close dropdown when clicking outside
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
      setDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [dropdownOpen, handleOutsideClick]);

  const isActive = active || dropdownOpen;

  const background = disabled
    ? T.surface
    : isActive
      ? T.surfaceActive
      : hovered
        ? T.surfaceHover
        : T.surface;

  const borderColor = isActive ? T.borderActive : T.border;
  const textColor   = disabled ? T.textDisabled : isActive ? T.textActive : T.text;

  const handleClick = () => {
    if (disabled) return;
    if (hasDropdown) {
      if (!dropdownOpen && rootRef.current) {
        setAnchorRect(rootRef.current.getBoundingClientRect());
      }
      setDropdownOpen((o) => !o);
    } else {
      onClick?.();
    }
  };

  return (
    <button
      ref={rootRef}
      type="button"
      disabled={disabled}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{
        // Layout
        position:      'relative',
        display:       'inline-flex',
        alignItems:    'center',
        justifyContent:'center',
        gap:           8,
        height:        36,
        padding:       '9px 17px',
        // Appearance
        background,
        border:        `1px solid ${borderColor}`,
        borderRadius:  12,
        cursor:        disabled ? 'default' : 'pointer',
        // Typography
        fontFamily:    'inherit',
        fontSize:      14,
        fontWeight:    500,
        lineHeight:    '24px',
        color:         textColor,
        letterSpacing: '0.0066px',
        whiteSpace:    'nowrap',
        // Transition
        transition:    'background 0.12s, border-color 0.12s, color 0.12s',
        ...style,
      }}
    >
      {/* Leading icon */}
      {icon && (
        <span style={{ display: 'flex', flexShrink: 0, width: 16, height: 16, alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.4 : 1 }}>
          {icon}
        </span>
      )}

      {/* Label */}
      {label && (
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
        </span>
      )}

      {/* Trailing chevron for dropdown */}
      {hasDropdown && (
        <span
          style={{
            display:    'flex',
            flexShrink: 0,
            transition: 'transform 0.15s',
            transform:  dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            opacity:    disabled ? 0.4 : 1,
          }}
        >
          <ChevronDown size={12} />
        </span>
      )}

      {/* Dropdown panel — rendered via portal to escape stacking contexts */}
      {hasDropdown && dropdownOpen && anchorRect && (
        <DropdownPanel
          items={items!}
          anchorRect={anchorRect}
          onItemClick={onItemClick}
          onClose={() => setDropdownOpen(false)}
        />
      )}
    </button>
  );
};

export default IconButton;
