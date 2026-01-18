import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeaderPage from '@/pages/Home/HeaderPage'
import HomePage from '@/pages/Home/HomePage'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gradient-to-br pt-16">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Features */}
          <HeaderPage />
          <div className="mt-12">
            <HomePage />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
