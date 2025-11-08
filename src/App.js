import React, { useEffect } from 'react';
import './App.css';
import MainLayout from './layout/MainLayout';
import { useTheme } from '@mui/material/styles';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecentlyPlayedPage from './pages/RecentlyPlayedPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TestPage from './pages/TestPage';
import { useAuth } from './context/AuthContext';
import SongDetailPage from './pages/SongDetailPage';
import ArtistDetailPage from './pages/ArtistDetailPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage';

function App() {
  const theme = useTheme();
  const { isAuthenticated, handleSocialLogin } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      handleSocialLogin(token);
      // Xóa token khỏi URL để làm sạch
      window.history.replaceState({}, document.title, "/");
    }
  }, [handleSocialLogin]);

  useEffect(() => {
    document.body.style.backgroundColor = theme.body.background;
  }, [theme]);

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/recently-played" element={<RecentlyPlayedPage />} />
        <Route path="/songs/:songId" element={<SongDetailPage />} />
        <Route path="/artist/:artistId" element={<ArtistDetailPage />} />
        <Route path="/playlist/:playlistId" element={<PlaylistDetailPage />} />
        
        {/* Nếu đã đăng nhập, chuyển hướng khỏi trang login/register */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} 
        />

        {/* Thêm các private routes ở đây nếu cần */}
        {/* Ví dụ: <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} /> */}

      </Routes>
    </MainLayout>
  );
}

export default App;
