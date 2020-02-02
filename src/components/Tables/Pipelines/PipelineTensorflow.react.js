import { Checkbox } from 'antd';
import { useBoards } from 'hooks';
import PropTypes from 'prop-types';
import React from 'react';

const PipelineTensorflow = ({ name }) => {
  const { nodeMap } = useBoards();
  const hasMetrics = nodeMap[name];
  return <Checkbox checked={hasMetrics} />;
};

PipelineTensorflow.propTypes = {
  name: PropTypes.string.isRequired,
};

export default PipelineTensorflow;
