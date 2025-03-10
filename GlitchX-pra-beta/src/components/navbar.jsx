import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import Menu from './menu';

const Navbar = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(
    localStorage.getItem('isMenuVisible') === 'true' || false
  );
  const [user, setUser] = useState(null);
  const location = useLocation();

  const toggleMenuVisibility = () => {
    const newVisibility = !isMenuVisible;
    setIsMenuVisible(newVisibility);
    localStorage.setItem('isMenuVisible', newVisibility);
  };

  useEffect(() => {
    const savedVisibility = localStorage.getItem('isMenuVisible') === 'true';
    setIsMenuVisible(savedVisibility);

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Ambil data user dari Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            ...firebaseUser,
            username: userData.username,
          });
        } else {
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const hiddenRoutes = ['/login', '/signup'];
  const shouldHideMenu = hiddenRoutes.includes(location.pathname);

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 py-2 text-black shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="text-xl text-blue-600 font-bold">
            <span>GlitchX Pra-Beta 1</span>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-700">Welcome, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="hidden md:inline-flex items-center bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors duration-300 text-sm"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors duration-300 text-sm"
                >
                  <FaSignInAlt className="mr-2" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors duration-300 text-sm"
                >
                  <FaUserPlus className="mr-2" />
                  Sign Up
                </Link>
              </>
            )}

            {!shouldHideMenu && (
              <button
                className="p-1 text-gray-700 hover:text-blue-600 focus:outline-none transition-colors duration-300"
                onClick={toggleMenuVisibility}
              >
                {isMenuVisible ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
              </button>
            )}
          </div>
        </div>
      </nav>

      {isMenuVisible && !shouldHideMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMenuVisibility}
        ></div>
      )}

      {!shouldHideMenu && <Menu isMenuVisible={isMenuVisible} />}
    </>
  );
};

export default Navbar;