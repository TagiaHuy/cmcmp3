import { useCallback } from 'react';
import { toast } from 'react-toastify';

export const useNotifications = () => {
  const notify = useCallback((message, type = 'info') => {
    toast[type](message);
  }, []);

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
