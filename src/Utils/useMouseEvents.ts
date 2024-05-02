import React, { useState, RefObject } from 'react';
import { scaleMinus, scalePlus, minZoomLevel, maxZoomLevel } from "../constants/dataChart";

export const useMouseEvents = (
    canvasRef: RefObject<HTMLCanvasElement>,
    zoomLevel: number,
    setZoomLevel: React.Dispatch<React.SetStateAction<number>>,
    translatePos: { x: number; y: number },
    setTranslatePos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        setIsDragging(true);
        setDragStartPos({ x: event.clientX, y: event.clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (!isDragging) return;

        const deltaX = event.clientX - dragStartPos.x;
        const deltaY = event.clientY - dragStartPos.y;

        setTranslatePos({
            x: translatePos.x + deltaX / zoomLevel,
            y: translatePos.y + deltaY / zoomLevel
        });

        setDragStartPos({ x: event.clientX, y: event.clientY });
    };

    const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        let scaleFactor = event.deltaY > 0 ? scaleMinus : scalePlus;

        const newZoomLevel = zoomLevel * scaleFactor;

        if (newZoomLevel >= minZoomLevel && newZoomLevel <= maxZoomLevel) {
            const newXTranslate = translatePos.x - (offsetX - translatePos.x) * (scaleFactor - 1);
            const newYTranslate = translatePos.y - (offsetY - translatePos.y) * (scaleFactor - 1) ;
            const meteringErrYTranslate = event.deltaY > 0 ? newYTranslate + 20 : newYTranslate;
            setZoomLevel(newZoomLevel);
            setTranslatePos({ x: newXTranslate, y: meteringErrYTranslate });
        }
    };

    return { handleMouseDown, handleMouseUp, handleMouseMove, handleWheel };
};