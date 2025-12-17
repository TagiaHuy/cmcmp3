import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Menu } from '@mui/material';
import BasePlayableImage from '../Card/Base/BasePlayableImage';
import FavoriteButton from '../Button/Specific/FavoriteButton';
import MoreButton from '../Button/Specific/MoreButton';
import DownloadMenuItem from '../MenuItem/Specific/DownloadMenuItem';
import ShareMenu from '../MenuItem/Specific/ShareMenu';

import { normalizeArtists } from '../../context/MediaPlayerContext';
import { useMediaActions } from '../../hooks/useMediaActions';
import { getAlbumSongs } from '../../services/albumService';
import { useNotifications } from '../../hooks/useNotifications';

const IMG_H = 210;
const PLAY_DIAMETER = 52;

const BTN_BOX = 44;
const GAP_PX = 16;
const TWEAK_Y = -22;

function HomeAlbumListItem({ album, onFavorite }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { playAll } = useMediaActions();
  const { notifyError } = useNotifications();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleCardClick = () => navigate(`/albums/${album.id}`);

  const artistsText = useMemo(
    () => normalizeArtists(album?.artists ?? album?.artist),
    [album]
  );

  // ⚠️ Home list thường không có album.songs → preview có thể rỗng, không sao
  const previewMediaSrc =
    album?.mediaSrc || album?.songs?.[0]?.audioUrl || album?.songs?.[0]?.filePath || '';

  // ✅ Play: luôn fetch bài của album rồi playAll
  const handlePlayAlbum = useCallback(async (e) => {
    e.stopPropagation();
    try {
      const songs = await getAlbumSongs(album.id);

      const formattedSongs = (songs || [])
        .map(s => ({
          ...s,
          mediaSrc: s.mediaSrc || s.filePath || s.audioUrl || s.audioPath || '',
          imageUrl: s.imageUrl || album.imageUrl,
          artists: s.artists ?? album.artists ?? album.artist,
          title: s.title || s.name || 'Unknown',
        }))
        .filter(s => !!s.mediaSrc);

      if (!formattedSongs.length) {
        notifyError('Album này chưa có bài hát (hoặc bài chưa có link mp3).');
        return;
      }

      playAll(formattedSongs);
    } catch (err) {
      console.error(err);
      notifyError('Không thể tải bài hát của album. Vui lòng thử lại sau.');
    }
  }, [album, playAll, notifyError]);

  return (
    <Box
      sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', cursor: 'pointer' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <BasePlayableImage
        mediaSrc={previewMediaSrc}
        onPlay={handlePlayAlbum}
        size={IMG_H}
        isHovered={isHovered}
      >
        <img
          src={album.imageUrl || 'default-album-image.png'}
          alt={album.title || album.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 8 }}
        />
      </BasePlayableImage>

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
            sx={{ width: BTN_BOX, height: BTN_BOX, display: 'grid', placeItems: 'center', pointerEvents: 'auto', cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); onFavorite?.(); }}
          >
            {/* <FavoriteButton visible={isHovered} entityType="album" entityId={album.id} /> */}
          </Box>

          <Box sx={{ width: PLAY_DIAMETER, height: PLAY_DIAMETER }} />

          <Box sx={{ width: BTN_BOX, height: BTN_BOX, display: 'grid', placeItems: 'center', pointerEvents: 'auto', cursor: 'pointer' }}>
            {/* <MoreButton visible={isHovered} onClick={handleMenuOpen} /> */}
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              {/* list album thường không có songs -> mục download có thể không hiện, ok */}
              {album?.songs?.[0]?.id && (
                <DownloadMenuItem
                  songId={album.songs[0].id}
                  songTitle={album.songs[0].title}
                  onCloseMenu={handleMenuClose}
                />
              )}
              <ShareMenu anchorEl={anchorEl} open={open} onCloseMenu={handleMenuClose} type="album" id={album.id} />
            </Menu>
          </Box>
        </Box>
      </Box>

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

      {!!artistsText && (
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
          title={artistsText}
        >
          {artistsText}
        </Typography>
      )}
    </Box>
  );
}

export default HomeAlbumListItem;
