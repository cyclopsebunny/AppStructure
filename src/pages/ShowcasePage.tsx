import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FilterButton } from '../components/FilterButton';
import { FilterButtonBar } from '../components/FilterButtonBar';
import type { FilterButtonGroup } from '../components/FilterButtonBar';
import { FilterSetBar } from '../components/FilterSetBar';
import type { FilterSetData } from '../components/FilterSetBar';
import { DockItem } from '../components/DockItem';
import { DockItemGrid } from '../components/DockItemGrid';
import type { DockItemData } from '../components/DockItemGrid';
import { IconButton } from '../components/IconButton';
import type { IconButtonItem } from '../components/IconButton';
import { ShipmentItem } from '../components/ShipmentItem';
import { ShipmentPanel, ShipmentPanelHeader } from '../components/ShipmentPanel';
import type { ShipmentItemData } from '../components/ShipmentPanel';
import { UnassignedTrailerItem } from '../components/UnassignedTrailerItem';
import { UnassignedTrailerPanel, UnassignedTrailerPanelHeader } from '../components/UnassignedTrailerPanel';
import type { UnassignedTrailerItemData } from '../components/UnassignedTrailerPanel';
import { SearchBar } from '../components/SearchBar';
import type { SearchOption } from '../components/SearchBar';
import { Switch } from '../components/Switch';
import {
  Button,
  NavItem,
  Tabs,
  TabButton,
  SubNav,
  SideNavigation,
  LeftNav,
  TopNav,
  RightNav,
  RightNavMobileStrip,
  UserMenu,
  BellWithBadge,
  LocationSelector,
  LocationPicker,
  // Icons — nav
  DashboardIcon,
  UsersIcon,
  MonitorIcon,
  AccessIcon,
  AnalyzeIcon,
  SettingsIcon,
  PlansIcon,
  OperationsIcon,
  ScheduleIcon,
  DataIcon,
  // Icons — general (sampler)
  BellOutlinedIcon,
  BellFilledIcon,
  SearchDefaultIcon,
  EditOutlinedIcon,
  DeleteOutlinedIcon,
  DownloadOutlinedIcon,
  FilterDefaultIcon,
  ReorderV3DefaultIcon,
  HomeOutlinedIcon,
  InfoInfoOutlinedIcon,
  InfoWarningOutlinedIcon,
  InfoEventOutlinedIcon,
  CheckmarkOutlinedIcon,
  CloseDefaultIcon,
  DoorsOpenIcon,
  DoorsClosedIcon,
  GateOpenIcon,
  GateClosedIcon,
  LockRoundedLockedIcon,
  LockRoundedUnlockedIcon,
  UserOutlinedDefaultIcon,
  PeopleOutlinedIcon,
  CameraDefaultOutlinedIcon,
  CalendarDefaultOutlinedIcon,
  StarOutlinedIcon,
  StarFilledIcon,
  MoreVerticalIcon,
  MoreHorizontalIcon,
  // tokens
  colors,
  semanticcolors,
  typography,
  spacing,
} from '@component-library/core';

// ── Helpers ────────────────────────────────────────────────────────────────────

type SideSection =
  | 'button'
  | 'navitem'
  | 'tabs'
  | 'subnav'
  | 'sidenavigation'
  | 'leftnav'
  | 'topnav'
  | 'rightnav'
  | 'locationselector'
  | 'locationpicker'
  | 'filterbutton'
  | 'dockitem'
  | 'iconbutton'
  | 'shipmentpanel'
  | 'searchbar'
  | 'switch'
  | 'icons'
  | 'tokens';

const SECTIONS: { id: SideSection; label: string; isNew?: boolean }[] = [
  { id: 'button',          label: 'Button' },
  { id: 'navitem',         label: 'NavItem' },
  { id: 'tabs',            label: 'Tabs' },
  { id: 'subnav',          label: 'SubNav' },
  { id: 'sidenavigation',  label: 'SideNavigation' },
  { id: 'leftnav',         label: 'LeftNav' },
  { id: 'topnav',          label: 'TopNav' },
  { id: 'rightnav',        label: 'RightNav' },
  { id: 'locationselector', label: 'LocationSelector' },
  { id: 'locationpicker',  label: 'LocationPicker' },
  { id: 'filterbutton',    label: 'FilterButton', isNew: true },
  { id: 'dockitem',        label: 'DockItem', isNew: true },
  { id: 'iconbutton',      label: 'IconButton', isNew: true },
  { id: 'shipmentpanel',   label: 'ShipmentPanel', isNew: true },
  { id: 'unassignedtrailer', label: 'UnassignedTrailerPanel', isNew: true },
  { id: 'searchbar',       label: 'SearchBar', isNew: true },
  { id: 'switch',          label: 'Switch', isNew: true },
  { id: 'icons',           label: 'Icons' },
  { id: 'tokens',          label: 'Design Tokens' },
];

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Layout primitives ─────────────────────────────────────────────────────────

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 64 }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: '#17191c', margin: '0 0 4px' }}>{title}</h2>
      {description && <p style={{ fontSize: 14, color: '#575d69', margin: '0 0 24px', lineHeight: 1.6 }}>{description}</p>}
      {!description && <div style={{ marginBottom: 24 }} />}
      {children}
    </section>
  );
}

function Row({ label, children, vertical }: { label?: string; children: React.ReactNode; vertical?: boolean }) {
  return (
    <div style={{ marginBottom: 20 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 600, color: '#8a909e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{label}</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: vertical ? 'flex-start' : 'center', flexDirection: vertical ? 'column' : 'row' }}>
        {children}
      </div>
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.85)',
      borderRadius: 12,
      border: '1px solid rgba(0,0,0,0.07)',
      padding: 24,
      backdropFilter: 'blur(8px)',
      ...style,
    }}>
      {children}
    </div>
  );
}

/** Preview shell for NavItem / SideNavigation — matches app sidebar tokens (not hardcoded blue). */
const navPreviewShell: React.CSSProperties = {
  background: 'var(--surface-sidePanels)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid var(--border-default)',
  borderRadius: 8,
};

function PropBadge({ value }: { value: string }) {
  return (
    <code style={{
      fontSize: 11,
      fontFamily: '"SF Mono", "Fira Code", monospace',
      background: '#f2f5fa',
      border: '1px solid #d1d7e3',
      borderRadius: 4,
      padding: '1px 6px',
      color: '#0a76db',
    }}>{value}</code>
  );
}

// ── Sample data ───────────────────────────────────────────────────────────────

const SAMPLE_NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: <DashboardIcon /> },
  { id: 'users',      label: 'Users',      icon: <UsersIcon /> },
  { id: 'monitor',    label: 'Monitor',    icon: <MonitorIcon /> },
  { id: 'access',     label: 'Access',     icon: <AccessIcon /> },
  { id: 'analyze',    label: 'Analyze',    icon: <AnalyzeIcon /> },
  { id: 'settings',   label: 'Settings',   icon: <SettingsIcon /> },
];

const SAMPLE_TAB_ITEMS = [
  { id: 'overview',  label: 'Overview' },
  { id: 'details',   label: 'Details' },
  { id: 'activity',  label: 'Activity' },
  { id: 'settings',  label: 'Settings', disabled: true },
];

const SAMPLE_SUBNAV_ITEMS = [
  { id: 'people',     label: 'People' },
  { id: 'groups',     label: 'Groups' },
  { id: 'guests',     label: 'Guests' },
  { id: 'roles',      label: 'Roles',  disabled: true },
];

const SAMPLE_USER_MENU_ITEMS = [
  { id: 'profile',   label: 'My Profile',   path: '/account/profile' },
  { id: 'password',  label: 'Password',     path: '/account/password' },
  { id: 'logout',    label: 'Log Out',      path: null, dividerBefore: true, destructive: true },
];

const SAMPLE_RIGHT_NAV_ITEMS = [
  { id: 'bell', label: 'Notifications', icon: <BellWithBadge hasAlert />, alert: true },
  { id: 'settings', label: 'Settings',  icon: <SettingsIcon /> },
  { id: 'users',    label: 'Users',     icon: <UsersIcon /> },
];

