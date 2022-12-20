import { FlexBox } from 'components/common';
import React from 'react';
import GraphDirection from './GraphDirection.react';
import LogSource from './LogSource.react';
import LogMode from './LogMode.react';
import SetDefaultTime from './SetDefaultTime';

// import TypesSelect from './TypesSelect.react';

const Settings = () => (
  <FlexBox.Auto direction="column" gutter={[10, 10]}>
    <GraphDirection />
    <LogSource />
    <LogMode />
    <SetDefaultTime />
    {/* <TypesSelect /> */}
  </FlexBox.Auto>
);

export default Settings;
