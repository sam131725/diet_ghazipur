import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, useLive, fmtDate } from '../api.js';
import { useAuth } from '../auth.jsx';
import { DOC_TARGETS } from '../config.js';

/* ---------- generic upload/manage section for notices, carousel, gallery, events ---------- */
const SECTIONS = {
  people: { label: 'People: principal, lecturers, staff', path: '/people', fileLabel: 'Photo (JPG/PNG/WEBP, square or portrait)', accept: 'image/*',
    fields: [['type', 'Role group', [['principal', 'Principal (current), shown on home page'], ['former-principal', 'Former principal'], ['faculty', 'Lecturer / faculty'], ['staff', 'Other staff']]],
      ['name', 'Full name', 'text', true], ['nameHi', 'Name in Hindi (optional)', 'text'],
      ['designation', 'Designation / role (e.g. Senior Lecturer)', 'text'], ['designationHi', 'Designation in Hindi (optional)', 'text'],
      ['branch', 'Branch / subject (faculty)', 'text'], ['branchHi', 'Branch in Hindi (optional)', 'text'], ['qualification', 'Qualification', 'text'],
      ['phone', 'Phone', 'text'], ['email', 'Email', 'text'],
      ['message', "Principal's message (current principal only)", 'textarea'], ['messageHi', "Principal's message in Hindi (optional)", 'textarea'],
      ['fromYear', 'From year (former principals)', 'text'], ['toYear', 'To year (former principals)', 'text'], ['order', 'Order (1 = first)', 'number']],
    cols: (x) => [x.type, x.designation || '', x.name], fileKey: 'photoUrl', image: true },
  docs: { label: 'Documents (AWP, downloads, exam, etc.)', path: '/docs', fileLabel: 'PDF / image file', accept: '.pdf,.jpg,.jpeg,.png,.webp,.doc,.docx',
    fields: [['section', 'Which page should show this?', DOC_TARGETS, true], ['group', 'AWP: session (e.g. 2025-26). Downloads: Forms, Circulars, Government orders or Other', 'text'],
      ['title', 'Title / activity name', 'text', true], ['titleHi', 'Title in Hindi (optional)', 'text'], ['details', 'Details', 'textarea'], ['detailsHi', 'Details in Hindi (optional)', 'textarea'], ['fromDate', 'From date', 'date'], ['toDate', 'To date', 'date']],
    cols: (x) => [`${x.section}${x.group ? ` / ${x.group}` : ''}`, x.title], fileKey: 'fileUrl' },
  notices: { label: 'Notices', path: '/notices', fileLabel: 'PDF / image (optional)', accept: '.pdf,.jpg,.jpeg,.png,.webp',
    fields: [['title', 'Title', 'text', true], ['titleHi', 'Title in Hindi (optional)', 'text'], ['description', 'Short description', 'textarea'], ['descriptionHi', 'Short description in Hindi (optional)', 'textarea'],
      ['category', 'Category', ['Pre-Service', 'In-Service', 'Examination', 'General']], ['showNew', 'Show "NEW" tag', 'check']],
    cols: (x) => [x.category, fmtDate(x.publishedAt), x.title], fileKey: 'fileUrl' },
  carousel: { label: 'Homepage Carousel', path: '/carousel', fileLabel: 'Slide image (JPG/PNG/WEBP, wide, 1600×700 ideal)', accept: 'image/*', fileRequired: true,
    fields: [['title', 'Heading', 'text'], ['titleHi', 'Heading in Hindi (optional)', 'text'], ['subtitle', 'Sub-heading', 'text'], ['subtitleHi', 'Sub-heading in Hindi (optional)', 'text'], ['order', 'Order (1 = first)', 'number'], ['active', 'Visible', 'check']],
    cols: (x) => [`#${x.order}`, x.active ? 'Visible' : 'Hidden', x.title || '(no title)'], fileKey: 'imageUrl', image: true },
  gallery: { label: 'Photo Gallery', path: '/gallery', fileLabel: 'Photo', accept: 'image/*', fileRequired: true,
    fields: [['caption', 'Caption', 'text'], ['captionHi', 'Caption in Hindi (optional)', 'text'], ['album', 'Album', 'text']],
    cols: (x) => [x.album, x.caption || '(no caption)'], fileKey: 'imageUrl', image: true },
  events: { label: 'Events', path: '/events', fields: [['title', 'Title', 'text', true], ['titleHi', 'Title in Hindi (optional)', 'text'], ['category', 'Category', ['Academic', 'Training', 'Research', 'Other']],
      ['date', 'Date', 'date', true], ['venue', 'Venue', 'text'], ['description', 'Description', 'textarea'], ['descriptionHi', 'Description in Hindi (optional)', 'textarea']],
    cols: (x) => [x.category, fmtDate(x.date), x.title] },
};

