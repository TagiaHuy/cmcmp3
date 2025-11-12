import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Banner from '../Card/Banner';

const BannerCarousel = ({ banners }) => {
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (banners && banners.length > 0) {
      const interval = setInterval(() => {
        setStartIndex((prevIndex) => (prevIndex + 1) % banners.length);
      }, 8000); // Auto-switch every 1 second

      return () => clearInterval(interval);
    }
  }, [banners]);

  if (!banners || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[startIndex];

  if (!currentBanner) {
    return null;
  }

  return (
    <Box sx={{ my: 4, position: 'relative' }}>
      <Banner
        imageUrl={currentBanner.imageUrl}
        title={currentBanner.title}
        description={currentBanner.description}
        onButtonClick={currentBanner.onButtonClick}
        buttonText={currentBanner.buttonText}
      />
    </Box>
  );
};

export default BannerCarousel;
