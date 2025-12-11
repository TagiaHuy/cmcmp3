import React from 'react';
import { Box, Typography } from '@mui/material';
import HomeAlbumListItem from './HomeAlbumListItem';
import { useNotifications } from '../../hooks/useNotifications'; // Assuming notifications are needed for actions

const HomeAlbumList = ({ albums, renderActions }) => {
  const { notifyError } = useNotifications(); // for error handling if any

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

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        gap: 3,
        transition: 'gap .3s ease',
        willChange: 'gap',
        overflowX: 'auto',
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': { height: 6 },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(127,127,127,.35)',
          borderRadius: 4,
        },
        minWidth: 'min(100%, 6 * 160px + 5 * 24px)', // Adjust as needed
        py: 1, // Padding vertical for scrollbar
      }}
    >
      {albums.map((album, index) => (
        <Box
            key={album.id || index}
            sx={{
              width: 160,
              flex: '0 0 160px',
              transition: 'transform .3s ease',
            }}
          >
            <HomeAlbumListItem
              album={album}
            />
        </Box>
      ))}
    </Box>
  );
};

export default HomeAlbumList;