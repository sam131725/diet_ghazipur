import { Link, NavLink } from 'react-router-dom';
import Icon from './Icon.jsx';
import { useLang } from '../i18n.jsx';

// Left side menu + breadcrumb + page heading, shared by every inner page.
export default function SideLayout({ side, sideIcon = 'grid', items, crumbs, title, sub, plain, children }) {
  const { t } = useLang();
  return (
    <div className="wrap aboutgrid">
      <aside className="sidemenu" aria-label={t(side)}>
        <div className="sidehead"><span className="row gap"><Icon name={sideIcon} size={18} />{t(side)}</span><em>{items.length}</em></div>
        {items.map((p) => (
          <NavLink key={p.to} to={p.to} end>
            <Icon name={p.icon || sideIcon} size={18} /><span>{t(p.label)}</span><Icon name="chevron" size={15} className="go" />
          </NavLink>
        ))}
      </aside>
      <section className="innerbody">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">{t('Home')}</Link>
          {crumbs.map((c, i) => (
            <span className="row" key={c.label}>
              <Icon name="chevron" size={12} />
              {i === crumbs.length - 1 ? <b>{t(c.label)}</b> : <Link to={c.to}>{t(c.label)}</Link>}
            </span>
          ))}
        </nav>
        <h2 className={`ptitle2 ${plain ? 'plain' : ''}`}>{plain ? t(title) : t(title).toUpperCase()}</h2>
        {sub && <p className="psub">{t(sub)}</p>}
        {children}
      </section>
    </div>
  );
}
