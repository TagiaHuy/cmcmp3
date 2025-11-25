
import React from 'react';
import { Box, Typography } from '@mui/material';

const TimelineMarkers = ({ duration, timelineWidth }) => {
    if (!duration || !timelineWidth) return null;

    const markers = [];
    const interval = 5; // seconds
    const numberOfMarkers = Math.floor(duration / interval);

    for (let i = 1; i <= numberOfMarkers; i++) {
        const time = i * interval;
        const position = (time / duration) * timelineWidth;
        markers.push(
            <Box
                key={time}
                sx={{
                    position: 'absolute',
                    left: `${position}px`,
                    top: 0,
                    bottom: 0,
                    width: '1px',
                    backgroundColor: 'divider',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" sx={{ position: 'absolute', top: '-20px' }}>
                    {time}s
                </Typography>
            </Box>
        );
    }

    return <>{markers}</>;
};

export default TimelineMarkers;
