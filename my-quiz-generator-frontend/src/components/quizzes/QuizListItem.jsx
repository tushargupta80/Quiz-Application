// src/components/quizzes/QuizListItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button.jsx';

function QuizListItem({ quiz, onView, onDelete }) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3">
      <h3 className="text-lg font-semibold text-gray-800">{quiz.title || `Quiz from ${quiz.fileName}`}</h3>
      <div className="flex space-x-2">
        <Button onClick={() => onView(quiz.id)} className="bg-blue-500 hover:bg-blue-600 text-sm">
          View
        </Button>
        <Button onClick={() => onDelete(quiz.id)} className="bg-red-500 hover:bg-red-600 text-sm">
          Delete
        </Button>
      </div>
    </div>
  );
}

export default QuizListItem;