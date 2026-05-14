import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { T, buildTheme } from '../lib/theme.js';
import { PROFILES, PROFILE_LABELS, VIEW_KINDS, VIEW_LABELS, DESIGN } from '../lib/data.js';
import { getCumulative, pct, buildPeriods } from '../lib/aggregation.js';
import { fmtISO, fmtShort } from '../lib/dates.js';
import { loadRecords, saveRecords } from '../lib/storage.js';
import { pushRecord as pushToSheets, pullRecords } from '../lib/sheets.js';
import { Eyebrow, Label, Btn, IconArrow } from './primitives.jsx';
import { Segmented } from './Segmented.jsx';
import { PeriodChips } from './PeriodChips.jsx';
import { StatCard } from './StatCard.jsx';
import { Funnel } from './Funnel.jsx';
import { TrendChart } from './TrendChart.jsx';
import { ManualModal } from './ManualModal.jsx';
import { Toast } from './Toast.jsx';
import { Header } from './Header.jsx';

const EmptyState = memo(function EmptyState({ onAdd, theme, viewKind, profile }) {
  const isWeekly = viewKind === 'weekly';
  return (
    <div style={{
      padding: '80px 32px', textAlign: 'center',
      border: `1px dashed ${theme.border}`, marginTop: 24,
    }}>
      <div style={{
        fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 96,
        lineHeight: 0.9, color: theme.fg3, letterSpacing: '0.02em',
      }}>EMPTY</div>
      <Eyebrow theme={theme}>
        No data in {VIEW_LABELS[viewKind].toLowerCase()} view for {PROFILE_LABELS[profile]}
      </Eyebrow>
      <div style={{
        fontFamily: T.fontBody, fontSize: 14, color: theme.fg2,
        marginTop: 16, marginBottom: 24,
      }}>
        {isWeekly
          ? 'Add a week to get started.'
          : 'Aggregated views need weekly entries first. Add weeks, then come back.'}
      </div>
      <div style={{ display: 'inline-flex', gap: 10 }}>
        <Btn theme={theme} variant="ink" onClick={onAdd}>+ Add Manually</Btn>
      </div>
    </div>
  );
});

const BLANK_FORM = {
  label: '', profile: 'alex', period_start: '', period_end: '',
  submitted: '', viewed: '', chats: '', estimates: '', deals: '', invites: '', direct: '',
};

