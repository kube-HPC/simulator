import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import { Typography, Icon } from 'antd';
import { FlexBox } from '../..';
import styled from 'styled-components';

const FlexBoxMinHeight = styled(FlexBox)`
  min-height: 30vh;
`;

const EmptyMarkdown = ({ message }) => (
  <FlexBoxMinHeight justify="center">
    <FlexBox.Item>
      <Typography>
        <Typography.Title level={3}>Your Readme is Empty</Typography.Title>
        <Typography.Paragraph>
          <Icon type="info-circle" /> Use <Typography.Text code>{message}</Typography.Text> action
        </Typography.Paragraph>
      </Typography>
    </FlexBox.Item>
  </FlexBoxMinHeight>
);

EmptyMarkdown.propTypes = {
  message: PropTypes.string.isRequired,
};

const DEFAULT = {
  message: '',
};

const MarkdownViewer = ({ source = undefined, config = DEFAULT }) =>
  source ? <ReactMarkdown source={source} /> : <EmptyMarkdown {...config} />;

MarkdownViewer.propTypes = {
  source: PropTypes.string,
  config: PropTypes.object,
};

export default MarkdownViewer;
