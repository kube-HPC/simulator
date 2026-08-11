import { useEffect, useState } from 'react';
import { getCurrentTheme } from '../traceConstants';

export const useSpanRowTheme = () => {
  const [isDark, setIsDark] = useState(getCurrentTheme() === 'DARK');

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(getCurrentTheme() === 'DARK');
    };

    const interval = setInterval(checkTheme, 500);
    window.addEventListener('storage', checkTheme);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkTheme);
    };
  }, []);

  return isDark;
};
