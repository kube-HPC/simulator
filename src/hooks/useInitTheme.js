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
    case 'DARK':
      return {
        algorithm: darkAlgorithm,
        token: {
          colorBgBase: '#182039',
          colorTextBase: '#c5c5c5',
          colorInfo: '#180d31',
          colorPrimary: '#2e6fca',
          wireframe: false,
          colorBgLayout: '#180d31',
          colorPrimaryBg: '#252f58',
          components: {
            Table: { padding: 30 },
          },
        },
      };
    case 'LIGHTSOUT':
      return {
        algorithm: darkAlgorithm,
        token: {
          colorBgBase: '#0a0f1a',
          colorTextBase: '#c0c8d8',
          colorPrimary: '#1a5fa8',
          colorBgLayout: '#070b14',
          colorPrimaryBg: '#0d1e38',
          wireframe: false,
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
