// src/components/quizzes/QuizDisplay.jsx
import React, { useState } from 'react';
import QuestionItem from './QuestionItem.jsx';
import Button from '../common/Button.jsx';
import { useNotification } from '../../context/NotificationContext.jsx'; // For showing success/error messages

function QuizDisplay({ quizData, onQuizSubmit, isLoading }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState({}); // Stores 'correct', 'incorrect', 'unanswered' for each question
  const { showNotification } = useNotification();

  if (!quizData || quizData.length === 0) {
    return <p className="text-center text-gray-600 text-lg py-8">No quiz generated yet. Upload a PDF!</p>;
  }

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionIndex]: answer
    }));
  };

  const handleSubmit = () => {
    const newResults = {};
    let score = 0;
    let mcqCount = 0;

    quizData.forEach((question, index) => {
      const userAnswer = answers[index];
      if (question.type === 'mcq' || question.type === 'true_false') {
        mcqCount++;
        if (userAnswer && question.correct_answer &&
            userAnswer.toLowerCase() === question.correct_answer.toLowerCase()) {
          newResults[index] = 'correct';
          score++;
        } else if (userAnswer) {
          newResults[index] = 'incorrect';
        } else {
          newResults[index] = 'unanswered';
        }
      } else if (question.type === 'short_answer') {
        newResults[index] = userAnswer && userAnswer.trim() !== '' ? 'answered' : 'unanswered';
        // Short answers are not auto-graded for score in MVP
      } else {
        newResults[index] = 'unanswered';
      }
    });
    setResults(newResults);
    setSubmitted(true);
    onQuizSubmit(score, mcqCount); // Pass score of auto-gradable questions
    showNotification(`Quiz submitted! You scored ${score} out of ${mcqCount} auto-graded questions.`, 'info');
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
    setResults({});
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Your Generated Quiz</h2>

      {quizData.map((question, index) => (
        <QuestionItem
          key={index}
          question={question}
          index={index}
          userAnswer={answers[index]}
          onAnswerChange={handleAnswerChange}
          submitted={submitted}
          result={results[index]}
          correctAnswer={question.correct_answer}
        />
      ))}

      <div className="mt-8 text-center">
        {!submitted ? (
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Submit Quiz
          </Button>
        ) : (
          <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-md mb-4">
            <h3 className="text-xl font-bold mb-2">Quiz Completed!</h3>
            <p>You scored {Object.values(results).filter(r => r === 'correct').length} out of {quizData.filter(q => q.type === 'mcq' || q.type === 'true_false').length} auto-graded questions.</p>
            <p className="text-sm text-gray-600 mt-1">Review your answers above. For short answer questions, please self-grade.</p>
            <Button onClick={handleRetake} className="mt-4 bg-gray-500 hover:bg-gray-600">
              Retake Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizDisplay;