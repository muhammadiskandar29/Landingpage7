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
    Download,
    Settings2
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
    upperBannerColor: string;
    lowerBannerColor: string;
    umbulUmbulColor: string;
    ornamentType: 'none' | 'stars' | 'flowers' | 'classic';
}

const COLORS = [
    { id: 'purple', name: 'Ungu Mewah', value: '#A855F7' },
    { id: 'white', name: 'Putih Bersih', value: '#FFFFFF' },
    { id: 'green', name: 'Hijau Ria', value: '#2D5A27' },
    { id: 'red', name: 'Merah Maroon', value: '#991B1B' },
    { id: 'blue', name: 'Biru Berwibawa', value: '#1E40AF' },
    { id: 'yellow', name: 'Kuning Emas', value: '#EAB308' },
    { id: 'pink', name: 'Pink Pastel', value: '#F472B6' },
]

const ORNAMENTS = [
    { id: 'none', name: 'Tanpa Hiasan', path: '' },
    { id: 'stars', name: 'Bintang Putih', path: '/placeholders/star.png' },
    { id: 'flowers', name: 'Bunga Kecil', path: '/flowers/corner-flower-yellow.png' },
    { id: 'classic', name: 'Aksen Klasik', path: '/flowers/top-flower-rose.png' },
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
        messageText: "ATAS KELAHIRAN PUTRI KEDUA",
        senderText: "RIZKY BILLAR & LESTI KEJORA",
        upperBannerColor: "#A855F7", // Default Purple like image
        lowerBannerColor: "#FFFFFF", // Default White at bottom
        umbulUmbulColor: "#EAB308", // Yellow circles
        ornamentType: 'classic'
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

        // 70:30 Split
        const upperHeight = height * 0.7
        const lowerHeight = height * 0.3

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
            height: lowerHeight,
            fill: state.lowerBannerColor,
            selectable: false
        })
        canvas.add(lowerBanner)

        // 3. Middle Separator line (optional for clarity)
        const line = new fabric.Line([0, upperHeight, width, upperHeight], {
            stroke: '#E5E7EB',
            strokeWidth: 2,
            selectable: false
        })
        canvas.add(line)

        // 4. Umbul-Umbul (Circular Border)
        const circleRadius = 7
        const spacing = 22
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

        // 5. Header Text (SELAMAT / DUKA CITA)
        const headText = new fabric.Text(state.headerType, {
            left: width / 2,
            top: upperHeight * 0.25,
            fontSize: upperHeight * 0.25,
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

        // 6. Header Ornaments (Around Header Text)
        const activeOrn = ORNAMENTS.find(o => o.id === state.ornamentType)
        if (activeOrn && activeOrn.path) {
            fabric.Image.fromURL(activeOrn.path, (img: any) => {
                img.scaleToWidth(upperHeight * 0.15)

                // Positions relative to headText
                const centerY = upperHeight * 0.25

                // Left Ornament
                const leftOrn = fabric.util.object.clone(img)
                leftOrn.set({ left: width * 0.15, top: centerY, originX: 'center', originY: 'center', selectable: false })

                // Right Ornament
                const rightOrn = fabric.util.object.clone(img)
                rightOrn.set({ left: width * 0.85, top: centerY, originX: 'center', originY: 'center', flipX: true, selectable: false })

                canvas.add(leftOrn, rightOrn)
                canvas.bringToFront(leftOrn)
                canvas.bringToFront(rightOrn)
                canvas.renderAll()
            })
        }

        // 7. Message Text (In the Upper Banner region, below Header)
        const msgText = new fabric.Text(state.messageText.toUpperCase(), {
            left: width / 2,
            top: upperHeight * 0.55,
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

        // 8. Sender Text (In the Lower Banner region)
        const sdrText = new fabric.Text(state.senderText.toUpperCase(), {
            left: width / 2,
            top: upperHeight + (lowerHeight / 2),
            fontSize: lowerHeight * 0.25,
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
            `Halo Ria Florist, saya ingin pesan Paket 600rb (Pola 70:30) dengan desain kustom ID [${state.id}].\n\n` +
            `Ringkasan Desain:\n` +
            `- Tipe: ${state.headerType}\n` +
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
                        Kategori: Paket 600rb
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-slate-900 font-bold mb-4">
                        Custom Desain <span className="text-primary italic">Papan 600K</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl font-sans">
                        Fokus kustomisasi warna dasar papan (70:30), umbul-umbul, dan ornamen ucapan. Tanpa dekorasi bunga penuh untuk hasil yang modern dan clean.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Workspace - LEFT */}
                    <div className="flex-1 w-full flex flex-col space-y-8">
                        <div className="relative bg-[#F9FAFB] rounded-[3rem] p-4 sm:p-14 shadow-inner border border-slate-100 flex justify-center items-center overflow-hidden">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

                            <div className="relative shadow-2xl rounded-sm bg-white overflow-visible">
                                <canvas id="design-canvas" ref={canvasRef} />
                                {isInitializing && (
                                    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center space-y-4">
                                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm font-bold text-slate-400 font-sans tracking-widest uppercase">Memuat Studio...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-primary/5 p-10 rounded-[3.5rem] border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center space-x-6">
                                <div className="p-4 bg-primary rounded-2xl text-white shadow-lg">
                                    <Layout size={32} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Design ID: {state.id}</span>
                                    <h4 className="text-2xl font-bold font-serif text-slate-900">Siap untuk dipesan?</h4>
                                </div>
                            </div>
                            <button
                                onClick={generatePreview}
                                className="w-full md:w-auto px-12 py-5 bg-primary text-white rounded-full font-bold shadow-xl hover:shadow-primary/40 transition-all transform hover:scale-105 flex items-center justify-center space-x-3 text-lg"
                            >
                                <Download size={22} />
                                <span>Lihat Preview & Pesan</span>
                            </button>
                        </div>
                    </div>

                    {/* Controls - RIGHT */}
                    <div className="w-full lg:w-[480px] flex flex-col space-y-6">
                        <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
                            {/* Tab Navigation */}
                            <div className="flex bg-[#FAFAFA] p-3 border-b border-slate-100 gap-2">
                                {(['board', 'text', 'ornaments'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-4 flex flex-col items-center justify-center space-y-2 rounded-2xl transition-all relative ${activeTab === tab ? 'bg-white text-primary shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {tab === 'board' && <Palette size={18} />}
                                        {tab === 'text' && <Type size={18} />}
                                        {tab === 'ornaments' && <Settings2 size={18} />}
                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                            {tab === 'board' ? 'Warna Board' : tab === 'text' ? 'Ucapan' : 'Hiasan'}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-10 max-h-[700px] overflow-y-auto custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'board' && (
                                        <motion.div key="board" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                                            <div>
                                                <div className="flex justify-between items-center mb-6">
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Warna Papan Ucapan (70%)</h4>
                                                    <span className="text-xs font-bold text-primary">Atas</span>
                                                </div>
                                                <div className="grid grid-cols-7 gap-3">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => setState(s => ({ ...s, upperBannerColor: c.value }))}
                                                            className={`aspect-square rounded-full border-4 transition-all ${state.upperBannerColor === c.value ? 'border-primary ring-2 ring-primary/20 scale-110 shadow-lg' : 'border-white hover:scale-105'}`}
                                                            style={{ backgroundColor: c.value }} title={c.name}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t border-slate-50">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Warna Papan Pengirim (30%)</h4>
                                                    <span className="text-xs font-bold text-slate-400">Bawah</span>
                                                </div>
                                                <div className="grid grid-cols-7 gap-3">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => setState(s => ({ ...s, lowerBannerColor: c.value }))}
                                                            className={`aspect-square rounded-full border-4 transition-all ${state.lowerBannerColor === c.value ? 'border-primary ring-2 ring-primary/20 scale-110 shadow-lg' : 'border-white hover:scale-105'}`}
                                                            style={{ backgroundColor: c.value }} title={c.name}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t border-slate-50">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Warna Umbul-Umbul (Bulat Bingkai)</h4>
                                                <div className="grid grid-cols-7 gap-3">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => setState(s => ({ ...s, umbulUmbulColor: c.value }))}
                                                            className={`aspect-square rounded-full border-4 transition-all ${state.umbulUmbulColor === c.value ? 'border-primary ring-2 ring-primary/20 scale-110 shadow-lg' : 'border-white hover:scale-105'}`}
                                                            style={{ backgroundColor: c.value }} title={c.name}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'text' && (
                                        <motion.div key="text" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                                            <div className="space-y-8">
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-4 block">Pilih Kategori Ucapan</label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {(['SELAMAT', 'TURUT BERDUKA CITA'] as const).map(type => (
                                                            <button
                                                                key={type}
                                                                onClick={() => setState(s => ({ ...s, headerType: type }))}
                                                                className={`px-4 py-5 rounded-3xl text-[11px] font-bold uppercase tracking-widest border-2 transition-all ${state.headerType === type ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' : 'bg-slate-50 text-slate-400 border-transparent hover:text-slate-600'}`}
                                                            >
                                                                {type}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-4 block">Isi Pesan Ucapan</label>
                                                    <textarea
                                                        value={state.messageText}
                                                        onChange={(e) => setState(s => ({ ...s, messageText: e.target.value.toUpperCase() }))}
                                                        rows={3}
                                                        className="w-full bg-slate-50 border-2 border-transparent rounded-[2rem] px-8 py-6 font-bold text-slate-800 focus:bg-white focus:border-primary/20 outline-none transition-all resize-none shadow-inner"
                                                        placeholder="TULIS PESAN DI SINI..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-4 block">Nama Pengirim</label>
                                                    <input
                                                        type="text"
                                                        value={state.senderText}
                                                        onChange={(e) => setState(s => ({ ...s, senderText: e.target.value.toUpperCase() }))}
                                                        className="w-full bg-slate-50 border-2 border-transparent rounded-[2rem] px-8 py-6 font-bold text-slate-800 focus:bg-white focus:border-primary/20 outline-none transition-all shadow-inner"
                                                        placeholder="NAMA PENGIRIM..."
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'ornaments' && (
                                        <motion.div key="ornaments" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hiasan Sekitar Tulisan Utama</h4>
                                            <div className="grid grid-cols-1 gap-4">
                                                {ORNAMENTS.map((o) => (
                                                    <button
                                                        key={o.id}
                                                        onClick={() => setState(s => ({ ...s, ornamentType: o.id as any }))}
                                                        className={`flex items-center space-x-6 p-6 rounded-[2.5rem] border-2 transition-all ${state.ornamentType === o.id ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                                                    >
                                                        <div className="relative w-16 h-16 shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex items-center justify-center p-2">
                                                            {o.path ? <Image src={o.path} alt={o.name} fill className="object-contain p-2" /> : <X className="text-slate-300" />}
                                                        </div>
                                                        <div className="text-left">
                                                            <span className="block text-sm font-bold text-slate-800 uppercase tracking-tight">{o.name}</span>
                                                            <span className="block text-[10px] text-slate-400 uppercase font-medium mt-1">Simetris Kiri & Kanan</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Price Info */}
                        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">Estimasi Paket</span>
                                <div className="px-4 py-1.5 bg-primary rounded-full text-[10px] font-bold uppercase">Best Seller</div>
                            </div>
                            <div className="flex items-baseline space-x-2">
                                <span className="text-4xl font-serif font-bold">IDR 600.000</span>
                                <span className="text-white/40 text-sm font-sans">/ Papan</span>
                            </div>
                            <div className="mt-8 space-y-4 pt-6 border-t border-white/10">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle size={16} className="text-primary" />
                                    <span className="text-xs font-medium text-white/70">Ukuran Standar 1,5 x 2 Meter</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle size={16} className="text-primary" />
                                    <span className="text-xs font-medium text-white/70">Gratis Ongkir Seluruh Jakarta</span>
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
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPreviewOpen(false)} className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.98, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 40 }} className="relative bg-white w-full max-w-6xl rounded-[4rem] overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row border-[12px] border-white">
                            <button onClick={() => setIsPreviewOpen(false)} className="absolute top-8 right-8 z-20 p-4 bg-slate-100 text-slate-500 rounded-full hover:bg-rose-50 hover:text-rose-500 shadow-xl transition-all">
                                <X size={24} />
                            </button>

                            <div className="flex-1 bg-[#F1F5F9] p-12 md:p-24 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                <div className="relative w-full aspect-[4/3] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] rounded-sm p-4 overflow-hidden border-[10px] border-white">
                                    {previewImage && <img src={previewImage} alt="Preview Paket 600K" className="w-full h-full object-contain" />}
                                </div>
                            </div>

                            <div className="w-full md:w-[450px] p-16 flex flex-col justify-between bg-white">
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <div className="inline-block bg-primary/10 px-6 py-2 rounded-full text-[11px] font-bold text-primary uppercase tracking-[0.2em]">Pesanan Paket 600K</div>
                                        <h3 className="text-4xl font-serif font-bold text-slate-900 leading-tight">Konfirmasi <span className="text-primary italic">Desain</span></h3>
                                    </div>

                                    <div className="space-y-6 pt-10 border-t border-slate-100">
                                        <div className="flex flex-col space-y-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID Pesanan</span>
                                            <span className="text-lg font-bold text-slate-900 font-mono tracking-tighter">{state.id}</span>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jenis Ucapan</span>
                                            <span className="text-lg font-bold text-slate-800">{state.headerType}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 pt-12">
                                    <button
                                        onClick={orderViaWA}
                                        className="w-full py-6 bg-primary text-white rounded-full font-bold flex items-center justify-center space-x-4 shadow-2xl hover:shadow-primary/50 transition-all transform hover:scale-[1.03] text-lg"
                                    >
                                        <span>Order via WhatsApp</span>
                                        <MessageCircle size={26} />
                                    </button>
                                    <div className="flex flex-col items-center space-y-2">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Estimasi Selesai: 4-6 Jam</p>
                                        <div className="flex items-center space-x-1">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-[9px] text-green-600 font-bold uppercase">Tim Produksi Aktif</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    )
}
