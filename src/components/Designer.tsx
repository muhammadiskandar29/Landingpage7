'use client'

import { useEffect, useRef, useState } from 'react'
import {
    Palette,
    Type,
    Flower2,
    MessageCircle,
    RotateCcw,
    CheckCircle,
    X,
    ChevronRight,
    Layout,
    Download
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// SSR Safety for Fabric
let fabric: any;

interface DesignState {
    id: string;
    headerType: "SELAMAT" | "TURUT BERDUKA CITA";
    messageText: string;
    senderText: string;
    headerBannerColor: string;
    senderBannerColor: string;
    umbulUmbulColor: string;
    boardColor: string;
    ornamentId: string;
}

const PACKAGE_ID = "PAKET-600K";

const COLORS = [
    { id: 'green', name: 'Hijau Ria', value: '#2D5A27' },
    { id: 'red', name: 'Merah Berani', value: '#991B1B' },
    { id: 'blue', name: 'Biru Elegan', value: '#1E40AF' },
    { id: 'yellow', name: 'Kuning Cerah', value: '#EAB308' },
    { id: 'white', name: 'Putih Bersih', value: '#FFFFFF' },
    { id: 'black', name: 'Hitam Klasik', value: '#171717' },
    { id: 'purple', name: 'Ungu Mewah', value: '#6B21A8' },
]

const HEADER_ORNAMENTS = [
    { id: 'classic', name: 'Klasik', path: '/flowers/top-flower-rose.png' },
    { id: 'modern', name: 'Modern', path: '/flowers/top-tulip.png' },
    { id: 'minimal', name: 'Minimalis', path: '/flowers/corner-flower-yellow.png' },
]

export default function Designer() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fabricCanvas = useRef<any>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const [activeTab, setActiveTab] = useState<'board' | 'text' | 'ornaments'>('board')
    const [isInitializing, setIsInitializing] = useState(true)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')

    const [state, setState] = useState<DesignState>({
        id: Math.random().toString(36).substring(7).toUpperCase(),
        headerType: "SELAMAT",
        messageText: "ATAS PERNIKAHAN\nRAFFI & NAGITA",
        senderText: "DARI: KELUARGA BESAR RIA FLORIST",
        headerBannerColor: "#2D5A27",
        senderBannerColor: "#2D5A27",
        umbulUmbulColor: "#EAB308",
        boardColor: "#FFFFFF",
        ornamentId: 'classic'
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

    const renderDesign = async () => {
        const canvas = fabricCanvas.current
        if (!canvas) return

        canvas.clear()
        const width = canvas.width
        const height = canvas.height
        const padding = 20

        // 1. Core Board Base
        const board = new fabric.Rect({
            left: 0,
            top: 0,
            width: width,
            height: height,
            fill: state.boardColor,
            stroke: '#D1D5DB',
            strokeWidth: 2,
            selectable: false
        })
        canvas.add(board)

        // 2. Umbul-Umbul (Circular Border)
        const circleRadius = 6
        const spacing = 20
        // Top
        for (let x = 0; x <= width; x += spacing) {
            canvas.add(new fabric.Circle({ left: x, top: 0, radius: circleRadius, fill: state.umbulUmbulColor, originX: 'center', originY: 'center', selectable: false }))
        }
        // Bottom
        for (let x = 0; x <= width; x += spacing) {
            canvas.add(new fabric.Circle({ left: x, top: height, radius: circleRadius, fill: state.umbulUmbulColor, originX: 'center', originY: 'center', selectable: false }))
        }
        // Left
        for (let y = 0; y <= height; y += spacing) {
            canvas.add(new fabric.Circle({ left: 0, top: y, radius: circleRadius, fill: state.umbulUmbulColor, originX: 'center', originY: 'center', selectable: false }))
        }
        // Right
        for (let y = 0; y <= height; y += spacing) {
            canvas.add(new fabric.Circle({ left: width, top: y, radius: circleRadius, fill: state.umbulUmbulColor, originX: 'center', originY: 'center', selectable: false }))
        }

        // 3. Header Banner
        const headBanner = new fabric.Rect({
            left: 10,
            top: 10,
            width: width - 20,
            height: height * 0.18,
            fill: state.headerBannerColor,
            selectable: false
        })
        canvas.add(headBanner)

        // 4. Sender Banner
        const sendBanner = new fabric.Rect({
            left: 10,
            top: height - (height * 0.15) - 10,
            width: width - 20,
            height: height * 0.15,
            fill: state.senderBannerColor,
            selectable: false
        })
        canvas.add(sendBanner)

        // 5. Fixed Flowers (Mahkota & Kaki)
        // Mahkota (Top)
        fabric.Image.fromURL('/flowers/top-flower-rose.png', (img: any) => {
            img.scaleToWidth(width * 0.4)
            img.set({ left: width / 2, top: 10, originX: 'center', originY: 'center', selectable: false })
            canvas.add(img)
            canvas.bringToFront(img)
        })
        // Kaki (Bottom)
        fabric.Image.fromURL('/flowers/bottom-stand-flowers.png', (img: any) => {
            img.scaleToWidth(width * 0.5)
            img.set({ left: width / 2, top: height - 10, originX: 'center', originY: 'center', selectable: false })
            canvas.add(img)
            canvas.bringToFront(img)
        })

        // 6. Header Text
        const headText = new fabric.Text(state.headerType, {
            left: width / 2,
            top: 10 + (height * 0.09),
            fontSize: height * 0.08,
            fontFamily: 'Impact, sans-serif',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeWidth: 1,
            originX: 'center',
            originY: 'center',
            selectable: false
        })
        canvas.add(headText)

        // 7. Message Text (Middle)
        const msgText = new fabric.Text(state.messageText.toUpperCase(), {
            left: width / 2,
            top: height * 0.45,
            fontSize: height * 0.05,
            fontFamily: 'Impact, sans-serif',
            fill: '#2D3748',
            textAlign: 'center',
            originX: 'center',
            originY: 'center',
            selectable: true
        })
        canvas.add(msgText)

        // 8. Sender Text (Bottom)
        const sdrText = new fabric.Text(state.senderText.toUpperCase(), {
            left: width / 2,
            top: height - (height * 0.075) - 10,
            fontSize: height * 0.04,
            fontFamily: 'Impact, sans-serif',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeWidth: 0.5,
            originX: 'center',
            originY: 'center',
            selectable: true
        })
        canvas.add(sdrText)

        // 9. Selected Header Ornament
        const activeOrn = HEADER_ORNAMENTS.find(o => o.id === state.ornamentId)
        if (activeOrn) {
            fabric.Image.fromURL(activeOrn.path, (img: any) => {
                img.scaleToWidth(width * 0.15)
                // Left of header text
                const leftOrn = fabric.util.object.clone(img)
                leftOrn.set({ left: width * 0.15, top: 10 + (height * 0.09), originX: 'center', originY: 'center', selectable: false })

                // Right of header text
                const rightOrn = fabric.util.object.clone(img)
                rightOrn.set({ left: width * 0.85, top: 10 + (height * 0.09), originX: 'center', originY: 'center', flipX: true, selectable: false })

                canvas.add(leftOrn, rightOrn)
                canvas.renderAll()
            })
        }

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
            `Halo Ria Florist, saya ingin pesan Paket 600rb dengan desain kustom ID [${state.id}].\n\n` +
            `Ringkasan Desain:\n` +
            `- Ucapan: ${state.headerType}\n` +
            `- Pengirim: ${state.senderText}`
        )
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
    }

    return (
        <section id="designer" className="py-24 bg-white" ref={containerRef}>
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col items-center mb-16 text-center">
                    <div className="mb-4 inline-block bg-primary/10 px-6 py-2 rounded-full text-primary font-bold text-sm uppercase tracking-widest">
                        Designer Khusus Paket 600Rb
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-slate-900 font-bold mb-4">
                        Custom Desain <span className="text-primary italic">Papan Ria 600K</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl font-sans">
                        Rancang papan bunga Landscape 1,5x2m Anda dengan kontrol penuh pada warna banner, umbul-umbul, dan pesan ucapan.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Workspace - LEFT */}
                    <div className="flex-1 w-full flex flex-col space-y-8">
                        <div className="relative bg-[#F9FAFB] rounded-[3rem] p-4 sm:p-12 shadow-inner border border-slate-100 flex justify-center items-center overflow-hidden">
                            {/* Decorative background circles */}
                            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                            <div className="relative shadow-2xl rounded-sm overflow-visible bg-white">
                                <canvas id="design-canvas" ref={canvasRef} />
                                {isInitializing && (
                                    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center space-y-4">
                                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm font-bold text-slate-400 font-sans">Menciptakan Studio...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-primary/5 p-8 rounded-[3rem] border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <span className="text-xs font-bold text-primary uppercase tracking-widest">ID Desain: {state.id}</span>
                                <h4 className="text-xl font-bold font-serif text-slate-900 mt-1 uppercase tracking-tight">Sudah Sesuai Keinginan?</h4>
                            </div>
                            <button
                                onClick={generatePreview}
                                className="w-full md:w-auto px-10 py-5 bg-primary text-white rounded-full font-bold shadow-xl hover:shadow-primary/30 transition-all transform hover:scale-105 flex items-center justify-center space-x-3"
                            >
                                <Download size={20} />
                                <span>Lihat Preview & Pesan</span>
                            </button>
                        </div>
                    </div>

                    {/* Controls - RIGHT */}
                    <div className="w-full lg:w-[450px] flex flex-col space-y-6">
                        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
                            {/* Tab Navigation */}
                            <div className="flex bg-[#FAFAFA] p-2 border-b border-slate-100 gap-1">
                                {(['board', 'text', 'ornaments'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-4 flex flex-col items-center justify-center space-y-1.5 rounded-2xl transition-all relative ${activeTab === tab ? 'bg-white text-primary shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {tab === 'board' && <Layout size={18} />}
                                        {tab === 'text' && <Type size={18} />}
                                        {tab === 'ornaments' && <Flower2 size={18} />}
                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                            {tab === 'board' ? 'Warna Board' : tab === 'text' ? 'Isi Ucapan' : 'Hiasan'}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-10 max-h-[650px] overflow-y-auto custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'board' && (
                                        <motion.div key="board" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Warna Banner Atas (Ucapan)</h4>
                                                <div className="grid grid-cols-7 gap-2">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => setState(s => ({ ...s, headerBannerColor: c.value }))}
                                                            className={`aspect-square rounded-full border-4 transition-all ${state.headerBannerColor === c.value ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-white'}`}
                                                            style={{ backgroundColor: c.value }} title={c.name}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-slate-50">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Warna Banner Bawah (Pengirim)</h4>
                                                <div className="grid grid-cols-7 gap-2">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => setState(s => ({ ...s, senderBannerColor: c.value }))}
                                                            className={`aspect-square rounded-full border-4 transition-all ${state.senderBannerColor === c.value ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-white'}`}
                                                            style={{ backgroundColor: c.value }} title={c.name}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-slate-50">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Warna Umbul-Umbul (Bingkai)</h4>
                                                <div className="grid grid-cols-7 gap-2">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => setState(s => ({ ...s, umbulUmbulColor: c.value }))}
                                                            className={`aspect-square rounded-full border-4 transition-all ${state.umbulUmbulColor === c.value ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-white'}`}
                                                            style={{ backgroundColor: c.value }} title={c.name}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'text' && (
                                        <motion.div key="text" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-3 block">Pilih Ucapan Utama</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {(['SELAMAT', 'TURUT BERDUKA CITA'] as const).map(type => (
                                                            <button
                                                                key={type}
                                                                onClick={() => setState(s => ({ ...s, headerType: type }))}
                                                                className={`px-4 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-tight border transition-all ${state.headerType === type ? 'bg-primary text-white border-primary shadow-lg' : 'bg-[#FAFAFA] text-slate-400 border-slate-100 hover:text-slate-600'}`}
                                                            >
                                                                {type}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-3 block">Isi Pesan (Bodi Tengah)</label>
                                                    <textarea
                                                        value={state.messageText}
                                                        onChange={(e) => setState(s => ({ ...s, messageText: e.target.value }))}
                                                        rows={3}
                                                        className="w-full bg-[#FAFAFA] border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none shadow-inner"
                                                        placeholder="Contoh: ATAS PERNIKAHAN..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-3 block">Nama Pengirim (Banner Bawah)</label>
                                                    <input
                                                        type="text"
                                                        value={state.senderText}
                                                        onChange={(e) => setState(s => ({ ...s, senderText: e.target.value }))}
                                                        className="w-full bg-[#FAFAFA] border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner"
                                                        placeholder="Contoh: KELUARGA BESAR..."
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'ornaments' && (
                                        <motion.div key="ornaments" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pilih Hiasan Samping Ucapan</h4>
                                            <div className="grid grid-cols-1 gap-4">
                                                {HEADER_ORNAMENTS.map((o) => (
                                                    <button
                                                        key={o.id}
                                                        onClick={() => setState(s => ({ ...s, ornamentId: o.id }))}
                                                        className={`flex items-center space-x-6 p-6 rounded-[2rem] border transition-all ${state.ornamentId === o.id ? 'bg-primary/5 border-primary ring-1 ring-primary/20' : 'bg-[#FAFAFA] border-slate-100 hover:border-slate-300'}`}
                                                    >
                                                        <div className="relative w-16 h-16 shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-2 flex items-center justify-center">
                                                            <Image src={o.path} alt={o.name} fill className="object-contain p-2" />
                                                        </div>
                                                        <div className="text-left">
                                                            <span className="block text-sm font-bold text-slate-800 uppercase tracking-tight">{o.name}</span>
                                                            <span className="block text-[10px] text-slate-400 uppercase font-medium mt-0.5">Sepasang (Kiri & Kanan)</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Guide Info */}
                        <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
                            <div className="flex gap-4">
                                <div className="mt-1 text-primary">
                                    <RotateCcw size={18} />
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed font-bold uppercase tracking-wider">
                                    "Paket 600Rb sudah termasuk bunga mahkota atas & kaki bawah standar premium. Warna busa bodi tengah disesuaikan dengan stok terbaik (Umumnya Putih/Kuning)."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PREVIEW MODAL */}
            <AnimatePresence>
                {isPreviewOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPreviewOpen(false)} className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="relative bg-white w-full max-w-5xl rounded-[3.5rem] overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row border-8 border-white">
                            <button onClick={() => setIsPreviewOpen(false)} className="absolute top-8 right-8 z-20 p-3 bg-white text-slate-400 rounded-full hover:text-rose-500 shadow-lg transition-all">
                                <X size={24} />
                            </button>

                            <div className="flex-1 bg-[#F9FAFB] p-12 md:p-20 flex items-center justify-center">
                                <div className="relative w-full aspect-[4/3] bg-white shadow-2xl rounded-sm p-4 overflow-hidden border-8 border-white">
                                    {previewImage && <img src={previewImage} alt="Preview Paket 600K" className="w-full h-full object-contain" />}
                                </div>
                            </div>

                            <div className="w-full md:w-[400px] p-12 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="inline-block bg-primary/10 px-4 py-1.5 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest">Konfirmasi Final</div>
                                    <h3 className="text-3xl font-serif font-bold text-slate-900 leading-tight">Detail Paket <span className="text-primary italic">600K</span></h3>
                                    <div className="space-y-4 py-6 border-y border-slate-100">
                                        <div className="flex justify-between text-xs font-bold uppercase">
                                            <span className="text-slate-400">ID Desain</span>
                                            <span className="text-slate-900">{state.id}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold uppercase">
                                            <span className="text-slate-400">Tipe Ucapan</span>
                                            <span className="text-slate-900">{state.headerType}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold uppercase">
                                            <span className="text-slate-400">Ukuran</span>
                                            <span className="text-slate-900">1,5 x 2 Meter</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-10">
                                    <button
                                        onClick={orderViaWA}
                                        className="w-full py-5 bg-primary text-white rounded-full font-bold flex items-center justify-center space-x-3 shadow-xl hover:shadow-primary/40 transition-all transform hover:scale-105"
                                    >
                                        <span>Pesan via WhatsApp</span>
                                        <MessageCircle size={24} />
                                    </button>
                                    <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
                                        Pembayaran aman via Transfer Bank / Invoice Perusahaan
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    )
}
