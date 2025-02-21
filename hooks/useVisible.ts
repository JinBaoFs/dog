import { useEffect, useState } from 'react';

export const useVisible = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      setVisible(document.visibilityState === 'visible');
    });
    return () => {
      document.removeEventListener('visibilitychange', () => {
        setVisible(false);
      });
    };
  }, [visible, setVisible]);
  return visible;
};
