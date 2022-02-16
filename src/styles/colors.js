import ThemeCreator from './themes/ThemeCreator';

const themeName =
  localStorage.getItem('theme') !== null &&
  localStorage.getItem('theme') !== 'undefined'
    ? localStorage.getItem('theme').toUpperCase()
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
} = Theme;
