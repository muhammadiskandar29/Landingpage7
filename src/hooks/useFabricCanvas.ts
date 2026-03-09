import { useEffect, useRef, useState, useCallback } from 'react'

// SSR Safety for Fabric
let fabric: any;
if (typeof window !== 'undefined') {
    fabric = require('fabric').fabric;
}

export type BoardDesign = {
    mainBoardColor: string;
    headerColor: string;
    umbulColorA: string;
    umbulColorB: string;
    category: 'Selamat' | 'Duka';
    messageText: string;
    senderText: string;
    headlineTextColor: string;
    messageTextColor: string;
    senderTextColor: string;
};

export const useFabricCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvas = useRef<any>(null);
    const [design, setDesign] = useState<BoardDesign>({
        mainBoardColor: '#6B21A8', // Purple
        headerColor: '#F472B6',    // Pink
        umbulColorA: '#EAB308',    // Yellow
        umbulColorB: '#FFFFFF',    // White
        category: 'Selamat',
        messageText: 'ATAS KELAHIRAN PUTRI KEDUA',
        senderText: 'RIZKY BILLAR & LESTI KEJORA',
        headlineTextColor: '#000000',
        messageTextColor: '#FFFFFF',
        senderTextColor: '#FFFFFF',
    });

    const initCanvas = useCallback((containerWidth: number) => {
        if (!canvasRef.current || !fabric) return;

        const canvasWidth = Math.min(1000, containerWidth - 40);
        const canvasHeight = (canvasWidth / 4) * 3;

        fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
            width: canvasWidth,
            height: canvasHeight,
            backgroundColor: '#F3F4F6',
            preserveObjectStacking: true,
        });

        render(design);
    }, []);

    const render = (state: BoardDesign) => {
        const canvas = fabricCanvas.current;
        if (!canvas) return;

        canvas.clear();
        const w = canvas.width;
        const h = canvas.height;

        // 1. Layer 1: Main Board
        const mainBoard = new fabric.Rect({
            left: w * 0.05,
            top: h * 0.05,
            width: w * 0.9,
            height: h * 0.9,
            fill: state.mainBoardColor,
            rx: 20,
            ry: 20,
            selectable: false,
        });
        canvas.add(mainBoard);

        // 2. Layer 2: Wide Body Header (Center Rect)
        // 70:30 logic or centered
        const headerWidth = w * 0.8;
        const headerHeight = h * 0.4;
        const headerRect = new fabric.Rect({
            left: w / 2,
            top: h / 2,
            width: headerWidth,
            height: headerHeight,
            fill: state.headerColor,
            rx: 15,
            ry: 15,
            originX: 'center',
            originY: 'center',
            shadow: new fabric.Shadow({
                color: 'rgba(0,0,0,0.3)',
                blur: 15,
                offsetX: 5,
                offsetY: 5
            }),
            selectable: false,
        });
        canvas.add(headerRect);

        // 3. Umbul-umbul System
        const radius = 6;
        const spacing = 20;
        const boardLeft = mainBoard.left;
        const boardTop = mainBoard.top;
        const boardWidth = mainBoard.width;
        const boardHeight = mainBoard.height;

        const drawUmbul = (sx: number, ex: number, sy: number, ey: number, isHorizontal: boolean) => {
            let count = 0;
            if (isHorizontal) {
                for (let x = sx; x <= ex; x += spacing) {
                    canvas.add(new fabric.Circle({
                        left: x, top: sy, radius,
                        fill: count % 2 === 0 ? state.umbulColorA : state.umbulColorB,
                        originX: 'center', originY: 'center', selectable: false
                    }));
                    count++;
                }
            } else {
                for (let y = sy; y <= ey; y += spacing) {
                    canvas.add(new fabric.Circle({
                        left: sx, top: y, radius,
                        fill: count % 2 === 0 ? state.umbulColorA : state.umbulColorB,
                        originX: 'center', originY: 'center', selectable: false
                    }));
                    count++;
                }
            }
        };

        // Border Main Board
        drawUmbul(boardLeft, boardLeft + boardWidth, boardTop, boardTop, true); // Top
        drawUmbul(boardLeft, boardLeft + boardWidth, boardTop + boardHeight, boardTop + boardHeight, true); // Bottom
        drawUmbul(boardLeft, boardLeft, boardTop, boardTop + boardHeight, false); // Left
        drawUmbul(boardLeft + boardWidth, boardLeft + boardWidth, boardTop, boardTop + boardHeight, false); // Right

        // 4. Headline Text
        const headlineText = state.category === 'Selamat' ? 'Selamat' : 'Turut Berduka Cita';
        const headline = new fabric.Text(headlineText, {
            left: w / 2,
            top: h * 0.2,
            fontSize: h * 0.12,
            fontFamily: 'serif',
            fontWeight: 'bold',
            fontStyle: 'italic',
            fill: state.headlineTextColor,
            stroke: '#FFFFFF',
            strokeWidth: 2,
            originX: 'center',
            originY: 'center',
            selectable: false
        });
        canvas.add(headline);

        // Decorative Stars around Headline
        const starColor = state.umbulColorA;
        const starPositions = [
            { x: w * 0.3, y: h * 0.2 },
            { x: w * 0.7, y: h * 0.2 },
            { x: w * 0.25, y: h * 0.18 },
            { x: w * 0.75, y: h * 0.18 }
        ];
        starPositions.forEach(pos => {
            const star = new fabric.Text('★', {
                left: pos.x,
                top: pos.y,
                fontSize: 24,
                fill: starColor,
                originX: 'center',
                originY: 'center',
                selectable: false
            });
            canvas.add(star);
        });

        // 5. Message Body
        const message = new fabric.IText(state.messageText.toUpperCase(), {
            left: w / 2,
            top: h / 2,
            fontSize: h * 0.05,
            fontFamily: 'Impact, sans-serif',
            fill: state.messageTextColor,
            textAlign: 'center',
            originX: 'center',
            originY: 'center',
            selectable: true
        });
        canvas.add(message);

        // 6. Sender Block
        const sender = new fabric.IText(state.senderText.toUpperCase(), {
            left: w / 2,
            top: h * 0.75,
            fontSize: h * 0.07,
            fontFamily: 'Impact, sans-serif',
            fill: state.senderTextColor,
            textAlign: 'center',
            originX: 'center',
            originY: 'center',
            selectable: true
        });
        canvas.add(sender);

        canvas.renderAll();
    };

    const updateDesign = (newDesign: Partial<BoardDesign>) => {
        const updated = { ...design, ...newDesign };
        setDesign(updated);
        render(updated);
    };

    const exportDesign = () => {
        if (!fabricCanvas.current) return '';
        return fabricCanvas.current.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 3
        });
    };

    return { canvasRef, initCanvas, design, updateDesign, exportDesign };
};
