import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SongsTab from '../components/Library/SongsTab';
import AlbumsTab from '../components/Library/AlbumsTab';
import PlaylistsTab from '../components/Library/PlaylistsTab'; // Import the new PlaylistsTab

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`library-tabpanel-${index}`}
      aria-labelledby={`library-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const LibraryPage = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ p: 3, width: '100%', overflowX: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mr: 1, color: 'text.primary', fontWeight: 700 }}>
          Thư viện của bạn
        </Typography>
        <IconButton color="primary" aria-label="play library">
          <PlayArrowIcon sx={{ fontSize: '2.5rem' }} />
        </IconButton>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="Library tabs">
          <Tab label="Bài hát" id="library-tab-0" />
          <Tab label="Album" id="library-tab-1" />
          <Tab label="Playlist" id="library-tab-3" /> {/* New tab for Playlists */}
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <SongsTab />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AlbumsTab />
      </TabPanel>
      <TabPanel value={value} index={3}> {/* New TabPanel for Playlists */}
        <PlaylistsTab />
      </TabPanel>
    </Box>
  );
};

export default LibraryPage;
