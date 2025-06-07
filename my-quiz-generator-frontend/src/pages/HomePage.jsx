// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';

function HomePage() {
  return (
    <div className="text-center py-16 px-4">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
        Generate Quizzes from PDFs Instantly with AI
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
        Transform your study materials and textbooks into interactive quizzes in seconds.
        Perfect for students, teachers, and lifelong learners.
      </p>
      <div className="space-x-4">
        <Link to="/signup">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4">
            Get Started Free
          </Button>
        </Link>
        <Link to="/login">
          <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300 text-lg px-8 py-4">
            Login
          </Button>
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Save Time</h3>
          <p className="text-gray-600">Automate quiz creation and focus on teaching or learning.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Engage Learners</h3>
          <p className="text-gray-600">Interactive quizzes make learning more effective and fun.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Instant Feedback</h3>
          <p className="text-gray-600">Get immediate results to track progress and identify weak areas.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;