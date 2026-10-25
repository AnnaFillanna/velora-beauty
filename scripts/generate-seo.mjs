import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { loadEnv } from 'vite'

const root = process.cwd()
const mode = process.env.MODE ?? 'production'
const env = loadEnv(mode, root, 'VITE_')
const configuredSiteUrl = env.VITE_SITE_URL?.trim()
const distDirectory = path.join(root, 'dist')
const robotsPath = path.join(distDirectory, 'robots.txt')
const sitemapPath = path.join(distDirectory, 'sitemap.xml')

await mkdir(distDirectory, { recursive: true })
const existingRobots = await readFile(robotsPath, 'utf8')
const robotsWithoutSitemap = existingRobots.split(/\r?\n/).filter((line) => !/^sitemap:/i.test(line)).join('\n').trimEnd()

if (!configuredSiteUrl) {
  await rm(sitemapPath, { force: true })
  await writeFile(robotsPath, `${robotsWithoutSitemap}\n`)
  console.warn('VITE_SITE_URL is not configured: sitemap.xml and canonical URLs are omitted until the public HTTPS URL is known.')
} else {
  const siteUrl = new URL(configuredSiteUrl)
  const reservedHost = ['example.com', 'example.net', 'example.org'].includes(siteUrl.hostname)
    || ['.example', '.example.com', '.example.net', '.example.org', '.invalid', '.localhost', '.local', '.test'].some((suffix) => siteUrl.hostname.endsWith(suffix))
  if (siteUrl.protocol !== 'https:' || siteUrl.username || siteUrl.password || siteUrl.search || siteUrl.hash || reservedHost || siteUrl.hostname === 'localhost') {
    throw new Error('VITE_SITE_URL must be a public HTTPS URL without credentials, query, or fragment.')
  }
  const basePath = siteUrl.pathname.replace(/\/+$/, '')
  const origin = siteUrl.origin
  const paths = [
    '/',
    '/treatments',
    '/treatments/lashes-brows',
    '/treatments/nails',
    '/treatments/face-skin',
    '/treatments/body-laser',
    '/collection',
    '/collection/radiance-serum',
    '/collection/hydra-essence',
    '/collection/renewal-night-cream',
    '/collection/gentle-cleansing-balm',
    '/collection/eye-contour-complex',
    '/collection/daily-protection-spf-50',
    '/about',
    '/contact',
    '/book',
    '/impressum',
    '/datenschutz',
  ]
  const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
  const today = new Date().toISOString().slice(0, 10)
  const entries = paths.map((pathname) => {
    const suffix = pathname === '/' ? '/' : pathname
    const location = `${origin}${basePath}${suffix}`
    return `  <url>\n    <loc>${escapeXml(location)}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`
  }).join('\n')
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
  const sitemapUrl = `${origin}${basePath}/sitemap.xml`

  await writeFile(sitemapPath, sitemap)
  await writeFile(robotsPath, `${robotsWithoutSitemap}\nSitemap: ${sitemapUrl}\n`)
  console.info(`Generated sitemap.xml for ${origin}${basePath || '/'}`)
}
