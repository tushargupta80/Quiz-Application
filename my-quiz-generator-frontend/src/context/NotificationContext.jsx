// src/context/NotificationContext.jsx
import React, { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    message: '',
    type: 'info', // 'success', 'error', 'info', 'warning'
    duration: 3000,
  });

  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    setNotification({ message, type, duration });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification({ message: '', type: 'info', duration: 3000 });
  }, []);

  const notificationContextValue = {
    notification,
    showNotification,
    hideNotification,
  };

  return (
    <NotificationContext.Provider value={notificationContextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook for easier consumption
export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};