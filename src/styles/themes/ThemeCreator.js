import COMMON_COLOR from './CommonColor';
import LightTheme from './light/LightTheme';
import lightsOutTheme from './lightsOut/LightsOutTheme';

const ThemeCreator = ThemeName => {
  const Themes = {
    LIGHT: LightTheme(COMMON_COLOR()),
    LIGHTSOUT: lightsOutTheme(COMMON_COLOR()),
  };

  return Themes[ThemeName];
};

export default ThemeCreator;
