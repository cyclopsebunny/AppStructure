import React, { useCallback, useId, useState } from 'react';

/**
 * Visual dimensions from Figma `AndroidTogglrSwitch` inside
 * Enterprise Color Tokens — frame node `101:17956` (label + switch row).
 */
const SWITCH_WIDTH = 37;
const SWITCH_HEIGHT = 20;
const THUMB_SIZE = 20;
const TRACK_WIDTH = 34;
const TRACK_HEIGHT = 14;

export interface SwitchProps {
  /**
   * Optional label shown to the left of the control with a 12px gap
   * (matches the “Zone View” row in Figma).
   */
  label?: string;
  /** Controlled on/off state. Omit for uncontrolled usage. */
  checked?: boolean;
  /** Initial value when uncontrolled. */
  defaultChecked?: boolean;
  /** Fires after a user toggle. */
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Switch
 *
 * Android-style pill toggle with optional leading label.
 * Matches the row at Figma node `101:17956` (Enterprise Color Tokens file).
 */
export const Switch: React.FC<SwitchProps> = ({
  label,
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  className,
  style,
}) => {
  const labelId = useId();
  const isControlled = checkedProp !== undefined;
  const [internal, setInternal] = useState(defaultChecked);
  const on = isControlled ? Boolean(checkedProp) : internal;

  const toggle = useCallback(() => {
    if (disabled) return;
    const next = !on;
    if (!isControlled) setInternal(next);
    onCheckedChange?.(next);
  }, [disabled, isControlled, on, onCheckedChange]);

  const trackBg = on ? 'var(--accent-primary, #0a76db)' : 'rgba(0, 0, 0, 0.22)';
  const thumbX = on ? SWITCH_WIDTH - THUMB_SIZE : 0;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-disabled={disabled || undefined}
      aria-labelledby={label ? labelId : undefined}
      disabled={disabled}
      className={className}
      onClick={toggle}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '8px 0',
        margin: 0,
        border: 'none',
        background: 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        fontFamily: 'inherit',
        maxWidth: '100%',
        ...style,
      }}
    >
      {label && (
        <span
          id={labelId}
          style={{
            fontSize: 16,
            fontWeight: 500,
            lineHeight: '20px',
            color: 'var(--text-primary, rgba(0, 0, 0, 0.85))',
            letterSpacing: '0.0066px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flexShrink: 1,
            textAlign: 'left',
          }}
        >
          {label}
        </span>
      )}

      <span
        aria-hidden
        style={{
          position: 'relative',
          width: SWITCH_WIDTH,
          height: SWITCH_HEIGHT,
          flexShrink: 0,
        }}
      >
        {/* Track */}
        <span
          style={{
            position: 'absolute',
            left: (SWITCH_WIDTH - TRACK_WIDTH) / 2,
            top: (SWITCH_HEIGHT - TRACK_HEIGHT) / 2,
            width: TRACK_WIDTH,
            height: TRACK_HEIGHT,
            borderRadius: TRACK_HEIGHT / 2,
            background: trackBg,
            transition: 'background 0.15s ease',
          }}
        />
        {/* Thumb */}
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: thumbX,
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
            transition: 'left 0.15s ease',
          }}
        />
      </span>
    </button>
  );
};
