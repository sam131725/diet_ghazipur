import { Navigate, useParams } from 'react-router-dom';
import SideLayout from '../components/SideLayout.jsx';
import Icon from '../components/Icon.jsx';
import { ABOUT, ABOUT_CONTENT as C, SITE } from '../config.js';
import { useLang, pick } from '../i18n.jsx';
import { usePeople, Photo, Meta } from '../components/People.jsx';

function Body({ slug }) {
  const { t, lang } = useLang();
  const { data: heads } = usePeople('principal');
  const { data: former } = usePeople('former-principal');
  const { data: faculty } = usePeople('faculty');
  const head = heads[0];
  switch (slug) {
    case 'overview':
      return <div className="card pad"><p className="big">{t(C.overview)}</p></div>;

    case 'vision-mission':
      return (
        <>
          <div className="vm one">
            <div className="card vmcard">
              <div className="vmicon"><Icon name="target" size={64} /></div>
              <div><h3><Icon name="eye" size={22} /> {lang === 'hi' ? 'संस्थान का विजन (Vision)' : 'Vision of the Institute'}</h3>
                {(lang === 'hi' ? C.visionHi : C.visionEn).map((p) => <p key={p.slice(0, 20)}>{p}</p>)}</div>
            </div>
            <div className="card vmcard alt">
              <div><h3><Icon name="rocket" size={22} /> {t('MISSION')}</h3><p>{t(C.mission)}</p></div>
              <div className="vmicon"><Icon name="users" size={64} /></div>
            </div>
          </div>
          <div className="rule"><span>{t('OUR CORE VALUES')}</span></div>
          <div className="card values">
            {C.values.map(([ic, name]) => (
              <div key={name}><span className="vi"><Icon name={ic} size={26} /></span><b>{t(name)}</b></div>
            ))}
          </div>
        </>
      );

    case 'objectives':
      return (
        <div className="card pad">
          <ul className="ticks">{C.objectives.map((o) => <li key={o}><Icon name="award" size={18} />{t(o)}</li>)}</ul>
        </div>
      );

    case 'infrastructure':
      return (
        <div className="infra">
          {C.infrastructure.map((x) => <div className="card" key={x}><Icon name="building" size={28} /><b>{t(x)}</b></div>)}
        </div>
      );

    case 'principal-message':
      return (
        <div className="card pad row gap top msg">
          <Photo p={head} />
          <div><p className="quote">{(head && pick(lang, head, 'message')) || t(SITE.principal.message)}</p>
            <b>— {head ? pick(lang, head, 'name') : t(SITE.principal.name)}</b><div className="muted small">{head ? (pick(lang, head, 'designation') || t(SITE.principal.title)) : t(SITE.principal.title)}</div>{head && <Meta p={head} />}</div>
        </div>
      );

    case 'history-of-principals':
      return (
        <div className="card pad tablewrap"><table>
          <thead><tr><th>{t('Photo')}</th><th>{t('Name')}</th><th>{t('From')}</th><th>{t('To')}</th></tr></thead>
          <tbody>{(former.length ? former.map((p) => ({ ...p, key: p._id, shown: pick(lang, p, 'name'), from: p.fromYear, to: p.toYear })) : C.principals.map((p) => ({ ...p, key: p.name, shown: t(p.name), to: t(p.to) }))).map((p) => <tr key={p.key}><td className="sno">{p.photoUrl ? <img className="mini" src={p.photoUrl} alt="" /> : null}</td><td>{p.shown}</td><td>{p.from}</td><td>{p.to}</td></tr>)}</tbody>
        </table></div>
      );

    case 'organizational-structure':
      return (
        <div className="org">
          {C.structure.map(([role, desc], i) => (
            <div className="card orgbox" key={role} style={{ marginLeft: `${i * 22}px` }}>
              <Icon name="org" size={22} /><div><b>{t(role)}</b><div className="muted small">{t(desc)}</div></div>
            </div>
          ))}
        </div>
      );

    case 'faculty':
      return (
        <div className="faculty">
          {(faculty.length ? faculty : C.faculty).map((f) => (
            <div className="card pad fac" key={f._id || f.name}>
              {f._id ? <Photo p={f} className="avatar" size={30} /> : <div className="avatar"><Icon name="user" size={30} /></div>}
              <div><b>{f._id ? pick(lang, f, 'name') : t(f.name)}</b><div className="muted small">{f._id ? pick(lang, f, 'designation') : t(f.designation)}</div><div className="small">{f._id ? pick(lang, f, 'branch') : t(f.branch)}</div>{f._id && <Meta p={f} />}</div>
            </div>
          ))}
        </div>
      );
    default: return null;
  }
}

export default function About() {
  const { t } = useLang();
  const { slug } = useParams();
  const page = ABOUT.find((p) => p.slug === slug);
  if (!page) return <Navigate to="/about/overview" replace />;
  return (
    <SideLayout side="ABOUT DIET" items={ABOUT.map((p) => ({ to: `/about/${p.slug}`, label: p.label, icon: p.icon }))}
      crumbs={[{ label: 'About DIET', to: '/about/overview' }, { label: page.label }]} title={page.label} sub={page.sub}>
      <Body slug={slug} />
    </SideLayout>
  );
}
