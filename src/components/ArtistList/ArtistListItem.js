import React from 'react';
import { 
  ListItem, 
  ListItemButton, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Stack, 
  Typography,
  Box // Added Box import
} from '@mui/material';
import MoreButton from '../Button/Specific/MoreButton';
import FavoriteButton from '../Button/Specific/FavoriteButton'; // Assuming artists can be favorited
import { useNavigate } from 'react-router-dom';

const ArtistListItem = ({ artist, index }) => {
  const navigate = useNavigate();

  const handleArtistClick = () => {
    navigate(`/artist/${artist.id}`);
  };

  return (
    <ListItem
      disablePadding
      secondaryAction={
        <Stack direction="row" spacing={1} alignItems="center">
          {/* Assuming artists can be favorited */}
          <FavoriteButton isFavorite={artist.isFavorite} /> 
          <MoreButton />
        </Stack>
      }
      sx={{ 
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          bgcolor: 'action.hover',
        }
      }}
    >
      <ListItemButton onClick={handleArtistClick} sx={{ py: 1.5 }}>
        
        {/* Cột 1: STT */}
        <Box sx={{ width: 40, textAlign: 'center', mr: 2 }}>
          <Typography variant="body2" color="text.primary">
            {index + 1}
          </Typography>
        </Box>

        {/* Cột 2: Ảnh (Avatar) */}
        <ListItemAvatar sx={{ minWidth: 0, mr: 2 }}>
          <Avatar 
            alt={artist.name} 
            src={artist.imageUrl} 
            variant="rounded" 
            sx={{ width: 48, height: 48 }}
          />
        </ListItemAvatar>

        {/* Cột 3: Tên Nghệ sĩ */}
        <ListItemText
          primary={
            <Typography 
              variant="subtitle1" 
              fontWeight={500}
              color="text.primary" 
              noWrap
            >
              {artist.name}
            </Typography>
          }
          secondary={
            <Typography variant="body2" color="text.primary" noWrap>
              Nghệ sĩ
            </Typography>
          }
        />
        
      </ListItemButton>
    </ListItem>
  );
};

export default ArtistListItem;
