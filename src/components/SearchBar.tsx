import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { SearchDefaultIcon } from '@component-library/core';

// ── Chevron ───────────────────────────────────────────────────────────────────

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      aria-hidden="true"
      style={{
        display:    'block',
        flexShrink: 0,
        transition: 'transform 0.15s',
        transform:  open ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    >
      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SearchOption {
  /** Unique identifier */
  value: string;
  /** Label shown in the dropdown trigger and list */
  label: string;
  /**
   * Placeholder shown in the text input when this option is selected.
   * Falls back to `"Search by ${label}…"` if omitted.
   */
  placeholder?: string;
}

export interface SearchBarProps {
  /** Available search-type options shown in the left dropdown */
  options: SearchOption[];
  /** Initially selected option value (uncontrolled) */
  defaultOption?: string;
  /** Controlled selected option value */
  selectedOption?: string;
  /** Called when the selected option changes */
  onOptionChange?: (value: string) => void;
  /** Current search query (controlled) */
  value?: string;
  /** Called on every keystroke: (query, selectedOptionValue) */
  onChange?: (query: string, option: string) => void;
  /** Called when the user submits (Enter key or search icon click) */
  onSearch?: (query: string, option: string) => void;
  /** Disable the whole component */
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// ── Dropdown portal ───────────────────────────────────────────────────────────

interface TypeDropdownProps {
  options: SearchOption[];
  selectedValue: string;
  anchorRect: DOMRect;
  onSelect: (value: string) => void;
  onClose: () => void;
}

function TypeDropdown({ options, selectedValue, anchorRect, onSelect, onClose }: TypeDropdownProps) {
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const top   = anchorRect.bottom + 4 + window.scrollY;
  const left  = anchorRect.left;

  return createPortal(
    <div
      role="listbox"
      aria-label="Search type"
      style={{
        position:       'fixed',
        top,
        left,
        minWidth:       anchorRect.width,
        background:     'var(--surface-popover, rgba(255,255,255,0.95))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border:         '1px solid var(--accent-border-light, #d3e4f2)',
        borderRadius:   12,
        boxShadow:      '0px 4px 24px rgba(0,0,0,0.12)',
        padding:        '6px 0',
        zIndex:         9999,
        overflow:       'hidden',
      }}
    >
      {options.map((opt) => {
        const isSelected = opt.value === selectedValue;
        const isHovered  = opt.value === hoveredValue;
        return (
          <div
            key={opt.value}
            role="option"
            aria-selected={isSelected}
            onMouseEnter={() => setHoveredValue(opt.value)}
            onMouseLeave={() => setHoveredValue(null)}
            onMouseDown={(e) => {
              e.preventDefault(); // keep input focus
              onSelect(opt.value);
              onClose();
            }}
            style={{
              display:    'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap:        12,
              padding:    '8px 16px',
              cursor:     'pointer',
              background: isHovered ? 'var(--surface-row-hover, rgba(255,255,255,0.9))' : 'transparent',
              color:      isSelected
                ? 'var(--accent-primary, #0a76db)'
                : 'var(--text-primary, rgba(0,0,0,0.8))',
              fontSize:   14,
              fontWeight: isSelected ? 600 : 500,
              fontFamily: 'inherit',
              lineHeight: '20px',
              transition: 'background 0.1s',
            }}
          >
            {opt.label}
            {isSelected && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        );
      })}
    </div>,
    document.body,
  );
}

// ── SearchBar ─────────────────────────────────────────────────────────────────

/**
 * SearchBar
 *
 * A frosted-glass search input with a type-selector dropdown on the left.
 * Matches node 84:6448 ("search") in the Enterprise Color Tokens Figma file.
 *
 * - Left side: search icon + currently-selected type label + chevron.
 *   Clicking opens a portal dropdown to change the search type.
 * - Right side: a real `<input>` whose placeholder text updates automatically
 *   based on the selected type.
 * - Focus: the outer container border changes to `--accent-primary`.
 *
 * @example
 * ```tsx
 * const OPTIONS = [
 *   { value: 'carrier',  label: 'Carrier',  placeholder: 'Search by carrier name…' },
 *   { value: 'shipment', label: 'Shipment', placeholder: 'Search by shipment ID (min 3 chars)' },
 *   { value: 'dock',     label: 'Dock',     placeholder: 'Search by dock name or number…' },
 * ];
 *
 * <SearchBar
 *   options={OPTIONS}
 *   onChange={(query, type) => console.log(query, type)}
 *   onSearch={(query, type) => runSearch(query, type)}
 * />
 * ```
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  options,
  defaultOption,
  selectedOption: selectedOptionProp,
  onOptionChange,
  value: valueProp,
  onChange,
  onSearch,
  disabled = false,
  className,
  style,
}) => {
  const inputId = useId();

  // ── Option state (uncontrolled fallback) ─────────────────────────────────
  const firstValue = options[0]?.value ?? '';
  const [internalOption, setInternalOption] = useState(defaultOption ?? firstValue);
  const selectedValue = selectedOptionProp ?? internalOption;
  const selectedOpt   = options.find((o) => o.value === selectedValue) ?? options[0];

  const handleOptionSelect = (value: string) => {
    if (!selectedOptionProp) setInternalOption(value);
    onOptionChange?.(value);
    inputRef.current?.focus();
  };

  // ── Query state (uncontrolled fallback) ──────────────────────────────────
  const [internalQuery, setInternalQuery] = useState('');
  const query = valueProp ?? internalQuery;

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    if (valueProp === undefined) setInternalQuery(q);
    onChange?.(q, selectedValue);
  };

  // ── Dropdown state ───────────────────────────────────────────────────────
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [anchorRect,   setAnchorRect]   = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const rootRef    = useRef<HTMLDivElement>(null);

  const openDropdown = () => {
    if (disabled) return;
    setAnchorRect(triggerRef.current!.getBoundingClientRect());
    setDropdownOpen(true);
  };

  // Close on outside click
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
      setDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    if (dropdownOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [dropdownOpen, handleOutsideClick]);

  // ── Focus state ──────────────────────────────────────────────────────────
  const [focused, setFocused] = useState(false);

  // ── Placeholder ──────────────────────────────────────────────────────────
  const placeholder = selectedOpt?.placeholder ?? `Search by ${selectedOpt?.label ?? ''}…`;

  // ── Border colour ────────────────────────────────────────────────────────
  const borderColor = disabled
    ? 'var(--border-default, rgba(0,0,0,0.08))'
    : focused || dropdownOpen
      ? 'var(--accent-primary, #0a76db)'
      : 'var(--accent-border-light, #d3e4f2)';

  const boxShadow = focused || dropdownOpen
    ? '0 0 0 3px var(--accent-wash-30, rgba(10,118,219,0.12))'
    : 'none';

  return (
    <div
      ref={rootRef}
      className={className}
      style={{
        display:        'flex',
        alignItems:     'center',
        gap:            8,
        padding:        '9px 12px 10px 9px',
        borderRadius:   12,
        border:         `1px solid ${borderColor}`,
        boxShadow,
        background:     'var(--surface-elevated, rgba(255,255,255,0.5))',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition:     'border-color 0.15s, box-shadow 0.15s',
        opacity:        disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {/* ── Left: type-selector trigger ── */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={dropdownOpen}
        aria-controls={`${inputId}-dropdown`}
        onClick={openDropdown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        6,
          padding:    0,
          border:     'none',
          background: 'transparent',
          cursor:     disabled ? 'default' : 'pointer',
          color:      'var(--accent-dark, #143c5c)',
          fontFamily: 'inherit',
          fontSize:   14,
          fontWeight: 500,
          lineHeight: '20px',
          letterSpacing: '0.0066px',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}
      >
        <SearchDefaultIcon size={16} />
        <span>{selectedOpt?.label}</span>
        <Chevron open={dropdownOpen} />
      </button>

      {/* Divider */}
      <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--border-default, rgba(0,0,0,0.1))', flexShrink: 0 }} />

      {/* ── Right: text input ── */}
      <input
        ref={inputRef}
        id={inputId}
        type="search"
        value={query}
        disabled={disabled}
        placeholder={placeholder}
        onChange={handleQueryChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch?.(query, selectedValue);
          if (e.key === 'Escape') inputRef.current?.blur();
        }}
        style={{
          flex:        '1 0 0',
          minWidth:    0,
          border:      'none',
          outline:     'none',
          background:  'transparent',
          fontFamily:  'inherit',
          fontSize:    16,
          fontWeight:  500,
          fontStyle:   query ? 'normal' : 'italic',
          lineHeight:  '20px',
          letterSpacing: '0.0066px',
          color:       query
            ? 'var(--text-primary, rgba(0,0,0,0.8))'
            : 'var(--text-muted, rgba(0,0,0,0.35))',
          // Style the native placeholder
          // (done via CSS class below)
        }}
      />

      {/* ── Dropdown ── */}
      {dropdownOpen && anchorRect && (
        <TypeDropdown
          options={options}
          selectedValue={selectedValue}
          anchorRect={anchorRect}
          onSelect={handleOptionSelect}
          onClose={() => setDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;
