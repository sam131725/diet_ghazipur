import { createContext, createElement, useContext, useMemo } from 'react';
import { useLive } from './api.js';
import { SITE, STRUCTURE, MENU } from './config.js';

// Default structure in editable (object) form
export const DEFAULT_STRUCTURE = {
  intro: STRUCTURE.intro,
  stats: STRUCTURE.stats.map(([icon, big, label]) => ({ icon, big, label })),
  levels: STRUCTURE.levels,
};
export const DEFAULT_CONTACT = { address: SITE.address, phone: SITE.phone, email: SITE.email, hours: SITE.hours, message: '', messageHi: '', links: [] };
export const DEFAULT_SITE = { nameHi: SITE.nameHi, name: SITE.name, sub: SITE.sub, dept: SITE.dept.replace(/[()]/g, '') };

const filled = (o) => Object.fromEntries(Object.entries(o || {}).filter(([, v]) => v !== '' && v != null));
const Ctx = createContext({ data: {}, reload: () => {}, ready: true });

/** One shared fetch of the editable site settings for the whole app. */
export function SettingsProvider({ children }) {
  const { data, reload, loading } = useLive('/settings', 'settings');
  const value = useMemo(() => ({ data: Array.isArray(data) ? {} : data || {}, reload, ready: !loading }), [data, reload, loading]);
  return createElement(Ctx.Provider, { value }, children);
}

/** Content that staff edit from the admin panel; falls back to the built-in defaults. */
export function useSettings() {
  const { data: d } = useContext(Ctx);
  return {
    structure: d.structure && Array.isArray(d.structure.levels) && d.structure.levels.length ? { ...DEFAULT_STRUCTURE, ...filled(d.structure) } : DEFAULT_STRUCTURE,
    contact: { ...DEFAULT_CONTACT, ...filled(d.contact), links: d.contact?.links || [] },
    site: { ...DEFAULT_SITE, ...filled(d.site) },
    scertLogo: d.branding?.scertLogo || '',
  };
}

/** Navigation menu. `menu` is what visitors see (hidden entries removed); `fullMenu` is what the editor works on. */
export function useMenu() {
  const { data: d, ready } = useContext(Ctx);
  return useMemo(() => {
    const full = Array.isArray(d.menu) && d.menu.length ? d.menu : MENU;
    const menu = full.filter((m) => !m.hidden).map((m) => (m.children ? { ...m, children: m.children.filter((c) => !c.hidden) } : m));
    return { menu, fullMenu: full, custom: full !== MENU, ready };
  }, [d.menu, ready]);
}

/** Text for the current language: uses the "<key>Hi" field when set, otherwise the translation dictionary. */
export const tx = (lang, t, obj, key) => (lang === 'hi' && obj?.[`${key}Hi`] ? obj[`${key}Hi`] : t(obj?.[key] ?? ''));
/** Menu label: top-level items store Hindi in `hi`, pages in `hi` as well. */
export const lbl = (lang, t, o) => (lang === 'hi' && o?.hi ? o.hi : t(o?.label ?? ''));

export const slugify = (s, taken = []) => {
  let base = String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'page';
  let slug = base, n = 2;
  while (taken.includes(slug)) slug = `${base}-${n++}`;
  return slug;
};
