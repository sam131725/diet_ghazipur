import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLive, fmtDate } from '../api.js';
import Icon from './Icon.jsx';
import { useLang, pick } from '../i18n.jsx';

// Latest notices shown one at a time; slides every 5 s, pauses on hover / focus.
export default function Updates() {
  const { lang, t } = useLang();
  const { data } = useLive('/notices?limit=8', 'notices');
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = data.length;
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => { if (i >= n) setI(0); }, [n, i]);
  useEffect(() => {
    if (paused || reduce || n < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 5000);
    return () => clearInterval(t);
  }, [paused, reduce, n]);

  if (n === 0) return null;
  const go = (d) => setI((v) => (v + d + n) % n);

  return (
    <div className="wrap-full">
      <div className="updates" role="region" aria-label="Latest updates" aria-live="off"
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
        <span className="utag"><Icon name="bell" size={18} solid /> {t('Latest updates')}</span>
        <div className="uviewport">
          <div className="utrack" style={{ transform: `translateY(calc(var(--uh) * ${-i}))` }}>
            {data.map((x, k) => (
              <Link key={x._id} to="/notices" className="uitem" tabIndex={k === i ? 0 : -1} aria-hidden={k !== i}>
                {x.showNew && <b className="new">{t('NEW')}</b>}
                <span className="utext">{pick(lang, x, 'title')}</span>
                <span className="udate">{t(x.category)}, {fmtDate(x.publishedAt)}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="uctrl">
          <span className="ucount">{i + 1} / {n}</span>
          <button onClick={() => go(-1)} aria-label={t('Previous update')}><Icon name="chevron" size={16} className="flip" /></button>
          <button onClick={() => go(1)} aria-label={t('Next update')}><Icon name="chevron" size={16} /></button>
        </div>
      </div>
    </div>
  );
}
