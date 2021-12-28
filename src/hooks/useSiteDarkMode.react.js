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
      ? THEMES_NAMES.Dark
      : THEMES_NAMES.Light;

  // get state theme from user local storage
  const getTheme = () => localStorage.getItem('theme') || systemTheme();

  // set if is state dark mode
  const [themeName, setThemeName] = useState(getTheme());
  const [isDarkMode, setDarkMode] = useState(themeName === THEMES_NAMES.Dark);
  const refContainer = useRef(0);

  const setTheme = useCallback(
    nameTheme => {
      localStorage.setItem('theme', nameTheme);
      setThemeName(nameTheme);
      // reloads the page after change theme.
      if (refContainer.current > 0) history.go(0);
      else {
        setDarkMode(nameTheme === THEMES_NAMES.Dark);
        refContainer.current = 1;
      }
    },
    [history]
  );

  // toggle switch between dark and light
  const toggleTheme = () =>
    setTheme(
      getTheme() === THEMES_NAMES.Dark ? THEMES_NAMES.Light : THEMES_NAMES.Dark
    );

  return {
    isDarkMode,
    setDarkMode,
    toggleTheme,
    setTheme,
    themeName,
  };
};

export default createStore(useSiteDarkMode);
