import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { FlexBox } from 'components/common';
import InputsController from 'Routes/SidebarRight/AddPipeline/Steps/Nodes/InputParseJson/Controller.react';

const AlgorithmRun = ({ onChange, onRun }) => (
  <FlexBox.Auto direction="column" full gutter={[0, 10]}>
    <InputsController onChange={onChange} />
    <Button type="primary" block size="small" onClick={onRun}>
      Run
    </Button>
  </FlexBox.Auto>
);

AlgorithmRun.propTypes = {
  onChange: PropTypes.func.isRequired,
  onRun: PropTypes.func.isRequired,
};

export default AlgorithmRun;
