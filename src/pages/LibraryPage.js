import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SongsTab from '../components/Library/SongsTab';
import AlbumsTab from '../components/Library/AlbumsTab';
import MVsTab from '../components/Library/MVsTab';

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
        <Typography variant="h3" component="h1" gutterBottom sx={{ mr: 1, color: 'text.primary' }}>
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
          <Tab label="MV" id="library-tab-2" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <SongsTab />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AlbumsTab />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <MVsTab />
      </TabPanel>
    </Box>
  );
};

export default LibraryPage;
