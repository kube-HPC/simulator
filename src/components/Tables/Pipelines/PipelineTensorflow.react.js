import { Tag } from 'antd';
import { useBoards } from 'hooks';
import PropTypes from 'prop-types';
import React, { memo } from 'react';

const PipelineTensorflow = ({ name }) => {
  const { nodeMap } = useBoards();
  const nodeInfo = nodeMap[name];
  return <Tag>{nodeInfo !== undefined ? 'Has Metrics' : 'Empty'}</Tag>;
};

PipelineTensorflow.propTypes = {
  name: PropTypes.string.isRequired,
};

export default memo(PipelineTensorflow);
