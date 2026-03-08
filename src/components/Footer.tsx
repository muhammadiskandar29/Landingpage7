'use client'

import Link from 'next/link'
import { Instagram, Facebook, MessageCircle, MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer id="contact" className="bg-[#1A1A1A] text-white py-24 relative overflow-hidden">
            {/* Decorative Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">

                {/* Brand Section */}
                <div className="flex flex-col space-y-8">
                    <div className="flex flex-col">
                        <span className="text-3xl font-serif font-bold text-primary tracking-tight">Ria Florist</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-sans -mt-1 opacity-50">Layanan Premium Jakarta</span>
                    </div>
                    <p className="text-slate-400 font-sans leading-relaxed text-sm">
                        Menghadirkan keanggunan dan pesan profesional melalui papan bunga premium. Mitra Anda untuk perayaan megah dan penghormatan tulus di seluruh Jakarta.
                    </p>
                    <div className="flex space-x-5 pt-2">
                        <Link href="https://instagram.com/riaflorist.jkt" target="_blank" className="p-3 bg-white/5 rounded-full hover:bg-primary transition-colors text-slate-300 hover:text-white">
                            <Instagram size={20} />
                        </Link>
                        <Link href="#" className="p-3 bg-white/5 rounded-full hover:bg-primary transition-colors text-slate-300 hover:text-white">
                            <Facebook size={20} />
                        </Link>
                        <Link href="#" className="p-3 bg-white/5 rounded-full hover:bg-primary transition-colors text-slate-300 hover:text-white">
                            <MessageCircle size={20} />
                        </Link>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col space-y-8">
                    <h4 className="text-xl font-serif font-bold">Tautan Cepat</h4>
                    <ul className="flex flex-col space-y-4">
                        {['Beranda', 'Galeri', 'Tentang Kami', 'Desain Sendiri', 'Kontak'].map((item) => (
                            <li key={item}>
                                <Link href="#" className="text-slate-400 hover:text-primary transition-colors text-sm font-medium">
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Services */}
                <div className="flex flex-col space-y-8">
                    <h4 className="text-xl font-serif font-bold">Layanan</h4>
                    <ul className="flex flex-col space-y-4">
                        {['Papan Grand Opening', 'Papan Bunga Pernikahan', 'Ucapan Duka Cita', 'Papan Ucapan Selamat', 'Pesanan Kustom Korporat'].map((item) => (
                            <li key={item} className="text-slate-400 text-sm font-medium">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col space-y-8">
                    <h4 className="text-xl font-serif font-bold">Kontak Lokal</h4>
                    <ul className="flex flex-col space-y-6">
                        <li className="flex items-start space-x-4 group">
                            <MapPin className="text-primary mt-1 w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-400 leading-relaxed font-sans cursor-pointer hover:text-slate-200">
                                    Jl. Pejaten Barat Raya No. 45A,<br />Jakarta Selatan, 12510
                                </span>
                            </div>
                        </li>
                        <li className="flex items-start space-x-4 group">
                            <Phone className="text-primary mt-1 w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                            <Link href="tel:+6281234567890" className="text-sm text-slate-400 font-sans hover:text-slate-200">+62 812-3456-7890</Link>
                        </li>
                        <li className="flex items-start space-x-4 group">
                            <Mail className="text-primary mt-1 w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                            <Link href="mailto:info@riaflorist.com" className="text-sm text-slate-400 font-sans hover:text-slate-200">hello@riaflorist.com</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                <p className="text-xs text-slate-500 font-sans uppercase tracking-widest">
                    © {currentYear} Ria Florist Jakarta. Hak Cipta Dilindungi.
                </p>
                <div className="flex items-center space-x-10">
                    <Link href="#" className="text-xs text-slate-500 hover:text-slate-300 uppercase tracking-widest font-sans">Kebijakan Privasi</Link>
                    <Link href="#" className="text-xs text-slate-500 hover:text-slate-300 uppercase tracking-widest font-sans">Syarat & Ketentuan</Link>
                </div>
            </div>
        </footer>
    )
}
