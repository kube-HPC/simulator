import React from 'react';
import { SB_SECTIONS } from 'const';
import JsonSwitch from './JsonSwitch.react';

import { algorithmMock } from 'config/mock';

export default {
  title: `${SB_SECTIONS.COMMON}|Json Switch`,
};

export const Default = () => <JsonSwitch obj={algorithmMock} />;
