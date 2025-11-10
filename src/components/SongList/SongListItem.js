import React from 'react';
import { 
  ListItem, 
  ListItemButton, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Stack, 
  Typography 
} from '@mui/material';
import GraphicEqIcon from '@mui/icons-material/GraphicEq'; // Icon hiển thị đang phát
import Box from '@mui/material/Box';
import FavoriteButton from '../Button/Specific/FavoriteButton';
import MoreButton from '../Button/Specific/MoreButton';

const SongListItem = ({ song, index, onPlay, isPlaying }) => {

  // Giả định hàm chuyển đổi thời lượng (ví dụ: 240 -> 4:00)
  const formatDuration = (seconds) => {
    // Logic chuyển đổi
    return "4:00"; // Thay thế bằng logic thực tế
  };

  return (
    <ListItem
      disablePadding
      secondaryAction={
        // Gom nhóm các nút phụ vào đây
        <Stack direction="row" spacing={1} alignItems="center">
          {/* Nút Like */}
          <FavoriteButton isFavorite={song.isFavorite} />
          
          {/* Thời lượng bài hát */}
          {/* <Typography variant="caption" color="text.secondary" sx={{ minWidth: 40, textAlign: 'right' }}>
            {formatDuration(song.duration)}
          </Typography> */}

          {/* Nút More */}
          <MoreButton />
        </Stack>
      }
      // Highlight bài hát đang phát
      sx={{ 
        bgcolor: isPlaying ? 'action.hover' : 'transparent', // Màu nền nhẹ khi đang phát
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          bgcolor: 'action.hover',
        }
      }}
    >
      <ListItemButton onClick={onPlay} sx={{ py: 1.5 }}>
        
        {/* Cột 1: STT / Icon Play / Icon Đang phát */}
        <Box sx={{ width: 40, textAlign: 'center', mr: 2 }}>
          {isPlaying ? (
            <GraphicEqIcon color="primary" sx={{ animation: 'pulse 1s infinite' }} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {index + 1}
            </Typography>
          )}
        </Box>

        {/* Cột 2: Ảnh (Avatar) */}
        <ListItemAvatar sx={{ minWidth: 0, mr: 2 }}>
          <Avatar 
            alt={song.title} 
            src={song.imageUrl} 
            variant="rounded" 
            sx={{ width: 48, height: 48 }}
          />
        </ListItemAvatar>

        {/* Cột 3: Tên bài hát & Nghệ sĩ */}
        <ListItemText
          primary={
            <Typography 
              variant="subtitle1" 
              fontWeight={isPlaying ? 600 : 500}
              color={isPlaying ? 'primary' : 'text.primary'}
              noWrap
            >
              {song.title}
            </Typography>
          }
          secondary={
            <Typography variant="body2" color="text.secondary" noWrap>
              {song.artists}
            </Typography>
          }
        />
        
      </ListItemButton>
    </ListItem>
  );
};

export default SongListItem;