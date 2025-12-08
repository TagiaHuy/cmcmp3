import React, { useRef, useState, useEffect } from 'react';
import { Box, Button, Typography, Stack, IconButton, TextField } from '@mui/material'; // Import necessary MUI components
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { useMediaPlayer } from '../../context/MediaPlayerContext';

const LyricEditor = ({ onLyricsParsed, duration }) => {
    const fileInputRef = useRef(null);
    const { currentTrack, currentTime } = useMediaPlayer(); // Also get currentTime for sync button
    const [editedLyrics, setEditedLyrics] = useState([]);
    const [editingLyricId, setEditingLyricId] = useState(null);
    const [tempLyricText, setTempLyricText] = useState('');
    const [editingTimingId, setEditingTimingId] = useState(null);
    const [tempTimestamp, setTempTimestamp] = useState('');

    useEffect(() => {
        setEditedLyrics(currentTrack?.lyrics || []);
    }, [currentTrack?.lyrics]);

    const handleLyricTextClick = (lyric) => {
        setEditingLyricId(lyric.id);
        setTempLyricText(lyric.text);
    };

    const handleLyricTextChange = (e) => {
        setTempLyricText(e.target.value);
    };

    const handleLyricTextSave = () => {
        setEditedLyrics(prev => prev.map(lyric => 
            lyric.id === editingLyricId ? { ...lyric, text: tempLyricText } : lyric
        ));
        setEditingLyricId(null);
        setTempLyricText('');
    };

    const handleLyricTextKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLyricTextSave();
        } else if (e.key === 'Escape') {
            setEditingLyricId(null);
            setTempLyricText('');
        }
    };

    const handleTimestampClick = (lyric) => {
        setEditingTimingId(lyric.id);
        setTempTimestamp(formatTime(lyric.time));
    };

    const handleTimestampChange = (e) => {
        setTempTimestamp(e.target.value);
    };

    const handleTimestampSave = () => {
        const timeParts = tempTimestamp.match(/(\d{2}):(\d{2})/);
        if (timeParts) {
            const minutes = parseInt(timeParts[1], 10);
            const seconds = parseInt(timeParts[2], 10);
            const newTime = minutes * 60 + seconds;

            setEditedLyrics(prev => prev.map(lyric => 
                lyric.id === editingTimingId ? { ...lyric, time: newTime } : lyric
            ));
        }
        setEditingTimingId(null);
        setTempTimestamp('');
    };

    const handleTimestampKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleTimestampSave();
        } else if (e.key === 'Escape') {
            setEditingTimingId(null);
            setTempTimestamp('');
        }
    };

    const parseLrcLyrics = (lrcContent) => {
        const lines = lrcContent.split('\n');
        const lyrics = [];
        const timeRegex = /^\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

        lines.forEach((line, index) => {
            const match = line.match(timeRegex);
            if (match) {
                const minutes = parseInt(match[1], 10);
                const seconds = parseInt(match[2], 10);
                const milliseconds = parseInt(match[3], 10);
                const time = minutes * 60 + seconds + milliseconds / 1000;
                let text = line.substring(match[0].length).trim();
                if (!text) { // If there's a timestamp but no text, it's a break
                    text = '<break>';
                }
                lyrics.push({ id: Date.now() + index, time, text });
            }
        });

        return lyrics;
    };

    const parsePlainTextLyrics = (textContent, duration) => {
        const lines = textContent.split('\n'); // Don't filter empty lines initially
        if (lines.length === 0) {
            return [];
        }

        const actualLines = lines.filter(line => line.trim() !== '');
        const interval = duration / (actualLines.length > 0 ? actualLines.length : 1); // Avoid division by zero

        let lineCounter = 0;
        return lines.map((line, index) => {
            const trimmedLine = line.trim();
            const lyricTime = lineCounter * interval;

            if (trimmedLine === '') {
                return {
                    id: Date.now() + index,
                    time: lyricTime,
                    text: '<break>',
                };
            } else {
                lineCounter++;
                return {
                    id: Date.now() + index,
                    time: lyricTime,
                    text: trimmedLine,
                };
            }
        }).filter(lyric => lyric.text !== '<break>' || lyric.time !== undefined); // Filter out un-timed breaks if they are not needed; adjust logic as per desired behavior
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            let parsed;
            if (file.name.toLowerCase().endsWith('.lrc')) {
                parsed = parseLrcLyrics(content);
            } else {
                parsed = parsePlainTextLyrics(content, duration);
            }
            
            if (parsed.length > 0) {
                setEditedLyrics(parsed); // Update local state
            } else {
                toast.error('File appears to be empty or could not be read.');
            }
        };
        reader.readAsText(file);
        event.target.value = null;
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleSaveLyrics = () => {
        onLyricsParsed(editedLyrics);
    };

    const handleDeleteLyric = (idToDelete) => {
        setEditedLyrics(prev => prev.filter(lyric => lyric.id !== idToDelete));
    };

    const handleSyncLyric = (idToSync) => {
        setEditedLyrics(prev => prev.map(lyric => 
            lyric.id === idToSync ? { ...lyric, time: currentTime } : lyric
        ));
    };

    const handleEditLyricTiming = (lyric) => {
        setEditingTimingId(lyric.id);
        setTempTimestamp(formatTimeForLrc(lyric.time));
    };

    const handleAddNewLine = (currentId, direction) => {
        const currentIndex = editedLyrics.findIndex(lyric => lyric.id === currentId);
        if (currentIndex === -1) return;

        const currentLyric = editedLyrics[currentIndex];
        const newLyric = {
            id: Date.now(),
            time: currentLyric.time, // Set new lyric's time to current lyric's time
            text: '<break>',
        };

        const newLyrics = [...editedLyrics];
        if (direction === 'up') {
            newLyrics.splice(currentIndex, 0, newLyric);
        } else {
            newLyrics.splice(currentIndex + 1, 0, newLyric);
        }
        setEditedLyrics(newLyrics);
    };



    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    };

    const formatTimeForLrc = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = (seconds % 60).toFixed(3); // Keep milliseconds
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(Math.floor(remainingSeconds)).padStart(2, '0');
        const formattedMilliseconds = String(remainingSeconds.split('.')[1] || '000').padStart(3, '0').substring(0, 3);
        return `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
    };

    const generateLrcContent = (lyrics) => {
        let lrc = '';
        if (currentTrack) {
            lrc += `[ar:${currentTrack.artists || 'Unknown'}]\n`;
            lrc += `[ti:${currentTrack.title || 'Unknown'}]\n`;
            lrc += `[al:${currentTrack.album || 'Unknown'}]\n`;
            lrc += `[length:${formatTimeForLrc(duration || 0)}]\n`;
            lrc += `[by:CMCM P3 Lyric Editor]\n`;
        }

        lyrics.forEach(lyric => {
            if (lyric.text !== '<break>') {
                lrc += `[${formatTimeForLrc(lyric.time)}]${lyric.text}\n`;
            } else {
                // How to represent breaks in LRC is not strictly defined,
                // often they are just skipped or represented by empty lines with timestamps.
                // For simplicity, we'll just add the timestamp for a break.
                // lrc += `[${formatTimeForLrc(lyric.time)}]\n`; 
                // Or you could represent it as an empty line if that's preferred.
            }
        });
        return lrc;
    };

    const handleExportLrc = () => {
        const lrcContent = generateLrcContent(editedLyrics);
        const blob = new Blob([lrcContent], { type: 'text/plain;charset=utf-8' });
        const filename = `${currentTrack?.title || 'lyrics'}.lrc`;
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };
    const handleDiscardLyrics = () => {
        if (window.confirm('Are you sure you want to discard all changes?')) {
            setEditedLyrics(currentTrack?.lyrics || []);
            toast.info('Changes discarded!');
        }
    };
    const activeIndex = editedLyrics.findIndex((lyric, i) => {
        const nextTime = editedLyrics[i + 1]?.time ?? Infinity;
        return currentTime >= lyric.time && currentTime < nextTime;
    });

    return (
        <Box
            sx={{
                width: '100%',
                height: 880,
                backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker background
                borderRadius: '16px',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box> {/* Metadata Section */}
                    <Typography variant="h6" color="white">Lyric Editor</Typography>
                    {currentTrack && (
                        <Box sx={{ ml: 1, color: 'text.secondary', fontSize: '0.8rem' }}>
                            <Typography variant="body2">Title: {currentTrack.title || 'Unknown'}</Typography>
                            <Typography variant="body2">Artist: {currentTrack.artists || 'Unknown'}</Typography>
                            <Typography variant="body2">Album: {currentTrack.album || 'Unknown'}</Typography>
                        </Box>
                    )}
                </Box>
                <Box>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept=".lrc,.txt"
                    />
                    <Button variant="contained" onClick={handleUploadClick} sx={{ mr: 1 }}>Import Lyrics</Button>
                    <Button variant="contained" onClick={handleExportLrc} sx={{ mr: 1 }}>Export LRC</Button>
                    <Button variant="contained" onClick={handleDiscardLyrics} sx={{ mr: 1 }}>Discard Lyrics</Button>
                    <Button variant="contained" onClick={handleSaveLyrics}>Save Lyrics</Button>
                </Box>
            </Box>

            <Stack sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
                {editedLyrics.map((lyric, index) => {
                    const isPlaying = index === activeIndex;
                    const isEditing = lyric.id === editingLyricId;
                    const isEditingTiming = lyric.id === editingTimingId;

                    return (
                        <Box 
                            key={lyric.id} 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                mb: 1, 
                                p: 1,
                                borderRadius: '4px',
                                backgroundColor: isPlaying ? 'rgba(4, 255, 4, 0.2)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: !isEditing ? 'rgba(255, 255, 0, 0.2)' : undefined,
                                    '.lyric-controls': {
                                        opacity: 1
                                    }
                                },
                                transition: 'background-color 0.3s'
                            }}
                        >
                            {isEditingTiming ? (
                                <TextField
                                    value={tempTimestamp}
                                    onChange={handleTimestampChange}
                                    onBlur={handleTimestampSave}
                                    onKeyDown={handleTimestampKeyDown}
                                    autoFocus
                                    variant="standard"
                                    size="small"
                                    sx={{
                                        width: '80px',
                                        flexShrink: 0,
                                        '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.7)' },
                                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'white' },
                                        input: { color: 'white' }
                                    }}
                                />
                            ) : (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ width: '80px', flexShrink: 0, cursor: 'pointer' }}
                                    onClick={() => handleTimestampClick(lyric)}
                                >
                                    {formatTime(lyric.time)}
                                </Typography>
                            )}
                            
                            {isEditing ? (
                                <TextField
                                    value={tempLyricText}
                                    onChange={handleLyricTextChange}
                                    onBlur={handleLyricTextSave}
                                    onKeyDown={handleLyricTextKeyDown}
                                    autoFocus
                                    fullWidth
                                    variant="standard"
                                    size="small"
                                    sx={{ 
                                        '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.7)' },
                                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'white' },
                                        input: { color: 'white' } 
                                    }}
                                />
                            ) : (
                                <Typography
                                    variant="body1"
                                    color="white"
                                    sx={{ 
                                        flexGrow: 1, 
                                        fontStyle: lyric.text === '<break>' ? 'italic' : 'normal', 
                                        opacity: lyric.text === '<break>' ? 0.6 : 1,
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleLyricTextClick(lyric)}
                                >
                                    {lyric.text}
                                </Typography>
                            )}

                            <Box className="lyric-controls" sx={{ opacity: 0, transition: 'opacity 0.3s', ml: 2 }}>
                                <IconButton size="small" color="success" onClick={() => handleSyncLyric(lyric.id)}>
                                    <CheckIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" color="error" onClick={() => handleDeleteLyric(lyric.id)}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" color="primary" onClick={() => handleAddNewLine(lyric.id, 'up')}>
                                    <ArrowUpwardIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" color="primary" onClick={() => handleAddNewLine(lyric.id, 'down')}>
                                    <ArrowDownwardIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                    );
                })}
            </Stack>
        </Box>
    );
};

export default LyricEditor;

