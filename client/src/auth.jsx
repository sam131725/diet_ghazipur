import { createContext, useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from './api.js';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) return setReady(true);
    api('/auth/me').then(setUser).catch(() => localStorage.removeItem('token')).finally(() => setReady(true));
  }, []);

  const login = async (email, password, portal) => {
    const r = await api('/auth/login', { method: 'POST', body: { email, password, portal } });
    localStorage.setItem('token', r.token);
    setUser(r.user);
    return r.user;
  };
  const register = async (body) => {
    const r = await api('/auth/register', { method: 'POST', body });
    localStorage.setItem('token', r.token);
    setUser(r.user);
    return r.user;
  };
  const logout = () => { localStorage.removeItem('token'); setUser(null); };

  return <Ctx.Provider value={{ user, ready, login, register, logout }}>{children}</Ctx.Provider>;
}

export function Protected({ roles, to, children }) {
  const { user, ready } = useAuth();
  if (!ready) return <div className="center-pad">Loading…</div>;
  if (!user) return <Navigate to={to} replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
