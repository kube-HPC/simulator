export const THEMES_NAMES = {
  LIGHT: 'light',
  LIGHTSOUT: 'lightsOut',
};

export const normalizeThemeName = themeName => {
  const normalizedName = String(themeName ?? '')
    .replace(/[-_\s]/g, '')
    .toUpperCase();

  return ['LIGHTSOUT', 'LIGHTOUT', 'DARK'].includes(normalizedName)
    ? THEMES_NAMES.LIGHTSOUT
    : THEMES_NAMES.LIGHT;
};
