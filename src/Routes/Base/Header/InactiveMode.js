import { Icon, Tag as AntTag, Tooltip, Typography } from 'antd';
import { inactiveModeVar } from 'cache';
import { useReactiveVar } from '@apollo/client';
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

const InactiveModeTag = () => {
  const inactiveMode = useReactiveVar(inactiveModeVar);
  return (
    inactiveMode && (
      <Tag color="green">
        <Tooltip title="Reconnecting to Socket...">
          <Content>
            <Typography.Text>Inactive Mode</Typography.Text>
            <Icon type="disconnect" style={{ marginLeft: '1ch' }} />
          </Content>
        </Tooltip>
      </Tag>
    )
  );
};

export default InactiveModeTag;
