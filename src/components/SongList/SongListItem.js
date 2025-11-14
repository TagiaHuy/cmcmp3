import React from 'react';
import { 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Stack, 
  Typography,
  Box
} from '@mui/material';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import FavoriteButton from '../Button/Specific/FavoriteButton';
import MoreButton from '../Button/Specific/MoreButton';
import PlayableImage from '../Card/PlayableImage';
import { normalizeArtists } from '../../context/MediaPlayerContext';

const SongListItem = ({ song, index, onPlay, isPlaying }) => {

  // ⭐ Chuẩn hóa artist (phòng BE trả array)
  const artistText = normalizeArtists(song.artists);

  // ⭐ Format track (phòng handlePlay nhận track chưa đúng format)
  const mediaUrl = song.mediaSrc || song.audioUrl;

  return (
    <ListItem
      disablePadding
      secondaryAction={
        <Stack direction="row" spacing={1} alignItems="center">
          <FavoriteButton isFavorite={song.isFavorite} />
          <MoreButton />
        </Stack>
      }
      sx={{
        bgcolor: isPlaying ? 'action.hover' : 'transparent',
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:hover': { bgcolor: 'action.hover' }
      }}
    >
      <ListItemButton onClick={onPlay} sx={{ py: 1.5, pr: '150px' }}>
        
        {/* ======== Cột 1: STT hoặc Icon Đang phát ======== */}
        <Box
          sx={{
            width: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mr: 2
          }}
        >
          {isPlaying ? (
            <GraphicEqIcon color="primary" />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {index + 1}
            </Typography>
          )}
        </Box>

        {/* ======== Cột 2: Ảnh + nút Play hover ======== */}
        <Box sx={{ mr: 2 }}>
          <PlayableImage
            imageUrl={song.imageUrl || ''}
            title={song.title}
            size={48}
            borderRadius="4px"
            mediaSrc={mediaUrl}
            onPlay={onPlay}
          />
        </Box>

        {/* ======== Cột 3: Tên bài hát & Nghệ sĩ ======== */}
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
              {artistText}
            </Typography>
          }
        />

      </ListItemButton>
    </ListItem>
  );
};

export default SongListItem;
