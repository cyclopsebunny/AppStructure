import { default as React } from 'react';

export interface LocationSelectorProps {
    /** Primary name (facility or community name) */
    name: string;
    /** Secondary line (city, state) */
    location?: string;
    /** Icon element shown on the left (24×24 recommended) */
    icon?: React.ReactNode;
    /** Click handler — open a picker/dropdown */
    onClick?: () => void;
    /** Like onClick, but also receives the button's bounding rect for anchor positioning */
    onClickWithRect?: (rect: DOMRect) => void;
    /** Collapsed mode — renders icon only, no text or chevron */
    collapsed?: boolean;
    /** Additional CSS class */
    className?: string;
    /** Additional inline styles */
    style?: React.CSSProperties;
}
/**
 * LocationSelector
 *
 * The facility / community location picker shown below the logo in the side panel.
 * Clicking it typically opens a dropdown to switch locations.
 *
 * Matches the Figma `location selector` component inside `leftNav`
 * (nodes 3376:4254, 3376:8092 in the 4.0 Design System).
 */
export declare const LocationSelector: React.FC<LocationSelectorProps>;
export default LocationSelector;
//# sourceMappingURL=LocationSelector.d.ts.map