'use client'

import { useEffect, useRef, useState } from 'react'
import {
    Palette,
    Type,
    MessageCircle,
    RotateCcw,
    CheckCircle,
    X,
    Layout,
    Download,
    Paintbrush
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// SSR Safety for Fabric
let fabric: any;

interface DesignState {
    id: string;
    headerType: "SELAMAT" | "TURUT BERDUKA CITA";
    messageText: string;
    senderText: string;
    upperBannerColor: string;
    lowerBannerColor: string;
    umbulColor1: string;
    umbulColor2: string;
}

const COLORS = [
    { id: 'purple', name: 'Ungu', value: '#A855F7' },
    { id: 'white', name: 'Putih', value: '#FFFFFF' },
    { id: 'green', name: 'Hijau', value: '#2D5A27' },
    { id: 'red', name: 'Merah', value: '#991B1B' },
    { id: 'blue', name: 'Biru', value: '#1E40AF' },
    { id: 'yellow', name: 'Kuning', value: '#EAB308' },
    { id: 'pink', name: 'Pink', value: '#F472B6' },
    { id: 'orange', name: 'Oranye', value: '#F97316' },
]

export default function Designer() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fabricCanvas = useRef<any>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const [activeTab, setActiveTab] = useState<'board' | 'text' | 'umbul'>('board')
    const [isInitializing, setIsInitializing] = useState(true)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')

    const [state, setState] = useState<DesignState>({
        id: Math.random().toString(36).substring(7).toUpperCase(),
        headerType: "SELAMAT",
        messageText: "ATAS PERNIKAHAN\nBUDI & SARI",
        senderText: "DARI: KELUARGA BESAR JAYA ABADI",
        upperBannerColor: "#A855F7",
        lowerBannerColor: "#FFFFFF",
        umbulColor1: "#EAB308",
        umbulColor2: "#FFFFFF",
    })

    // Initialization
    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return

        fabric = require('fabric').fabric

        const containerWidth = containerRef.current.clientWidth
        const canvasWidth = Math.min(600, containerWidth - 40)
        const canvasHeight = (canvasWidth / 4) * 3

        fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
            width: canvasWidth,
            height: canvasHeight,
            backgroundColor: '#F3F4F6',
            preserveObjectStacking: true,
        })

        renderDesign()
        setIsInitializing(false)

        return () => {
            fabricCanvas.current?.dispose()
        }
    }, [])

    // Re-render whenever state changes
    useEffect(() => {
        if (!isInitializing) renderDesign()
    }, [state, isInitializing])

    const renderDesign = () => {
        const canvas = fabricCanvas.current
        if (!canvas) return

        canvas.clear()
        const width = canvas.width
        const height = canvas.height

        // 70:30 Split
        const upperHeight = height * 0.7

        // 1. Upper Banner (70%)
        const upperBanner = new fabric.Rect({
            left: 0,
            top: 0,
            width: width,
            height: upperHeight,
            fill: state.upperBannerColor,
            selectable: false
        })
        canvas.add(upperBanner)

        // 2. Lower Banner (30%)
        const lowerBanner = new fabric.Rect({
            left: 0,
            top: upperHeight,
            width: width,
            height: height - upperHeight,
            fill: state.lowerBannerColor,
            selectable: false
        })
        canvas.add(lowerBanner)

        // 3. Umbul-Umbul Logic (Alternating 2 Colors)
        const circleRadius = 6
        const spacing = 18

        const drawCircles = (startX: number, endX: number, startY: number, endY: number, isHorizontal: boolean) => {
            let count = 0
            if (isHorizontal) {
                for (let x = startX; x <= endX; x += spacing) {
                    const color = count % 2 === 0 ? state.umbulColor1 : state.umbulColor2
                    canvas.add(new fabric.Circle({
                        left: x, top: startY, radius: circleRadius, fill: color,
                        originX: 'center', originY: 'center', selectable: false
                    }))
                    count++
                }
            } else {
                for (let y = startY; y <= endY; y += spacing) {
                    const color = count % 2 === 0 ? state.umbulColor1 : state.umbulColor2
                    canvas.add(new fabric.Circle({
                        left: startX, top: y, radius: circleRadius, fill: color,
                        originX: 'center', originY: 'center', selectable: false
                    }))
                    count++
                }
            }
        }

        // Outer Frame
        drawCircles(0, width, 0, 0, true) // Top
        drawCircles(0, width, height, 0, true) // Bottom
        drawCircles(0, 0, 0, height, false) // Left
        drawCircles(width, 0, 0, height, false) // Right

        // Separator line circles
        drawCircles(0, width, upperHeight, 0, true)

        // 4. Header Text
        const headText = new fabric.Text(state.headerType, {
            left: width / 2,
            top: upperHeight * 0.28,
            fontSize: upperHeight * 0.22,
            fontFamily: 'Impact, sans-serif',
            fontWeight: 'bold',
            fontStyle: 'italic',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeWidth: 1.5,
            originX: 'center',
            originY: 'middle',
            selectable: false
        })
        canvas.add(headText)

        // 5. Message Text
        const msgText = new fabric.Text(state.messageText.toUpperCase(), {
            left: width / 2,
            top: upperHeight * 0.6,
            fontSize: upperHeight * 0.08,
            fontFamily: 'Impact, sans-serif',
            fill: state.upperBannerColor === '#FFFFFF' ? '#1A1A1A' : '#FFFFFF',
            stroke: '#000000',
            strokeWidth: 0.5,
            textAlign: 'center',
            originX: 'center',
            originY: 'middle',
            selectable: true
        })
        canvas.add(msgText)

        // 6. Sender Text
        const sdrText = new fabric.Text(state.senderText.toUpperCase(), {
            left: width / 2,
            top: upperHeight + ((height - upperHeight) / 2),
            fontSize: (height - upperHeight) * 0.25,
            fontFamily: 'Impact, sans-serif',
            fill: state.lowerBannerColor === '#FFFFFF' ? '#2D5A27' : '#FFFFFF',
            stroke: state.lowerBannerColor === '#FFFFFF' ? 'transparent' : '#000000',
            strokeWidth: 0.5,
            textAlign: 'center',
            originX: 'center',
            originY: 'middle',
            selectable: true
        })
        canvas.add(sdrText)

        canvas.renderAll()
    }

    const generatePreview = () => {
        if (!fabricCanvas.current) return
        const dataURL = fabricCanvas.current.toDataURL({ format: 'png', quality: 1, multiplier: 3 })
        setPreviewImage(dataURL)
        setIsPreviewOpen(true)
    }

    const orderViaWA = () => {
        const phoneNumber = '6285719141187'
        const message = encodeURIComponent(
            `Halo Ria Florist, saya ingin pesan Papan Bunga Polosan (70:30) dengan desain ID [${state.id}].\n\n` +
            `Detail:\n` +
            `- Ucapan: ${state.headerType}\n` +
            `- Pesan: ${state.messageText}\n` +
            `- Pengirim: ${state.senderText}`
        )
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
    }

    return (
        <section id="designer" className="py-24 bg-white" ref={containerRef}>
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col items-center mb-16 text-center">
                    <div className="mb-4 inline-block bg-primary/10 px-6 py-2 rounded-full text-primary font-bold text-sm uppercase tracking-widest">
                        Studio Desain Polos
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-slate-900 font-bold mb-4">
                        Rancang Papan <span className="text-primary italic">Minimalis</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl font-sans font-medium">
                        Kustomisasi papan bunga tanpa hiasan rumit. Fokus pada perpaduan warna banner dan dua warna umbul-umbul yang elegan.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Workspace */}
                    <div className="flex-1 flex flex-col space-y-8">
                        <div className="relative bg-[#FAFAFA] rounded-[3rem] p-4 md:p-14 shadow-inner border border-slate-100 flex justify-center items-center overflow-hidden">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                            <div className="relative shadow-2xl bg-white overflow-visible">
                                <canvas id="design-canvas" ref={canvasRef} />
                                {isInitializing && (
                                    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center space-y-4">
                                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memulai...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-primary/5 p-10 rounded-[3.5rem] border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center space-x-5">
                                <div className="p-4 bg-primary rounded-2xl text-white shadow-lg">
                                    <Layout size={28} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Design ID: {state.id}</span>
                                    <h4 className="text-xl font-bold font-serif text-slate-900 mt-0.5 tracking-tight">Sudah Sesuai Keinginan?</h4>
                                </div>
                            </div>
                            <button
                                onClick={generatePreview}
                                className="w-full md:w-auto px-10 py-5 bg-primary text-white rounded-full font-bold shadow-xl hover:shadow-primary/40 transition-all transform hover:scale-105 flex items-center justify-center space-x-3 text-lg"
                            >
                                <Download size={22} />
                                <span>Lihat Preview</span>
                            </button>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="w-full lg:w-[480px] flex flex-col space-y-6">
                        <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                            <div className="flex bg-[#FAFAFA] p-3 border-b border-slate-100 gap-2">
                                {(['board', 'umbul', 'text'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-4 flex flex-col items-center justify-center space-y-1 rounded-2xl transition-all ${activeTab === tab ? 'bg-white text-primary shadow-sm border border-slate-100' : 'text-slate-400'}`}
                                    >
                                        {tab === 'board' && <Palette size={18} />}
                                        {tab === 'umbul' && <Paintbrush size={18} />}
                                        {tab === 'text' && <Type size={18} />}
                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                            {tab === 'board' ? 'Warna Papan' : tab === 'umbul' ? 'Umbul-Umbul' : 'Isi Ucapan'}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="p-10 max-h-[600px] overflow-y-auto custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'board' && (
                                        <motion.div key="board" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Warna Papan Ucapan (70%)</h4>
                                                <div className="grid grid-cols-7 gap-3">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => setState(s => ({ ...s, upperBannerColor: c.value }))}
                                                            className={`aspect-square rounded-full border-4 transition-all ${state.upperBannerColor === c.value ? 'border-primary ring-2 ring-primary/20 scale-110 shadow-lg' : 'border-white'}`}
                                                            style={{ backgroundColor: c.value }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t border-slate-50">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Warna Papan Pengirim (30%)</h4>
                                                <div className="grid grid-cols-7 gap-3">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => setState(s => ({ ...s, lowerBannerColor: c.value }))}
                                                            className={`aspect-square rounded-full border-4 transition-all ${state.lowerBannerColor === c.value ? 'border-primary ring-2 ring-primary/20 scale-110 shadow-lg' : 'border-white'}`}
                                                            style={{ backgroundColor: c.value }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'umbul' && (
                                        <motion.div key="umbul" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Warna Umbul 1 (Selang-Seling)</h4>
                                                <div className="grid grid-cols-7 gap-3">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => setState(s => ({ ...s, umbulColor1: c.value }))}
                                                            className={`aspect-square rounded-full border-4 transition-all ${state.umbulColor1 === c.value ? 'border-primary ring-2 ring-primary/20 scale-110 shadow-lg' : 'border-white'}`}
                                                            style={{ backgroundColor: c.value }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t border-slate-50">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Warna Umbul 2 (Selang-Seling)</h4>
                                                <div className="grid grid-cols-7 gap-3">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => setState(s => ({ ...s, umbulColor2: c.value }))}
                                                            className={`aspect-square rounded-full border-4 transition-all ${state.umbulColor2 === c.value ? 'border-primary ring-2 ring-primary/20 scale-110 shadow-lg' : 'border-white'}`}
                                                            style={{ backgroundColor: c.value }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'text' && (
                                        <motion.div key="text" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                            <div className="space-y-8 text-left">
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-4 block">Pilih Kategori Ucapan</label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {(['SELAMAT', 'TURUT BERDUKA CITA'] as const).map(type => (
                                                            <button
                                                                key={type}
                                                                onClick={() => setState(s => ({ ...s, headerType: type }))}
                                                                className={`px-4 py-4 rounded-2xl text-[10px] font-bold border-2 transition-all ${state.headerType === type ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-400 border-transparent hover:text-slate-600'}`}
                                                            >
                                                                {type}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-4 block">Bodi Pesan</label>
                                                    <textarea
                                                        value={state.messageText}
                                                        onChange={(e) => setState(s => ({ ...s, messageText: e.target.value.toUpperCase() }))}
                                                        rows={3}
                                                        className="w-full bg-slate-50 border-2 border-transparent rounded-[2rem] px-8 py-6 font-bold text-slate-800 focus:bg-white focus:border-primary/20 outline-none transition-all resize-none shadow-inner"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-4 block">Nama Pengirim</label>
                                                    <input
                                                        type="text"
                                                        value={state.senderText}
                                                        onChange={(e) => setState(s => ({ ...s, senderText: e.target.value.toUpperCase() }))}
                                                        className="w-full bg-slate-50 border-2 border-transparent rounded-[2rem] px-8 py-6 font-bold text-slate-800 focus:bg-white focus:border-primary/20 outline-none transition-all shadow-inner"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="bg-slate-900 p-10 rounded-[4rem] text-white">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Estimasi Paket</span>
                                <div className="flex items-center space-x-2 text-primary">
                                    <CheckCircle size={14} />
                                    <span className="text-[10px] font-bold uppercase">Tersedia</span>
                                </div>
                            </div>
                            <div className="flex items-baseline space-x-2">
                                <span className="text-4xl font-serif font-bold tracking-tight">IDR 600.000</span>
                                <span className="text-white/30 text-xs font-sans">/ Unit</span>
                            </div>
                            <div className="mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                                <div className="flex items-center space-x-3 text-white/60">
                                    <RotateCcw size={14} className="text-primary" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">4 Jam Jadi</span>
                                </div>
                                <div className="flex items-center space-x-3 text-white/60">
                                    <CheckCircle size={14} className="text-primary" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">Free Ongkir</span>
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
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPreviewOpen(false)} className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.98, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 40 }} className="relative bg-white w-full max-w-6xl rounded-[4rem] overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row border-[12px] border-white ring-1 ring-black/5">
                            <button onClick={() => setIsPreviewOpen(false)} className="absolute top-8 right-8 z-20 p-4 bg-slate-100 text-slate-500 rounded-full hover:bg-rose-50 hover:text-rose-500 shadow-xl transition-all">
                                <X size={24} />
                            </button>

                            <div className="flex-1 bg-[#F1F5F9] p-12 md:p-24 flex items-center justify-center relative">
                                <div className="relative w-full aspect-[4/3] bg-white shadow-2xl rounded-sm p-4 overflow-hidden border-[10px] border-white">
                                    {previewImage && <img src={previewImage} alt="Preview Papan Polosan" className="w-full h-full object-contain" />}
                                </div>
                            </div>

                            <div className="w-full md:w-[480px] p-16 flex flex-col justify-between bg-white">
                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <div className="inline-block bg-primary/10 px-6 py-2 rounded-full text-[11px] font-bold text-primary uppercase tracking-widest">Minimalist Design</div>
                                        <h3 className="text-5xl font-serif font-bold text-slate-900 leading-tight tracking-tighter">Hasil <span className="text-primary italic">Desain</span></h3>
                                    </div>

                                    <div className="space-y-6 pt-10 border-t border-slate-100">
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">ID Produk</span>
                                            <span className="text-sm font-bold text-slate-900 font-mono">{state.id}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Kategori</span>
                                            <span className="text-sm font-bold text-slate-800 uppercase tracking-tighter">Polosan Premium</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 pt-12">
                                    <button
                                        onClick={orderViaWA}
                                        className="w-full py-6 bg-primary text-white rounded-full font-bold flex items-center justify-center space-x-4 shadow-2xl hover:shadow-primary/50 transition-all transform hover:scale-[1.02] text-xl"
                                    >
                                        <span>Pesan Sekarang</span>
                                        <MessageCircle size={28} />
                                    </button>
                                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-[0.2em]">Chat Admin: +62 857 1914 1187</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    )
}
