import React from 'react';
import { ReactComponent as IconSun } from 'images/sun-icon.svg';
import { ReactComponent as IconMoon } from 'images/moon-icon.svg';

export const iconsThemes = {
  LIGHT: <IconMoon />,
  DARK: <IconSun />,
  LIGHTSOUT: <IconMoon />,
};

export const iconsThemesTitle = {
  LIGHT: 'Light Mode',
  DARK: 'Dark Mode',
  LIGHTSOUT: 'Lights Out',
};

export const headCssUrlThemes = {
  LIGHT: 'antd/dist/antd.css',
  DARK: 'antd/dist/antd.dark.css',
  LIGHTSOUT: 'antd/dist/antd.dark.css', // shares dark base
};
