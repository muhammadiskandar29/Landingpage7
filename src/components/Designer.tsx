'use client'

import { useEffect, useRef, useState } from 'react'
// fabric will be loaded dynamically
let fabric: any;
import {
    Palette,
    Type,
    Flower2,
    Upload,
    Download,
    MessageCircle,
    RotateCcw,
    Trash2,
    ChevronRight,
    Plus
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// Types
interface DesignerProps { }

type TabType = 'board' | 'text' | 'ornaments' | 'logo'

const BOARDS = [
    { id: 'purple', name: 'Royal Purple', path: '/boards/purple-blank.png', color: '#6B21A8' },
    { id: 'red', name: 'Claret Red', path: '/boards/red-blank.png', color: '#991B1B' },
    { id: 'blue', name: 'Emerald Blue', path: '/boards/blue-blank.png', color: '#1E40AF' },
]

const FLOWERS = [
    { id: 'mahkota', name: 'Mahkota Rose', path: '/flowers/top-flower-rose.png', type: 'top' },
    { id: 'sudut', name: 'Corner Yellow', path: '/flowers/corner-flower-yellow.png', type: 'corner' },
    { id: 'kaki', name: 'Row Flowers', path: '/flowers/bottom-stand-flowers.png', type: 'bottom' },
]

const FONTS = [
    { name: 'Serif', value: 'Playfair Display' },
    { name: 'Sans', value: 'Inter' },
    { name: 'Cursive', value: 'cursive' }
]

export default function Designer() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fabricCanvas = useRef<any>(null)
    const [activeTab, setActiveTab] = useState<TabType>('board')
    const [selectedBoard, setSelectedBoard] = useState(BOARDS[0])
    const [isLoading, setIsLoading] = useState(true)

    // Canvas State & Init
    useEffect(() => {
        if (!canvasRef.current) return

        // Dynamic import for client-side only
        fabric = require('fabric').fabric;

        fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
            width: 600,
            height: 450,
            backgroundColor: '#f3f4f6',
            preserveObjectStacking: true,
        })

        // Load initial board
        updateBoard(BOARDS[0].path)

        setIsLoading(false)

        return () => {
            fabricCanvas.current?.dispose()
        }
    }, [])

    const updateBoard = (imagePath: string) => {
        if (!fabricCanvas.current) return

        // Clear existing background images
        fabricCanvas.current.setBackgroundImage('', fabricCanvas.current.renderAll.bind(fabricCanvas.current))

        fabric.Image.fromURL(imagePath, (img: any) => {
            const canvas = fabricCanvas.current!
            img.scaleToWidth(canvas.width!)
            img.scaleToHeight(canvas.height!)
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                originX: 'left',
                originY: 'top',
                crossOrigin: 'anonymous'
            })
        })
    }

    const addText = (defaultContent: string = 'TEKS ANDA') => {
        if (!fabricCanvas.current) return

        const text = new fabric.IText(defaultContent, {
            left: 150,
            top: 150,
            fontFamily: 'Playfair Display',
            fontSize: 40,
            fill: '#FFFFFF',
            fontWeight: 'bold',
            textAlign: 'center',
        })

        fabricCanvas.current.add(text)
        fabricCanvas.current.setActiveObject(text)
    }

    const addOrnament = (imagePath: string) => {
        if (!fabricCanvas.current) return

        fabric.Image.fromURL(imagePath, (img: any) => {
            img.scaleToWidth(200)
            img.set({
                left: 200,
                top: 200,
                cornerColor: '#2D5A27',
                cornerStrokeColor: '#FFFFFF',
                transparentCorners: false,
                cornerSize: 10,
            })
            fabricCanvas.current?.add(img)
            fabricCanvas.current?.setActiveObject(img)
        })
    }

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !fabricCanvas.current) return

        const reader = new FileReader()
        reader.onload = (f) => {
            const data = f.target?.result as string
            fabric.Image.fromURL(data, (img: any) => {
                img.scaleToWidth(100)
                fabricCanvas.current?.add(img)
                fabricCanvas.current?.setActiveObject(img)
            })
        }
        reader.readAsDataURL(file)
    }

    const deleteSelected = () => {
        const activeObjects = fabricCanvas.current?.getActiveObjects()
        if (activeObjects) {
            fabricCanvas.current?.discardActiveObject()
            activeObjects.forEach((obj: any) => {
                fabricCanvas.current?.remove(obj)
            })
        }
    }

    const exportAndOrder = () => {
        if (!fabricCanvas.current) return

        const dataURL = fabricCanvas.current.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 2 // High res
        })

        // Generate WhatsApp link
        const message = encodeURIComponent(`Halo Ria Florist, saya ingin memesan papan bunga dengan desain custom yang saya buat di website.\n\nDetail Pesanan:\n- Tipe: Premium Board\n- Harap cek lampiran gambar desain saya.`)
        const whatsappUrl = `https://wa.me/6281234567890?text=${message}`

        // Show preview modal or open WA directly
        window.open(whatsappUrl, '_blank')

        // Suggest saving image
        const link = document.createElement('a')
        link.download = 'desain-ria-florist.png'
        link.href = dataURL
        // link.click() // Usually better to let user preview first
    }

    return (
        <section id="designer" className="py-24 bg-[#FAFAFA] min-h-screen">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Main Workspace */}
                    <div className="flex-1 flex flex-col space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-serif text-slate-900 leading-tight">Interactive <span className="text-primary italic">Designer</span></h2>
                                <p className="text-slate-500 font-sans mt-1">Design your premium expression in minutes.</p>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => fabricCanvas.current?.clear().setBackgroundImage('', () => updateBoard(selectedBoard.path))}
                                    className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                                    title="Reset Workspace"
                                >
                                    <RotateCcw size={20} className="text-slate-600" />
                                </button>
                                <button
                                    onClick={deleteSelected}
                                    className="p-3 bg-white border border-rose-100 rounded-xl hover:bg-rose-50 transition-colors shadow-sm"
                                    title="Remove Selected Element"
                                >
                                    <Trash2 size={20} className="text-rose-500" />
                                </button>
                            </div>
                        </div>

                        <div className="designer-canvas-container relative flex justify-center items-center p-8 bg-slate-200/50 border-4 border-white">
                            <canvas id="main-canvas" ref={canvasRef} />
                            {isLoading && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-primary/5 border border-slate-100">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    <Download size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold font-serif">Review & Order</h4>
                                    <p className="text-sm text-slate-500 mt-1 max-w-md">Klik tombol di bawah untuk men-generate gambar desain Anda dan lanjut ke pemesanan via WhatsApp.</p>
                                    <button
                                        onClick={exportAndOrder}
                                        className="mt-6 flex items-center space-x-3 px-8 py-4 bg-primary text-white rounded-full font-bold hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:scale-105"
                                    >
                                        <span>Checkout via WhatsApp</span>
                                        <MessageCircle size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Control Panel */}
                    <div className="w-full lg:w-96 flex flex-col space-y-6">
                        <div className="bg-white rounded-[2rem] shadow-xl shadow-primary/5 border border-slate-100 overflow-hidden">
                            {/* Tabs Wrapper */}
                            <div className="flex border-b border-slate-50">
                                {(['board', 'text', 'ornaments', 'logo'] as TabType[]).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-5 flex flex-col items-center justify-center space-y-1 transition-all relative ${activeTab === tab ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {tab === 'board' && <Palette size={20} />}
                                        {tab === 'text' && <Type size={20} />}
                                        {tab === 'ornaments' && <Flower2 size={20} />}
                                        {tab === 'logo' && <Upload size={20} />}
                                        <span className="text-[10px] uppercase font-bold tracking-widest">{tab}</span>
                                        {activeTab === tab && (
                                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full mx-4" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-8">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'board' && (
                                        <motion.div
                                            key="board"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Board Type</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {BOARDS.map((board) => (
                                                    <button
                                                        key={board.id}
                                                        onClick={() => {
                                                            setSelectedBoard(board)
                                                            updateBoard(board.path)
                                                        }}
                                                        className={`p-2 rounded-2xl border-2 transition-all group ${selectedBoard.id === board.id ? 'border-primary ring-4 ring-primary/10' : 'border-slate-100'}`}
                                                    >
                                                        <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                                                            <Image src={board.path} alt={board.name} fill className="object-cover" />
                                                        </div>
                                                        <span className={`text-xs font-bold ${selectedBoard.id === board.id ? 'text-primary' : 'text-slate-600'}`}>{board.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'text' && (
                                        <motion.div
                                            key="text"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Add Typography</h3>
                                            <div className="space-y-3">
                                                <button
                                                    onClick={() => addText('SELAMAT & SUKSES')}
                                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-primary/5 hover:border-primary/20 transition-all font-serif italic text-lg opacity-80"
                                                >
                                                    <span>Selamat & Sukses</span>
                                                    <Plus size={18} />
                                                </button>
                                                <button
                                                    onClick={() => addText('TURUT BERDUKA CITA')}
                                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-200 transition-all font-serif uppercase tracking-tight text-lg opacity-80"
                                                >
                                                    <span>Duka Cita</span>
                                                    <Plus size={18} />
                                                </button>
                                                <button
                                                    onClick={() => addText('NAMA PENGIRIM')}
                                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-200 transition-all font-sans font-bold text-sm opacity-60"
                                                >
                                                    <span>Nama Pengirim</span>
                                                    <Plus size={18} />
                                                </button>
                                            </div>

                                            <div className="pt-6 border-t border-slate-50">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Font Stylings</h4>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {FONTS.map(f => (
                                                        <button
                                                            key={f.name}
                                                            className="py-2 px-3 border border-slate-200 rounded-lg text-[10px] font-bold hover:bg-slate-100"
                                                            onClick={() => {
                                                                const active = fabricCanvas.current?.getActiveObject() as fabric.IText
                                                                if (active && active.type === 'i-text') {
                                                                    active.set('fontFamily', f.value)
                                                                    fabricCanvas.current?.renderAll()
                                                                }
                                                            }}
                                                        >
                                                            {f.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'ornaments' && (
                                        <motion.div
                                            key="ornaments"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Fresh Flowers</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {FLOWERS.map((flower) => (
                                                    <button
                                                        key={flower.id}
                                                        onClick={() => addOrnament(flower.path)}
                                                        className="p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:border-primary/20 transition-all group"
                                                    >
                                                        <div className="relative aspect-square mb-2 overflow-hidden rounded-lg bg-white p-2">
                                                            <Image src={flower.path} alt={flower.name} fill className="object-contain" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{flower.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'logo' && (
                                        <motion.div
                                            key="logo"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Corporate Branding</h3>
                                            <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary transition-colors cursor-pointer relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoUpload}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                                    <Upload size={32} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">Upload Logo</p>
                                                    <p className="text-xs text-slate-400 mt-1">PNG or JPG supported (Transparent PNG recommended)</p>
                                                </div>
                                            </div>

                                            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex space-x-4">
                                                <div className="text-amber-600 mt-1">
                                                    <Upload size={16} />
                                                </div>
                                                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                                                    Tip: Gunakan logo dengan latar belakang transparan agar terlihat lebih elegan menyatu dengan papan.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Canvas Layers Guide */}
                        <div className="bg-slate-100 p-6 rounded-[2rem] border border-slate-200">
                            <div className="flex items-center space-x-3 mb-4">
                                <RotateCcw size={16} className="text-slate-400" />
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Quick Tips</span>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-center text-xs text-slate-600">
                                    <ChevronRight size={14} className="text-primary mr-2" />
                                    <span>Klik elemen di canvas untuk mengatur posisi & ukuran.</span>
                                </li>
                                <li className="flex items-center text-xs text-slate-600">
                                    <ChevronRight size={14} className="text-primary mr-2" />
                                    <span>Tahan tombol Shift untuk memutar objek secara presisi.</span>
                                </li>
                                <li className="flex items-center text-xs text-slate-600">
                                    <ChevronRight size={14} className="text-primary mr-2" />
                                    <span>Klik Icon Tong Sampah untuk menghapus elemen terpilih.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
