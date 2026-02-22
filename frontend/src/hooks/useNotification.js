import { useCallback, useState } from 'react';

const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const show = useCallback((message, type = 'success', duration = 3000) => {
    setNotification({ message, type, id: Date.now() });
    
    if (duration > 0) {
      setTimeout(() => setNotification(null), duration);
    }
  }, []);

  const success = useCallback((message) => show(message, 'success'), [show]);
  const error = useCallback((message) => show(message, 'error', 4000), [show]);
  const warning = useCallback((message) => show(message, 'warning'), [show]);
  const info = useCallback((message) => show(message, 'info'), [show]);

  return { notification, show, success, error, warning, info };
};

export default useNotification;
