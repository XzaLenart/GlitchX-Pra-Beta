import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  db, 
  doc,
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,       // Pastikan ini diimpor
  where,       // Pastikan ini diimpor
  writeBatch   // Pastikan ini diimpor
} from './firebase/firebase';
import { auth } from './firebase/firebase';

// Buat context
const PostContext = createContext();

// Fungsi untuk mengambil data profil dari Firestore
const fetchProfileFromFirestore = async (userId) => {
  try {
    const profileRef = doc(db, 'users', userId);
    const profileDoc = await getDoc(profileRef);

    if (profileDoc.exists()) {
      return profileDoc.data();
    } else {
      console.log('No profile data found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching profile data:', error);
    throw error;
  }
};

// Fungsi untuk update semua post pengguna
const updateAllUserPosts = async (userId, newData) => {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const batch = writeBatch(db);
    
    querySnapshot.forEach((document) => {
      const docRef = doc(db, 'posts', document.id);
      batch.update(docRef, {
        username: newData.username,
        profileColor: newData.profileColor
      });
    });
    
    await batch.commit();
  } catch (error) {
    console.error("Error updating posts:", error);
  }
};

// Buat provider
export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [profileData, setProfileData] = useState(null);

  // Fungsi untuk menambahkan postingan ke Firestore
  const addPost = async (post) => {
    try {
      if (!post.content || !post.username) {
        throw new Error('Invalid post data');
      }

      const docRef = await addDoc(collection(db, 'posts'), post);
      console.log('Post added with ID: ', docRef.id);
      setPosts((prevPosts) => [...prevPosts, { ...post, id: docRef.id }]);
    } catch (error) {
      console.error('Error adding post: ', error);
    }
  };

  // Fungsi untuk mengambil postingan dari Firestore
  const fetchPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const postsData = querySnapshot.docs.map((doc) => {
        const post = doc.data();
        return {
          id: doc.id,
          userId: post.userId,
          content: post.content,
          username: post.userId === auth.currentUser?.uid 
                   ? (profileData?.username || post.username)
                   : post.username,
          profileColor: post.userId === auth.currentUser?.uid 
                       ? (profileData?.profileColor || post.profileColor)
                       : post.profileColor,
          createdAt: post.createdAt,
          likes: post.likes || [],
          comments: post.comments || []
        };
      });
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts: ', error);
    }
  };

  // Fungsi untuk mengambil data profil
  const fetchProfileData = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const profileData = await fetchProfileFromFirestore(userId);
        setProfileData(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  // Ambil data postingan dan profil saat komponen pertama kali di-mount
  useEffect(() => {
    fetchPosts();
    fetchProfileData();
  }, []);

  // Effect untuk update posts saat profile berubah
  useEffect(() => {
    if (profileData) {
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.userId === auth.currentUser?.uid) {
          return {
            ...post,
            username: profileData.username,
            profileColor: profileData.profileColor
          };
        }
        return post;
      }));
    }
  }, [profileData]);

  const updateProfile = async (data) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");
  
      // Validasi
      if (!data.username || data.username.length < 3) {
        throw new Error("Username harus minimal 3 karakter");
      }
      if (!/^#([0-9A-F]{3}){1,2}$/i.test(data.profileColor)) {
        throw new Error("Format warna tidak valid");
      }

      // Persiapkan data untuk Firestore
      const firestoreData = {
        username: String(data.username),
        profileIcon: String(data.profileIcon || "FaUser"),
        profileColor: String(data.profileColor || "#3b82f6")
      };

      // Update Firestore profile
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, firestoreData);

      // Update posts di Firestore
      await updateAllUserPosts(userId, firestoreData);

      // Update state lokal
      setProfileData(prev => ({ ...prev, ...firestoreData }));
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.userId === userId) {
          return { 
            ...post,
            username: firestoreData.username,
            profileColor: firestoreData.profileColor
          };
        }
        return post;
      }));
      
    } catch (error) {
      console.error("Error updating profile:", error.message);
      throw error;
    }
  };

  return (
    <PostContext.Provider value={{ posts, addPost, profileData, updateProfile }}>
      {children}
    </PostContext.Provider>
  );
};

// Ekspor context
export const usePostContext = () => useContext(PostContext);
export { PostContext };