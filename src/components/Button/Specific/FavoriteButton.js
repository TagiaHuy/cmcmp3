import React, { useState } from 'react';
import NormalButton from '../NormalButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

function FavoriteButton({ isFavorite, visible = true, ...props }) {
  const [favorited, setFavorited] = useState(isFavorite);

  const handleClick = (e) => {
    e.stopPropagation();
    setFavorited(!favorited);
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
