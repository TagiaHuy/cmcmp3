import React from 'react';
import { 
  ListItem, 
  ListItemButton, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Stack, 
  Typography,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MoreButton from '../Button/Specific/MoreButton';

const ArtistListItem = ({ artist, index }) => {
  const navigate = useNavigate();

  return (
    <ListItem
      disablePadding
      sx={{
        borderRadius: 2,
        mb: 0.5,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          background:
            'linear-gradient(90deg, rgba(102,126,234,0.15), rgba(118,75,162,0.15))',
        },
        '&:hover .artist-actions': {
          opacity: 1,
          transform: 'translateX(0)',
        },
        '&:hover .artist-avatar': {
          transform: 'scale(1.08)',
          boxShadow: '0 0 0 3px rgba(102,126,234,0.4)',
        },
      }}
    >
      <ListItemButton
        onClick={() => navigate(`/artist/${artist.id}`)}
        sx={{
          py: 1.5,
          px: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* STT */}
        <Box sx={{ width: 36, textAlign: 'center', mr: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={500}
          >
            {index + 1}
          </Typography>
        </Box>

        {/* Avatar */}
        <ListItemAvatar sx={{ minWidth: 0, mr: 2 }}>
          <Avatar
            src={artist.imageUrl}
            alt={artist.name}
            variant="rounded"
            className="artist-avatar"
            sx={{
              width: 52,
              height: 52,
              transition: 'all 0.3s ease',
            }}
          />
        </ListItemAvatar>

        {/* Artist Info */}
        <ListItemText
          primary={
            <Typography
              variant="subtitle1"
              fontWeight={600}
              noWrap
              color="text.primary"
            >
              {artist.name}
            </Typography>
          }
          secondary={
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
            >
              Nghệ sĩ • Artist
            </Typography>
          }
        />

        {/* Actions (hidden until hover) */}
        <Stack
          direction="row"
          spacing={1}
          className="artist-actions"
          sx={{
            opacity: 0,
            transform: 'translateX(10px)',
            transition: 'all 0.25s ease',
          }}
        >
          {/* <MoreButton /> */}
        </Stack>
      </ListItemButton>
    </ListItem>
  );
};

export default ArtistListItem;
