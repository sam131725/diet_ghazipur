import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { useLang } from '../i18n.jsx';

export default function Login({ portal }) {
  const { t } = useLang();
  const isStudent = portal === 'student';
  const { login, register } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', enrollmentNo: '', batch: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      if (mode === 'register') await register(f);
      else await login(f.email, f.password, portal);
      nav(isStudent ? '/student' : '/admin');
    } catch (ex) { setErr(ex.message); } finally { setBusy(false); }
  };

  return (
    <div className="wrap page narrow">
      <div className="card pad login">
        <h2>{isStudent ? t('Student Portal') : t('Staff / Admin Login')}</h2>
        <p className="muted">{isStudent ? t('Login to apply for programmes and track your application.') : t('Authorised DIET employees only.')}</p>
        <form onSubmit={submit} className="form">
          {mode === 'register' && (
            <>
              <input required placeholder={t('Full name')} value={f.name} onChange={set('name')} />
              <input placeholder={t('Phone')} value={f.phone} onChange={set('phone')} />
              <input placeholder={t('Enrollment no. (if any)')} value={f.enrollmentNo} onChange={set('enrollmentNo')} />
              <input placeholder={t('Batch (e.g. 2026-28)')} value={f.batch} onChange={set('batch')} />
            </>
          )}
          <input required type="email" placeholder={t('Email')} value={f.email} onChange={set('email')} autoComplete="username" />
          <input required type="password" minLength={mode === 'register' ? 8 : 1} placeholder={t('Password')} value={f.password} onChange={set('password')}
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'} />
          {err && <p className="error">{err}</p>}
          <button className="btn" disabled={busy}>{busy ? t('Please wait…') : mode === 'register' ? t('Create account') : t('Login')}</button>
        </form>
        {isStudent && (
          <p className="small center">
            {mode === 'login'
              ? <>{t('New student?')} <a href="#" onClick={(e) => { e.preventDefault(); setMode('register'); }}>{t('Register here')}</a></>
              : <>{t('Already registered?')} <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); }}>{t('Login')}</a></>}
          </p>
        )}
        <p className="small center"><Link to={isStudent ? '/staff/login' : '/student/login'}>
          {isStudent ? t('DIET employee? Staff login') : t('Student? Student login')}</Link></p>
      </div>
    </div>
  );
}
