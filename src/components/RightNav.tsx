import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useBreakpoint } from '../hooks/useBreakpoint';
import type { AccentPreset } from '../utils/accentPalette';

// ── Figma SVG icons ───────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20.0002 20.0002" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8.125 0C12.6123 0 16.25 3.63769 16.25 8.125C16.25 10.0304 15.5932 11.7837 14.4951 13.1689L19.7256 18.3994C20.0917 18.7655 20.0917 19.3595 19.7256 19.7256C19.3595 20.0917 18.7655 20.0917 18.3994 19.7256L13.1689 14.4951C11.7837 15.5932 10.0304 16.25 8.125 16.25C3.63769 16.25 0 12.6123 0 8.125C0 3.63769 3.63769 0 8.125 0ZM8.125 1.875C4.67322 1.875 1.875 4.67322 1.875 8.125C1.875 11.5768 4.67322 14.375 8.125 14.375C9.85115 14.375 11.4119 13.676 12.5439 12.5439C13.676 11.4119 14.375 9.85115 14.375 8.125C14.375 4.67322 11.5768 1.875 8.125 1.875Z" fill="#94A3B8" />
    </svg>
  );
}

function SirenIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4.00173 19.0002H20.0017V17.0002H4.00173V19.0002ZM10.0017 10.0002C10.0017 9.45015 10.1976 8.97932 10.5892 8.58765C10.9809 8.19599 11.4517 8.00015 12.0017 8.00015C12.2851 8.00015 12.5226 7.90432 12.7142 7.71265C12.9059 7.52099 13.0017 7.28349 13.0017 7.00015C13.0017 6.71682 12.9059 6.47932 12.7142 6.28765C12.5226 6.09599 12.2851 6.00015 12.0017 6.00015C10.9017 6.00015 9.96006 6.39182 9.17673 7.17515C8.39339 7.95849 8.00173 8.90015 8.00173 10.0002V12.0002C8.00173 12.2835 8.09756 12.521 8.28923 12.7127C8.48089 12.9043 8.71839 13.0002 9.00173 13.0002C9.28506 13.0002 9.52256 12.9043 9.71423 12.7127C9.90589 12.521 10.0017 12.2835 10.0017 12.0002V10.0002ZM7.00173 15.0002H17.0017V10.0002C17.0017 8.61682 16.5142 7.43765 15.5392 6.46265C14.5642 5.48765 13.3851 5.00015 12.0017 5.00015C10.6184 5.00015 9.43923 5.48765 8.46423 6.46265C7.48923 7.43765 7.00173 8.61682 7.00173 10.0002V15.0002ZM4.00173 21.0002C3.45173 21.0002 2.98089 20.8043 2.58923 20.4127C2.19756 20.021 2.00173 19.5502 2.00173 19.0002V17.0002C2.00173 16.4502 2.19756 15.9793 2.58923 15.5877C2.98089 15.196 3.45173 15.0002 4.00173 15.0002H5.00173V10.0002C5.00173 8.05015 5.68089 6.39599 7.03923 5.03765C8.39756 3.67932 10.0517 3.00015 12.0017 3.00015C13.9517 3.00015 15.6059 3.67932 16.9642 5.03765C18.3226 6.39599 19.0017 8.05015 19.0017 10.0002V15.0002H20.0017C20.5517 15.0002 21.0226 15.196 21.4142 15.5877C21.8059 15.9793 22.0017 16.4502 22.0017 17.0002V19.0002C22.0017 19.5502 21.8059 20.021 21.4142 20.4127C21.0226 20.8043 20.5517 21.0002 20.0017 21.0002H4.00173Z" fill="#B35972" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 0C8.55228 0 9 0.537454 9 1.2002V7.05762H14.7998C15.4625 7.05762 16 7.50533 16 8.05762C16 8.6099 15.4625 9.05762 14.7998 9.05762H9V14.7998C9 15.4625 8.55228 16 8 16C7.44772 16 7 15.4625 7 14.7998V9.05762H1.2002C0.537454 9.05762 0 8.6099 0 8.05762C0 7.50533 0.537454 7.05762 1.2002 7.05762H7V1.2002C7 0.537454 7.44772 0 8 0Z" fill="#94A3B8" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 22.066 16.038" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M22.06 0.967C22.056 0.851 22.038 0.736 21.993 0.625L21.99 0.619C21.982 0.601 21.969 0.587 21.961 0.57C21.918 0.481 21.864 0.4 21.798 0.328C21.773 0.301 21.744 0.278 21.716 0.254C21.654 0.2 21.587 0.155 21.514 0.117C21.481 0.101 21.449 0.083 21.415 0.07C21.306 0.029 21.19 0 21.066 0H1C0.876 0 0.761 0.029 0.652 0.07C0.618 0.083 0.587 0.099 0.556 0.115C0.48 0.153 0.411 0.2 0.348 0.255C0.322 0.278 0.295 0.298 0.272 0.323C0.195 0.406 0.129 0.498 0.083 0.604L0.079 0.61L0.077 0.619C0.033 0.724 0.013 0.84 0.008 0.959C0.008 0.973 0 0.985 0 1V15.038C0 15.591 0.447 16.038 1 16.038H21.066C21.619 16.038 22.066 15.591 22.066 15.038V1C22.066 0.988 22.06 0.978 22.06 0.967ZM20.066 12.988L14.566 8.693L20.066 3.362V12.988ZM2 3.465L7.12 8.738L2 12.928V3.465ZM18.598 2L12.975 7.45L11.525 8.855L11.343 9.032C11.017 9.347 10.493 9.341 10.177 9.015L10.071 8.907L8.673 7.467L3.365 2L18.598 2ZM3.801 14.038L8.518 10.178L8.742 10.409C9.294 10.977 10.03 11.263 10.768 11.263C11.477 11.263 12.186 10.999 12.734 10.469L13.116 10.098L18.161 14.038H3.801Z" fill="#94A3B8" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="24" viewBox="0 0 18.2266 21.7256" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9.11426 0C9.66714 0.000138731 10.1143 0.447086 10.1143 1V1.80957C10.656 1.89165 11.1748 2.04038 11.6641 2.24414C11.1656 2.71948 10.765 3.29661 10.4961 3.94238C10.2809 3.87562 10.0588 3.82419 9.83105 3.78906C9.69009 3.78306 9.31218 3.76863 9.11914 3.76562H9.1084L9.06445 3.76465C8.9196 3.76465 8.53875 3.78205 8.39941 3.78906C6.13641 4.13706 4.43457 6.11425 4.43457 8.40625V10.6689C4.43457 12.5689 3.59958 14.3647 2.14258 15.5957C2.05363 15.6727 2 15.7892 2 15.9111C2.00007 16.143 2.188 16.332 2.41992 16.332H15.8076C16.0386 16.332 16.2265 16.1431 16.2266 15.9111C16.2266 15.7872 16.1732 15.6719 16.0742 15.5869C14.6304 14.3665 13.7988 12.5794 13.7939 10.6855C14.2146 10.8004 14.6572 10.8633 15.1143 10.8633C15.3463 10.8633 15.5743 10.845 15.7979 10.8145C15.8387 12.0703 16.4053 13.2489 17.3691 14.0635C17.9159 14.5315 18.2266 15.2033 18.2266 15.9111C18.2265 17.2461 17.1416 18.332 15.8076 18.332H12.9824C12.7214 20.2429 11.0961 21.7255 9.11426 21.7256C7.13327 21.7256 5.50709 20.243 5.24707 18.332H2.41992C1.086 18.332 0 17.246 0 15.9111C0 15.2053 0.308875 14.5352 0.845703 14.0742C1.8567 13.2182 2.43457 11.9789 2.43457 10.6689V8.40625C2.43457 5.12725 4.87426 2.30057 8.11426 1.80957V1C8.11426 0.447 8.56126 0 9.11426 0ZM7.27637 18.332C7.50741 19.134 8.2393 19.7256 9.11426 19.7256C9.99014 19.7255 10.7222 19.134 10.9521 18.332H7.27637ZM12.6201 2.73535C14.5333 3.92508 15.7939 6.04874 15.7939 8.40625V9.80469C15.573 9.84253 15.346 9.86327 15.1143 9.86328C14.6515 9.86328 14.2074 9.7832 13.7939 9.63867V8.40625C13.7939 6.69169 12.8418 5.15286 11.4141 4.34082C11.6748 3.70782 12.0929 3.15626 12.6201 2.73535Z" fill="#94A3B8" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M10 18.125C14.4873 18.125 18.125 14.4873 18.125 10C18.125 5.51269 14.4873 1.875 10 1.875C5.51269 1.875 1.875 5.51269 1.875 10C1.875 14.4873 5.51269 18.125 10 18.125ZM10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z" fill="#94A3B8" />
      <path d="M10.9375 15.9375C10.9375 16.4553 10.5178 16.875 10 16.875C9.48223 16.875 9.0625 16.4553 9.0625 15.9375C9.0625 15.4197 9.48223 15 10 15C10.5178 15 10.9375 15.4197 10.9375 15.9375Z" fill="#94A3B8" />
      <path fillRule="evenodd" clipRule="evenodd" d="M10 5C8.96447 5 8.125 5.83947 8.125 6.875C8.125 7.39277 7.70527 7.8125 7.1875 7.8125C6.66973 7.8125 6.25 7.39277 6.25 6.875C6.25 4.80393 7.92893 3.125 10 3.125C12.0711 3.125 13.75 4.80393 13.75 6.875C13.75 8.62318 12.5546 10.09 10.9375 10.5066V12.8125C10.9375 13.3303 10.5178 13.75 10 13.75C9.48223 13.75 9.0625 13.3303 9.0625 12.8125V10.3125C9.0625 9.41146 9.77592 8.84794 10.4143 8.70428C11.2508 8.51605 11.875 7.76731 11.875 6.875C11.875 5.83947 11.0355 5 10 5Z" fill="#94A3B8" />
    </svg>
  );
}

