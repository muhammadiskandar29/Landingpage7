'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Zap, ShieldCheck, Truck, Star } from 'lucide-react'

export default function Hero() {
    const benefits = [
        { icon: <Zap className="text-primary w-5 h-5" />, text: "Proses Kilat 4 Jam" },
        { icon: <ShieldCheck className="text-primary w-5 h-5" />, text: "Bahan Foam & Bunga Premium" },
        { icon: <Truck className="text-primary w-5 h-5" />, text: "Kurir Internal Terpercaya" },
        { icon: <Star className="text-primary w-5 h-5" />, text: "Kustomisasi Desain Tanpa Batas" },
    ]

    return (
        <section className="relative min-h-screen flex items-center pt-32 pb-20 bg-white overflow-hidden">
            {/* Subtle patterns */}
            <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-primary/[0.02] rounded-bl-[10rem] -z-10 rotate-12 translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col space-y-10"
                >
                    <div className="space-y-6">
                        <div className="inline-flex items-center space-x-3 bg-primary/10 px-6 py-2.5 rounded-full">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </span>
                            <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Premium Florist Jakarta</span>
                        </div>

                        <h1 className="text-5xl md:text-8xl font-serif text-slate-900 leading-[1.05] font-bold">
                            Ucapkan Dengan <span className="text-primary italic">Kemewahan</span>
                        </h1>

                        <p className="text-xl text-slate-500 leading-relaxed max-w-lg font-sans font-medium">
                            Eksklusif: Papan bunga landscape 1,5 x 2 meter dengan desainer interaktif. Paket 600Rb sudah termasuk kustomisasi warna & ornamen premium.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                        {benefits.map((b, i) => (
                            <div key={i} className="flex items-center space-x-3">
                                <div className="bg-primary/10 p-1 rounded-full">{b.icon}</div>
                                <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">{b.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
                        <Link
                            href="#designer"
                            className="w-full sm:w-auto px-12 py-5 bg-primary text-white rounded-full font-bold text-center transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-primary/40 text-lg"
                        >
                            Mulai Desain Paket 600K
                        </Link>
                        <Link
                            href="#gallery"
                            className="w-full sm:w-auto px-12 py-5 border-2 border-primary text-primary rounded-full font-bold text-center hover:bg-primary/5 transition-all duration-300 text-lg"
                        >
                            Lihat Portofolio
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative aspect-square lg:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(45,90,39,0.2)] border-[16px] border-white group"
                >
                    <Image
                        src="/boards/purple-blank.png"
                        alt="Papan Bunga 1,5 x 2 Meter"
                        fill
                        className="object-cover transform transition-transform duration-1000 group-hover:scale-110"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-12">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="h-0.5 w-12 bg-white rounded-full"></div>
                            <span className="text-white text-xs font-bold uppercase tracking-[0.3em]">Artisan Series</span>
                        </div>
                        <h3 className="text-white text-4xl font-serif font-bold italic leading-tight">Keanggunan yang Memikat Pandangan</h3>
                        <p className="text-white/70 mt-3 text-lg font-sans max-w-sm">Dibuat khusus oleh tangan-tangan ahli florist terbaik Jakarta.</p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
