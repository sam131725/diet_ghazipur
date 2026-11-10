import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, useLive, fmtDate } from '../api.js';
import { useAuth } from '../auth.jsx';
import { DOC_TARGETS } from '../config.js';
import { useSettings, useMenu, slugify, DEFAULT_STRUCTURE } from '../settings.js';

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

const docTargets = (menu) => [DOC_TARGETS[0], DOC_TARGETS[1], DOC_TARGETS[2],
  ...menu.filter((m) => m.children && (m.base || '').startsWith('/section/')).flatMap((m) => m.children.filter((c) => !c.noDocs && !c.href).map((c) => [`${m.key}/${c.slug}`, `${m.label}: ${c.label}`]))];

function Manager({ id }) {
  const { fullMenu } = useMenu();
  const S = id === 'docs' ? { ...SECTIONS.docs, fields: SECTIONS.docs.fields.map((f) => (f[0] === 'section' ? [f[0], f[1], docTargets(fullMenu), f[3]] : f)) } : SECTIONS[id];
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

/* ---------- editable site settings: SCERT logo, administrative structure, contact page ---------- */
const ICONS = ['building', 'cap', 'org', 'home', 'layers', 'target', 'book', 'users'];
const save = (key, value, file) => {
  if (file) { const form = new FormData(); form.append('value', JSON.stringify(value)); form.append('file', file); return api(`/settings/${key}`, { method: 'PUT', form }); }
  return api(`/settings/${key}`, { method: 'PUT', body: { value } });
};
const upd = (arr, i, patch) => arr.map((x, j) => (j === i ? { ...x, ...patch } : x));
const mv = (arr, i, d) => { const a = [...arr]; const j = i + d; if (j < 0 || j >= a.length) return a; [a[i], a[j]] = [a[j], a[i]]; return a; };

function SiteSettings() {
  const cur = useSettings();
  const [logo, setLogo] = useState(null);
  const [st, setSt] = useState(null);
  const [ct, setCt] = useState(null);
  const [msg, setMsg] = useState({});
  const S = st || cur.structure;
  const C = ct || cur.contact;
  const note = (k, m) => setMsg((x) => ({ ...x, [k]: m }));
  const run = async (k, fn) => { note(k, 'Saving…'); try { await fn(); note(k, 'Saved ✔ — live on the website now.'); } catch (e) { note(k, e.message); } };

  return (
    <div className="stack">
      <MenuEditor />
      <SiteIdentity />
      <div className="card pad">
        <h3>SCERT logo (shown in the website header)</h3>
        {cur.scertLogo && <p><img className="thumb" style={{ height: 64, width: 'auto' }} src={cur.scertLogo} alt="" /></p>}
        <form className="form" onSubmit={(e) => { e.preventDefault(); if (!logo) return; run('logo', async () => { await save('branding', {}, logo); setLogo(null); e.target.reset(); }); }}>
          <label>Upload logo (PNG with transparent background, JPG or WEBP, up to 8 MB)<input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} /></label>
          <div className="row gap"><button className="btn" disabled={!logo}>Upload logo</button>
            {cur.scertLogo && <button type="button" className="btn danger" onClick={() => run('logo', () => save('branding', { scertLogo: '' }))}>Remove logo</button>}</div>
          {msg.logo && <p className="note">{msg.logo}</p>}
        </form>
      </div>

      <div className="card pad">
        <h3>Administrative structure page</h3>
        <form className="form" onSubmit={(e) => { e.preventDefault(); run('st', () => save('structure', S)); }}>
          <label>Introduction<textarea rows="3" value={S.intro || ''} onChange={(e) => setSt({ ...S, intro: e.target.value })} /></label>
          <label>Introduction in Hindi (optional)<textarea rows="3" value={S.introHi || ''} onChange={(e) => setSt({ ...S, introHi: e.target.value })} /></label>

          <h4>Figures (top row)</h4>
          {S.stats.map((x, i) => (
            <div className="item" key={i}>
              <div className="row gap wrapflex">
                <input placeholder="Value (e.g. 16)" value={x.big || ''} onChange={(e) => setSt({ ...S, stats: upd(S.stats, i, { big: e.target.value }) })} />
                <input placeholder="Label (e.g. Blocks in Ghazipur)" value={x.label || ''} onChange={(e) => setSt({ ...S, stats: upd(S.stats, i, { label: e.target.value }) })} />
                <input placeholder="Label in Hindi (optional)" value={x.labelHi || ''} onChange={(e) => setSt({ ...S, stats: upd(S.stats, i, { labelHi: e.target.value }) })} />
                <button type="button" className="btn sm danger" onClick={() => setSt({ ...S, stats: S.stats.filter((_, j) => j !== i) })}>Remove</button>
              </div>
            </div>
          ))}
          <button type="button" className="btn sm ghost" onClick={() => setSt({ ...S, stats: [...S.stats, { icon: 'layers', big: '', label: '' }] })}>+ Add figure</button>

          <h4>Levels (top to bottom)</h4>
          {S.levels.map((l, i) => (
            <div className="item" key={i}>
              <div className="row between gap"><b>Level {i + 1}</b>
                <span className="row gap">
                  <button type="button" className="btn sm ghost" onClick={() => setSt({ ...S, levels: mv(S.levels, i, -1) })}>↑</button>
                  <button type="button" className="btn sm ghost" onClick={() => setSt({ ...S, levels: mv(S.levels, i, 1) })}>↓</button>
                  <button type="button" className="btn sm danger" onClick={() => setSt({ ...S, levels: S.levels.filter((_, j) => j !== i) })}>Remove</button>
                </span></div>
              <div className="row gap wrapflex">
                <input required placeholder="Name (e.g. SCERT)" value={l.name || ''} onChange={(e) => setSt({ ...S, levels: upd(S.levels, i, { name: e.target.value }) })} />
                <input placeholder="Name in Hindi (optional)" value={l.nameHi || ''} onChange={(e) => setSt({ ...S, levels: upd(S.levels, i, { nameHi: e.target.value }) })} />
                <select value={l.icon || 'building'} onChange={(e) => setSt({ ...S, levels: upd(S.levels, i, { icon: e.target.value }) })}>{ICONS.map((o) => <option key={o}>{o}</option>)}</select>
              </div>
              <div className="row gap wrapflex">
                <input placeholder="Where (e.g. State level)" value={l.where || ''} onChange={(e) => setSt({ ...S, levels: upd(S.levels, i, { where: e.target.value }) })} />
                <input placeholder="Where in Hindi (optional)" value={l.whereHi || ''} onChange={(e) => setSt({ ...S, levels: upd(S.levels, i, { whereHi: e.target.value }) })} />
              </div>
              <textarea rows="3" placeholder="Description" value={l.text || ''} onChange={(e) => setSt({ ...S, levels: upd(S.levels, i, { text: e.target.value }) })} />
              <textarea rows="3" placeholder="Description in Hindi (optional)" value={l.textHi || ''} onChange={(e) => setSt({ ...S, levels: upd(S.levels, i, { textHi: e.target.value }) })} />
            </div>
          ))}
          <button type="button" className="btn sm ghost" onClick={() => setSt({ ...S, levels: [...S.levels, { name: '', where: '', text: '', icon: 'building' }] })}>+ Add level</button>

          <div className="row gap"><button className="btn">Save structure</button>
            <button type="button" className="btn ghost" onClick={() => { if (confirm('Replace with the original default content?')) { setSt(DEFAULT_STRUCTURE); } }}>Load default text</button></div>
          {msg.st && <p className="note">{msg.st}</p>}
        </form>
      </div>

      <div className="card pad">
        <h3>Contact page and footer</h3>
        <form className="form" onSubmit={(e) => { e.preventDefault(); run('ct', () => save('contact', C)); }}>
          <label>Message shown at the top of the Contact page<textarea rows="3" value={C.message || ''} onChange={(e) => setCt({ ...C, message: e.target.value })} /></label>
          <label>Message in Hindi (optional)<textarea rows="3" value={C.messageHi || ''} onChange={(e) => setCt({ ...C, messageHi: e.target.value })} /></label>
          <label>Address<input value={C.address || ''} onChange={(e) => setCt({ ...C, address: e.target.value })} /></label>
          <div className="row gap wrapflex">
            <label>Phone<input value={C.phone || ''} onChange={(e) => setCt({ ...C, phone: e.target.value })} /></label>
            <label>Email<input type="email" value={C.email || ''} onChange={(e) => setCt({ ...C, email: e.target.value })} /></label>
          </div>
          <label>Office hours<input value={C.hours || ''} onChange={(e) => setCt({ ...C, hours: e.target.value })} /></label>

          <h4>Useful links (buttons on the Contact page)</h4>
          {C.links.map((l, i) => (
            <div className="row gap wrapflex item" key={i}>
              <input placeholder="Label (e.g. SCERT UP)" value={l.label || ''} onChange={(e) => setCt({ ...C, links: upd(C.links, i, { label: e.target.value }) })} />
              <input placeholder="Label in Hindi (optional)" value={l.labelHi || ''} onChange={(e) => setCt({ ...C, links: upd(C.links, i, { labelHi: e.target.value }) })} />
              <input type="url" placeholder="https://…" value={l.url || ''} onChange={(e) => setCt({ ...C, links: upd(C.links, i, { url: e.target.value }) })} />
              <button type="button" className="btn sm danger" onClick={() => setCt({ ...C, links: C.links.filter((_, j) => j !== i) })}>Remove</button>
            </div>
          ))}
          <button type="button" className="btn sm ghost" onClick={() => setCt({ ...C, links: [...C.links, { label: '', url: '' }] })}>+ Add link</button>
          <div><button className="btn">Save contact details</button></div>
          {msg.ct && <p className="note">{msg.ct}</p>}
        </form>
      </div>
    </div>
  );
}