// ── User avatar + dropdown ────────────────────────────────────────────────────

interface UserMenuProps {
  size?: number;
  /** 'left' = opens to the left (desktop/tablet), 'below' = opens below (mobile) */
  placement?: 'left' | 'below';
}

const ACCOUNT_MENU_ITEMS = [
  { id: 'profile',  label: 'User Profile', path: '/account/profile' },
  { id: 'password', label: 'Password',     path: '/account/password' },
  { id: 'logout',   label: 'Log Out',      path: null },
] as const;

export function UserMenu({ size = 24, placement = 'left' }: UserMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  // left: { centerY, right }  |  below: { top, right }
  const [anchor, setAnchor] = useState<{ centerY?: number; top?: number; right: number } | null>(null);
  const [dropTop, setDropTop]     = useState(0);
  const [arrowTop, setArrowTop]   = useState<number>(0);
  const [dropVisible, setDropVisible] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const isSelected = location.pathname.startsWith('/account');

  const openMenu = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
        if (placement === 'below') {
          setAnchor({ top: rect.bottom + 12, right: window.innerWidth - rect.right - 4 });
        } else {
          setAnchor({ centerY: rect.top + rect.height / 2, right: window.innerWidth - rect.left + 24 });
        }
    }
    setDropVisible(false);
    setOpen(true);
  };

  // After the dropdown renders, compute final position
  useEffect(() => {
    if (!open || !dropRef.current || !anchor) return;
    const margin = 8;
    if (placement === 'below') {
      // Just clamp so it doesn't overflow the bottom
      const h = dropRef.current.offsetHeight;
      const top = Math.min(anchor.top!, window.innerHeight - h - margin);
      setDropTop(top);
      setArrowTop(0); // arrow is at the top for 'below'
    } else {
      // Clamp vertically and offset arrow to still point at button center
      const h       = dropRef.current.offsetHeight;
      const ideal   = anchor.centerY! - h / 2;
      const clamped = Math.max(margin, Math.min(window.innerHeight - h - margin, ideal));
      setDropTop(clamped);
      setArrowTop(anchor.centerY! - clamped);
    }
    setDropVisible(true);
  }, [open, anchor, placement]);

  // Close on outside click or scroll
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  const handleItemClick = (path: string | null) => {
    setOpen(false);
    if (path) navigate(path);
  };

  const menuItems = ACCOUNT_MENU_ITEMS.map((item) => {
    const isActive  = item.path && location.pathname === item.path;
    const isLogout  = item.id === 'logout';
    const isFocused = hoveredItem === item.id;
    return (
      <React.Fragment key={item.id}>
        {isLogout && (
          <div style={{ height: 1, background: '#e2e8f0', margin: '4px 8px' }} />
        )}
        <button
          type="button"
          role="menuitem"
          onClick={() => handleItemClick(item.path ?? null)}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          style={{
            display:      'block',
            width:        '100%',
            textAlign:    'left',
            padding:      '8px 12px',
            border:       'none',
            borderRadius: 8,
            background:   isActive ? 'var(--accent-primary)' : isFocused ? '#f1f5f9' : 'transparent',
            color:        isActive ? '#ffffff' : isLogout ? '#d9210b' : '#191919',
            fontFamily:   '"Inter", sans-serif',
            fontSize:     13,
            fontWeight:   isActive ? 600 : 400,
            cursor:       'pointer',
            transition:   'background 0.12s ease',
            whiteSpace:   'nowrap',
          }}
        >
          {item.label}
        </button>
      </React.Fragment>
    );
  });

  const dropdown = anchor && open && createPortal(
    <div
      ref={dropRef}
      role="menu"
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position:             'fixed',
        top:                  dropTop,
        right:                anchor.right,
        visibility:           dropVisible ? 'visible' : 'hidden',
        background:           'rgba(255,255,255,0.97)',
        backdropFilter:       'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border:               '0.75px solid var(--accent-border-light)',
        borderRadius:         12,
        boxShadow:            '0px 4px 20px rgba(149, 172, 188, 0.30)',
        minWidth:             164,
        padding:              '6px',
        zIndex:               9999,
        display:              'flex',
        flexDirection:        'column',
        gap:                  2,
      }}
    >
      {placement === 'left' ? (
        /* Tail points right, vertically offset to track the button */
        <div style={{
          position: 'absolute', right: -7, top: arrowTop, transform: 'translateY(-50%)',
          width: 0, height: 0,
          borderTop: '7px solid transparent', borderBottom: '7px solid transparent',
          borderLeft: '7px solid rgba(255,255,255,0.97)',
        }} />
      ) : (
        /* Tail points up, horizontally aligned to the button */
        <div style={{
          position: 'absolute', top: -7, right: 12,
          width: 0, height: 0,
          borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
          borderBottom: '7px solid rgba(255,255,255,0.97)',
        }} />
      )}
      {menuItems}
    </div>,
    document.body,
  );

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label="User menu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={openMenu}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width:        size,
          height:       size,
          borderRadius: '50%',
          border:       isSelected
            ? 'none'
            : `2px solid var(--accent-primary)`,
          background: isSelected
            ? 'var(--accent-primary)'
            : hovered ? 'var(--accent-wash-6)' : '#ffffff',
          color: isSelected
            ? '#ffffff'
            : 'var(--accent-primary)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontSize:       size * 0.43,
          fontWeight:     700,
          fontFamily:     '"Inter", sans-serif',
          flexShrink:     0,
          cursor:         'pointer',
          transition:     'background 0.15s ease',
          padding:        0,
        }}
      >
        U
      </button>
      {dropdown}
    </>
  );
}

