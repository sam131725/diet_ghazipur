import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { SITE, MENU } from '../config.js';
import { useAuth } from '../auth.jsx';
import Icon from './Icon.jsx';
import Visitors from './Visitors.jsx';
import MiniMap from './MiniMap.jsx';
import Updates from './Updates.jsx';
import { useLang } from '../i18n.jsx';

const linkOf = (m) => m.to || m.children[0].href || `${m.base}/${m.children[0].slug}`;

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('dark') === '1');
  const [fs, setFs] = useState(() => Number(localStorage.getItem('fs') || 100));
  const { lang, setLang, t } = useLang();
  const { user, logout } = useAuth();
  const loc = useLocation();

  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [loc.pathname]);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.style.fontSize = `${fs}%`;
    localStorage.setItem('dark', dark ? '1' : '0');
    localStorage.setItem('fs', fs);
  }, [dark, fs]);

  const portalLink = user ? (user.role === 'student' ? '/student' : '/admin') : null;
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <>
      <div className="topbar">
        <div className="wrap-full row between">
          <span>भारत सरकार <i>|</i> {lang === 'hi' ? 'Government of India' : 'Government of India'}</span>
          <span className="row tools">
            <a href="#main">{t('Skip to Main Content')}</a><i>|</i>
            <Link to="/policy/accessibility">{t('Screen Reader Access')}</Link><i>|</i>
            <button onClick={() => setFs((v) => Math.max(80, v - 10))} aria-label="Decrease text size">A-</button><i>|</i>
            <button onClick={() => setFs(100)} aria-label="Normal text size">A</button><i>|</i>
            <button onClick={() => setFs((v) => Math.min(130, v + 10))} aria-label="Increase text size">A+</button><i>|</i>
            <button className={lang === 'hi' ? 'on' : ''} onClick={() => setLang('hi')} lang="hi">हिंदी</button><i>|</i>
            <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>English</button><i>|</i>
            {portalLink ? (
              <>
                <Link to={portalLink}>{t('Dashboard')}</Link><i>|</i>
                <button onClick={logout}>{t('Log out')}</button><i>|</i>
              </>
            ) : (
              <>
                <Link to="/student/login">{t('Student login')}</Link><i>|</i>
                <Link to="/staff/login">{t('Staff login')}</Link><i>|</i>
              </>
            )}
            <button onClick={() => setDark((d) => !d)} aria-label={dark ? 'Light mode' : 'Dark mode'}>
              <Icon name={dark ? 'sun' : 'moon'} size={16} />
            </button>
          </span>
        </div>
      </div>

      <header className="masthead">
        <div className="wrap-full row between">
          <Link to="/" className="brand row">
            <img className="logo" src="/logo-512.png" srcSet="/logo-512.png 1x, /logo.png 2x" width="88" height="88" alt="DIET Ghazipur emblem" />
            <div>
              <div className="hi">{SITE.nameHi}</div>
              <h1>{lang === 'hi' ? t(SITE.name) : SITE.name}</h1>
              <div className="l2">{t(SITE.sub)}</div>
              <div className="l1">{t(SITE.dept.replace(/[()]/g, ''))}</div>
            </div>
          </Link>
          <div className="row right">
            <div className="up row">
              <img className="emblem" src="/up-emblem.png" width="64" height="64" alt="Government of Uttar Pradesh emblem" />
              <div><b className="hi2">उत्तर प्रदेश सरकार</b><span>Government of Uttar Pradesh</span></div>
            </div>
            <div className="row hicons">
              <Link to="/search"><Icon name="search" size={24} /><span>{t('Search')}</span></Link>
              <Link to="/sitemap"><Icon name="map" size={24} /><span>{t('Sitemap')}</span></Link>
              <Link to="/awp"><Icon name="cal" size={24} /><span>{lang === 'hi' ? 'वार्षिक योजना' : 'AWP'}</span></Link>
              <Link to="/contact"><Icon name="phone" size={24} /><span>{t('Contact Us')}</span></Link>
            </div>
          </div>
        </div>
      </header>

      <div className="wrap-full navwrap">
        <nav className="mainnav" aria-label="Main">
          <button className="burger" onClick={() => setOpen(!open)} aria-expanded={open}>
            <Icon name="menu" /> {t('Menu')}
          </button>
          <ul className={open ? 'open' : ''}>
            {MENU.map((m) => {
              const active = m.children ? loc.pathname.startsWith(m.base) : undefined;
              return (
                <li key={m.key} className={m.children ? 'has-sub' : ''}>
                  <NavLink to={linkOf(m)} end={m.key === 'home'} className={active ? 'active' : undefined}>
                    {m.home && <Icon name="home" size={17} />}
                    {lang === 'hi' ? m.hi : m.label}
                    {m.children && <Icon name="chevron" size={13} className="down" />}
                  </NavLink>
                  {m.badge && <span className="navnew">{t(m.badge)}</span>}
                  {m.children && (
                    <ul className="sub">
                      {m.children.map((k) => <li key={k.slug}><Link to={k.href || `${m.base}/${k.slug}`}>{t(k.label)}</Link></li>)}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <Updates />

      <main id="main"><Outlet /></main>

      <footer>
        <div className="wrap-full grid5">
          <div>
            <h4>{t('CONTACT US')}</h4>
            <p className="line"><Icon name="pin" size={18} /><span><b>{t('DIET Ghazipur')}</b><br />{t(SITE.address)}</span></p>
            <p className="line"><Icon name="phone" size={18} />{SITE.phone}</p>
            <p className="line"><Icon name="mail" size={18} />{SITE.email}</p>
            <p className="line"><Icon name="globe" size={18} />{siteUrl.replace(/^https?:\/\//, '')}</p>
            <p className="line"><Icon name="clock" size={18} />{t(SITE.hours)}</p>
          </div>
          <div>
            <h4>{t('QUICK LINKS')}</h4>
            <p><Link to="/about/overview">{t('About DIET')}</Link></p>
            <p><Link to="/section/administration/structure">{t('Administration')}</Link></p>
            <p><Link to="/about/faculty">{t('Faculty & Staff')}</Link></p>
            <p><Link to="/awp">{t('Academic Calendar (AWP)')}</Link></p>
            <p><Link to="/downloads">{t('Downloads')}</Link></p>
          </div>
          <div>
            <h4>{t('POLICIES')}</h4>
            <p><Link to="/policy/privacy">{t('Privacy Policy')}</Link></p>
            <p><Link to="/policy/terms">{t('Terms & Conditions')}</Link></p>
            <p><Link to="/policy/copyright">{t('Copyright Policy')}</Link></p>
            <p><Link to="/policy/hyperlink">{t('Hyperlink Policy')}</Link></p>
            <p><Link to="/awp">{t('AWP (Annual Work Plan)')}</Link></p>
            <p><Link to="/sitemap">{t('Sitemap')}</Link></p>
          </div>
          <div>
            <h4>{t('FIND US')}</h4>
            <MiniMap />
          </div>
          <div>
            <h4>{t('VISITOR COUNT')}</h4>
            <Visitors />
            <div className="qrbox">
              <div className="qr"><QRCodeSVG value={siteUrl || 'https://example.com'} size={96} marginSize={1} /></div>
              <div><b>{t('SCAN QR CODE')}</b><small>{t('Scan QR Code for Mobile View')}</small></div>
            </div>
          </div>
        </div>
        <div className="wrap-full copy">
          <span>© {new Date().getFullYear()} {t('DIET Ghazipur')} | {t('All Rights Reserved')}</span>
          <span>{t('Last updated')}: {new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}</span>
          <span>{t('Website designed & developed by DIET Ghazipur')}</span>
        </div>
      </footer>
    </>
  );
}
