import { LOCAL_STORAGE_KEYS, normalizeThemeName } from 'const';
import ThemeCreator from './themes/ThemeCreator';

const syncThemeObject = (target, source) => {
  Object.keys(target).forEach(key => {
    if (!(key in source)) {
      Reflect.deleteProperty(target, key);
    }
  });

  Object.keys(source).forEach(key => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      targetValue.splice(0, targetValue.length, ...sourceValue);
    } else if (
      targetValue &&
      sourceValue &&
      typeof targetValue === 'object' &&
      typeof sourceValue === 'object' &&
      !Array.isArray(targetValue) &&
      !Array.isArray(sourceValue)
    ) {
      syncThemeObject(targetValue, sourceValue);
    } else {
      Object.assign(target, { [key]: sourceValue });
    }
  });
};

const initialThemeName = normalizeThemeName(
  localStorage.getItem(LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_THEME)
);
export const Theme = ThemeCreator(initialThemeName.toUpperCase());

export const applyTheme = themeName => {
  syncThemeObject(
    Theme,
    ThemeCreator(normalizeThemeName(themeName).toUpperCase())
  );
  return Theme;
};

export const {
  COLOR,
  COLOR_BOARDS,
  COLOR_LAYOUT,
  COLOR_PIPELINE_STATUS,
  COLOR_PIPELINE_TYPES,
  COLOR_PRIORITY,
  COLOR_SERVICE,
  COLOR_TASK_STATUS,
  COLOR_EXPERIMENTS,
  COLOR_STORAGE,
  NODE_KINDS_COLOR,
  Styles,
} = Theme;
