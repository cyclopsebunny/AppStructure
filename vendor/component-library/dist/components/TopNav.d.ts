import { default as React } from 'react';
import { SideNavItem } from './SideNavigation';

export interface TopNavLocation {
    name: string;
    location?: string;
    icon?: React.ReactNode;
}
export interface TopNavProps {
    /** "community" or "enterprise" — drives the app name displayed */
    application?: 'community' | 'enterprise';
    /** Override the displayed app name */
    appName?: string;
    /** Logo element (defaults to a plain myQ text mark) */
    logo?: React.ReactNode;
    /** Navigation items */
    navItems?: SideNavItem[];
    /** Currently active nav item id */
    activeItem?: string;
    /** Called when a nav item is tapped */
    onNavItemClick?: (id: string) => void;
    /** Location / facility for the selector */
    location?: TopNavLocation;
    /** Called when the location selector is clicked, with the button's bounding rect */
    onLocationClick?: (rect: DOMRect) => void;
    /** User avatar element shown in top-right */
    avatar?: React.ReactNode;
    /**
     * Custom content rendered in the right slot of the top bar, replacing the
     * default avatar. Use this to add extra action buttons or dropdowns on mobile.
     */
    rightContent?: React.ReactNode;
    /** Control open state externally (uncontrolled by default) */
    open?: boolean;
    /** Called when the hamburger / close button is pressed */
    onOpenChange?: (open: boolean) => void;
    /**
     * Top and bottom padding (px) applied to the bar itself.
     * Controls bar height while keeping button sizes constant.
     * @default 4
     */
    barPaddingY?: number;
    /**
     * When false the hamburger / close button is hidden and the nav drawer
     * will not open — useful at breakpoints where a sidebar is already visible.
     * @default true
     */
    showHamburger?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * TopNav
 *
 * Horizontal navigation bar used at all breakpoints.
 *
 * - `barPaddingY` controls top/bottom padding so the bar height can be tuned
 *   per breakpoint while keeping the button sizes constant.
 * - `showHamburger` hides the hamburger/close button and drawer at breakpoints
 *   where a sidebar is already visible (tablet, desktop).
 */
export declare const TopNav: React.FC<TopNavProps>;
export default TopNav;
//# sourceMappingURL=TopNav.d.ts.map