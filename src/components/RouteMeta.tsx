import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getRouteMetadata, siteTitle } from '@/utils/routeMetadata'

function setMeta(name: string, content: string, property = false) {
  const selector = property
    ? `meta[property="${name}"]`
    : `meta[name="${name}"]`
  let element = document.head.querySelector<HTMLMetaElement>(selector)

  if (!element) {
    element = document.createElement('meta')
    if (property) element.setAttribute('property', name)
    else element.setAttribute('name', name)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

export default function RouteMeta() {
  const location = useLocation()

  useEffect(() => {
    const metadata = getRouteMetadata(location.pathname)
    const { title, description, image } = metadata

    document.title = `${title} · ${siteTitle}`
    setMeta('description', description)
    setMeta('og:title', title, true)
    setMeta('og:description', description, true)
    setMeta('og:image', image, true)
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', image)

    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    )
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = metadata.canonical.replace(
      'https://alemonjs.dev',
      window.location.origin
    )
    setMeta('robots', metadata.robots)
  }, [location.pathname])

  return null
}
