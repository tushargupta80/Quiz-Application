// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import AuthForm from '../components/auth/AuthForm.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const { login, loading } = useAuth();
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  const handleLoginSubmit = async (email, password) => {
    setAuthError(null);
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard'); // Redirect to dashboard on successful login
    } else {
      setAuthError('Invalid credentials. Please try again.'); // More specific error if needed
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <AuthForm
        isLogin={true}
        onSubmit={handleLoginSubmit}
        isLoading={loading}
        error={authError}
      />
    </div>
  );
}

export default LoginPage;