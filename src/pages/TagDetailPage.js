import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Tabs, Tab } from '@mui/material';
import useTag from '../hooks/useTag';
import useSongsByTag from '../hooks/useSongsByTag';
import SongList from '../components/SongList/SongList';
import TagDetailCard from '../components/Card/TagDetailCard';
import { useMediaPlayer } from '../context/MediaPlayerContext';

const TagDetailPage = () => {
  const { tagId } = useParams();
  
  // First, fetch the tag details to get the name
  const { tag, loading: tagLoading, error: tagError } = useTag(tagId);

  // Then, fetch songs using the tag's name
  const { songs, loading: songsLoading, error: songsError } = useSongsByTag(tag?.name);

  const { loadQueue, queue, isPlaying, setIsPlaying } = useMediaPlayer();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const isTagCurrentlyLoaded = useMemo(() => 
    songs && queue.length === songs.length && queue.every((track, index) => songs[index] && track.id === songs[index].id),
    [songs, queue]
  );

  const handlePlayTag = () => {
    if (songs && songs.length > 0) {
      if (isTagCurrentlyLoaded) {
        setIsPlaying(!isPlaying);
      } else {
        loadQueue(songs);
      }
    }
  };

  // Show loading spinner if either tag details or songs are loading
  if (tagLoading || songsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error if either fetch fails
  if (tagError || songsError) {
    return <Typography color="error" sx={{p: 3}}>Error: {tagError?.message || songsError?.message}</Typography>;
  }

  // If tag isn't found
  if (!tag) {
    return <Typography sx={{p: 3}}>Tag not found.</Typography>;
  }

  return (
    <>
      <Box display={'flex'} flexDirection="row" sx={{ p: 3, width: '100%' }}>
        <TagDetailCard 
          tag={tag} 
          handlePlayTag={handlePlayTag} 
          isPlaying={isTagCurrentlyLoaded && isPlaying}
        />
        <Box sx={{width: '100%'}}>
          <Tabs value={selectedTab} onChange={handleTabChange} centered>
            <Tab label="Songs" />
          </Tabs>
          {selectedTab === 0 && <SongList songs={songs} />}
        </Box>
      </Box>
    </>
  );
};

export default TagDetailPage;
