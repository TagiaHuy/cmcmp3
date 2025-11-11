import React from 'react';
import { Navigate } from 'react-router-dom';
import useIsAdmin from '../hooks/useIsAdmin';

export default function RequireAdmin({ children }) {
  const isAdmin = useIsAdmin();
  return isAdmin ? children : <Navigate to="/" replace />;
}
