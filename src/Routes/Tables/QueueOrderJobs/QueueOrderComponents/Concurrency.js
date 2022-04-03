import React from 'react';
import { Tooltip } from 'antd';
import { IconConcurrency } from '../OrderStyles';

const Concurrency = isConcurrency =>
  isConcurrency ? (
    <Tooltip title="Concurrency">
      <IconConcurrency />
    </Tooltip>
  ) : (
    ''
  );

export default Concurrency;
