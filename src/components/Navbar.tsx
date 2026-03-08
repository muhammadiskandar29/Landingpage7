'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { name: 'Katalog', href: '#gallery' },
        { name: 'Tentang Kami', href: '#about' },
    ]

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white shadow-sm py-3' : 'bg-white/80 backdrop-blur-md py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 bg-primary/5 rounded-full overflow-hidden border border-primary/10">
                        <Image src="/logo.png" alt="Ria Florist Logo" fill className="object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-serif font-bold text-primary tracking-tight">Ria Florist</span>
                        <span className="text-[9px] uppercase tracking-[0.2em] font-sans -mt-1 opacity-60">Premium Jakarta</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-10">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="text-sm font-bold text-slate-600 hover:text-primary transition-all duration-300">
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="#designer"
                        className="bg-primary text-white px-8 py-3.5 rounded-full text-sm font-bold hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-primary/30"
                    >
                        Mulai Desain
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-primary bg-[#FAFAFA] rounded-xl border border-slate-100"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-2xl overflow-hidden">
                    <div className="flex flex-col p-8 space-y-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-xl font-bold py-3 border-b border-gray-50 last:border-0"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="#designer"
                            className="bg-primary text-white px-6 py-5 rounded-2xl text-center font-bold shadow-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Mulai Desain Sekarang
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}
