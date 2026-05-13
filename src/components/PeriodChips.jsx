import { memo } from 'react';
import { T } from '../lib/theme.js';

export const PeriodChips = memo(function PeriodChips({ records, selectedId, onSelect, theme }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {records.map(r => {
        const active = r.id === selectedId;
        return (
          <button
            key={r.id}
            onClick={() => onSelect(r.id)}
            style={{
              padding: '7px 14px',
              background: active ? theme.fg1 : 'transparent',
              color: active ? theme.bg : theme.fg2,
              border: `1px solid ${active ? theme.fg1 : theme.border}`,
              borderRadius: 999,
              fontFamily: T.fontBody, fontSize: 11, fontWeight: 400,
              letterSpacing: '0.04em', cursor: 'pointer',
              textTransform: 'lowercase', transition: 'all 200ms',
            }}
          >
            {r.label.toLowerCase()}
          </button>
        );
      })}
    </div>
  );
});
