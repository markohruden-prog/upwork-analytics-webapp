export function parseISO(s) {
  return new Date(s + 'T00:00:00');
}

export function fmtISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function fmtShort(s) {
  return parseISO(s).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
}

export function fmtMonth(s) {
  return parseISO(s).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
