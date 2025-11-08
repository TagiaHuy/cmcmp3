import React from 'react';
import { IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RepeatIcon from '@mui/icons-material/Repeat';

const PlaybackControls = ({
  isPlaying,
  isShuffleActive,
  isRepeatActive,
  handlePlayPause,
  handlePrevious,
  handleNext,
  handleShuffle,
  handleRepeat,
}) => {
  return (
    <div className="playback-controls">
      <IconButton aria-label="shuffle" onClick={handleShuffle} color={isShuffleActive ? "primary" : "background"}>
        <ShuffleIcon />
      </IconButton>

      <IconButton aria-label="previous" onClick={handlePrevious}>
        <SkipPreviousIcon />
      </IconButton>

      <IconButton onClick={handlePlayPause} aria-label="play/pause">
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>

      <IconButton aria-label="next" onClick={handleNext}>
        <SkipNextIcon />
      </IconButton>

      <IconButton aria-label="repeat" onClick={handleRepeat} color={isRepeatActive ? "primary" : "background"}>
        <RepeatIcon />
      </IconButton>
    </div>
  );
};

export default PlaybackControls;
