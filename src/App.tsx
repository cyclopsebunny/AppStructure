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

// ── Billing settings sub-pages (3rd-level navigation, same pattern as Facility) ─

const BILLING_SUB_PAGES: SubPage[] = [
  { id: 'plans',            label: 'Plans',            path: '/settings/billing/plans' },
  { id: 'payment-methods',  label: 'Payment Methods',  path: '/settings/billing/payment-methods' },
];

const DEVICES_SUB_PAGES: SubPage[] = [
  { id: 'device-schedules',           label: 'Device Schedules',            path: '/settings/devices/device-schedules' },
  { id: 'audio-video-call-setup',   label: 'Audio Video Call Setup',      path: '/settings/devices/audio-video-call-setup' },
  { id: 'entrance-and-exit-settings', label: 'Entrance and Exit Settings', path: '/settings/devices/entrance-and-exit-settings' },
];

const DOCKS_SUB_PAGES: SubPage[] = [
  { id: 'dock-sessions',   label: 'Dock Sessions',   path: '/settings/docks/dock-sessions' },
  { id: 'dock-containers', label: 'Dock Containers', path: '/settings/docks/dock-containers' },
];

const APPOINTMENTS_SUB_PAGES: SubPage[] = [
  { id: 'appointment-workflow',  label: 'Appointment Workflow',   path: '/settings/appointments/appointment-workflow' },
  { id: 'check-in-rules',        label: 'Check In Rules',         path: '/settings/appointments/check-in-rules' },
  { id: 'check-in-schedules',    label: 'Check In Schedules',     path: '/settings/appointments/check-in-schedules' },
  { id: 'check-in-overrides',    label: 'Check In Overrides',     path: '/settings/appointments/check-in-overrides' },
  { id: 'ai-scheduling-agent',   label: 'AI Scheduling Agent',    path: '/settings/appointments/ai-scheduling-agent' },
  { id: 'appointment-details',   label: 'Appointment Details',    path: '/settings/appointments/appointment-details' },
];

const YARD_SUB_PAGES: SubPage[] = [
  { id: 'yard-lots',              label: 'Yard Lots',              path: '/settings/yard/yard-lots' },
  { id: 'trailer-metadata',       label: 'Trailer Metadata',       path: '/settings/yard/trailer-metadata' },
  { id: 'trailer-quick-filters',  label: 'Trailer Quick Filters',  path: '/settings/yard/trailer-quick-filters' },
  { id: 'auto-task-creation',     label: 'Auto Task Creation',     path: '/settings/yard/auto-task-creation' },
];

const NOTIFICATIONS_SUB_PAGES: SubPage[] = [
  { id: 'facility-notifications',  label: 'Facility Notifications',  path: '/settings/notifications/facility-notifications' },
  { id: 'shipment-notifications',  label: 'Shipment Notifications',  path: '/settings/notifications/shipment-notifications' },
  { id: 'access-notifications',    label: 'Access Notifications',    path: '/settings/notifications/access-notifications' },
];

/** Settings tabs that use SubPageLayout (3rd-level nav). Keys = nav `sub.id`. */
const SETTINGS_THIRD_LEVEL: Record<string, { pages: SubPage[]; placeholderSection: string }> = {
  facility:      { pages: FACILITY_SUB_PAGES,       placeholderSection: 'Settings · Facility' },
  billing:       { pages: BILLING_SUB_PAGES,        placeholderSection: 'Settings · Billing' },
  devices:       { pages: DEVICES_SUB_PAGES,      placeholderSection: 'Settings · Devices' },
  docks:         { pages: DOCKS_SUB_PAGES,        placeholderSection: 'Settings · Docks' },
  appointments:  { pages: APPOINTMENTS_SUB_PAGES, placeholderSection: 'Settings · Appointments' },
  yard:          { pages: YARD_SUB_PAGES,         placeholderSection: 'Settings · Yard' },
  notifications: { pages: NOTIFICATIONS_SUB_PAGES, placeholderSection: 'Settings · Notifications' },
};

// ── Build one route per merged section (covers all enterprise + community routes)
const sectionRoutes = ALL_SECTIONS.map((section) => {
  const hasSubRoutes = section.subRoutes.length > 0;

  const subRouteChildren = section.subRoutes.map((sub) => {
    // Settings tabs with a third-level sub-page layout.
    // handle.noCard lets SubPageLayout render SubNav + card (no SectionLayout card wrapper).
    if (section.id === 'settings') {
      const third = SETTINGS_THIRD_LEVEL[sub.id];
      if (third) {
        return {
          path:    sub.id,
          handle:  { noCard: true },
          element: <SubPageLayout pages={third.pages} />,
          children: third.pages.map((page) => ({
            path: page.id,
            element: (
              <PlaceholderPage section={third.placeholderSection} page={page.label} />
            ),
          })),
        };
      }
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
