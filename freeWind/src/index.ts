type Config = {
  themeConfig: {
    navbar: {
      logo?: {
        alt: string
        src: string
      }
      title?: string
      items: Array<
        | {
            position: 'left' | 'right'
            label: string
            type: 'docSidebar'
            sidebarId: string
          }
        | {
            to: string
            label: string
            position: 'left' | 'right'
          }
        | {
            position: 'left' | 'right'
            label: string
            href: string
          }
      >
    }
    footer: {
      style: 'dark' | 'light'
      copyright?: string
      links: Array<{
        title: string
        items: Array<{
          label: string
          to?: string
          href?: string
        }>
      }>
    }
  }
}

/**
 *
 * @param config
 * @returns
 */
export const defineConfig = (config: Config) => config
