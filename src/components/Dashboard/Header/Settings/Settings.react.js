import { FlexBox } from 'components/common';
import React from 'react';
import GraphDirection from './GraphDirection/GraphDirection.react';
import LogSource from './LogSource/LogSource.react';
import TypesSelect from './TypesSelect/TypesSelect.react';

const Settings = () => (
  <FlexBox.Auto direction="column" gutter={[10, 10]}>
    <GraphDirection />
    <LogSource />
    <TypesSelect />
  </FlexBox.Auto>
);

export default Settings;
