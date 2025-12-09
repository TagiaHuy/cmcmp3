import React, { useState, useEffect } from 'react';
import NormalButton from '../NormalButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNotifications } from '../../../hooks/useNotifications';
import { likeSong, unlikeSong } from '../../../services/songService';
import { useMediaPlayer } from '../../../context/MediaPlayerContext';

function FavoriteButton({ songId, isFavorite, onLikeToggle, visible = true, ...props }) {
  const [favorited, setFavorited] = useState(isFavorite);
  const { updateSongInQueue } = useMediaPlayer();
  const { notifySuccess, notifyError } = useNotifications();

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
        notifySuccess("Đã thêm bài hát vào danh sách yêu thích.");
      } else {
        await unlikeSong(songId);
        notifySuccess("Đã xóa bài hát khỏi danh sách yêu thích.");
      }
      setFavorited(newFavoritedState);
      if (updateSongInQueue) {
        updateSongInQueue(songId, { isFavorite: newFavoritedState });
      }
      if (onLikeToggle) {
        onLikeToggle(newFavoritedState);
      }
    } catch (error) {
      notifyError("Có lỗi xảy ra, vui lòng thử lại.");
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
