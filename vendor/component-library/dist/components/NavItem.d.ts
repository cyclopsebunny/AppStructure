import { default as React } from 'react';

export interface NavItemProps {
    /** Navigation label */
    label: string;
    /** Icon element (24×24) */
    icon?: React.ReactNode;
    /** Whether this item is the currently active route */
    active?: boolean;
    /** Collapsed mode — renders icon only (no label) */
    collapsed?: boolean;
    /** Click handler */
    onClick?: () => void;
    /** Accessible href — renders as <a> when provided */
    href?: string;
    /** Additional CSS class */
    className?: string;
    /** Additional inline styles on the container */
    style?: React.CSSProperties;
}
/**
 * NavItem
 *
 * A single navigation row used inside the side panel. Supports active, hover, and
 * collapsed (icon-only) states. Matches the Figma `menuButtonsComm` component
 * (node 3376:4354 in the 4.0 Design System).
 *
 * Active:   brand-primary text (#0a76db), bold, no border-radius
 * Default:  dark text (#191919), medium weight, border-radius 8px
 * Hover:    light slate background (#f2f5fa), cursor pointer
 * Collapsed: icon only, 40×40 square
 */
export declare const NavItem: React.FC<NavItemProps>;
export default NavItem;
//# sourceMappingURL=NavItem.d.ts.map