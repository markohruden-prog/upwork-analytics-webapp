import { memo } from 'react';
import { T } from '../lib/theme.js';

export const Eyebrow = memo(function Eyebrow({ children, num, theme, color }) {
  return (
    <div style={{
      fontFamily: T.fontEditorial, fontStyle: 'italic', fontWeight: 200,
      fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
      color: color || theme.fg2,
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {num != null && (
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>
          {String(num).padStart(2, '0')} /
        </span>
      )}
      <span style={{ fontFamily: '"TWK Everett"', letterSpacing: '0px' }}>{children}</span>
    </div>
  );
});

export const Label = memo(function Label({ children, theme, color }) {
  return (
    <div style={{
      fontFamily: T.fontBody, fontWeight: 500,
      fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
      color: color || theme.fg2,
    }}>{children}</div>
  );
});

export const Btn = memo(function Btn({ children, onClick, variant = 'ghost', disabled, theme, full, style }) {
  const base = {
    fontFamily: T.fontBody, fontWeight: 500,
    fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
    padding: '11px 18px', cursor: disabled ? 'not-allowed' : 'pointer',
    border: '1px solid transparent', transition: 'all 200ms cubic-bezier(0.22,1,0.36,1)',
    whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 8,
    width: full ? '100%' : 'auto', justifyContent: full ? 'center' : 'flex-start',
    opacity: disabled ? 0.5 : 1,
  };
  const variants = {
    primary: { background: theme.accent, color: T.white, borderColor: theme.accent },
    ink:     { background: theme.fg1, color: theme.bg, borderColor: theme.fg1 },
    ghost:   { background: 'transparent', color: theme.fg1, borderColor: theme.borderStrong },
    danger:  { background: 'transparent', color: T.red, borderColor: T.red },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={e => !disabled && (e.currentTarget.style.opacity = '0.82')}
      onMouseLeave={e => !disabled && (e.currentTarget.style.opacity = '1')}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
});

export const IconArrow = memo(function IconArrow({ dir = 'right', size = 12 }) {
  const r = { right: 0, down: 90, left: 180, up: 270 }[dir];
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" style={{ transform: `rotate(${r}deg)` }}>
      <path d="M1 6 H10 M7 3 L10 6 L7 9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
});
