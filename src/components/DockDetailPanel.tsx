import React, { useRef, useState, useEffect } from 'react';
import {
  DoorsOpenIcon,
  DoorsClosedIcon,
  EditOutlinedIcon,
  DirectionalarrowLeftDefaultIcon,
  TrailerFilledIcon,
} from '@component-library/core';
import type { DockItemData } from './DockItemGrid';
import { IconButton } from './IconButton';

// ── Constants ─────────────────────────────────────────────────────────────────

const DOCK_ACTIONS = [
  { id: 'assign',      label: 'Assign Trailer'                    },
  { id: 'checkout',    label: 'Checkout'                          },
  { id: 'close',       label: 'Close Session'                     },
  { id: 'maintenance', label: 'Set Maintenance', dividerBefore: true },
];

const ACTIVE_STATUSES = new Set([
  'active', 'in-detention', 'close-to-detention', 'restraint-bypass',
]);

const STEP_DEFS = [
  { id: 'truck-assigned',       label: 'Truck Assigned'       },
  { id: 'truck-at-dock',        label: 'Truck at Dock'        },
  { id: 'restraint-engaged',    label: 'Restraint Engaged'    },
  { id: 'door-open',            label: 'Door Open'            },
  { id: 'leveler-deployed',     label: 'Leveler Deployed'     },
  { id: 'leveler-stored',       label: 'Leveler Stored'       },
  { id: 'restraint-disengaged', label: 'Restraint Disengaged' },
  { id: 'door-closed',          label: 'Door Closed'          },
  { id: 'truck-departed',       label: 'Truck Departed'       },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getCompletedStepCount(statusLabel?: string): number {
  const label = (statusLabel ?? '').toLowerCase();
  if (label.includes('truck departed'))                                   return 9;
  if (label.includes('door closed'))                                      return 8;
  if (label.includes('restraint disengaged'))                             return 7;
  if (label.includes('leveler stored'))                                   return 6;
  if (label.includes('leveler deployed'))                                 return 5;
  if (label.includes('door open') || label.includes('loading') || label.includes('unloading')) return 4;
  if (label.includes('restraint engaged') || label.includes('bypass'))   return 3;
  if (label.includes('truck at dock'))                                    return 2;
  if (label.includes('truck assigned'))                                   return 1;
  return 0;
}

function formatDuration(time?: string | null): string {
  if (!time) return '--';
  return time.replace(/\s*in\s+detention/i, '').trim();
}

function buildAssignmentDetails(dock: DockItemData) {
  return [
    { label: 'Scheduled',          value: '--'                                  },
    { label: 'Actual',             value: '--'                                  },
    { label: 'Scheduled Duration', value: '--'                                  },
    { label: 'Actual Duration',    value: formatDuration(dock.time)             },
    { label: 'Vendor',             value: '--'                                  },
    { label: 'Carrier',            value: dock.title ?? '--'                    },
    { label: 'Driver',             value: '--'                                  },
    { label: 'Mobile',             value: '--'                                  },
    { label: 'Contacted',          value: '--'                                  },
    { label: 'Trailer #',          value: dock.reference ?? '--'                },
    { label: 'Empty Trailer',      value: '--'                                  },
    { label: 'Seal #',             value: '--'                                  },
    { label: 'Temps',              value: '--°/ --°'                            },
    { label: 'Pallet/Case Qty',    value: '--/ --'                              },
    { label: 'Shipment ID',        value: dock.reference ?? '--'                },
  ];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ display: 'block' }}>
      <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function StepIcon({ done }: { done: boolean }) {
  if (done) {
    return (
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        background: '#43ac1d',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="14" height="11" viewBox="0 0 14 11" fill="none" aria-hidden="true">
          <path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
      background: '#d4d4d4',
    }} />
  );
}