const SAMPLE_PICKER_LOCATIONS = [
  { id: 'drake',    name: 'Drake Terrace',    subtitle: 'Community · Wheaton, IL' },
  { id: 'midtown',  name: 'Midtown Facility', subtitle: 'Enterprise · Chicago, IL' },
  { id: 'south-pl', name: 'South Plant',      subtitle: 'Enterprise · Aurora, IL' },
];

// ── Section renderers ─────────────────────────────────────────────────────────

function ButtonSection() {
  const variants = ['default', 'CTA', 'brand', 'subtle', 'danger', 'danger-subtle', 'frameless'] as const;
  return (
    <Section title="Button" description="7 variants × 2 sizes. All forward native <button> props.">
      <Card>
        <Row label="Variants — Medium">
          {variants.map((v) => (
            <Button key={v} variant={v} label={v} size="Medium" />
          ))}
        </Row>
        <Row label="Variants — Small">
          {variants.map((v) => (
            <Button key={v} variant={v} label={v} size="Small" />
          ))}
        </Row>
        <Row label="States">
          <Button variant="CTA" label="Enabled" state="enabled" />
          <Button variant="CTA" label="Disabled" state="disabled" />
          <Button variant="default" label="Disabled" state="disabled" />
          <Button variant="danger" label="Disabled" state="disabled" />
        </Row>
        <Row label="With Icons">
          <Button variant="CTA" label="Download" iconStart={<DownloadOutlinedIcon />} hasIconStart />
          <Button variant="default" label="Filter" iconStart={<FilterDefaultIcon />} hasIconStart />
          <Button variant="subtle" label="Edit" iconEnd={<EditOutlinedIcon />} hasIconEnd />
          <Button variant="danger" label="Delete" iconStart={<DeleteOutlinedIcon />} hasIconStart />
        </Row>
        <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <PropBadge value="variant" />
          <PropBadge value="size" />
          <PropBadge value="state" />
          <PropBadge value="hasIconStart" />
          <PropBadge value="hasIconEnd" />
          <PropBadge value="iconStart" />
          <PropBadge value="iconEnd" />
        </div>
      </Card>
    </Section>
  );
}

function NavItemSection() {
  const [activeId, setActiveId] = useState('users');
  return (
    <Section title="NavItem" description="Single navigation row. Supports active, collapsed, and href modes.">
      <Card>
        <Row label="Expanded — click to activate">
          <div style={{ width: 220, padding: 4, ...navPreviewShell }}>
            {SAMPLE_NAV_ITEMS.map((item) => (
              <NavItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                active={activeId === item.id}
                onClick={() => setActiveId(item.id)}
              />
            ))}
          </div>
        </Row>
        <Row label="Collapsed (icon only)">
          <div style={{ width: 60, padding: 4, ...navPreviewShell }}>
            {SAMPLE_NAV_ITEMS.slice(0, 4).map((item) => (
              <NavItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                collapsed
                active={activeId === item.id}
                onClick={() => setActiveId(item.id)}
              />
            ))}
          </div>
        </Row>
      </Card>
    </Section>
  );
}

function TabsSection() {
  const [active, setActive] = useState('overview');
  const [activeBtn, setActiveBtn] = useState('a');
  return (
    <Section title="Tabs" description="Horizontal tab bar with optional disabled tabs. TabButton is the primitive.">
      <Card>
        <Row label="Tabs component">
          <Tabs items={SAMPLE_TAB_ITEMS} activeTab={active} onTabChange={setActive} />
        </Row>
        <Row label="Active: ">
          <PropBadge value={active} />
        </Row>
        <Row label="TabButton primitives">
          {['A', 'B', 'C'].map((l) => (
            <TabButton key={l} label={l} active={activeBtn === l.toLowerCase()} onClick={() => setActiveBtn(l.toLowerCase())} />
          ))}
          <TabButton label="Disabled" disabled />
        </Row>
        <Row label="Custom spacing (gap=8 paddingX=16)">
          <Tabs items={SAMPLE_TAB_ITEMS.slice(0, 3)} activeTab={active} onTabChange={setActive} gap={8} buttonPaddingX={16} />
        </Row>
        <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <PropBadge value="items" />
          <PropBadge value="activeTab" />
          <PropBadge value="onTabChange" />
          <PropBadge value="gap" />
          <PropBadge value="buttonPaddingX" />
          <PropBadge value="buttonPaddingY" />
        </div>
      </Card>
    </Section>
  );
}

function SubNavSection() {
  const [active, setActive] = useState('people');
  return (
    <Section title="SubNav" description="Third-level vertical navigation panel. Frosted-glass pill style.">
      <Card>
        <Row label="SubNav">
          <SubNav items={SAMPLE_SUBNAV_ITEMS} activeItem={active} onItemClick={setActive} />
          <div style={{ fontSize: 13, color: '#575d69' }}>Active: <PropBadge value={active} /></div>
        </Row>
        <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <PropBadge value="items" />
          <PropBadge value="activeItem" />
          <PropBadge value="onItemClick" />
        </div>
      </Card>
    </Section>
  );
}

function SideNavigationSection() {
  const [active, setActive] = useState('dashboard');
  return (
    <Section title="SideNavigation" description="Vertical list of NavItems. Used inside LeftNav.">
      <Card style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#8a909e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Expanded</div>
          <div style={{ width: 200, padding: 0, ...navPreviewShell }}>
            <SideNavigation items={SAMPLE_NAV_ITEMS} activeItem={active} onItemClick={setActive} />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#8a909e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Collapsed</div>
          <div style={{ width: 60, padding: 0, ...navPreviewShell }}>
            <SideNavigation items={SAMPLE_NAV_ITEMS} activeItem={active} onItemClick={setActive} collapsed />
          </div>
        </div>
        <div style={{ marginTop: 4, display: 'flex', gap: 8, flexWrap: 'wrap', alignSelf: 'flex-end' }}>
          <PropBadge value="items" />
          <PropBadge value="activeItem" />
          <PropBadge value="collapsed" />
          <PropBadge value="onItemClick" />
        </div>
      </Card>
    </Section>
  );
}

