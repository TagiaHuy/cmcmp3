import React from 'react';
import { Typography, Box, Grid } from '@mui/material';
import RecommendCard from '../Card/RecommendCard';

function RecommendCardContainer({ recommendations, onPlay }) {
  return (
    <Box sx={{px: 11}}>
      <Typography variant="h5" sx={{ color: (theme) => theme.palette.text.primary, mt: 4, mb: 2 }}>
        Recommended for you
      </Typography>
      <Grid container columnSpacing={3}>
        {recommendations.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <RecommendCard
              title={item.title}
              subtitle={item.subtitle}
              imageUrl={item.imageUrl}
              mediaSrc={item.mediaSrc}
              onPlay={onPlay}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default RecommendCardContainer;
