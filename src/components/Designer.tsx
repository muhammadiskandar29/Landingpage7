'use client'

import { useRef, useState, useEffect } from 'react'
import {
    Palette,
    Type,
    MessageCircle,
    Download,
    X,
    Layout,
    Paintbrush,
    Sparkles,
    Flower2,
    ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFlowerCanvas, BoardDesign } from '@/hooks/useFlowerCanvas'

const COLORS = [
    { id: 'white', name: 'Putih', value: '#FFFFFF' },
    { id: 'purple', name: 'Ungu', value: '#A855F7' },
    { id: 'pink', name: 'Pink', value: '#F472B6' },
    { id: 'green', name: 'Hijau', value: '#2D5A27' },
    { id: 'red', name: 'Merah', value: '#991B1B' },
    { id: 'blue', name: 'Biru', value: '#1E40AF' },
    { id: 'yellow', name: 'Kuning', value: '#EAB308' },
    { id: 'black', name: 'Hitam', value: '#1A1A1A' },
]

export default function Designer() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [activeTab, setActiveTab] = useState<'base' | 'umbul' | 'text' | 'decor'>('base')
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')

    const [state, setState] = useState<BoardDesign>({
        id: "RIA-STUDIO",
        category: 'Selamat',
        upperFoamColor: "#A855F7",
        lowerFoamColor: "#FFFFFF",
        umbulColor1: "#EAB308",
        umbulColor2: "#FFFFFF",
        headerTextColor: "#FFFFFF",
        headerOrnamentColor: "#EAB308",
        headerBubbleColor: "#F472B6",
        messageText: "ATAS KELAHIRAN PUTRI KEDUA",
        senderText: "RIZKY BILLAR & LESTI KEJORA",
        mahkotaId: 'classic',
        kakiId: 'classic'
    })

    useEffect(() => {
        setState(s => ({ ...s, id: Math.random().toString(36).substring(7).toUpperCase() }))
    }, [])

    const { exportPNG } = useFlowerCanvas(canvasRef, state)

    const handlePreview = () => {
        const dataURL = exportPNG()
        if (dataURL) {
            setPreviewImage(dataURL)
            setIsPreviewOpen(true)
        }
    }

    const handleOrder = () => {
        const phoneNumber = '6285719141187'
        const message = encodeURIComponent(
            `Halo Ria Florist, saya pesan Papan Bunga Kustom ID [#${state.id}].\n\n` +
            `Detail:\n- Ucapan: ${state.category}\n- Pesan: ${state.messageText}\n- Pengirim: ${state.senderText}`
        )
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
    }

    return (
        <section id="designer" className="py-32 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col items-center mb-20 text-center">
                    <div className="inline-flex items-center space-x-2 bg-primary/10 px-6 py-2 rounded-full text-primary font-bold text-xs uppercase tracking-[0.3em] mb-6">
                        <Sparkles size={14} />
                        <span>Premium Interactive Studio</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-serif text-slate-900 font-bold mb-6 tracking-tighter">
                        Desain <span className="text-primary italic border-b-4 border-primary/20">Impian</span> Anda
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl font-sans font-medium">
                        Mesin kustomisasi tercanggih untuk papan bunga Jakarta. Kontrol setiap detail dari busa hingga rangkaian hiasan bunga.
                    </p>
                </div>

                <div className="flex flex-col xl:flex-row gap-16 items-start">
                    {/* Canvas Workspace */}
                    <div className="flex-1 w-full flex flex-col space-y-10 group">
                        <div className="relative bg-[#F8FAFC] rounded-[4rem] p-6 lg:p-20 shadow-inner border border-slate-100 flex justify-center items-center overflow-hidden">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            <div className="relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] bg-white rounded-lg p-2 ring-1 ring-black/5 bg-[url('/wood-texture.png')] bg-cover">
                                <div className="bg-white rounded-sm overflow-hidden border-[12px] border-white/50 backdrop-blur-sm">
                                    <canvas ref={canvasRef} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 p-12 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-primary/10 opacity-20 pointer-events-none"></div>
                            <div className="flex items-center space-x-6 relative z-10">
                                <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center text-white shadow-xl rotate-6 group-hover:rotate-0 transition-transform duration-500">
                                    <Layout size={32} />
                                </div>
                                <div className="text-left">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Design Instance</span>
                                    <h4 className="text-3xl font-serif font-bold text-white tracking-tighter">#{state.id}</h4>
                                    <p className="text-white/40 text-[10px] font-bold uppercase mt-1">Status: Siap Produksi</p>
                                </div>
                            </div>
                            <button
                                onClick={handlePreview}
                                className="w-full md:w-auto px-14 py-6 bg-primary text-white rounded-full font-bold shadow-[0_20px_40px_-10px_rgba(45,90,39,0.5)] hover:shadow-primary/60 transition-all transform hover:scale-105 flex items-center justify-center space-x-4 text-xl relative z-10"
                            >
                                <Download size={24} />
                                <span>Review & Order</span>
                            </button>
                        </div>
                    </div>

                    {/* Control Panel */}
                    <div className="w-full xl:w-[520px] flex flex-col space-y-8 h-full">
                        <div className="bg-white rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden flex flex-col">
                            {/* Tab Navigation */}
                            <div className="grid grid-cols-4 bg-[#FAFAF9] p-4 border-b border-slate-100 gap-2">
                                {(['base', 'umbul', 'text', 'decor'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`py-5 flex flex-col items-center justify-center space-y-2 rounded-3xl transition-all ${activeTab === tab ? 'bg-white text-primary shadow-xl shadow-black/5 border border-slate-100 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {tab === 'base' && <Layout size={20} />}
                                        {tab === 'umbul' && <Paintbrush size={20} />}
                                        {tab === 'text' && <Type size={20} />}
                                        {tab === 'decor' && <Flower2 size={20} />}
                                        <span className="text-[9px] font-black uppercase tracking-widest">{tab === 'base' ? 'Frame' : tab === 'umbul' ? 'Detail' : tab === 'text' ? 'Konten' : 'Aksen'}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-12 max-h-[700px] overflow-y-auto custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'base' && (
                                        <motion.div key="base" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                                            <div>
                                                <div className="flex justify-between items-center mb-6">
                                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-primary rounded-full"></div> Warna Busa Utama
                                                    </h4>
                                                    <span className="text-[10px] font-bold text-slate-300">Papan Atas</span>
                                                </div>
                                                <div className="grid grid-cols-4 gap-4">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => setState(s => ({ ...s, upperFoamColor: c.value }))}
                                                            className={`aspect-square rounded-[2rem] border-4 transition-all ${state.upperFoamColor === c.value ? 'border-primary ring-4 ring-primary/10 scale-110 shadow-lg' : 'border-white bg-[#F1F5F9]'}`}
                                                            style={{ backgroundColor: c.value }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t border-slate-50">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-slate-300 rounded-full"></div> Warna Busa Bawah
                                                    </h4>
                                                    <span className="text-[10px] font-bold text-slate-300">Pakar Pengirim</span>
                                                </div>
                                                <div className="grid grid-cols-4 gap-4">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => setState(s => ({ ...s, lowerFoamColor: c.value }))}
                                                            className={`aspect-square rounded-[2rem] border-4 transition-all ${state.lowerFoamColor === c.value ? 'border-primary ring-4 ring-primary/10 scale-110 shadow-lg' : 'border-white bg-[#F1F5F9]'}`}
                                                            style={{ backgroundColor: c.value }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'umbul' && (
                                        <motion.div key="umbul" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                                            <div>
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Harmoni Warna Umbul 1</h4>
                                                <div className="grid grid-cols-8 gap-3">
                                                    {COLORS.map((c) => (
                                                        <button key={c.id} onClick={() => setState(s => ({ ...s, umbulColor1: c.value }))} className={`aspect-square rounded-full border-2 transition-all ${state.umbulColor1 === c.value ? 'border-primary scale-125' : 'border-white'}`} style={{ backgroundColor: c.value }} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="pt-6 border-t border-slate-50">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Harmoni Warna Umbul 2</h4>
                                                <div className="grid grid-cols-8 gap-3">
                                                    {COLORS.map((c) => (
                                                        <button key={c.id} onClick={() => setState(s => ({ ...s, umbulColor2: c.value }))} className={`aspect-square rounded-full border-2 transition-all ${state.umbulColor2 === c.value ? 'border-primary scale-125' : 'border-white'}`} style={{ backgroundColor: c.value }} />
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'text' && (
                                        <motion.div key="text" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                                            <div className="space-y-8 text-left">
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Kategori Papan</label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {(['Selamat', 'Duka'] as const).map(type => (
                                                            <button key={type} onClick={() => setState(s => ({ ...s, category: type }))} className={`px-4 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest border-2 transition-all ${state.category === type ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105' : 'bg-slate-50 text-slate-400 border-transparent'}`}>{type === 'Selamat' ? 'SELAMAT' : 'DUKA CITA'}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Isi Pesan Utama</label>
                                                    <textarea value={state.messageText} onChange={e => setState(s => ({ ...s, messageText: e.target.value.toUpperCase() }))} rows={3} className="w-full bg-[#FAFAF9] border-2 border-slate-100 rounded-[2.5rem] px-8 py-7 font-bold text-slate-800 focus:bg-white focus:border-primary/20 outline-none transition-all resize-none text-sm" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Detail Pengirim</label>
                                                    <input type="text" value={state.senderText} onChange={e => setState(s => ({ ...s, senderText: e.target.value.toUpperCase() }))} className="w-full bg-[#FAFAF9] border-2 border-slate-100 rounded-[2.5rem] px-8 py-7 font-bold text-slate-800 focus:bg-white focus:border-primary/20 outline-none transition-all text-sm" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'decor' && (
                                        <motion.div key="decor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 text-left">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 block">Hiasan Bunga (Mahkota & Kaki)</label>
                                                <div className="grid grid-cols-2 gap-4 mb-8">
                                                    <div className="space-y-4">
                                                        <span className="text-[9px] font-bold text-slate-300 uppercase block">Mahkota Atas</span>
                                                        <div className="flex gap-2">
                                                            {['none', 'classic', 'tulip'].map(id => (
                                                                <button key={id} onClick={() => setState(s => ({ ...s, mahkotaId: id }))} className={`px-3 py-2 rounded-xl text-[8px] font-bold border-2 transition-all ${state.mahkotaId === id ? 'bg-primary text-white border-primary' : 'bg-slate-50 text-slate-400 border-transparent'}`}>
                                                                    {id.toUpperCase()}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <span className="text-[9px] font-bold text-slate-300 uppercase block">Bunga Bawah</span>
                                                        <div className="flex gap-2">
                                                            {['none', 'classic'].map(id => (
                                                                <button key={id} onClick={() => setState(s => ({ ...s, kakiId: id }))} className={`px-3 py-2 rounded-xl text-[8px] font-bold border-2 transition-all ${state.kakiId === id ? 'bg-primary text-white border-primary' : 'bg-slate-50 text-slate-400 border-transparent'}`}>
                                                                    {id.toUpperCase()}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t border-slate-50">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 block">Kustom Warna Judul & Ornamen</label>
                                                <div className="space-y-8">
                                                    <div>
                                                        <span className="text-[9px] font-bold text-slate-300 uppercase mb-3 block">Warna Teks Utama</span>
                                                        <div className="grid grid-cols-8 gap-3">{COLORS.map(c => (<button key={c.id} onClick={() => setState(s => ({ ...s, headerTextColor: c.value }))} className={`aspect-square rounded-full border-2 ${state.headerTextColor === c.value ? 'border-primary' : 'border-white'} shadow-sm`} style={{ backgroundColor: c.value }} />))}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-[9px] font-bold text-slate-300 uppercase mb-3 block">Warna Pita / Banner</span>
                                                        <div className="grid grid-cols-8 gap-3">{COLORS.map(c => (<button key={c.id} onClick={() => setState(s => ({ ...s, headerBubbleColor: c.value }))} className={`aspect-square rounded-full border-2 ${state.headerBubbleColor === c.value ? 'border-primary' : 'border-white'} shadow-sm`} style={{ backgroundColor: c.value }} />))}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-[9px] font-bold text-slate-300 uppercase mb-3 block">Warna Ornamen Bunga Bulat</span>
                                                        <div className="grid grid-cols-8 gap-3">{COLORS.map(c => (<button key={c.id} onClick={() => setState(s => ({ ...s, headerOrnamentColor: c.value }))} className={`aspect-square rounded-full border-2 ${state.headerOrnamentColor === c.value ? 'border-primary' : 'border-white'} shadow-sm`} style={{ backgroundColor: c.value }} />))}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="bg-primary p-12 rounded-[5rem] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/60">Standard Size</span>
                                <div className="px-6 py-2 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-sm">1,5 x 2.0 Meter</div>
                            </div>
                            <h3 className="text-4xl font-serif font-bold tracking-tight mb-4 relative z-10 italic">Package 300K - 600K</h3>
                            <p className="text-white/70 text-sm font-sans font-medium relative z-10">
                                Kualitas Grade-A dengan busa tebal dan hiasan bunga segar. Desain yang Anda buat sekarang akan diproses persis oleh tim florist kami.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* REVIEW MODAL */}
            <AnimatePresence>
                {isPreviewOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPreviewOpen(false)} className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }} className="relative bg-white w-full max-w-7xl rounded-[5rem] overflow-hidden shadow-2xl z-10 flex flex-col xl:flex-row border-[12px] border-white">
                            <button onClick={() => setIsPreviewOpen(false)} className="absolute top-10 right-10 z-20 p-5 bg-slate-100 text-slate-500 rounded-full hover:bg-rose-50 hover:text-rose-500 shadow-2xl transition-all">
                                <X size={24} />
                            </button>

                            <div className="flex-1 bg-[#F1F5F9] p-12 xl:p-24 flex items-center justify-center relative shadow-inner">
                                <div className="relative w-full aspect-[4/3] bg-white shadow-[0_60px_120px_-30px_rgba(0,0,0,0.3)] rounded-lg p-6 overflow-hidden border-[16px] border-white ring-1 ring-black/5 bg-[url('/wood-texture.png')] bg-cover">
                                    <div className="bg-white rounded shadow-2xl overflow-hidden w-full h-full border-4 border-white/50">
                                        {previewImage && <img src={previewImage} alt="Final Review" className="w-full h-full object-contain" />}
                                    </div>
                                </div>
                            </div>

                            <div className="w-full xl:w-[500px] p-20 flex flex-col justify-between bg-white text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-full h-full bg-primary/[0.02] -z-10 rotate-45 translate-x-1/2"></div>
                                <div className="space-y-12">
                                    <div className="space-y-6">
                                        <div className="inline-block bg-primary/10 px-8 py-3 rounded-full text-xs font-black text-primary uppercase tracking-[0.3em]">Confirmation</div>
                                        <h3 className="text-6xl font-serif font-bold text-slate-900 leading-tight tracking-tighter italic">Review <span className="text-primary">Desain</span></h3>
                                        <p className="text-slate-500 font-sans text-lg">Pastikan tulisan dan kombinasi warna sudah sesuai dengan keinginan Anda sebelum diarahkan ke admin WhatsApp.</p>
                                    </div>

                                    <div className="space-y-8 pt-12 border-t border-slate-100">
                                        <div className="flex items-center space-x-6">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary shadow-sm border border-slate-100 font-mono font-bold">#1</div>
                                            <div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instance ID</span>
                                                <p className="text-xl font-bold text-slate-900 font-mono tracking-tighter">{state.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 pt-16">
                                    <button
                                        onClick={handleOrder}
                                        className="w-full py-8 bg-primary text-white rounded-full font-black flex items-center justify-center space-x-6 shadow-[0_30px_60px_-10px_rgba(45,90,39,0.5)] transition-all transform hover:scale-[1.03] text-2xl group"
                                    >
                                        <span>Order via WhatsApp</span>
                                        <MessageCircle size={32} className="group-hover:rotate-12 transition-transform" />
                                    </button>
                                    <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-[0.4em] leading-relaxed">Admin Active: 08:00 - 22:00 WIB</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    )
}
