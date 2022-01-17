import { useCallback, useState, useRef } from 'react';
import { THEMES_NAMES } from 'const';

import { createStore } from 'reusable';
import { useHistory } from 'react-router';

const useSiteDarkMode = () => {
  const history = useHistory();

  // get theme from system this is configuration from user browser
  const systemTheme = () =>
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEMES_NAMES.DARK
      : THEMES_NAMES.LIGHT;

  // get state theme from user local storage
  const getTheme = () => {
    const themeName = localStorage.getItem('theme') || systemTheme();
    return themeName !== null && typeof themeName !== 'undefined'
      ? themeName
      : 'light';
  };

  // set if is state dark mode
  const [themeName, setThemeName] = useState(getTheme());
  const refContainer = useRef(0);

  const setTheme = useCallback(
    nameTheme => {
      localStorage.setItem('theme', nameTheme);
      setThemeName(themeName);
      // reloads the page after change theme.
      if (refContainer.current > 0) history.go(0);
      else {
        refContainer.current = 1;
      }
    },
    [history, themeName]
  );

  // toggle switch between dark and light
  const toggleTheme = () => {
    const cTheme = getTheme();
    setTheme(
      cTheme === THEMES_NAMES.DARK ? THEMES_NAMES.LIGHT : THEMES_NAMES.DARK
    );
  };

  return {
    toggleTheme,
    setTheme,
    themeName,
  };
};

export default createStore(useSiteDarkMode);