export function Dashboard() {
  const theme = useMemo(() => buildTheme(DESIGN), []);

  const [records, setRecords] = useState(loadRecords);
  const [viewKind, setViewKind] = useState('weekly');
  const [profile, setProfile] = useState('alex');
  const [selectedId, setSelectedId] = useState(null);
  const [customRange, setCustomRange] = useState(() => {
    const today = new Date();
    const back = new Date();
    back.setDate(back.getDate() - 30);
    return { from: fmtISO(back), to: fmtISO(today) };
  });
  const [modal, setModal] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState({ msg: '', type: 'info' });
  const [pushing, setPushing] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);

  useEffect(() => {
    async function syncFromSheets() {
      try {
        const rows = await pullRecords();
        setRecords(rows);
        saveRecords(rows);
      } catch {
        // network error or missing URL — localStorage cache already in state
      }
    }
    syncFromSheets();
  }, []);

  useEffect(() => { saveRecords(records); }, [records]);

  const showToast = useCallback((msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'info' }), 4000);
  }, []);

  const weeklyForProfile = useMemo(
    () => records.filter(r => r.profile === profile),
    [records, profile]
  );

  const periods = useMemo(
    () => buildPeriods(weeklyForProfile, viewKind, customRange),
    [weeklyForProfile, viewKind, customRange]
  );

  useEffect(() => {
    if (periods.length > 0) {
      setSelectedId(periods[periods.length - 1].id);
    } else {
      setSelectedId(null);
    }
  }, [viewKind, profile, customRange.from, customRange.to, records.length]);

  const selected = useMemo(
    () => periods.find(p => p.id === selectedId) || periods[periods.length - 1],
    [periods, selectedId]
  );
  const cum = useMemo(() => selected ? getCumulative(selected) : null, [selected]);
  const isAggregated = viewKind !== 'weekly';

  const saveManual = useCallback(() => {
    const start = form.period_start, end = form.period_end;
    if (!start || !end) { showToast('Pick a start and end date', 'error'); return; }
    if (start > end)    { showToast('End must be after start', 'error'); return; }
    const autoLabel = form.label.trim() || `${fmtShort(start)}–${fmtShort(end)}`;
    const numerics = {
      submitted: +form.submitted || 0, viewed:    +form.viewed    || 0,
      chats:     +form.chats     || 0, estimates: +form.estimates || 0,
      deals:     +form.deals     || 0, invites:   +form.invites   || 0,
      direct:    +form.direct    || 0,
    };

    if (editingId) {
      setRecords(prev => prev.map(r =>
        r.id === editingId
          ? { ...r, profile: form.profile, label: autoLabel, period_start: start, period_end: end, ...numerics }
          : r
      ));
      setProfile(form.profile);
      setSelectedId(editingId);
      setEditingId(null);
      setModal(null);
      setForm(BLANK_FORM);
      showToast(`Updated: ${autoLabel}`, 'success');
      return;
    }

    const id = `rec-${Date.now()}`;
    const now = new Date().toISOString();
    const rec = { id, label: autoLabel, profile: form.profile, period_start: start, period_end: end, ...numerics, created_at: now, updated_at: now };
    setRecords(prev => [...prev, rec]);
    setViewKind('weekly');
    setProfile(form.profile);
    setSelectedId(id);
    setModal(null);
    setForm(BLANK_FORM);
    showToast(`Week saved: ${autoLabel}`, 'success');
  }, [form, editingId, showToast]);

  const openAdd = useCallback(() => {
    setEditingId(null);
    setForm({ ...BLANK_FORM, profile });
    setModal('manual');
  }, [profile]);

  const openEdit = useCallback(() => {
    if (!selected || isAggregated) return;
    const rec = records.find(r => r.id === selected.id);
    if (!rec) return;
    setForm({
      label:        rec.label || '',
      profile:      rec.profile,
      period_start: rec.period_start,
      period_end:   rec.period_end,
      submitted:    String(rec.submitted ?? ''),
      viewed:       String(rec.viewed    ?? ''),
      chats:        String(rec.chats     ?? ''),
      estimates:    String(rec.estimates ?? ''),
      deals:        String(rec.deals     ?? ''),
      invites:      String(rec.invites   ?? ''),
      direct:       String(rec.direct    ?? ''),
    });
    setEditingId(rec.id);
    setModal('manual');
  }, [selected, isAggregated, records]);

  const closeModal = useCallback(() => {
    setModal(null);
    setEditingId(null);
  }, []);

  const doPush = useCallback(async () => {
    if (!selected) return;
    if (isAggregated) {
      showToast("Aggregated views can't be pushed — they're derived from weekly data.", 'error');
      return;
    }
    const rec = records.find(r => r.id === selected.id);
    if (!rec) return;
    setPushing(true);
    try {
      const result = await pushToSheets(rec);
      if (result.ok) {
        showToast(`Pushed to Sheets (${result.action})`, 'success');
      } else {
        showToast(`Sheets error: ${result.error}`, 'error');
      }
    } catch (err) {
      showToast(`Push failed: ${err.message}`, 'error');
    } finally {
      setPushing(false);
    }
  }, [selected, isAggregated, records, showToast]);

  const deleteRecord = useCallback((id) => {
    if (!records.find(r => r.id === id)) {
      showToast("Aggregated views can't be deleted — edit the underlying weeks.", 'error');
      return;
    }
    setRecords(prev => prev.filter(r => r.id !== id));
  }, [records, showToast]);

  const funnelSteps = useMemo(() => cum ? [
    { label: 'Submitted', value: cum.submitted, raw: selected.submitted },
    { label: 'Viewed',    value: cum.viewed,    raw: selected.viewed    },
    { label: 'Chats',     value: cum.chats,     raw: selected.chats     },
    { label: 'Estimates', value: cum.estimates, raw: selected.estimates },
    { label: 'Deals',     value: cum.deals,     raw: selected.deals     },
  ] : [], [cum, selected]);
  const funnelMax = funnelSteps[0]?.value || 1;

  return (
    <div style={{
      minHeight: '100vh', background: theme.bg, color: theme.fg1,
      fontFamily: T.fontBody,
    }}>
      <Header onAdd={openAdd} theme={theme} />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: `${theme.pad}px 32px 64px` }}>

        {/* Controls row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          gap: 16, flexWrap: 'wrap', marginTop: 8, marginBottom: 20,
        }}>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <div>
              <div style={{ marginBottom: 8 }}><Eyebrow theme={theme}>Profile</Eyebrow></div>
              <Segmented
                theme={theme}
                options={PROFILES.map(p => ({ value: p, label: PROFILE_LABELS[p] }))}
                value={profile}
                onChange={setProfile}
              />
            </div>
            <div>
              <div style={{ marginBottom: 8 }}><Eyebrow theme={theme}>View</Eyebrow></div>
              <Segmented
                theme={theme}
                options={VIEW_KINDS.map(k => ({ value: k, label: VIEW_LABELS[k] }))}
                value={viewKind}
                onChange={setViewKind}
              />
            </div>
          </div>

          {viewKind === 'custom' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              <Eyebrow theme={theme}>Custom Range</Eyebrow>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="date" value={customRange.from}
                  onChange={e => setCustomRange(r => ({ ...r, from: e.target.value }))}
                  style={{
                    padding: '9px 12px', border: `1px solid ${theme.borderStrong}`,
                    background: theme.surface, color: theme.fg1,
                    fontFamily: T.fontBody, fontSize: 13, outline: 'none', borderRadius: 0,
                  }} />
                <span style={{ color: theme.fg3 }}>—</span>
                <input type="date" value={customRange.to}
                  onChange={e => setCustomRange(r => ({ ...r, to: e.target.value }))}
                  style={{
                    padding: '9px 12px', border: `1px solid ${theme.borderStrong}`,
                    background: theme.surface, color: theme.fg1,
                    fontFamily: T.fontBody, fontSize: 13, outline: 'none', borderRadius: 0,
                  }} />
              </div>
            </div>
          ) : periods.length > 0 && (
            <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <Eyebrow theme={theme}>Select Period</Eyebrow>
              <PeriodChips records={periods} selectedId={selected?.id} onSelect={setSelectedId} theme={theme} />
            </div>
          )}
        </div>

        {!selected ? (
          <EmptyState theme={theme} viewKind={viewKind} profile={profile} onAdd={openAdd} />
        ) : (
          <>
            {/* Active period header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              gap: 16, flexWrap: 'wrap', marginBottom: 16,
              borderTop: `1px solid ${theme.border}`, paddingTop: 16,
            }}>
              <div>
                <Eyebrow theme={theme}>
                  {VIEW_LABELS[viewKind]}{isAggregated && selected.weekCount > 1 ? ` · ${selected.weekCount} weeks` : ''}
                </Eyebrow>
                <div style={{
                  fontFamily: T.fontDisplay, fontWeight: 700,
                  fontSize: 44, lineHeight: 1, letterSpacing: '0.01em',
                  marginTop: 4, color: theme.fg1, textTransform: 'uppercase',
                }}>{selected.label}</div>
                <div style={{
                  fontFamily: T.fontEditorial, fontStyle: 'italic',
                  fontSize: 12, color: theme.fg3, marginTop: 6,
                }}>
                  {fmtShort(selected.period_start)} → {fmtShort(selected.period_end)}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{ textAlign: 'right' }}>
                  <Eyebrow theme={theme}>Profile</Eyebrow>
                  <div style={{ fontFamily: T.fontBody, fontSize: 14, marginTop: 2 }}>
                    {PROFILE_LABELS[profile]}
                  </div>
                </div>
                <div style={{ width: 1, height: 32, background: theme.border }} />
                {!isAggregated && (
                  <Btn theme={theme} variant="ghost" onClick={openEdit}>Edit Week</Btn>
                )}
                <Btn theme={theme} variant="primary" onClick={doPush} disabled={pushing || isAggregated}
                  style={isAggregated ? { cursor: 'not-allowed' } : undefined}
                  title={isAggregated ? "Aggregated views can't be pushed — they're derived from weekly data." : undefined}>
                  {pushing ? 'Pushing…' : <><span>Push to Sheets</span> <IconArrow dir="up" /></>}
                </Btn>
              </div>
            </div>

            {/* 6 stat cards */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
              gap: theme.gap, marginBottom: theme.rowGap,
            }}>
              <StatCard theme={theme} label="Submitted" value={selected.submitted} sub="cover letters" numeralSize={DESIGN.numeralSize} accent="soft" />
              <StatCard theme={theme} label="Viewed"    value={selected.viewed}    sub="no chat"       numeralSize={DESIGN.numeralSize} />
              <StatCard theme={theme} label="Chats"     value={selected.chats}     sub="opened"        numeralSize={DESIGN.numeralSize} />
              <StatCard theme={theme} label="Estimates" value={selected.estimates} sub="sent"          numeralSize={DESIGN.numeralSize} />
              <StatCard theme={theme} label="Deals"     value={selected.deals}     sub="closed"        numeralSize={DESIGN.numeralSize} accent="green" />
              <StatCard theme={theme} label="Invites"   value={selected.invites}   sub={`+ ${selected.direct} direct msg`} numeralSize={DESIGN.numeralSize} />
            </div>

            {/* Funnel + Rates */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1.1fr 1fr',
              gap: theme.rowGap, marginBottom: theme.rowGap,
            }}>
              <section style={{
                background: theme.surface, border: `1px solid ${theme.border}`,
                padding: theme.cardPad,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
                  <div>
                    <Eyebrow theme={theme}>Outbound Funnel</Eyebrow>
                    <div style={{ fontFamily: T.fontBody, fontSize: 12, color: theme.fg3, marginTop: 2 }}>
                      cumulative through stage
                    </div>
                  </div>
                  <span style={{ fontFamily: T.fontEditorial, fontStyle: 'italic', fontSize: 12, color: theme.fg3 }}>
                    {selected.submitted + selected.viewed + selected.chats + selected.estimates + selected.deals} total
                  </span>
                </div>
                <Funnel steps={funnelSteps} max={funnelMax} theme={theme} style={DESIGN.funnelStyle} />
              </section>

              <section style={{ background: theme.fg1, color: theme.bg, padding: theme.cardPad }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
                  <div>
                    <Eyebrow theme={theme} color="rgba(250,250,250,0.5)">Conversion Rates</Eyebrow>
                    <div style={{ fontFamily: T.fontBody, fontSize: 12, color: 'rgba(250,250,250,0.4)', marginTop: 2 }}>
                      cumulative
                    </div>
                  </div>
                </div>
                {[
                  { from: 'Submitted', to: 'Viewed',   a: cum.viewed,    b: cum.submitted },
                  { from: 'Submitted', to: 'Chat',     a: cum.chats,     b: cum.submitted },
                  { from: 'Chat',      to: 'Estimate', a: cum.estimates, b: cum.chats     },
                  { from: 'Estimate',  to: 'Deal',     a: cum.deals,     b: cum.estimates },
                  { from: 'Submitted', to: 'Deal',     a: cum.deals,     b: cum.submitted },
                ].map((row, i, arr) => {
                  const isFinal = i === arr.length - 1;
                  return (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                      padding: '12px 0',
                      borderBottom: i < arr.length - 1 ? '1px solid rgba(250,250,250,0.12)' : 'none',
                    }}>
                      <div style={{ fontFamily: T.fontBody, fontSize: 12, color: 'rgba(250,250,250,0.7)' }}>
                        {row.from} <span style={{ color: 'rgba(250,250,250,0.3)' }}>→</span> {row.to}
                      </div>
                      <div style={{
                        fontFamily: T.fontDisplay, fontWeight: 700,
                        fontSize: isFinal ? 28 : 22,
                        color: isFinal ? T.green : theme.bg,
                        lineHeight: 1, fontVariantNumeric: 'tabular-nums',
                      }}>{pct(row.a, row.b)}</div>
                    </div>
                  );
                })}

                <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(250,250,250,0.18)' }}>
                  <Eyebrow theme={theme} color="rgba(250,250,250,0.5)">Inbound</Eyebrow>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                    {[
                      { label: 'Invites', value: selected.invites },
                      { label: 'Direct MSGS', value: selected.direct },
                    ].map(item => (
                      <div key={item.label} style={{ padding: '12px 14px', border: '1px solid rgba(250,250,250,0.18)' }}>
                        <div style={{
                          fontFamily: T.fontBody, fontWeight: 500, fontSize: 10,
                          letterSpacing: '0.14em', textTransform: 'uppercase',
                          color: 'rgba(250,250,250,0.5)',
                        }}>{item.label}</div>
                        <div style={{
                          fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 36,
                          color: theme.bg, marginTop: 6, lineHeight: 1,
                          fontVariantNumeric: 'tabular-nums',
                        }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Trend chart */}
            {periods.length > 1 && (
              <section style={{
                background: theme.surface, border: `1px solid ${theme.border}`,
                padding: theme.cardPad,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                  <div>
                    <Eyebrow theme={theme}>
                      Trend — {PROFILE_LABELS[profile]} / {VIEW_LABELS[viewKind]}
                    </Eyebrow>
                    <div style={{ fontFamily: T.fontBody, fontSize: 12, color: theme.fg3, marginTop: 2 }}>
                      cumulative submitted, period over period
                    </div>
                  </div>
                  {!isAggregated && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '50%' }}>
                      {periods.map(r => (
                        <button key={r.id} onClick={() => deleteRecord(r.id)}
                          title={`Delete ${r.label}`}
                          style={{
                            background: 'transparent', border: `1px solid ${theme.border}`,
                            color: theme.fg3, fontFamily: T.fontBody, fontSize: 10,
                            padding: '4px 8px', cursor: 'pointer', letterSpacing: '0.08em',
                          }}>× {r.label}</button>
                      ))}
                    </div>
                  )}
                </div>
                <TrendChart records={periods} selectedId={selected?.id}
                  onSelect={setSelectedId} theme={theme} />
              </section>
            )}
          </>
        )}
      </main>

      {modal === 'manual' && (
        <ManualModal theme={theme} form={form} setForm={setForm}
          isEditing={!!editingId}
          onSave={saveManual} onClose={closeModal} />
      )}

      <Toast theme={theme} msg={toast.msg} type={toast.type} />
    </div>
  );
}
