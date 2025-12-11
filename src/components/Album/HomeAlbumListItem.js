import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Menu, IconButton } from '@mui/material';
import BasePlayableImage from '../Card/Base/BasePlayableImage';
import FavoriteAlbumButton from '../Button/Specific/FavoriteAlbumButton';
import MoreButton from '../Button/Specific/MoreButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareMenu from '../MenuItem/Specific/ShareMenu'; // For MoreButton menu

const IMG_H = 160;
const PLAY_DIAMETER = 42;
const BTN_BOX = 44;
const GAP_PX  = 16;
const TWEAK_Y = -22;

const HomeAlbumListItem = ({ album }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = () => {
    navigate(`/albums/${album.id}`);
  };

  // onLikeToggle for FavoriteAlbumButton will be handled by the parent (UserAlbums)
  const onLikeToggle = () => {
    // This button will optimistically update itself,
    // and the parent's state will be re-fetched on modal close.
    // So, no need to directly update parent state here.
  };

  return (
    <Box
      sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', cursor: 'pointer' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Ảnh */}
      <BasePlayableImage size={IMG_H} isHovered={isHovered}>
        <img
          src={album.imageUrl}
          alt={album.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            borderRadius: 8
          }}
        />
      </BasePlayableImage>

      {/* Nút hover: ❤️  [space]  ⋯ */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity .25s',
          pointerEvents: 'none',
          zIndex: 5,
          lineHeight: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            columnGap: `${GAP_PX}px`,
            transform: `translateY(${TWEAK_Y}px)`,
          }}
        >
          <Box
            sx={{
              width: BTN_BOX,
              height: BTN_BOX,
              display: 'grid',
              placeItems: 'center',
              pointerEvents: 'auto',
              cursor: 'pointer',
            }}
          >
            <FavoriteAlbumButton albumId={album.id} isFavorite={album.isFavorite} onLikeToggle={onLikeToggle} />
          </Box>

          {/* Placeholder for play button to align MoreButton */}
          <Box sx={{ width: PLAY_DIAMETER, height: PLAY_DIAMETER }} />

          <Box
            sx={{
              width: BTN_BOX,
              height: BTN_BOX,
              display: 'grid',
              placeItems: 'center',
              pointerEvents: 'auto',
              cursor: 'pointer',
            }}
          >
            <MoreButton visible={isHovered} onClick={handleMenuOpen} />
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'more-button-home-album-item',
              }}
            >
              <ShareMenu anchorEl={anchorEl} open={open} onCloseMenu={handleMenuClose} type="album" id={album.id} />
            </Menu>
          </Box>
        </Box>
      </Box>

      {/* Title */}
      <Typography
        variant="subtitle1"
        sx={{
          color: 'text.primary',
          mt: 1,
          fontWeight: 700,
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
        title={album.title}
      >
        {album.title}
      </Typography>

      {/* Creator */}
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          mt: 0.25,
          lineHeight: 1.2,
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
        title={album.creator?.name || 'Unknown'}
      >
        {album.creator?.name || 'Unknown'}
      </Typography>
    </Box>
  );
};

export default HomeAlbumListItem;

