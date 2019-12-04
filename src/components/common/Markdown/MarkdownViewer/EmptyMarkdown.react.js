import React from 'react';
import styled from 'styled-components';
import { Typography, Icon } from 'antd';
import { FlexBox } from '../..';

const FlexBoxMinHeight = styled(FlexBox)`
  min-height: 30vh;
`;

const EmptyMarkdown = () => (
  <FlexBoxMinHeight justify="center">
    <FlexBox.Item>
      <Typography>
        <Typography.Title level={3}>Your Readme is Empty</Typography.Title>
        <Typography.Paragraph>
          <Icon type="info-circle" /> Use <Typography.Text code>Update Algorithm</Typography.Text>{' '}
          action
        </Typography.Paragraph>
      </Typography>
    </FlexBox.Item>
  </FlexBoxMinHeight>
);

export default EmptyMarkdown;
