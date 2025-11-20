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
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SongListItem = ({ song, index, onPlay, isPlaying, renderActions }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  // ⭐ Chuẩn hóa artist (phòng BE trả array)
  const artistText = normalizeArtists(song.artists);

  // ⭐ Format track (phòng handlePlay nhận track chưa đúng format)
  const mediaUrl = song.mediaSrc || song.audioUrl;

  const handleItemClick = () => {
    navigate(`/songs/${song.id}`); // Navigate to song detail page
  };

  const defaultActions = (
    <Stack direction="row" spacing={1} alignItems="center">
      <FavoriteButton songId={song.id} isFavorite={song.isFavorite} />
      <MoreButton />
    </Stack>
  );

  const actions = typeof renderActions === 'function'
    ? renderActions(song, defaultActions)
    : defaultActions;

  return (
    <ListItem
      disablePadding
      secondaryAction={actions}
      sx={{
        bgcolor: isPlaying ? 'action.hover' : 'transparent',
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:hover': { bgcolor: 'action.hover' }
      }}
    >
      <ListItemButton onClick={handleItemClick} sx={{ py: 1.5, pr: '150px' }}> {/* Use handleItemClick for navigation */}
        
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
            onPlay={(e) => { e.stopPropagation(); onPlay(song); }} // Stop propagation to prevent ListItemButton click
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
