import React, { useState, useRef } from 'react';
import ResizableCard from './ResizableCard';

const initialCards = [
  { id: 1, width: 200, left: 20 },
  { id: 2, width: 200, left: 230 },
  { id: 3, width: 200, left: 440 },
];

const ResizableCardList = () => {
  const [cards, setCards] = useState(initialCards);
  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleResize = (index, { width, left }) => {
    const newCards = [...cards];
    if (width !== undefined) {
      newCards[index].width = width;
    }
    if (left !== undefined) {
      newCards[index].left = left;
    }
    setCards(newCards);
  };

  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = (e) => {
    const newCards = [...cards];
    const dragItemContent = newCards[dragItem.current];
    newCards.splice(dragItem.current, 1);
    newCards.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setCards(newCards);
  };

  return (
    <div style={{ position: 'relative', padding: '20px', height: '200px' }}>
      {cards.map((card, index) => (
        <div key={card.id} onDragEnter={(e) => handleDragEnter(e, index)}>
          <ResizableCard
            width={card.width}
            left={card.left}
            onResize={(updates) => handleResize(index, updates)}
          >
            <div
              style={{ padding: '20px', cursor: 'grab' }}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              Card {card.id}
            </div>
          </ResizableCard>
        </div>
      ))}
    </div>
  );
};

export default ResizableCardList;
