import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Banner from '../Card/Banner';

const BannerCarousel = ({ banners }) => {
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 8000); // Auto-switch every 1 second

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <Box sx={{ my: 4, position: 'relative' }}>
      <Banner
        imageUrl={banners[startIndex].imageUrl}
        title={banners[startIndex].title}
        description={banners[startIndex].description}
        onButtonClick={banners[startIndex].onButtonClick}
        buttonText={banners[startIndex].buttonText}
      />
    </Box>
  );
};

export default BannerCarousel;
