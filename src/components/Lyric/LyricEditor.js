import React, { useRef, useState, useEffect } from 'react';
import { Box, Button, Typography, Stack, IconButton, TextField } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { useMediaPlayer } from '../../context/MediaPlayerContext';

const formatTime = (seconds) => {
    if (typeof seconds !== 'number' || isNaN(seconds)) {
        seconds = 0;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const SortableLyricItem = (props) => {
    const {
        lyric,
        index,
        onTimestampClick,
        onLyricTextClick,
        onSyncLyric,
        onDeleteLyric,
        onAddNewLine,
        isPlaying,
        isEditing,
        isEditingTiming,
        tempTimestamp,
        onTimestampChange,
        onTimestampSave,
        onTimestampKeyDown,
        tempLyricText,
        onLyricTextChange,
        onLyricTextSave,
        onLyricTextKeyDown,
        activeLyricRef
    } = props;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: lyric.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isEditing ? 0.5 : 1, // Example of style change on drag
    };

    return (
        <Box
            ref={(node) => {
                setNodeRef(node);
                if (isPlaying) {
                    activeLyricRef.current = node;
                }
            }}
            style={style}
            {...attributes}
            sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1, borderRadius: '4px', backgroundColor: isPlaying ? 'rgba(4, 255, 4, 0.2)' : 'transparent', '&:hover': { backgroundColor: !isEditing ? 'rgba(255, 255, 0, 0.2)' : undefined, '.lyric-controls': { opacity: 1 } }, transition: 'background-color 0.3s' }}
        >
            <Box {...listeners} sx={{ cursor: 'grab', display: 'flex', alignItems: 'center', mr: 1 }}>
                <DragIndicatorIcon sx={{ color: 'white' }} />
            </Box>
            {isEditingTiming ? (
                <TextField value={tempTimestamp} onChange={onTimestampChange} onBlur={onTimestampSave} onKeyDown={onTimestampKeyDown} autoFocus variant="standard" size="small" sx={{ width: '80px', flexShrink: 0, input: { color: 'white' } }} />
            ) : (
                <Typography variant="body2" color="text.secondary" sx={{ width: '80px', flexShrink: 0, cursor: 'pointer' }} onClick={() => onTimestampClick(lyric)}>{formatTime(lyric.time)}</Typography>
            )}
            {isEditing ? (
                <TextField value={tempLyricText} onChange={onLyricTextChange} onBlur={onLyricTextSave} onKeyDown={onLyricTextKeyDown} autoFocus fullWidth variant="standard" size="small" sx={{ input: { color: 'white' } }} />
            ) : (
                <Typography variant="body1" color="white" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => onLyricTextClick(lyric, index)}>{lyric.text}</Typography>
            )}
            <Box className="lyric-controls" sx={{ opacity: 0, transition: 'opacity 0.3s', ml: 2 }}>
                <IconButton size="small" color="success" onClick={() => onSyncLyric(lyric.id)}><CheckIcon fontSize="small" /></IconButton>
                <IconButton size="small" color="error" onClick={() => onDeleteLyric(lyric.id)}><DeleteIcon fontSize="small" /></IconButton>
                <IconButton size="small" color="primary" onClick={() => onAddNewLine(lyric.id, 'up')}><ArrowUpwardIcon fontSize="small" /></IconButton>
                <IconButton size="small" color="primary" onClick={() => onAddNewLine(lyric.id, 'down')}><ArrowDownwardIcon fontSize="small" /></IconButton>
            </Box>
        </Box>
    );
};


