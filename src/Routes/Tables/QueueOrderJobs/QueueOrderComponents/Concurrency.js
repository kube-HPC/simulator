import React from 'react';
import { PauseCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

const Concurrency = isConcurrency =>
  isConcurrency ? (
    <Tooltip title="Concurrency">
      <PauseCircleOutlined />
    </Tooltip>
  ) : (
    ''
  );

export default Concurrency;
