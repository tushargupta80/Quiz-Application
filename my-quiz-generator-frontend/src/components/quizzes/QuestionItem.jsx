// src/components/quizzes/QuestionItem.jsx
import React from 'react';
import InputField from '../common/InputField.jsx';

function QuestionItem({ question, index, userAnswer, onAnswerChange, submitted, result, correctAnswer }) {
  const isCorrect = result === 'correct';
  const isIncorrect = result === 'incorrect';
  const isAnswered = result !== 'unanswered';

  const questionClass = submitted
    ? isCorrect
      ? 'border-green-400 bg-green-50'
      : isIncorrect
        ? 'border-red-400 bg-red-50'
        : 'border-gray-200 bg-gray-50'
    : 'border-gray-200 bg-white';

  return (
    <div className={`p-4 border rounded-md shadow-sm mb-4 ${questionClass}`}>
      <p className="text-lg font-semibold text-gray-800 mb-3">
        {index + 1}. {question.question}
      </p>

      {question.type === 'mcq' && (
        <div className="flex flex-col space-y-2">
          {question.options.map((option, optIndex) => (
            <label key={optIndex} className={`flex items-center p-3 rounded-md cursor-pointer transition-colors
                              ${submitted && option === correctAnswer ? 'bg-green-200 font-bold' : 'hover:bg-gray-100'}
                              ${submitted && isIncorrect && option === userAnswer ? 'bg-red-200 border border-red-500' : ''}
                              `}>
              <input
                type="radio"
                name={`question-${index}`}
                value={option}
                checked={userAnswer === option}
                onChange={() => onAnswerChange(index, option)}
                disabled={submitted}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'true_false' && (
        <div className="flex flex-col space-y-2">
          {['True', 'False'].map((option, optIndex) => (
            <label key={optIndex} className={`flex items-center p-3 rounded-md cursor-pointer transition-colors
                              ${submitted && option === correctAnswer ? 'bg-green-200 font-bold' : 'hover:bg-gray-100'}
                              ${submitted && isIncorrect && option === userAnswer ? 'bg-red-200 border border-red-500' : ''}
                              `}>
              <input
                type="radio"
                name={`question-${index}`}
                value={option}
                checked={userAnswer === option}
                onChange={() => onAnswerChange(index, option)}
                disabled={submitted}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'short_answer' && (
        <div className="mt-3">
          <InputField
            type="textarea" // Custom type for textarea
            value={userAnswer || ''}
            onChange={(e) => onAnswerChange(index, e.target.value)}
            disabled={submitted}
            placeholder="Type your answer here..."
            className="w-full"
            rows={4}
          />
          {submitted && correctAnswer && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm">
              <p className="font-semibold">Expected Answer:</p>
              <p>{correctAnswer}</p>
              <p className="text-xs italic text-gray-500 mt-1">
                (Short answers require manual review/self-grade)
              </p>
            </div>
          )}
        </div>
      )}

      {submitted && isIncorrect && (question.type === 'mcq' || question.type === 'true_false') && (
        <p className="mt-2 text-red-600 text-sm">Your answer was incorrect.</p>
      )}
      {submitted && isCorrect && (question.type === 'mcq' || question.type === 'true_false') && (
        <p className="mt-2 text-green-600 text-sm">Correct!</p>
      )}
    </div>
  );
}

export default QuestionItem;