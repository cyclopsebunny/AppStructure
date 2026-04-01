import { default as React } from 'react';

export interface PickerLocation {
    id: string;
    name: string;
    /** Secondary line e.g. "Enterprise · Chicago, IL" */
    subtitle?: string;
    icon?: React.ReactNode;
}
export interface LocationPickerProps {
    locations: PickerLocation[];
    selectedId: string;
    offsetLeft?: number;
    mobile?: boolean;
    anchorRect?: DOMRect | null;
    onClose: () => void;
    onSelect?: (id: string) => void;
}
export declare const LocationPicker: React.FC<LocationPickerProps>;
export default LocationPicker;
//# sourceMappingURL=LocationPicker.d.ts.map