import { FlexBox } from 'components/common';
import React from 'react';
import GraphDirection from './GraphDirection.react';
import LogSource from './LogSource.react';
import LogMode from './LogMode.react';
import TypesSelect from './TypesSelect.react';

const Settings = () => (
  <FlexBox.Auto direction="column" gutter={[10, 10]}>
    <GraphDirection />
    <LogSource />
    <LogMode />
    <TypesSelect />
  </FlexBox.Auto>
);

export default Settings;
