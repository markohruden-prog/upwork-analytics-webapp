export const STORAGE_KEY = 'upwork_tracker_bx_v2';

export const PROFILES = ['alex', 'vadym', 'dima'];
export const PROFILE_LABELS = { alex: 'Alex', vadym: 'Vadym-Marko', dima: 'Dima' };
export const VIEW_KINDS = ['weekly', 'monthly', 'quarterly', 'yearly', 'custom'];
export const VIEW_LABELS = { weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly', yearly: 'Yearly', custom: 'Custom' };

// Final design values — tweaks panel removed
export const DESIGN = {
  surface: 'light',
  numeralSize: 64,
  density: 'comfortable',
  funnelStyle: 'bars',
  accentIntensity: 'balanced',
  showSectionNumbers: false,
};

export const SEED_RECORDS = [
  { id: 'apr-w1-alex',  label: 'Apr W1', period_start: '2026-04-06', period_end: '2026-04-12', profile: 'alex',  submitted: 24, viewed: 2, chats: 2, estimates: 1, deals: 0, invites: 2, direct: 0 },
  { id: 'apr-w1-vadym', label: 'Apr W1', period_start: '2026-04-06', period_end: '2026-04-12', profile: 'vadym', submitted: 16, viewed: 1, chats: 1, estimates: 0, deals: 0, invites: 1, direct: 0 },
  { id: 'apr-w1-dima',  label: 'Apr W1', period_start: '2026-04-06', period_end: '2026-04-12', profile: 'dima',  submitted: 14, viewed: 1, chats: 1, estimates: 0, deals: 0, invites: 1, direct: 0 },
  { id: 'apr-w2-alex',  label: 'Apr W2', period_start: '2026-04-13', period_end: '2026-04-19', profile: 'alex',  submitted: 28, viewed: 3, chats: 4, estimates: 2, deals: 1, invites: 2, direct: 1 },
  { id: 'apr-w2-vadym', label: 'Apr W2', period_start: '2026-04-13', period_end: '2026-04-19', profile: 'vadym', submitted: 20, viewed: 2, chats: 2, estimates: 0, deals: 0, invites: 1, direct: 0 },
  { id: 'apr-w2-dima',  label: 'Apr W2', period_start: '2026-04-13', period_end: '2026-04-19', profile: 'dima',  submitted: 18, viewed: 2, chats: 1, estimates: 1, deals: 0, invites: 1, direct: 0 },
  { id: 'apr-w3-alex',  label: 'Apr W3', period_start: '2026-04-20', period_end: '2026-04-26', profile: 'alex',  submitted: 33, viewed: 2, chats: 3, estimates: 2, deals: 0, invites: 3, direct: 0 },
  { id: 'apr-w3-vadym', label: 'Apr W3', period_start: '2026-04-20', period_end: '2026-04-26', profile: 'vadym', submitted: 24, viewed: 2, chats: 2, estimates: 0, deals: 0, invites: 1, direct: 0 },
  { id: 'apr-w3-dima',  label: 'Apr W3', period_start: '2026-04-20', period_end: '2026-04-26', profile: 'dima',  submitted: 19, viewed: 1, chats: 2, estimates: 1, deals: 1, invites: 0, direct: 0 },
  { id: 'apr-w4-alex',  label: 'Apr W4', period_start: '2026-04-27', period_end: '2026-05-03', profile: 'alex',  submitted: 30, viewed: 3, chats: 3, estimates: 1, deals: 1, invites: 2, direct: 1 },
  { id: 'apr-w4-vadym', label: 'Apr W4', period_start: '2026-04-27', period_end: '2026-05-03', profile: 'vadym', submitted: 22, viewed: 2, chats: 2, estimates: 1, deals: 0, invites: 1, direct: 0 },
  { id: 'apr-w4-dima',  label: 'Apr W4', period_start: '2026-04-27', period_end: '2026-05-03', profile: 'dima',  submitted: 17, viewed: 2, chats: 2, estimates: 1, deals: 0, invites: 0, direct: 0 },
  { id: 'may-w1-alex',  label: 'May W1', period_start: '2026-05-04', period_end: '2026-05-10', profile: 'alex',  submitted: 26, viewed: 2, chats: 3, estimates: 1, deals: 0, invites: 2, direct: 1 },
  { id: 'may-w1-vadym', label: 'May W1', period_start: '2026-05-04', period_end: '2026-05-10', profile: 'vadym', submitted: 21, viewed: 2, chats: 2, estimates: 1, deals: 1, invites: 1, direct: 0 },
  { id: 'may-w1-dima',  label: 'May W1', period_start: '2026-05-04', period_end: '2026-05-10', profile: 'dima',  submitted: 15, viewed: 1, chats: 1, estimates: 0, deals: 0, invites: 1, direct: 0 },
];
