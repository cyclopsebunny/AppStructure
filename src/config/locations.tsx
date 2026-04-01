import React from 'react';
import { FacilityIcon, BuildingFilledIcon } from '@component-library/core';

export type AppType = 'enterprise' | 'community';

export interface AppLocation {
  id: string;
  name: string;
  location: string;
  appType: AppType;
  icon: React.ReactNode;
}

export const LOCATIONS: AppLocation[] = [
  {
    id: 'enterprise-1',
    name: 'Facility Name',
    location: 'Chicago, IL',
    appType: 'enterprise',
    icon: <FacilityIcon size={24} />,
  },
  {
    id: 'community-1',
    name: 'Community Name',
    location: 'Chicago, IL',
    appType: 'community',
    icon: <BuildingFilledIcon size={24} />,
  },
];
