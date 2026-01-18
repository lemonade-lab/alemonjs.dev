import type { Plugin } from 'vite'
import { watch } from 'chokidar'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

let isGenerating = false
let pendingRegenerate = false

const NODE_ENV = process.env.NODE_ENV === 'development'

const generate = 'tsx freeWind/src/vite/generate.ts'

/**
 * Vite 插件：监听 docs/blog 目录变化，自动生成路由
 */
export default function docsWatcherPlugin(): Plugin {
  let watcher: ReturnType<typeof watch> | null = null
  let rootDir = ''

  async function regenerateRoutes() {
    if (isGenerating) {
      pendingRegenerate = true
      return
    }

    isGenerating = true
    console.log('\n🔄 检测到文档变化，重新生成路由...')

    try {
      await execAsync(generate, { cwd: rootDir })
      console.log('✅ 路由已更新')
    } catch (error) {
      console.error('❌ 路由生成失败:', error)
    } finally {
      isGenerating = false

      if (pendingRegenerate) {
        pendingRegenerate = false
        setTimeout(() => regenerateRoutes(), 100)
      }
    }
  }

  return {
    name: 'vite-plugin-docs-watcher',

    configResolved(config) {
      rootDir = config.root
    },

    async buildStart() {
      // 生产模式下：构建前生成一次路由
      if (!NODE_ENV) {
        console.log('\n🔨 生产构建：生成路由文件...')
        try {
          await execAsync(generate, { cwd: rootDir })
          console.log('✅ 路由文件已生成\n')
        } catch (error) {
          console.error('❌ 路由生成失败:', error)
          throw error
        }
        return
      }

      // 开发模式下：启动文件监听
      const docsPath = path.join(rootDir, 'docs')
      const blogPath = path.join(rootDir, 'blog')

      watcher = watch([docsPath, blogPath], {
        ignored: /(^|[/\\])\../, // 忽略隐藏文件
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 300,
          pollInterval: 100
        }
      })

      watcher
        .on('add', filePath => {
          if (filePath.endsWith('.md') || filePath.endsWith('.mdx')) {
            console.log(`\n📝 新增文档: ${path.basename(filePath)}`)
            regenerateRoutes()
          }
        })
        .on('change', filePath => {
          if (filePath.endsWith('.md') || filePath.endsWith('.mdx')) {
            console.log(`\n✏️  修改文档: ${path.basename(filePath)}`)
            regenerateRoutes()
          }
        })
        .on('unlink', filePath => {
          if (filePath.endsWith('.md') || filePath.endsWith('.mdx')) {
            console.log(`\n🗑️  删除文档: ${path.basename(filePath)}`)
            regenerateRoutes()
          }
        })

      console.log('\n👀 文档监听已启动 (docs/ & blog/)')
      console.log('💡 新增/修改/删除 .md/.mdx 文件后将自动更新路由\n')
    },

    async closeBundle() {
      if (watcher) {
        await watcher.close()
      }
    }
  }
}
