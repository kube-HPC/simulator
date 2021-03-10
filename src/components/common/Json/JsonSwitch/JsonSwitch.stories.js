import React from 'react';
import { SB_SECTIONS } from 'const';
import { algorithmMock } from 'config/mock';
import JsonSwitch from '.';


export default {
  title: `${SB_SECTIONS.JSON}Json Switch`,
};

export const Default = () => <JsonSwitch obj={algorithmMock} />;
