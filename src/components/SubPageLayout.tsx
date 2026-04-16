import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { SubNav } from '@component-library/core';
import type { SubNavItem } from '@component-library/core';
import { useBreakpoint } from '../hooks/useBreakpoint';

export interface SubPage {
  id:    string;
  label: string;
  path:  string;
}

interface SubPageLayoutProps {
  pages: SubPage[];
}

// ── Mobile-only 3rd-level nav (no selected row; trailing chevron) ─────────────

const MOBILE_SUB_NAV_WRAP: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  width: '100%',
  height: '100%',
  background: 'var(--surface-card)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  border: '0.75px solid var(--accent-border-light)',
  borderRadius: 16,
  boxShadow: '0px 1px 2px 0px var(--shadow-card)',
  flexShrink: 0,
  overflowY: 'auto',
  boxSizing: 'border-box',
};

function MobileSubNavList({
  items,
  onItemClick,
}: {
  items: SubNavItem[];
  onItemClick: (id: string) => void;
}) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  return (
    <nav aria-label="Sub navigation" style={MOBILE_SUB_NAV_WRAP}>
      {items.map((item) => {
        const hovered = hoverId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            disabled={item.disabled}
            onClick={() => !item.disabled && onItemClick(item.id)}
            onMouseEnter={() => setHoverId(item.id)}
            onMouseLeave={() => setHoverId(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              width: '100%',
              padding: '12px 16px',
              border: '1px solid transparent',
              borderBottom: '0.75px solid var(--accent-border-light)',
              borderRadius: 4,
              background:
                hovered && !item.disabled ? 'var(--accent-wash-4)' : 'transparent',
              cursor: item.disabled ? 'not-allowed' : 'pointer',
              opacity: item.disabled ? 0.4 : 1,
              transition: 'background 0.12s ease',
              fontFamily: 'var(--sds-typography-body-font-family, "Inter", sans-serif)',
              fontSize: 14,
              fontWeight: 500,
              lineHeight: '20px',
              color: 'var(--secondary, #6b6b6b)',
              textAlign: 'left',
              boxSizing: 'border-box',
            }}
          >
            <span style={{ flex: 1, minWidth: 0 }}>{item.label}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              style={{ flexShrink: 0, color: 'var(--secondary, #6b6b6b)' }}
            >
              <path
                d="M6 12L10 8L6 4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        );
      })}
    </nav>
  );
}

// ── Shared frosted card style ─────────────────────────────────────────────────

const FROSTED_CARD: React.CSSProperties = {
  flex:                 1,
  display:              'flex',
  flexDirection:        'column',
  minWidth:             0,
  minHeight:            0,
  background:           'var(--surface-card)',
  backdropFilter:       'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  border:               '1px solid var(--border-default)',
  borderRadius:         20,
  boxShadow:            '0px 2px 48px 0px var(--shadow-card)',
  overflow:             'hidden',
};

// ── Back button ───────────────────────────────────────────────────────────────

function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:        'flex',
        alignItems:     'center',
        gap:            8,
        padding:        '12px 16px',
        border:         '1px solid transparent',
        borderBottom:   '0.75px solid var(--accent-border-light)',
        borderRadius:   '4px 4px 0 0',
        background:     hovered ? 'var(--accent-wash-4)' : 'transparent',
        cursor:         'pointer',
        color:          'var(--secondary, #6b6b6b)',
        fontFamily:     'var(--sds-typography-body-font-family, "Inter", sans-serif)',
        fontSize:       14,
        fontWeight:     500,
        lineHeight:     '20px',
        flexShrink:     0,
        width:          '100%',
        textAlign:      'left',
        boxSizing:      'border-box',
        transition:     'background 0.12s ease',
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        style={{ flexShrink: 0, color: 'var(--secondary, #6b6b6b)' }}
      >
        <path
          d="M10 12L6 8L10 4"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </button>
  );
}

// ── SubPageLayout ─────────────────────────────────────────────────────────────

/**
 * SubPageLayout
 *
 * Desktop/tablet: two-column layout — [SubNav panel] | [Content card]
 *
 * Mobile: sliding master/detail —
 *   - Sub-nav fills the full width (master view)
 *   - Tapping an item slides the content panel in from the right (detail view)
 *   - A back button and a right-swipe gesture return to the master view
 *
 * Must be used with a route that has `handle: { noCard: true }` so that
 * SectionLayout does not wrap the outlet in its own card.
 */
