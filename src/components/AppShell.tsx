import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LeftNav, TopNav } from '@component-library/core';
import type { SideNavItem } from '@component-library/core';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useAppContext } from '../context/AppContext';
import { LOCATIONS } from '../config/locations';
import { ENTERPRISE_NAV_SECTIONS, COMMUNITY_NAV_SECTIONS } from '../config/nav';
import { RightNav, RightNavMobileStrip, UserMenu } from './RightNav';
import { LocationPicker } from './LocationPicker';

// ── Sidebar widths (must match the LeftNav component's sizing) ────────────────

const SIDEBAR_WIDTH_DESKTOP = 220;
const SIDEBAR_WIDTH_TABLET  = 84;

// ── Top bar padding per breakpoint ────────────────────────────────────────────

const TOP_BAR_PADDING_Y: Record<'desktop' | 'tablet' | 'mobile', number> = {
  desktop: 8,
  tablet:  6,
  mobile:  4,
};

// ── Mobile right-content: avatar + "more" toggle ──────────────────────────────

function MobileRightContent({
  moreOpen,
  onToggleMore,
}: {
  moreOpen: boolean;
  onToggleMore: () => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      <div style={{ padding: '6px 4px' }}>
        <UserMenu size={28} placement="below" />
      </div>

      <button
        type="button"
        aria-label={moreOpen ? 'Close actions' : 'Open actions'}
        aria-expanded={moreOpen}
        onClick={onToggleMore}
        style={{
          width: 40,
          height: 40,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: moreOpen
            ? 'var(--sds-color-background-brand-default, #0a76db)'
            : 'var(--sds-color-text-default-secondary, #999999)',
        }}
      >
        <svg width="4" height="18" viewBox="0 0 4 18" fill="currentColor" aria-hidden="true">
          <circle cx="2" cy="2" r="2" />
          <circle cx="2" cy="9" r="2" />
          <circle cx="2" cy="16" r="2" />
        </svg>
      </button>
    </div>
  );
}

// ── AppShell ──────────────────────────────────────────────────────────────────

export function AppShell() {
  const breakpoint = useBreakpoint();
  const navigate   = useNavigate();
  const routerLocation = useLocation();

  const { selectedLocation, navSections } = useAppContext();

  const [mobileMoreOpen,     setMobileMoreOpen]     = useState(false);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [locationAnchor,     setLocationAnchor]     = useState<DOMRect | null>(null);
  const [topNavOpen,         setTopNavOpen]          = useState(false);

  // Derive active section from current URL
  const activeSection =
    navSections.find((s) => routerLocation.pathname.startsWith(s.basePath))?.id ?? '';

  // Navigate to the first sub-route (or basePath for sections with no sub-routes)
  const handleNavClick = useCallback(
    (id: string) => {
      const section = navSections.find((s) => s.id === id);
      if (section) {
        if (section.subRoutes.length > 0) {
          navigate(section.subRoutes[0].path);
        } else {
          navigate(section.basePath);
        }
      }
      setMobileMoreOpen(false);
      setTopNavOpen(false);
    },
    [navSections, navigate],
  );

  // Navigate to the new app's first page after location selection
  const handleLocationSelect = useCallback(
    (id: string) => {
      setTopNavOpen(false);
      const loc = LOCATIONS.find((l) => l.id === id);
      if (!loc) return;
      const sections =
        loc.appType === 'community' ? COMMUNITY_NAV_SECTIONS : ENTERPRISE_NAV_SECTIONS;
      const first = sections[0];
      navigate(first.subRoutes.length > 0 ? first.subRoutes[0].path : first.basePath);
    },
    [navigate],
  );

  const isDesktop = breakpoint === 'desktop';
  const isTablet  = breakpoint === 'tablet';
  const isMobile  = breakpoint === 'mobile';

  const sidebarWidth = isDesktop ? SIDEBAR_WIDTH_DESKTOP : SIDEBAR_WIDTH_TABLET;

  // Nav items for the left/top nav
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navItems = navSections.map((section) => ({
    id:    section.id,
    label: section.label,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon:  React.createElement(section.icon) as any,
  })) as SideNavItem[];

  // Location prop passed to LeftNav / TopNav
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const locationProp = {
    name:     selectedLocation.name,
    location: selectedLocation.location,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon:     selectedLocation.icon as any,
    onClick:  () => setLocationPickerOpen((o) => !o),
  };

  return (
    <div
      style={{
        display:          'grid',
        gridTemplateRows: isMobile ? 'auto 1fr' : '1fr',
        height:           '100vh',
        width:            '100vw',
        overflow:         'hidden',
        fontFamily:       '"Inter", sans-serif',
        background:       'linear-gradient(200deg, #c4e4f5 0%, #f2fbff 100%)',
      }}
    >
      {/* ── Top bar — mobile only ─────────────────────────────────────────────── */}
      {isMobile && (
        <TopNav
          application={selectedLocation.appType}
          barPaddingY={TOP_BAR_PADDING_Y.mobile}
          navItems={navItems}
          activeItem={activeSection}
          onNavItemClick={handleNavClick}
          location={locationProp}
          onLocationClick={(rect) => { setLocationAnchor(rect); setLocationPickerOpen((o) => !o); }}
          open={topNavOpen}
          onOpenChange={setTopNavOpen}
          rightContent={
            <MobileRightContent
              moreOpen={mobileMoreOpen}
              onToggleMore={() => setMobileMoreOpen((o) => !o)}
            />
          }
        />
      )}

      {/* ── Content row — sidebar + main + right panel ───────────────────────── */}
      <div
        style={{
          display:       'flex',
          flexDirection: 'row',
          overflow:      'hidden',
          minHeight:     0,
        }}
      >
        {/* Desktop / Tablet: LeftNav sidebar */}
        {(isDesktop || isTablet) && (
          <LeftNav
            application={selectedLocation.appType}
            navItems={navItems}
            activeItem={activeSection}
            onNavItemClick={handleNavClick}
            location={locationProp}
            collapsed={isTablet}
            height="100%"
            style={isTablet ? { paddingTop: 20 } : undefined}
          />
        )}

        {/* Main content area */}
        <main
          style={{
            flex:          1,
            display:       'flex',
            flexDirection: 'column',
            overflow:      'hidden',
            minWidth:      0,
          }}
        >
          <Outlet />
        </main>

        {/* Desktop / Tablet: RightNav */}
        {(isDesktop || isTablet) && <RightNav />}
      </div>

      {/* ── Mobile-only overlays ─────────────────────────────────────────────── */}
      {isMobile && (
        <>
          <RightNavMobileStrip isOpen={mobileMoreOpen} />
          {mobileMoreOpen && (
            <div
              onClick={() => setMobileMoreOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 198 }}
            />
          )}
        </>
      )}

      {/* ── Location picker dropdown ─────────────────────────────────────────── */}
      {locationPickerOpen && (
        <LocationPicker
          offsetLeft={sidebarWidth}
          mobile={isMobile}
          anchorRect={locationAnchor}
          onClose={() => { setLocationPickerOpen(false); setLocationAnchor(null); }}
          onSelect={handleLocationSelect}
        />
      )}
    </div>
  );
}

export default AppShell;
