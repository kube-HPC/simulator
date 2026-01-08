import React from 'react';
import { ReactComponent as IconSun } from 'images/sun-icon.svg';
import { ReactComponent as IconMoon } from 'images/moon-icon.svg';

export const iconsThemes = {
  LIGHT: <IconMoon />,
  DARK: <IconSun />,
};

export const iconsThemesTitle = {
  LIGHT: 'Switch to Dark Mode',
  DARK: 'Switch to Light Mode',
};

export const headCssUrlThemes = {
  LIGHT: 'antd/dist/antd.css',
  DARK: 'antd/dist/antd.dark.css',
};
