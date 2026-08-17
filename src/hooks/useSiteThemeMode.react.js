import { useCallback, useState, useRef } from 'react';
import { THEMES_NAMES, LOCAL_STORAGE_KEYS } from 'const';
import { useDispatch } from 'react-redux';
import { updatePreferenceLocal } from 'reducers/preferences.reducer';

import { createStore } from 'reusable';
import { useNavigate } from 'react-router';

const useSiteThemeMode = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // get state theme from user local storage
  const getTheme = () => {
    const themeName = localStorage.getItem(
      LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_THEME
    );
    return themeName != null ? themeName : 'light';
  };

  // set if is state dark mode
  const [themeName, setThemeName] = useState(getTheme());
  const refContainer = useRef(0);

  const setTheme = useCallback(
    nameTheme => {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_THEME,
        nameTheme
      );
      setThemeName(themeName);
      // Update preferences (local only — saved when user clicks Save Preferences)
      dispatch(updatePreferenceLocal({ section: 'theme', value: nameTheme }));
      // reloads the page after change theme.
      if (refContainer.current > 0) navigate(0);
      else {
        refContainer.current = 1;
      }
    },
    [navigate, themeName, dispatch]
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

export default createStore(useSiteThemeMode);
