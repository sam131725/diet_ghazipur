import { useLive } from '../api.js';
import { useLang, pick } from '../i18n.jsx';
import Icon from './Icon.jsx';

export const usePeople = (type) => useLive(`/people?type=${type}`, 'people');

export function Photo({ p, className = 'portrait', size = 54 }) {
  const { lang } = useLang();
  return p?.photoUrl
    ? <img className={`${className} photo`} src={p.photoUrl} alt={pick(lang, p, 'name') || ''} loading="lazy" />
    : <div className={className} aria-hidden="true"><Icon name="user" size={size} /></div>;
}

// Contact lines used on faculty / principal cards
export function Meta({ p }) {
  return (
    <>
      {p.qualification && <div className="small">{p.qualification}</div>}
      {p.phone && <div className="small row gap"><Icon name="phone" size={14} />{p.phone}</div>}
      {p.email && <div className="small row gap"><Icon name="mail" size={14} />{p.email}</div>}
    </>
  );
}
