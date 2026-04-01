import { default as React } from 'react';

export interface RightNavItem {
    /** Unique identifier */
    id: string;
    /** Accessible label / tooltip text */
    label: string;
    /** Icon element to display */
    icon: React.ReactNode;
    /** When true renders a red alert background behind the icon */
    alert?: boolean;
    onClick?: () => void;
}
export interface RightNavProps {
    /** Action buttons to render in the panel */
    items: RightNavItem[];
    /** Optional element rendered at the bottom (e.g. an avatar) */
    avatar?: React.ReactNode;
}
export interface RightNavMobileStripProps {
    /** Action buttons to render in the strip */
    items: RightNavItem[];
    /** Controls visibility */
    isOpen: boolean;
    /** Optional element rendered at the bottom of the strip */
    avatar?: React.ReactNode;
}
export declare const RightNav: React.FC<RightNavProps>;
export declare const RightNavMobileStrip: React.FC<RightNavMobileStripProps>;
export default RightNav;
//# sourceMappingURL=RightNav.d.ts.map