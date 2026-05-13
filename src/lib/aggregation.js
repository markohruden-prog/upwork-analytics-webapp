import { parseISO, fmtShort } from './dates.js';

export function getCumulative(r) {
  const deals = r.deals || 0;
  const estimates = (r.estimates || 0) + deals;
  const chats = (r.chats || 0) + estimates;
  const viewed = (r.viewed || 0) + chats;
  const submitted = (r.submitted || 0) + viewed;
  return { submitted, viewed, chats, estimates, deals };
}

export function pct(a, b) {
  if (!b) return '—';
  return (a / b * 100).toFixed(1) + '%';
}

export function sumRecords(list) {
  const z = { submitted: 0, viewed: 0, chats: 0, estimates: 0, deals: 0, invites: 0, direct: 0 };
  for (const r of list) {
    z.submitted += r.submitted || 0;
    z.viewed    += r.viewed    || 0;
    z.chats     += r.chats     || 0;
    z.estimates += r.estimates || 0;
    z.deals     += r.deals     || 0;
    z.invites   += r.invites   || 0;
    z.direct    += r.direct    || 0;
  }
  return z;
}

export function bucketFor(r, viewKind) {
  const d = parseISO(r.period_start);
  const y = d.getFullYear();
  if (viewKind === 'monthly') {
    const m = d.getMonth();
    return {
      key: `${y}-${String(m + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      sortKey: y * 100 + m,
    };
  }
  if (viewKind === 'quarterly') {
    const q = Math.floor(d.getMonth() / 3) + 1;
    return { key: `${y}-Q${q}`, label: `Q${q} ${y}`, sortKey: y * 10 + q };
  }
  if (viewKind === 'yearly') {
    return { key: `${y}`, label: `${y}`, sortKey: y };
  }
  return null;
}

export function buildPeriods(weeklyForProfile, viewKind, customRange) {
  if (viewKind === 'weekly') {
    return [...weeklyForProfile]
      .sort((a, b) => a.period_start.localeCompare(b.period_start))
      .map(r => ({ ...r, weekCount: 1 }));
  }
  if (viewKind === 'custom') {
    if (!customRange?.from || !customRange?.to) return [];
    const inRange = weeklyForProfile.filter(r =>
      r.period_start >= customRange.from && r.period_end <= customRange.to
    );
    if (inRange.length === 0) return [];
    const sums = sumRecords(inRange);
    return [{
      id: `custom-${customRange.from}-${customRange.to}`,
      label: `${fmtShort(customRange.from)} – ${fmtShort(customRange.to)}`,
      period_start: customRange.from,
      period_end: customRange.to,
      weekCount: inRange.length,
      ...sums,
    }];
  }
  // monthly / quarterly / yearly
  const map = new Map();
  for (const r of weeklyForProfile) {
    const b = bucketFor(r, viewKind);
    if (!map.has(b.key)) map.set(b.key, { ...b, items: [] });
    map.get(b.key).items.push(r);
  }
  return [...map.values()]
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(b => {
      const sums = sumRecords(b.items);
      const starts = b.items.map(r => r.period_start).sort();
      const ends   = b.items.map(r => r.period_end).sort();
      return {
        id: `${viewKind}-${b.key}`,
        label: b.label,
        period_start: starts[0],
        period_end: ends[ends.length - 1],
        weekCount: b.items.length,
        ...sums,
      };
    });
}
