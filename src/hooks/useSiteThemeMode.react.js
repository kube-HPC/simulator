import { useCallback } from 'react';
import { THEMES_NAMES, normalizeThemeName } from 'const';
import { useDispatch, useSelector } from 'react-redux';
import { updatePreferenceLocal } from 'reducers/preferences.reducer';
import { selectors } from 'reducers';

import { createStore } from 'reusable';

const useSiteThemeMode = () => {
  const dispatch = useDispatch();
  const themeName = useSelector(
    state => selectors.preferences(state).data.theme
  );

  const setTheme = useCallback(
    nameTheme => {
      dispatch(
        updatePreferenceLocal({
          section: 'theme',
          value: normalizeThemeName(nameTheme),
        })
      );
    },
    [dispatch]
  );

  const toggleTheme = useCallback(() => {
    setTheme(
      normalizeThemeName(themeName) === THEMES_NAMES.LIGHTSOUT
        ? THEMES_NAMES.LIGHT
        : THEMES_NAMES.LIGHTSOUT
    );
  }, [setTheme, themeName]);

  return {
    toggleTheme,
    setTheme,
    themeName: normalizeThemeName(themeName),
  };
};

export default createStore(useSiteThemeMode);
