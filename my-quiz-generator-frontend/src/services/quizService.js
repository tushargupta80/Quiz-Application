// src/services/quizService.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }) // Add token if available
  };
};

export const generateQuiz = async (pdfFile) => {
  console.log('Generating quiz from PDF:', pdfFile.name);
  const formData = new FormData();
  formData.append('pdf', pdfFile);

  // In a real app:
  // const token = localStorage.getItem('token');
  // const response = await fetch(`${API_BASE_URL}/quiz/generate`, {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${token}`,
  //   },
  //   body: formData,
  // });
  // if (!response.ok) {
  //   const errorData = await response.json();
  //   throw new Error(errorData.error || 'Failed to generate quiz.');
  // }
  // return response.json();

  // Mock quiz data for frontend demonstration
  return new Promise(resolve => setTimeout(() => {
    console.log('Quiz generation simulated success.');
    resolve({
      quiz: [
        {
          question: "What is the primary function of the digestive system?",
          type: "mcq",
          options: ["Circulate blood", "Break down food for nutrient absorption", "Exchange gases", "Produce hormones"],
          correct_answer: "Break down food for nutrient absorption"
        },
        {
          question: "The human skeleton is primarily composed of cartilage. (True/False)",
          type: "true_false",
          correct_answer: "False"
        },
        {
          question: "Explain the concept of photosynthesis in simple terms.",
          type: "short_answer",
          correct_answer: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll. It converts light energy into chemical energy, storing it in carbohydrate molecules, such as sugars, which are synthesized from carbon dioxide and water."
        },
        {
          question: "Which of these is a major component of a cell membrane?",
          type: "mcq",
          options: ["Cellulose", "Peptidoglycan", "Phospholipids", "Starch"],
          correct_answer: "Phospholipids"
        }
      ]
    });
  }, 3000)); // Simulate network delay
};

export const fetchUserQuizzes = async () => {
  console.log('Fetching user quizzes...');
  // In a real app:
  // const response = await fetch(`${API_BASE_URL}/user/quizzes`, {
  //   headers: getAuthHeaders(),
  // });
  // if (!response.ok) {
  //   const errorData = await response.json();
  //   throw new Error(errorData.message || 'Failed to fetch quizzes.');
  // }
  // return response.json();

  // Mock data for saved quizzes
  return new Promise(resolve => setTimeout(() => {
    console.log('User quizzes simulated success.');
    resolve([
      { id: 'q1', title: 'Biology Basics', fileName: 'Biology_101.pdf', created_at: '2025-05-15' },
      { id: 'q2', title: 'History of India', fileName: 'Indian_History_Ch1.pdf', created_at: '2025-05-10' },
      { id: 'q3', title: 'Math Fundamentals', fileName: 'Algebra_Intro.pdf', created_at: '2025-05-01' },
    ]);
  }, 1500));
};

export const saveQuiz = async (quizData) => {
  console.log('Saving quiz:', quizData.title);
  // In a real app:
  // const response = await fetch(`${API_BASE_URL}/quiz/save`, {
  //   method: 'POST',
  //   headers: getAuthHeaders(),
  //   body: JSON.stringify(quizData),
  // });
  // if (!response.ok) {
  //   const errorData = await response.json();
  //   throw new Error(errorData.message || 'Failed to save quiz.');
  // }
  // return response.json();

  return new Promise(resolve => setTimeout(() => {
    console.log('Quiz saved simulated success.');
    resolve({ message: 'Quiz saved successfully', quizId: 'new-quiz-id' });
  }, 500));
};

export const deleteQuiz = async (quizId) => {
  console.log('Deleting quiz:', quizId);
  // In a real app:
  // const response = await fetch(`<span class="math-inline">\{API\_BASE\_URL\}/quiz/</span>{quizId}`, {
  //   method: 'DELETE',
  //   headers: getAuthHeaders(),
  // });
  // if (!response.ok) {
  //   const errorData = await response.json();
  //   throw new Error(errorData.message || 'Failed to delete quiz.');
  // }
  // return response.json();

  return new Promise(resolve => setTimeout(() => {
    console.log('Quiz deletion simulated success.');
    resolve({ message: 'Quiz deleted successfully' });
  }, 500));
};