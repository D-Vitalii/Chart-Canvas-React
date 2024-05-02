import React from 'react';
import { useMouseEvents }  from "../Utils/useMouseEvents";
import { useChart } from "../Utils/useChart";
import { heightCanvas, widthCanvas } from "../constants/dataChart";
import { IBar } from "../types/data";


interface ChartProps {
    barsData: IBar[];
    startTime: number;
}

const ChartComponent: React.FC<ChartProps> = ({ barsData, startTime }) => {
    const {
        canvasRef,
        zoomLevel,
        setZoomLevel,
        translatePos,
        setTranslatePos,
    } = useChart({ barsData, startTime });

    const { handleMouseDown, handleMouseUp, handleMouseMove, handleWheel } = useMouseEvents(
        canvasRef,
        zoomLevel,
        setZoomLevel,
        translatePos,
        setTranslatePos,
    );

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={widthCanvas}
                height={heightCanvas}
                onWheel={handleWheel}
                onDoubleClick={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            />
        </div>
    );
};

export default ChartComponent;
