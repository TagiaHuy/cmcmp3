import React from 'react';
import HighLightButton from '../HighLightButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

function PlayallButton ({
    isPlaying,
    handlePlayPause,
}) {
  return (
    <HighLightButton size="medium" onClick={handlePlayPause}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        Phát Tất Cả
    </HighLightButton>
  );
}

export default PlayallButton;