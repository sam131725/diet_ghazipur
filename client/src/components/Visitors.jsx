import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Visitors() {
  const [n, setN] = useState(0);
  useEffect(() => {
    let seen = false;
    try { seen = !!sessionStorage.getItem('visited'); } catch {}
    api('/visit', { method: seen ? 'GET' : 'POST' })
      .then((r) => { setN(r.count); try { sessionStorage.setItem('visited', '1'); } catch {} })
      .catch(() => {});
  }, []);
  return (
    <div className="visitors" aria-label={`Visitor count ${n}`}>
      {String(n).padStart(7, '0').split('').map((d, i) => <b key={i}>{d}</b>)}
    </div>
  );
}
