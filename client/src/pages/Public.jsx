import { useState } from 'react';
import NoticeList from '../components/NoticeList.jsx';
import MapGhazipur from '../components/MapGhazipur.jsx';
import Icon from '../components/Icon.jsx';
import { api, useLive, fmtDate } from '../api.js';
import { SITE } from '../config.js';
import { useLang, pick } from '../i18n.jsx';

export function NoticesPage() {
  const { t } = useLang();
  return <div className="wrap page"><h2>{t('Notices')}</h2><NoticeList /></div>;
}

export function GalleryPage() {
  const { lang, t } = useLang();
  const { data } = useLive('/gallery', 'gallery');
  const [big, setBig] = useState(null);
  return (
    <div className="wrap page">
      <h2>{t('Gallery')}</h2>
      {data.length === 0 && <p className="muted">{t('No photos yet.')}</p>}
      <div className="photos big">
        {data.map((g) => <img key={g._id} src={g.imageUrl} alt={pick(lang, g, 'caption') || ''} loading="lazy" onClick={() => setBig(g)} />)}
      </div>
      {big && (
        <div className="lightbox" onClick={() => setBig(null)}>
          <img src={big.imageUrl} alt={big.caption || ''} />
          {pick(lang, big, 'caption') && <p>{pick(lang, big, 'caption')}</p>}
        </div>
      )}
    </div>
  );
}

export function EventsPage() {
  const { lang, t } = useLang();
  const { data } = useLive('/events', 'events');
  return (
    <div className="wrap page">
      <h2>{t('Events and training programmes')}</h2>
      <div className="card pad">
        {data.length === 0 && <p className="muted">{t('No events scheduled.')}</p>}
        {data.map((e) => (
          <div className="event row gap" key={e._id}>
            <div className="date"><b>{new Date(e.date).getDate()}</b><small>{new Date(e.date).toLocaleString(lang === 'hi' ? 'hi-IN' : 'en', { month: 'short' }).toUpperCase()}</small></div>
            <div><span className="badge">{t(e.category)}</span><h4>{pick(lang, e, 'title')}</h4>
              <small className="muted">{fmtDate(e.date)}{e.venue ? ` · ${e.venue}` : ''}</small>
              {pick(lang, e, 'description') && <p>{pick(lang, e, 'description')}</p>}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const AboutPage = () => (
  <div className="wrap page">
    <h2>About DIET Ghazipur</h2>
    <div className="card pad">
      <p>{SITE.sub}, Ghazipur works under the Department of Basic Education, Government of Uttar Pradesh. It runs pre-service
        (D.El.Ed.) and in-service teacher training programmes, academic resource support and research for the district.</p>
      <p className="muted small">Replace this paragraph with the institute's official profile, vision, mission and history.</p>
      <h3>Principal's Message</h3>
      <p>{SITE.principal.message}</p>
      <b>— {SITE.principal.name}</b>
    </div>
  </div>
);

export function ContactPage() {
  const { t } = useLang();
  const [f, setF] = useState({ name: '', email: '', phone: '', message: '' });
  const [msg, setMsg] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try { await api('/contact', { method: 'POST', body: f }); setMsg(t('Thank you — your message has been sent.')); setF({ name: '', email: '', phone: '', message: '' }); }
    catch (err) { setMsg(err.message); }
  };
  const q = encodeURIComponent(SITE.mapQuery || SITE.address);
  const openUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;
  const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  return (
    <div className="wrap page">
      <h2>{t('Contact Us')}</h2>
      <div className="cinfo">
        <div className="card pad"><span className="ci"><Icon name="building" size={22} /></span><h4>{t('DIET Ghazipur')}</h4><p><b>{t(SITE.sub)}</b></p><p className="muted small">{t(SITE.dept.replace(/[()]/g, ''))}</p></div>
        <div className="card pad"><span className="ci"><Icon name="pin" size={22} /></span><h4>{t('Address')}</h4><p><b>{t(SITE.address)}</b></p></div>
        <div className="card pad"><span className="ci"><Icon name="phone" size={22} /></span><h4>{t('Contact info')}</h4>
          <p className="row gap"><Icon name="phone" size={16} /><b>{SITE.phone}</b></p>
          <p className="row gap"><Icon name="mail" size={16} /><b>{SITE.email}</b></p>
          <p className="row gap"><Icon name="clock" size={16} /><b>{t(SITE.hours)}</b></p></div>
        <div className="card pad"><span className="ci"><Icon name="globe" size={22} /></span><h4>{t('Website')}</h4><p><b>{typeof window !== 'undefined' ? window.location.host : ''}</b></p><p className="muted small">{t('Official website of DIET Ghazipur.')}</p></div>
      </div>

      <div className="gmap card">
        <iframe title="DIET Ghazipur on Google Maps" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen
          src={`https://www.google.com/maps?q=${q}&z=15&output=embed`} />
        <div className="gmapbar">
          <span className="row gap"><Icon name="pin" size={18} />{t(SITE.address)}</span>
          <span className="row gap">
            <a className="btn" href={openUrl} target="_blank" rel="noreferrer"><Icon name="external" size={16} /> {t('Open in Maps')}</a>
            <a className="btn ghost" href={dirUrl} target="_blank" rel="noreferrer"><Icon name="map" size={16} /> {t('Get directions')}</a>
          </span>
        </div>
      </div>

      <div className="two" style={{ marginTop: 24 }}>
        <div className="card pad">
          <h3 className="subh" style={{ marginTop: 0 }}>{t('Send us a message')}</h3>
          <form onSubmit={submit} className="form">
            <input required placeholder={t('Your name')} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            <input type="email" placeholder={t('Email')} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
            <input placeholder={t('Phone')} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
            <textarea required rows="4" placeholder={t('Message')} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
            <button className="btn">{t('Send message')}</button>
            {msg && <p className="note">{msg}</p>}
          </form>
        </div>
        <div className="card"><MapGhazipur height={420} list={false} /></div>
      </div>
    </div>
  );
}
