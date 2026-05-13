import { memo } from 'react';
import { T } from '../lib/theme.js';
import { Label } from './primitives.jsx';

export const StatCard = memo(function StatCard({ label, value, sub, accent, theme, numeralSize }) {
  const isDeals = accent === 'green';
  const numCol = isDeals ? theme.accent : theme.fg1;
  return (
    <div style={{
      background: theme.surface,
      border: `1px solid ${theme.border}`,
      padding: `${theme.cardPad}px ${theme.cardPad - 4}px`,
      minWidth: 0,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      minHeight: 132, position: 'relative',
    }}>
      <Label theme={theme}>{label}</Label>
      <div style={{
        fontFamily: T.fontDisplay, fontWeight: 700,
        fontSize: numeralSize, lineHeight: 0.86, letterSpacing: '0.005em',
        color: numCol,
        marginTop: 14, fontVariantNumeric: 'tabular-nums',
      }}>{value}</div>
      {sub && (
        <div style={{
          fontFamily: T.fontBody, fontSize: 11, color: theme.fg2,
          marginTop: 8, lineHeight: 1.3,
        }}>{sub}</div>
      )}
      {isDeals && (
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 6, height: 6, background: theme.accent,
        }} />
      )}
    </div>
  );
});
