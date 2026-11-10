// Generates public/sitemap.xml from the site menu. Runs automatically before `npm run build`.
import { writeFileSync } from 'node:fs';
import { MENU } from '../src/config.js';

const ORIGIN = 'https://dietghazipur.ac.in';
const paths = new Set(['/', '/notices', '/gallery', '/events', '/contact', '/downloads', '/awp', '/internship',
  '/sitemap', '/section/administration/structure']);
MENU.forEach((m) => {
  if (m.to) paths.add(m.to);
  (m.children || []).forEach((c) => paths.add(c.href || `${m.base}/${c.slug}`));
});
const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  [...paths].map((p) => `  <url><loc>${ORIGIN}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod></url>`).join('\n') + '\n</urlset>\n';
writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml);
console.log('sitemap.xml:', paths.size, 'urls');
