import React from 'react';
import styled from 'styled-components';
import { notification, Typography, Tooltip } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const { Text } = Typography;

const Center = styled.div`
  display: flex;
`;

const DEFAULT_LENGTH = 20;

const Ellipsis = ({ text, length, copyable, type, ellipsis, ...props }) => {
  const str = text ? text : '';
  const isOverlapped = str.length >= 20;

  const textComponent = (
    <Center>
      <Tooltip title={isOverlapped && ellipsis && str}>
        <Text ellipsis type={type ? type : copyable && 'secondary'} {...props}>
          {isOverlapped && ellipsis
            ? `${str.substring(0, DEFAULT_LENGTH)}...`
            : str}
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
};

export default Ellipsis;

Ellipsis.defaultProps = {
  ellipsis: true
};
