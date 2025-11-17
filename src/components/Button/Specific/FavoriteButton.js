import React, { useState, useEffect } from 'react';
import NormalButton from '../NormalButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { likeSong, unlikeSong } from '../../../services/songService';
import { useMediaPlayer } from '../../../context/MediaPlayerContext';

function FavoriteButton({ songId, isFavorite, visible = true, ...props }) {
  const [favorited, setFavorited] = useState(isFavorite);
  const { updateSongInQueue } = useMediaPlayer();

  useEffect(() => {
    setFavorited(isFavorite);
  }, [isFavorite]);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (!songId) return;

    try {
      const newFavoritedState = !favorited;
      if (newFavoritedState) {
        await likeSong(songId);
        console.log(`Liked song: ${songId}`);
      } else {
        await unlikeSong(songId);
        console.log(`Unliked song: ${songId}`);
      }
      setFavorited(newFavoritedState);
      if (updateSongInQueue) {
        updateSongInQueue(songId, { isFavorite: newFavoritedState });
      }
    } catch (error) {
      console.error("Failed to update favorite status:", error);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <NormalButton {...props} onClick={handleClick}>
      {favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </NormalButton>
  );
}

export default FavoriteButton;
