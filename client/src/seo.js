import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MENU, SITE } from './config.js';

export const ORIGIN = 'https://dietghazipur.ac.in';
const BASE = 'DIET Ghazipur';

const STATIC = {
  '/': ['DIET Ghazipur - District Institute of Education & Training, Saidpur, Ghazipur', 'Official website of DIET Ghazipur (District Institute of Education & Training), Department of Basic Education, Uttar Pradesh. D.El.Ed. admissions, training programmes, notices, results and downloads.'],
  '/notices': ['Notices', 'Official notices, circulars and announcements from DIET Ghazipur.'],
  '/gallery': ['Photo Gallery', 'Photos of events, trainings and campus life at DIET Ghazipur.'],
  '/events': ['Events', 'Upcoming and past events at DIET Ghazipur.'],
  '/contact': ['Contact Us', 'Address, phone, email and map of DIET Ghazipur, Saidpur, Ghazipur, Uttar Pradesh.'],
  '/downloads': ['Downloads', 'Forms, circulars, syllabus and other documents to download from DIET Ghazipur.'],
  '/awp': ['Academic Calendar (AWP)', 'Annual Work Plan and academic calendar of DIET Ghazipur.'],
  '/internship': ['Internship', 'School internship programme for D.El.Ed. trainees at DIET Ghazipur.'],
  '/sitemap': ['Sitemap', 'All pages of the DIET Ghazipur website.'],
  '/section/administration/structure': ['Administrative Structure', 'Administrative structure and staff of DIET Ghazipur.'],
};

// Build a path -> [title, description] map from the menu
const MAP = { ...STATIC };
MENU.forEach((m) => (m.children || []).forEach((c) => {
  const p = c.href || `${m.base}/${c.slug}`;
  if (!MAP[p]) MAP[p] = [`${c.label} - ${m.label}`, c.sub || `${c.label} at DIET Ghazipur.`];
}));

export const SEO_PATHS = Object.keys(MAP);

function setMeta(sel, attr, val) {
  const el = document.head.querySelector(sel);
  if (el) el.setAttribute(attr, val);
}

export function useSeo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const clean = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
    const hit = MAP[clean];
    const noindex = /^\/(admin|student|staff|search)/.test(clean);
    const title = hit ? (clean === '/' ? hit[0] : `${hit[0]} | ${BASE}`) : BASE;
    const desc = hit ? hit[1] : `${SITE.sub}, Ghazipur - Department of Basic Education, Government of Uttar Pradesh.`;
    document.title = title;
    setMeta('meta[name="description"]', 'content', desc);
    setMeta('link[rel="canonical"]', 'href', ORIGIN + (clean === '/' ? '/' : clean));
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[property="og:url"]', 'content', ORIGIN + clean);
    setMeta('meta[name="robots"]', 'content', noindex ? 'noindex,nofollow' : 'index,follow');
  }, [pathname]);
}
