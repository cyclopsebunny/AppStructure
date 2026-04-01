import {
  OperationsIcon,
  ScheduleIcon,
  AccessIcon,
  UsersIcon,
  MonitorIcon,
  DataIcon,
  AnalyzeIcon,
  SettingsIcon,
  DashboardIcon,
  PlansIcon,
} from '@component-library/core';
import type { NavIconProps } from '@component-library/core';
import type { ComponentType } from 'react';

export interface SubRoute {
  id: string;
  label: string;
  path: string;
}

export interface NavSection {
  id: string;
  label: string;
  icon: ComponentType<NavIconProps>;
  basePath: string;
  /** Empty array = no tabs; navigate directly to basePath */
  subRoutes: SubRoute[];
}

// ── Enterprise ────────────────────────────────────────────────────────────────

export const ENTERPRISE_NAV_SECTIONS: NavSection[] = [
  {
    id: 'operations',
    label: 'Operations',
    icon: OperationsIcon,
    basePath: '/operations',
    subRoutes: [
      { id: 'dock-positions', label: 'Dock Positions', path: '/operations/dock-positions' },
      { id: 'daily-schedule', label: 'Daily Schedule', path: '/operations/daily-schedule' },
      { id: 'trailers',       label: 'Trailers',       path: '/operations/trailers' },
      { id: 'tasks',          label: 'Tasks',          path: '/operations/tasks' },
    ],
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: ScheduleIcon,
    basePath: '/schedule',
    subRoutes: [
      { id: 'appointments',  label: 'Appointments',  path: '/schedule/appointments' },
      { id: 'bulk-import',   label: 'Bulk Import',   path: '/schedule/bulk-import' },
      { id: 'dock-plan',     label: 'Dock Plan',     path: '/schedule/dock-plan' },
      { id: 'routing-rules', label: 'Routing Rules', path: '/schedule/routing-rules' },
    ],
  },
  {
    id: 'access',
    label: 'Access',
    icon: AccessIcon,
    basePath: '/access',
    subRoutes: [
      { id: 'app-access',  label: 'App Access',  path: '/access/app-access' },
      { id: 'credentials', label: 'Credentials', path: '/access/credentials' },
      { id: 'zones',       label: 'Zones',       path: '/access/zones' },
      { id: 'roles',       label: 'Roles',       path: '/access/roles' },
    ],
  },
  {
    id: 'users',
    label: 'Users',
    icon: UsersIcon,
    basePath: '/users',
    subRoutes: [
      { id: 'people',     label: 'People',     path: '/users/people' },
      { id: 'schedulers', label: 'Schedulers', path: '/users/schedulers' },
      { id: 'groups',     label: 'Groups',     path: '/users/groups' },
    ],
  },
  {
    id: 'monitor',
    label: 'Monitor',
    icon: MonitorIcon,
    basePath: '/monitor',
    subRoutes: [
      { id: 'device-overview', label: 'Device Overview', path: '/monitor/device-overview' },
      { id: 'facility-layout', label: 'Facility Layout', path: '/monitor/facility-layout' },
      { id: 'video-streaming', label: 'Video Streaming', path: '/monitor/video-streaming' },
      { id: 'devices',         label: 'Devices',         path: '/monitor/devices' },
      { id: 'maintenance',     label: 'Maintenance',     path: '/monitor/maintenance' },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    icon: DataIcon,
    basePath: '/data',
    subRoutes: [
      { id: 'carriers', label: 'Carriers', path: '/data/carriers' },
      { id: 'vendors',  label: 'Vendors',  path: '/data/vendors' },
      { id: 'tags',     label: 'Tags',     path: '/data/tags' },
    ],
  },
  {
    id: 'analyze',
    label: 'Analyze',
    icon: AnalyzeIcon,
    basePath: '/analyze',
    subRoutes: [
      { id: 'historical-dock-activity', label: 'Historical Dock Activity', path: '/analyze/historical-dock-activity' },
      { id: 'activity',                 label: 'Activity',                 path: '/analyze/activity' },
      { id: 'journals',                 label: 'Journals',                 path: '/analyze/journals' },
      { id: 'reports',                  label: 'Reports',                  path: '/analyze/reports' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: SettingsIcon,
    basePath: '/settings',
    subRoutes: [
      { id: 'facility',      label: 'Facility',      path: '/settings/facility' },
      { id: 'billing',       label: 'Billing',       path: '/settings/billing' },
      { id: 'devices',       label: 'Devices',       path: '/settings/devices' },
      { id: 'docks',         label: 'Docks',         path: '/settings/docks' },
      { id: 'appointments',  label: 'Appointments',  path: '/settings/appointments' },
      { id: 'yard',          label: 'Yard',          path: '/settings/yard' },
      { id: 'notifications', label: 'Notifications', path: '/settings/notifications' },
    ],
  },
];

// ── Community ─────────────────────────────────────────────────────────────────

export const COMMUNITY_NAV_SECTIONS: NavSection[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: DashboardIcon,
    basePath: '/dashboard',
    subRoutes: [], // no sub-pages — renders content directly
  },
  {
    id: 'users',
    label: 'Users',
    icon: UsersIcon,
    basePath: '/users',
    subRoutes: [
      { id: 'people', label: 'People', path: '/users/people' },
      { id: 'groups', label: 'Groups', path: '/users/groups' },
      { id: 'guests', label: 'Guests', path: '/users/guests' },
    ],
  },
  {
    id: 'monitor',
    label: 'Monitor',
    icon: MonitorIcon,
    basePath: '/monitor',
    subRoutes: [
      { id: 'device-overview', label: 'Device Overview', path: '/monitor/device-overview' },
      { id: 'facility-layout', label: 'Facility Layout', path: '/monitor/facility-layout' },
      { id: 'video-streaming', label: 'Video Streaming', path: '/monitor/video-streaming' },
      { id: 'devices',         label: 'Devices',         path: '/monitor/devices' },
      { id: 'maintenance',     label: 'Maintenance',     path: '/monitor/maintenance' },
    ],
  },
  {
    id: 'access',
    label: 'Access',
    icon: AccessIcon,
    basePath: '/access',
    subRoutes: [
      { id: 'guests',      label: 'Guests',      path: '/access/guests' },
      { id: 'passes',      label: 'Passes',      path: '/access/passes' },
      { id: 'app-access',  label: 'App Access',  path: '/access/app-access' },
      { id: 'credentials', label: 'Credentials', path: '/access/credentials' },
      { id: 'zones',       label: 'Zones',       path: '/access/zones' },
      { id: 'roles',       label: 'Roles',       path: '/access/roles' },
    ],
  },
  {
    id: 'analyze',
    label: 'Analyze',
    icon: AnalyzeIcon,
    basePath: '/analyze',
    subRoutes: [
      { id: 'activity', label: 'Activity', path: '/analyze/activity' },
      { id: 'journals', label: 'Journals', path: '/analyze/journals' },
      { id: 'reports',  label: 'Reports',  path: '/analyze/reports' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: SettingsIcon,
    basePath: '/settings',
    subRoutes: [
      { id: 'community',     label: 'Community',     path: '/settings/community' },
      { id: 'billing',       label: 'Billing',       path: '/settings/billing' },
      { id: 'devices',       label: 'Devices',       path: '/settings/devices' },
      { id: 'notifications', label: 'Notifications', path: '/settings/notifications' },
    ],
  },
  {
    id: 'plans',
    label: 'Plans',
    icon: PlansIcon,
    basePath: '/plans',
    subRoutes: [
      { id: 'monthly-yearly',  label: 'Monthly/Yearly',  path: '/plans/monthly-yearly' },
      { id: 'feature-pricing', label: 'Feature Pricing',  path: '/plans/feature-pricing' },
    ],
  },
];

// ── Merged set used by the router (all routes from both apps) ─────────────────

function mergeNavSections(...configs: NavSection[][]): NavSection[] {
  const map = new Map<string, NavSection>();

  for (const sections of configs) {
    for (const section of sections) {
      if (map.has(section.id)) {
        const existing = map.get(section.id)!;
        const existingIds = new Set(existing.subRoutes.map((r) => r.id));
        for (const sub of section.subRoutes) {
          if (!existingIds.has(sub.id)) {
            existing.subRoutes.push(sub);
            existingIds.add(sub.id);
          }
        }
      } else {
        map.set(section.id, { ...section, subRoutes: [...section.subRoutes] });
      }
    }
  }

  return Array.from(map.values());
}

export const ALL_SECTIONS = mergeNavSections(
  ENTERPRISE_NAV_SECTIONS,
  COMMUNITY_NAV_SECTIONS,
);
