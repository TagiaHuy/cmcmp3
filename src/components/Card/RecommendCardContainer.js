import React from 'react';
import { Typography, Box } from '@mui/material';
import RecommendCard from './RecommendCard';

function RecommendCardContainer({ recommendations, onPlay }) {
  const chunkedRecommendations = recommendations.reduce((resultArray, item, index) => { 
    const chunkIndex = Math.floor(index/3)

    if(!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])

  return (
    <Box sx={{marginLeft: 10, marginRight:12}}>
      <Typography variant="h5" sx={{ color: (theme) => theme.palette.text.primary, mt: 4, mb: 2 }}>
        Recommended for you
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
        {chunkedRecommendations.map((row, rowIndex) => (
          <Box key={rowIndex} sx={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
            {row.map((item, itemIndex) => (
              <Box key={itemIndex} sx={{ flex: '1 1 0' }}>
                <RecommendCard
                  title={item.title}
                  subtitle={item.subtitle}
                  imageSrc={item.imageSrc}
                  mediaSrc={item.mediaSrc}
                  onPlay={onPlay}
                />
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default RecommendCardContainer;
