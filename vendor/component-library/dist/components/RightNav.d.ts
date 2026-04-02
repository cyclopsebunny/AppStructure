import { default as React } from 'react';

export interface RightNavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    alert?: boolean;
    onClick?: () => void;
}
export interface UserMenuItem {
    id: string;
    label: string;
    /** null = non-navigating action (e.g. log out) */
    path: string | null;
    /** Render a divider line above this item */
    dividerBefore?: boolean;
    /** Render the label in a destructive (red) colour */
    destructive?: boolean;
}
export interface RightNavProps {
    items: RightNavItem[];
    /** Element rendered at the top of the panel (e.g. a UserMenu) */
    avatar?: React.ReactNode;
    /** Vertical padding above the first item. Defaults to 36. */
    paddingTop?: number;
    /** Gap between items. Defaults to 24. */
    gap?: number;
}
export interface RightNavMobileStripProps {
    items: RightNavItem[];
    isOpen: boolean;
    /** Element rendered at the top of the strip (e.g. a UserMenu) */
    avatar?: React.ReactNode;
}
export interface UserMenuProps {
    size?: number;
    /** 'left' = popover opens left (desktop/tablet), 'below' = opens below (mobile) */
    placement?: 'left' | 'below';
    /** Highlight the avatar when this prefix matches the current activePath */
    activePath?: string;
    menuItems: UserMenuItem[];
    onItemClick?: (item: UserMenuItem) => void;
}
export interface BellWithBadgeProps {
    size?: number;
    /** Show the red notification dot */
    hasAlert?: boolean;
}
export declare function BellWithBadge({ size, hasAlert }: BellWithBadgeProps): import("react/jsx-runtime").JSX.Element;
export declare function UserMenu({ size, placement, activePath, menuItems, onItemClick, }: UserMenuProps): import("react/jsx-runtime").JSX.Element;
export declare const RightNav: React.FC<RightNavProps>;
export declare const RightNavMobileStrip: React.FC<RightNavMobileStripProps>;
export default RightNav;
//# sourceMappingURL=RightNav.d.ts.map