// ── Bell with notification badge ──────────────────────────────────────────────

function BellWithBadge({ size = 24 }: { size?: number }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <BellIcon />
      {/* Red notification dot — top-right corner */}
      <div
        style={{
          position: 'absolute',
          top: 1,
          right: 1,
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: '#B35972',
          border: '1.5px solid #fff',
        }}
      />
    </div>
  );
}

// ── Icon button ───────────────────────────────────────────────────────────────

interface IconBtnProps {
  children: React.ReactNode;
  label: string;
  alert?: boolean;
  size?: number;
  onClick?: () => void;
}

function IconBtn({ children, label, alert = false, size = 40, onClick }: IconBtnProps) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: 'none',
        padding: 4,
        backgroundColor: hovered ? '#f2f5fa' : 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'background-color 0.15s ease',
      }}
    >
      <div
        style={{
          width: size - 8,
          height: size - 8,
          borderRadius: '50%',
          backgroundColor: alert ? '#ffecea' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </button>
  );
}

// ── Accent color picker ───────────────────────────────────────────────────────

function PaletteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10a1.5 1.5 0 0 0 1.5-1.5c0-.39-.15-.74-.4-1.01-.25-.26-.39-.61-.39-1a1.5 1.5 0 0 1 1.5-1.5H14c3.314 0 6-2.686 6-6 0-4.963-4.477-9-10-9ZM3.5 10a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
        fill="#94A3B8"
      />
    </svg>
  );
}

