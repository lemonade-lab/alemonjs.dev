import { watch } from 'fs'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

let isGenerating = false
let pendingRegenerate = false

/**
 * 执行路由生成
 */
function runGenerate() {
  if (isGenerating) {
    pendingRegenerate = true
    return
  }

  isGenerating = true
  console.log('\n🔄 检测到文件变化，重新生成路由...')

  const child = spawn('tsx', ['scripts/generate.ts'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true
  })

  child.on('close', code => {
    isGenerating = false
    if (code === 0) {
      console.log('✅ 路由已更新\n')
    } else {
      console.error('❌ 路由生成失败\n')
    }

    // 如果在生成过程中又有新的变化，再次生成
    if (pendingRegenerate) {
      pendingRegenerate = false
      setTimeout(() => runGenerate(), 100)
    }
  })
}

/**
 * 监听目录
 */
function watchDirectory(dir: string, label: string) {
  const fullPath = path.join(rootDir, dir)

  console.log(`👀 正在监听 ${label}: ${dir}`)

  watch(fullPath, { recursive: true }, (_, filename) => {
    if (!filename) return

    // 只监听 .md 和 .mdx 文件
    if (filename.endsWith('.md') || filename.endsWith('.mdx')) {
      console.log(`📝 ${label}变化: ${filename}`)
      runGenerate()
    }
  })
}

// 初始生成一次
console.log('🚀 启动文件监听模式...\n')
runGenerate()

// 监听 docs 和 blog 目录
setTimeout(() => {
  watchDirectory('docs', '文档')
  watchDirectory('blog', '博客')

  console.log('\n✨ 文件监听已启动，等待文件变化...')
  console.log('💡 提示: 配合 yarn dev 使用，可实时看到效果\n')
}, 1000)
