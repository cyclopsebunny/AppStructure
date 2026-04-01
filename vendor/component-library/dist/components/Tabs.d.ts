import { default as React } from 'react';

export interface TabButtonProps {
    /** Visible label */
    label: string;
    /** Whether this tab is currently selected */
    active?: boolean;
    /** Click handler */
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    /** Disabled state */
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
export declare const TabButton: React.ForwardRefExoticComponent<TabButtonProps & React.RefAttributes<HTMLButtonElement>>;
export interface TabItem {
    /** Unique identifier */
    id: string;
    /** Visible label */
    label: string;
    /** Optionally disable this tab */
    disabled?: boolean;
}
export interface TabsProps {
    /** Tab definitions */
    items: TabItem[];
    /** Id of the currently active tab */
    activeTab?: string;
    /** Called with the id of the newly-selected tab */
    onTabChange?: (id: string) => void;
    /** Gap between tab buttons in px. Defaults to 16. */
    gap?: number;
    /** Horizontal (left/right) padding on each tab button in px. Defaults to 24. */
    buttonPaddingX?: number;
    /** Vertical (top/bottom) padding on each tab button in px. Defaults to 6. */
    buttonPaddingY?: number;
    /** Border radius on each tab button in px. Defaults to 8. */
    buttonBorderRadius?: number;
    className?: string;
    style?: React.CSSProperties;
}
export declare const Tabs: React.FC<TabsProps>;
export default Tabs;
//# sourceMappingURL=Tabs.d.ts.map