// src/pages/DashboardPage.jsx
import React, { useState } from 'react';
import PdfUploader from '../components/PdfUploader.jsx';
import QuizDisplay from '../components/quizzes/QuizDisplay.jsx';
import { useApi } from '../hooks/useApi.js';
import * as quizService from '../services/quizService.js'; // Import quiz service

function DashboardPage() {
  const [quizData, setQuizData] = useState(null);
  const { isLoading, callApi } = useApi();

  const handleGenerateQuiz = async (file) => {
    setQuizData(null); // Clear previous quiz
    try {
      const data = await callApi(() => quizService.generateQuiz(file), 'Quiz generated successfully!');
      setQuizData(data.quiz);
    } catch (error) {
      // Error already handled by useApi and showNotification
    }
  };

  const handleQuizSubmit = (score, total) => {
    console.log(`Final Quiz Score: <span class="math-inline">\{score\}/</span>{total}`);
    // In a real application, you might save this result to the backend
    // callApi(() => quizService.saveQuizResult({ quizId: quizData.id, score, total }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">Create New Quiz</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <PdfUploader onFileUpload={handleGenerateQuiz} isLoading={isLoading} />
        </div>
        <div>
          {isLoading && <p className="text-center text-gray-600">Generating quiz...</p>}
          {!isLoading && quizData && <QuizDisplay quizData={quizData} onQuizSubmit={handleQuizSubmit} />}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;