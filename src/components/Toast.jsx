import { memo } from 'react';
import { T } from '../lib/theme.js';

export const Toast = memo(function Toast({ msg, type, theme }) {
  if (!msg) return null;
  const accentByType = { error: T.red, success: theme.accent, info: theme.fg1 };
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 200,
      background: theme.fg1, color: theme.bg,
      padding: '14px 18px 14px 14px',
      fontFamily: T.fontBody, fontSize: 12, fontWeight: 400,
      maxWidth: 400, borderLeft: `3px solid ${accentByType[type]}`,
      animation: 'fadeIn 200ms ease-out',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{
        fontFamily: T.fontEditorial, fontStyle: 'italic',
        fontSize: 10, color: accentByType[type], textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}>{type}</span>
      <span style={{ opacity: 0.9 }}>{msg}</span>
    </div>
  );
});