const HEX_RE = /^#[0-9a-f]{6}$/i;

function SwatchButton({ preset, isActive, onClick }: {
  preset: AccentPreset;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      aria-label={preset.label}
      title={preset.label}
      onClick={onClick}
      style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        border: isActive ? '2.5px solid #191919' : '2px solid transparent',
        background: preset.primary,
        cursor: 'pointer',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.12s ease',
        outline: 'none',
        boxShadow: isActive ? `0 0 0 2px #ffffff, 0 0 0 4px ${preset.primary}` : undefined,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.15)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {isActive && (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3 8L6.5 11.5L13 4.5"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

function AccentColorPicker({ size = 40 }: { size?: number }) {
  const { presets, activeIndex, setActiveIndex, updatePreset, resetPresets } = useTheme();
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ centerY: number; right: number } | null>(null);
  const [dropTop, setDropTop] = useState(0);
  const [arrowTop, setArrowTop] = useState(0);
  const [dropVisible, setDropVisible] = useState(false);
  const [hexDraft, setHexDraft] = useState('');
  const [resetHovered, setResetHovered] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const activePrimary = presets[activeIndex]?.primary ?? '#0a76db';

  const openPicker = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setAnchor({ centerY: rect.top + rect.height / 2, right: window.innerWidth - rect.left + 24 });
    }
    setHexDraft(presets[activeIndex]?.primary ?? '#0a76db');
    setDropVisible(false);
    setOpen(true);
  };

  useEffect(() => {
    if (!open || !dropRef.current || !anchor) return;
    const margin = 8;
    const h = dropRef.current.offsetHeight;
    const ideal = anchor.centerY - h / 2;
    const clamped = Math.max(margin, Math.min(window.innerHeight - h - margin, ideal));
    setDropTop(clamped);
    setArrowTop(anchor.centerY - clamped);
    setDropVisible(true);
  }, [open, anchor]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  // Keep hex draft in sync when active selection changes
  useEffect(() => {
    setHexDraft(activePrimary);
  }, [activePrimary]);

  const handleNativeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexDraft(val);
    updatePreset(activeIndex, val);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('#')) val = '#' + val;
    setHexDraft(val);
    if (HEX_RE.test(val)) {
      updatePreset(activeIndex, val);
    }
  };

  const dropdown = anchor && open && createPortal(
    <div
      ref={dropRef}
      role="menu"
      aria-label="Accent color"
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position:             'fixed',
        top:                  dropTop,
        right:                anchor.right,
        visibility:           dropVisible ? 'visible' : 'hidden',
        background:           'rgba(255,255,255,0.97)',
        backdropFilter:       'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border:               '0.75px solid var(--accent-border-light)',
        borderRadius:         12,
        boxShadow:            '0px 4px 20px rgba(149, 172, 188, 0.30)',
        padding:              '10px 12px',
        zIndex:               9999,
        display:              'flex',
        flexDirection:        'column',
        gap:                  10,
        width:                200,
      }}
    >
      {/* Arrow pointing right */}
      <div style={{
        position: 'absolute', right: -7, top: arrowTop, transform: 'translateY(-50%)',
        width: 0, height: 0,
        borderTop: '7px solid transparent', borderBottom: '7px solid transparent',
        borderLeft: '7px solid rgba(255,255,255,0.97)',
      }} />

      <div style={{
        fontFamily: '"Inter", sans-serif',
        fontSize: 11,
        fontWeight: 600,
        color: '#64748b',
        letterSpacing: '0.3px',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        Accent Color
      </div>

      {/* Swatch grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, justifyItems: 'center' }}>
        {presets.map((preset, i) => (
          <SwatchButton
            key={i}
            preset={preset}
            isActive={i === activeIndex}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: '#e2e8f0' }} />

      {/* Color editor */}
      <div style={{
        fontFamily: '"Inter", sans-serif',
        fontSize: 11,
        fontWeight: 600,
        color: '#64748b',
        letterSpacing: '0.3px',
        textTransform: 'uppercase',
      }}>
        Customize
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="color"
          value={HEX_RE.test(hexDraft) ? hexDraft : activePrimary}
          onChange={handleNativeColorChange}
          style={{
            width: 32,
            height: 32,
            border: '1.5px solid #e2e8f0',
            borderRadius: 6,
            padding: 2,
            cursor: 'pointer',
            flexShrink: 0,
            background: '#ffffff',
          }}
        />
        <input
          type="text"
          value={hexDraft}
          onChange={handleHexInputChange}
          maxLength={7}
          spellCheck={false}
          style={{
            flex: 1,
            minWidth: 0,
            fontFamily: '"Inter", monospace',
            fontSize: 13,
            fontWeight: 500,
            color: '#191919',
            padding: '5px 8px',
            border: `1.5px solid ${HEX_RE.test(hexDraft) ? '#e2e8f0' : '#f87171'}`,
            borderRadius: 6,
            outline: 'none',
            background: '#ffffff',
            transition: 'border-color 0.12s ease',
          }}
        />
      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={() => { resetPresets(); setHexDraft(presets[0]?.primary ?? '#0a76db'); }}
        onMouseEnter={() => setResetHovered(true)}
        onMouseLeave={() => setResetHovered(false)}
        style={{
          background: 'none',
          border: 'none',
          padding: '2px 0',
          fontFamily: '"Inter", sans-serif',
          fontSize: 11,
          fontWeight: 500,
          color: resetHovered ? '#191919' : '#94a3b8',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'color 0.12s ease',
        }}
      >
        Reset to defaults
      </button>
    </div>,
    document.body,
  );

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        title="Accent color"
        aria-label="Accent color"
        onClick={openPicker}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: 'none',
          padding: 4,
          backgroundColor: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <PaletteIcon />
      </button>
      {dropdown}
    </>
  );
}

