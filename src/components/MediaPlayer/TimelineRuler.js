import React, { useRef, useEffect } from 'react';

const drawRuler = (canvas, duration, width, textColor) => {
    if (!canvas || !duration || width === 0) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = textColor || '#ccc';
    ctx.fillStyle = textColor || '#ccc';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';

    const majorTickInterval = 60; // seconds
    const minorTickInterval = 10; // seconds

    for (let i = 0; i <= duration; i++) {
        const x = (i / duration) * width;
        if (i % majorTickInterval === 0) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 15);
            ctx.stroke();
            ctx.fillText(`${Math.floor(i / 60)}:00`, x, 25);
        } else if (i % minorTickInterval === 0) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 10);
            ctx.stroke();
        }
    }
};

const TimelineRuler = ({ duration, width, textColor }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        drawRuler(canvasRef.current, duration, width, textColor);
    }, [duration, width, textColor]);

    return <canvas ref={canvasRef} className="advanced-seek-handle-canvas" />;
};

export default TimelineRuler;
