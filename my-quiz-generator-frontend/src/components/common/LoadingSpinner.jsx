// src/components/common/LoadingSpinner.jsx
import React from 'react';

function LoadingSpinner({ message = 'Loading...', size = 'medium' }) {
  const spinnerSize = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-4',
    large: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        className={`${spinnerSize[size]} border-blue-500 border-t-blue-200 rounded-full animate-spin`}
        role="status"
        aria-label={message}
      >
        <span className="sr-only">{message}</span>
      </div>
      {message && size !== 'small' && <p className="mt-4 text-gray-600 text-lg">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;