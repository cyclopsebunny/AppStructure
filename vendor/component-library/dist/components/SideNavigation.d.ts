import { default as React } from 'react';

export interface SideNavItem {
    /** Unique identifier — used to match against activeItem */
    id: string;
    /** Display label */
    label: string;
    /** Icon element (24×24) */
    icon?: React.ReactNode;
    /** Optional href for anchor-based navigation */
    href?: string;
}
export interface SideNavigationProps {
    /** Array of navigation items to render */
    items: SideNavItem[];
    /** ID of the currently active item */
    activeItem?: string;
    /** Collapsed mode — renders icons only, no labels */
    collapsed?: boolean;
    /** Callback when a nav item is clicked */
    onItemClick?: (id: string) => void;
    /** Additional CSS class */
    className?: string;
    /** Additional inline styles */
    style?: React.CSSProperties;
}
/**
 * SideNavigation
 *
 * A vertical list of `NavItem` rows used inside `LeftNav`. Renders the full nav
 * section with icon + label (expanded) or icon only (collapsed).
 *
 * Matches the Figma `side navigation` component (node 3376:6408 in the 4.0 Design System).
 * Supports both Community and Enterprise navigation by accepting `items` as a prop.
 */
export declare const SideNavigation: React.FC<SideNavigationProps>;
export default SideNavigation;
//# sourceMappingURL=SideNavigation.d.ts.map