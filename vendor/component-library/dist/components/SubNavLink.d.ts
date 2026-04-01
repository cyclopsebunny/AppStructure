import { default as React } from 'react';

export interface SubNavLinkProps {
    /** Visible label */
    label: string;
    /** Whether this link is currently active */
    active?: boolean;
    /** Click handler */
    onClick?: () => void;
    /** Disabled state */
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * SubNavLink
 *
 * A single third-level navigation link for use inside a `SubNav` panel.
 *
 * - **Default**: transparent background, secondary text colour, no border
 * - **Active**: brand-secondary background, brand border, bold brand text
 *
 * Matches the Figma "Nav / Link" component in the Commercial Web UI Refresh
 * design file (node 2263:21990).
 */
export declare const SubNavLink: React.FC<SubNavLinkProps>;
export default SubNavLink;
//# sourceMappingURL=SubNavLink.d.ts.map