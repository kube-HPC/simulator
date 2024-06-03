import React, { useEffect } from 'react';
import { useSiteThemeMode } from 'hooks';
import { GlobalStyle } from 'styles';
import { useLocation } from 'react-router-dom';
import { LOCAL_STORAGE_KEYS } from 'const';

// create in began styles antd by theme name
switch (
  localStorage
    .getItem(LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_THEME)
    ?.toUpperCase()
) {
  case 'LIGHT':
    // import('antd/dist/antd.css');
    break;
  case 'DARK':
    //  import('antd/dist/antd.dark.css');
    break;
  default:
  //  import('antd/dist/antd.css');
}

// create in last styles to override styles antd
const DarkThemeStyle = React.lazy(
  () => import('../themes/dark/DarkThemeStyle.styles')
);
const LightThemeStyle = React.lazy(
  () => import('../themes/light/LightThemeStyle.styles')
);

const LazyThemeStyle = {
  LIGHT: <LightThemeStyle />,
  DARK: <DarkThemeStyle />,
};

const GlobalThemes = () => {
  const { setTheme, themeName } = useSiteThemeMode();
  const location = useLocation();
  useEffect(() => setTheme(themeName), []);

  return (
    <>
      <GlobalStyle location={location} />
      {/* <Suspense fallback=""> */}
      {LazyThemeStyle[themeName.toUpperCase()]}
      {/* </Suspense> */}
    </>
  );
};

export default GlobalThemes;
