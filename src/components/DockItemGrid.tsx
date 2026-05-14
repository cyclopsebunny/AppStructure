import React from 'react';
import { DockItem } from './DockItem';
import type { DockItemProps, DockStatus } from './DockItem';

// ── Public types ──────────────────────────────────────────────────────────────

export interface DockItemData extends Omit<DockItemProps, 'onClick' | 'className' | 'style'> {
  /** Unique key — defaults to `id` if not provided */
  key?: string;
}

export interface DockItemGridProps {
  /** Array of dock items to render in the grid */
  items: DockItemData[];
  /** Called when a dock item is clicked */
  onItemClick?: (id: string, status: DockStatus) => void;
  /** Additional CSS class on the root element */
  className?: string;
  /** Additional inline styles on the root element */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * DockItemGrid
 *
 * A responsive flex-wrap grid of `DockItem` cards. Matches the `grid` section
 * of the dock operations view (node 101:17959 in the Enterprise Color Tokens file).
 *
 * Items fill available width, each 160–170 px wide, with 12 px gaps.
 *
 * @example
 * ```tsx
 * <DockItemGrid
 *   items={docks}
 *   onItemClick={(id) => navigate(`/docks/${id}`)}
 * />
 * ```
 */
export const DockItemGrid: React.FC<DockItemGridProps> = ({
  items,
  onItemClick,
  className,
  style,
}) => (
  <div
    className={className}
    style={{
      display:   'flex',
      flexWrap:  'wrap',
      gap:       12,
      alignContent: 'flex-start',
      ...style,
    }}
  >
    {items.map((item) => {
      const { key, ...rest } = item;
      return (
        <DockItem
          key={key ?? item.id}
          {...rest}
          onClick={onItemClick ? () => onItemClick(item.id, item.status) : undefined}
        />
      );
    })}
  </div>
);

export default DockItemGrid;
