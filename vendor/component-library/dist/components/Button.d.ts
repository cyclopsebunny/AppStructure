import { default as React } from 'react';

export type ButtonVariant = 'default' | 'CTA' | 'brand' | 'subtle' | 'danger' | 'danger-subtle' | 'frameless';
export type ButtonState = 'enabled' | 'hover' | 'pressed' | 'active' | 'disabled';
export type ButtonSize = 'Small' | 'Medium';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Button label text
     */
    label?: string;
    /**
     * Button variant style
     * @default 'CTA'
     */
    variant?: ButtonVariant;
    /**
     * Button state
     * @default 'enabled'
     */
    state?: ButtonState;
    /**
     * Button size
     * @default 'Medium'
     */
    size?: ButtonSize;
    /**
     * Show icon at the start
     */
    hasIconStart?: boolean;
    /**
     * Show icon at the end
     */
    hasIconEnd?: boolean;
    /**
     * Custom start icon
     */
    iconStart?: React.ReactNode;
    /**
     * Custom end icon
     */
    iconEnd?: React.ReactNode;
    /**
     * Additional CSS class name
     */
    className?: string;
    /**
     * Button content (children)
     */
    children?: React.ReactNode;
}
/**
 * Button component
 *
 * Extracted from Figma node 4185-3778
 * Uses design tokens from component-colors.json (Figma node 3278-6898)
 */
export declare const Button: React.FC<ButtonProps>;
export default Button;
//# sourceMappingURL=Button.d.ts.map