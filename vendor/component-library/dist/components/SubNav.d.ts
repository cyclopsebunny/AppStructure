import { default as React } from 'react';

export interface SubNavItem {
    /** Unique identifier */
    id: string;
    /** Visible label */
    label: string;
    /** Disabled state */
    disabled?: boolean;
}
export interface SubNavProps {
    /** Navigation items to display */
    items: SubNavItem[];
    /** Id of the currently active item */
    activeItem?: string;
    /** Called with the id of the clicked item */
    onItemClick?: (id: string) => void;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * SubNav
 *
 * Third-level vertical navigation panel. Rendered inside the main content
 * card alongside the page body, producing a three-level navigation hierarchy:
 * Left-nav → Tab-bar → SubNav → content.
 *
 * Visual style: frosted-glass pill matching the Tabs / content-card aesthetic.
 *
 * Matches the Figma "Nav" component in the Commercial Web UI Refresh design
 * file (node 2263:21990).
 */
export declare const SubNav: React.FC<SubNavProps>;
export default SubNav;
//# sourceMappingURL=SubNav.d.ts.map