import { Fragment } from 'react';
import SideLayout from '../components/SideLayout.jsx';
import Icon from '../components/Icon.jsx';
import { MENU, STRUCTURE as S } from '../config.js';
import { useLang } from '../i18n.jsx';

export default function AdministrationPage() {
  const { t } = useLang();
  const m = MENU.find((x) => x.key === 'administration');
  return (
    <SideLayout side="ADMINISTRATION" sideIcon="clock"
      items={m.children.map((c) => ({ to: c.href || `${m.base}/${c.slug}`, label: c.label, icon: c.href ? 'cal' : 'org' }))}
      crumbs={[{ label: 'Administration', to: `${m.base}/structure` }, { label: 'Administrative Structure' }]}
      title="Administrative & Governance Structure" sub={S.intro}>

      <div className="stats">
        {S.stats.map(([ic, big, label]) => (
          <div key={label}><span className="si"><Icon name={ic} size={22} /></span><b>{t(big)}</b><small>{t(label)}</small></div>
        ))}
      </div>

      <div className="card pad chain">
        <div className="row between"><h3>{t('Hierarchy chain (top to bottom)')}</h3><span className="pill">{t('4 levels')}</span></div>
        <ol>
          {S.levels.map((l, i) => (
            <Fragment key={l.n}>
              <li className={`lv${l.n}`}><Icon name={l.icon} size={18} />{l.n}. {t(l.name)}</li>
              {i < S.levels.length - 1 && <li className="chev" aria-hidden="true"><Icon name="chevron" size={16} /></li>}
            </Fragment>
          ))}
        </ol>
      </div>

      <div className="levels">
        {S.levels.map((l) => (
          <article className={`card pad level lv${l.n}`} key={l.n}>
            <span className="lvicon"><Icon name={l.icon} size={26} /></span>
            <div>
              <div className="lvmeta"><span className="pill">{t(l.tag)}</span><span className="muted small row"><Icon name="pin" size={14} /> {t(l.where)}</span></div>
              <h3>{t(l.name)}</h3>
              <p>{t(l.text)}</p>
            </div>
          </article>
        ))}
      </div>
    </SideLayout>
  );
}
