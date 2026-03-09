import { useRef, useEffect, useCallback } from 'react';

// SSR Safety for Fabric
let fabric: any;
if (typeof window !== 'undefined') {
    fabric = require('fabric').fabric;
}

export type BoardDesign = {
    id: string;
    category: 'Selamat' | 'Duka';
    upperFoamColor: string;
    lowerFoamColor: string;
    umbulColor1: string;
    umbulColor2: string;
    headerTextColor: string;
    headerOrnamentColor: string;
    headerBubbleColor: string;
    messageText: string;
    senderText: string;
    mahkotaId: string;
    kakiId: string;
};

export const useFlowerCanvas = (canvasRef: React.RefObject<HTMLCanvasElement | null>, state: BoardDesign) => {
    const fabricCanvas = useRef<any>(null);

    const renderDesign = useCallback(() => {
        const canvas = fabricCanvas.current;
        if (!canvas) return;

        canvas.clear();
        const width = canvas.width;
        const height = canvas.height;
        const upperHeight = height * 0.7;

        // 1. Foam Layers (70:30 Split)
        const upperFoam = new fabric.Rect({
            left: 0, top: 0, width: width, height: upperHeight,
            fill: state.upperFoamColor, selectable: false
        });
        const lowerFoam = new fabric.Rect({
            left: 0, top: upperHeight, width: width, height: height - upperHeight,
            fill: state.lowerFoamColor, selectable: false
        });
        canvas.add(upperFoam, lowerFoam);

        // 2. Umbul-Umbul (Circular Border System)
        const dotRadius = 6;
        const spacing = 20;

        const drawBorderDots = (sx: number, ex: number, sy: number, ey: number, isH: boolean) => {
            let count = 0;
            if (isH) {
                for (let x = sx; x <= ex; x += spacing) {
                    canvas.add(new fabric.Circle({
                        left: x, top: sy, radius: dotRadius,
                        fill: count % 2 === 0 ? state.umbulColor1 : state.umbulColor2,
                        originX: 'center', originY: 'center', selectable: false
                    }));
                    count++;
                }
            } else {
                for (let y = sy; y <= ey; y += spacing) {
                    canvas.add(new fabric.Circle({
                        left: sx, top: y, radius: dotRadius,
                        fill: count % 2 === 0 ? state.umbulColor1 : state.umbulColor2,
                        originX: 'center', originY: 'center', selectable: false
                    }));
                    count++;
                }
            }
        };

        drawBorderDots(0, width, 0, 0, true); // Top
        drawBorderDots(0, width, height, 0, true); // Bottom
        drawBorderDots(0, 0, 0, height, false); // Left
        drawBorderDots(width, 0, 0, height, false); // Right
        drawBorderDots(0, width, upperHeight, 0, true); // Divider

        // 3. Header Ribbon & Text Engine
        const centerX = width / 2;
        const centerY = upperHeight * 0.35;
        const ribW = width * 0.7;
        const ribH = upperHeight * 0.4;

        // Path for the ribbon background
        const ribbonPath = `M ${centerX - ribW / 2} ${centerY} 
                        C ${centerX - ribW / 2} ${centerY - ribH / 2 - 20}, ${centerX - ribW / 4} ${centerY - ribH / 2}, ${centerX} ${centerY - ribH / 2}
                        S ${centerX + ribW / 2} ${centerY - ribH / 2 - 20}, ${centerX + ribW / 2} ${centerY}
                        C ${centerX + ribW / 2} ${centerY + ribH / 2 + 20}, ${centerX + ribW / 4} ${centerY + ribH / 2}, ${centerX} ${centerY + ribH / 2}
                        S ${centerX - ribW / 2} ${centerY + ribH / 2 + 20}, ${centerX - ribW / 2} ${centerY} Z`;

        const ribbon = new fabric.Path(ribbonPath, {
            fill: state.headerBubbleColor,
            stroke: state.headerOrnamentColor,
            strokeWidth: 2,
            selectable: false
        });
        canvas.add(ribbon);

        // Header Umbul (Dots around ribbon)
        const ribbonDots = 36;
        for (let i = 0; i < ribbonDots; i++) {
            const angle = (i / ribbonDots) * Math.PI * 2;
            const x = centerX + (ribW / 2 + 10) * Math.cos(angle);
            const y = centerY + (ribH / 2 + 10) * Math.sin(angle);
            const nx = x + Math.sin(i * 1.5) * 5;
            const ny = y + Math.cos(i * 1.5) * 5;
            canvas.add(new fabric.Circle({
                left: nx, top: ny, radius: 5, fill: state.headerOrnamentColor,
                originX: 'center', originY: 'center', selectable: false
            }));
        }

        // Main Header Text
        const headText = new fabric.Text(state.category === 'Selamat' ? 'Selamat' : 'Duka Cita', {
            left: centerX, top: centerY - 10,
            fontSize: ribH * 0.7, fontFamily: 'serif', fontWeight: 'bold', fontStyle: 'italic',
            fill: state.headerTextColor, stroke: '#1A1A1A', strokeWidth: 1.5,
            originX: 'center', originY: 'middle', selectable: false
        });
        canvas.add(headText);

        // 4. Message Text
        const msgText = new fabric.Text(state.messageText.toUpperCase(), {
            left: centerX, top: centerY + ribH + 30,
            fontSize: upperHeight * 0.08, fontFamily: 'Impact, sans-serif',
            fill: '#FFFFFF', stroke: '#000000', strokeWidth: 0.5,
            textAlign: 'center', originX: 'center', originY: 'middle', selectable: true
        });
        canvas.add(msgText);

        // 5. Sender Text
        const senderText = new fabric.Text(state.senderText.toUpperCase(), {
            left: centerX, top: upperHeight + (height - upperHeight) / 2,
            fontSize: (height - upperHeight) * 0.25, fontFamily: 'Impact, sans-serif',
            fill: state.lowerFoamColor === '#FFFFFF' ? '#2D5A27' : '#FFFFFF',
            stroke: state.lowerFoamColor === '#FFFFFF' ? 'transparent' : '#000000',
            strokeWidth: 0.5, textAlign: 'center', originX: 'center', originY: 'middle', selectable: true
        });
        canvas.add(senderText);

        // 6. Accessories (Flowers - High Fidelity Assets)
        const loadFlower = (url: string, pos: 'top' | 'bottom') => {
            fabric.Image.fromURL(url, (img: any) => {
                if (pos === 'top') {
                    img.scaleToWidth(width * 0.5);
                    img.set({ left: width / 2, top: -10, originX: 'center', originY: 'top', selectable: false });
                } else if (pos === 'bottom') {
                    img.scaleToWidth(width * 0.7);
                    img.set({ left: width / 2, top: height + 10, originX: 'center', originY: 'bottom', selectable: false });
                }
                canvas.add(img);
                canvas.bringToFront(img);
                canvas.renderAll();
            });
        };

        if (state.mahkotaId !== 'none') {
            const file = state.mahkotaId === 'classic' ? 'top-flower-rose.png' : 'top-tulip.png';
            loadFlower(`/flowers/${file}`, 'top');
        }

        if (state.kakiId !== 'none') {
            loadFlower(`/flowers/bottom-stand-flowers.png`, 'bottom');
        }

        canvas.renderAll();
    }, [state]);

    useEffect(() => {
        if (!canvasRef.current || !fabric) return;

        const canvasWidth = Math.min(600, window.innerWidth - 60);
        fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
            width: canvasWidth,
            height: (canvasWidth / 4) * 3,
            backgroundColor: '#F3F4F6',
            preserveObjectStacking: true,
        });

        renderDesign();

        return () => {
            fabricCanvas.current?.dispose();
        };
    }, [canvasRef, renderDesign]);

    const exportPNG = () => {
        if (!fabricCanvas.current) return null;
        return fabricCanvas.current.toDataURL({ format: 'png', quality: 1, multiplier: 3 });
    };

    return { exportPNG };
};
