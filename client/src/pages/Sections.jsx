import { useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import SideLayout from '../components/SideLayout.jsx';
import DocTable from '../components/DocTable.jsx';
import Icon from '../components/Icon.jsx';
import { api, useLive, fmtDate } from '../api.js';
import { MENU, SESSIONS, DOWNLOAD_GROUPS, INTERNSHIP, POLICIES } from '../config.js';
import { useLang } from '../i18n.jsx';

const docsPath = (section, group) =>
  `/docs?section=${encodeURIComponent(section)}${group ? `&group=${encodeURIComponent(group)}` : ''}`;

/* Generic page for every dropdown child: text from config + documents staff upload for that page */
export function SectionPage() {
  const { t } = useLang();
  const { menu, slug } = useParams();
  const m = MENU.find((x) => x.key === menu && x.children);
  const page = m?.children.find((c) => c.slug === slug);
  const { data: docs } = useLive(docsPath(`${menu}/${slug}`), 'docs');
  if (!page) return <Navigate to="/" replace />;
  return (
    <SideLayout side={m.label.toUpperCase()} items={m.children.map((c) => ({ to: c.href || `${m.base}/${c.slug}`, label: c.label, icon: 'file' }))}
      crumbs={[{ label: m.label, to: `${m.base}/${m.children[0].slug}` }, { label: page.label }]} title={page.label} sub={page.sub}>
      <div className="card pad"><p className="big">{t(page.text)}</p></div>
      <h3 className="subh">{t('Documents')}</h3>
      <DocTable docs={docs} />
    </SideLayout>
  );
}

export function InternshipPage() {
  const { t } = useLang();
  const { data: docs } = useLive(docsPath('internship/overview'), 'docs');
  return (
    <SideLayout side="INTERNSHIP" items={[{ to: '/internship', label: 'Internship', icon: 'book' }]}
      crumbs={[{ label: 'Internship' }]} title={INTERNSHIP.label} sub={INTERNSHIP.sub}>
      <div className="card pad"><p className="big">{t(INTERNSHIP.text)}</p></div>
      <h3 className="subh">{t('Documents')}</h3>
      <DocTable docs={docs} />
    </SideLayout>
  );
}

/* Academic calendar: sessions on the left, activity table on the right */
export function AwpPage() {
  const { t } = useLang();
  const { session = SESSIONS[0] } = useParams();
  const { data: docs } = useLive(docsPath('awp', session), 'docs');
  return (
    <SideLayout side="SESSIONS" sideIcon="clock" items={SESSIONS.map((s) => ({ to: `/awp/${s}`, label: `${t('SESSION')} ${s}`, icon: 'clock' }))}
      crumbs={[{ label: 'Academic Calendar', to: '/awp' }, { label: `${t('Session')} ${session}` }]}
      title="Academic Calendar" plain
      sub={t('The academic calendar provides an overview of important academic, administrative and examination activities for the session') + ` ${session}.`}>
      <DocTable docs={docs} mode="awp" empty="No activities scheduled for this session." />
    </SideLayout>
  );
}

export function DownloadsPage() {
  const { t } = useLang();
  const { cat = 'all' } = useParams();
  const g = DOWNLOAD_GROUPS.find(([k]) => k === cat) || DOWNLOAD_GROUPS[0];
  const { data: docs } = useLive(docsPath('downloads', g[0] === 'all' ? '' : g[1]), 'docs');
  return (
    <SideLayout side="DOWNLOADS" sideIcon="file" items={DOWNLOAD_GROUPS.map(([k, l]) => ({ to: `/downloads/${k}`, label: l, icon: 'file' }))}
      crumbs={[{ label: 'Downloads', to: '/downloads' }, { label: g[1] }]} title="Downloads" plain
      sub="Forms, circulars, government orders and other documents.">
      <DocTable docs={docs} empty="No documents in this category yet." />
    </SideLayout>
  );
}

export function PolicyPage() {
  const { t } = useLang();
  const { slug } = useParams();
  const p = POLICIES[slug];
  if (!p) return <Navigate to="/" replace />;
  return (
    <div className="wrap page narrowtext">
      <h2>{t(p[0])}</h2>
      <div className="card pad"><p className="big">{t(p[1])}</p></div>
    </div>
  );
}

export function SitemapPage() {
  const { t } = useLang();
  const single = MENU.filter((m) => !m.children);
  const groups = MENU.filter((m) => m.children);
  return (
    <div className="wrap page">
      <h2>{t('Sitemap')}</h2>
      <p className="muted">{t('Every page of the website, grouped by section.')}</p>
      <div className="sitemap">
        <div className="card pad">
          <h4>{t('Main pages')}</h4>
          <ul>
            {single.map((m) => <li key={m.key}><Link to={m.to}>{t(m.label)}</Link></li>)}
            <li><Link to="/notices">{t('Notices')}</Link></li>
            <li><Link to="/events">{t('Events')}</Link></li>
            <li><Link to="/search">{t('Search')}</Link></li>
          </ul>
        </div>
        {groups.map((m) => (
          <div className="card pad" key={m.key}>
            <h4>{t(m.label)}</h4>
            <ul>{m.children.map((c) => <li key={c.slug}><Link to={c.href || `${m.base}/${c.slug}`}>{t(c.label)}</Link></li>)}</ul>
          </div>
        ))}
        <div className="card pad"><h4>{t('Portals')}</h4>
          <ul><li><Link to="/student/login">{t('Student login')}</Link></li><li><Link to="/staff/login">{t('Staff login')}</Link></li></ul></div>
        <div className="card pad"><h4>{t('Policies')}</h4>
          <ul>{Object.entries(POLICIES).map(([k, v]) => <li key={k}><Link to={`/policy/${k}`}>{t(v[0])}</Link></li>)}</ul></div>
      </div>
    </div>
  );
}

export function SearchPage() {
  const { t } = useLang();
  const [sp, setSp] = useSearchParams();
  const q = sp.get('q') || '';
  const [text, setText] = useState(q);
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async (e) => {
    e?.preventDefault();
    setSp(text ? { q: text } : {});
    if (text.trim().length < 2) return setRes(null);
    setBusy(true);
    try { setRes(await api(`/search?q=${encodeURIComponent(text.trim())}`)); } catch { setRes({ notices: [], docs: [], events: [] }); }
    setBusy(false);
  };
  const total = res ? res.notices.length + res.docs.length + res.events.length : 0;

  return (
    <div className="wrap page narrowtext">
      <h2>{t('Search')}</h2>
      <form className="searchform" onSubmit={run} role="search">
        <input autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder={t('Search notices, documents and events')} aria-label={t('Search')} />
        <button className="btn" disabled={busy}><Icon name="search" size={18} /> {t('Search')}</button>
      </form>
      {res && total === 0 && <p className="muted mt">No results for "{text}". Try a different word.</p>}
      {res && res.notices.length > 0 && <><h3 className="subh">Notices</h3><div className="card">{res.notices.map((n) => (
        <div className="notice" key={n._id}><div className="body"><h4>{n.title}</h4><span className="muted small">{n.category}, {fmtDate(n.publishedAt)}</span></div>
          {n.fileUrl && <a className="filebtn" href={n.fileUrl} target="_blank" rel="noreferrer"><Icon name="file" size={18} /></a>}</div>))}</div></>}
      {res && res.docs.length > 0 && <><h3 className="subh">Documents</h3><DocTable docs={res.docs} /></>}
      {res && res.events.length > 0 && <><h3 className="subh">Events</h3><div className="card">{res.events.map((e) => (
        <div className="event pad" key={e._id}><div><b>{e.title}</b><div className="muted small">{fmtDate(e.date)}{e.venue ? `, ${e.venue}` : ''}</div></div></div>))}</div></>}
    </div>
  );
}
