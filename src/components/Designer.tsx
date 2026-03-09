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
    Paintbrush,
    Sparkles,
    MousePointer2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// SSR Safety for Fabric
let fabric: any;

interface DesignState {
    id: string;
    headerText: string;
    messageText: string;
    senderText: string;
    upperBannerColor: string;
    lowerBannerColor: string;
    umbulColor1: string;
    umbulColor2: string;
    headerTextColor: string;
    headerOrnamentColor: string;
    headerBubbleColor: string;
}

const COLORS = [
    { id: 'white', name: 'Putih', value: '#FFFFFF' },
    { id: 'purple', name: 'Ungu', value: '#A855F7' },
    { id: 'light-purple', name: 'Ungu Muda', value: '#D8B4FE' },
    { id: 'green', name: 'Hijau', value: '#2D5A27' },
    { id: 'red', name: 'Merah', value: '#991B1B' },
    { id: 'blue', name: 'Biru', value: '#1E40AF' },
    { id: 'yellow', name: 'Kuning', value: '#EAB308' },
    { id: 'pink', name: 'Pink', value: '#F472B6' },
    { id: 'orange', name: 'Oranye', value: '#F97316' },
    { id: 'black', name: 'Hitam', value: '#1A1A1A' },
]

export default function Designer() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fabricCanvas = useRef<any>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const [activeTab, setActiveTab] = useState<'board' | 'umbul' | 'text' | 'decor'>('board')
    const [isInitializing, setIsInitializing] = useState(true)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')

    const [state, setState] = useState<DesignState>({
        id: Math.random().toString(36).substring(7).toUpperCase(),
        headerText: "Selamat",
        messageText: "ATAS KELAHIRAN PUTRI KEDUA",
        senderText: "RIZKY BILLAR & LESTI KEJORA",
        upperBannerColor: "#A855F7",
        lowerBannerColor: "#FFFFFF",
        umbulColor1: "#EAB308",
        umbulColor2: "#FFFFFF",
        headerTextColor: "#FFFFFF",
        headerOrnamentColor: "#EAB308",
        headerBubbleColor: "#D8B4FE",
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
            backgroundColor: '#F8FAFC',
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
        drawCircles(0, width, upperHeight, 0, true) // Mid separator

        // 4. Header Section
        const centerY = upperHeight * 0.3
        const bubbleWidth = width * 0.55
        const bubbleHeight = upperHeight * 0.3

        // Header Bubble
        const headerBubble = new fabric.Ellipse({
            left: width / 2,
            top: centerY,
            rx: bubbleWidth / 2,
            ry: bubbleHeight / 2,
            fill: state.headerBubbleColor,
            originX: 'center',
            originY: 'center',
            selectable: false
        })
        canvas.add(headerBubble)

        // Umbul around header bubble
        const numCircles = 28
        for (let i = 0; i < numCircles; i++) {
            const angle = (i / numCircles) * Math.PI * 2
            const x = width / 2 + (bubbleWidth / 2 + 5) * Math.cos(angle)
            const y = centerY + (bubbleHeight / 2 + 5) * Math.sin(angle)
            canvas.add(new fabric.Circle({
                left: x,
                top: y,
                radius: 5,
                fill: state.headerOrnamentColor,
                originX: 'center',
                originY: 'center',
                selectable: false
            }))
        }

        // Header Text
        const headText = new fabric.Text(state.headerText, {
            left: width / 2,
            top: centerY - 4,
            fontSize: upperHeight * 0.2,
            fontFamily: 'serif',
            fontWeight: 'bold',
            fontStyle: 'italic',
            fill: state.headerTextColor,
            stroke: '#000000',
            strokeWidth: 1,
            originX: 'center',
            originY: 'middle',
            selectable: false
        })
        canvas.add(headText)

        // 5. Message Text
        const msgText = new fabric.Text(state.messageText.toUpperCase(), {
            left: width / 2,
            top: upperHeight * 0.65,
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

        // 6. Sender Text (Lower 30%)
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
            `Halo Ria Florist, saya ingin pesan Papan Bunga Kustom (Model Selamat) dengan ID [${state.id}].\n\n` +
            `Detail:\n` +
            `- Pesan Utama: ${state.messageText}\n` +
            `- Pengirim: ${state.senderText}`
        )
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
    }

    return (
        <section id="designer" className="py-24 bg-white" ref={containerRef}>
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col items-center mb-16 text-center">
                    <div className="mb-4 inline-block bg-primary/10 px-6 py-2 rounded-full text-primary font-bold text-sm uppercase tracking-widest">
                        Template Kustomisasi Papan Ria
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-slate-900 font-bold mb-4 leading-tight">
                        Mulai <span className="text-primary italic">Desain Kustom</span> Anda
                    </h2>
                    <p className="text-slate-500 max-w-2xl font-sans font-medium">
                        Gunakan template "Selamat" standar kami. Anda bebas mengubah warna setiap bagian, memodifikasi isi tulisan, dan menyesuaikan ornamen binngkai.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Workspace */}
                    <div className="flex-1 flex flex-col space-y-8">
                        <div className="relative bg-slate-50 rounded-[4rem] p-4 md:p-14 shadow-inner border border-slate-100 flex justify-center items-center overflow-hidden">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

                            <div className="relative shadow-2xl bg-white overflow-visible ring-1 ring-black/5">
                                <canvas id="design-canvas" ref={canvasRef} />
                                {isInitializing && (
                                    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center space-y-4">
                                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memulai Studio...</span>
                                    </div>
                                )}
                                {/* Interaction Indicator */}
                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-slate-100 hidden md:flex items-center space-x-2">
                                    <MousePointer2 size={12} className="text-primary" />
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Klik teks untuk edit posisi</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary/5 p-12 rounded-[4rem] border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center space-x-6 text-left">
                                <div className="p-4 bg-primary rounded-3xl text-white shadow-xl">
                                    <Layout size={24} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Design Record ID</span>
                                    <h4 className="text-2xl font-bold font-serif text-slate-900 mt-1 uppercase tracking-tight">#{state.id}</h4>
                                </div>
                            </div>
                            <button
                                onClick={generatePreview}
                                className="w-full md:w-auto px-12 py-5 bg-primary text-white rounded-full font-bold shadow-2xl hover:shadow-primary/40 transition-all transform hover:scale-105 flex items-center justify-center space-x-3 text-lg"
                            >
                                <Download size={22} />
                                <span>Selesaikan & Pesan</span>
                            </button>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="w-full lg:w-[500px] flex flex-col space-y-6">
                        <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden ring-1 ring-black/5">
                            <div className="flex bg-[#FAFAFA] p-4 border-b border-slate-100 gap-2">
                                {(['board', 'umbul', 'text', 'decor'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-4 flex flex-col items-center justify-center space-y-2 rounded-3xl transition-all relative ${activeTab === tab ? 'bg-white text-primary shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {tab === 'board' && <Palette size={18} />}
                                        {tab === 'umbul' && <Paintbrush size={18} />}
                                        {tab === 'text' && <Type size={18} />}
                                        {tab === 'decor' && <Sparkles size={18} />}
                                        <span className="text-[9px] font-bold uppercase tracking-widest leading-none">
                                            {tab === 'board' ? 'Warna Papan' : tab === 'umbul' ? 'Umbul 2' : tab === 'text' ? 'Isi Teks' : 'Ornamen'}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="p-10 max-h-[650px] overflow-y-auto custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'board' && (
                                        <motion.div key="board" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                                            <div>
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Warna Bagian Atas (70%)
                                                </h4>
                                                <div className="grid grid-cols-5 gap-4">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => setState(s => ({ ...s, upperBannerColor: c.value }))}
                                                            className={`aspect-square rounded-full border-4 transition-all ${state.upperBannerColor === c.value ? 'border-primary ring-4 ring-primary/10 scale-110 shadow-2xl' : 'border-white hover:border-slate-100 shadow-sm'}`}
                                                            style={{ backgroundColor: c.value }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div> Warna Bagian Bawah (30%)
                                                </h4>
                                                <div className="grid grid-cols-5 gap-4">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => setState(s => ({ ...s, lowerBannerColor: c.value }))}
                                                            className={`aspect-square rounded-full border-4 transition-all ${state.lowerBannerColor === c.value ? 'border-primary ring-4 ring-primary/10 scale-110 shadow-2xl' : 'border-white hover:border-slate-100 shadow-sm'}`}
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
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Warna Bingkai 1</h4>
                                                <div className="grid grid-cols-5 gap-4">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => setState(s => ({ ...s, umbulColor1: c.value }))}
                                                            className={`aspect-square rounded-full border-4 transition-all ${state.umbulColor1 === c.value ? 'border-primary ring-4 ring-primary/10 scale-110 shadow-2xl' : 'border-white hover:border-slate-100 shadow-sm'}`}
                                                            style={{ backgroundColor: c.value }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Warna Bingkai 2 (Selang-Seling)</h4>
                                                <div className="grid grid-cols-5 gap-4">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => setState(s => ({ ...s, umbulColor2: c.value }))}
                                                            className={`aspect-square rounded-full border-4 transition-all ${state.umbulColor2 === c.value ? 'border-primary ring-4 ring-primary/10 scale-110 shadow-2xl' : 'border-white hover:border-slate-100 shadow-sm'}`}
                                                            style={{ backgroundColor: c.value }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'text' && (
                                        <motion.div key="text" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-left">
                                            <div className="space-y-8">
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Ganti Warna Tulisan Ucapan</label>
                                                    <div className="grid grid-cols-5 gap-3">
                                                        {COLORS.map((c) => (
                                                            <button
                                                                key={c.id}
                                                                onClick={() => setState(s => ({ ...s, headerTextColor: c.value }))}
                                                                className={`aspect-square rounded-xl border-2 transition-all ${state.headerTextColor === c.value ? 'border-primary ring-2 ring-primary/10 scale-105 shadow-md' : 'border-slate-100 shadow-inner'}`}
                                                                style={{ backgroundColor: c.value }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Isi Pesan (Uppercase Otomatis)</label>
                                                    <textarea
                                                        value={state.messageText}
                                                        onChange={(e) => setState(s => ({ ...s, messageText: e.target.value.toUpperCase() }))}
                                                        rows={3}
                                                        className="w-full bg-slate-50 border-2 border-transparent rounded-[2.5rem] px-8 py-6 font-bold text-slate-800 focus:bg-white focus:border-primary/20 outline-none transition-all resize-none shadow-inner"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Nama Pengirim</label>
                                                    <input
                                                        type="text"
                                                        value={state.senderText}
                                                        onChange={(e) => setState(s => ({ ...s, senderText: e.target.value.toUpperCase() }))}
                                                        className="w-full bg-slate-50 border-2 border-transparent rounded-[2.5rem] px-8 py-6 font-bold text-slate-800 focus:bg-white focus:border-primary/20 outline-none transition-all shadow-inner"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'decor' && (
                                        <motion.div key="decor" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                                            <div>
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Warna Ornamen Di Sekitar Teks</h4>
                                                <div className="grid grid-cols-5 gap-4">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => setState(s => ({ ...s, headerOrnamentColor: c.value }))}
                                                            className={`aspect-square rounded-full border-4 transition-all ${state.headerOrnamentColor === c.value ? 'border-primary ring-4 ring-primary/10 scale-110 shadow-2xl' : 'border-white hover:border-slate-100 shadow-sm'}`}
                                                            style={{ backgroundColor: c.value }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Warna Latar Belakang Teks (Bubble)</h4>
                                                <div className="grid grid-cols-5 gap-4">
                                                    {COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => setState(s => ({ ...s, headerBubbleColor: c.value }))}
                                                            className={`aspect-square rounded-full border-4 transition-all ${state.headerBubbleColor === c.value ? 'border-primary ring-4 ring-primary/10 scale-110 shadow-2xl' : 'border-white hover:border-slate-100 shadow-sm'}`}
                                                            style={{ backgroundColor: c.value }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* General Template Badge */}
                        <div className="bg-[#2D5A27] p-12 rounded-[5rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Ukuran Standar</span>
                                    <div className="px-5 py-2 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">1,5 x 2 Meter</div>
                                </div>
                                <h3 className="text-4xl font-serif font-bold tracking-tighter mb-4 italic">Model "Selamat"</h3>
                                <div className="flex items-center space-x-3 text-white/60">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                                    <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Universal Customization Template</span>
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
                                    {previewImage && <img src={previewImage} alt="Final Design Preview" className="w-full h-full object-contain" />}
                                </div>
                            </div>

                            <div className="w-full md:w-[480px] p-20 flex flex-col justify-between bg-white text-left">
                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <div className="inline-block bg-primary/10 px-6 py-2 rounded-full text-[11px] font-bold text-primary uppercase tracking-[0.2em]">Karya Ria Florist</div>
                                        <h3 className="text-6xl font-serif font-bold text-slate-900 leading-tight tracking-tighter italic">Detail <span className="text-primary">Desain</span></h3>
                                    </div>

                                    <div className="space-y-6 pt-12 border-t border-slate-100">
                                        <div className="flex flex-col space-y-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID PESANAN</span>
                                            <span className="text-2xl font-bold text-slate-900 font-mono tracking-tighter">#{state.id}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 pt-12">
                                    <button
                                        onClick={orderViaWA}
                                        className="w-full py-7 bg-primary text-white rounded-full font-bold flex items-center justify-center space-x-4 shadow-[0_20px_50px_-10px_rgba(45,90,39,0.4)] transition-all transform hover:scale-[1.03] text-2xl"
                                    >
                                        <span>Pesan via WhatsApp</span>
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
