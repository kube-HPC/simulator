import { Tag as AntTag, Tooltip, Typography } from 'antd';
import { DisconnectOutlined } from '@ant-design/icons';
import { inactiveModeVar } from 'cache';
import { useReactiveVar } from '@apollo/client';
import React from 'react';
import styled from 'styled-components';

const Tag = styled(AntTag)`




`;

const Content = styled.span`
  white-space: nowrap;
`;

const InactiveModeTag = () => {
  const inactiveMode = useReactiveVar(inactiveModeVar);
  return (
    inactiveMode && (
      <Tag color="green">
        <Tooltip title="Reconnecting to Socket...">
          <Content>
            <Typography.Text>Inactive Mode</Typography.Text>
            <DisconnectOutlined style={{ marginLeft: '1ch' }} />
          </Content>
        </Tooltip>
      </Tag>
    )
  );
};

export default InactiveModeTag;
