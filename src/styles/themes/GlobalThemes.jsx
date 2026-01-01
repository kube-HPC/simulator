import React, { useEffect, useState, startTransition } from 'react';
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
    break;
  case 'DARK':
    break;
  default:
}

const DarkThemeStyle = React.lazy(() => import('./dark/DarkThemeStyle.styles'));
const LightThemeStyle = React.lazy(
  () => import('./light/LightThemeStyle.styles')
);

const LazyThemeStyle = {
  LIGHT: <LightThemeStyle />,
  DARK: <DarkThemeStyle />,
};

const GlobalThemes = () => {
  const { setTheme, themeName } = useSiteThemeMode();
  const location = useLocation();
  const [isThemeReady, setIsThemeReady] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setTheme(themeName);
      setIsThemeReady(true); // Indicate that theme is loaded
    });
  }, []);

  return (
    <>
      <GlobalStyle location={location} />
      {isThemeReady && LazyThemeStyle[themeName.toUpperCase()]}
    </>
  );
};

export default GlobalThemes;
