import { Tag as AntTag, Tooltip, Typography } from 'antd';
import { DisconnectOutlined } from '@ant-design/icons';
import { inactiveModeVar } from 'cache';
import { useReactiveVar } from '@apollo/client';
import React from 'react';
import styled from 'styled-components';

const Tag = styled(AntTag)`
  z-index: 1000;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 12px 24px;
  border-radius: 16px;
  border: solid 1px rgba(0, 0, 0, 0.15);
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
            <Typography.Title level={2} style={{ margin: 0, padding: 0 }}>
              Inactive Mode <DisconnectOutlined style={{ marginLeft: '1ch' }} />
            </Typography.Title>
          </Content>
        </Tooltip>
      </Tag>
    )
  );
};

export default InactiveModeTag;
