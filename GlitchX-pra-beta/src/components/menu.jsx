import { Link, useLocation } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import { FaHome, FaUserFriends, FaEnvelope, FaUser, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import { usePostContext } from '../PostContext';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';

const Menu = ({ isMenuVisible }) => {
  const location = useLocation();
  const [newPost, setNewPost] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { addPost, profileData } = usePostContext();

  const hiddenRoutes = ['/login', '/signup'];
  const shouldHideMenu = hiddenRoutes.includes(location.pathname);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      // Dapatkan user yang sedang login
      const user = auth.currentUser;
      
      if (!user) {
        console.error('No authenticated user!');
        return;
      }

      const post = {
        id: Date.now(),
        userId: user.uid, // Tambahkan user ID
        username: profileData?.username || 'Anonymous',
        content: newPost,
        createdAt: new Date().toLocaleString(),
        profileColor: profileData?.color || '#3b82f6',
      };
      
      console.log("Post data:", post);
      await addPost(post);
      setNewPost('');
      setIsFormVisible(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (shouldHideMenu) {
    return null;
  }

  return (
    <nav
      className={`bg-white/80 backdrop-blur-md border-r border-gray-200 p-1 text-black shadow-sm h-screen fixed top-11 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out ${
        isMenuVisible ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Menu */}
      <div className="flex flex-col space-y-1">
        <li className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors duration-300 p-3 rounded-lg hover:bg-blue-50">
          <FaHome className="text-xl" />
          <Link to="/" className="font-medium">Beranda</Link>
        </li>
        <li className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors duration-300 p-3 rounded-lg hover:bg-blue-50">
          <FaUserFriends className="text-xl" />
          <Link to="/comingsoon" className="font-medium">Teman</Link>
        </li>
        <li className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors duration-300 p-3 rounded-lg hover:bg-blue-50">
          <FaEnvelope className="text-xl" />
          <Link to="/comingsoon" className="font-medium">Pesan</Link>
        </li>
        <li className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors duration-300 p-3 rounded-lg hover:bg-blue-50">
          <FaUser className="text-xl" />
          <Link to="/profile" className="font-medium">Profil</Link>
        </li>
      </div>

      {/* Tombol CTA */}
      <div className="mt-8">
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2"
        >
          <FaPlus className="text-xl" />
          <span>Buat Postingan</span>
        </button>
      </div>

      {/* Form Buat Postingan */}
      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Apa yang sedang Anda pikirkan?"
            className="w-full p-2 border rounded-lg mb-2"
            rows="3"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300"
          >
            Posting
          </button>
        </form>
      )}

      {/* Tombol Logout (Hanya untuk Mobile) */}
      <div className="md:hidden fixed bottom-11 left-0 w-64 bg-white/80 backdrop-blur-md border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 text-gray-700 hover:text-red-600 transition-colors duration-300 p-3 rounded-lg hover:bg-red-50"
        >
          <FaSignOutAlt className="text-xl" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Menu;