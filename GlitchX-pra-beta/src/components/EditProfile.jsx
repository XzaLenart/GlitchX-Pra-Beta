import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { db } from '../firebase/firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { auth } from '../firebase/firebase';

const EditProfile = ({ onClose, onSave }) => {
  const [selectedIcon, setSelectedIcon] = useState({ name: '', color: '' });
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUsername(data.username);
          setSelectedIcon({
            name: 'Initial', // Placeholder untuk inisial
            color: data.profileColor || '#3b82f6'
          });
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  const handleIconSelect = (color) => {
    setSelectedIcon({ name: 'Initial', color });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user) {
      try {
        const profileData = {
          username: username.trim(),
          profileIcon: selectedIcon.name,
          profileColor: selectedIcon.color
        };

        await setDoc(doc(db, 'users', user.uid), profileData, { merge: true });

        const postsCollection = collection(db, 'posts');
        const userPostsQuery = query(postsCollection, where('authorId', '==', user.uid));
        const querySnapshot = await getDocs(userPostsQuery);

        if (!querySnapshot.empty) {
          const batch = writeBatch(db);
          querySnapshot.forEach((postDoc) => {
            const postRef = doc(db, 'posts', postDoc.id);
            batch.update(postRef, {
              authorUsername: profileData.username,
              authorProfileIcon: profileData.profileIcon,
              authorProfileColor: profileData.profileColor
            });
          });
          await batch.commit();
        }

        onSave(profileData);
        onClose();
      } catch (error) {
        console.error("Error saving profile: ", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md text-center">
          <p>Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-800">Edit Profil</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan username baru"
              minLength="3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Warna Profil
            </label>
            <div className="flex flex-wrap gap-2">
              {['#3b82f6', '#000000', '#ef4444', '#10b981', '#f59e0b'].map((color, index) => (
                <div key={index}>
                  <button
                    type="button"
                    onClick={() => handleIconSelect(color)}
                    className={`p-2 border rounded-lg w-10 h-10 flex items-center justify-center ${
                      selectedIcon.color === color
                        ? 'border-blue-500 ring-2 ring-blue-500'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    <span className="text-white text-2xl font-bold">
                      {username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Pratinjau Profil
            </h3>
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: selectedIcon.color }}
            >
              <span className="text-white text-4xl font-bold">
                {username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;