'use client'

import { useEffect, useRef, useState } from 'react'
import {
    Palette,
    Type,
    MessageCircle,
    Download,
    Layout,
    Layers,
    Settings2,
    X,
    CheckCircle,
    ChevronRight,
    Sparkles
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFabricCanvas, BoardDesign } from '@/hooks/useFabricCanvas'

const COLORS = [
    { id: 'white', name: 'Putih', value: '#FFFFFF' },
    { id: 'purple', name: 'Ungu', value: '#6B21A8' },
    { id: 'pink', name: 'Pink', value: '#F472B6' },
    { id: 'green', name: 'Hijau', value: '#2D5A27' },
    { id: 'red', name: 'Merah', value: '#991B1B' },
    { id: 'blue', name: 'Biru', value: '#1E40AF' },
    { id: 'yellow', name: 'Kuning', value: '#EAB308' },
    { id: 'black', name: 'Hitam', value: '#1A1A1A' },
]

export default function Designer() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { canvasRef, initCanvas, design, updateDesign, exportDesign } = useFabricCanvas()

    const [activeTab, setActiveTab] = useState<'board' | 'umbul' | 'text'>('board')
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [isInitializing, setIsInitializing] = useState(true)

    useEffect(() => {
        if (containerRef.current) {
            initCanvas(containerRef.current.clientWidth)
            setIsInitializing(false)
        }
    }, [initCanvas])

    const handlePreview = () => {
        const dataURL = exportDesign()
        if (dataURL) {
            setPreviewImage(dataURL)
            setIsPreviewOpen(true)
        }
    }

    const handleOrder = () => {
        const phoneNumber = '6285719141187'
        const message = encodeURIComponent(
            `Halo Ria Florist, saya ingin pesan Papan Bunga Kustom:\n\n` +
            `- Kategori: ${design.category}\n` +
            `- Pesan Utama: ${design.messageText}\n` +
            `- Pengirim: ${design.senderText}\n\n` +
            `Desain telah saya buat melalui website.`
        )
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
    }

    return (
        <section id="designer" className="py-24 bg-white" ref={containerRef}>
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-16 text-center">
                    <div className="mb-4 inline-block bg-primary/10 px-6 py-2 rounded-full text-primary font-bold text-sm uppercase tracking-widest">
                        Ria Florist Core Engine
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-slate-900 font-bold mb-4">
                        Studio Desain <span className="text-primary italic">Papan Bunga</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl font-sans font-medium">
                        Kustomisasi papan bunga Anda dengan presisi. Atur ribuan kombinasi warna board, header, dan umbul-umbul bingkai secara real-time.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Workspace - LEFT */}
                    <div className="flex-1 w-full flex flex-col space-y-8">
                        <div className="relative bg-[#F9FAFB] rounded-[3rem] p-4 sm:p-12 shadow-inner border border-slate-100 flex justify-center items-center overflow-hidden">
                            {/* Decorative background effects */}
                            <div className="absolute top-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                            <div className="relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] rounded-lg bg-white overflow-visible transition-all duration-300">
                                <canvas id="core-canvas" ref={canvasRef} />
                                {isInitializing && (
                                    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center space-y-4">
                                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Memulai Mesin...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-primary/5 p-10 rounded-[3.5rem] border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Status: Siap Cetak</span>
                                <h4 className="text-2xl font-bold font-serif text-slate-900 mt-1 uppercase tracking-tight">Sudah Sesuai Desain?</h4>
                            </div>
                            <button
                                onClick={handlePreview}
                                className="w-full md:w-auto px-12 py-5 bg-primary text-white rounded-full font-bold shadow-2xl hover:shadow-primary/40 transition-all transform hover:scale-105 flex items-center justify-center space-x-3 text-lg"
                            >
                                <Download size={24} />
                                <span>Lihat Preview HD</span>
                            </button>
                        </div>
                    </div>

                    {/* Controls - RIGHT */}
                    <div className="w-full lg:w-[480px] flex flex-col space-y-6">
                        <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col ring-1 ring-black/5">
                            {/* Tab Navigation */}
                            <div className="flex bg-[#FAFAFA] p-3 border-b border-slate-100 gap-2">
                                {(['board', 'umbul', 'text'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-4 flex flex-col items-center justify-center space-y-2 rounded-2xl transition-all relative ${activeTab === tab ? 'bg-white text-primary shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {tab === 'board' && <Layers size={18} />}
                                        {tab === 'umbul' && <Palette size={18} />}
                                        {tab === 'text' && <Type size={18} />}
                                        <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                                            {tab === 'board' ? 'Warna Board' : tab === 'umbul' ? 'Umbul' : 'Isi Pesan'}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-10 max-h-[650px] overflow-y-auto custom-scrollbar text-left">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'board' && (
                                        <motion.div key="board" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                                            <div>
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Warna Papan Utama (Layer 1)
                                                </h4>
                                                <div className="grid grid-cols-5 gap-4">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => updateDesign({ mainBoardColor: c.value })}
                                                            className={`aspect-square rounded-full border-4 transition-all ${design.mainBoardColor === c.value ? 'border-primary ring-4 ring-primary/10 scale-110 shadow-xl' : 'border-white hover:border-slate-100'}`}
                                                            style={{ backgroundColor: c.value }} title={c.name}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div> Warna Header Tengah (Layer 2)
                                                </h4>
                                                <div className="grid grid-cols-5 gap-4">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => updateDesign({ headerColor: c.value })}
                                                            className={`aspect-square rounded-full border-4 transition-all ${design.headerColor === c.value ? 'border-primary ring-4 ring-primary/10 scale-110 shadow-xl' : 'border-white hover:border-slate-100'}`}
                                                            style={{ backgroundColor: c.value }} title={c.name}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'umbul' && (
                                        <motion.div key="umbul" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                                            <div>
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Warna Bingkai Umbul A</h4>
                                                <div className="grid grid-cols-5 gap-4">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => updateDesign({ umbulColorA: c.value })}
                                                            className={`aspect-square rounded-full border-4 transition-all ${design.umbulColorA === c.value ? 'border-primary ring-4 ring-primary/10 scale-110 shadow-xl' : 'border-white hover:border-slate-100'}`}
                                                            style={{ backgroundColor: c.value }} title={c.name}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Warna Bingkai Umbul B</h4>
                                                <div className="grid grid-cols-5 gap-4">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => updateDesign({ umbulColorB: c.value })}
                                                            className={`aspect-square rounded-full border-4 transition-all ${design.umbulColorB === c.value ? 'border-primary ring-4 ring-primary/10 scale-110 shadow-xl' : 'border-white hover:border-slate-100'}`}
                                                            style={{ backgroundColor: c.value }} title={c.name}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'text' && (
                                        <motion.div key="text" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                            <div className="space-y-8">
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Pilih Kategori Ucapan</label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {(['Selamat', 'Duka'] as const).map(cat => (
                                                            <button
                                                                key={cat}
                                                                onClick={() => updateDesign({ category: cat })}
                                                                className={`px-4 py-5 rounded-3xl text-[11px] font-bold uppercase tracking-widest border-2 transition-all ${design.category === cat ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' : 'bg-slate-50 text-slate-400 border-transparent hover:text-slate-600'}`}
                                                            >
                                                                {cat === 'Selamat' ? 'SELAMAT' : 'DUKA CITA'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Isi Pesan Tengah</label>
                                                    <textarea
                                                        value={design.messageText}
                                                        onChange={(e) => updateDesign({ messageText: e.target.value.toUpperCase() })}
                                                        rows={3}
                                                        className="w-full bg-slate-50 border-2 border-transparent rounded-[2.5rem] px-8 py-6 font-bold text-slate-800 focus:bg-white focus:border-primary/20 outline-none transition-all resize-none shadow-inner"
                                                        placeholder="ISI PESAN UTAMA..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Nama Pengirim</label>
                                                    <input
                                                        type="text"
                                                        value={design.senderText}
                                                        onChange={(e) => updateDesign({ senderText: e.target.value.toUpperCase() })}
                                                        className="w-full bg-slate-50 border-2 border-transparent rounded-[2.5rem] px-8 py-6 font-bold text-slate-800 focus:bg-white focus:border-primary/20 outline-none transition-all shadow-inner"
                                                        placeholder="NAMA PENGIRIM..."
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Price/Package Badge */}
                        <div className="bg-[#2D5A27] p-12 rounded-[5rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">High-Res Layout</span>
                                    <div className="px-5 py-2 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">1,5 x 2 METER</div>
                                </div>
                                <h3 className="text-4xl font-serif font-bold tracking-tighter mb-4 italic leading-tight">Professional Series</h3>
                                <div className="flex items-center space-x-3 text-white/60">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] font-sans">Multi-Layered Vector Board Engine</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PREVIEW MODAL */}
            <AnimatePresence>
                {isPreviewOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPreviewOpen(false)} className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.98, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 40 }} className="relative bg-white w-full max-w-6xl rounded-[5rem] overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row border-[12px] border-white">
                            <button onClick={() => setIsPreviewOpen(false)} className="absolute top-10 right-10 z-20 p-5 bg-slate-100 text-slate-500 rounded-full hover:bg-rose-50 hover:text-rose-500 shadow-2xl transition-all">
                                <X size={24} />
                            </button>

                            <div className="flex-1 bg-[#F1F5F9] p-12 md:p-24 flex items-center justify-center relative shadow-inner">
                                <div className="relative w-full aspect-[4/3] bg-white shadow-[0_60px_120px_-30px_rgba(0,0,0,0.3)] rounded-sm p-4 overflow-hidden border-[12px] border-white ring-1 ring-black/5">
                                    {previewImage && <img src={previewImage} alt="Final Core Design" className="w-full h-full object-contain" />}
                                </div>
                            </div>

                            <div className="w-full md:w-[480px] p-20 flex flex-col justify-between bg-white text-left">
                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <div className="inline-block bg-primary/10 px-6 py-2 rounded-full text-[11px] font-bold text-primary uppercase tracking-[0.2em]">Ready for Production</div>
                                        <h3 className="text-6xl font-serif font-bold text-slate-900 leading-tight tracking-tighter italic">Final <span className="text-primary italic">Result</span></h3>
                                    </div>

                                    <div className="space-y-6 pt-12 border-t border-slate-100">
                                        <div className="flex flex-col space-y-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SPECIFICATION</span>
                                            <span className="text-lg font-bold text-slate-900">Premium Flower Board (Landscape)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 pt-12">
                                    <button
                                        onClick={handleOrder}
                                        className="w-full py-7 bg-primary text-white rounded-full font-bold flex items-center justify-center space-x-4 shadow-[0_20px_50px_-10px_rgba(45,90,39,0.4)] transition-all transform hover:scale-[1.03] text-2xl"
                                    >
                                        <span>Pesan Sekarang</span>
                                        <MessageCircle size={32} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    )
}
