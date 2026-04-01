import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { SectionLayout } from './components/SectionLayout';
import { AccountLayout } from './components/AccountLayout';
import { SubPageLayout } from './components/SubPageLayout';
import type { SubPage } from './components/SubPageLayout';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { AppProvider, useAppContext } from './context/AppContext';
import { ALL_SECTIONS, ENTERPRISE_NAV_SECTIONS } from './config/nav';

/**
 * Context-aware index redirect for sections that have sub-routes.
 * Reads the current app's nav config and redirects to the first visible sub-route.
 */
function SectionDefaultRedirect({ sectionId }: { sectionId: string }) {
  const { navSections } = useAppContext();
  const section = navSections.find((s) => s.id === sectionId);

  // Section not in current app (e.g. enterprise-only section while in community)
  if (!section) return null;

  // No sub-routes (e.g. Dashboard) — the index element is already the page
  if (section.subRoutes.length === 0) return null;

  return <Navigate to={section.subRoutes[0].path} replace />;
}

// ── Facility settings sub-pages (3rd-level navigation) ───────────────────────

const FACILITY_SUB_PAGES: SubPage[] = [
  { id: 'facility-overview',        label: 'Facility Overview',        path: '/settings/facility/facility-overview' },
  { id: 'access-schedules',         label: 'Access Schedules',         path: '/settings/facility/access-schedules' },
  { id: 'capacity-shift-limits',    label: 'Capacity and Shift Limits', path: '/settings/facility/capacity-shift-limits' },
  { id: 'qc-module',                label: 'QC Module',                path: '/settings/facility/qc-module' },
  { id: 'integrations',             label: 'Integrations',             path: '/settings/facility/integrations' },
];

// ── Build one route per merged section (covers all enterprise + community routes)
const sectionRoutes = ALL_SECTIONS.map((section) => {
  const hasSubRoutes = section.subRoutes.length > 0;

  const subRouteChildren = section.subRoutes.map((sub) => {
    // Facility settings gets a third-level sub-page layout.
      // handle.noCard tells SectionLayout to skip its own card wrapper so
      // SubPageLayout can render SubNav + card side by side.
      if (section.id === 'settings' && sub.id === 'facility') {
        return {
          path:    sub.id,
          handle:  { noCard: true },
          element: <SubPageLayout pages={FACILITY_SUB_PAGES} />,
          children: [
            ...FACILITY_SUB_PAGES.map((page) => ({
              path: page.id,
              element: <PlaceholderPage section="Settings · Facility" page={page.label} />,
            })),
          ],
        };
      }
    return {
      path: sub.id,
      element: <PlaceholderPage section={section.label} page={sub.label} />,
    };
  });

  return {
    path: section.basePath.slice(1),
    element: <SectionLayout />,
    children: hasSubRoutes
      ? [
          {
            index: true,
            element: <SectionDefaultRedirect sectionId={section.id} />,
          },
          ...subRouteChildren,
        ]
      : [
          {
            index: true,
            element: <PlaceholderPage section={section.label} page={section.label} />,
          },
        ],
  };
});

// Root redirect — always go to first sub-route of the first enterprise section
// (AppContext will handle switching to community on location change)
const rootRedirect = (
  <Navigate to={ENTERPRISE_NAV_SECTIONS[0].subRoutes[0].path} replace />
);

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppShell />,
      children: [
      { index: true, element: rootRedirect },
      ...sectionRoutes,
      {
        path: 'account',
        element: <AccountLayout />,
        children: [
          { index: true, element: <Navigate to="profile" replace /> },
          { path: 'profile',  element: <PlaceholderPage section="Account" page="User Profile" /> },
          { path: 'password', element: <PlaceholderPage section="Account" page="Password" /> },
        ],
      },
    ],
    },
  ],
  { basename },
);

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
