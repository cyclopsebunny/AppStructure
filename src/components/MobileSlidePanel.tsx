import { useState, useRef, useEffect, useLayoutEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

// ── MobileSlidePanel ──────────────────────────────────────────────────────────

const SLIDE_MS = 320; // must match slideEasing duration below

export interface MobileSlidePanelProps {
  /** Whether the detail panel is visible */
  open: boolean;
  /** Called when the user taps Back or completes a right-swipe gesture */
  onBack: () => void;
  /** Content for the main (left) panel — always mounted, slides out left when detail opens */
  main: ReactNode;
  /** Content for the detail (right) panel — slides in from the right when open */
  detail?: ReactNode;
}

/**
 * MobileSlidePanel
 *
 * Mirrors the SubPageLayout mobile pattern: a sentinel div occupies the
 * normal-flow space so the surrounding layout is unaffected, while the
 * actual panels are portalled to `document.body` with `position:fixed`.
 *
 * When `open` is false the main panel is shown at x=0.
 * When `open` is true the main panel slides out to the left and the detail
 * panel slides in from the right — matching the Settings page behaviour.
 *
 * Supports right-swipe-to-back with an 80 px threshold.
 */
export function MobileSlidePanel({ open, onBack, main, detail }: MobileSlidePanelProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [portalRect, setPortalRect] = useState<{ top: number; height: number } | null>(null);
  const [dragPx, setDragPx] = useState(0);
  const touchStartX = useRef(0);
  const dragging    = useRef(false);

  // Keep detail content alive during the exit animation so the slide-out plays
  // before the node is unmounted. The parent clears `detail` at the same time
  // it sets `open=false`, which would otherwise cause an instant blink.
  const [frozenDetail, setFrozenDetail] = useState<ReactNode>(detail);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      // Opening (or content change while open): cancel pending clear, update.
      if (clearTimer.current) { clearTimeout(clearTimer.current); clearTimer.current = null; }
      setFrozenDetail(detail);
    } else {
      // Closing: let content persist until the slide-out animation finishes.
      clearTimer.current = setTimeout(() => { setFrozenDetail(undefined); }, SLIDE_MS + 50);
    }
    return () => { if (clearTimer.current) clearTimeout(clearTimer.current); };
  }, [open, detail]);

  const measure = () => {
    if (!sentinelRef.current) return;
    const r = sentinelRef.current.getBoundingClientRect();
    setPortalRect({ top: Math.round(r.top), height: Math.round(r.height) });
  };

  useLayoutEffect(measure, []);
  useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  // Re-measure whenever open changes so the panel lands at the correct position
  // even if the filter bar / toolbar changed height between renders.
  useEffect(measure, [open]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (!open) return;
    touchStartX.current = e.touches[0].clientX;
    dragging.current    = true;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current) return;
    const delta = e.touches[0].clientX - touchStartX.current;
    if (delta > 0) setDragPx(Math.min(delta, window.innerWidth));
  };
  const onTouchEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (dragPx > 80) onBack();
    setDragPx(0);
  };

  const slideEasing = 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)';
  const mobilePad   = 12;

  // Main slides left; detail slides in from right — mirroring SubPageLayout.
  const mainX   = open ? `calc(-100vw + ${dragPx}px)` : '0px';
  const detailX = open ? `${dragPx}px` : '100vw';

  const panelBase: React.CSSProperties = {
    position:      'absolute',
    top:           0,
    left:          0,
    width:         '100vw',
    height:        '100%',
    willChange:    'transform',
    display:       'flex',
    flexDirection: 'column',
    padding:       `0 ${mobilePad}px`,
    boxSizing:     'border-box',
  };

  const portalContent = portalRect && createPortal(
    <div
      style={{
        position:  'fixed',
        top:       portalRect.top,
        left:      0,
        width:     '100vw',
        height:    portalRect.height,
        zIndex:    190,
        overflow:  'hidden',
        boxSizing: 'border-box',
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Main panel — slides out to the left when detail opens */}
      <div style={{
        ...panelBase,
        transform:  `translateX(${mainX})`,
        transition: dragPx > 0 ? 'none' : slideEasing,
      }}>
        {main}
      </div>

      {/* Detail panel — slides in from the right */}
      <div style={{
        ...panelBase,
        transform:  `translateX(${detailX})`,
        transition: dragPx > 0 ? 'none' : slideEasing,
      }}>
        {frozenDetail}
      </div>
    </div>,
    document.body,
  );

  return (
    <>
      {/*
       * Sentinel: takes up the full available space in normal flow so the
       * surrounding flex/grid layout is unaffected. Actual content lives in
       * the portal above.
       */}
      <div ref={sentinelRef} style={{ width: '100%', height: '100%' }} />
      {portalContent}
    </>
  );
}

export default MobileSlidePanel;
