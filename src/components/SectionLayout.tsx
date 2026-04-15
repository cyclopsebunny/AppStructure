import { useNavigate, useLocation, useMatches, Outlet } from 'react-router-dom';
import { Tabs } from '@component-library/core';
import type { TabItem } from '@component-library/core';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useAppContext } from '../context/AppContext';
import { topTabGapPx } from '../constants/topTabGap';

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer({
  breakpoint,
  links,
}: {
  breakpoint: 'tablet' | 'mobile';
  links: string[];
}) {
  const isTablet = breakpoint === 'tablet';
  return (
    <div
      style={{
        borderTop:    '1px solid #e2e8f0',
        display:      'flex',
        alignItems:   'flex-end',
        justifyContent: 'space-between',
        gap:          16,
        paddingTop:   isTablet ? 4 : 17,
        paddingBottom: isTablet ? 0 : 8,
        paddingLeft:  isTablet ? 0 : 4,
        paddingRight: isTablet ? 0 : 4,
        flexShrink:   0,
      }}
    >
      <div
        style={{
          display:       'flex',
          flexWrap:      'wrap',
          gap:           '4px 16px',
          fontFamily:    '"Inter", sans-serif',
          fontWeight:    400,
          fontSize:      10,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          color:         '#64748b',
        }}
      >
        {links.map((link) => (
          <span key={link}>{link}</span>
        ))}
      </div>
      <span
        style={{
          fontFamily:    '"Inter", sans-serif',
          fontWeight:    400,
          fontSize:      10,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          color:         '#64748b',
          whiteSpace:    'nowrap',
          flexShrink:    0,
        }}
      >
        © 2026 LiftMaster
      </span>
    </div>
  );
}

// ── Section layout ────────────────────────────────────────────────────────────

/**
 * SectionLayout derives which section to render from the AppContext + current
 * URL pathname, so the tabs always reflect the active app type (enterprise vs
 * community) without requiring a `section` prop from the router.
 */
export function SectionLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const breakpoint = useBreakpoint();
  const { navSections, footerLinks } = useAppContext();

  // Find the section whose basePath matches the current URL
  const section = navSections.find((s) =>
    location.pathname.startsWith(s.basePath),
  );

  const matches   = useMatches();
  // When the deepest matched route sets handle.noCard, the outlet manages its
  // own card styling (e.g. SubPageLayout with a two-column sub-nav layout).
  const noCard    = matches.some((m) => (m.handle as { noCard?: boolean } | null)?.noCard);

  const isDesktop = breakpoint === 'desktop';
  const isMobile  = breakpoint === 'mobile';

  const pad = isDesktop ? 24 : isMobile ? 12 : 16;
  const gap = isDesktop ? 16 : 12;

  // If the current path isn't in this app's nav (e.g. visiting an enterprise-
  // only route while in community mode) just render children with no decoration.
  if (!section) {
    return (
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <Outlet />
      </div>
    );
  }

  const hasTabs   = section.subRoutes.length > 0;
  const tabs: TabItem[] = section.subRoutes.map((r) => ({ id: r.id, label: r.label }));

  // Match Settings (and other) tabs when the URL is a nested route, e.g.
  // /settings/billing/plans → Billing, not the first tab (Facility).
  const subRoutesMatchingPath = section.subRoutes.filter(
    (r) =>
      location.pathname === r.path || location.pathname.startsWith(`${r.path}/`),
  );
  const activeTab =
    (subRoutesMatchingPath.length > 0
      ? subRoutesMatchingPath.reduce((a, b) => (a.path.length >= b.path.length ? a : b))
      : undefined
    )?.id ?? (hasTabs ? section.subRoutes[0].id : '');

  const handleTabChange = (id: string) => {
    const route = section.subRoutes.find((r) => r.id === id);
    if (route) navigate(route.path);
  };

  return (
    <div
      style={{
        display:       'flex',
        flexDirection: 'column',
        height:        '100%',
        padding:       isMobile ? `0 ${pad}px` : pad,
        gap,
        boxSizing:     'border-box',
        overflow:      'hidden',
      }}
    >
      {/* ── Tabs bar (frosted glass pill) — only when section has sub-routes ── */}
      {hasTabs && (
        <div
          style={{
            overflowX:       'auto',
            overflowY:       'visible',
            flexShrink:      0,
            msOverflowStyle: 'none',
            scrollbarWidth:  'none',
            paddingTop:      isMobile ? pad : 0,
          }}
        >
          <Tabs
            items={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            gap={topTabGapPx(breakpoint)}

            style={{
              width: '100%',
              paddingTop:    isMobile ? 4 : isDesktop ? 8 : 6,
              paddingBottom: isMobile ? 4 : isDesktop ? 8 : 6,
              paddingLeft:   isDesktop ? 16 : 12,
              paddingRight:  isDesktop ? 16 : 12,
              borderRadius:  isMobile ? 12 : isDesktop ? 16 : 14,
            }}
          />
        </div>
      )}

      {/* ── Content area ──────────────────────────────────────────────────── */}
      {noCard ? (
        // Sub-page routes own their layout (SubNav + card) — render bare outlet
        <div style={{ flex: 1, display: 'flex', minHeight: 0, marginTop: !hasTabs && isMobile ? pad : undefined }}>
          <Outlet />
        </div>
      ) : (
        // Standard frosted glass content card
        <div
          style={{
            flex:                  1,
            display:               'flex',
            flexDirection:         'column',
            minHeight:             0,
            marginTop:             !hasTabs && isMobile ? pad : undefined,
            background:            'rgba(255, 255, 255, 0.7)',
            backdropFilter:        'blur(6px)',
            WebkitBackdropFilter:  'blur(6px)',
            border:                '0.75px solid #d2efff',
            borderRadius:          20,
            boxShadow:             '0px 2px 48px 0px rgba(149, 172, 188, 0.15)',
            overflow:              'hidden',
          }}
        >
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}>
            <Outlet />
          </div>
        </div>
      )}

      {/* Footer below the card — same layout as tablet on all breakpoints (sidebar has no footer on desktop) */}
      <Footer
        breakpoint={isMobile ? 'mobile' : 'tablet'}
        links={footerLinks}
      />
    </div>
  );
}

export default SectionLayout;
