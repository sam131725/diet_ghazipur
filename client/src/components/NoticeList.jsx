import { useState } from 'react';
import { useLive, fmtDate } from '../api.js';
import Icon from './Icon.jsx';
import { useLang, pick } from '../i18n.jsx';

const CATS = ['All', 'Pre-Service', 'In-Service', 'Examination', 'General'];

export default function NoticeList({ limit, scroll }) {
  const { lang, t } = useLang();
  const [cat, setCat] = useState('All');
  const { data: all, loading } = useLive('/notices?limit=200', 'notices');
  const count = (c) => (c === 'All' ? all.length : all.filter((n) => n.category === c).length);
  let data = cat === 'All' ? all : all.filter((n) => n.category === cat);
  if (limit) data = data.slice(0, limit);

  return (
    <div className="noticebox">
      <div className="chips" role="tablist" aria-label="Notice category">
        <span className="chiplabel"><Icon name="filter" size={14} /> {t('CATEGORY:')}</span>
        {CATS.map((c) => (
          <button key={c} role="tab" aria-selected={cat === c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>
            {c === 'All' ? t('All Notices') : t(c)}<em>{count(c)}</em>
          </button>
        ))}
      </div>
      <div className={scroll ? 'notice-scroll' : ''}>
        {loading && <p className="muted pad">{t('Loading notices.')}</p>}
        {!loading && data.length === 0 && <p className="muted pad">{t('No notices in this category yet.')}</p>}
        {data.map((n) => (
          <article className="notice" key={n._id}>
            <div className="body">
              <div className="meta">
                <span className="badge">{t(n.category)}</span>
                <span className="muted small date1"><Icon name="cal" size={14} />{fmtDate(n.publishedAt)}</span>
                {n.showNew && <b className="new">{t('NEW')}</b>}
              </div>
              <h4>{pick(lang, n, 'title')}</h4>
              {pick(lang, n, 'description') && <p className="muted small clamp">{pick(lang, n, 'description')}</p>}
            </div>
            {n.fileUrl && (
              <a className="filebtn" href={n.fileUrl} target="_blank" rel="noreferrer" aria-label={`Open file for ${n.title}`}>
                <Icon name="file" size={20} />
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