function DoorIllustration({ status }: { status: string }) {
  const isOpen = ['active', 'in-detention', 'close-to-detention'].includes(status);
  const Icon = isOpen ? DoorsOpenIcon : DoorsClosedIcon;
  return (
    <div style={{
      width: 83, height: 80, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--accent-dark, #003b5c)',
    }}>
      <Icon size={64} />
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface DockDetailPanelProps {
  dock: DockItemData;
  onClose: () => void;
  onBack?: () => void;
  style?: React.CSSProperties;
}

// ── DockDetailPanel ───────────────────────────────────────────────────────────

export function DockDetailPanel({ dock, onClose, onBack, style }: DockDetailPanelProps) {
  const [closeHovered, setCloseHovered] = React.useState(false);
  const [backHovered,  setBackHovered]  = React.useState(false);

  const contentsRef = useRef<HTMLDivElement>(null);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const el = contentsRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      setIsNarrow(entries[0].contentRect.width < 420);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const hasActiveSession = ACTIVE_STATUSES.has(dock.status);
  const completedCount   = hasActiveSession ? getCompletedStepCount(dock.statusLabel) : 0;
  const sessionDuration  = formatDuration(dock.time);
  const assignmentDetails = buildAssignmentDetails(dock);

  const steps = STEP_DEFS.map((def, i) => ({
    ...def,
    done:    i < completedCount,
    elapsed: i === completedCount - 1 && dock.time ? sessionDuration : null,
  }));

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: 'var(--surface-card, rgba(255,255,255,0.75))',
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      border: '1px solid var(--accent-border-light, #d3e4f2)',
      borderRadius: 16,
      boxShadow: '0px 2px 48px 0px var(--shadow-card, rgba(0,0,0,0.15))',
      overflow: 'hidden',
      ...style,
    }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        height: 54, flexShrink: 0,
        paddingLeft: onBack ? 4 : 24, paddingRight: 12,
        paddingTop: 8, paddingBottom: 8,
      }}>
        {onBack && (
          <button
            type="button"
            aria-label="Go back"
            onMouseEnter={() => setBackHovered(true)}
            onMouseLeave={() => setBackHovered(false)}
            onClick={onBack}
            style={{
              width: 36, height: 36, flexShrink: 0,
              border: 'none',
              background: backHovered ? 'var(--surface-hover, rgba(255,255,255,0.9))' : 'transparent',
              color: 'var(--text-secondary, rgba(0,0,0,0.6))',
              borderRadius: 10, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        <span style={{
          flex: '1 0 0', minWidth: 0,
          fontSize: 16, fontWeight: 500, lineHeight: '19px',
          color: '#003b5c',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {dock.id}{dock.title ? ` · ${dock.title}` : ''}
        </span>

        <IconButton label="Actions" items={DOCK_ACTIONS} onItemClick={() => {}} />

        {!onBack && (
          <button
            type="button"
            aria-label="Close panel"
            onMouseEnter={() => setCloseHovered(true)}
            onMouseLeave={() => setCloseHovered(false)}
            onClick={onClose}
            style={{
              width: 24, height: 24, flexShrink: 0,
              border: 'none',
              background: closeHovered ? 'var(--surface-hover, rgba(255,255,255,0.9))' : 'transparent',
              color: 'var(--text-secondary, rgba(0,0,0,0.6))',
              borderRadius: 6, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <XIcon />
          </button>
        )}
      </div>

      {/* ── Status section ── */}
      <div style={{
        flexShrink: 0,
        borderTop:   '1px solid var(--border-default, #ececec)',
        borderLeft:  '1px solid var(--border-default, #ececec)',
        borderRight: '1px solid var(--border-default, #ececec)',
        borderRadius: '16px 16px 0 0',
        overflow: 'hidden',
      }}>
        <div style={{
          background: 'var(--surface-card, rgba(255,255,255,0.75))',
          padding: '12px 24px 12px 12px',
          display: 'flex', alignItems: 'center',
        }}>
          <DoorIllustration status={dock.status} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 12 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{
                width: 84, flexShrink: 0, textAlign: 'right',
                fontSize: 14, fontWeight: 400, lineHeight: '17px',
                color: '#6b6b6b', letterSpacing: '-0.25px',
              }}>
                Session:
              </span>
              <span style={{
                fontSize: 14, fontWeight: 600, lineHeight: '17px',
                color: '#404040', whiteSpace: 'nowrap', letterSpacing: '-0.25px',
              }}>
                {hasActiveSession ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{
                width: 84, flexShrink: 0, textAlign: 'right',
                fontSize: 14, fontWeight: 400, lineHeight: '17px',
                color: '#4c5055', letterSpacing: '-0.25px',
              }}>
                {dock.statusLabel ?? 'Status'}:
              </span>
              <span style={{
                fontSize: 14, fontWeight: 600, lineHeight: '17px',
                color: '#404040', whiteSpace: 'nowrap', letterSpacing: '-0.25px',
              }}>
                {dock.time ? formatDuration(dock.time) : '--'}
              </span>
            </div>
          </div>
        </div>
        <div style={{ height: 4, background: 'var(--accent-gradient-start, #bcd4e8)' }} />
      </div>

      {/* ── Two-column contents ── */}
      <div
        ref={contentsRef}
        style={{
          flex: 1, minHeight: 0, display: 'flex',
          flexDirection: isNarrow ? 'column' : 'row',
          borderLeft:   '1px solid var(--border-default, #ececec)',
          borderRight:  '1px solid var(--border-default, #ececec)',
          borderBottom: '1px solid var(--border-default, #ececec)',
          borderRadius: '0 0 8px 8px',
          overflow: isNarrow ? 'auto' : 'hidden',
        }}
      >

        {/* ── Left column: Session timeline ── */}
        <div style={{
          width: isNarrow ? '100%' : (hasActiveSession ? 220 : '100%'),
          flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          background: 'var(--surface-card, rgba(255,255,255,0.75))',
          padding: '12px 24px 24px',
          overflowY: isNarrow ? 'visible' : 'auto',
        }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            paddingBottom: 12, marginBottom: 4,
          }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#404040' }}>Session:</span>
            <span style={{ fontSize: 14, color: '#191919' }}>
              {hasActiveSession ? sessionDuration : '--'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {steps.map((step, i) => {
              const prev = i > 0 ? steps[i - 1] : null;
              const solidConnector = !!(prev?.done && step.done);

              return (
                <React.Fragment key={step.id}>
                  {i > 0 && (
                    <div style={{
                      marginLeft: 15, width: 2, height: 16,
                      background: solidConnector ? '#43ac1d' : undefined,
                      borderLeft: solidConnector ? undefined : '2px dashed #d4d4d4',
                    }} />
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 32 }}>
                      <StepIcon done={step.done} />
                      <span style={{
                        fontSize: 14,
                        fontWeight: step.done ? 700 : 500,
                        color: '#404040',
                        lineHeight: '32px',
                        whiteSpace: 'nowrap',
                      }}>
                        {step.label}
                      </span>
                    </div>
                    {step.elapsed && (
                      <div style={{
                        paddingLeft: 44, marginTop: 2,
                        fontSize: 12, color: '#6b6b6b', lineHeight: '19px',
                      }}>
                        {step.elapsed}
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ── Right column: Assignment Details (active sessions only) ── */}
        {hasActiveSession && (
          <div style={{
            flex: isNarrow ? 'none' : 1,
            width: isNarrow ? '100%' : undefined,
            minWidth: 0,
            display: 'flex', flexDirection: 'column',
            background: 'var(--surface-card, rgba(255,255,255,0.75))',
            borderLeft: isNarrow ? 'none' : '1px solid var(--border-default, #ececec)',
            borderTop: isNarrow ? '1px solid var(--border-default, #ececec)' : 'none',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'flex-end', gap: 10,
              padding: '12px 12px 12px 24px', flexShrink: 0,
            }}>
              <span style={{
                flex: '1 0 0', fontSize: 18, fontWeight: 700,
                lineHeight: '25px', color: '#404040',
              }}>
                Assignment Details
              </span>
              <div style={{ color: '#003b5c', display: 'flex', alignItems: 'center', paddingBottom: 2 }}>
                <EditOutlinedIcon size={24} />
              </div>
            </div>

            {/* Appointment type row */}
            <div style={{
              flexShrink: 0,
              borderTop: '1px solid #cccccc', borderBottom: '1px solid #cccccc',
              padding: '12px 12px 12px 24px',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <span style={{ display: 'flex', color: '#595959' }}>
                      <DirectionalarrowLeftDefaultIcon size={20} />
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#595959', lineHeight: '19px' }}>
                      IB
                    </span>
                  </div>
                  <span style={{ display: 'flex', color: '#595959' }}>
                    <TrailerFilledIcon size={24} />
                  </span>
                </div>
                <span style={{ fontSize: 14, color: '#595959', lineHeight: '17px' }}>
                  Std / <strong>Live Load</strong>
                </span>
              </div>
            </div>

            {/* Details list */}
            <div style={{
              flex: isNarrow ? 'none' : 1,
              minHeight: isNarrow ? 'auto' : 0,
              overflowY: isNarrow ? 'visible' : 'auto',
              paddingTop: 12, paddingBottom: 24,
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              {assignmentDetails.map((item) => (
                <div key={item.label} style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  padding: '0 12px 0 24px',
                }}>
                  <span style={{
                    width: 120, flexShrink: 0,
                    fontSize: 14, fontWeight: 400,
                    color: '#6b6b6b', lineHeight: '17px',
                  }}>
                    {item.label}:
                  </span>
                  <span style={{
                    flex: '1 0 0', minWidth: 0,
                    fontSize: 14, fontWeight: 600,
                    color: '#404040', lineHeight: '17px',
                  }}>
                    {item.value}
                  </span>
                </div>
              ))}
              {/* Comments — stacked layout */}
              <div style={{
                display: 'flex', flexDirection: 'column', gap: 6,
                padding: '6px 12px 0 24px',
              }}>
                <span style={{ fontSize: 14, fontWeight: 400, color: '#6b6b6b', lineHeight: '17px' }}>
                  Comments:
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#404040', lineHeight: '17px' }}>
                  --
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DockDetailPanel;
