import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import manifest from '../src/config/route-manifest.json'
import { getRouteMetadata, siteTitle } from '../src/utils/routeMetadata'

const root = process.cwd()
const distDir = path.join(root, 'dist')
const serverEntry = await import(
  pathToFileURL(path.join(root, 'dist-server/entry-server.js')).href
)

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function jsonLd(pathname: string) {
  const metadata = getRouteMetadata(pathname)
  const base = {
    '@context': 'https://schema.org',
    'name': metadata.title,
    'description': metadata.description,
    'url': metadata.canonical
  }
  if (metadata.type === 'BlogPosting')
    return {
      ...base,
      '@type': metadata.type,
      'datePublished': metadata.entry?.date,
      'image': metadata.image
    }
  if (metadata.type === 'TechArticle')
    return {
      ...base,
      '@type': metadata.type,
      'image': metadata.image,
      'inLanguage': metadata.entry?.locale || 'zh-CN'
    }
  return {
    ...base,
    '@type': metadata.type,
    'publisher': {
      '@type': 'Organization',
      'name': siteTitle,
      'url': 'https://alemonjs.dev'
    }
  }
}

function headFor(pathname: string) {
  const metadata = getRouteMetadata(pathname)
  return `<title>${escapeHtml(metadata.title)} · ${siteTitle}</title>\n    <meta name="description" content="${escapeHtml(metadata.description)}" />\n    <meta name="robots" content="${metadata.robots}" />\n    <link rel="canonical" href="${metadata.canonical}" />\n    <meta property="og:title" content="${escapeHtml(metadata.title)}" />\n    <meta property="og:description" content="${escapeHtml(metadata.description)}" />\n    <meta property="og:image" content="${escapeHtml(metadata.image)}" />\n    <script type="application/ld+json">${JSON.stringify(jsonLd(pathname)).replace(/</g, '\\u003c')}</script>`
}

async function writePage(template: string, pathname: string, html: string) {
  const outputDir =
    pathname === '/' ? distDir : path.join(distDir, pathname.slice(1))
  await fs.mkdir(outputDir, { recursive: true })
  const page = template
    .replace(/<title>[\s\S]*?<\/title>/, headFor(pathname))
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  await fs.writeFile(path.join(outputDir, 'index.html'), page)
}

const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8')
const paths = [
  '/',
  ...manifest.filter(entry => !entry.redirectTo).map(entry => entry.path)
]
for (const pathname of paths) {
  const result = await serverEntry.renderPath(pathname)
  if (result.redirect) continue
  await writePage(template, pathname, result.html)
  console.log(`✅ prerendered ${pathname}`)
}
