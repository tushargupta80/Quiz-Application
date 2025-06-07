// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import AuthForm from '../components/auth/AuthForm.jsx';
import AuthSuccess from '../components/auth/AuthSuccess.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const { signup, loading } = useAuth();
  const [authError, setAuthError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignupSubmit = async (email, password) => {
    setAuthError(null);
    const success = await signup(email, password);
    if (success) {
      setSignupSuccess(true);
      // navigate('/login'); // Could also auto-redirect
    } else {
      setAuthError('Signup failed. User might already exist or password is too weak.');
    }
  };

  if (signupSuccess) {
    return (
      <div className="flex justify-center items-center py-12">
        <AuthSuccess
          message="Your account has been created successfully! You can now log in."
          redirectPath="/login"
          redirectText="Go to Login Page"
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12">
      <AuthForm
        isLogin={false}
        onSubmit={handleSignupSubmit}
        isLoading={loading}
        error={authError}
      />
    </div>
  );
}

export default SignupPage;