import { defineConfig, PluginOption } from 'vite'
import { fileURLToPath, URL } from 'url'
import react from '@vitejs/plugin-react-swc'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import rehypeHighlight from 'rehype-highlight'
import legacy from '@vitejs/plugin-legacy'
import viteCompression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'
import docsWatcherPlugin from './freeWind/src/vite'
import remarkAdmonition from './freeWind/src/vite/remark-admonition'
import rehypeCodeTitle from './freeWind/src/vite/rehype-code-title'

const NODE_ENV = process.env.NODE_ENV === 'development'

const outDir = './dist'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // 文档监听插件 - 开发模式监听变化，生产模式构建前生成
    docsWatcherPlugin(),
    // MDX 支持 - 必须放在 react 插件之前
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          remarkGfm,
          remarkDirective,
          remarkAdmonition
        ],
        rehypePlugins: [rehypeHighlight, rehypeCodeTitle],
        providerImportSource: '@mdx-js/react'
      })
    } as PluginOption,
    // React SWC 编译
    react(),
    // 兼容旧版或内置浏览器
    legacy({
      targets: ['defaults', 'iOS >= 12', 'Android >= 7'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    }),
    // 压缩静态资源。若部署环境已做 gzip/br，请临时注释二者排查重复压缩导致的解析异常
    viteCompression({ algorithm: 'gzip', ext: '.gz' }),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
    // 注册 PWA
    VitePWA({
      registerType: 'autoUpdate',
      outDir: outDir
    })
  ],
  resolve: {
    alias: [
      {
        find: '@free-wind/core',
        replacement: fileURLToPath(
          new URL('./freeWind/src/index.ts', import.meta.url)
        )
      },
      {
        find: '@free-wind/config',
        replacement: fileURLToPath(
          new URL('./freeWind.config.ts', import.meta.url)
        )
      },
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url))
      }
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.md', '.mdx']
  },
  esbuild: {
    drop: NODE_ENV ? [] : ['console', 'debugger']
  },
  build: {
    sourcemap: NODE_ENV, // 仅开发环境生成 sourcemap
    cssCodeSplit: true, // 开启 CSS 代码分割
    emptyOutDir: true, // 自动清理 dist
    commonjsOptions: {
      transformMixedEsModules: true
    },
    minify: 'terser',
    terserOptions: {
      compress: NODE_ENV
        ? {}
        : {
            drop_console: true,
            drop_debugger: true
          }
    },
    rollupOptions: {
      output: {
        dir: outDir,
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          // 自动根据文件类型分类存放
          const ext = name?.split('.').pop()
          if (ext) return `assets/${ext}/[name]-[hash][extname]`
          return 'assets/[name]-[hash][extname]'
        },
        experimentalMinChunkSize: 1000 * 200, // 200KB
        manualChunks: {
          'react-vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'react-router',
            'react-redux',
            'redux',
            '@reduxjs/toolkit'
          ],
          'utils-vendor': ['axios', 'dayjs', 'classnames']
        }
      }
    }
  }
})
