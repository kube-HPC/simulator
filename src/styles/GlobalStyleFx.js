import React, { useEffect, Suspense } from 'react';
import { useSiteDarkMode } from '../hooks';

const GlobalStyle = React.lazy(() => import('./GlobalStyle.styles'));
const GlobalStyleDark = React.lazy(() => import('./GlobalStyleDark.styles'));

const GlobalStyleFx = () => {
  const { isDarkMode, setTheme } = useSiteDarkMode();
  useEffect(() => setTheme(isDarkMode ? 'dark' : 'light'), []);

  return (
    <Suspense fallback="">
      {isDarkMode ? <GlobalStyleDark /> : <GlobalStyle />}
    </Suspense>
  );
};

export default GlobalStyleFx;
