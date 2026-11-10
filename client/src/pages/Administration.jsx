import { Fragment } from 'react';
import SideLayout from '../components/SideLayout.jsx';
import Icon from '../components/Icon.jsx';
import { useSettings, useMenu, tx, lbl } from '../settings.js';
import { useLang } from '../i18n.jsx';

export default function AdministrationPage() {
  const { t, lang } = useLang();
  const { structure: S } = useSettings();
  const { menu: MENU } = useMenu();
  const m = MENU.find((x) => x.key === 'administration') || { base: '/section/administration', children: [] };
  return (
    <SideLayout side="ADMINISTRATION" sideIcon="clock"
      items={m.children.map((c) => ({ to: c.href || `${m.base}/${c.slug}`, label: lbl(lang, t, c), icon: c.href ? 'cal' : 'org' }))}
      crumbs={[{ label: 'Administration', to: `${m.base}/structure` }, { label: 'Administrative Structure' }]}
      title="Administrative & Governance Structure" sub={tx(lang, t, S, 'intro')}>

      <div className="stats">
        {S.stats.map((x, i) => (
          <div key={i}><span className="si"><Icon name={x.icon || 'layers'} size={22} /></span><b>{tx(lang, t, x, 'big')}</b><small>{tx(lang, t, x, 'label')}</small></div>
        ))}
      </div>

      <div className="card pad chain">
        <div className="row between"><h3>{t('Hierarchy chain (top to bottom)')}</h3><span className="pill">{S.levels.length} {t('levels')}</span></div>
        <ol>
          {S.levels.map((l, i) => (
            <Fragment key={i}>
              <li className={`lv${(i % 4) + 1}`}><Icon name={l.icon || 'building'} size={18} />{i + 1}. {tx(lang, t, l, 'name')}</li>
              {i < S.levels.length - 1 && <li className="chev" aria-hidden="true"><Icon name="chevron" size={16} /></li>}
            </Fragment>
          ))}
        </ol>
      </div>

      <div className="levels">
        {S.levels.map((l, i) => (
          <article className={`card pad level lv${(i % 4) + 1}`} key={i}>
            <span className="lvicon"><Icon name={l.icon || 'building'} size={26} /></span>
            <div>
              <div className="lvmeta"><span className="pill">{t('Level')} {i + 1}</span><span className="muted small row"><Icon name="pin" size={14} /> {tx(lang, t, l, 'where')}</span></div>
              <h3>{tx(lang, t, l, 'name')}</h3>
              <p>{tx(lang, t, l, 'text')}</p>
            </div>
          </article>
        ))}
      </div>
    </SideLayout>
  );
}
