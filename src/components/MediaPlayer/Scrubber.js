import React from 'react';

const Scrubber = ({ currentTime, duration, containerWidth }) => {
    const scrubberPosition = duration > 0 ? (currentTime / duration) * containerWidth : 0;

    if (duration <= 0) {
        return null;
    }

    return (
        <div
            className="advanced-seek-handle-scrubber"
            style={{ left: `${scrubberPosition}px` }}
        />
    );
};

export default Scrubber;
