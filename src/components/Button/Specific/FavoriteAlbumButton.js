import React, { useState, useEffect } from 'react';
import NormalButton from '../NormalButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNotifications } from '../../../hooks/useNotifications';
import { likeAlbum } from '../../../services/albumService'; // Use albumService

function FavoriteAlbumButton({ albumId, isFavorite, onLikeToggle, ...props }) {
  const [favorited, setFavorited] = useState(isFavorite);
  const { notifySuccess, notifyError } = useNotifications();

  useEffect(() => {
    setFavorited(isFavorite);
  }, [isFavorite]);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (!albumId) return;

    // Optimistically update UI
    const newFavoritedState = !favorited;
    setFavorited(newFavoritedState);

    try {
      await likeAlbum(albumId); // Use likeAlbum, assuming it toggles
      
      // Notify parent component
      onLikeToggle?.(newFavoritedState);

      // Show success message
      if (newFavoritedState) {
        notifySuccess("Đã thêm album vào danh sách yêu thích.");
      } else {
        notifySuccess("Đã xóa album khỏi danh sách yêu thích.");
      }
    } catch (error) {
      // Revert UI on error
      setFavorited(!newFavoritedState);
      notifyError("Có lỗi xảy ra, vui lòng thử lại.");
      console.error("Failed to update album favorite status:", error);
    }
  };

  return (
    <NormalButton {...props} onClick={handleClick}>
      {favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </NormalButton>
  );
}

export default FavoriteAlbumButton;
