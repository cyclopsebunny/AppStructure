import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Tabs } from '@component-library/core';
import type { TabItem } from '@component-library/core';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { topTabGapPx } from '../constants/topTabGap';

const ACCOUNT_TABS: TabItem[] = [
  { id: 'profile',  label: 'User Profile' },
  { id: 'password', label: 'Password' },
];

const ACCOUNT_PATHS: Record<string, string> = {
  profile:  '/account/profile',
  password: '/account/password',
};

export function AccountLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const breakpoint = useBreakpoint();

  const isDesktop = breakpoint === 'desktop';
  const isMobile  = breakpoint === 'mobile';

  const pad = isDesktop ? 24 : isMobile ? 12 : 16;
  const gap = isDesktop ? 16 : 12;

  const activeTab =
    ACCOUNT_TABS.find((t) => location.pathname === ACCOUNT_PATHS[t.id])?.id ??
    ACCOUNT_TABS[0].id;

  const handleTabChange = (id: string) => {
    if (ACCOUNT_PATHS[id]) navigate(ACCOUNT_PATHS[id]);
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
      {/* Tab bar */}
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
          items={ACCOUNT_TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          gap={topTabGapPx(breakpoint)}
          style={{ width: '100%' }}
        />
      </div>

      {/* Frosted glass content card */}
      <div
        style={{
          flex:                 1,
          display:              'flex',
          flexDirection:        'column',
          minHeight:            0,
          background:           'var(--surface-card)',
          backdropFilter:       'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          border:               '0.75px solid var(--accent-border-light)',
          borderRadius:         20,
          boxShadow:            '0px 2px 48px 0px var(--shadow-card)',
          overflow:             'hidden',
        }}
      >
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AccountLayout;
