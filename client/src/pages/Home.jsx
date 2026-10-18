import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel.jsx';
import NoticeList from '../components/NoticeList.jsx';
import MapGhazipur from '../components/MapGhazipur.jsx';
import Icon from '../components/Icon.jsx';
import { useLive, fmtDate } from '../api.js';
import { SITE } from '../config.js';
import { useLang, pick } from '../i18n.jsx';
import { usePeople, Photo } from '../components/People.jsx';

const QUICK = [
  ['cap', 'D.EL.ED.', 'डी.एल.एड.', '/section/deled/overview', 'c1'],
  ['book', 'TRAINING PROGRAMS', 'प्रशिक्षण कार्यक्रम', '/section/training/in-service', 'c2'],
  ['edit', 'EXAMINATION', 'परीक्षा', '/section/examination/schedule', 'c3'],
  ['user', 'INTERNSHIP', 'इन्टर्नशिप', '/internship', 'c4', 'NEW'],
  ['bell', 'NOTICES', 'सूचनाएं', '/notices', 'c1'],
  ['file', 'DOWNLOADS', 'डाउनलोड्स', '/downloads', 'c2'],
  ['image', 'GALLERY', 'गैलरी', '/gallery', 'c3'],
  ['phone', 'CONTACT US', 'संपर्क करें', '/contact', 'c4'],
];

const LINKS = [
  ['Uttar Pradesh Government', 'https://up.gov.in'], ['SCERT Uttar Pradesh', 'https://scert-up.in'],
  ['NCTE', 'https://ncte.gov.in'], ['DIKSHA', 'https://diksha.gov.in'],
  ['National Education Policy', 'https://www.education.gov.in/national-education-policy'],
];

export default function Home() {
  const { lang, t } = useLang();
  const { data: heads } = usePeople('principal');
  const head = heads[0];
  const { data: events } = useLive('/events?limit=6', 'events');
  const { data: gallery } = useLive('/gallery?limit=6', 'gallery');
  const upcoming = events.filter((e) => new Date(e.date) >= new Date(Date.now() - 86400000)).slice(0, 3);

  return (
    <>
      <section className="wrap-full hero">
        <Carousel />
        <div className="noticepanel">
          <div className="ptitle"><span><Icon name="megaphone" size={24} /> {t('OFFICIAL NOTICE BOARD')}</span>
            <Link to="/notices">{t('VIEW ALL')} <Icon name="chevron" size={13} /></Link></div>
          <NoticeList limit={8} scroll />
        </div>
      </section>

      <section className="wrap">
        <h3 className="sec">{t('QUICK ACCESS')}</h3>
        <div className="quick">
          {QUICK.map(([ic, en, hi, to, cls, tag]) => (
            <Link key={en} to={to} className={`qcard ${cls}`}>{tag && <span className="qnew">{t(tag)}</span>}<Icon name={ic} size={54} solid /><span className="qtext"><b>{lang === 'hi' ? hi : en}</b><small>{lang === 'hi' ? en : hi}</small></span></Link>
          ))}
        </div>
      </section>

      <section className="wrap two">
        <div className="card pad">
          <h3 className="sec nomt">{t("PRINCIPAL'S MESSAGE")}</h3>
          <div className="row gap top msg">
            <Photo p={head} />
            <div>
              <p className="quote clampq">{(head && pick(lang, head, 'message')) || t(SITE.principal.message)}</p>
              <b>— {head ? pick(lang, head, 'name') : t(SITE.principal.name)}</b><div className="muted small">{head ? (pick(lang, head, 'designation') || t(SITE.principal.title)) : t(SITE.principal.title)}</div>
              <Link to="/about/principal-message" className="btn mt">{t('Read More')}</Link>
            </div>
          </div>
        </div>
        <div className="card pad">
          <div className="head2"><h3 className="sec nomt"><Icon name="cal" size={20} /> {t('UPCOMING EVENTS')}</h3><Link to="/events" className="more">{t('VIEW ALL')}</Link></div>
          {upcoming.length === 0 && <p className="muted">{t('No upcoming events. New events appear here when staff publish them.')}</p>}
          {upcoming.map((e) => {
            const d = new Date(e.date);
            return (
              <div className="event" key={e._id}>
                <div className="date"><b>{String(d.getDate()).padStart(2, '0')}</b><small>{d.toLocaleString(lang === 'hi' ? 'hi-IN' : 'en', { month: 'short' }).toUpperCase()}</small></div>
                <div><span className="badge">{t(e.category).toUpperCase()}</span><div className="etitle">{pick(lang, e, 'title')}</div>
                  <small className="muted">{fmtDate(e.date)}{e.venue ? `, ${e.venue}` : ''}</small></div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="wrap" id="map">
        <h3 className="sec">{t('EXPLORE GHAZIPUR DISTRICT')}</h3>
        <MapGhazipur />
      </section>

      <section className="wrap two">
        <div className="card">
          <div className="head2 padh"><h3 className="sec nomt"><Icon name="image" size={20} /> {t('PHOTO GALLERY')}</h3><Link to="/gallery" className="more">{t('VIEW ALL')}</Link></div>
          <div className="padb">
            {gallery.length === 0 && <p className="muted">{t('Photos appear here once staff upload them.')}</p>}
            <div className="photos">
              {gallery.map((g) => <img key={g._id} src={g.imageUrl} alt={pick(lang, g, 'caption') || t('DIET Ghazipur')} loading="lazy" />)}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="head2 padh"><h3 className="sec nomt"><Icon name="external" size={20} /> {t('IMPORTANT LINKS')}</h3></div>
          <div className="padb links">
            {LINKS.map(([name, u]) => (
              <a key={name} href={u} target="_blank" rel="noreferrer"><span className="lg">{name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>{t(name)}</a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
