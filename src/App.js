// src/App.js
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
import SongDetailPage from './pages/SongDetailPage';
import ArtistDetailPage from './pages/ArtistDetailPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import ProfilePage from './pages/ProfilePage';
import AdminUsersPage from './pages/AdminUsersPage';
import LibraryPage from './pages/LibraryPage'; // New import
import ArtistsPage from './pages/ArtistsPage'; // New import for ArtistsPage
import { useAuth } from './context/AuthContext';

/** Chặn trang công khai (login/register) nếu đã đăng nhập */
const PublicOnlyRoute = ({ isAuthed, children }) =>
  isAuthed ? <Navigate to="/" replace /> : children;

/** Yêu cầu đăng nhập */
const PrivateRoute = ({ isAuthed, children }) =>
  isAuthed ? children : <Navigate to="/login" replace />;

/** Yêu cầu quyền ADMIN */
const AdminRoute = ({ isAdmin, children }) =>
  isAdmin ? children : <Navigate to="/" replace />;

function App() {
  const theme = useTheme();
  const { isAuthenticated, user, isAdmin: isAdminFromCtx } = useAuth();

  // Fallback xác định admin khi context chưa expose isAdmin
  const roles = user?.roles || user?.authorities || [];
  const computedIsAdmin =
    Array.isArray(roles) && roles.some((r) => String(r).toUpperCase().includes('ADMIN'));
  const isAdmin = typeof isAdminFromCtx === 'boolean' ? isAdminFromCtx : computedIsAdmin;

  useEffect(() => {
    document.body.style.backgroundColor = theme.body?.background ?? '#000';
  }, [theme]);

  return (
    <MainLayout>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="/recently-played" element={<RecentlyPlayedPage />} />
        <Route path="/songs/:songId" element={<SongDetailPage />} />
        <Route path="/artist/:artistId" element={<ArtistDetailPage />} />
        <Route path="/playlist/:playlistId" element={<PlaylistDetailPage />} />
        <Route path="/artists" element={<ArtistsPage />} /> {/* Re-added route for ArtistsPage */}

        {/* Auth pages: chỉ hiển thị khi CHƯA đăng nhập */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute isAuthed={isAuthenticated}>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute isAuthed={isAuthenticated}>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />

        {/* Private pages: yêu cầu đăng nhập */}
        <Route
          path="/profile"
          element={
            <PrivateRoute isAuthed={isAuthenticated}>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/library"
          element={
            <PrivateRoute isAuthed={isAuthenticated}>
              <LibraryPage />
            </PrivateRoute>
          }
        />

        {/* Admin (cần đăng nhập + quyền ADMIN) */}
        <Route
          path="/admin/users"
          element={
            <PrivateRoute isAuthed={isAuthenticated}>
              <AdminRoute isAdmin={isAdmin}>
                <AdminUsersPage />
              </AdminRoute>
            </PrivateRoute>
          }
        />

        {/* 404 → về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
