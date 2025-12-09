import React from 'react';
import { Box, Slide, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useMediaPlayer } from '../../context/MediaPlayerContext';
import LyricsDisplay from './LyricsDisplay';
import LyricEditor from './LyricEditor';

const LyricsModal = ({ isEditingLyrics, onLyricsParsed, duration }) => {
    const { isLyricsVisible, currentTrack, currentTime, mediaPlayerHeight, toggleLyricsEditor } = useMediaPlayer();

    return (
        <Slide direction="up" in={isLyricsVisible} mountOnEnter unmountOnExit>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: mediaPlayerHeight,
                    left: 0,
                    width: '100%',
                    height: `calc(100vh - ${mediaPlayerHeight}px)`,

                    // Mềm hơn và dễ nhìn hơn
                    background: `
                        radial-gradient(circle at 30% 20%, rgba(255,255,255,0.12), rgba(0,0,0,0) 70%),
                        linear-gradient(135deg, #432b79 0%, #1b1032 100%)
                    `,
                    backdropFilter: 'blur(22px)',

                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',

                    px: 6,
                    zIndex: (t) => t.zIndex.modal + 20,
                }}
            >
                {/* LEFT — Artwork */}
                <Box
                    sx={{
                        flex: isEditingLyrics ? '0 0 1200px' : '0 0 520px',
                        transition: 'flex 0.3s ease-in-out',
                        display: 'flex',
                        flexDirection: 'column', // Changed to column
                        justifyContent: 'center',
                        alignItems: 'center',
                        mr: 6,
                    }}
                >
                    {isEditingLyrics ? (
                        <LyricEditor onLyricsParsed={onLyricsParsed} duration={duration} toggleLyricsEditor={toggleLyricsEditor} />
                    ) : (
                        <>
                            <img
                                src={currentTrack?.imageUrl}
                                alt="Artwork"
                                style={{
                                    width: '320px',
                                    height: '320px',
                                    borderRadius: '16px',
                                    objectFit: 'cover',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.55)',
                                }}
                            />
                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                onClick={toggleLyricsEditor}
                                sx={{ mt: 2 }}
                            >
                                Edit Lyrics
                            </Button>
                        </>
                    )}
                </Box>

                {/* RIGHT — Lyrics Center UI */}
                <Box
                    sx={{
                        flex: 1,
                        height: '80vh',

                        display: 'flex',
                        justifyContent: 'center',

                        // Để lyrics được nằm chính giữa khi ít text
                        alignItems: 'center',

                        overflowY: 'auto',
                        pr: 4,
                        '&::-webkit-scrollbar': { width: '8px' },
                        '&::-webkit-scrollbar-thumb': {
                            background: 'rgba(255,255,255,0.25)',
                            borderRadius: '10px',
                        },
                    }}
                >
                    {/* Wrapping layer để giữ center khi lyrics ít */}
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <LyricsDisplay
                            songId={currentTrack?.id}
                            lyrics={currentTrack?.lyrics}
                            currentTime={currentTime}

                            // Không cần ảnh trong lyrics
                            imageUrl={null}
                        />
                    </Box>
                </Box>
            </Box>
        </Slide>
    );
};

export default LyricsModal;
