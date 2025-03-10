// src/components/LoadingSpinner.jsx
import React from 'react';
import { ClipLoader } from 'react-spinners'; // Import spinner dari react-spinners

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <ClipLoader color="#3b82f6" size={50} /> {/* Spinner dengan warna biru */}
    </div>
  );
};

export default LoadingSpinner;