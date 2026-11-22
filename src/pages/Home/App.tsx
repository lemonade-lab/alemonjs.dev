import Footer from '@/components/Footer'
import RouteMeta from '@/components/RouteMeta'
import SiteFrame from '@/layouts/SiteFrame'
import HeaderPage from './HeaderPage'
import HomePage from './HomePage'

export default function Home() {
  return (
    <SiteFrame>
      <RouteMeta />
      <div className="site-home">
        <HeaderPage />
        <HomePage />
      </div>
      <Footer />
    </SiteFrame>
  )
}