function LeftNavSection() {
  const [active, setActive] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Section title="LeftNav" description="Full side-panel: logo, location selector, nav items, footer links.">
      <Card>
        <Row label="Controls">
          <Button
            variant="subtle"
            size="Small"
            label={collapsed ? 'Expand' : 'Collapse'}
            onClick={() => setCollapsed((c) => !c)}
          />
        </Row>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ border: '1px solid #e4e8f2', borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
            <LeftNav
              application="community"
              navItems={SAMPLE_NAV_ITEMS}
              activeItem={active}
              onNavItemClick={setActive}
              location={{ name: 'Drake Terrace', location: 'Wheaton, IL' }}
              collapsed={collapsed}
              height={480}
            />
          </div>
          <div style={{ border: '1px solid #e4e8f2', borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
            <LeftNav
              application="enterprise"
              navItems={SAMPLE_NAV_ITEMS}
              activeItem={active}
              onNavItemClick={setActive}
              location={{ name: 'Midtown Facility', location: 'Chicago, IL' }}
              collapsed={collapsed}
              height={480}
            />
          </div>
        </div>
        <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <PropBadge value="application" />
          <PropBadge value="appName" />
          <PropBadge value="navItems" />
          <PropBadge value="activeItem" />
          <PropBadge value="location" />
          <PropBadge value="collapsed" />
          <PropBadge value="footerLinks" />
          <PropBadge value="copyright" />
          <PropBadge value="height" />
        </div>
      </Card>
    </Section>
  );
}

function TopNavSection() {
  const [active, setActive] = useState('dashboard');
  const [open, setOpen] = useState(false);
  const [showHamburger, setShowHamburger] = useState(true);
  return (
    <Section title="TopNav" description="Horizontal bar for mobile breakpoints. Includes a hamburger drawer.">
      <Card>
        <Row label="Controls">
          <Button variant="subtle" size="Small" label={open ? 'Close drawer' : 'Open drawer'} onClick={() => setOpen((o) => !o)} />
          <Button variant="subtle" size="Small" label={showHamburger ? 'Hide hamburger' : 'Show hamburger'} onClick={() => setShowHamburger((s) => !s)} />
        </Row>
        <div style={{ border: '1px solid #e4e8f2', borderRadius: 12, overflow: 'hidden' }}>
          <TopNav
            application="community"
            barPaddingY={8}
            navItems={SAMPLE_NAV_ITEMS}
            activeItem={active}
            onNavItemClick={(id) => { setActive(id); setOpen(false); }}
            location={{ name: 'Drake Terrace', location: 'Wheaton, IL' }}
            open={open}
            onOpenChange={setOpen}
            showHamburger={showHamburger}
          />
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <PropBadge value="application" />
          <PropBadge value="barPaddingY" />
          <PropBadge value="navItems" />
          <PropBadge value="location" />
          <PropBadge value="open" />
          <PropBadge value="onOpenChange" />
          <PropBadge value="showHamburger" />
          <PropBadge value="rightContent" />
        </div>
      </Card>
    </Section>
  );
}

function RightNavSection() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <Section title="RightNav" description="Vertical action panel for desktop/tablet. BellWithBadge and UserMenu are standalone sub-components.">
      <Card>
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#8a909e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>RightNav</div>
            <div style={{ border: '1px solid #e4e8f2', borderRadius: 12, overflow: 'hidden', width: 72 }}>
              <RightNav
                items={SAMPLE_RIGHT_NAV_ITEMS}
                avatar={<UserMenu size={32} menuItems={SAMPLE_USER_MENU_ITEMS} />}
              />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#8a909e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>RightNavMobileStrip</div>
            <Button variant="subtle" size="Small" label={mobileOpen ? 'Close strip' : 'Open strip'} onClick={() => setMobileOpen((o) => !o)} />
            <div style={{ marginTop: 12, border: '1px solid #e4e8f2', borderRadius: 12, overflow: 'hidden', width: 280 }}>
              <RightNavMobileStrip
                items={SAMPLE_RIGHT_NAV_ITEMS}
                isOpen={mobileOpen}
                avatar={<UserMenu size={28} placement="below" menuItems={SAMPLE_USER_MENU_ITEMS} />}
              />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#8a909e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>BellWithBadge</div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <BellWithBadge size={24} />
              <BellWithBadge size={24} hasAlert />
              <BellWithBadge size={32} hasAlert />
            </div>
            <div style={{ fontSize: 12, color: '#8a909e', marginTop: 8 }}>no alert · alert · larger</div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#8a909e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>UserMenu</div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <UserMenu size={32} menuItems={SAMPLE_USER_MENU_ITEMS} placement="below" />
              <UserMenu size={40} menuItems={SAMPLE_USER_MENU_ITEMS} placement="below" />
            </div>
            <div style={{ fontSize: 12, color: '#8a909e', marginTop: 8 }}>32px · 40px (click to open)</div>
          </div>
        </div>
        <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <PropBadge value="items" />
          <PropBadge value="avatar" />
          <PropBadge value="paddingTop" />
          <PropBadge value="gap" />
        </div>
      </Card>
    </Section>
  );
}

function LocationSelectorSection() {
  return (
    <Section title="LocationSelector" description="Facility/community switcher shown below the logo in the sidebar.">
      <Card>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Expanded</div>
            <div style={{ background: 'var(--surface-sidePanels)', borderRadius: 10, padding: '8px 12px', width: 196 }}>
              <LocationSelector name="Drake Terrace" location="Wheaton, IL" onClick={() => {}} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Collapsed (icon only)</div>
            <div style={{ background: 'var(--surface-sidePanels)', borderRadius: 10, padding: '8px 12px', width: 60, display: 'flex', justifyContent: 'center' }}>
              <LocationSelector name="Drake Terrace" location="Wheaton, IL" collapsed onClick={() => {}} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Long name</div>
            <div style={{ background: 'var(--surface-sidePanels)', borderRadius: 10, padding: '8px 12px', width: 196 }}>
              <LocationSelector name="Midtown Commerce Facility" location="Chicago, IL" onClick={() => {}} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <PropBadge value="name" />
          <PropBadge value="location" />
          <PropBadge value="icon" />
          <PropBadge value="collapsed" />
          <PropBadge value="onClick" />
          <PropBadge value="onClickWithRect" />
        </div>
      </Card>
    </Section>
  );
}

function LocationPickerSection() {
  const [selected, setSelected] = useState('drake');
  const [open, setOpen] = useState(false);
  return (
    <Section title="LocationPicker" description="Dropdown overlay for switching between locations. Anchored to a button rect.">
      <Card>
        <Row label="Controls">
          <Button variant="CTA" size="Small" label={open ? 'Close picker' : 'Open picker'} onClick={() => setOpen((o) => !o)} />
          <span style={{ fontSize: 13, color: '#575d69' }}>Selected: <PropBadge value={selected} /></span>
        </Row>
        <div style={{ position: 'relative', minHeight: open ? 300 : 60 }}>
          {open && (
            <LocationPicker
              locations={SAMPLE_PICKER_LOCATIONS}
              selectedId={selected}
              mobile={false}
              onClose={() => setOpen(false)}
              onSelect={(id) => { setSelected(id); setOpen(false); }}
            />
          )}
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <PropBadge value="locations" />
          <PropBadge value="selectedId" />
          <PropBadge value="mobile" />
          <PropBadge value="anchorRect" />
          <PropBadge value="offsetLeft" />
          <PropBadge value="onClose" />
          <PropBadge value="onSelect" />
        </div>
      </Card>
    </Section>
  );
}

// ── Filter button sample data ─────────────────────────────────────────────────

const FILTER_BAR_GROUPS: FilterButtonGroup[] = [
  {
    id: 'dock-traffic',
    label: 'Dock Traffic',
    filters: [
      { id: 'available', label: 'Available',   count: 23, color: '#009cde' },
      { id: 'in-use',    label: 'In Use',       count: 28, color: '#43ac1d', textColor: '#348516' },
      { id: 'blocked',   label: 'Blocked',      count: 12, color: '#909090', textColor: '#6b6b6b' },
    ],
  },
  {
    id: 'efficiency',
    label: 'Efficiency',
    filters: [
      { id: 'in-detention',       label: 'In Detention',       count: 23, color: '#dc7a09' },
      { id: 'close-to-detention', label: 'Close to Detention', count: 28, color: '#fae366', textColor: '#695900' },
    ],
  },
  {
    id: 'safety',
    label: 'Safety',
    filters: [
      { id: 'restraint-bypass', label: 'Restraint Bypass', count: 23, color: '#d13b0b' },
    ],
  },
];

const FILTER_SETS: FilterSetData[] = [
  {
    id: 'trailer-status',
    label: 'Trailer Status',
    chips: [
      { id: 'in-yard',     label: 'In Yard',     count: 23, color: '#0a76db' },
      { id: 'at-dock',     label: 'At Dock',     count: 28, color: '#43ac1d', textColor: '#348516' },
      { id: 'checked-out', label: 'Checked Out', count: 12, color: '#909090', textColor: '#6b6b6b' },
    ],
  },
  {
    id: 'dock-fill',
    label: 'Dock Fill',
    chips: [
      { id: 'full',  label: 'Full',  count: 32, color: '#003b5c' },
      { id: 'empty', label: 'Empty', count: 27, color: '#d78207' },
    ],
  },
];

