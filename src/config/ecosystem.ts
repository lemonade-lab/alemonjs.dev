export const ECOSYSTEM_URL = 'https://open.alemonjs.com'
export const ECOSYSTEM_API_BASE_URL = (
  import.meta.env?.VITE_ECOSYSTEM_API_BASE_URL || `${ECOSYSTEM_URL}/api`
).replace(/\/+$/, '')
