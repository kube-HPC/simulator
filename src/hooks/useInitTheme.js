import { LOCAL_STORAGE_KEYS } from 'const';
import { theme } from 'antd';

const getThemeProvider = themeName => {
  const { defaultAlgorithm, darkAlgorithm } = theme;

  switch (themeName?.toUpperCase()) {
    case 'LIGHT':
      return {
        algorithm: defaultAlgorithm,
        token: { padding: 10 },
      };
    case 'LIGHTSOUT':
      return {
        algorithm: darkAlgorithm,
        token: {
          colorBgBase: '#0a0f1a',
          colorTextBase: '#eaeef4',
          colorPrimary: '#4a5a6a',
          colorBgLayout: '#070b14',
          colorPrimaryBg: '#111520',
          colorBgElevated: '#0a0f1a ',
          colorBgContainer: '#0a0f1a',
          wireframe: false,
        },
        components: {
          Tooltip: {
            colorBgSpotlight: '#111520',
            colorTextLightSolid: '#7a8898',
          },
          Card: {
            colorBgContainer: '#0a0f1a',
          },
          Drawer: {
            colorBgElevated: '#0d1526',
          },
          Popover: {
            colorBgSpotlight: '#1a2820',
          },
        },
      };
    default:
      return { algorithm: defaultAlgorithm };
  }
};

const useInitTheme = () => {
  const themeName = localStorage.getItem(
    LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_THEME
  );
  return { themeProvider: getThemeProvider(themeName) };
};

export default useInitTheme;
