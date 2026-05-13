import { memo } from 'react';
import { T } from '../lib/theme.js';

export const Segmented = memo(function Segmented({ options, value, onChange, theme }) {
  return (
    <div style={{
      display: 'inline-flex',
      border: `1px solid ${theme.borderStrong}`,
      background: theme.surface,
    }}>
      {options.map((opt, i) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              padding: '9px 18px',
              background: active ? theme.fg1 : 'transparent',
              color: active ? theme.bg : theme.fg2,
              border: 'none',
              borderLeft: i > 0 ? `1px solid ${theme.border}` : 'none',
              fontFamily: T.fontBody, fontSize: 11, fontWeight: 500,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 150ms',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
});
