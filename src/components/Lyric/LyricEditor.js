import React, { useRef, useState, useEffect } from 'react';
import { Box, Button, Typography, Stack, IconButton, TextField } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { useMediaPlayer } from '../../context/MediaPlayerContext';

const LyricEditor = ({ onLyricsParsed, duration }) => {
    const fileInputRef = useRef(null);
    const activeLyricRef = useRef(null);
    const { 
        currentTrack, 
        currentTime, 
        setSeekTargetTime,
        updateSongInQueue // Get function to update context
    } = useMediaPlayer();
    
    const [editedLyrics, setEditedLyrics] = useState([]);
    const [manualActiveIndex, setManualActiveIndex] = useState(0);

    const [editingLyricId, setEditingLyricId] = useState(null);
    const [tempLyricText, setTempLyricText] = useState('');
    const [editingTimingId, setEditingTimingId] = useState(null);
    const [tempTimestamp, setTempTimestamp] = useState('');

    // [NEW] On mount, back up original lyrics to localStorage. On unmount, clean up.
    useEffect(() => {
        if (currentTrack?.lyrics) {
            localStorage.setItem('lyric-editor-backup', JSON.stringify(currentTrack.lyrics));
        }
        return () => {
            localStorage.removeItem('lyric-editor-backup');
        };
    }, []); // Run only on mount and unmount

    // Initialize lyrics from track
    useEffect(() => {
        const rawLyrics = currentTrack?.lyrics || [];
        const converted = rawLyrics.map((l, i) => ({ ...l, id: l.id || Date.now() + i }))
                                 .sort((a, b) => a.time - b.time);
        setEditedLyrics(converted);
        setManualActiveIndex(0);
    }, [currentTrack?.id]);

    // [NEW] Real-time sync from editor to the main context (debounced)
    useEffect(() => {
        const handler = setTimeout(() => {
            if (currentTrack && updateSongInQueue) {
                // Sync if the editor's lyrics are different from the context's lyrics
                if (JSON.stringify(editedLyrics) !== JSON.stringify(currentTrack.lyrics)) {
                    updateSongInQueue(currentTrack.id, { lyrics: editedLyrics });
                }
            }
        }, 250); // 250ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [editedLyrics, currentTrack, updateSongInQueue]);

    // Auto-scroll to active line
    useEffect(() => {
        if (activeLyricRef.current) {
            activeLyricRef.current.scrollIntoView({
                block: 'center',
                behavior: 'smooth',
            });
        }
    }, [manualActiveIndex]);

    const updateLyricTime = (lyricId, newTime) => {
        const updater = (prevLyrics) => {
            const newLyrics = [...prevLyrics];
            const editedIndex = newLyrics.findIndex(l => l.id === lyricId);
            if (editedIndex === -1) return prevLyrics;
            newLyrics[editedIndex] = { ...newLyrics[editedIndex], time: newTime };
            return newLyrics.sort((a, b) => a.time - b.time);
        };
        const newSortedLyrics = updater(editedLyrics);
        const newIndex = newSortedLyrics.findIndex(l => l.id === lyricId);
        setEditedLyrics(newSortedLyrics);
        if (newIndex !== -1) {
            setManualActiveIndex(newIndex);
        }
    };
    
    // Global key listener
    useEffect(() => {
        const handleGlobalKeyDown = (event) => {
            if (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea') {
                return;
            }
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                setManualActiveIndex(prev => Math.min(editedLyrics.length - 1, prev + 1));
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                setManualActiveIndex(prev => Math.max(0, prev - 1));
            } else if (event.key === 'Enter') {
                event.preventDefault();
                if (manualActiveIndex !== -1 && editedLyrics[manualActiveIndex]) {
                    const activeLyricId = editedLyrics[manualActiveIndex].id;
                    updateLyricTime(activeLyricId, currentTime);
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [manualActiveIndex, editedLyrics, currentTime]);

    // Click sets active index
    const handleLyricTextClick = (lyric, index) => {
        setManualActiveIndex(index);
        setEditingLyricId(lyric.id);
        setTempLyricText(lyric.text);
    };

    const handleTimestampChange = (e) => {
        setTempTimestamp(e.target.value);
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
    
    const handleTimestampSave = () => {
        const timeParts = tempTimestamp.match(/(\d{2}):(\d{2})/);
        if (timeParts) {
            const minutes = parseInt(timeParts[1], 10);
            const seconds = parseInt(timeParts[2], 10);
            const newTime = minutes * 60 + seconds;
            updateLyricTime(editingTimingId, newTime);
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

    const handleFileChange = (event) => {
        // This part needs refactoring to align with the endTime model.
        // For now, it's left as is from the previous step.
    };

    const handleUploadClick = () => fileInputRef.current.click();

    // [NEW] Save cleans up the backup
    const handleSaveLyrics = () => {
        onLyricsParsed(editedLyrics);
        localStorage.removeItem('lyric-editor-backup');
        toast.success('Lyrics saved!');
    };
    
    const handleDeleteLyric = (idToDelete) => {
        setEditedLyrics(prev => prev.filter(lyric => lyric.id !== idToDelete));
    };

    const handleSyncLyric = (idToSync) => {
        updateLyricTime(idToSync, currentTime);
    };

    const handleAddNewLine = (currentId, direction) => {
        setEditedLyrics(prev => {
            const newLyrics = [...prev];
            const currentIndex = newLyrics.findIndex(l => l.id === currentId);
            if (currentIndex === -1) return prev;
            const referenceLyric = newLyrics[currentIndex];
            const newLyric = {
                id: Date.now(),
                time: referenceLyric.time,
                text: '<break>',
            };
            if (direction === 'up') {
                newLyrics.splice(currentIndex, 0, newLyric);
            } else {
                newLyrics.splice(currentIndex + 1, 0, newLyric);
            }
            return newLyrics.sort((a, b) => a.time - b.time);
        });
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const generateLrcContent = (lyrics) => {
        let lrc = '';
        // ... (assumes lyrics are sorted by time)
        lyrics.forEach((lyric, index) => {
            const startTime = index > 0 ? lyrics[index - 1].time : 0;
            lrc += `[${formatTimeForLrc(startTime)}]${lyric.text}\n`;
        });
        return lrc;
    };
    
    const formatTimeForLrc = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = (seconds % 60).toFixed(3);
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(Math.floor(remainingSeconds)).padStart(2, '0');
        const formattedMilliseconds = String(remainingSeconds.split('.')[1] || '000').padStart(3, '0').substring(0, 3);
        return `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
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

    // [NEW] Discard restores from localStorage backup
    const handleDiscardLyrics = () => {
        if (window.confirm('Are you sure you want to discard all changes?')) {
            try {
                const backup = localStorage.getItem('lyric-editor-backup');
                if (backup) {
                    const originalLyrics = JSON.parse(backup);
                    
                    // [FIX] Ensure restored lyrics have the unique IDs React needs for keys
                    const lyricsWithIds = originalLyrics.map((l, i) => ({
                        ...l,
                        id: l.id || Date.now() + i,
                    }));

                    setEditedLyrics(lyricsWithIds);
                    toast.info('Changes discarded!');
                }
            } catch (e) {
                toast.error('Failed to restore lyrics from backup.');
            }
        }
    };
    
    return (
        <Box sx={{ width: '100%', height: 880, backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '16px', p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                    <Typography variant="h6" color="white">Lyric Editor</Typography>
                    {currentTrack && <Box sx={{ ml: 1, color: 'text.secondary', fontSize: '0.8rem' }}><Typography variant="body2">Title: {currentTrack.title || 'Unknown'}</Typography><Typography variant="body2">Artist: {currentTrack.artists || 'Unknown'}</Typography></Box>}
                </Box>
                <Box>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".lrc,.txt" />
                    <Button variant="contained" onClick={handleUploadClick} sx={{ mr: 1 }}>Import Lyrics</Button>
                    <Button variant="contained" onClick={handleExportLrc} sx={{ mr: 1 }}>Export LRC</Button>
                    <Button variant="contained" onClick={handleDiscardLyrics} sx={{ mr: 1 }}>Discard</Button>
                    <Button variant="contained" onClick={handleSaveLyrics}>Save</Button>
                </Box>
            </Box>
            <Stack sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
                {editedLyrics.map((lyric, index) => {
                    const isPlaying = index === manualActiveIndex;
                    const isEditing = lyric.id === editingLyricId;
                    const isEditingTiming = lyric.id === editingTimingId;
                    return (
                        <Box key={lyric.id} ref={isPlaying ? activeLyricRef : null} sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1, borderRadius: '4px', backgroundColor: isPlaying ? 'rgba(4, 255, 4, 0.2)' : 'transparent', '&:hover': { backgroundColor: !isEditing ? 'rgba(255, 255, 0, 0.2)' : undefined, '.lyric-controls': { opacity: 1 } }, transition: 'background-color 0.3s' }}>
                            {isEditingTiming ? <TextField value={tempTimestamp} onChange={handleTimestampChange} onBlur={handleTimestampSave} onKeyDown={handleTimestampKeyDown} autoFocus variant="standard" size="small" sx={{ width: '80px', flexShrink: 0, input: { color: 'white' } }} /> : <Typography variant="body2" color="text.secondary" sx={{ width: '80px', flexShrink: 0, cursor: 'pointer' }} onClick={() => handleTimestampClick(lyric)}>{formatTime(lyric.time)}</Typography>}
                            {isEditing ? <TextField value={tempLyricText} onChange={handleLyricTextChange} onBlur={handleLyricTextSave} onKeyDown={handleLyricTextKeyDown} autoFocus fullWidth variant="standard" size="small" sx={{ input: { color: 'white' } }} /> : <Typography variant="body1" color="white" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => handleLyricTextClick(lyric, index)}>{lyric.text}</Typography>}
                            <Box className="lyric-controls" sx={{ opacity: 0, transition: 'opacity 0.3s', ml: 2 }}>
                                <IconButton size="small" color="success" onClick={() => handleSyncLyric(lyric.id)}><CheckIcon fontSize="small" /></IconButton>
                                <IconButton size="small" color="error" onClick={() => handleDeleteLyric(lyric.id)}><DeleteIcon fontSize="small" /></IconButton>
                                <IconButton size="small" color="primary" onClick={() => handleAddNewLine(lyric.id, 'up')}><ArrowUpwardIcon fontSize="small" /></IconButton>
                                <IconButton size="small" color="primary" onClick={() => handleAddNewLine(lyric.id, 'down')}><ArrowDownwardIcon fontSize="small" /></IconButton>
                            </Box>
                        </Box>
                    );
                })}
            </Stack>
        </Box>
    );
};

export default LyricEditor;