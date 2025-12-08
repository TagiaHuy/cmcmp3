import React, { useRef, useEffect } from "react";
import {
    Box,
    Typography,
    IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaPlayer } from "../../context/MediaPlayerContext";

const LyricsDisplay = ({ songId, lyrics, currentTime }) => {
    const theme = useTheme();
    const { toggleLyricsEditor } = useMediaPlayer();

    const containerRef = useRef(null);
    const lyricRefs = useRef([]);

    /** =============================
     *  AUTO-CENTER ACTIVE LYRIC
     * ============================== */
    useEffect(() => {
        if (!lyrics || lyrics.length === 0) return;
        // No longer checking isEditorOpen as the modal is removed
        // if (isEditorOpen) return;

        const activeIndex = lyrics.findIndex((lyric, i) => {
            const nextTime = lyrics[i + 1]?.time ?? Infinity;
            return currentTime >= lyric.time && currentTime < nextTime;
        });

        const container = containerRef.current;
        const activeEl = lyricRefs.current[activeIndex];

        if (container && activeEl) {
            const containerCenter = container.clientHeight / 2;
            const elementOffset = activeEl.offsetTop + activeEl.offsetHeight / 2;

            const newScroll = elementOffset - containerCenter;

            container.scrollTo({
                top: newScroll,
                behavior: "smooth",
            });
        }
    }, [currentTime, lyrics]); // Removed isEditorOpen from dependencies

    // handleOpenEditor and handleCloseEditor are no longer needed

    /** =============================
     *  NO LYRICS UI
     * ============================== */
    if (!lyrics || lyrics.length === 0) {
        return (
            <Box
                sx={{
                    mt: 2,
                    p: 2,
                    textAlign: "center",
                    color: theme.palette.text.secondary,
                    position: "relative"
                }}
            >
                <Typography variant="h5">No lyrics available.</Typography>
            </Box>
        );
    }

    /** =============================
     *  MAIN LYRIC DISPLAY
     * ============================== */
    return (
        <Box
            ref={containerRef}
            sx={{
                marginTop: 20,
                width: "100%",
                height: "80vh",
                overflowY: "auto",
                overflowX: "hidden",
                pr: 2,

                // Giữ vị trí when few lines → center vertically
                display: "flex",
                flexDirection: "column",
                justifyContent: lyrics.length < 6 ? "center" : "flex-start",

                position: "relative",

                "&::-webkit-scrollbar": {
                    width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "rgba(255,255,255,0.25)",
                    borderRadius: "10px",
                }
            }}
        >
            {lyrics.map((lyric, index) => {
                const isActive =
                    currentTime >= lyric.time &&
                    (lyrics[index + 1] ? currentTime < lyrics[index + 1].time : true);

                return (
                    <Typography
                        key={index}
                        ref={(el) => (lyricRefs.current[index] = el)}
                        variant="h4"
                        sx={{
                            fontWeight: isActive ? 700 : 400,
                            opacity: isActive ? 1 : 0.35,
                            color: "white",

                            textAlign: "center",   // ⬅ CANH GIỮA NGANG
                            my: 3,

                            lineHeight: 1.3,
                            transition: "all 0.35s ease",

                            // ACTIVE LINE EFFECT
                            transform: isActive ? "scale(1.15)" : "scale(1)",
                            textShadow: isActive
                                ? "0px 0px 25px rgba(255,255,255,0.4)"
                                : "none",
                        }}
                    >
                        {lyric.text}
                    </Typography>
                );
            })}
        </Box>
    );
};

export default LyricsDisplay;
