import React, { useState, useEffect } from 'react';
import { usePostContext } from '../PostContext';
import { auth } from '../firebase/firebase';
import LoadingSpinner from './LoadingSpinner';
import { FaThumbsUp, FaComment, FaShare } from 'react-icons/fa';

const Home = () => {
  const { posts, profileData } = usePostContext();
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = auth.currentUser;

  const safeConvertTimestamp = (timestamp) => {
    try {
      // Jika format tanggal berupa string, konversi manual
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

  const enhancedPosts = posts
  .map(post => {
    const createdAt = safeConvertTimestamp(post.createdAt);
    
    return {
      ...post,
      createdAt,
      ...(post.userId === currentUser?.uid && {
        username: profileData?.username || post.username,
        profileColor: profileData?.profileColor || post.profileColor || '#3b82f6' // Warna default biru
      })
    };
  })
  // Tambahkan sorting disini
  .sort((a, b) => b.createdAt - a.createdAt); // Urutkan dari terbaru ke terlama

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 ">
      <div className=" pt-10 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Beranda</h2>
        <div className="space-y-4">
          {enhancedPosts.map((post) => {
            const formattedDate = post.createdAt.toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div key={post.id} className="bg-white rounded-xl shadow-post p-4">
                {/* Header Postingan */}
                <div className="flex items-start mb-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-sm"
                    style={{ backgroundColor: post.profileColor }}
                  >
                    {post.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline">
                      <h3 className="font-semibold text-gray-900 mr-2">{post.username}</h3>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500 ml-2">{formattedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Konten Postingan */}
                <p className="text-gray-800 mb-4 whitespace-pre-line">
                  {post.content}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  <button className="flex items-center text-gray-600 hover:text-blue-600">
                    <FaThumbsUp className="mr-2" />
                    <span className="text-sm">Suka</span>
                  </button>
                  <button className="flex items-center text-gray-600 hover:text-green-600">
                    <FaComment className="mr-2" />
                    <span className="text-sm">Komentar</span>
                  </button>
                  <button className="flex items-center text-gray-600 hover:text-purple-600">
                    <FaShare className="mr-2" />
                    <span className="text-sm">Bagikan</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;