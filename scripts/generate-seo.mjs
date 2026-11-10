import fs from 'node:fs/promises';

const siteUrl = (process.env.VITE_SITE_URL || 'http://localhost:5173').replace(/\/$/, '');

const publicRoutes = ['/', '/docs', '/changelog', '/login', '/register'];
const urls = publicRoutes
  .map((route) => `  <url>\n    <loc>${siteUrl}${route}</loc>\n  </url>`)
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

const robots = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /dev/docs\n\nSitemap: ${siteUrl}/sitemap.xml\n`;

await fs.mkdir('dist', { recursive: true });
await fs.writeFile('dist/sitemap.xml', sitemap, 'utf8');
await fs.writeFile('dist/robots.txt', robots, 'utf8');
console.log(`SEO files written for ${siteUrl}`);
