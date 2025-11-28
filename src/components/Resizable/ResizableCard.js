import React from 'react';

const ResizableCard = ({ children, width, left, onResize }) => {
  const handleMouseDownRight = (e) => {
    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (e) => {
      const newWidth = startWidth + (e.clientX - startX);
      onResize({ width: newWidth });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDownLeft = (e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = width;
    const startLeft = left;

    const handleMouseMove = (e) => {
      const dx = e.clientX - startX;
      const newWidth = startWidth - dx;
      const newLeft = startLeft + dx;
      onResize({ width: newWidth, left: newLeft });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div style={{ width: `${width}px`, left: `${left}px`, border: '1px solid black', position: 'absolute', height: '100px' }}>
      {children}
      <div
        onMouseDown={handleMouseDownLeft}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '5px',
          cursor: 'col-resize',
          backgroundColor: 'gray',
        }}
      />
      <div
        onMouseDown={handleMouseDownRight}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '5px',
          cursor: 'col-resize',
          backgroundColor: 'gray',
        }}
      />
    </div>
  );
};

export default ResizableCard;
