import React, { useState } from 'react';
import { ListItem, ListItemText, Typography, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { useMediaPlayer } from '../../context/MediaPlayerContext';
import { Link } from 'react-router-dom';
import PlayableImage from '../Card/PlayableImage';
import { useNotifications } from '../../hooks/useNotifications';
import { copyToClipboard } from '../../utils/clipboard';
import shareService from '../../services/shareService';
import DownloadMenuItem from '../MenuItem/Specific/DownloadMenuItem';

const SongListItem = ({ song, onPlay, renderActions }) => {
  const { handlePlay, normalizeArtists } = useMediaPlayer();
  const { notifySuccess, notifyError } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);

  if (!song) return null;

  const handlePlayClick = () => {
    if (!song) return;
    const playFn = onPlay || handlePlay;
    playFn(song);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCopyLink = async () => {
    const url = await shareService.getSongShareUrl(song.id);
    if (url && await copyToClipboard(url)) {
      notifySuccess('Đã sao chép liên kết!');
    } else {
      notifyError('Không thể sao chép liên kết.');
    }
    handleMenuClose();
  };

  const handleShareFacebook = async () => {
    const url = await shareService.getSongShareUrl(song.id);
    if (url) {
      const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(fbShareUrl, '_blank', 'noopener,noreferrer');
    } else {
      notifyError('Không thể lấy liên kết để chia sẻ.');
    }
    handleMenuClose();
  };

  const artistsText =
    (normalizeArtists
      ? normalizeArtists(song.artists)
      : song.artists?.map((artist) => artist.name).join(', ')) || 'Nghệ sĩ chưa xác định';

  const defaultActions = (
    <>
      <IconButton onClick={handleMenuOpen}>
        <MoreHoriz />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <DownloadMenuItem songId={song.id} songTitle={song.title} onCloseMenu={handleMenuClose} />
        <MenuItem onClick={handleCopyLink}>Sao chép liên kết</MenuItem>
        <MenuItem onClick={handleShareFacebook}>Chia sẻ lên Facebook</MenuItem>
      </Menu>
    </>
  );

  return (
    <ListItem
      sx={{
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
        borderRadius: '4px',
        p: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, overflow: 'hidden' }}>
        <PlayableImage
            imageUrl={song.imageUrl}
            title={song.title}
            size={56}
            borderRadius="4px"
            onPlay={handlePlayClick}
            hideOverlay={false}
            hidePlayButtonBorder={true}
            sx={{ mr: 2, flexShrink: 0 }}
        />
        <ListItemText
          primary={
            <Link to={`/songs/${song.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography noWrap variant="h6" sx={{ color: 'text.primary', '&:hover': { textDecoration: 'underline' } }}>
                {song.title}
              </Typography>
            </Link>
          }
          secondary={
            <Typography noWrap variant="body2" sx={{ color: 'text.secondary' }}>
              {artistsText}
            </Typography>
          }
          sx={{ overflow: 'hidden' }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, flexShrink: 0 }}>
        {renderActions ? renderActions(song, defaultActions) : defaultActions}
      </Box>
    </ListItem>
  );
};

export default SongListItem;