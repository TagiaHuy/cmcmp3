import React, { useEffect } from 'react';
import './App.css';
import MainLayout from './layout/MainLayout';
import { useTheme } from '@mui/material/styles';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecentlyPlayedPage from './pages/RecentlyPlayedPage';

function App() {
  const theme = useTheme();

  useEffect(() => {
    document.body.style.backgroundColor = theme.body.background;
  }, [theme]);

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recently-played" element={<RecentlyPlayedPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
