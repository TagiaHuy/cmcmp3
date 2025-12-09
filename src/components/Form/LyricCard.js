
import React from 'react';
import { Rnd } from 'react-rnd';
import { Paper, Typography } from '@mui/material';

const LyricCard = ({ lyric, onDrag, onResize, timelineWidth, songDuration }) => {
    const cardWidth = (lyric.duration / songDuration) * timelineWidth;
    const cardX = (lyric.time / songDuration) * timelineWidth;

    return (
        <Rnd
            size={{ width: cardWidth, height: '100%' }}
            position={{ x: cardX, y: 0 }}
            onDragStop={(e, d) => onDrag(lyric.id, (d.x / timelineWidth) * songDuration)}
            onResizeStop={(e, direction, ref, delta, position) => {
                onResize(
                    lyric.id,
                    direction,
                    delta,
                    (position.x / timelineWidth) * songDuration
                );
            }}
            dragAxis="x"
            enableResizing={{ top: false, right: true, bottom: false, left: true, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
            bounds="parent"
        >
            <Paper
                elevation={3}
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    padding: '0 5px',
                }}
            >
                <Typography variant="body2">{lyric.text}</Typography>
            </Paper>
        </Rnd>
    );
};

export default LyricCard;
