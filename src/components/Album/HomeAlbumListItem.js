import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Menu } from '@mui/material';
import BasePlayableImage from '../Card/Base/BasePlayableImage';
import FavoriteButton from '../Button/Specific/FavoriteButton';
import MoreButton from '../Button/Specific/MoreButton';
import DownloadMenuItem from '../MenuItem/Specific/DownloadMenuItem'; // Assuming albums might have a primary song to download
import ShareMenu from '../MenuItem/Specific/ShareMenu';

const IMG_H = 160;
const PLAY_DIAMETER = 42;

const BTN_BOX = 44;
const GAP_PX = 16;
const TWEAK_Y = -22;

function HomeAlbumListItem({ album, onPlay, onFavorite }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  // Assuming album has an imageUrl and a title. Adjust as per actual album object structure.
  // Assuming onPlay would play the first song in the album or open the album detail page
  // Assuming onFavorite would add/remove the album from favorites.

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

  return (
    <Box
      sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', cursor: 'pointer' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Ảnh + nút ▶ */}
      {/* Assuming album has an imageUrl and a mediaSrc for play */}
      <BasePlayableImage mediaSrc={album.mediaSrc || album.songs?.[0]?.audioUrl} onPlay={onPlay} size={IMG_H} isHovered={isHovered}>
        <img
          src={album.imageUrl || 'default-album-image.png'} // Use a default image if none
          alt={album.title || album.name}
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
            onClick={(e) => { e.stopPropagation(); onFavorite?.(); }}
          >
            {/* Assuming FavoriteButton can handle album.id */}
            <FavoriteButton visible={isHovered} entityType="album" entityId={album.id} />
          </Box>

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
                'aria-labelledby': 'more-button-album-item',
              }}
            >
              {/* Assuming there's a primary song in the album to download or disable if no song */}
              {album.songs?.[0]?.id && (
                <DownloadMenuItem songId={album.songs[0].id} songTitle={album.songs[0].title} onCloseMenu={handleMenuClose} />
              )}
              {/* Assuming ShareMenu can handle album type */}
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
        title={album.title || album.name}
      >
        {album.title || album.name}
      </Typography>

      {/* Artist(s) - Assuming album has an artist or artists */}
      {album.artist && (
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
          title={album.artist.name}
        >
          {album.artist.name}
        </Typography>
      )}
    </Box>
  );
}

export default HomeAlbumListItem;