/* ---------- editable navigation menu ---------- */
const clone = (x) => JSON.parse(JSON.stringify(x));

function MenuEditor() {
  const { fullMenu, custom } = useMenu();
  const [tree, setTree] = useState(null);
  const [open, setOpen] = useState(null);
  const [msg, setMsg] = useState('');
  const M = tree || clone(fullMenu);
  const set = (t) => setTree(t);
  const patch = (i, p) => set(M.map((m, j) => (j === i ? { ...m, ...p } : m)));
  const patchKid = (i, k, p) => set(M.map((m, j) => (j === i ? { ...m, children: m.children.map((c, n) => (n === k ? { ...c, ...p } : c)) } : m)));
  const run = async (value, ok) => { setMsg('Saving…'); try { await save('menu', value); setTree(null); setMsg(ok); } catch (e) { setMsg(e.message); } };

  const addItem = (type) => {
    const label = prompt(type === 'link' ? 'Name of the new menu link:' : 'Name of the new menu (it will have a drop-down of pages):');
    if (!label) return;
    const key = slugify(label, M.map((m) => m.key));
    set([...M, type === 'link' ? { key, label, hi: '', to: '/' } : { key, label, hi: '', base: `/section/${key}`, children: [{ slug: 'overview', label: 'Overview', sub: '', text: 'Add the content of this page from Admin → Site settings → Navigation menu.' }] }]);
    setOpen(key);
  };
  const addKid = (i) => {
    const label = prompt('Name of the new page:'); if (!label) return;
    const m = M[i];
    set(M.map((x, j) => (j === i ? { ...x, children: [...x.children, { slug: slugify(label, x.children.map((c) => c.slug)), label, hi: '', sub: '', text: '' }] } : x)));
  };

  return (
    <div className="card pad">
      <div className="row between gap wrapflex"><h3>Navigation menu (top bar of the website)</h3>
        <span className="muted small">{custom ? 'Using your saved menu' : 'Using the default menu'}</span></div>
      <p className="muted small">Rename items, add a Hindi name, change the order, hide or delete entries, add pages or links. Nothing changes on the website until you press <b>Save menu</b>.</p>
      {M.map((m, i) => (
        <div className="item" key={m.key}>
          <div className="row gap wrapflex">
            <input style={{ flex: '1 1 160px' }} placeholder="Name" value={m.label} onChange={(e) => patch(i, { label: e.target.value })} />
            <input style={{ flex: '1 1 160px' }} placeholder="Name in Hindi (optional)" value={m.hi || ''} onChange={(e) => patch(i, { hi: e.target.value })} />
            {!m.children && !m.home && <input style={{ flex: '1 1 200px' }} placeholder="Link, e.g. /gallery or https://…" value={m.to || ''} onChange={(e) => patch(i, { to: e.target.value })} />}
            <span className="row gap">
              <button type="button" className="btn sm ghost" onClick={() => set(mv(M, i, -1))}>↑</button>
              <button type="button" className="btn sm ghost" onClick={() => set(mv(M, i, 1))}>↓</button>
              {m.children && <button type="button" className="btn sm ghost" onClick={() => setOpen(open === m.key ? null : m.key)}>{open === m.key ? 'Close pages' : `Pages (${m.children.length})`}</button>}
              {!m.home && <label className="row gap small"><input type="checkbox" checked={!m.hidden} onChange={(e) => patch(i, { hidden: !e.target.checked })} /> Show</label>}
              {!m.home && <button type="button" className="btn sm danger" onClick={() => { if (confirm(`Delete "${m.label}" from the menu?`)) set(M.filter((_, j) => j !== i)); }}>Delete</button>}
            </span>
          </div>
          {m.children && open === m.key && (
            <div style={{ marginTop: 10, paddingLeft: 14, borderLeft: '3px solid var(--line, #e6dccf)' }}>
              {m.children.map((c, k) => (
                <div className="item" key={c.slug}>
                  <div className="row gap wrapflex">
                    <input style={{ flex: '1 1 160px' }} placeholder="Page name" value={c.label} onChange={(e) => patchKid(i, k, { label: e.target.value })} />
                    <input style={{ flex: '1 1 160px' }} placeholder="Name in Hindi (optional)" value={c.hi || ''} onChange={(e) => patchKid(i, k, { hi: e.target.value })} />
                    <span className="row gap">
                      <button type="button" className="btn sm ghost" onClick={() => set(M.map((x, j) => (j === i ? { ...x, children: mv(x.children, k, -1) } : x)))}>↑</button>
                      <button type="button" className="btn sm ghost" onClick={() => set(M.map((x, j) => (j === i ? { ...x, children: mv(x.children, k, 1) } : x)))}>↓</button>
                      <label className="row gap small"><input type="checkbox" checked={!c.hidden} onChange={(e) => patchKid(i, k, { hidden: !e.target.checked })} /> Show</label>
                      <button type="button" className="btn sm danger" onClick={() => { if (confirm(`Delete the page "${c.label}"?`)) set(M.map((x, j) => (j === i ? { ...x, children: x.children.filter((_, n) => n !== k) } : x))); }}>Delete</button>
                    </span>
                  </div>
                  {c.href
                    ? <p className="muted small">This entry opens <code>{c.href}</code>.</p>
                    : (<>
                      <input placeholder="Short description under the page title (optional)" value={c.sub || ''} onChange={(e) => patchKid(i, k, { sub: e.target.value })} />
                      <textarea rows="4" placeholder="Page content" value={c.text || ''} onChange={(e) => patchKid(i, k, { text: e.target.value })} />
                      <textarea rows="4" placeholder="Page content in Hindi (optional)" value={c.textHi || ''} onChange={(e) => patchKid(i, k, { textHi: e.target.value })} />
                    </>)}
                </div>
              ))}
              {(m.base || '').startsWith('/section/') && <button type="button" className="btn sm ghost" onClick={() => addKid(i)}>+ Add page to {m.label}</button>}
            </div>
          )}
        </div>
      ))}
      <div className="row gap wrapflex" style={{ marginTop: 12 }}>
        <button type="button" className="btn sm ghost" onClick={() => addItem('group')}>+ Add menu with pages</button>
        <button type="button" className="btn sm ghost" onClick={() => addItem('link')}>+ Add menu link</button>
      </div>
      <div className="row gap wrapflex" style={{ marginTop: 14 }}>
        <button className="btn" onClick={() => run(M, 'Saved ✔ — the menu is updated on the website.')}>Save menu</button>
        <button className="btn ghost" onClick={() => { setTree(null); setMsg(''); }}>Discard changes</button>
        {custom && <button className="btn danger" onClick={() => { if (confirm('Go back to the original menu? Your menu edits will be removed.')) run([], 'Menu reset to the default.'); }}>Reset to default</button>}
      </div>
      {msg && <p className="note">{msg}</p>}
    </div>
  );
}

