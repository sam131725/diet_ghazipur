import { fmtDate } from '../api.js';
import Icon from './Icon.jsx';
import { useLang, pick } from '../i18n.jsx';

// mode 'awp'  : S.No, Activity/Event, From, To, Details, View
// mode 'list' : S.No, Title, Date, Details, View
export default function DocTable({ docs, mode = 'list', empty = 'No documents have been uploaded yet.' }) {
  const { lang, t } = useLang();
  const awp = mode === 'awp';
  return (
    <div className="doctable">
      <div className="tablewrap">
        <table>
          <thead>
            <tr>
              <th className="sno">{t('S. No.')}</th><th>{awp ? t('Activity / Event') : t('Title')}</th>
              {awp ? <><th>{t('From')}</th><th>{t('To')}</th></> : <th>{t('Date')}</th>}
              <th>{t('Details')}</th><th className="view">{t('View')}</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d, i) => (
              <tr key={d._id}>
                <td className="sno">{i + 1}</td><td><b>{pick(lang, d, 'title')}</b></td>
                {awp ? <><td>{d.fromDate ? fmtDate(d.fromDate) : '-'}</td><td>{d.toDate ? fmtDate(d.toDate) : '-'}</td></>
                  : <td>{fmtDate(d.fromDate || d.createdAt)}</td>}
                <td className="muted">{pick(lang, d, 'details') || '-'}</td>
                <td className="view">
                  {d.fileUrl ? <a className="filebtn" href={d.fileUrl} target="_blank" rel="noreferrer" aria-label={`Open ${d.title}`}><Icon name="file" size={18} /></a> : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {docs.length === 0 && <p className="emptymsg">{t(empty)}</p>}
    </div>
  );
}