const LyricEditor = ({ onLyricsParsed, duration, toggleLyricsEditor }) => {
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
    const [activeDragId, setActiveDragId] = useState(null);


    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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
        let rawLyrics = currentTrack?.lyrics || [];
        let converted = rawLyrics.map((l, i) => ({ ...l, id: l.id || Date.now() + i }));

        if (converted.length === 0) {
            converted.push({ id: Date.now(), time: 0, text: '<break>' }); // Add an empty line
        }
                                 
        converted.sort((a, b) => a.time - b.time); // Sort after adding default
        
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
            return newLyrics;
        };
        const newLyrics = updater(editedLyrics);
        const newIndex = newLyrics.findIndex(l => l.id === lyricId);
        setEditedLyrics(newLyrics);
        if (newIndex !== -1) {
            setManualActiveIndex(newIndex);
        }
    };
    
    // Global key listener
    useEffect(() => {
        const handleGlobalKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                toggleLyricsEditor();
            }
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
    }, [manualActiveIndex, editedLyrics, currentTime, toggleLyricsEditor]);

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
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            let parsedLyrics = [];

            if (file.name.endsWith('.lrc')) {
                const lines = content.split('\n');
                lines.forEach(line => {
                    const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
                    if (match) {
                        const minutes = parseInt(match[1], 10);
                        const seconds = parseInt(match[2], 10);
                        const milliseconds = parseInt(match[3].padEnd(3, '0'), 10); // Pad to 3 digits for consistency
                        const time = minutes * 60 + seconds + milliseconds / 1000;
                        const text = match[4].trim();
                        if (text) {
                            parsedLyrics.push({ id: Date.now() + Math.random(), time, text });
                        }
                    }
                });
            } else if (file.name.endsWith('.txt')) {
                const lines = content.split('\n');
                parsedLyrics = lines.map((line, index) => ({
                    id: Date.now() + index,
                    time: 0, // Default time, user can sync it
                    text: line.trim(),
                })).filter(lyric => lyric.text);
            } else {
                toast.error('Unsupported file type. Please upload a .lrc or .txt file.');
                return;
            }

            setEditedLyrics(parsedLyrics.sort((a, b) => a.time - b.time));
            toast.success('Lyrics imported successfully!');
        };

        reader.onerror = () => {
            toast.error('Failed to read file.');
        };

        reader.readAsText(file);
        
        // Reset file input so user can upload the same file again
        event.target.value = null;
    };

    const handleUploadClick = () => fileInputRef.current.click();

    // [NEW] Save cleans up the backup
    const handleSaveLyrics = () => {
        onLyricsParsed(editedLyrics);
        localStorage.removeItem('lyric-editor-backup');
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
            return newLyrics;
        });
    };

    function handleDragEnd(event) {
        const {active, over} = event;
        
        if (active.id !== over.id) {
          setEditedLyrics((items) => {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);
            
            return arrayMove(items, oldIndex, newIndex);
          });
        }

        setActiveDragId(null);
    }

    function handleDragStart(event) {
        setActiveDragId(event.active.id);
    }

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
                    <Typography variant="h6" color="white"> Lyric Editor</Typography>
                    {currentTrack && <Box sx={{ ml: 1, color: 'text.secondary', fontSize: '0.8rem' }}><Typography variant="body2">Title: {currentTrack.title || 'Unknown'}</Typography><Typography variant="body2">Artist: {currentTrack.artists || 'Unknown'}</Typography></Box>}
                </Box>
                <Box>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".lrc,.txt" />
                    <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={handleUploadClick} sx={{ mr: 1 }}>Import Lyrics</Button>
                    <Button variant="contained" startIcon={<CloudDownloadIcon />} onClick={handleExportLrc} sx={{ mr: 1 }}>Export LRC</Button>
                    <Button variant="contained" startIcon={<RemoveCircleOutlineIcon />} onClick={handleDiscardLyrics} sx={{ mr: 1, backgroundColor: 'rgba(165, 91, 73, 1)' }}>Discard</Button>
                    <Button variant="contained" color="success" startIcon={<SaveIcon />} onClick={handleSaveLyrics}>Save</Button>
                    <Button  startIcon={<CloseIcon />} onClick={toggleLyricsEditor} sx={{ ml: 1 }}></Button>
                </Box>
            </Box>
            <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext 
                    items={editedLyrics}
                    strategy={verticalListSortingStrategy}
                >
                    <Stack sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
                        {editedLyrics.map((lyric, index) => {
                            const isPlaying = index === manualActiveIndex;
                            const isEditing = lyric.id === editingLyricId;
                            const isEditingTiming = lyric.id === editingTimingId;

                            return (
                                <SortableLyricItem
                                    key={lyric.id}
                                    id={lyric.id}
                                    lyric={lyric}
                                    index={index}
                                    isPlaying={isPlaying}
                                    isEditing={isEditing || activeDragId === lyric.id}
                                    isEditingTiming={isEditingTiming}
                                    tempTimestamp={tempTimestamp}
                                    onTimestampChange={handleTimestampChange}
                                    onTimestampSave={handleTimestampSave}
                                    onTimestampKeyDown={handleTimestampKeyDown}
                                    tempLyricText={tempLyricText}
                                    onLyricTextChange={handleLyricTextChange}
                                    onLyricTextSave={handleLyricTextSave}
                                    onLyricTextKeyDown={handleLyricTextKeyDown}
                                    onTimestampClick={handleTimestampClick}
                                    onLyricTextClick={handleLyricTextClick}
                                    onSyncLyric={handleSyncLyric}
                                    onDeleteLyric={handleDeleteLyric}
                                    onAddNewLine={handleAddNewLine}
                                    activeLyricRef={activeLyricRef}
                                />
                            )
                        })}
                    </Stack>
                </SortableContext>
            </DndContext>
        </Box>
    );
};

export default LyricEditor;
