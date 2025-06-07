// src/hooks/useApi.js
import { useState, useCallback } from 'react';
import { useNotification } from '../context/NotificationContext.jsx';

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  const callApi = useCallback(async (apiCall, successMessage = '', errorMessage = 'An error occurred.') => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiCall();
      if (successMessage) {
        showNotification(successMessage, 'success');
      }
      return data;
    } catch (err) {
      console.error("API Call Error:", err);
      setError(err.message || errorMessage);
      showNotification(err.message || errorMessage, 'error');
      throw err; // Re-throw to allow component to handle specific errors
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  return { isLoading, error, callApi };
};