export function SubPageLayout({ pages }: SubPageLayoutProps) {
  const navigate   = useNavigate();
  const location   = useLocation();
  const breakpoint = useBreakpoint();
  const isMobile   = breakpoint === 'mobile';

  const activeId    = pages.find((p) => location.pathname === p.path)?.id ?? '';
  const hasActivePage = activeId !== '';
  const activeLabel = pages.find((p) => p.id === activeId)?.label ?? '';
  const navItems: SubNavItem[] = pages.map((p) => ({ id: p.id, label: p.label }));

  // ── Mobile slide state ──────────────────────────────────────────────────────
  const [mobileView, setMobileView] = useState<'subnav' | 'content'>(
    hasActivePage ? 'content' : 'subnav',
  );

  // Measure the content area so the fixed portal can align to it
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [portalRect, setPortalRect] = useState<{ top: number; height: number } | null>(null);

  useLayoutEffect(() => {
    if (!isMobile || !sentinelRef.current) return;
    const r = sentinelRef.current.getBoundingClientRect();
    setPortalRect({ top: Math.round(r.top), height: Math.round(r.height) });
  }, [isMobile]);

  // Re-measure on resize (e.g. orientation change)
  useEffect(() => {
    if (!isMobile) return;
    const update = () => {
      if (!sentinelRef.current) return;
      const r = sentinelRef.current.getBoundingClientRect();
      setPortalRect({ top: Math.round(r.top), height: Math.round(r.height) });
    };
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [isMobile]);

  // Desktop: auto-redirect to the first sub-page when none is active
  useEffect(() => {
    if (isMobile) return;
    if (!hasActivePage && pages.length > 0) {
      navigate(pages[0].path, { replace: true });
    }
  }, [isMobile, hasActivePage, pages, navigate]);

  // Mobile: keep mobileView in sync when the URL changes externally
  useEffect(() => {
    if (!isMobile) return;
    setMobileView(pages.some((p) => location.pathname === p.path) ? 'content' : 'subnav');
  }, [location.pathname, isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Touch / swipe ───────────────────────────────────────────────────────────
  const touchStartX = useRef(0);
  const touchCurX   = useRef(0);
  const dragging    = useRef(false);
  const [dragPx, setDragPx] = useState(0);

  const onTouchStart = (e: React.TouchEvent) => {
    if (mobileView !== 'content') return;
    touchStartX.current = e.touches[0].clientX;
    touchCurX.current   = e.touches[0].clientX;
    dragging.current    = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current) return;
    touchCurX.current = e.touches[0].clientX;
    const delta = touchCurX.current - touchStartX.current;
    if (delta > 0) setDragPx(Math.min(delta, window.innerWidth));
  };

  const onTouchEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (dragPx > 80) setMobileView('subnav');
    setDragPx(0);
  };

  // ── Navigation helpers ──────────────────────────────────────────────────────
  const handleItemClick = (id: string) => {
    const page = pages.find((p) => p.id === id);
    if (!page) return;
    navigate(page.path);
    if (isMobile) setMobileView('content');
  };

  const handleBack = () => setMobileView('subnav');

  // ── Desktop / tablet: SubNav sidebar + content card ────────────────────────
  if (!isMobile) {
    return (
      <div style={{ display: 'flex', width: '100%', height: '100%', gap: 16, boxSizing: 'border-box' }}>
        <SubNav
          items={navItems}
          activeItem={activeId}
          onItemClick={handleItemClick}
          style={{ width: 'max-content', flexShrink: 0, alignSelf: 'flex-start' }}
        />
        {hasActivePage && (
          <div style={FROSTED_CARD}>
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}>
              <Outlet />
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Mobile: portaled full-viewport slide ────────────────────────────────────
  // A sentinel div stays in the normal flow so we can measure the content
  // area's top offset. The actual panels are portaled to document.body with
  // position:fixed so they escape every overflow:hidden ancestor and can slide
  // all the way to the real screen edges.
  const showContent  = mobileView === 'content';
  const slideEasing  = 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)';
  const subnavX      = showContent ? `calc(-100vw + ${dragPx}px)` : '0px';
  const contentX     = showContent ? `${dragPx}px`               : '100vw';

  const panelBase: React.CSSProperties = {
    position:   'absolute',
    top:        0,
    left:       0,
    width:      '100vw',
    height:     '100%',
    willChange: 'transform',
  };

  const mobilePad = 12; // matches SectionLayout mobile padding

  const portalContent = portalRect && createPortal(
    <div
      style={{
        position:   'fixed',
        top:        portalRect.top,
        left:       0,
        width:      '100vw',
        height:     portalRect.height,
        zIndex:     190,           // above main content, below TopNav (201)
        overflow:   'hidden',
        boxSizing:  'border-box',
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* SubNav panel — slides in/out from the left (custom list: no selected row, chevron-right) */}
      <div style={{ ...panelBase, transform: `translateX(${subnavX})`, transition: dragPx > 0 ? 'none' : slideEasing, padding: `0 ${mobilePad}px` }}>
        <MobileSubNavList items={navItems} onItemClick={handleItemClick} />
      </div>

      {/* Content panel — slides in/out from the right */}
      <div
        style={{
          ...panelBase,
          transform:     `translateX(${contentX})`,
          transition:    dragPx > 0 ? 'none' : slideEasing,
          display:       'flex',
          flexDirection: 'column',
          padding:       `0 ${mobilePad}px`,
        }}
      >
        <div style={{ ...FROSTED_CARD, flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
          <BackButton label={activeLabel} onClick={handleBack} />
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );

  return (
    <>
      {/* Sentinel: occupies the normal-flow space so the rest of the layout isn't affected */}
      <div ref={sentinelRef} style={{ width: '100%', height: '100%' }} />
      {portalContent}
    </>
  );
}

export default SubPageLayout;
