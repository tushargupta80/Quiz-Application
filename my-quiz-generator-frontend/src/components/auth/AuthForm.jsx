// src/components/auth/AuthForm.jsx
import React, { useState } from 'react';
import Button from '../common/Button.jsx';
import InputField from '../common/InputField.jsx';

function AuthForm({ isLogin, onSubmit, isLoading, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {isLogin ? 'Login' : 'Sign Up'}
      </h2>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      <div className="mb-4">
        <InputField
          label="Email"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <InputField
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" isLoading={isLoading} className="w-full">
        {isLogin ? 'Login' : 'Sign Up'}
      </Button>
    </form>
  );
}

export default AuthForm;