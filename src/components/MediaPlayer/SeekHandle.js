import React from 'react';
import { Stack, Slider, Typography } from '@mui/material';

const SeekHandle = ({ currentTime, duration, onSeek, textColor, format }) => {
  const safeDuration = Number.isFinite(duration) ? duration : 0;
  const safeCurrent = Math.min(Number.isFinite(currentTime) ? currentTime : 0, safeDuration);

  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
      <Typography variant="body2" sx={{ color: textColor, width: 40 }}>
        {format(safeCurrent)}
      </Typography>

      <Slider
        value={safeCurrent}
        min={0}
        max={safeDuration}
        step={1}
        onChange={onSeek}
        valueLabelDisplay="auto"
        valueLabelFormat={format}
        sx={{
          color: '#9353FF',
          flexGrow: 1,
          '& .MuiSlider-track': { border: 'none' },
          '& .MuiSlider-thumb': {
            width: 14,
            height: 14,
            backgroundColor: '#fff',
            border: '2px solid #9353FF',
            '&:hover': { boxShadow: '0 0 0 8px rgba(147, 83, 255, 0.16)' },
          },
        }}
      />

      <Typography variant="body2" sx={{ color: textColor, width: 40, textAlign: 'right' }}>
        {format(safeDuration)}
      </Typography>
    </Stack>
  );
};

export default SeekHandle;