import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, collection, doc, getDoc, updateDoc,
  query, where, writeBatch, addDoc, getDocs  
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDeDUGLR3_rurHVEspxH4Y6GEQ-TLbqXfE",
  authDomain: "glitchx-b2b4f.firebaseapp.com",
  projectId: "glitchx-b2b4f",
  storageBucket: "glitchx-b2b4f.firebasestorage.app",
  messagingSenderId: "943025110605",
  appId: "1:943025110605:web:1dd1b39ccdfe48a4b92604",
  measurementId: "G-54G7FGRDTE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

// Ekspor modul yang diperlukan
export { 
  db, 
  collection, doc, getDoc, updateDoc,
  query, where, writeBatch, addDoc, getDocs  
};