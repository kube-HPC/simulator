import { Icon, Tag, Tooltip, Typography } from 'antd';
import { FlexBox } from 'components/common';
import { useConnectionStatus } from 'hooks';
import React from 'react';

const ConnectionStatus = () => {
  const { isSocketConnected } = useConnectionStatus();

  return (
    !isSocketConnected && (
      <Tag color="orange">
        <Tooltip title="Reconnecting to Socket...">
          <FlexBox.Auto>
            <Typography.Text>Offline Mode</Typography.Text>
            <Icon type="disconnect" />
          </FlexBox.Auto>
        </Tooltip>
      </Tag>
    )
  );
};

export default ConnectionStatus;
