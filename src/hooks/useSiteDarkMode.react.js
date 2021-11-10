import { useCallback, useState, useRef } from 'react';
import { createStore } from 'reusable';
import { useHistory } from 'react-router';

const useSiteDarkMode = () => {
  const history = useHistory();

  // const stylesheets = {
  //  light: 'https://cdnjs.cloudflare.com/ajax/libs/antd/4.16.10/antd.min.css',
  //  dark:
  //   'https://cdnjs.cloudflare.com/ajax/libs/antd/4.16.10/antd.dark.min.css',
  // };

  // const createStylesheetLink = () => {
  //  const link = document.createElement('link');
  // link.rel = 'stylesheet';
  //  link.id = 'antd-stylesheet';
  // document.head.appendChild(link);
  //  return link;
  // };

  // const getStylesheetLink = () =>
  //   document.head.querySelector('#antd-stylesheet') || createStylesheetLink();

  const systemTheme = () =>
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  const getTheme = () => localStorage.getItem('theme') || systemTheme();
  const [isDarkMode, setDarkMode] = useState(getTheme() === 'dark');

  const refContainer = useRef(0);

  const setTheme = useCallback(
    t => {
      localStorage.setItem('theme', t);

      if (refContainer.current > 0) history.go(0);
      else {
        setDarkMode(t === 'dark');
        refContainer.current = 1;
      }

      // getStylesheetLink().href = stylesheets[t]
      console.log(refContainer.current);
    },
    [history]
  );

  const toggleTheme = () => setTheme(getTheme() === 'dark' ? 'light' : 'dark');

  // const toggleMode = useCallback(() => setDarkMode(state => !state), [
  //  setDarkMode,
  // ]);
  return {
    isDarkMode,
    setDarkMode,
    toggleTheme,
    setTheme,
  };
};

export default createStore(useSiteDarkMode);
