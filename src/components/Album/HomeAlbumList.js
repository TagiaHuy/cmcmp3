import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography, IconButton, useMediaQuery } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import HomeAlbumListItem from './HomeAlbumListItem';

const ITEM_WIDTH = 160;
const GAP_WIDTH = 60; // giống Nghe gần đây

const HomeAlbumList = ({ albums }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // responsive
  const is2033 = useMediaQuery('(min-width:2033px)');
  const is1644 = useMediaQuery('(min-width:1644px)');
  const is1265 = useMediaQuery('(min-width:1265px)');
  const is900  = useMediaQuery('(min-width:900px)');

  const itemsToShow = useMemo(() => {
    if (is2033) return 7;
    if (is1644) return 6;
    if (is1265) return 5;
    if (is900)  return 4;
    return 2;
  }, [is2033, is1644, is1265, is900]);

  const total = albums?.length || 0;
  const maxIndex = Math.max(0, total - itemsToShow);

  useEffect(() => {
    setCurrentIndex(prev => Math.min(prev, maxIndex));
  }, [maxIndex]);

  if (!albums || albums.length === 0) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center', py: 3 }}
      >
        Bạn chưa có album nào. Hãy tạo một cái mới!
      </Typography>
    );
  }

  const stepPx = ITEM_WIDTH + GAP_WIDTH;

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + itemsToShow, maxIndex));
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(prev - itemsToShow, 0));
  };

  const showPrev = currentIndex > 0;
  const showNext = currentIndex < maxIndex;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {/* NÚT TRÁI (ngoài ảnh) */}
      <Box sx={{ width: 40, textAlign: 'center' }}>
        {showPrev && (
          <IconButton
            onClick={handlePrevious}
            sx={{
              color: 'text.primary',
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* DANH SÁCH ALBUM */}
      <Box sx={{ overflow: 'hidden', flex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            gap: `${GAP_WIDTH}px`,
            transform: `translateX(-${currentIndex * stepPx}px)`,
            transition: 'transform 0.4s ease',
            py: 1.5,
            width: `${total * stepPx}px`,
          }}
        >
          {albums.map(album => (
            <Box
              key={album.id}
              sx={{
                width: ITEM_WIDTH,
                flex: `0 0 ${ITEM_WIDTH}px`,
              }}
            >
              <HomeAlbumListItem album={album} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* NÚT PHẢI (ngoài ảnh) */}
      <Box sx={{ width: 40, textAlign: 'center' }}>
        {showNext && (
          <IconButton
            onClick={handleNext}
            sx={{
              color: 'text.primary',
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default HomeAlbumList;
