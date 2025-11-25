import React, { useState, useRef, useEffect } from 'react';

const ResizableCard = ({ children, width, left, onResize, isSelected }) => {
    const handleMouseDownRight = (e) => {
      e.stopPropagation();
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
      <div style={{ width: `${width}px`, left: `${left}px`, border: isSelected ? '2px solid #9353FF' : '1px solid black', position: 'absolute', height: '50px', top: '35px' }}>
        <div style={{ padding: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {children}
        </div>
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

const LyricResizableCardList = ({ lyrics, duration, containerWidth, onCardTimeUpdate, selectedLyric, onSelectLyric }) => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (lyrics && duration && containerWidth) {
      const newCards = lyrics.map((lyric, index) => {
        const nextLyric = lyrics[index + 1];
        const endTime = nextLyric ? nextLyric.time : duration;
        const cardWidth = ((endTime - lyric.time) / duration) * containerWidth;
        const cardLeft = (lyric.time / duration) * containerWidth;
        return {
          id: lyric.id || index,
          width: cardWidth,
          left: cardLeft,
          text: lyric.text,
          time: lyric.time
        };
      });
      setCards(newCards);
    }
  }, [lyrics, duration, containerWidth]);

  const handleResize = (index, { width, left }) => {
    const newCards = [...cards];
    const card = newCards[index];
    
    if (width !== undefined) {
        card.width = width;
    }
    if (left !== undefined) {
        card.left = left;
    }
    setCards(newCards);

    const newStartTime = (card.left / containerWidth) * duration;
    const newEndTime = ((card.left + card.width) / containerWidth) * duration;
    
    onCardTimeUpdate(index, newStartTime, newEndTime);
  };


  return (
    <div style={{ position: 'relative', width: '100%', height: '100px' }}>
      {cards.map((card, index) => (
        <div key={card.id} onClick={() => onSelectLyric(card)}>
          <ResizableCard
            width={card.width}
            left={card.left}
            onResize={(updates) => handleResize(index, updates)}
            isSelected={selectedLyric && selectedLyric.id === card.id}
          >
            {card.text}
          </ResizableCard>
        </div>
      ))}
    </div>
  );
};

export default LyricResizableCardList;
