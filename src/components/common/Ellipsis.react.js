import React from 'react';
import styled from 'styled-components';
import { notification, Typography, Tooltip } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const { Text } = Typography;

const Center = styled.div`
  display: flex;
`;

const DEFAULT_LENGTH = 20;

export default function Ellipsis({ text, length, copyable, type, ...props }) {
  const str = text ? text : '';
  const isOverlapped = str.length >= 20;

  const textComponent = (
    <Center>
      <Tooltip title={isOverlapped && str}>
        <Text type={type ? type : copyable && 'secondary'} {...props}>
          {isOverlapped ? `${str.substring(0, DEFAULT_LENGTH)}...` : str}
        </Text>
      </Tooltip>
    </Center>
  );

  const copyableComponent = copyable ? (
    <CopyToClipboard
      text={str}
      onCopy={() => notification.success({ message: 'Copied to clipboard' })}
    >
      {textComponent}
    </CopyToClipboard>
  ) : (
    textComponent
  );

  return copyableComponent;
}
