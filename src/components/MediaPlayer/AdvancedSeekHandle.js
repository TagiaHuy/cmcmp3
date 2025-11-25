import React, { useRef, useEffect, useState } from 'react';

const AdvancedSeekHandle = ({ currentTime, duration, onSeek, textColor }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
        if (containerRef.current) {
            setWidth(containerRef.current.offsetWidth);
        }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !duration || width === 0) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ruler styles
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
        ctx.fillText(Math.floor(i / 60) + ':00', x, 25);
      } else if (i % minorTickInterval === 0) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 10);
        ctx.stroke();
      }
    }
  }, [duration, width, textColor]);

  const handleSeek = (e) => {
    if (!duration) return;
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

  const scrubberPosition = (currentTime / duration) * width;

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '40px', position: 'relative', cursor: 'pointer', marginTop: '10px' }}
      onClick={handleSeek}
      onMouseMove={handleInteraction}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '30px' }} />
      {duration > 0 && (
        <div
          style={{
            position: 'absolute',
            left: `${scrubberPosition}px`,
            top: 0,
            width: '2px',
            height: '20px',
            backgroundColor: '#9353FF',
            transform: 'translateX(-50%)',
          }}
        />
      )}
    </div>
  );
};

export default AdvancedSeekHandle;
