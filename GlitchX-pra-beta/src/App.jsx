import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState, Suspense } from 'react';
import { PostProvider } from './PostContext';
import Navbar from './components/navbar';
import LoadingSpinner from './components/LoadingSpinner'; 
import { auth } from './firebase/firebase'; 
import ComingSoon from './components/comingsoon';

// Lazy load komponen
const Home = React.lazy(() => import('./components/home'));
const Profile = React.lazy(() => import('./components/profile'));
const Login = React.lazy(() => import('./components/login'));
const SignUp = React.lazy(() => import('./components/signup'));
const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute'));
const NotFound = React.lazy(() => import('./components/NotFound'));

const App = () => {
  const [user, setUser] = useState(null); // State untuk menyimpan status login pengguna
  const [loading, setLoading] = useState(true); // State untuk menandai apakah pengecekan status login sudah selesai

  // Gunakan useEffect untuk memeriksa status login saat aplikasi dimuat
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // Jika pengguna sudah login, set state user
      } else {
        setUser(null); // Jika pengguna belum login, set state user menjadi null
      }
      setLoading(false); // Tandai bahwa pengecekan status login sudah selesai
    });

    return () => unsubscribe(); // Unsubscribe saat komponen di-unmount
  }, []);

  // Jika masih memeriksa status login, tampilkan loading spinner
  if (loading) {
    return <LoadingSpinner />; // Tampilkan loading spinner
  }

  return (
    <Router>
      <PostProvider>
        <Navbar /> {/* Navbar tetap di atas */}
        <Suspense fallback={<LoadingSpinner />}> {/* Tampilkan loading spinner saat komponen dimuat */}
          <Routes>
            {/* Route untuk Home (diproteksi) */}
            <Route
              path="/home"
              element={
                <ProtectedRoute user={user}>
                  <Home />
                </ProtectedRoute>
              }
            />

            {/* Route untuk Profile (diproteksi) */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute user={user}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/comingsoon"
              element={
                <ProtectedRoute user={user}>
                  <ComingSoon />
                </ProtectedRoute>
              }
            />

            {/* Route untuk Login */}
            <Route
              path="/login"
              element={user ? <Navigate to="/home" replace /> : <Login />}
            />

            {/* Route untuk Sign Up */}
            <Route
              path="/signup"
              element={user ? <Navigate to="/home" replace /> : <SignUp />}
            />

            {/* Default route (redirect ke /home jika sudah login, atau /login jika belum) */}
            <Route
              path="/"
              element={
                user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
              }
            />

            {/* Route untuk halaman tidak ditemukan (404) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PostProvider>
    </Router>
  );
};

export default App;