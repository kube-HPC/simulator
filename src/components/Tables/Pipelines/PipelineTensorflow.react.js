import { Checkbox } from 'antd';
import { useBoards } from 'hooks';
import PropTypes from 'prop-types';
import React from 'react';

const PipelineTensorflow = ({ name }) => {
  const { nodeMap } = useBoards();
  const nodeInfo = nodeMap[name];
  return <Checkbox checked={nodeInfo !== undefined} />;
};

PipelineTensorflow.propTypes = {
  name: PropTypes.string.isRequired,
};

export default PipelineTensorflow;
