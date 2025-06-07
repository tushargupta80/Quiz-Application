// src/components/common/Notification.jsx
import React, { useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext.jsx';

function Notification() {
  const { notification, hideNotification } = useNotification();

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        hideNotification();
      }, notification.duration || 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, hideNotification]);

  if (!notification.message) return null;

  const notificationTypeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg text-white z-50
                  ${notificationTypeClasses[notification.type || 'info']}
                  ${notification.message ? 'animate-slideIn' : 'animate-slideOut'}`}
      role="alert"
    >
      <div className="flex items-center">
        <span>{notification.message}</span>
        <button onClick={hideNotification} className="ml-4 text-white hover:text-gray-200 font-bold">
          &times;
        </button>
      </div>
    </div>
  );
}

export { Notification };