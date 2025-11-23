import React, { useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const LyricsDisplay = ({ lyrics, currentTime }) => {
    const theme = useTheme();

    const containerRef = useRef(null);
    const lyricRefs = useRef([]);

    // Auto-scroll & auto-center the active line
    useEffect(() => {
        if (!lyrics || lyrics.length === 0) return;

        const activeIndex = lyrics.findIndex((lyric, i) => {
            const nextTime = lyrics[i + 1]?.time ?? Infinity;
            return currentTime >= lyric.time && currentTime < nextTime;
        });

        const container = containerRef.current;
        const activeEl = lyricRefs.current[activeIndex];

        if (container && activeEl) {
            const containerCenter = container.clientHeight / 2;
            const elTop = activeEl.offsetTop;
            const elHeight = activeEl.offsetHeight;

            const newScroll = elTop - containerCenter + elHeight / 2;

            container.scrollTo({
                top: newScroll,
                behavior: "smooth",
            });
        }
    }, [currentTime, lyrics]);

    if (!lyrics || lyrics.length === 0) {
        return (
            <Box sx={{ mt: 2, p: 2, textAlign: "center", color: theme.palette.text.secondary }}>
                <Typography variant="h5">No lyrics available.</Typography>
            </Box>
        );
    }

    return (
        <Box
            ref={containerRef}
            sx={{
                width: "100%",
                height: "75vh",
                overflowY: "auto",
                pr: 2,
                position: "relative",

                "&::-webkit-scrollbar": {
                    width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "rgba(255,255,255,0.25)",
                    borderRadius: "10px",
                },
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
                        variant="h3"
                        sx={{
                            fontWeight: isActive ? 700 : 400,
                            opacity: isActive ? 1 : 0.35,
                            color: "white",
                            my: 3,
                            transition: "all 0.4s ease",
                            textAlign: "left",
                            lineHeight: 1.3,
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
