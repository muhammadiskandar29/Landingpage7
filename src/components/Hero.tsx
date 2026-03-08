'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center pt-28 pb-20 bg-[#FAFAFA] overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-1/4 -right-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl opacity-50 z-0"></div>
            <div className="absolute bottom-1/4 -left-10 w-80 h-80 rounded-full bg-primary/10 blur-3xl opacity-40 z-0"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="flex flex-col space-y-8"
                >
                    <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full w-fit animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <span className="text-sm font-medium text-primary uppercase tracking-widest">Premium Service Jakarta</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-serif text-slate-900 leading-[1.15] md:leading-[1.1]">
                        Elevate Your <span className="text-primary italic">Greetings</span> with Premium Artistry
                    </h1>

                    <p className="text-lg text-slate-600 leading-relaxed max-w-lg font-sans">
                        Crafting elegant, high-impact flower boards for your most important moments.
                        Fast professional process with white-glove courier delivery across Jakarta.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-6">
                        <Link
                            href="#designer"
                            className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-full font-bold text-center transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-primary/30"
                        >
                            Start Designing
                        </Link>
                        <Link
                            href="#gallery"
                            className="w-full sm:w-auto px-10 py-5 border-2 border-primary text-primary rounded-full font-bold text-center hover:bg-primary/5 transition-all duration-300"
                        >
                            See Gallery
                        </Link>
                    </div>

                    <div className="flex items-center space-x-12 pt-10 border-t border-slate-200">
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-slate-800">1.5 / 2.0</span>
                            <span className="text-xs text-slate-500 uppercase tracking-widest">Standard Meter Size</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-slate-800">4 Hours</span>
                            <span className="text-xs text-slate-500 uppercase tracking-widest">Express Production</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-slate-800">Free</span>
                            <span className="text-xs text-slate-500 uppercase tracking-widest">Local Delivery</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white group"
                >
                    <Image
                        src="/boards/purple-blank.png"
                        alt="Handcrafted Premium Flower Board"
                        fill
                        className="object-cover transform transition-transform duration-700 group-hover:scale-110"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-12">
                        <span className="text-white text-3xl font-serif">A Blank Canvas for Your Expression</span>
                        <p className="text-white/80 mt-2">Design your board with customized flowers and logos.</p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
