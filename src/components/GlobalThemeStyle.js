import React, { useEffect, Suspense } from 'react';
import { useSiteDarkMode } from 'hooks';
import { THEMES_NAMES } from 'const';
import { GlobalStyle } from 'styles';

// create in began styles
if (localStorage.getItem('theme') === THEMES_NAMES.Dark) {
  import('antd/dist/antd.dark.css');
} else {
  import('antd/dist/antd.css');
}

// create in last styles to override styles
const GlobalStyleDark = React.lazy(() =>
  import('../styles/GlobalStyleDark.styles')
);

const GlobalThemeStyle = () => {
  const { isDarkMode, setTheme, themeName } = useSiteDarkMode();
  useEffect(() => setTheme(themeName), []);

  return (
    <>
      <GlobalStyle isDarkMode={isDarkMode} />

      {isDarkMode && (
        <Suspense fallback="">
          <GlobalStyleDark />
        </Suspense>
      )}
    </>
  );
};

export default GlobalThemeStyle;
