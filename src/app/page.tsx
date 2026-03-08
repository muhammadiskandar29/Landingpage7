import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import AboutValues from '@/components/AboutValues'
import Designer from '@/components/Designer'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative bg-[#FAFAFA]">
      <Navbar />
      <Hero />
      <AboutValues />
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      </div>
      <Designer />
      <Footer />

      {/* Scroll Indicator */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden md:block opacity-20 hover:opacity-100 transition-opacity">
        <div className="w-6 h-10 border-2 border-slate-900 rounded-full flex justify-center p-1">
          <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-bounce"></div>
        </div>
      </div>
    </main>
  )
}
