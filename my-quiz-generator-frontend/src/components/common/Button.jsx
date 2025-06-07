// src/components/common/Button.jsx
import React from 'react';
import LoadingSpinner from './LoadingSpinner.jsx'; // Re-use the spinner

function Button({ children, onClick, type = 'button', className = '', isLoading = false, disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-3 rounded-md font-semibold text-white transition-colors duration-200
                  ${isLoading || disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                  ${className}`}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner size="small" />
          <span className="ml-2">Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;