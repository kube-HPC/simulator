import React, { useLayoutEffect } from 'react';
import { useSiteThemeMode } from 'hooks';
import { GlobalStyle } from 'styles';
import { useLocation } from 'react-router-dom';
// Vite's inline CSS import keeps only the active theme's overrides in the DOM.
// eslint-disable-next-line import/no-unresolved
import lightThemeStyles from './light/light-mode-style.css?inline';
// eslint-disable-next-line import/no-unresolved
import lightsOutThemeStyles from './lightsOut/lights-out-style.css?inline';

const GlobalThemes = () => {
  const { themeName } = useSiteThemeMode();
  const location = useLocation();

  useLayoutEffect(() => {
    const styleId = 'hkube-theme-overrides';
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent =
      themeName.toUpperCase() === 'LIGHTSOUT'
        ? lightsOutThemeStyles
        : lightThemeStyles;
  }, [themeName]);

  return <GlobalStyle location={location} />;
};

export default GlobalThemes;
