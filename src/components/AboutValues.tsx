'use client'

import { motion } from 'framer-motion'
import { Ruler, Palette, Zap, Truck } from 'lucide-react'

export default function AboutValues() {
    const details = [
        {
            icon: <Zap className="text-primary w-8 h-8" />,
            title: "Proses Cepat",
            description: "Produksi efisien dengan standar kualitas tinggi untuk memenuhi kebutuhan mendesak Anda."
        },
        {
            icon: <Palette className="text-primary w-8 h-8" />,
            title: "Kustomisasi Penuh",
            description: "Atur warna, tulisan, dan logo sesuka hati melalui desainer interaktif kami."
        },
        {
            icon: <Truck className="text-primary w-8 h-8" />,
            title: "Kurir Internal",
            description: "Pengiriman aman ditangani langsung oleh tim internal kami untuk menjaga kondisi bunga tetap segar."
        },
        {
            icon: <Ruler className="text-primary w-8 h-8" />,
            title: "Ukuran Standar",
            description: "Kami hanya menggunakan dimensi terbaik 1,5 x 2 meter untuk kehadiran yang megah."
        }
    ]

    return (
        <section id="about" className="py-32 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="flex flex-col space-y-8"
                    >
                        <div className="inline-block bg-primary/10 px-6 py-2 rounded-full w-fit">
                            <span className="text-sm font-bold text-primary uppercase tracking-[0.2em] font-sans">Tentang Kami</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif text-slate-900 font-bold leading-tight">
                            Dedikasi untuk <span className="text-primary italic">Momen Berharga</span> Anda
                        </h2>
                        <p className="text-lg text-slate-500 leading-relaxed font-sans max-w-xl">
                            Ria Florist lahir dari keinginan untuk memberikan layanan papan bunga terbaik di Jakarta. Kami menggabungkan keahlian tradisional dengan teknologi desain modern untuk memastikan pesan Anda tersampaikan dengan elegan dan tepat waktu.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {details.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-[#FAFAFA] p-8 rounded-[2.5rem] border border-slate-100 hover:border-primary/20 transition-all group shadow-sm hover:shadow-xl hover:shadow-primary/5"
                            >
                                <div className="mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-md group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <div className="group-hover:text-white transform group-hover:scale-110 transition-transform duration-500">
                                        {item.icon}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3 font-serif">{item.title}</h3>
                                <p className="text-slate-500 font-sans text-sm leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
