import { useState } from 'react';
import { api, useLive, fmtDate } from '../api.js';
import { useAuth } from '../auth.jsx';
import NoticeList from '../components/NoticeList.jsx';

const PROGRAMS = ['D.El.Ed. 2026-28', 'NISHTHA Training', 'Internship (4th Semester)', 'Other Training Programme'];
const empty = { program: PROGRAMS[0], fullName: '', fatherName: '', dob: '', gender: 'Male', category: 'General',
  phone: '', email: '', address: '', qualification: '', marksPercent: '' };

export default function StudentPortal() {
  const { user } = useAuth();
  const { data: mine, reload } = useLive('/registrations/mine', 'registrations');
  const [f, setF] = useState({ ...empty, fullName: user.name, email: user.email });
  const [files, setFiles] = useState([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setMsg('');
    try {
      const form = new FormData();
      Object.entries(f).forEach(([k, v]) => form.append(k, v));
      [...files].forEach((x) => form.append('documents', x));
      const r = await api('/registrations', { method: 'POST', form });
      setMsg(`Submitted! Your application number is ${r.applicationNo}`);
      setFiles([]); reload();
    } catch (ex) { setMsg(ex.message); } finally { setBusy(false); }
  };

  return (
    <div className="wrap page">
      <h2>Welcome, {user.name}</h2>
      <div className="two">
        <div className="card pad">
          <h3>Registration / Application Form</h3>
          <form className="form" onSubmit={submit}>
            <select value={f.program} onChange={set('program')}>{PROGRAMS.map((p) => <option key={p}>{p}</option>)}</select>
            <input required placeholder="Full name" value={f.fullName} onChange={set('fullName')} />
            <input placeholder="Father's name" value={f.fatherName} onChange={set('fatherName')} />
            <div className="row gap wrapflex">
              <label className="grow">Date of birth<input type="date" value={f.dob} onChange={set('dob')} /></label>
              <label className="grow">Gender<select value={f.gender} onChange={set('gender')}><option>Male</option><option>Female</option><option>Other</option></select></label>
              <label className="grow">Category<select value={f.category} onChange={set('category')}><option>General</option><option>OBC</option><option>SC</option><option>ST</option><option>EWS</option></select></label>
            </div>
            <input required pattern="[0-9]{10}" title="10-digit mobile number" placeholder="Mobile (10 digits)" value={f.phone} onChange={set('phone')} />
            <input type="email" placeholder="Email" value={f.email} onChange={set('email')} />
            <textarea rows="2" placeholder="Address" value={f.address} onChange={set('address')} />
            <input placeholder="Highest qualification" value={f.qualification} onChange={set('qualification')} />
            <input type="number" min="0" max="100" step="0.01" placeholder="Marks % " value={f.marksPercent} onChange={set('marksPercent')} />
            <label>Documents (PDF/JPG, max 5 files, 8 MB each)
              <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={(e) => setFiles(e.target.files)} /></label>
            <button className="btn" disabled={busy}>{busy ? 'Submitting…' : 'Submit application'}</button>
            {msg && <p className="note">{msg}</p>}
          </form>
        </div>
        <div>
          <div className="card pad">
            <h3>My applications</h3>
            {mine.length === 0 && <p className="muted">You have not applied yet.</p>}
            {mine.map((a) => (
              <div className="notice" key={a._id}>
                <b>{a.applicationNo}</b> — {a.program}
                <div><span className={`status ${a.status}`}>{a.status}</span> <small className="muted">{fmtDate(a.createdAt)}</small></div>
                {a.remarks && <small>Remarks: {a.remarks}</small>}
              </div>
            ))}
          </div>
          <h3 className="sec">Latest notices</h3>
          <NoticeList limit={5} />
        </div>
      </div>
    </div>
  );
}
