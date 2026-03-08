'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Plus, CheckCircle } from 'lucide-react'

const samples = [
    {
        id: 1,
        title: 'Papan Selamat & Sukses',
        type: 'Grand Opening',
        image: '/boards/purple-blank.png'
    },
    {
        id: 2,
        title: 'Papan Pernikahan Mewah',
        type: 'Wedding Celebration',
        image: '/boards/red-blank.png'
    },
    {
        id: 3,
        title: 'Papan Duka Cita Elegan',
        type: 'Sympathy & Respect',
        image: '/boards/blue-blank.png'
    },
]

export default function Gallery() {
    return (
        <section id="gallery" className="py-32 bg-[#FFFFFF]">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="space-y-4">
                        <div className="inline-block bg-primary/10 px-6 py-2 rounded-full">
                            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Karya & Portofolio</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 leading-tight">
                            Lihat Hasil <span className="text-primary italic">Terbaik</span> Kami
                        </h2>
                    </div>
                    <p className="text-slate-500 max-w-sm font-sans mb-2 font-medium leading-relaxed">
                        Inspirasi desain papan bunga 1,5 x 2 meter dari klien setia Ria Florist Jakarta. Estetika premium yang tak lekang oleh waktu.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {samples.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative bg-[#FAFAFA] rounded-[3.5rem] overflow-hidden shadow-sm border border-slate-50 p-6 transition-all hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-4"
                        >
                            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-8 shadow-inner">
                                <Image src={item.image} alt={item.title} fill className="object-cover transform transition-transform duration-1000 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
                                        <Plus className="text-primary" size={32} />
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 pb-4">
                                <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                                    <span>{item.type}</span>
                                    <div className="h-1 w-1 bg-primary/30 rounded-full"></div>
                                    <span className="text-primary">Premium</span>
                                </div>
                                <h4 className="text-2xl font-bold font-serif text-slate-900 group-hover:text-primary transition-colors">{item.title}</h4>

                                <div className="mt-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity pt-4 border-t border-slate-200">
                                    <span className="text-xs font-bold text-slate-500 font-sans tracking-tight">Katalog Pilihan Ria</span>
                                    <CheckCircle size={16} className="text-primary" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
