import fs from 'node:fs'
import path from 'node:path'
import manifest from '../src/config/route-manifest.json'

const dist = path.resolve('dist')
const required = ['index.html', 'sitemap.xml', 'robots.txt', 'rss.xml']
const problems: string[] = []
for (const file of required)
  if (!fs.existsSync(path.join(dist, file))) problems.push(`缺少 dist/${file}`)
for (const entry of manifest) {
  if (entry.redirectTo) continue
  const file = path.join(dist, entry.path.slice(1), 'index.html')
  if (!fs.existsSync(file)) problems.push(`缺少页面产物: ${entry.path}`)
}
const sitemap = fs.existsSync(path.join(dist, 'sitemap.xml'))
  ? fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8')
  : ''
for (const entry of manifest.filter(
  item => !item.redirectTo && item.metadata.noindex !== true
)) {
  if (!sitemap.includes(`https://alemonjs.dev${entry.path}`))
    problems.push(`sitemap 缺少: ${entry.path}`)
}
const htmlFiles = fs
  .readdirSync(dist, { recursive: true })
  .filter(file => String(file).endsWith('.html'))
for (const file of htmlFiles) {
  const content = fs.readFileSync(path.join(dist, String(file)), 'utf8')
  if (content.includes('/src/')) problems.push(`HTML 引用了源码路径: ${file}`)
}
if (problems.length)
  throw new Error(`静态产物校验失败:\n- ${problems.join('\n- ')}`)
console.log(`✅ 静态产物校验通过（${htmlFiles.length} 个 HTML）`)
