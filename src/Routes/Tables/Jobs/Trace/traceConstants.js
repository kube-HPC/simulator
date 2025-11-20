// Trace colors based on Theme
export const getSystemColors = (isDark = false) => {
  if (isDark) {
    return {
      primary: '#40a9ff',
      blue: '#40a9ff',
      blueDark: '#1890ff',
      blueLight: '#69c0ff',
      green: '#52c41a',
      greenLight: '#73d13d',
      greenDark: '#389e0d',
      orange: '#d1811f',
      orangeLight: '#ffa940',
      red: '#b31b00',
      purple: '#b436bf',
      background: '#182039',
      cardBackground: '#242c48',
      border: '#586a93',
      borderLight: '#385e8d',
      text: '#d7d7d7',
      textSecondary: '#999999',
      hover: '#1e2753',
      lightGrey: '#2c3c60',
      minimapBg: '#2c3c60',
      services: {
        worker: '#da96e8',
        'trigger-service': '#4ea8de',
        'task-executor': '#ff9770',
        'resource-manager': '#4895ef',
        'resource-executor': '#ffd60a',
        'pipeline-driver': '#d62ad0',
        'pipeline-driver-queue': '#06ffa5',
        'api-server': '#7ae7ff',
        'algorithm-queue': '#7209b7',
        'algorithm-builder': '#0096c7',
        'algorithm-operator': '#d4f600',
        'caching-service': '#ff006e',
        'datasources-service': '#b185db',
        'eval-alg': '#4895ef',
        default: '#40a9ff',
      },
    };
  }

  // Light theme (original)
  return {
    primary: '#307fe6',
    blue: '#307fe6',
    blueDark: '#0065E5',
    blueLight: '#45a9ec',
    green: '#63C13C',
    greenLight: '#87d068',
    greenDark: '#4a8c2a',
    orange: '#ec8c16',
    orangeLight: '#EAB675',
    red: '#e74c3c',
    purple: '#C657D0',
    background: '#ffffff',
    cardBackground: '#fbfbfb',
    border: '#ededed',
    borderLight: '#f0f0f0',
    text: '#333333',
    textSecondary: '#807c7c',
    hover: '#f4faff',
    lightGrey: '#e8e8e8',
    minimapBg: '#f5f5f5',
    services: {
      worker: '#da96e8',
      'trigger-service': '#c5def5',
      'task-executor': '#f9d0c4',
      'resource-manager': '#1d76db',
      'resource-executor': '#fbca04',
      'pipeline-driver': '#b712c9',
      'pipeline-driver-queue': '#0ec994',
      'api-server': '#bfdadc',
      'algorithm-queue': '#5319e7',
      'algorithm-builder': '#006b75',
      'algorithm-operator': '#ccdd2c',
      'caching-service': '#b70949',
      'datasources-service': '#a480d1',
      'eval-alg': '#1d76db',
      default: '#1d76db',
    },
  };
};

// Default export for backward compatibility
export const systemColors = getSystemColors(false);

export const MINIMAP_HEIGHT = 100;

// Helper to detect current theme
export const getCurrentTheme = () => {
  const storedTheme = localStorage.getItem('hkubeTheme');
  return storedTheme?.toUpperCase() === 'DARK' ? 'DARK' : 'LIGHT';
};

// Get colors based on current theme
export const getThemeColors = () => {
  const isDark = getCurrentTheme() === 'DARK';
  return getSystemColors(isDark);
};
