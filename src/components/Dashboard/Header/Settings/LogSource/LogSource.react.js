import { Radio, Typography } from 'antd';
import { FlexBox } from 'components/common';
import React from 'react';

const logSource = {
  Kubernetes: 'k8s',
  'Elastic Search': 'es',
};

const LogSource = () => (
  <FlexBox.Auto>
    <Typography.Text strong>Log Source</Typography.Text>
    <Radio.Group disabled>
      {Object.entries(logSource).map(([key, value]) => (
        <Radio key={key} value={value}>
          {key}
        </Radio>
      ))}
    </Radio.Group>
  </FlexBox.Auto>
);

export default LogSource;
