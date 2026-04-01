import { default as React } from 'react';

type IconProps = {
    /** Pixel size — default 24 */
    size?: number;
    /** Render the filled/selected variant. Defaults to false (outlined). */
    active?: boolean;
    className?: string;
    style?: React.CSSProperties;
    'aria-hidden'?: boolean | 'true' | 'false';
};
export declare function DashboardIcon({ size, active, className, style, ...rest }: IconProps): import("react/jsx-runtime").JSX.Element;
export declare function UsersIcon({ size, active, className, style, ...rest }: IconProps): import("react/jsx-runtime").JSX.Element;
export declare function MonitorIcon({ size, active, className, style, ...rest }: IconProps): import("react/jsx-runtime").JSX.Element;
export declare function AccessIcon({ size, active, className, style, ...rest }: IconProps): import("react/jsx-runtime").JSX.Element;
export declare function AnalyzeIcon({ size, active, className, style, ...rest }: IconProps): import("react/jsx-runtime").JSX.Element;
export declare function SettingsIcon({ size, active, className, style, ...rest }: IconProps): import("react/jsx-runtime").JSX.Element;
export declare function PlansIcon({ size, active, className, style, ...rest }: IconProps): import("react/jsx-runtime").JSX.Element;
export declare function OperationsIcon({ size, active, className, style, ...rest }: IconProps): import("react/jsx-runtime").JSX.Element;
export declare function ScheduleIcon({ size, active, className, style, ...rest }: IconProps): import("react/jsx-runtime").JSX.Element;
export declare function DataIcon({ size, active, className, style, ...rest }: IconProps): import("react/jsx-runtime").JSX.Element;
type FacilityIconProps = Omit<IconProps, 'size'> & {
    size?: number;
};
export declare function FacilityIcon({ size, active, className, style, ...rest }: FacilityIconProps): import("react/jsx-runtime").JSX.Element;
export type CommunityTier = 'premium' | 'advanced' | 'basic' | 'access-plus';
type CommunityIconProps = {
    tier?: CommunityTier;
    size?: number;
    className?: string;
    style?: React.CSSProperties;
    /** Base URL path for the PNG files. Defaults to "/icons". */
    basePath?: string;
};
export declare function CommunityIcon({ tier, size, basePath, className, style }: CommunityIconProps): import("react/jsx-runtime").JSX.Element;
type MyQLogoProps = {
    /** Height in px. Width scales proportionally. @default 21 */
    height?: number;
    className?: string;
    style?: React.CSSProperties;
};
export declare function MyQLogo({ height, className, style }: MyQLogoProps): import("react/jsx-runtime").JSX.Element;
/** @deprecated Use OperationsIcon instead */
export declare const RolesIcon: typeof OperationsIcon;
export type { IconProps as NavIconProps, FacilityIconProps };
export declare const NAV_ICONS: {
    readonly DashboardIcon: typeof DashboardIcon;
    readonly UsersIcon: typeof UsersIcon;
    readonly MonitorIcon: typeof MonitorIcon;
    readonly AccessIcon: typeof AccessIcon;
    readonly AnalyzeIcon: typeof AnalyzeIcon;
    readonly SettingsIcon: typeof SettingsIcon;
    readonly PlansIcon: typeof PlansIcon;
    readonly OperationsIcon: typeof OperationsIcon;
    readonly ScheduleIcon: typeof ScheduleIcon;
    readonly DataIcon: typeof DataIcon;
    readonly FacilityIcon: typeof FacilityIcon;
    readonly CommunityIcon: typeof CommunityIcon;
    readonly MyQLogo: typeof MyQLogo;
};
//# sourceMappingURL=NavIcons.d.ts.map