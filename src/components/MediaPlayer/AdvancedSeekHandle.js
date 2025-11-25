import React, { useRef, useEffect } from 'react';
import LyricResizableCardList from './LyricResizableCardList';
import useResizeObserver from '../../hooks/useResizeObserver';
import './AdvancedSeekHandle.css';

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

const AdvancedSeekHandle = ({ currentTime, duration, onSeek, textColor, lyrics, onCardTimeUpdate, selectedLyric, onSelectLyric }) => {
  const canvasRef = useRef(null);
  const { ref: containerRef, width } = useResizeObserver();

  useEffect(() => {
    drawRuler(canvasRef.current, duration, width, textColor);
  }, [duration, width, textColor]);

  const handleSeek = (e) => {
    if (!duration || !width) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newTime = (x / width) * duration;
    onSeek(e, newTime);
  };
  
  const handleInteraction = (e) => {
    if (e.buttons === 1) { // If left mouse button is down
      handleSeek(e);
    }
  };

  const scrubberPosition = duration > 0 ? (currentTime / duration) * width : 0;

  return (
    <div 
      ref={containerRef} 
      className="advanced-seek-handle-container"
      onClick={handleSeek}
      onMouseMove={handleInteraction}
    >
      <canvas ref={canvasRef} className="advanced-seek-handle-canvas" />
      {duration > 0 && (
        <div
          className="advanced-seek-handle-scrubber"
          style={{ left: `${scrubberPosition}px` }}
        />
      )}
      <LyricResizableCardList 
        lyrics={lyrics} 
        duration={duration} 
        containerWidth={width}
        onCardTimeUpdate={onCardTimeUpdate}
        selectedLyric={selectedLyric}
        onSelectLyric={onSelectLyric}
      />
    </div>
  );
};

export default AdvancedSeekHandle;
