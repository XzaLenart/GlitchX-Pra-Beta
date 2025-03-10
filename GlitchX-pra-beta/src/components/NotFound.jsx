import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Oops! Halaman yang Anda cari tidak ditemukan.</p>
      <Link
        to="/"
        className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-100 transition-colors duration-300"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFound;