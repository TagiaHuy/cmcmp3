import React from 'react';
import { Box, Slide } from '@mui/material';
import { useMediaPlayer } from '../../context/MediaPlayerContext';
import LyricsDisplay from './LyricsDisplay';

const LyricsModal = () => {
    const { isLyricsVisible, currentTrack, currentTime, mediaPlayerHeight } = useMediaPlayer();

    return (
        <Slide direction="up" in={isLyricsVisible} mountOnEnter unmountOnExit>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: mediaPlayerHeight,
                    left: 0,
                    width: '100%',
                    height: `calc(100vh - ${mediaPlayerHeight}px)`,

                    // 🌈 Gradient + Blur giống hình
                    background: `
                        radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15), rgba(0,0,0,0) 70%),
                        linear-gradient(135deg, #3e1f6d 0%, #1b1032 100%)
                    `,
                    backdropFilter: 'blur(20px)',

                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',

                    px: 6,
                    zIndex: (t) => t.zIndex.modal + 10,
                }}
            >
                {/* LEFT — Album artwork */}
                <Box
                    sx={{
                        flex: '0 0 380px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mr: 6,
                    }}
                >
                    <img
                        src={currentTrack?.imageUrl}
                        alt="Artwork"
                        style={{
                            width: '380px',
                            height: '380px',
                            borderRadius: '12px',
                            objectFit: 'cover',
                            boxShadow: '0 12px 35px rgba(0,0,0,0.45)',
                        }}
                    />
                </Box>

                {/* RIGHT — Lyrics */}
                <Box
                    sx={{
                        flex: 1,
                        maxHeight: '75vh',
                        overflowY: 'auto',
                        pr: 4,
                        '&::-webkit-scrollbar': { width: '8px' },
                        '&::-webkit-scrollbar-thumb': {
                            background: 'rgba(255,255,255,0.25)',
                            borderRadius: '10px',
                        },
                    }}
                >
                    <LyricsDisplay
                        songId={currentTrack?.id}
                        lyrics={currentTrack?.lyrics}
                        currentTime={currentTime}
                        imageUrl={null} // ❗ Không lặp lại ảnh bên phải nữa
                    />
                </Box>
            </Box>
        </Slide>
    );
};

export default LyricsModal;
