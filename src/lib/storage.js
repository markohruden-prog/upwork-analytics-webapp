import { STORAGE_KEY, SEED_RECORDS } from './data.js';

export function loadRecords() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    const data = s ? JSON.parse(s) : SEED_RECORDS;
    return data.filter(r => r.period_start && r.profile !== 'all');
  } catch {
    return SEED_RECORDS;
  }
}

export function saveRecords(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {}
}
