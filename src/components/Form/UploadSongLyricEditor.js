import React, { useState, useEffect } from 'react';
import {
    Box, Button, CircularProgress, Typography, Table, TableBody, TableHead, TableRow, TableCell, Paper
} from '@mui/material';
import useSong from '../../hooks/useSong';
import { useMediaPlayer } from '../../context/MediaPlayerContext';
import LyricRow from './LyricRow';
import { v4 as uuidv4 } from 'uuid';

const UploadSongLyricEditor = ({ songId }) => {
    const { song, loading: songLoading, error: songError, updateLyrics } = useSong(songId);
    const { currentTime } = useMediaPlayer();
    const [lyrics, setLyrics] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        if (song && song.lyrics) {
            // Add a unique id to each lyric line for keying and state updates
            setLyrics(song.lyrics.map(lyric => ({ ...lyric, id: uuidv4() })));
        }
    }, [song]);

    const handleLyricChange = (id, newText) => {
        setLyrics(lyrics.map(lyric => lyric.id === id ? { ...lyric, text: newText } : lyric));
    };

    const handleTimeChange = (id, newTime) => {
        setLyrics(lyrics.map(lyric => lyric.id === id ? { ...lyric, time: newTime } : lyric));
    };

    const handleSetCurrentTime = (id) => {
        setLyrics(lyrics.map(lyric => lyric.id === id ? { ...lyric, time: currentTime } : lyric));
    };

    const handleClearTime = (id) => {
        setLyrics(lyrics.map(lyric => lyric.id === id ? { ...lyric, time: null } : lyric));
    };

    const handleDistributeTime = (id) => {
        const clickedIndex = lyrics.findIndex(lyric => lyric.id === id);
        if (clickedIndex === -1) return;

        let startIndex = -1;
        for (let i = clickedIndex - 1; i >= 0; i--) {
            if (lyrics[i].time !== null && lyrics[i].time !== undefined) {
                startIndex = i;
                break;
            }
        }

        let endIndex = -1;
        for (let i = clickedIndex + 1; i < lyrics.length; i++) {
            if (lyrics[i].time !== null && lyrics[i].time !== undefined) {
                endIndex = i;
                break;
            }
        }

        if (startIndex !== -1 && endIndex !== -1) {
            const startTime = lyrics[startIndex].time;
            const endTime = lyrics[endIndex].time;
            const intervals = endIndex - startIndex;
            const timeStep = (endTime - startTime) / intervals;

            setLyrics(currentLyrics => {
                const newLyrics = [...currentLyrics];
                for (let i = startIndex + 1; i < endIndex; i++) {
                    newLyrics[i].time = startTime + ((i - startIndex) * timeStep);
                }
                return newLyrics;
            });
        }
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            // Remove the temporary id before sending to the server
            const lyricsToSave = lyrics.map(({ id, ...rest }) => rest);
            await updateLyrics(lyricsToSave);
        } catch (err) {
            setSubmitError(err.message || 'Failed to update lyrics.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Find the active lyric line
    const activeLyricIndex = lyrics.findIndex((lyric, index) => {
        const nextLyric = lyrics[index + 1];
        return lyric.time <= currentTime && (!nextLyric || nextLyric.time > currentTime);
    });

    if (songLoading) {
        return <CircularProgress />;
    }

    if (songError) {
        return <Typography color="error">Error loading song: {songError.message}</Typography>;
    }

    return (
        <Box sx={{ p: 2, border: '1px solid #444', borderRadius: '8px' }}>
            <Typography variant="h6" gutterBottom>
                Lyric Editor
            </Typography>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Lyric</TableCell>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lyrics.map((lyric, index) => (
                            <LyricRow
                                key={lyric.id}
                                lyric={lyric}
                                onLyricChange={handleLyricChange}
                                onTimeChange={handleTimeChange}
                                onSetCurrentTime={handleSetCurrentTime}
                                onClearTime={handleClearTime}
                                onDistributeTime={handleDistributeTime}
                                isActive={index === activeLyricIndex}
                            />
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                {submitError && <Typography color="error" sx={{ mr: 2 }}>{submitError}</Typography>}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <CircularProgress size={24} /> : 'Save Lyrics'}
                </Button>
            </Box>
        </Box>
    );
};

export default UploadSongLyricEditor;