// ── Icon sets per app type ────────────────────────────────────────────────────

function CommunityIcons({ size = 40 }: { size?: number }) {
  const navigate = useNavigate();
  return (
    <>
      <IconBtn label="Hold Open / Close Alert" alert size={size}>
        <SirenIcon />
      </IconBtn>
      <IconBtn label="Search" size={size}>
        <SearchIcon />
      </IconBtn>
      <IconBtn label="Add" size={size}>
        <PlusIcon />
      </IconBtn>
      <IconBtn label="Messages" size={size}>
        <MessageIcon />
      </IconBtn>
      <IconBtn label="Notifications" size={size} onClick={() => navigate('/settings/notifications')}>
        <BellWithBadge size={size - 16} />
      </IconBtn>
      <IconBtn label="Help" size={size}>
        <HelpIcon />
      </IconBtn>
      <AccentColorPicker size={size} />
    </>
  );
}

function EnterpriseIcons({ size = 40 }: { size?: number }) {
  const navigate = useNavigate();
  return (
    <>
      <IconBtn label="Notifications" size={size} onClick={() => navigate('/settings/notifications')}>
        <BellWithBadge size={size - 16} />
      </IconBtn>
      <IconBtn label="Help" size={size}>
        <HelpIcon />
      </IconBtn>
      <AccentColorPicker size={size} />
    </>
  );
}

