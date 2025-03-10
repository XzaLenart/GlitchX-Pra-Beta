import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    // Jika pengguna belum login, redirect ke halaman login
    return <Navigate to="/login" replace />;
  }
  // Jika pengguna sudah login, render children (komponen yang diproteksi)
  return children;
};

export default ProtectedRoute;