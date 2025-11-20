import { useContext, useCallback } from 'react';
import { toast } from 'react-toastify';
import { NotificationContext } from '../context/NotificationContext';

export const useNotifications = () => {
  const { addNotification } = useContext(NotificationContext);

  const notify = useCallback((message, type = 'info') => {
    toast[type](message);
    addNotification(message, type);
  }, [addNotification]);

  const notifySuccess = useCallback((message) => notify(message, 'success'), [notify]);
  const notifyError = useCallback((message) => notify(message, 'error'), [notify]);
  const notifyInfo = useCallback((message) => notify(message, 'info'), [notify]);
  const notifyWarning = useCallback((message) => notify(message, 'warning'), [notify]);

  return {
    notify,
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning,
  };
};
