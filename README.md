# GlitchX-Pra-Beta
**Inglish:**
This repository contains the source code for a simple social media website built using **React Vite**. The website includes basic features such as user authentication, posting, and profile management. Below is an overview of the features and technologies used in this project.

**Indonesian:**
Repositori ini berisi kode sumber untuk situs web media sosial sederhana yang dibangun menggunakan **React Vite**. Situs web ini mencakup fitur-fitur dasar seperti otentikasi pengguna, posting, dan manajemen profil. Di bawah ini adalah gambaran umum dari fitur dan teknologi yang digunakan dalam proyek ini.

## Features
**Inglish:**
- **Login and Sign Up**: Users can create an account and log in to access the platform.
- **Home Page**: Displays posts from all users who are logged in.
- **Profile Page**: Shows user information, their posts, and allows editing profile details such as name and profile icon.
- **Text-Based Posts**: Currently, the platform only supports text-based posts.
- **Firebase Integration**: User data (e.g., identities and posts) is stored and managed using Firebase.

**Indonesian:**
- **Login dan Daftar**: Pengguna dapat membuat akun dan masuk untuk mengakses platform.
- **Halaman Beranda**: Menampilkan postingan dari semua pengguna yang masuk.
- **Halaman Profil**: Menampilkan informasi pengguna, postingan mereka, dan memungkinkan pengeditan detail profil seperti nama dan ikon profil.
- **Postingan Berbasis Teks**: Saat ini, platform ini hanya mendukung postingan berbasis teks.
- **Integrasi Basis Data**: Data pengguna (misalnya, identitas dan postingan) disimpan dan dikelola menggunakan Firebase.

## Upcoming Features
**Inglish:**
- **Friends System**: Ability to add and manage friends.
- **Messaging**: Real-time chat functionality between users.
These features are not yet implemented but may be added in the future. Feel free to contribute or expand on this project!

**Indonesian:**
- **Sistem Pertemanan**: Kemampuan untuk menambah dan mengelola teman.
- **Pesan**: Fungsionalitas obrolan waktu nyata di antara para pengguna.
Fitur-fitur ini belum diimplementasikan, tetapi mungkin akan ditambahkan di masa mendatang. Jangan ragu untuk berkontribusi atau mengembangkan proyek ini!

## Technologies Used

- **Frontend**: React Vite -> https://vite.dev/
- **Backend**: Firebase (Authentication, Firestore Database) -> https://firebase.google.com/
- **Styling**: Tailwind Css -> https://tailwindcss.com/

## Customization
**Inglish:**
You need to customize your firebase configuration in `firebase.js` according to your firebase API.

**Indonesian:**
Anda perlu menyesuaikan konfigurasi firebase Anda di `firebase.js` sesuai dengan API firebase Anda.

```javascript
const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxx",
  authDomain: "xxxxxxxxxxxxxxxxxx",
  projectId: "xxxxxxxxxxxxxxxxxx",
  storageBucket: "xxxxxxxxxxxxxxxxxx",
  messagingSenderId: "xxxxxxxxxxxxxxxxxx",
  appId: "xxxxxxxxxxxxxxxxxx",
  measurementId: "xxxxxxxxxxxxxxxxxx"
};
```

## License
**Inglish:**
This source code can be developed as you wish and is also open source.

**Indonesian:**
Kode sumber ini dapat dikembangkan sesuai keinginan Anda dan juga bersifat open source.

## Live Demo
https://glitchx-beta.vercel.app/
