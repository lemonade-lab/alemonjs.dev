const icons = {
  docs: 'M12 6v14M3 5.5c3-1.5 6-1.5 9 0 3-1.5 6-1.5 9 0v13c-3-1.5-6-1.5-9 0-3-1.5-6-1.5-9 0z',
  workbench: 'M3 4.5h18v15H3zM3 9h18M9 9v10.5',
  bot: 'M12 5V2m-7 9H3m18 0h-2M7 5h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm2 6h.01M15 11h.01M9 15h6',
  help: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm-3-13a3 3 0 1 1 4 2.83c-.6.22-1 .69-1 1.3V14m0 3h.01',
  blog: 'M6 3h9l4 4v14H5V3h1Zm9 0v5h4M8 12h8m-8 4h8',
  eco: 'M12 2.5 21 7.5v9l-9 5-9-5v-9l9-5Zm0 19v-9m9-5-9 5-9-5m4.5-2.5 9 5',
  download: 'M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5',
  source: 'm8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18',
  search: 'M21 21l-4.3-4.3m1.8-5.2a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
  menu: 'M4 5h16v14H4zM9 5v14',
  toc: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  close: 'm6 6 12 12M18 6 6 18',
  chevron: 'm9 6 6 6-6 6',
  sun: 'M12 3v2m0 14v2M3 12h2m14 0h2M5.64 5.64l1.42 1.42m9.88 9.88 1.42 1.42m0-12.72-1.42 1.42m-9.88 9.88-1.42 1.42M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  moon: 'M20.5 15.2a8.5 8.5 0 1 1-11.7-11.7 8.7 8.7 0 0 0 11.7 11.7Z'
}

export type IconName = keyof typeof icons

export default function SiteIcon({ name }: { name: IconName }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={icons[name]} />
    </svg>
  )
}