// ── Vertical right nav (desktop + tablet) ─────────────────────────────────────

export function RightNav() {
  const { selectedLocation } = useAppContext();
  const breakpoint = useBreakpoint();
  const isCommunity = selectedLocation.appType === 'community';
  const isTablet = breakpoint === 'tablet';

  return (
    <aside
      aria-label="Quick actions"
      style={{
        width: 64,
        flexShrink: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderLeft: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: isTablet ? 28 : 36,
        gap: 24,
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      {/* User avatar + menu */}
      <UserMenu size={28} />

      {isCommunity ? <CommunityIcons /> : <EnterpriseIcons />}
    </aside>
  );
}

// ── Dropdown panel for mobile top bar ────────────────────────────────────────

export function RightNavMobileStrip({ isOpen }: { isOpen: boolean }) {
  const { selectedLocation } = useAppContext();
  const isCommunity = selectedLocation.appType === 'community';

  return (
    <div
      style={{
        position: 'fixed',
        top: 44,
        bottom: 0,
        right: 0,
        zIndex: 199,
        backgroundColor: '#ffffff',
        borderLeft: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 0',
        gap: 24,
        boxShadow: '-4px 0 16px rgba(0,0,0,0.08)',
        width: 56,
        overflowY: 'auto',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
      }}
    >
      {isCommunity ? <CommunityIcons size={36} /> : <EnterpriseIcons size={36} />}
    </div>
  );
}

export default RightNav;
