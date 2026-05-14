// Pushes a single weekly record to the Google Sheets webhook (Apps Script doPost).
// No Content-Type header — adding it would trigger a preflight that Apps Script doesn't handle.
export async function pushRecord(record) {
  const url = import.meta.env.VITE_SHEETS_WEBHOOK_URL;
  if (!url) throw new Error('VITE_SHEETS_WEBHOOK_URL is not set');
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(record),
  });
  return res.json(); // { ok: true, action: 'inserted' | 'updated' }
}

// Fetches all weekly records from the Google Sheets webhook (Apps Script doGet).
export async function pullRecords() {
  const url = import.meta.env.VITE_SHEETS_WEBHOOK_URL;
  if (!url) throw new Error('VITE_SHEETS_WEBHOOK_URL is not set');
  const res = await fetch(url);
  const rows = await res.json();
  return rows.filter(r => r.period_start && r.profile !== 'all');
}
