import { useEffect, useState, useCallback } from 'react';

// Production: set VITE_API_URL (e.g. https://diet-api.onrender.com) when the API is hosted separately from the site.
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
// Files live behind the API, so give their relative URLs the API host.
const absolutize = (_k, v) => (API_BASE && typeof v === 'string' && /^\/(api\/files|uploads)\//.test(v) ? API_BASE + v : v);

export const getToken = () => localStorage.getItem('token');

export async function api(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  const t = getToken();
  if (t) headers.Authorization = `Bearer ${t}`;
  let payload;
  if (form) payload = form;
  else if (body) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }
  const res = await fetch(`${API_BASE}/api${path}`, { method, headers, body: payload });
  const data = await res.text().then((x) => JSON.parse(x, absolutize)).catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

// Shared SSE connection: the server pings whenever content changes, so every open page refreshes live.
const listeners = new Set();
let es;
function ensureStream() {
  if (es || typeof EventSource === 'undefined') return;
  es = new EventSource(`${API_BASE}/api/stream`);
  es.onmessage = (e) => { try { const m = JSON.parse(e.data); listeners.forEach((l) => l(m.type)); } catch {} };
}

// Fetch a list and keep it fresh in real time. `topic` is the server event name (notices, gallery, ...)
export function useLive(path, topic) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(() => api(path).then(setData).catch(() => {}).finally(() => setLoading(false)), [path]);
  useEffect(() => {
    load();
    ensureStream();
    const l = (type) => { if (!topic || type === topic) load(); };
    listeners.add(l);
    return () => listeners.delete(l);
  }, [load, topic]);
  return { data, loading, reload: load };
}

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString(typeof document !== 'undefined' && document.documentElement.lang === 'hi' ? 'hi-IN' : 'en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
