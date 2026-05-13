import { memo } from 'react';
import { T } from '../lib/theme.js';
import { Eyebrow, Btn } from './primitives.jsx';

export const Header = memo(function Header({ onAdd, theme }) {
  return (
    <header style={{
      borderBottom: `1px solid ${theme.border}`,
      padding: '20px 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 16, flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <img
          src={theme.dark ? '/assets/logo-white.png' : '/assets/logo-black.png'}
          alt="Base X Tech"
          style={{ height: 32, width: 'auto', display: 'block' }}
        />
        <div style={{ width: 1, height: 28, background: theme.border }} />
        <div>
          <Eyebrow theme={theme}>Upwork Reports</Eyebrow>
          <div style={{ fontFamily: T.fontBody, fontSize: 13, color: theme.fg2, marginTop: 2 }}>
            upwork performance · weekly &amp; monthly
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Btn theme={theme} variant="ink" onClick={onAdd}>
          + Add Manually
        </Btn>
      </div>
    </header>
  );
});
