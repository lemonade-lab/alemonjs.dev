import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeaderPage from '@/pages/Home/HeaderPage'
import HomePage from '@/pages/Home/HomePage'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-[var(--canvas)] pt-16 text-[var(--text)]">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 sm:pt-8 lg:px-8">
          <HeaderPage />
          <div className="mt-24 sm:mt-32">
            <HomePage />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
