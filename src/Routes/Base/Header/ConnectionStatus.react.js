import { Icon, Tag as AntTag, Tooltip, Typography } from 'antd';
import { useConnectionStatus } from 'hooks';
import React from 'react';
import styled from 'styled-components';

const Tag = styled(AntTag)`
  position: absolute;
  right: 1em;
  top: 50%;
  transform: translateY(-50%);
`;

const Content = styled.span`
  white-space: nowrap;
`;

const ConnectionStatus = () => {
  const { isSocketConnected } = useConnectionStatus();

  return (
    !isSocketConnected && (
      <Tag color="orange">
        <Tooltip title="Reconnecting to Socket...">
          <Content>
            <Typography.Text>Offline Mode</Typography.Text>
            <Icon type="disconnect" style={{ marginLeft: '1ch' }} />
          </Content>
        </Tooltip>
      </Tag>
    )
  );
};

export default ConnectionStatus;
