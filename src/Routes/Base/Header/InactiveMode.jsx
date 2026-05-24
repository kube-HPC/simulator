import { Tag as AntTag, Tooltip, Typography } from 'antd';
import { selectors } from 'reducers';
import { DisconnectOutlined } from '@ant-design/icons';
import { inactiveModeVar } from 'cache';
import { useReactiveVar } from '@apollo/client';
import { useSelector } from 'react-redux';
import React from 'react';
import styled from 'styled-components';

const BaseTag = styled(AntTag)``;

const SmallTag = styled(BaseTag)`
  position: absolute;
  right: 1em;
  top: 50%;
  transform: translateY(-50%);
`;

const BigTag = styled(BaseTag)`
  z-index: 1000;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 12px 24px;
  border-radius: 16px;
  border: solid 1px rgba(0, 0, 0, 0.15);

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const Content = styled.span`
  white-space: nowrap;
`;

const InactiveModeTag = () => {
  const inactiveMode = useReactiveVar(inactiveModeVar);

  const { healthMonitoringEnabled } = useSelector(selectors.connection);

  if (!inactiveMode) return null;

  const Wrapper = healthMonitoringEnabled ? BigTag : SmallTag;

  return (
    <Wrapper color="green">
      <Tooltip title="Reconnecting to Socket...">
        <Content>
          {healthMonitoringEnabled ? (
            <Typography.Title level={2} style={{ margin: 0 }}>
    inactiveMode && (
      <Tag>
        <Tooltip title="Reconnecting to Socket...">
          <Content>
            <Typography.Title level={2} style={{ margin: 0, padding: 0 }}>
              Inactive Mode <DisconnectOutlined style={{ marginLeft: '1ch' }} />
            </Typography.Title>
          ) : (
            <>
              <Typography.Text>Inactive Mode</Typography.Text>
              <DisconnectOutlined style={{ marginLeft: '1ch' }} />
            </>
          )}
        </Content>
      </Tooltip>
    </Wrapper>
  );
};

export default InactiveModeTag;
