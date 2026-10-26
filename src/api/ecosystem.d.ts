import type { ReactNode } from 'react'

export interface EcosystemCollection {
  title: string
  types: string
  description: string
  guide?: { href: string; label: string }
}

export interface EcosystemResource {
  id: string
  type: string
  name: string
  description: string
  sourceCategory: string
  repositoryUrl: string
  packageUrl: string
  legacyNotice: string
}

export interface EcosystemResult {
  data: EcosystemResource[]
  total: number
  page: number
  pageSize: number
}

export interface EcosystemDirectoryProps {
  collection: EcosystemCollection
  fallback: ReactNode
}
