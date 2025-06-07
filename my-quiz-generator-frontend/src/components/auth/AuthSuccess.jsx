// src/components/auth/AuthSuccess.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function AuthSuccess({ message, redirectPath, redirectText }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
      <h2 className="text-2xl font-bold mb-4 text-green-600">Success!</h2>
      <p className="text-gray-700 mb-6">{message}</p>
      {redirectPath && redirectText && (
        <Link to={redirectPath} className="text-blue-600 hover:underline">
          {redirectText}
        </Link>
      )}
    </div>
  );
}

export default AuthSuccess;