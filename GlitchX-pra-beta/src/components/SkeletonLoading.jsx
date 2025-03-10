// src/components/SkeletonLoading.jsx
import React from 'react';

const SkeletonLoading = () => {
  return (
    <div className="space-y-4">
      {/* Placeholder untuk judul */}
      <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>

      {/* Placeholder untuk konten */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
      </div>

      {/* Placeholder untuk tombol */}
      <div className="h-10 bg-gray-200 rounded w-1/2 animate-pulse"></div>
    </div>
  );
};

export default SkeletonLoading;