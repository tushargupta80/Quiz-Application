// src/hooks/useAuth.js
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import * as authService from '../services/authService.js'; // Import the service

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  const { user, isAuthenticated, setUser, setIsAuthenticated } = context;
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true); // Initial loading state for auth check

  useEffect(() => {
    // On app load, check for existing token/session
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you'd send this token to your backend
      // for validation and to get user details.
      // For now, we'll simulate a successful login.
      setUser({ email: 'user@example.com', id: '123' }); // Placeholder user data
      setIsAuthenticated(true);
      showNotification('Welcome back!', 'success');
    }
    setLoading(false);
  }, [setUser, setIsAuthenticated, showNotification]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Call your auth service
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.token); // Store token
      setUser(data.user);
      setIsAuthenticated(true);
      showNotification('Logged in successfully!', 'success');
      return true;
    } catch (err) {
      showNotification(err.message || 'Login failed. Please check your credentials.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.signup(email, password);
      showNotification('Account created successfully! Please log in.', 'success');
      // Optionally auto-login or redirect to login page
      return true;
    } catch (err) {
      showNotification(err.message || 'Signup failed. Please try again.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    showNotification('Logged out successfully.', 'info');
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
  };
};