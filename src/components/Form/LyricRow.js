
import React from 'react';
import { TableRow, TableCell, TextField, IconButton, Box } from '@mui/material';
import { AccessTime, Clear, Update } from '@mui/icons-material';
import { useMediaPlayer } from '../../context/MediaPlayerContext';

const LyricRow = ({ lyric, onLyricChange, onTimeChange, onSetCurrentTime, onClearTime, onDistributeTime, isActive }) => {
    const { currentTime } = useMediaPlayer();

    const handleSetCurrentTime = () => {
        onSetCurrentTime(lyric.id, currentTime);
    };

    const handleTimeChange = (e) => {
        const timeValue = e.target.value;
        const timeInSeconds = timeValue.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
        onTimeChange(lyric.id, timeInSeconds);
    };

    const formatTime = (timeInSeconds) => {
        if (timeInSeconds === null || isNaN(timeInSeconds)) return '';
        const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
        const seconds = (timeInSeconds % 60).toFixed(2).padStart(5, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <TableRow sx={{ backgroundColor: isActive ? 'action.hover' : 'transparent' }}>
            <TableCell>
                <TextField
                    fullWidth
                    variant="standard"
                    value={lyric.text}
                    onChange={(e) => onLyricChange(lyric.id, e.target.value)}
                />
            </TableCell>
            <TableCell>
                <TextField
                    variant="standard"
                    value={formatTime(lyric.time)}
                    onChange={handleTimeChange}
                    placeholder="mm:ss.xx"
                />
            </TableCell>
            <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={handleSetCurrentTime} title="Set to current time">
                        <AccessTime />
                    </IconButton>
                    <IconButton onClick={() => onClearTime(lyric.id)} title="Clear time">
                        <Clear />
                    </IconButton>
                    <IconButton onClick={() => onDistributeTime(lyric.id)} title="Distribute time">
                        <Update />
                    </IconButton>
                </Box>
            </TableCell>
        </TableRow>
    );
};

export default LyricRow;
