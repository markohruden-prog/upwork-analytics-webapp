import { STORAGE_KEY } from './data.js';

export function loadRecords() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return [];
    return JSON.parse(s).filter(r => r.period_start && r.profile !== 'all');
  } catch {
    return [];
  }
}

export function saveRecords(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {}
}
