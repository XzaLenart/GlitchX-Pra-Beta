import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaEnvelope, FaCalendarAlt, FaVenusMars, FaEdit,
  FaThumbsUp, FaComment, FaShare 
} from 'react-icons/fa';
import { usePostContext } from '../PostContext';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import EditProfile from './EditProfile';
import LoadingSpinner from './LoadingSpinner';

const Profile = () => {
  const { posts, profileData, updateProfile } = usePostContext();
  const [userProfile, setUserProfile] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const safeConvertTimestamp = (timestamp) => {
    try {
      if (typeof timestamp === 'string') {
        const [datePart, timePart] = timestamp.split(', ');
        const [day, month, year] = datePart.split('/');
        const [time, modifier] = timePart.split(' ');
        let [hours, minutes, seconds] = time.split(':');
        hours = parseInt(hours);
        hours = modifier === 'PM' ? hours + 12 : hours;
        return new Date(year, month - 1, day, hours, minutes, seconds);
      }
      return timestamp?.toDate?.() || new Date(timestamp);
    } catch (error) {
      console.error('Error converting timestamp:', error);
      return new Date();
    }
  };

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      const user = auth.currentUser;
      if (!user) return;
  
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const profile = {
            username: data.username || 'Pengguna Baru',
            email: user.email,
            gender: data.gender || 'Belum diatur',
            createdAt: safeConvertTimestamp(data.createdAt),
            profileColor: data.profileColor || '#3b82f6',
            uid: user.uid
          };
          setUserProfile(profile);
  
          // Tambahkan sorting disini
          const filteredPosts = posts
            .filter(post => post.userId === user.uid)
            .map(post => ({
              ...post,
              username: profileData.username || post.username,
              profileColor: profileData.profileColor || post.profileColor || '#3b82f6',
              createdAt: safeConvertTimestamp(post.createdAt)
            }))
            .sort((a, b) => b.createdAt - a.createdAt); // Sorting dari terbaru
          
          setUserPosts(filteredPosts);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProfileAndPosts();
  }, [posts, profileData, auth.currentUser?.uid]);
  

  const formatDate = (date) => {
    // Handle undefined/null
    if (!date) return 'Tanggal tidak tersedia';
    
    // Handle invalid date (misal: hasil konversi yang gagal)
    if (isNaN(new Date(date).getTime())) return 'Tanggal tidak valid';
  
    try {
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Format tanggal salah';
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!userProfile) {
    return <div className="text-center py-8">Profil tidak ditemukan</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="pt-13 max-w-2xl mx-auto">
        {/* Header Profil */}
        <div className="bg-white rounded-xl shadow-post p-6 mb-6">
          <div className="flex items-start gap-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-sm"
              style={{ backgroundColor: userProfile.profileColor }}
            >
              {userProfile.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800">
                {userProfile.username}
              </h1>
              <p className="text-gray-600 text-sm">
                @{userProfile.username.toLowerCase().replace(/\s/g, '')}
              </p>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="mt-2 text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm"
              >
                <FaEdit className="text-base" />
                <span>Edit Profil</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informasi Profil */}
        <div className="bg-white rounded-xl shadow-post p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Informasi Profil</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800 break-all">{userProfile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaVenusMars className="text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Jenis Kelamin</p>
                <p className="text-gray-800">{userProfile.gender}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaCalendarAlt className="text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Bergabung Pada</p>
                <p className="text-gray-800">
                  {formatDate(userProfile.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Daftar Postingan */}
        <div className="bg-white rounded-xl shadow-post p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            {userPosts.length} Postingan
          </h2>
          
          {userPosts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada postingan
            </div>
          ) : (
            <div className="space-y-4">
              {userPosts.map(post => (
                <div 
                  key={post.id}
                  className="bg-white rounded-lg shadow-post p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm"
                      style={{ backgroundColor: post.profileColor }}
                    >
                      {post.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline">
                        <h3 className="font-semibold text-gray-900 mr-2">
                          {post.username}
                        </h3>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-800 whitespace-pre-line mb-4">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                    <button className="flex items-center text-gray-600 hover:text-blue-600">
                      <FaThumbsUp className="mr-2" />
                      <span className="text-sm">{post.likes?.length || 0} Suka</span>
                    </button>
                    <button className="flex items-center text-gray-600 hover:text-green-600">
                      <FaComment className="mr-2" />
                      <span className="text-sm">{post.comments?.length || 0} Komentar</span>
                    </button>
                    <button className="flex items-center text-gray-600 hover:text-purple-600">
                      <FaShare className="mr-2" />
                      <span className="text-sm">Bagikan</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Edit Profil */}
      {isEditModalOpen && (
        <EditProfile
          onClose={() => setIsEditModalOpen(false)}
          onSave={(newData) => {
            updateProfile(newData);
            setUserProfile(prev => ({ ...prev, ...newData }));
          }}
          initialData={userProfile}
        />
      )}
    </div>
  );
};

export default Profile;