function FilterButtonSection() {
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<string | undefined>('dock-fill');
  const [activeChipIds, setActiveChipIds] = useState<string[]>([]);

  const toggle = (id: string) =>
    setActiveIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const toggleChip = (chipId: string, setId: string) => {
    // Selecting a chip also selects its set
    if (setId !== selectedSetId) setSelectedSetId(setId);
    setActiveChipIds((prev) =>
      prev.includes(chipId) ? prev.filter((x) => x !== chipId) : [...prev, chipId],
    );
  };

  return (
    <Section
      title="FilterButton, FilterButtonBar & FilterSetBar"
      description="Stat + filter chips in two layouts: grouped bar (FilterButtonBar) and selectable set pills (FilterSetBar)."
    >
      {/* Rendered directly on the gradient — no Card wrapper */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          FilterButtonBar — from Figma (multi-select)
        </div>
        <FilterButtonBar
          groups={FILTER_BAR_GROUPS}
          activeIds={activeIds}
          onFilterClick={toggle}
        />
        {activeIds.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active:</span>
            {activeIds.map((id) => <PropBadge key={id} value={id} />)}
            <Button variant="frameless" size="Small" label="Clear" onClick={() => setActiveIds([])} />
          </div>
        )}
      </div>

      <Card style={{ marginTop: 16 }}>
        <Row label="FilterButton — individual chips">
          <FilterButton label="Available"          count={23} color="#009cde" />
          <FilterButton label="In Use"             count={28} color="#43ac1d" textColor="#348516" />
          <FilterButton label="Blocked"            count={12} color="#909090" textColor="#6b6b6b" />
          <FilterButton label="In Detention"       count={5}  color="#dc7a09" />
          <FilterButton label="Close to Detention" count={8}  color="#fae366" textColor="#695900" />
          <FilterButton label="Restraint Bypass"   count={2}  color="#d13b0b" />
        </Row>
        <Row label="Active state">
          <FilterButton label="Available" count={23} color="#009cde" active />
          <FilterButton label="In Use"    count={28} color="#43ac1d" textColor="#348516" active />
          <FilterButton label="Danger"    count={2}  color="#d13b0b" active />
        </Row>
        <Row label="No count">
          <FilterButton label="Available"    color="#009cde" />
          <FilterButton label="In Use"       color="#43ac1d" textColor="#348516" />
          <FilterButton label="Long label that truncates" color="#909090" textColor="#6b6b6b" />
        </Row>
        <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <PropBadge value="label" />
          <PropBadge value="count" />
          <PropBadge value="color" />
          <PropBadge value="textColor" />
          <PropBadge value="active" />
          <PropBadge value="onClick" />
        </div>
      </Card>

      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          FilterButtonBar — display-only (no onClick)
        </div>
        <FilterButtonBar groups={FILTER_BAR_GROUPS} />
        <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <PropBadge value="groups" />
          <PropBadge value="activeIds" />
          <PropBadge value="onFilterClick" />
        </div>
      </div>

      {/* ── FilterSetBar ── */}
      <div style={{ marginTop: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
          FilterSetBar — click a set to select it, then click chips to filter
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
          The selected set shows a 2px accent border. Chips within any set can be toggled independently.
        </div>
        <FilterSetBar
          sets={FILTER_SETS}
          selectedSetId={selectedSetId}
          activeChipIds={activeChipIds}
          onSetClick={(id) => setSelectedSetId((prev) => prev === id ? undefined : id)}
          onChipClick={toggleChip}
        />
        {(selectedSetId || activeChipIds.length > 0) && (
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {selectedSetId && (
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Selected set: <strong style={{ color: 'var(--accent-primary)' }}>{selectedSetId}</strong>
              </span>
            )}
            {activeChipIds.length > 0 && (
              <>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Active chips:</span>
                {activeChipIds.map((id) => <PropBadge key={id} value={id} />)}
              </>
            )}
            <Button variant="frameless" size="Small" label="Clear" onClick={() => { setSelectedSetId(undefined); setActiveChipIds([]); }} />
          </div>
        )}
      </div>

      <Card title="FilterSetBar — props reference" style={{ marginTop: 20 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13, fontFamily: '"JetBrains Mono","Fira Code",monospace' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.04)' }}>
                {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['sets',           'FilterSetData[]',    '—',     'Array of set pills to render'],
                ['selectedSetId',  'string',             '—',     'Id of the currently selected set'],
                ['activeChipIds',  'string | string[]',  '—',     'Id(s) of active (filtered) chips'],
                ['onSetClick',     '(setId) => void',    '—',     'Called when a set pill is clicked'],
                ['onChipClick',    '(chipId, setId) => void', '—','Called when a chip is clicked'],
              ].map(([prop, type, def, desc]) => (
                <tr key={prop} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '6px 12px', color: 'var(--accent-primary)' }}>{prop}</td>
                  <td style={{ padding: '6px 12px', color: 'var(--text-muted)' }}>{type}</td>
                  <td style={{ padding: '6px 12px', color: 'var(--text-muted)' }}>{def}</td>
                  <td style={{ padding: '6px 12px' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Section>
  );
}

// ── Dock item sample data ──────────────────────────────────────────────────────

const DOCK_GRID_ITEMS: DockItemData[] = [
  { id: 'C01', status: 'maintenance',        title: 'Maintenance',                                  statusLabel: 'Dock Assigned',       time: '20 min' },
  { id: 'C02', status: 'maintenance',        title: 'Maintenance',                                  statusLabel: 'Dock Assigned',       time: '20 min' },
  { id: 'C05', status: 'active',             title: 'Manuso MKT',      reference: '451138948159993', statusLabel: 'Door Closed',         time: '1 hrs' },
  { id: 'C06', status: 'in-detention',       title: 'CTS Transportation', reference: '4511388854232', statusLabel: 'Door Closed',       time: '30 min in Detention', selected: true },
  { id: 'C07', status: 'active',             title: 'SAJACKS TRANS',   reference: '451138784778598', statusLabel: 'Truck at Dock',       time: '1 hrs' },
  { id: 'C08', status: 'in-detention',       title: 'RLS',             reference: '54113873986',     statusLabel: 'Door Open',           time: '27 min in Detention' },
  { id: 'C09', status: 'active',             title: 'AMICK',           reference: '4511391371807',   statusLabel: 'Truck at Dock',       time: '1 hrs' },
  { id: 'C11', status: 'in-detention',       title: 'Tyson',           reference: '451138628770738', statusLabel: 'Leveler Deployed',    time: '4 hrs in Detention' },
  { id: 'C12', status: 'close-to-detention', title: 'CH ROB WORLDWIDE 45113889675307',               statusLabel: 'Close to Detention',  time: '3 hrs' },
  { id: 'C13', status: 'active',             title: 'Amick Farms 4511244689202102',                  statusLabel: 'Truck Assigned',      time: '38 mins' },
  { id: 'C17', status: 'active',             title: 'Active',                                        statusLabel: 'Truck at Dock',       time: '36 min' },
  { id: 'C19', status: 'other',              title: 'Other',           reference: 'Note: McCain',    statusLabel: 'Dock Assigned',       time: '20 min' },
  { id: 'D01', status: 'available',          title: 'Dock Available',                                statusLabel: 'Dock Assigned' },
  { id: 'D02', status: 'in-detention',       title: 'Active',                                        statusLabel: 'In Detention',        time: '12 min' },
  { id: 'D04', status: 'offline',            title: 'Offline',                                       statusLabel: 'Dock Assigned',       time: '20 min' },
  { id: 'D06', status: 'restraint-bypass',   title: 'Active',                                        statusLabel: 'Restraint Bypassed',  time: '39 min' },
  { id: 'D09', status: 'available',          title: 'Dock Available',                                statusLabel: 'Dock Assigned',       time: '20 min' },
  { id: 'D14', status: 'close-to-detention', title: 'CH Robinson 44168187',                          statusLabel: 'Close to Detention',  time: '52 min' },
];

const VARIANT_ITEMS = [
  { status: 'maintenance'        as const, id: 'C01', title: 'Maintenance',        reference: undefined,          statusLabel: 'Dock Assigned',      time: '20 min' },
  { status: 'active'             as const, id: 'C07', title: 'SAJACKS TRANS',       reference: '451138784778598',  statusLabel: 'Truck at Dock',      time: '1 hrs' },
  { status: 'in-detention'       as const, id: 'C08', title: 'RLS',                 reference: '54113873986',      statusLabel: 'Door Open',          time: '27 min in Detention' },
  { status: 'close-to-detention' as const, id: 'C12', title: 'CH ROB WORLDWIDE',    reference: '45113889675307',   statusLabel: 'Close to Detention', time: '3 hrs' },
  { status: 'available'          as const, id: 'D01', title: 'Dock Available',       reference: undefined,          statusLabel: 'Dock Assigned',      time: undefined },
  { status: 'offline'            as const, id: 'D04', title: 'Offline',              reference: undefined,          statusLabel: 'Dock Assigned',      time: '20 min' },
  { status: 'restraint-bypass'   as const, id: 'D06', title: 'Active',               reference: undefined,          statusLabel: 'Restraint Bypassed', time: '39 min' },
  { status: 'other'              as const, id: 'C19', title: 'Other',                reference: 'Note: McCain',     statusLabel: 'Dock Assigned',      time: '20 min' },
];

function DockItemSection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const gridItems: DockItemData[] = DOCK_GRID_ITEMS.map((item) => ({
    ...item,
    selected: selectedIds.has(item.id),
  }));

  return (
    <Section
      title="DockItem & DockItemGrid"
      description="Dock status cards used in the operations grid view. Click any card to toggle its selected state."
    >
      {/* Individual variants */}
      <Card>
        <Row label="All status variants — click to select">
          {VARIANT_ITEMS.map((item) => (
            <DockItem
              key={item.id}
              {...item}
              selected={selectedIds.has(item.id)}
              onClick={() => toggle(item.id)}
            />
          ))}
        </Row>
        {selectedIds.size > 0 && (
          <Row label="Selected">
            {[...selectedIds].map((id) => <PropBadge key={id} value={id} />)}
            <Button variant="frameless" size="Small" label="Clear" onClick={() => setSelectedIds(new Set())} />
          </Row>
        )}
        <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <PropBadge value="id" />
          <PropBadge value="status" />
          <PropBadge value="title" />
          <PropBadge value="reference" />
          <PropBadge value="statusLabel" />
          <PropBadge value="time" />
          <PropBadge value="selected" />
          <PropBadge value="onClick" />
        </div>
      </Card>

      {/* Full grid */}
      <Card style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#8a909e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          DockItemGrid — {DOCK_GRID_ITEMS.length} items (click to select)
          {selectedIds.size > 0 && (
            <Button variant="frameless" size="Small" label="Clear all" onClick={() => setSelectedIds(new Set())}
              style={{ marginLeft: 8, verticalAlign: 'middle' }} />
          )}
        </div>
        <DockItemGrid
          items={gridItems}
          onItemClick={(id) => toggle(id)}
        />
        <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <PropBadge value="items" />
          <PropBadge value="onItemClick" />
        </div>
      </Card>
    </Section>
  );
}

const ICON_GRID = [
  // Nav icons — outlined (`active={false}`) and filled (`active`, as in SideNavigation when selected)
  { label: 'DashboardIcon (outlined)', el: <DashboardIcon /> },
  { label: 'DashboardIcon (active)', el: <DashboardIcon active /> },
  { label: 'UsersIcon (outlined)', el: <UsersIcon /> },
  { label: 'UsersIcon (active)', el: <UsersIcon active /> },
  { label: 'MonitorIcon (outlined)', el: <MonitorIcon /> },
  { label: 'MonitorIcon (active)', el: <MonitorIcon active /> },
  { label: 'AccessIcon (outlined)', el: <AccessIcon /> },
  { label: 'AccessIcon (active)', el: <AccessIcon active /> },
  { label: 'AnalyzeIcon (outlined)', el: <AnalyzeIcon /> },
  { label: 'AnalyzeIcon (active)', el: <AnalyzeIcon active /> },
  { label: 'SettingsIcon (outlined)', el: <SettingsIcon /> },
  { label: 'SettingsIcon (active)', el: <SettingsIcon active /> },
  { label: 'PlansIcon (outlined)', el: <PlansIcon /> },
  { label: 'PlansIcon (active)', el: <PlansIcon active /> },
  { label: 'OperationsIcon (outlined)', el: <OperationsIcon /> },
  { label: 'OperationsIcon (active)', el: <OperationsIcon active /> },
  { label: 'ScheduleIcon (outlined)', el: <ScheduleIcon /> },
  { label: 'ScheduleIcon (active)', el: <ScheduleIcon active /> },
  { label: 'DataIcon (outlined)', el: <DataIcon /> },
  { label: 'DataIcon (active)', el: <DataIcon active /> },
  { label: 'BellOutlinedIcon',      el: <BellOutlinedIcon /> },
  { label: 'BellFilledIcon',        el: <BellFilledIcon /> },
  { label: 'SearchDefaultIcon',     el: <SearchDefaultIcon /> },
  { label: 'EditOutlinedIcon',      el: <EditOutlinedIcon /> },
  { label: 'DeleteOutlinedIcon',    el: <DeleteOutlinedIcon /> },
  { label: 'DownloadOutlinedIcon',  el: <DownloadOutlinedIcon /> },
  { label: 'FilterDefaultIcon',     el: <FilterDefaultIcon /> },
  { label: 'HomeOutlinedIcon',      el: <HomeOutlinedIcon /> },
  { label: 'InfoInfoOutlinedIcon',  el: <InfoInfoOutlinedIcon /> },
  { label: 'InfoWarningOutlinedIcon', el: <InfoWarningOutlinedIcon /> },
  { label: 'InfoEventOutlinedIcon', el: <InfoEventOutlinedIcon /> },
  { label: 'CheckmarkOutlinedIcon', el: <CheckmarkOutlinedIcon /> },
  { label: 'CloseDefaultIcon',      el: <CloseDefaultIcon /> },
  { label: 'DoorsOpenIcon',         el: <DoorsOpenIcon /> },
  { label: 'DoorsClosedIcon',       el: <DoorsClosedIcon /> },
  { label: 'GateOpenIcon',          el: <GateOpenIcon /> },
  { label: 'GateClosedIcon',        el: <GateClosedIcon /> },
  { label: 'LockRoundedLockedIcon', el: <LockRoundedLockedIcon /> },
  { label: 'LockRoundedUnlockedIcon', el: <LockRoundedUnlockedIcon /> },
  { label: 'UserOutlinedDefaultIcon', el: <UserOutlinedDefaultIcon /> },
  { label: 'PeopleOutlinedIcon',    el: <PeopleOutlinedIcon /> },
  { label: 'CameraDefaultOutlinedIcon', el: <CameraDefaultOutlinedIcon /> },
  { label: 'CalendarDefaultOutlinedIcon', el: <CalendarDefaultOutlinedIcon /> },
  { label: 'StarOutlinedIcon',      el: <StarOutlinedIcon /> },
  { label: 'StarFilledIcon',        el: <StarFilledIcon /> },
  { label: 'MoreVerticalIcon',      el: <MoreVerticalIcon /> },
  { label: 'MoreHorizontalIcon',    el: <MoreHorizontalIcon /> },
];

function IconsSection() {
  const [search, setSearch] = useState('');
  const filtered = ICON_GRID.filter((i) => i.label.toLowerCase().includes(search.toLowerCase()));
  return (
    <Section title="Icons" description="Sampler of nav icons (outlined vs active/filled) and general-purpose icons from the library. Nav icons use the same component with the active prop for the filled state used in SideNavigation. 200+ total icons available.">
      <Card>
        <Row label="Search">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter icons…"
            style={{
              height: 36,
              border: '1px solid #d1d7e3',
              borderRadius: 8,
              padding: '0 12px',
              fontSize: 13,
              fontFamily: 'inherit',
              outline: 'none',
              width: 220,
              color: '#17191c',
              background: '#fafbfc',
            }}
          />
          <span style={{ fontSize: 13, color: '#8a909e' }}>{filtered.length} / {ICON_GRID.length} shown (of 200+ total)</span>
        </Row>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
          {filtered.map((icon) => (
            <div
              key={icon.label}
              title={icon.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '12px 8px',
                borderRadius: 8,
                background: '#f9fafb',
                border: '1px solid #eef0f5',
                cursor: 'default',
              }}
            >
              <span style={{ color: '#32363d', display: 'flex' }}>{icon.el}</span>
              <span style={{ fontSize: 10, color: '#8a909e', textAlign: 'center', wordBreak: 'break-all', lineHeight: 1.3 }}>{icon.label.replace(/Icon/g, '')}</span>
            </div>
          ))}
        </div>
      </Card>
    </Section>
  );
}

// ── Color palette groups ───────────────────────────────────────────────────────

const COLOR_GROUPS: { label: string; prefix: string }[] = [
  { label: 'Primary',   prefix: 'lightPrimary' },
  { label: 'Secondary', prefix: 'lightSecondary' },
  { label: 'Tertiary',  prefix: 'lightTertiary' },
  { label: 'Red',       prefix: 'lightRed' },
  { label: 'Danger',    prefix: 'lightDanger' },
  { label: 'Warning',   prefix: 'lightWarning' },
  { label: 'Success',   prefix: 'lightSuccess' },
  { label: 'Slate',     prefix: 'lightSlate' },
  { label: 'Neutral',   prefix: 'lightNeutral' },
  { label: 'Midgreen',  prefix: 'lightMidgreen' },
];

function getColorEntries(prefix: string) {
  return Object.entries(colors).filter(([k]) => k.startsWith(prefix));
}

function isDark(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function TokensSection() {
  return (
    <Section title="Design Tokens" description="Color palettes, typography scales, and spacing extracted from Figma.">
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#17191c', margin: '0 0 16px' }}>Color Palettes</h3>
        {COLOR_GROUPS.map((group) => {
          const entries = getColorEntries(group.prefix);
          return (
            <div key={group.prefix} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#8a909e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{group.label}</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {entries.map(([key, val]) => (
                  <div
                    key={key}
                    title={`${key}: ${val}`}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 6,
                      background: val as string,
                      border: '1px solid rgba(0,0,0,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'default',
                    }}
                  >
                    <span style={{ fontSize: 8, color: isDark(val as string) ? '#fff' : '#000', opacity: 0.7, fontFamily: 'monospace' }}>
                      {(val as string).toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div style={{ borderTop: '1px solid #e4e8f2', paddingTop: 24, marginTop: 8 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#17191c', margin: '0 0 16px' }}>Typography Scale</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <span style={{ fontSize: Number(typography.fontsizeHeadlineHl2), fontWeight: 600, lineHeight: `${typography.lineheightHeadlineHl2}px`, color: '#17191c' }}>Headline HL2</span>
              <PropBadge value={`${typography.fontsizeHeadlineHl2}px / ${typography.lineheightHeadlineHl2}px line-height`} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <span style={{ fontSize: Number(typography.fontsizeBodyLg), fontWeight: 500, lineHeight: `${typography.lineheightBodyLg}px`, color: '#17191c' }}>Body Large</span>
              <PropBadge value={`${typography.fontsizeBodyLg}px / ${typography.lineheightBodyLg}px line-height`} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <span style={{ fontSize: Number(typography.fontsizeHeaderH2), fontWeight: 600, lineHeight: `${typography.lineheightHeaderH2}px`, color: '#17191c' }}>Header H2</span>
              <PropBadge value={`${typography.fontsizeHeaderH2}px / ${typography.lineheightHeaderH2}px line-height`} />
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e4e8f2', paddingTop: 24, marginTop: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#17191c', margin: '0 0 16px' }}>Spacing Scale</h3>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {Object.entries(spacing).filter(([k]) => k.startsWith('spacing')).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ background: '#0a76db', borderRadius: 4, height: Number(val), width: 24 }} />
                <PropBadge value={`${val}px`} />
                <span style={{ fontSize: 10, color: '#8a909e' }}>{key.replace('spacing', '')}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e4e8f2', paddingTop: 24, marginTop: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#17191c', margin: '0 0 16px' }}>Semantic Colors (sampler)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
            {Object.entries(semanticcolors).slice(0, 24).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: 4, background: val as string, border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 10, color: '#17191c', fontFamily: 'monospace', wordBreak: 'break-all' }}>{key}</div>
                  <div style={{ fontSize: 10, color: '#8a909e', fontFamily: 'monospace' }}>{val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </Section>
  );
}

// ── Switch section (Figma node 101:17956) ─────────────────────────────────────

function SwitchSection() {
  const [zoneView, setZoneView] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <Section
      title="Switch"
      description="Android-style pill toggle with optional label. Matches Enterprise Color Tokens — frame node 101:17956 (Zone View row)."
    >
      <Card>
        <Row label="Figma reference — Zone View (off by default in design)">
          <Switch label="Zone View" checked={zoneView} onCheckedChange={setZoneView} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary, #575d69)' }}>
            State: <PropBadge value={zoneView ? 'on' : 'off'} />
          </span>
        </Row>
        <Row label="Without label">
          <Switch checked={notifications} onCheckedChange={setNotifications} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary, #575d69)' }}>
            Notifications <PropBadge value={notifications ? 'on' : 'off'} />
          </span>
        </Row>
        <Row label="Uncontrolled default on">
          <Switch label="Auto-save" defaultChecked />
        </Row>
        <Row label="Disabled">
          <Switch label="Disabled off" disabled checked={false} onCheckedChange={() => {}} />
          <Switch label="Disabled on" disabled checked onCheckedChange={() => {}} />
        </Row>
        <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <PropBadge value="label" />
          <PropBadge value="checked" />
          <PropBadge value="defaultChecked" />
          <PropBadge value="onCheckedChange" />
          <PropBadge value="disabled" />
        </div>
      </Card>
    </Section>
  );
}

// ── IconButton section ────────────────────────────────────────────────────────

const ACTIONS_ITEMS: IconButtonItem[] = [
  { id: 'edit',     label: 'Edit' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'export',   label: 'Export' },
  { id: 'delete',   label: 'Delete', destructive: true, dividerBefore: true },
];

function IconButtonSection() {
  const [activeFilter, setActiveFilter] = useState(false);
  const [activeSort,   setActiveSort]   = useState(false);
  const [lastAction,   setLastAction]   = useState<string | null>(null);

  return (
    <Section
      title="IconButton"
      description="Frosted-glass action button — icon+label, label+dropdown, and icon-only variants. Nodes 106:19959, 106:19970, 106:19982."
    >
      {/* Row: default / hover / active side by side */}
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary, #17191c)', margin: '0 0 16px' }}>Icon + Label</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary, #888)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Filter button</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                <IconButton
                  icon={<FilterDefaultIcon />}
                  label="Filter"
                  active={activeFilter}
                  onClick={() => setActiveFilter((v) => !v)}
                />
                <span style={{ fontSize: 11, color: 'var(--text-secondary, #888)' }}>{activeFilter ? 'active (click to deselect)' : 'default (click to select)'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                <IconButton icon={<FilterDefaultIcon />} label="Filter" disabled />
                <span style={{ fontSize: 11, color: 'var(--text-secondary, #888)' }}>disabled</span>
              </div>
            </div>
          </div>

          {/* Sort */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary, #888)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sort button</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                <IconButton
                  icon={<ReorderV3DefaultIcon />}
                  label="Sort"
                  active={activeSort}
                  onClick={() => setActiveSort((v) => !v)}
                />
                <span style={{ fontSize: 11, color: 'var(--text-secondary, #888)' }}>{activeSort ? 'active (click to deselect)' : 'default (click to select)'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                <IconButton icon={<ReorderV3DefaultIcon />} label="Sort" disabled />
                <span style={{ fontSize: 11, color: 'var(--text-secondary, #888)' }}>disabled</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary, #17191c)', margin: '0 0 16px' }}>Label + Dropdown (Actions)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
              <IconButton
                label="Actions"
                items={ACTIONS_ITEMS}
                onItemClick={(id) => setLastAction(id)}
              />
              <span style={{ fontSize: 11, color: 'var(--text-secondary, #888)' }}>click to open</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
              <IconButton label="Actions" items={ACTIONS_ITEMS} disabled />
              <span style={{ fontSize: 11, color: 'var(--text-secondary, #888)' }}>disabled</span>
            </div>
          </div>
          {lastAction && (
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary, #888)' }}>
              Last action: <strong style={{ color: 'var(--text-primary, #656565)' }}>{lastAction}</strong>
            </p>
          )}
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary, #17191c)', margin: '0 0 16px' }}>Grouped toolbar example</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <IconButton
            icon={<FilterDefaultIcon />}
            label="Filter"
            active={activeFilter}
            onClick={() => setActiveFilter((v) => !v)}
          />
          <IconButton
            icon={<ReorderV3DefaultIcon />}
            label="Sort"
            active={activeSort}
            onClick={() => setActiveSort((v) => !v)}
          />
          <IconButton
            label="Actions"
            items={ACTIONS_ITEMS}
            onItemClick={(id) => setLastAction(id)}
          />
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary, #17191c)', margin: '0 0 16px' }}>Props reference</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13, fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.04)' }}>
                {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['label', 'string', '—', 'Visible label text'],
                ['icon', 'ReactNode', '—', 'Leading icon (16×16 recommended)'],
                ['items', 'IconButtonItem[]', '—', 'Dropdown items — adds chevron & panel'],
                ['onItemClick', '(id: string) => void', '—', 'Callback when a dropdown item is clicked'],
                ['active', 'boolean', 'false', 'Selected / active state'],
                ['disabled', 'boolean', 'false', 'Disabled state'],
                ['onClick', '() => void', '—', 'Click handler (ignored when items present)'],
              ].map(([prop, type, def, desc]) => (
                <tr key={prop} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '6px 12px', color: 'var(--accent-primary, #0a76db)' }}>{prop}</td>
                  <td style={{ padding: '6px 12px', color: 'var(--text-secondary, #888)' }}>{type}</td>
                  <td style={{ padding: '6px 12px', color: 'var(--text-secondary, #888)' }}>{def}</td>
                  <td style={{ padding: '6px 12px' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Section>
  );
}

// ── ShipmentPanel section ─────────────────────────────────────────────────────

const SAMPLE_SHIPMENTS: ShipmentItemData[] = [
  { id: '010203040506', createdAt: 'Created 5/23/2024 08:12am', direction: 'IB / DL', barColor: '#009cde' },
  { id: '020304050607', createdAt: 'Created 5/23/2024 09:45am', direction: 'OB',      barColor: '#43ac1d' },
  { id: '030405060708', createdAt: 'Created 5/23/2024 10:00am', direction: 'IB',      barColor: '#dc7a09' },
  { id: '040506070809', createdAt: 'Created 5/23/2024 11:15am', direction: 'IB / DL', barColor: '#d13b0b' },
  { id: '050607080910', createdAt: 'Created 5/23/2024 12:00pm', direction: 'OB',      barColor: '#909090' },
  { id: '060708091011', createdAt: 'Created 5/23/2024 01:30pm', direction: 'IB',      barColor: '#009cde' },
  { id: '070809101112', createdAt: 'Created 5/23/2024 02:45pm', direction: 'IB / DL', barColor: '#43ac1d' },
];

function ShipmentPanelSection() {
  const navigate = useNavigate();

  return (
    <Section
      title="ShipmentPanel & ShipmentItem"
      description="Side panel with a header and a scrollable list of shipment rows. Matches nodes 84:6766–84:6831 in Enterprise Color Tokens."
    >
      {/* Full panel — on the gradient background, no card wrapper */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          ShipmentPanel — full panel (click a row to open details; header chevron expands/collapses the list only)
        </div>
        <ShipmentPanel
          title="Shipments"
          items={SAMPLE_SHIPMENTS}
          onItemClick={(id) => navigate(`/showcase/shipment/${encodeURIComponent(id)}`)}
          style={{ maxHeight: 480 }}
        />
      </div>

      {/* Header standalone */}
      <Card style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary, #17191c)', margin: '0 0 16px' }}>ShipmentPanelHeader — standalone</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Expanded</div>
            <ShipmentPanelHeader title="Shipments" collapsed={false} style={{ borderRadius: 12 }} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Collapsed</div>
            <ShipmentPanelHeader title="Shipments" collapsed={true} style={{ borderRadius: 12 }} />
          </div>
        </div>
      </Card>

      {/* Individual items */}
      <Card style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary, #17191c)', margin: '0 0 16px' }}>ShipmentItem — states</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Default (various bar colors)</div>
          <ShipmentItem id="010203040506" createdAt="Created 5/23/2024 08:12am" direction="IB / DL" barColor="#009cde" />
          <ShipmentItem id="020304050607" createdAt="Created 5/23/2024 09:45am" direction="OB"      barColor="#43ac1d" />
          <ShipmentItem id="030405060708" createdAt="Created 5/23/2024 10:00am" direction="IB"      barColor="#dc7a09" />

          <div style={{ height: 8 }} />
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Selected</div>
          <ShipmentItem id="010203040506" createdAt="Created 5/23/2024 08:12am" direction="IB / DL" barColor="#009cde" selected />

          <div style={{ height: 8 }} />
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>No drag handle / no calendar</div>
          <ShipmentItem id="040506070809" createdAt="Created 5/23/2024 11:15am" direction="IB / DL" barColor="#d13b0b" showDragHandle={false} showCalendar={false} />
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary, #17191c)', margin: '0 0 16px' }}>Props reference</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13, fontFamily: '"JetBrains Mono","Fira Code",monospace' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.04)' }}>
                {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['id',             'string',                '—',       'Shipment ID / primary label'],
                ['createdAt',      'string',                '—',       'Secondary subtitle line'],
                ['direction',      'string',                '—',       'Direction badge, e.g. "IB / DL"'],
                ['barColor',       'string',                '"#ccc"',  'Left accent bar color'],
                ['selected',       'boolean',               'false',   'Selected / active state'],
                ['showDragHandle', 'boolean',               'true',    'Show 6-dot drag handle'],
                ['showCalendar',   'boolean',               'true',    'Show calendar icon'],
                ['icon',           'ReactNode',             'pallet',  'Leading icon override'],
                ['onClick',        '() => void',            '—',       'Row click handler'],
              ].map(([prop, type, def, desc]) => (
                <tr key={prop} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '6px 12px', color: 'var(--accent-primary)' }}>{prop}</td>
                  <td style={{ padding: '6px 12px', color: 'var(--text-muted)' }}>{type}</td>
                  <td style={{ padding: '6px 12px', color: 'var(--text-muted)' }}>{def}</td>
                  <td style={{ padding: '6px 12px' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Section>
  );
}

// ── UnassignedTrailerPanel section ───────────────────────────────────────────

const SAMPLE_UNASSIGNED_TRAILERS: UnassignedTrailerItemData[] = [
  { id: 'ut-01', carrier: 'JB Hunt',      trailerNumber: 'T-1234', trailerId: '1234567890', barColor: '#143c5c' },
  { id: 'ut-02', carrier: 'JB Hunt',      trailerNumber: 'T-2345', trailerId: '2345678901', barColor: '#f59e0b' },
  { id: 'ut-03', carrier: 'Werner',        trailerNumber: 'T-3456', trailerId: '3456789012', barColor: '#143c5c' },
  { id: 'ut-04', carrier: 'Swift',         trailerNumber: 'T-4567', trailerId: '4567890123', barColor: '#f59e0b' },
  { id: 'ut-05', carrier: 'Old Dominion',  trailerNumber: 'T-5678', trailerId: '5678901234', barColor: '#143c5c' },
];

function UnassignedTrailerSection() {
  return (
    <Section
      title="UnassignedTrailerPanel & UnassignedTrailerItem"
      description="Collapsible panel listing unassigned trailers. Click a row to see the sliding detail view. Rows are draggable via HTML5 DnD."
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          Full panel (click a row to open details; header chevron expands/collapses)
        </div>
        <UnassignedTrailerPanel
          items={SAMPLE_UNASSIGNED_TRAILERS}
          width={426}
        />
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Header — expanded</div>
          <UnassignedTrailerPanelHeader count={5} collapsed={false} style={{ borderRadius: 12, width: 426 }} />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Header — collapsed</div>
          <UnassignedTrailerPanelHeader count={5} collapsed={true} style={{ borderRadius: 12, width: 426 }} />
        </div>
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
        UnassignedTrailerItem — states
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 426 }}>
        <UnassignedTrailerItem id="ut-01" carrier="JB Hunt"     trailerNumber="T-1234" trailerId="1234567890" barColor="#143c5c" />
        <UnassignedTrailerItem id="ut-02" carrier="JB Hunt"     trailerNumber="T-2345" trailerId="2345678901" barColor="#f59e0b" />
        <UnassignedTrailerItem id="ut-03" carrier="Werner"      trailerNumber="T-3456" trailerId="3456789012" barColor="#143c5c" selected />
        <UnassignedTrailerItem id="ut-04" carrier="Swift"       trailerNumber="T-4567" trailerId="4567890123" barColor="#f59e0b" showDragHandle={false} />
      </div>
    </Section>
  );
}

// ── SearchBar section ─────────────────────────────────────────────────────────

const SEARCH_OPTIONS: SearchOption[] = [
  { value: 'carrier',  label: 'Carrier',  placeholder: 'Search by carrier name…' },
  { value: 'shipment', label: 'Shipment', placeholder: 'Search by shipment ID (min 3 chars)' },
  { value: 'dock',     label: 'Dock',     placeholder: 'Search by dock name or number…' },
  { value: 'driver',   label: 'Driver',   placeholder: 'Search by driver name or ID…' },
  { value: 'trailer',  label: 'Trailer',  placeholder: 'Search by trailer number…' },
];

function SearchBarSection() {
  const [query, setQuery] = useState('');
  const [option, setOption] = useState(SEARCH_OPTIONS[0].value);
  const [lastSearch, setLastSearch] = useState<{ query: string; option: string } | null>(null);

  return (
    <Section
      title="SearchBar"
      subtitle="Type-selector dropdown + text input. The placeholder updates with the selected type, and the border switches to accent on focus. Matches node 84:6448."
    >
      {/* Live demo — on gradient, no card */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          Interactive (click the type selector, then type and press Enter)
        </div>
        <SearchBar
          options={SEARCH_OPTIONS}
          selectedOption={option}
          onOptionChange={setOption}
          value={query}
          onChange={(q) => setQuery(q)}
          onSearch={(q, o) => setLastSearch({ query: q, option: o })}
        />
        {lastSearch && (
          <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text-muted)' }}>
            Last search: <strong style={{ color: 'var(--text-primary)' }}>"{lastSearch.query}"</strong>
            {' '}in <strong style={{ color: 'var(--accent-primary)' }}>{lastSearch.option}</strong>
          </div>
        )}
      </div>

      <Card title="States" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Default (unfocused)</div>
            <SearchBar options={SEARCH_OPTIONS} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Disabled</div>
            <SearchBar options={SEARCH_OPTIONS} disabled />
          </div>
        </div>
      </Card>

      <Card title="Props reference" style={{ marginTop: 16 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13, fontFamily: '"JetBrains Mono","Fira Code",monospace' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.04)' }}>
                {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['options',         'SearchOption[]',    '—',     'Type options for the left dropdown'],
                ['selectedOption',  'string',            '—',     'Controlled selected type value'],
                ['onOptionChange',  '(value) => void',   '—',     'Called when type selection changes'],
                ['value',           'string',            '—',     'Controlled search query'],
                ['onChange',        '(q, type) => void', '—',     'Called on every keystroke'],
                ['onSearch',        '(q, type) => void', '—',     'Called on Enter key press'],
                ['defaultOption',   'string',            'first', 'Initial selected type (uncontrolled)'],
                ['disabled',        'boolean',           'false', 'Disables all interaction'],
              ].map(([prop, type, def, desc]) => (
                <tr key={prop} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '6px 12px', color: 'var(--accent-primary)' }}>{prop}</td>
                  <td style={{ padding: '6px 12px', color: 'var(--text-muted)' }}>{type}</td>
                  <td style={{ padding: '6px 12px', color: 'var(--text-muted)' }}>{def}</td>
                  <td style={{ padding: '6px 12px' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Section>
  );
}

// ── Main ShowcasePage ─────────────────────────────────────────────────────────

export function ShowcasePage() {
  const [activeSection, setActiveSection] = useState<SideSection>('button');
  const { mode, toggleMode, presets, activeIndex, setActiveIndex } = useTheme();

  const renderSection = () => {
    switch (activeSection) {
      case 'button':          return <ButtonSection />;
      case 'navitem':         return <NavItemSection />;
      case 'tabs':            return <TabsSection />;
      case 'subnav':          return <SubNavSection />;
      case 'sidenavigation':  return <SideNavigationSection />;
      case 'leftnav':         return <LeftNavSection />;
      case 'topnav':          return <TopNavSection />;
      case 'rightnav':        return <RightNavSection />;
      case 'locationselector': return <LocationSelectorSection />;
      case 'locationpicker':  return <LocationPickerSection />;
      case 'filterbutton':    return <FilterButtonSection />;
      case 'dockitem':        return <DockItemSection />;
      case 'iconbutton':      return <IconButtonSection />;
      case 'shipmentpanel':      return <ShipmentPanelSection />;
      case 'unassignedtrailer':  return <UnassignedTrailerSection />;
      case 'searchbar':       return <SearchBarSection />;
      case 'switch':          return <SwitchSection />;
      case 'icons':           return <IconsSection />;
      case 'tokens':          return <TokensSection />;
      default:                return null;
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      background: `linear-gradient(160deg, var(--accent-gradient-start) 0%, var(--accent-gradient-end) 100%)`,
    }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: 224,
        flexShrink: 0,
        background: 'var(--surface-sidePanels)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRight: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border-default)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: 4 }}>
            @component-library/core
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Component Showcase</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>v0.1.0</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
          {SECTIONS.map((s) => {
            const isActive = s.id === activeSection;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: isActive ? 'var(--accent-subtle-bg)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 2,
                  transition: 'background 0.12s',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {s.label}
                  {s.isNew && (
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', background: 'var(--accent-primary)', color: '#fff', borderRadius: 4, padding: '1px 5px' }}>New</span>
                  )}
                </span>
                {isActive && <ChevronIcon />}
              </button>
            );
          })}
        </nav>

        {/* ── Theme switcher ── */}
        <div style={{ padding: '14px 12px 10px', borderTop: '1px solid var(--border-default)' }}>
          {/* Day / Night toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)' }}>
              Theme
            </span>
            <button
              type="button"
              onClick={toggleMode}
              title={mode === 'day' ? 'Switch to night mode' : 'Switch to day mode'}
              style={{
                display:        'flex',
                alignItems:     'center',
                gap:            5,
                padding:        '4px 10px',
                borderRadius:   20,
                border:         '1px solid var(--border-default)',
                background:     'var(--surface-elevated)',
                color:          'var(--text-primary)',
                fontSize:       12,
                fontWeight:     500,
                fontFamily:     'inherit',
                cursor:         'pointer',
                transition:     'background 0.12s, border-color 0.12s',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{ fontSize: 13 }}>{mode === 'day' ? '☀️' : '🌙'}</span>
              <span style={{ textTransform: 'capitalize' }}>{mode}</span>
            </button>
          </div>

          {/* Accent color presets */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {presets.map((preset, i) => {
              const isChosen = i === activeIndex;
              return (
                <button
                  key={preset.label}
                  type="button"
                  title={preset.label}
                  onClick={() => setActiveIndex(i)}
                  style={{
                    width:        24,
                    height:       24,
                    borderRadius: '50%',
                    border:       isChosen
                      ? `2px solid var(--text-primary)`
                      : '2px solid transparent',
                    padding:      isChosen ? 2 : 0,
                    background:   'transparent',
                    cursor:       'pointer',
                    flexShrink:   0,
                    outline:      isChosen ? `2px solid ${preset.primary}` : 'none',
                    outlineOffset: isChosen ? '1px' : '0',
                    transition:   'outline 0.12s, border 0.12s',
                  }}
                >
                  <span style={{
                    display:      'block',
                    width:        '100%',
                    height:       '100%',
                    borderRadius: '50%',
                    background:   preset.primary,
                  }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 20px 12px', borderTop: '1px solid var(--border-default)', fontSize: 11, color: 'var(--text-muted)' }}>
          © 2026 LiftMaster
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '40px 48px',
        minWidth: 0,
      }}>
        <div style={{ maxWidth: 900 }}>
          {renderSection()}
        </div>
      </main>
    </div>
  );
}

export default ShowcasePage;
