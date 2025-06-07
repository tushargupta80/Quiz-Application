// src/components/layout/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../common/Button.jsx';
import logo from '../../assets/logo.svg'; // Assuming logo is in assets folder

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home after logout
  };

  return (
    <header className="bg-white shadow-md py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-8 w-8" />
          <span className="text-2xl font-bold text-blue-700">AI Quiz Generator</span>
        </Link>
        <nav>
          {isAuthenticated ? (
            <ul className="flex items-center space-x-6">
              <li><Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link></li>
              <li><Link to="/my-quizzes" className="text-gray-700 hover:text-blue-600 font-medium">My Quizzes</Link></li>
              <li className="text-gray-600">Hello, {user?.email || 'User'}!</li>
              <li>
                <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
                  Logout
                </Button>
              </li>
            </ul>
          ) : (
            <ul className="flex items-center space-x-6">
              <li><Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link></li>
              <li>
                <Button onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;