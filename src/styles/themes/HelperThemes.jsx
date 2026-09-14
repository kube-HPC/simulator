import React from 'react';
import { ReactComponent as IconMoon } from 'images/moon-icon.svg';
import { ReactComponent as IconSun } from 'images/sun-icon.svg';

export const iconsThemes = {
  LIGHT: <IconMoon />,
  LIGHTSOUT: <IconSun />,
};

export const iconsThemesTitle = {
  LIGHT: 'Light Mode',
  LIGHTSOUT: 'Lights Out',
};

export const headCssUrlThemes = {
  LIGHT: 'antd/dist/antd.css',
  LIGHTSOUT: 'antd/dist/antd.dark.css', // shares dark base
};
