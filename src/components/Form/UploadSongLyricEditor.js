// src/components/Form/UploadSongLyricEditor.js
import React, { useState, useEffect } from 'react';
import { Box, TextareaAutosize, Button, CircularProgress, Typography } from '@mui/material';
import useSong from '../../hooks/useSong';

/**
 * Converts an array of lyric objects into a string format [mm:ss.xx] text.
 * @param {Array<Object>} lyrics - The lyrics array, e.g., [{ time: 61.5, text: 'Hello' }]
 * @returns {string} - The formatted string.
 */
const lyricsToString = (lyrics) => {
    if (!lyrics || lyrics.length === 0) {
        return '';
    }
    return lyrics
        .map(line => {
            const minutes = Math.floor(line.time / 60).toString().padStart(2, '0');
            const seconds = (line.time % 60).toFixed(2).padStart(5, '0');
            return `[${minutes}:${seconds}] ${line.text}`;
        })
        .join('\n');
};

/**
 * Converts a string [mm:ss.xx] text into an array of lyric objects.
 * @param {string} lyricString - The string to parse.
 * @returns {Array<Object>} - The array of lyric objects.
 */
const stringToLyrics = (lyricString) => {
    return lyricString
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('[') && line.includes(']'))
        .map(line => {
            const timeMatch = line.match(/\[(\d{2}):(\d{2}\.\d{2})\]/);
            if (!timeMatch) return null;

            const minutes = parseInt(timeMatch[1], 10);
            const seconds = parseFloat(timeMatch[2]);
            const time = minutes * 60 + seconds;
            const text = line.substring(line.indexOf(']') + 1).trim();

            return { time, text };
        })
        .filter(Boolean); // Remove any null entries
};

const UploadSongLyricEditor = ({ songId }) => {
    const { song, loading: songLoading, error: songError, updateLyrics } = useSong(songId);
    const [lyricText, setLyricText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        if (song && song.lyrics) {
            setLyricText(lyricsToString(song.lyrics));
        }
    }, [song]);

    const handleSave = async () => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const newLyrics = stringToLyrics(lyricText);
            await updateLyrics(newLyrics);
            // Optionally, show a success message
        } catch (err) {
            setSubmitError(err.message || 'Failed to update lyrics.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Edit lyrics in the format: [mm:ss.xx] lyric text
            </Typography>
            <TextareaAutosize
                value={lyricText}
                onChange={(e) => setLyricText(e.target.value)}
                minRows={15}
                style={{
                    width: '100%',
                    background: '#222',
                    color: '#fff',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    padding: '10px',
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                }}
            />
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