function Manager({ id }) {
  const S = SECTIONS[id];
  const { data, reload } = useLive(S.path, id);
  const init = () => Object.fromEntries(S.fields.map(([k, , t]) => [k, t === 'check' ? true : Array.isArray(t) ? (Array.isArray(t[0]) ? t[0][0] : t[0]) : t === 'number' ? 1 : '']));
  const [f, setF] = useState(init());
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setMsg('');
    try {
      const form = new FormData();
      Object.entries(f).forEach(([k, v]) => form.append(k, v));
      if (file) form.append('file', file);
      await api(S.path, { method: 'POST', form });
      setMsg('Published ✔ — visible on the website now.');
      setF(init()); setFile(null); e.target.reset(); reload();
    } catch (ex) { setMsg(ex.message); } finally { setBusy(false); }
  };
  const del = async (x) => {
    if (!confirm('Delete this item permanently?')) return;
    await api(`${S.path}/${x._id}`, { method: 'DELETE' }); reload();
  };

  return (
    <div className="two">
      <div className="card pad">
        <h3>Add to {S.label}</h3>
        <form className="form" onSubmit={submit}>
          {S.fields.map(([k, label, t, req]) => (
            <label key={k}>{t === 'check' ? '' : label}
              {t === 'textarea' ? <textarea rows="3" required={req} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
                : Array.isArray(t) ? <select value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })}>{t.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return <option key={v} value={v}>{l}</option>; })}</select>
                : t === 'check' ? <span className="row gap"><input type="checkbox" checked={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.checked })} /> {label}</span>
                : <input type={t} required={req} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />}
            </label>
          ))}
          {S.fileLabel && <label>{S.fileLabel}<input type="file" required={S.fileRequired} accept={S.accept} onChange={(e) => setFile(e.target.files[0])} /></label>}
          <button className="btn" disabled={busy}>{busy ? 'Uploading…' : 'Publish'}</button>
          {msg && <p className="note">{msg}</p>}
        </form>
      </div>
      <div className="card pad">
        <h3>Existing ({data.length})</h3>
        <div className="list">
          {data.map((x) => (
            <div className="item row gap between" key={x._id}>
              <div className="row gap">
                {S.image && <img className="thumb" src={x[S.fileKey]} alt="" />}
                <div>{S.cols(x).map((c, i) => <div key={i} className={i === S.cols(x).length - 1 ? '' : 'muted small'}>{c}</div>)}
                  {S.fileKey && !S.image && x[S.fileKey] && <a className="small" href={x[S.fileKey]} target="_blank" rel="noreferrer">file</a>}</div>
              </div>
              <button className="btn danger sm" onClick={() => del(x)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- applications ---------- */
function Applications() {
  const [status, setStatus] = useState('');
  const { data, reload } = useLive(`/registrations${status ? `?status=${status}` : ''}`, 'registrations');
  const act = async (a, s) => {
    const remarks = s === 'Rejected' ? prompt('Reason for rejection (shown to student):') || '' : a.remarks;
    await api(`/registrations/${a._id}`, { method: 'PATCH', body: { status: s, remarks } }); reload();
  };
  return (
    <div className="card pad">
      <div className="row gap between wrapflex"><h3>Applications ({data.length})</h3>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option><option>Pending</option><option>Approved</option><option>Rejected</option></select></div>
      <div className="tablewrap"><table>
        <thead><tr><th>App. No</th><th>Name</th><th>Programme</th><th>Mobile</th><th>Marks %</th><th>Docs</th><th>Status</th><th></th></tr></thead>
        <tbody>{data.map((a) => (
          <tr key={a._id}>
            <td>{a.applicationNo}</td><td>{a.fullName}<br /><small className="muted">{fmtDate(a.createdAt)}</small></td>
            <td>{a.program}</td><td>{a.phone}</td><td>{a.marksPercent ?? '-'}</td>
            <td>{a.documents.map((d, i) => <a key={i} href={d} target="_blank" rel="noreferrer">{i + 1} </a>)}</td>
            <td><span className={`status ${a.status}`}>{a.status}</span></td>
            <td className="nowrap"><button className="btn sm" onClick={() => act(a, 'Approved')}>Approve</button>{' '}
              <button className="btn danger sm" onClick={() => act(a, 'Rejected')}>Reject</button></td>
          </tr>))}</tbody>
      </table></div>
    </div>
  );
}

function Messages() {
  const { data, reload } = useLive('/contact', 'contact');
  const toggle = async (m) => { await api(`/contact/${m._id}`, { method: 'PATCH', body: { resolved: !m.resolved } }); reload(); };
  return (
    <div className="card pad"><h3>Contact messages</h3>
      {data.length === 0 && <p className="muted">No messages.</p>}
      {data.map((m) => (
        <div className="notice" key={m._id}><b>{m.name}</b> <small className="muted">{m.email} {m.phone} · {fmtDate(m.createdAt)}</small>
          <p>{m.message}</p><button className="btn sm" onClick={() => toggle(m)}>{m.resolved ? 'Mark unresolved' : 'Mark resolved ✔'}</button></div>
      ))}
    </div>
  );
}

/* ---------- staff & user management (admin only) ---------- */
function Users() {
  const { data, reload } = useLive('/users', 'users');
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', role: 'staff', designation: '' });
  const [msg, setMsg] = useState('');
  const add = async (e) => {
    e.preventDefault();
    try { await api('/users', { method: 'POST', body: f }); setMsg('Account created'); setF({ ...f, name: '', email: '', phone: '', password: '', designation: '' }); reload(); }
    catch (ex) { setMsg(ex.message); }
  };
  const toggle = async (u) => { try { await api(`/users/${u._id}`, { method: 'PATCH', body: { active: !u.active } }); reload(); } catch (ex) { alert(ex.message); } };
  const remove = async (u) => {
    if (!window.confirm(`Delete the account of ${u.name} (${u.email})? This cannot be undone.`)) return;
    try { await api(`/users/${u._id}`, { method: 'DELETE' }); reload(); } catch (ex) { alert(ex.message); }
  };
  const reset = async (u) => { const p = prompt('New password (min 8 chars):'); if (p && p.length >= 8) { await api(`/users/${u._id}`, { method: 'PATCH', body: { password: p } }); alert('Password changed'); } };
  return (
    <div className="two">
      <div className="card pad"><h3>Create staff / admin account</h3>
        <form className="form" onSubmit={add}>
          <input required placeholder="Full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input required type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          <input placeholder="Phone" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          <input placeholder="Designation (e.g. Lecturer)" value={f.designation} onChange={(e) => setF({ ...f, designation: e.target.value })} />
          <select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}><option value="staff">Staff (can publish content & review applications)</option><option value="admin">Admin (full access)</option></select>
          <input required type="password" minLength={8} placeholder="Temporary password (8+ chars)" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
          <button className="btn">Create account</button>{msg && <p className="note">{msg}</p>}
        </form></div>
      <div className="card pad"><h3>All accounts ({data.length})</h3>
        <div className="list">{data.map((u) => (
          <div className="item row between gap" key={u._id}>
            <div><b>{u.name}</b> <span className="badge">{u.role}</span><div className="muted small">{u.email}{u.designation ? ` · ${u.designation}` : ''}</div></div>
            <div className="nowrap"><button className="btn sm" onClick={() => reset(u)}>Reset pw</button>{' '}
              <button className={`btn sm ${u.active ? 'danger' : ''}`} onClick={() => toggle(u)}>{u.active ? 'Disable' : 'Enable'}</button>{' '}
              <button className="btn sm danger" onClick={() => remove(u)}>Delete</button></div>
          </div>))}</div></div>
    </div>
  );
}

function Dashboard() {
  const { data } = useLive('/stats', null);
  const s = Array.isArray(data) ? {} : data;
  const tiles = [['Notices', s.notices], ['Gallery photos', s.gallery], ['Events', s.events], ['Students', s.students],
    ['Pending applications', s.pending], ['Unresolved messages', s.messages]];
  return <div className="stats">{tiles.map(([l, v]) => <div className="stat" key={l}><b>{v ?? '–'}</b><span>{l}</span></div>)}</div>;
}

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('dashboard');
  const [menu, setMenu] = useState(false);
  const tabs = [['dashboard', 'Dashboard'], ['people', 'Principal & Faculty'], ['notices', 'Notices'], ['carousel', 'Carousel'], ['gallery', 'Gallery'], ['docs', 'Documents'],
    ['events', 'Events'], ['apps', 'Applications'], ['messages', 'Messages'], ...(user.role === 'admin' ? [['users', 'Staff & Users']] : [])];

  return (
    <div className="admin">
      <aside className={menu ? 'open' : ''}>
        <div className="a-brand"><img src="/favicon.png" alt="" /><div>DIET Ghazipur<br /><small>Admin Console</small></div></div>
        {tabs.map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => { setTab(k); setMenu(false); }}>{l}</button>)}
        <Link to="/" className="back">← View website</Link>
      </aside>
      <section>
        <div className="a-top row between">
          <button className="burger" onClick={() => setMenu(!menu)}>☰</button>
          <b>{tabs.find((t) => t[0] === tab)[1]}</b>
          <span className="row gap"><small>{user.name} ({user.role})</small><button className="btn sm ghost" onClick={logout}>Logout</button></span>
        </div>
        <div className="a-body">
          {tab === 'dashboard' && <Dashboard />}
          {SECTIONS[tab] && <Manager key={tab} id={tab} />}
          {tab === 'apps' && <Applications />}
          {tab === 'messages' && <Messages />}
          {tab === 'users' && user.role === 'admin' && <Users />}
        </div>
      </section>
    </div>
  );
}
