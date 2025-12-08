    import React, { useState } from 'react';
import { useMediaPlayer } from '../context/MediaPlayerContext';
import { Box, Typography, List, Grid, Divider } from '@mui/material';
import SongListItem from '../components/SongList/SongListItem';
import PlaylistGridCard from '../components/Card/PlaylistGridCard';
import { useTheme } from '@mui/material/styles';
import { getPlaylistById } from '../services/playlistService';
import { getSongById } from '../services/songService';

const RecentlyPlayedPage = () => {
  const { recentlyPlayed, recentlyPlayedPlaylists, handlePlay, loadQueue, normalizeArtists } = useMediaPlayer();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('songs');
  const [loadingPlaylistId, setLoadingPlaylistId] = useState(null);

  const handlePlayPlaylist = async (playlist) => {
    if (!playlist || !playlist.id) return;
    setLoadingPlaylistId(playlist.id);
    try {
      const fullPlaylist = await getPlaylistById(playlist.id);
      const songIds = fullPlaylist.songs;

      if (!songIds || songIds.length === 0) {
        return;
      }

      const songResults = await Promise.allSettled(
        songIds.map(id => getSongById(id))
      );
      
      const fetchedSongs = songResults
        .filter(r => r.status === 'fulfilled' && r.value)
        .map(r => r.value);

      if (fetchedSongs.length === 0) {
        return;
      }
      
      const normalizedSongs = fetchedSongs.map((song, index) => ({
        id: song.id ?? index,
        title: song.title,
        mediaSrc: song.mediaSrc || song.audioUrl,
        imageUrl: song.imageUrl,
        artists: normalizeArtists(song.artists)
      }));

      loadQueue(normalizedSongs, 0);

    } catch (error) {
      console.error("Failed to play playlist:", error);
    } finally {
      setLoadingPlaylistId(null);
    }
  };

  const separator = (
    <Box
      sx={{
        borderLeft: `1px solid ${theme.palette.divider}`,
        height: '1.2em',
        mx: 2,
        alignSelf: 'center',
      }}
    />
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2, gap: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: theme.palette.text.primary }}>
          Nghe gần đây
        </Typography>
        {separator}
        <Typography
          variant="h6"
          sx={{
            color: activeTab === 'songs' ? theme.palette.text.primary : theme.palette.text.secondary,
            mr: 2,
            cursor: 'pointer',
            '&:hover': { color: theme.palette.text.primary },
          }}
          onClick={() => setActiveTab('songs')}
        >
          Bài hát
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: activeTab === 'playlists' ? theme.palette.text.primary : theme.palette.text.secondary,
            mr: 2,
            cursor: 'pointer',
            '&:hover': { color: theme.palette.text.primary },
          }}
          onClick={() => setActiveTab('playlists')}
        >
          Playlist
        </Typography>
        <Typography variant="h6" sx={{ color: theme.palette.text.secondary, cursor: 'pointer', '&:hover': { color: theme.palette.text.primary } }}>
          MV
        </Typography>
      </Box>
      {activeTab === 'songs' && (
        recentlyPlayed.length > 0 ? (
          <List>
            {recentlyPlayed.map((song, index) => (
              <React.Fragment key={index}>
                <SongListItem song={song} onPlay={handlePlay} />
                {index < recentlyPlayed.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography>Chưa có bài hát nào trong danh sách nghe gần đây.</Typography>
        )
      )}
      {activeTab === 'playlists' && (
        recentlyPlayedPlaylists.length > 0 ? (
          <Grid container spacing={3}>
            {recentlyPlayedPlaylists.map((playlist, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <PlaylistGridCard
                  playlist={playlist}
                  onPlay={() => handlePlayPlaylist(playlist)}
                  isLoading={loadingPlaylistId === playlist.id}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>Chưa có playlist nào trong danh sách nghe gần đây.</Typography>
        )
      )}
    </Box>
  );
};

export default RecentlyPlayedPage;
