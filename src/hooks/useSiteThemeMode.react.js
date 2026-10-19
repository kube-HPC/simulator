import { useCallback, useState } from 'react';
import { THEMES_NAMES, LOCAL_STORAGE_KEYS } from 'const';
import { useDispatch } from 'react-redux';
import { updatePreferenceLocal } from 'reducers/preferences.reducer';

import { createStore } from 'reusable';

const useSiteThemeMode = () => {
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

  const setTheme = useCallback(
    nameTheme => {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_THEME,
        nameTheme
      );
      setThemeName(nameTheme);
      dispatch(
        updatePreferenceLocal({
          section: 'theme',
          value: nameTheme,
          reloadAfterSave: true,
        })
      );
    },
    [dispatch]
  );

  // toggle switch between lights out and light
  const toggleTheme = () => {
    const cTheme = getTheme();
    setTheme(
      cTheme === THEMES_NAMES.LIGHTSOUT
        ? THEMES_NAMES.LIGHT
        : THEMES_NAMES.LIGHTSOUT
    );
  };

  return {
    toggleTheme,
    setTheme,
    themeName,
  };
};

export default createStore(useSiteThemeMode);
