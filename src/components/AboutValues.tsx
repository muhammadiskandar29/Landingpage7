'use client'

import { motion } from 'framer-motion'
import { Ruler, Palette, Zap, CheckCircle } from 'lucide-react'

export default function AboutValues() {
    const values = [
        {
            icon: <Ruler className="text-primary w-8 h-8" />,
            title: "1.5x2 Meter Standard",
            description: "Our board dimensions follow the industry standard for a grand and respectful presence."
        },
        {
            icon: <Palette className="text-primary w-8 h-8" />,
            title: "Custom Design & Logo",
            description: "Free customization of colors, fonts, and even complex corporate logo uploads for your branding."
        },
        {
            icon: <Zap className="text-primary w-8 h-8" />,
            title: "Fast Delivery",
            description: "Enjoy express 4-hour production and same-day delivery across all Jakarta districts."
        }
    ]

    return (
        <section id="about" className="py-24 bg-white relative overflow-hidden">
            {/* Texture Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="inline-block bg-primary/10 px-4 py-2 rounded-full"
                    >
                        <span className="text-sm font-medium text-primary uppercase tracking-widest font-sans">Why Ria Florist</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-serif text-slate-900"
                    >
                        Excellence in Every <span className="text-primary italic">Petal</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-slate-500 leading-relaxed font-sans"
                    >
                        We take pride in our artisanal approach. Every board is crafted using high-quality
                        materials and freshly sourced flowers to ensure your message stands out with elegance.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {values.map((val, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-[#FAFAFA] p-10 rounded-[2rem] border border-slate-100 hover:border-primary/20 transition-all duration-300 group shadow-sm hover:shadow-xl hover:shadow-primary/5"
                        >
                            <div className="mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-md group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                <div className="group-hover:text-white transform group-hover:scale-110 transition-transform duration-500">
                                    {val.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif">{val.title}</h3>
                            <p className="text-slate-500 font-sans leading-relaxed">{val.description}</p>

                            <div className="mt-8 flex items-center text-primary font-bold text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <span className="mr-2">Premium Quality</span>
                                <CheckCircle size={16} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
