import React, { useEffect } from 'react';
import './App.css';
import MainLayout from './layout/MainLayout';
import { useTheme } from '@mui/material/styles';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecentlyPlayedPage from './pages/RecentlyPlayedPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './context/AuthContext';

function App() {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.body.style.backgroundColor = theme.body.background;
  }, [theme]);

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recently-played" element={<RecentlyPlayedPage />} />
        
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
