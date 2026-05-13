import { memo } from 'react';

export const Modal = memo(function Modal({ children, onClose, theme }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(13,5,21,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: 24, animation: 'fadeIn 200ms ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: theme.surface, color: theme.fg1,
          border: `1px solid ${theme.borderStrong}`,
          width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        {children}
      </div>
    </div>
  );
});
