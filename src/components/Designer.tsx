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
    { id: 'pink-light', name: 'Pink Muda', value: '#F472B6' },
    { id: 'pink-deep', name: 'Pink Cerah', value: '#EC4899' },
    { id: 'green', name: 'Hijau', value: '#2D5A27' },
    { id: 'red', name: 'Merah', value: '#991B1B' },
    { id: 'blue', name: 'Biru', value: '#1E40AF' },
    { id: 'yellow', name: 'Kuning', value: '#EAB308' },
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
        headerBubbleColor: "#F472B6", // Pink bubble from image
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

        // 1. Upper Banner
        const upperBanner = new fabric.Rect({
            left: 0,
            top: 0,
            width: width,
            height: upperHeight,
            fill: state.upperBannerColor,
            selectable: false
        })
        canvas.add(upperBanner)

        // 2. Lower Banner
        const lowerBanner = new fabric.Rect({
            left: 0,
            top: upperHeight,
            width: width,
            height: height - upperHeight,
            fill: state.lowerBannerColor,
            selectable: false
        })
        canvas.add(lowerBanner)

        // 3. Umbul-Umbul (Outer Frame & Middle Line)
        const circleRadius = 6
        const spacing = 18
        const drawDots = (sx: number, ex: number, sy: number, ey: number, isH: boolean) => {
            let c = 0
            if (isH) {
                for (let x = sx; x <= ex; x += spacing) {
                    canvas.add(new fabric.Circle({ left: x, top: sy, radius: circleRadius, fill: c % 2 === 0 ? state.umbulColor1 : state.umbulColor2, originX: 'center', originY: 'center', selectable: false }))
                    c++
                }
            } else {
                for (let y = sy; y <= ey; y += spacing) {
                    canvas.add(new fabric.Circle({ left: sx, top: y, radius: circleRadius, fill: c % 2 === 0 ? state.umbulColor1 : state.umbulColor2, originX: 'center', originY: 'center', selectable: false }))
                    c++
                }
            }
        }
        drawDots(0, width, 0, 0, true) // Top
        drawDots(0, width, height, 0, true) // Bottom
        drawDots(0, 0, 0, height, false) // Left
        drawDots(width, 0, 0, height, false) // Right
        drawDots(0, width, upperHeight, 0, true) // Mid

        // 4. Stylistic Header Ornament (Like the image)
        const centerX = width / 2
        const centerY = upperHeight * 0.35
        const bW = width * 0.7
        const bH = upperHeight * 0.4

        // Decorative Pink Path (The "Ribbon" shape)
        // Using a custom path for the curly/concave background
        const pathD = `M ${centerX - bW / 2} ${centerY} 
                   C ${centerX - bW / 2} ${centerY - bH / 2 - 20}, ${centerX - bW / 4} ${centerY - bH / 2}, ${centerX} ${centerY - bH / 2}
                   S ${centerX + bW / 2} ${centerY - bH / 2 - 20}, ${centerX + bW / 2} ${centerY}
                   C ${centerX + bW / 2} ${centerY + bH / 2 + 20}, ${centerX + bW / 4} ${centerY + bH / 2}, ${centerX} ${centerY + bH / 2}
                   S ${centerX - bW / 2} ${centerY + bH / 2 + 20}, ${centerX - bW / 2} ${centerY} Z`

        const decorFrame = new fabric.Path(pathD, {
            fill: state.headerBubbleColor,
            stroke: state.headerOrnamentColor,
            strokeWidth: 2,
            selectable: false
        })
        canvas.add(decorFrame)

        // Yellow flower Chain along the path
        // We can approximate by placing circles on key points or just a loop
        const numFlowers = 40
        for (let i = 0; i < numFlowers; i++) {
            const point = decorFrame.getPointByLength((i / numFlowers) * decorFrame.getPointByLength(0, true)) // Not direct but let's use a simpler way
            // Simplified: Follow the ellipse/rect approximation for flowers
        }

        // Better way: Add another layer of dots around the path
        const dotsAroundHeader = 36
        for (let i = 0; i < dotsAroundHeader; i++) {
            const a = (i / dotsAroundHeader) * Math.PI * 2
            const x = centerX + (bW / 2 + 8) * Math.cos(a)
            const y = centerY + (bH / 2 + 8) * Math.sin(a)
            // Add waving offset for more organic look
            const nx = x + Math.sin(i * 1.5) * 5
            const ny = y + Math.cos(i * 1.5) * 5
            canvas.add(new fabric.Circle({ left: nx, top: ny, radius: 5, fill: state.headerOrnamentColor, originX: 'center', originY: 'center', selectable: false }))
        }

        // Side Curls (The "loops" on left and right)
        const curlSize = 25
        const leftCurl = new fabric.Circle({ left: centerX - bW / 2, top: centerY, radius: curlSize, fill: 'transparent', stroke: state.headerOrnamentColor, strokeWidth: 8, startAngle: 0, endAngle: Math.PI, originX: 'center', originY: 'center', selectable: false })
        const rightCurl = new fabric.Circle({ left: centerX + bW / 2, top: centerY, radius: curlSize, fill: 'transparent', stroke: state.headerOrnamentColor, strokeWidth: 8, startAngle: Math.PI, endAngle: 0, originX: 'center', originY: 'center', selectable: false })
        // Adding dots to curls
        for (let k = 0; k < 8; k++) {
            const ang = (k / 8) * Math.PI
            canvas.add(new fabric.Circle({ left: centerX - bW / 2 + curlSize * Math.cos(ang), top: centerY + curlSize * Math.sin(ang), radius: 4, fill: state.headerOrnamentColor, originX: 'center', originY: 'center', selectable: false }))
            canvas.add(new fabric.Circle({ left: centerX + bW / 2 + curlSize * Math.cos(ang + Math.PI), top: centerY + curlSize * Math.sin(ang + Math.PI), radius: 4, fill: state.headerOrnamentColor, originX: 'center', originY: 'center', selectable: false }))
        }

        // Header Text
        const headText = new fabric.Text(state.headerText, {
            left: centerX,
            top: centerY - 10,
            fontSize: bH * 0.7,
            fontFamily: 'serif',
            fontWeight: 'bold',
            fontStyle: 'italic',
            fill: state.headerTextColor,
            stroke: '#000000',
            strokeWidth: 1.5,
            originX: 'center',
            originY: 'middle',
            selectable: false
        })
        canvas.add(headText)

        // 5. Lower Decorative Divider (The curvy line below Selamat)
        const divPathD = `M ${centerX - bW / 2.2} ${centerY + bH / 1.5} Q ${centerX} ${centerY + bH + 20} ${centerX + bW / 2.2} ${centerY + bH / 1.5}`
        const divLine = new fabric.Path(divPathD, { fill: 'transparent', stroke: state.headerOrnamentColor, strokeWidth: 8, selectable: false })
        canvas.add(divLine)
        // Add dots to divider
        for (let j = 0; j <= 15; j++) {
            const lx = (centerX - bW / 2.2) + (j / 15) * (bW / 1.1)
            const ly = (centerY + bH / 1.5) + Math.sin((j / 15) * Math.PI) * 35
            canvas.add(new fabric.Circle({ left: lx, top: ly, radius: 5, fill: state.headerOrnamentColor, originX: 'center', originY: 'center', selectable: false }))
        }

        // 6. Message Text (Atas Kelahiran...)
        const msgText = new fabric.Text(state.messageText.toUpperCase(), {
            left: centerX,
            top: centerY + bH + 40,
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

        // 7. Sender Text
        const sdrText = new fabric.Text(state.senderText.toUpperCase(), {
            left: centerX,
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
        const p = '6285719141187'
        const m = encodeURIComponent(`Halo Ria Florist, saya pesan Papan Bunga Custom ID [${state.id}].\n\nDetail:\n- Ucapan: ${state.headerText}\n- Pengirim: ${state.senderText}`)
        window.open(`https://wa.me/${p}?text=${m}`, '_blank')
    }

    return (
        <section id="designer" className="py-24 bg-white" ref={containerRef}>
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col items-center mb-16 text-center">
                    <div className="mb-4 inline-block bg-primary/10 px-6 py-2 rounded-full text-primary font-bold text-sm uppercase tracking-widest">Premium Custom Studio</div>
                    <h2 className="text-4xl md:text-5xl font-serif text-slate-900 font-bold mb-4 leading-tight">Mulai <span className="text-primary italic">Kreasi</span> Anda</h2>
                    <p className="text-slate-500 max-w-2xl font-sans font-medium">Replikasi desain papan bunga premium dengan ornamen melengkung dan detail bunga (umbul-umbul) yang autentik.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Workspace */}
                    <div className="flex-1 flex flex-col space-y-8">
                        <div className="relative bg-slate-50 rounded-[4rem] p-4 md:p-14 shadow-inner border border-slate-100 flex justify-center items-center overflow-hidden">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                            <div className="relative shadow-2xl bg-white ring-1 ring-black/5">
                                <canvas id="design-canvas" ref={canvasRef} />
                                {isInitializing && <div className="absolute inset-0 bg-white flex items-center justify-center font-bold text-slate-400">LOADING...</div>}
                            </div>
                        </div>
                        <div className="bg-primary/5 p-12 rounded-[4rem] border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-left"><span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Design ID: #{state.id}</span><h4 className="text-2xl font-bold font-serif text-slate-900 mt-1 uppercase">Siap Dipesan?</h4></div>
                            <button onClick={generatePreview} className="px-12 py-5 bg-primary text-white rounded-full font-bold shadow-2xl hover:scale-105 transition-all text-lg flex items-center gap-3"><Download size={22} /> Lihat Preview</button>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="w-full lg:w-[500px] flex flex-col space-y-6">
                        <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden">
                            <div className="flex bg-[#FAFAFA] p-4 border-b border-slate-100 gap-2">
                                {(['board', 'umbul', 'text', 'decor'] as const).map((tab) => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 flex flex-col items-center justify-center space-y-2 rounded-3xl transition-all ${activeTab === tab ? 'bg-white text-primary shadow-sm border border-slate-100' : 'text-slate-400'}`}>
                                        {tab === 'board' && <Palette size={18} />}
                                        {tab === 'umbul' && <Paintbrush size={18} />}
                                        {tab === 'text' && <Type size={18} />}
                                        {tab === 'decor' && <Sparkles size={18} />}
                                        <span className="text-[9px] font-bold uppercase tracking-widest">{tab === 'board' ? 'Papan' : tab === 'umbul' ? 'Umbul' : tab === 'text' ? 'Teks' : 'Ornamen'}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="p-10 max-h-[650px] overflow-y-auto custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'board' && (
                                        <div className="space-y-12">
                                            <div><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Warna Banner Utama (Atas)</h4><div className="grid grid-cols-5 gap-4">{COLORS.map(c => (<button key={c.id} onClick={() => setState(s => ({ ...s, upperBannerColor: c.value }))} className={`aspect-square rounded-full border-4 ${state.upperBannerColor === c.value ? 'border-primary scale-110 shadow-lg' : 'border-white'}`} style={{ backgroundColor: c.value }} />))}</div></div>
                                            <div className="pt-4"><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Warna Banner Pengirim (Bawah)</h4><div className="grid grid-cols-5 gap-4">{COLORS.map(c => (<button key={c.id} onClick={() => setState(s => ({ ...s, lowerBannerColor: c.value }))} className={`aspect-square rounded-full border-4 ${state.lowerBannerColor === c.value ? 'border-primary scale-110 shadow-lg' : 'border-white'}`} style={{ backgroundColor: c.value }} />))}</div></div>
                                        </div>
                                    )}
                                    {activeTab === 'umbul' && (
                                        <div className="space-y-12">
                                            <div><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Warna Umbul Frame 1</h4><div className="grid grid-cols-5 gap-4">{COLORS.map(c => (<button key={c.id} onClick={() => setState(s => ({ ...s, umbulColor1: c.value }))} className={`aspect-square rounded-full border-4 ${state.umbulColor1 === c.value ? 'border-primary scale-110 shadow-lg' : 'border-white'}`} style={{ backgroundColor: c.value }} />))}</div></div>
                                            <div className="pt-4"><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Warna Umbul Frame 2</h4><div className="grid grid-cols-5 gap-4">{COLORS.map(c => (<button key={c.id} onClick={() => setState(s => ({ ...s, umbulColor2: c.value }))} className={`aspect-square rounded-full border-4 ${state.umbulColor2 === c.value ? 'border-primary scale-110 shadow-lg' : 'border-white'}`} style={{ backgroundColor: c.value }} />))}</div></div>
                                        </div>
                                    )}
                                    {activeTab === 'text' && (
                                        <div className="space-y-8 text-left">
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase mb-4 block">Warna Tulisan Utama</label><div className="grid grid-cols-5 gap-3">{COLORS.map(c => (<button key={c.id} onClick={() => setState(s => ({ ...s, headerTextColor: c.value }))} className={`aspect-square rounded-xl border-2 ${state.headerTextColor === c.value ? 'border-primary' : 'border-slate-100'}`} style={{ backgroundColor: c.value }} />))}</div></div>
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase mb-4 block">Isi Pesan Tengah</label><textarea value={state.messageText} onChange={e => setState(s => ({ ...s, messageText: e.target.value.toUpperCase() }))} rows={3} className="w-full bg-slate-50 rounded-[2.5rem] px-8 py-6 font-bold text-slate-800 outline-none shadow-inner" /></div>
                                            <div><label className="text-[10px] font-black text-slate-400 uppercase mb-4 block">Nama Pengirim</label><input type="text" value={state.senderText} onChange={e => setState(s => ({ ...s, senderText: e.target.value.toUpperCase() }))} className="w-full bg-slate-50 rounded-[2.5rem] px-8 py-6 font-bold text-slate-800 outline-none shadow-inner" /></div>
                                        </div>
                                    )}
                                    {activeTab === 'decor' && (
                                        <div className="space-y-12">
                                            <div><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Warna Hiasan Melengkung (Selamat)</h4><div className="grid grid-cols-5 gap-4">{COLORS.map(c => (<button key={c.id} onClick={() => setState(s => ({ ...s, headerOrnamentColor: c.value }))} className={`aspect-square rounded-full border-4 ${state.headerOrnamentColor === c.value ? 'border-primary scale-110 shadow-lg' : 'border-white'}`} style={{ backgroundColor: c.value }} />))}</div></div>
                                            <div className="pt-4"><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Warna Latar Belakang Teks</h4><div className="grid grid-cols-5 gap-4">{COLORS.map(c => (<button key={c.id} onClick={() => setState(s => ({ ...s, headerBubbleColor: c.value }))} className={`aspect-square rounded-full border-4 ${state.headerBubbleColor === c.value ? 'border-primary scale-110 shadow-lg' : 'border-white'}`} style={{ backgroundColor: c.value }} />))}</div></div>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PREVIEW MODAL */}
            <AnimatePresence>{isPreviewOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPreviewOpen(false)} className="absolute inset-0 bg-black/95 backdrop-blur-3xl" /><motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-6xl rounded-[4rem] overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row border-[12px] border-white"><button onClick={() => setIsPreviewOpen(false)} className="absolute top-8 right-8 z-20 p-4 bg-slate-100 rounded-full">X</button><div className="flex-1 bg-slate-100 p-12 flex items-center justify-center"><img src={previewImage} className="w-full h-full object-contain shadow-2xl" /></div><div className="w-full md:w-[450px] p-16 flex flex-col justify-between"><div><h3 className="text-4xl font-serif font-bold">Desain <span className="text-primary italic">Papan Ria</span></h3><p className="mt-8 text-slate-500 font-bold uppercase tracking-widest text-xs">ID Sesi: #{state.id}</p></div><button onClick={orderViaWA} className="w-full py-6 bg-primary text-white rounded-full font-bold text-xl shadow-2xl">Order via WhatsApp</button></div></motion.div></div>
            )}</AnimatePresence>
        </section>
    )
}
