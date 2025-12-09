import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Tabs, Tab } from '@mui/material';
import useTag from '../hooks/useTag'; // To be created
import SongList from '../components/SongList/SongList';
import TagDetailCard from '../components/Card/TagDetailCard'; // To be created
import { useMediaPlayer } from '../context/MediaPlayerContext';
import { useNotifications } from '../hooks/useNotifications';
import { getSongsByTag } from '../services/songService'; // Assuming songService has getSongsByTag

const TagDetailPage = () => {
  const { tagId } = useParams();
  const { notifyError } = useNotifications();

  const { tag, loading, error } = useTag(tagId);
  const { loadQueue, queue, isPlaying, setIsPlaying } = useMediaPlayer();

  const [songs, setSongs] = useState([]);
  const [songsLoading, setSongsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (tag) {
      const fetchSongs = async () => {
        try {
          setSongsLoading(true);
          // Assuming a function to get songs by tag id exists
          const fetchedSongs = await getSongsByTag(tag.id);
          setSongs(fetchedSongs);
        } catch (err) {
          if (err.name !== 'AbortError') {
            notifyError('Could not load songs for the tag.');
          }
        } finally {
          setSongsLoading(false);
        }
      };
      fetchSongs();
    }
  }, [tag, notifyError]);

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

  if (loading || songsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" sx={{p: 3}}>Error fetching tag: {error.message}</Typography>;
  }

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
