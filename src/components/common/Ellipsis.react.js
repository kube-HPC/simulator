import React from 'react';
import styled from 'styled-components';
import { notification, Typography, Tooltip } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const { Text } = Typography;

const Center = styled.div`
  display: flex;
`;

const DEFAULT_LENGTH = 20;
const onCopy = () => notification.success({ message: 'Copied to clipboard' });

const Ellipsis = ({ text, length, copyable, type, ellipsis, ...props }) => {
  const textLength = length || DEFAULT_LENGTH;
  const str = text ? text : '';
  const isOverlapped = str.length >= textLength;

  const textComponent = (
    <Center>
      <Tooltip title={isOverlapped && ellipsis && str}>
        <Text ellipsis type={type ? type : copyable && 'secondary'} {...props}>
          {isOverlapped && ellipsis ? `${str.substring(0, textLength)}...` : str}
        </Text>
      </Tooltip>
    </Center>
  );

  const copyableComponent = copyable ? (
    <CopyToClipboard text={str} onCopy={onCopy}>
      {textComponent}
    </CopyToClipboard>
  ) : (
    textComponent
  );

  return copyableComponent;
};

export default Ellipsis;

Ellipsis.defaultProps = {
  ellipsis: true
};
