
import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import LyricCard from './LyricCard';
import TimelineMarkers from './TimelineMarkers';
import { useMediaPlayer } from '../../context/MediaPlayerContext';

const LyricTimeline = ({ lyrics, onLyricsChange }) => {
    const { duration: songDuration } = useMediaPlayer();
    const [timelineWidth, setTimelineWidth] = useState(0);
    const timelineRef = useRef(null);

    useEffect(() => {
        if (timelineRef.current) {
            setTimelineWidth(timelineRef.current.offsetWidth);
        }
        const handleResize = () => {
            if (timelineRef.current) {
                setTimelineWidth(timelineRef.current.offsetWidth);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDrag = (id, newTime) => {
        let updatedLyrics = lyrics.map(l =>
            l.id === id ? { ...l, time: newTime } : l
        );
        updatedLyrics.sort((a, b) => a.time - b.time);
        onLyricsChange(updatedLyrics);
    };

    const handleResize = (id, direction, delta, newTime) => {
        let updatedLyrics = [...lyrics];
        const resizedIndex = updatedLyrics.findIndex(l => l.id === id);
        if (resizedIndex === -1) return;

        if (direction === 'left') {
            updatedLyrics[resizedIndex].time = newTime;
        } else if (direction === 'right') {
            const currentLyric = updatedLyrics[resizedIndex];
            const newEndTime = currentLyric.time + currentLyric.duration + (delta.width / timelineWidth * songDuration);
            
            const nextIndex = lyrics.findIndex(l => l.time > currentLyric.time);
            
            if(nextIndex > -1){
                updatedLyrics[nextIndex].time = newEndTime;
            }
        }
        
        updatedLyrics.sort((a, b) => a.time - b.time);
        onLyricsChange(updatedLyrics);
    };
    
    const getLyricsWithDurations = () => {
        const sortedLyrics = [...lyrics].sort((a, b) => a.time - b.time);
        return sortedLyrics.map((lyric, index) => {
            const nextLyric = sortedLyrics[index + 1];
            const duration = nextLyric ? nextLyric.time - lyric.time : songDuration - lyric.time;
            return { ...lyric, duration };
        });
    };

    const lyricsWithDurations = getLyricsWithDurations();

    return (
        <Paper ref={timelineRef} sx={{ width: '100%', height: '100px', position: 'relative', overflow: 'hidden', mt: 4, userSelect: 'none' }}>
            <TimelineMarkers duration={songDuration} timelineWidth={timelineWidth} />
            {lyricsWithDurations.map(lyric => (
                <LyricCard
                    key={lyric.id}
                    lyric={lyric}
                    onDrag={handleDrag}
                    onResize={handleResize}
                    timelineWidth={timelineWidth}
                    songDuration={songDuration}
                />
            ))}
        </Paper>
    );
};


export default LyricTimeline;
