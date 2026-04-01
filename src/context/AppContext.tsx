import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  ENTERPRISE_NAV_SECTIONS,
  COMMUNITY_NAV_SECTIONS,
} from '../config/nav';
import type { NavSection } from '../config/nav';
import { LOCATIONS } from '../config/locations';
import type { AppLocation } from '../config/locations';

interface AppContextValue {
  /** The currently active location */
  selectedLocation: AppLocation;
  /** Nav sections for the current location's app type */
  navSections: NavSection[];
  /** Footer link labels for the current app type */
  footerLinks: string[];
  /** Switch to a different location by id */
  setSelectedLocationId: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const FOOTER_LINKS: Record<string, string[]> = {
  enterprise: ['Support', 'Privacy', 'Terms', 'Partners', 'myQ Dockpass'],
  community:  ['Contact', 'Products', 'For Dealers'],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedLocationId, setId] = useState(LOCATIONS[0].id);

  const selectedLocation =
    LOCATIONS.find((l) => l.id === selectedLocationId) ?? LOCATIONS[0];

  const navSections =
    selectedLocation.appType === 'community'
      ? COMMUNITY_NAV_SECTIONS
      : ENTERPRISE_NAV_SECTIONS;

  const footerLinks = FOOTER_LINKS[selectedLocation.appType];

  const setSelectedLocationId = useCallback((id: string) => {
    setId(id);
  }, []);

  return (
    <AppContext.Provider
      value={{ selectedLocation, navSections, footerLinks, setSelectedLocationId }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within <AppProvider>');
  return ctx;
}
