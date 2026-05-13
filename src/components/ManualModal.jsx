import { useState, memo } from 'react';
import { T } from '../lib/theme.js';
import { PROFILES, PROFILE_LABELS } from '../lib/data.js';
import { Eyebrow, Label, Btn } from './primitives.jsx';
import { Segmented } from './Segmented.jsx';
import { Modal } from './Modal.jsx';

function FieldInput({ label, value, onChange, type = 'number', accent, theme }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: 'block',
        fontFamily: T.fontBody, fontWeight: 500,
        fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: accent ? theme.accent : theme.fg2, marginBottom: 6,
      }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: '100%', padding: '10px 12px',
          border: `1px solid ${focus ? theme.fg1 : (accent ? theme.accent : theme.border)}`,
          borderRadius: 0,
          fontSize: 14, fontFamily: T.fontBody,
          outline: 'none', boxSizing: 'border-box',
          background: theme.surface, color: theme.fg1,
          transition: 'border-color 150ms',
        }}
      />
    </div>
  );
}

export const ManualModal = memo(function ManualModal({ form, setForm, onSave, onClose, theme, isEditing }) {
  const s = +form.submitted || 0;
  const v = +form.viewed || 0;
  const c = +form.chats || 0;
  const e = +form.estimates || 0;
  const d = +form.deals || 0;
  const warnings = [];
  if (v + c > s && s > 0)  warnings.push(`Viewed + chats (${v + c}) exceed submitted (${s}).`);
  if (e > c && c > 0)      warnings.push(`Estimates (${e}) exceed chats (${c}) — every estimate should come from a chat.`);
  if (d > e && e > 0)      warnings.push(`Deals (${d}) exceed estimates (${e}) — every deal should have an estimate.`);

  return (
    <Modal onClose={onClose} theme={theme}>
      <div style={{ padding: 32 }}>
        <Eyebrow theme={theme}>{isEditing ? 'Edit Week' : 'New Week'}</Eyebrow>
        <div style={{
          fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 36,
          lineHeight: 0.95, marginTop: 8, marginBottom: 22, color: theme.fg1,
          letterSpacing: '0.01em',
        }}>{isEditing ? 'EDIT WEEK' : 'ADD MANUALLY'}</div>

        <Label theme={theme}>Profile</Label>
        <div style={{ marginTop: 6, marginBottom: 16 }}>
          <Segmented
            theme={theme}
            options={PROFILES.map(p => ({ value: p, label: PROFILE_LABELS[p] }))}
            value={form.profile}
            onChange={v => setForm(f => ({ ...f, profile: v }))}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FieldInput theme={theme} label="Week start" type="date"
            value={form.period_start} onChange={v => setForm(f => ({ ...f, period_start: v }))} />
          <FieldInput theme={theme} label="Week end" type="date"
            value={form.period_end} onChange={v => setForm(f => ({ ...f, period_end: v }))} />
        </div>

        <FieldInput theme={theme} label="Label (optional, e.g. May W2)" type="text"
          value={form.label} onChange={v => setForm(f => ({ ...f, label: v }))} />

        <div style={{
          borderTop: `1px solid ${theme.border}`, paddingTop: 12,
          marginBottom: 12, marginTop: 4,
        }}>
          <div style={{
            fontFamily: T.fontEditorial, fontStyle: 'italic',
            fontSize: 11, color: theme.fg3, letterSpacing: '0.06em',
          }}>raw numbers only — cumulative auto-calculated</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FieldInput theme={theme} label="Submitted"
            value={form.submitted} onChange={v => setForm(f => ({ ...f, submitted: v }))} />
          <FieldInput theme={theme} label="Viewed (no chat)"
            value={form.viewed} onChange={v => setForm(f => ({ ...f, viewed: v }))} />
          <FieldInput theme={theme} label="Chats Opened"
            value={form.chats} onChange={v => setForm(f => ({ ...f, chats: v }))} />
          <FieldInput theme={theme} label="Estimates Sent"
            value={form.estimates} onChange={v => setForm(f => ({ ...f, estimates: v }))} />
          <FieldInput theme={theme} label="Deals Closed" accent
            value={form.deals} onChange={v => setForm(f => ({ ...f, deals: v }))} />
          <FieldInput theme={theme} label="Invites"
            value={form.invites} onChange={v => setForm(f => ({ ...f, invites: v }))} />
          <FieldInput theme={theme} label="Direct Messages"
            value={form.direct} onChange={v => setForm(f => ({ ...f, direct: v }))} />
        </div>

        {warnings.length > 0 && (
          <div style={{
            marginTop: 16, padding: '12px 14px',
            border: `1px solid ${theme.borderStrong}`,
            borderLeft: `3px solid ${T.red}`,
            background: theme.surfaceAlt,
          }}>
            <div style={{
              fontFamily: T.fontEditorial, fontStyle: 'italic',
              fontSize: 10, color: T.red, textTransform: 'uppercase',
              letterSpacing: '0.1em', marginBottom: 6,
            }}>heads up — soft warnings</div>
            {warnings.map((w, i) => (
              <div key={i} style={{
                fontFamily: T.fontBody, fontSize: 12, color: theme.fg2,
                lineHeight: 1.45, marginTop: i === 0 ? 0 : 4,
              }}>· {w}</div>
            ))}
            <div style={{
              fontFamily: T.fontBody, fontSize: 11, color: theme.fg3,
              marginTop: 8, fontStyle: 'italic',
            }}>You can save anyway — these are warnings, not errors.</div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <Btn theme={theme} variant="ink" onClick={onSave} full>
            {isEditing ? 'Save Changes' : 'Save Week'}
          </Btn>
          <Btn theme={theme} variant="ghost" onClick={onClose} full>Cancel</Btn>
        </div>
      </div>
    </Modal>
  );
});
