import { memo } from 'react';
import { T } from '../lib/theme.js';
import { pct } from '../lib/aggregation.js';
import { Label } from './primitives.jsx';

export const Funnel = memo(function Funnel({ steps, max, theme, style }) {
  const colors = [theme.fg1, theme.fg1, theme.fg1, theme.fg1, theme.accent];

  if (style === 'numerals') {
    return (
      <div>
        {steps.map((s, i) => (
          <div key={s.label} style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            padding: '14px 0',
            borderTop: i === 0 ? `1px solid ${theme.border}` : 'none',
            borderBottom: `1px solid ${theme.border}`,
          }}>
            <Label theme={theme}>{s.label}</Label>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              {i > 0 && (
                <span style={{ fontFamily: T.fontEditorial, fontStyle: 'italic', fontSize: 11, color: theme.fg3 }}>
                  {pct(s.value, steps[i - 1].value)}
                </span>
              )}
              <span style={{
                fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 36,
                color: i === steps.length - 1 ? theme.accent : theme.fg1,
                lineHeight: 1, fontVariantNumeric: 'tabular-nums',
              }}>{s.raw}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // bars (default)
  return (
    <div>
      {steps.map((s, i) => {
        const w = s.value / max * 100;
        return (
          <div key={s.label} style={{ marginBottom: i < steps.length - 1 ? 18 : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <Label theme={theme}>{s.label}</Label>
              <span style={{
                fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 22,
                color: i === steps.length - 1 ? theme.accent : theme.fg1,
                lineHeight: 1, fontVariantNumeric: 'tabular-nums',
              }}>{s.raw}</span>
            </div>
            <div style={{ height: 6, background: theme.surfaceAlt, position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                width: `${w}%`, background: colors[i],
                transformOrigin: 'left', animation: 'growBar 600ms cubic-bezier(0.22,1,0.36,1)',
              }} />
            </div>
            {i < steps.length - 1 && (
              <div style={{
                fontFamily: T.fontEditorial, fontStyle: 'italic',
                fontSize: 11, color: theme.fg3, marginTop: 6, textAlign: 'right',
              }}>
                ↓ {pct(steps[i + 1].value, s.value)} to {steps[i + 1].label.toLowerCase()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});
