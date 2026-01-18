// Vite 环境变量类型定义
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly NODE_ENV: 'development' | 'production'
  readonly NODE_BASE_ENV?: 'base' | 'pro'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly glob: (pattern: string) => Record<string, () => Promise<unknown>>
}
