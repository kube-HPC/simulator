import { LOCAL_STORAGE_KEYS } from 'const';
import ThemeCreator from './themes/ThemeCreator';

const themeName =
  localStorage.getItem(LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_THEME) !== null &&
  localStorage.getItem(LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_THEME) !==
    'undefined'
    ? localStorage
        .getItem(LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_THEME)
        .toUpperCase()
    : 'LIGHT';
export const Theme = ThemeCreator(themeName);

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
