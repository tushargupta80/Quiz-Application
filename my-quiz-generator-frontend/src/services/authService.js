// src/services/authService.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const login = async (email, password) => {
  // Simulate API call
  console.log('Attempting login with:', email, password);
  // In a real app:
  // const response = await fetch(`${API_BASE_URL}/auth/login`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password }),
  // });
  // if (!response.ok) {
  //   const errorData = await response.json();
  //   throw new Error(errorData.message || 'Login failed.');
  // }
  // return response.json();

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'test@example.com' && password === 'password') {
        resolve({ token: 'mock-jwt-token', user: { id: 'user123', email: 'test@example.com' } });
      } else {
        reject(new Error('Invalid email or password.'));
      }
    }, 1000);
  });
};

export const signup = async (email, password) => {
  // Simulate API call
  console.log('Attempting signup with:', email, password);
  // In a real app:
  // const response = await fetch(`${API_BASE_URL}/auth/signup`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password }),
  // });
  // if (!response.ok) {
  //   const errorData = await response.json();
  //   throw new Error(errorData.message || 'Signup failed.');
  // }
  // return response.json();

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password && password.length >= 6) {
        resolve({ message: 'User registered successfully!' });
      } else {
        reject(new Error('Signup failed. Please provide a valid email and a password of at least 6 characters.'));
      }
    }, 1500);
  });
};

// Add other auth related functions like forgotPassword, resetPassword etc.