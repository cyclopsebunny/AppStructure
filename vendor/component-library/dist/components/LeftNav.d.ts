import { default as React } from 'react';
import { SideNavItem } from './SideNavigation';
import { LocationSelectorProps } from './LocationSelector';

export type LeftNavApplication = 'community' | 'enterprise';
export interface LeftNavProps {
    /**
     * Application type — 'community' or 'enterprise'.
     * Affects the label shown next to the logo and the default footer links
     * when `footerLinks` and `copyright` are not explicitly provided.
     * @default 'community'
     */
    application?: LeftNavApplication;
    /**
     * Text shown next to the myQ logo (e.g. "Community", "Enterprise", or a custom name).
     * Falls back to the capitalised `application` value when omitted.
     */
    appName?: string;
    /**
     * Custom logo element. When omitted, renders the standard myQ wordmark.
     */
    logo?: React.ReactNode;
    /**
     * Navigation items rendered in the main nav section.
     */
    navItems: SideNavItem[];
    /**
     * ID of the currently active nav item.
     */
    activeItem?: string;
    /**
     * Callback when a nav item is clicked.
     */
    onNavItemClick?: (id: string) => void;
    /**
     * Props forwarded to the `LocationSelector` component.
     * Omit to hide the location selector entirely.
     */
    location?: Omit<LocationSelectorProps, 'collapsed'>;
    /**
     * Collapsed mode — renders the sidebar at 84 px wide (icons only).
     * @default false
     */
    collapsed?: boolean;
    /**
     * Footer link labels rendered at the bottom of the sidebar.
     * Defaults to community or enterprise defaults when omitted.
     */
    footerLinks?: string[];
    /**
     * Copyright string shown below footer links.
     * @default '© 2026 LiftMaster'
     */
    copyright?: string;
    /**
     * Full height of the sidebar.
     * @default '100vh'
     */
    height?: React.CSSProperties['height'];
    /** Additional CSS class on the root element */
    className?: string;
    /** Additional inline styles on the root element */
    style?: React.CSSProperties;
}
/**
 * LeftNav
 *
 * Full side-panel navigation component. Composes the myQ logo, optional
 * `LocationSelector`, `SideNavigation`, and a footer links section.
 *
 * Supports two widths:
 * - **Expanded** (`collapsed=false`): 220 px — icon + label nav items
 * - **Collapsed** (`collapsed=true`): 84 px  — icon-only nav items
 *
 * Matches the Figma `leftNav` component (node 3376:8082 in the 4.0 Design System).
 *
 * @example
 * ```tsx
 * const navItems = [
 *   { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
 *   { id: 'users',     label: 'Users',     icon: <UsersIcon /> },
 * ];
 *
 * <LeftNav
 *   application="community"
 *   navItems={navItems}
 *   activeItem="dashboard"
 *   onNavItemClick={(id) => navigate(id)}
 *   location={{ name: 'Drake Terrace', location: 'Wheaton, IL' }}
 * />
 * ```
 */
export declare const LeftNav: React.FC<LeftNavProps>;
export default LeftNav;
//# sourceMappingURL=LeftNav.d.ts.map