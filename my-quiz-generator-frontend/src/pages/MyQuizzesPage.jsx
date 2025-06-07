// src/pages/MyQuizzesPage.jsx
import React, { useState, useEffect } from 'react';
import QuizListItem from '../components/quizzes/QuizListItem.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { useApi } from '../hooks/useApi.js';
import * as quizService from '../services/quizService.js'; // Import quiz service
import { useNotification } from '../context/NotificationContext.jsx';

function MyQuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const { isLoading, callApi } = useApi();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await callApi(quizService.fetchUserQuizzes, 'Your quizzes loaded successfully!');
        setQuizzes(data || []); // Assume data is an array of quizzes
      } catch (error) {
        // Error handled by useApi and showNotification
      }
    };
    fetchQuizzes();
  }, [callApi]);

  const handleViewQuiz = (quizId) => {
    // Implement logic to view a specific quiz, e.g., navigate to a /quiz/:id page
    showNotification(`Viewing quiz with ID: ${quizId}`, 'info');
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await callApi(() => quizService.deleteQuiz(quizId), 'Quiz deleted successfully!');
        setQuizzes(prev => prev.filter(q => q.id !== quizId)); // Remove from UI
      } catch (error) {
        // Error handled by useApi and showNotification
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">My Saved Quizzes</h1>
      {isLoading ? (
        <LoadingSpinner message="Loading your quizzes..." />
      ) : quizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => (
            <QuizListItem
              key={quiz.id}
              quiz={quiz}
              onView={handleViewQuiz}
              onDelete={handleDeleteQuiz}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg py-8">You haven't saved any quizzes yet. Go to <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link> to create one!</p>
      )}
    </div>
  );
}

export default MyQuizzesPage;