import React, { useState, useEffect } from 'react';
import NormalButton from '../NormalButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNotifications } from '../../../hooks/useNotifications';
import { likePlaylist, unlikePlaylist } from '../../../services/playlistService';

function FavoritePlaylistButton({ playlistId, isFavorite, ...props }) {
  const [favorited, setFavorited] = useState(isFavorite);
  const { notifySuccess, notifyError } = useNotifications();

  useEffect(() => {
    setFavorited(isFavorite);
  }, [isFavorite]);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (!playlistId) return;

    try {
      const newFavoritedState = !favorited;
      if (newFavoritedState) {
        await likePlaylist(playlistId);
        notifySuccess("Đã thêm playlist vào danh sách yêu thích.");
      } else {
        await unlikePlaylist(playlistId);
        notifySuccess("Đã xóa playlist khỏi danh sách yêu thích.");
      }
      setFavorited(newFavoritedState);
    } catch (error) {
      notifyError("Có lỗi xảy ra, vui lòng thử lại.");
      console.error("Failed to update playlist favorite status:", error);
    }
  };

  return (
    <NormalButton {...props} onClick={handleClick}>
      {favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </NormalButton>
  );
}

export default FavoritePlaylistButton;