function SiteIdentity() {
  const { site } = useSettings();
  const [f, setF] = useState(null);
  const [msg, setMsg] = useState('');
  const v = f || site;
  return (
    <div className="card pad">
      <h3>Website name (header)</h3>
      <form className="form" onSubmit={async (e) => { e.preventDefault(); setMsg('Saving…'); try { await save('site', v); setMsg('Saved ✔ — live on the website now.'); } catch (x) { setMsg(x.message); } }}>
        <label>Name in Hindi<input value={v.nameHi || ''} onChange={(e) => setF({ ...v, nameHi: e.target.value })} /></label>
        <label>Name in English<input value={v.name || ''} onChange={(e) => setF({ ...v, name: e.target.value })} /></label>
        <label>Full English name<input value={v.sub || ''} onChange={(e) => setF({ ...v, sub: e.target.value })} /></label>
        <label>Department line<input value={v.dept || ''} onChange={(e) => setF({ ...v, dept: e.target.value })} /></label>
        <div><button className="btn">Save name</button></div>
        {msg && <p className="note">{msg}</p>}
      </form>
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
  const tabs = [['dashboard', 'Dashboard'], ['people', 'Principal & Faculty'], ['settings', 'Site settings'], ['notices', 'Notices'], ['carousel', 'Carousel'], ['gallery', 'Gallery'], ['docs', 'Documents'],
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
          {tab === 'settings' && <SiteSettings />}
          {tab === 'apps' && <Applications />}
          {tab === 'messages' && <Messages />}
          {tab === 'users' && user.role === 'admin' && <Users />}
        </div>
      </section>
    </div>
  );
}
