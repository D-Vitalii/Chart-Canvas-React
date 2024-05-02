import { useRef, useState, useEffect, useCallback } from 'react';
import { black, font, green, red, textAlignC, textAlignL } from "../constants/styleChart";
import { defaultZoomLevel } from "../constants/dataChart";
import { IBar } from "../types/data";

interface ChartHookProps {
    barsData: IBar[];
    startTime: number;
}

export const useChart = ({ barsData, startTime }: ChartHookProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [zoomLevel, setZoomLevel] = useState<number>(defaultZoomLevel);
    const [translatePos, setTranslatePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const drawChart = useCallback(() => {
        if (!canvasRef.current || !barsData || !barsData.length) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const margin = { top: 20, right: 60, bottom: 40, left: 60 };
        const width = canvas.width - margin.left - margin.right;
        const height = canvas.height - margin.top - margin.bottom;

        const minDataTime = barsData.length && barsData[0].Time;
        const maxDataTime = barsData.length && barsData[barsData.length - 1].Time;
        const minPrice = Math.min(...barsData.map(bar => bar.Low));
        const maxPrice = Math.max(...barsData.map(bar => bar.High));

        const xScale = (time: number) => ((time - minDataTime) / (maxDataTime - minDataTime)) * width * zoomLevel;
        const yScale = (price: number) => height - ((price - minPrice) / (maxPrice - minPrice)) * height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(zoomLevel, zoomLevel);
        ctx.translate(translatePos.x, translatePos.y);

        barsData.forEach(bar => {
            const x = xScale(bar.Time) + margin.left;
            const yHigh = yScale(bar.High) + margin.top;
            const yLow = yScale(bar.Low) + margin.top;
            const yOpen = yScale(bar.Open) + margin.top;
            const yClose = yScale(bar.Close) + margin.top;

            ctx.strokeStyle = font;
            ctx.fillStyle = bar.Open > bar.Close ? red : green;

            const candleWidth = 10 / zoomLevel;
            const candleHeight = Math.abs(yOpen - yClose) / zoomLevel;

            ctx.beginPath();
            ctx.moveTo(x, yHigh);
            ctx.lineTo(x, yLow);
            ctx.stroke();

            ctx.fillRect(x - candleWidth / 2, yOpen, candleWidth, candleHeight);

            ctx.beginPath();
            ctx.moveTo(x, yHigh);
            ctx.lineTo(x, Math.min(yOpen, yClose));
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x, yLow);
            ctx.lineTo(x, Math.max(yOpen, yClose));
            ctx.stroke();
        });

        ctx.restore();

        ctx.fillStyle = black;
        ctx.font = font;
        ctx.textAlign = textAlignC;

        const daysCount = Math.ceil((maxDataTime - minDataTime) / (24 * 3600));
        for (let i = 0; i <= daysCount; i++) {
            const dayTime = minDataTime + i * 24 * 3600;
            const date = new Date((dayTime + startTime) * 1000);
            const xPos = xScale(dayTime) + margin.left;

            ctx.fillText(
                date.toLocaleDateString('en-US'),
                xPos + translatePos.x,
                canvas.height - margin.bottom + 15
            );
        }

        ctx.textAlign = textAlignL;
        for (let price = minPrice; price <= maxPrice; price += (maxPrice - minPrice) / 5) {
            const yPos = yScale(price) + margin.top + translatePos.y;
            ctx.fillText(price.toFixed(5), canvas.width - margin.right + 10, yPos);
        }
    }, [barsData, startTime, zoomLevel, translatePos]);

    useEffect(() => {
        drawChart();
    }, [drawChart]);


    return {
        canvasRef,
        zoomLevel,
        setZoomLevel,
        translatePos,
        setTranslatePos,
        drawChart,
    };
};
