import COMMON_COLOR from './CommonColor';
import DarkTheme from './dark/DarkTheme';
import LightTheme from './light/LightTheme';

const ThemeCreator = ThemeName => {
  const Themes = {
    DARK: DarkTheme(COMMON_COLOR()),
    LIGHT: LightTheme(COMMON_COLOR()),
  };

  return Themes[ThemeName];
};

export default ThemeCreator;
