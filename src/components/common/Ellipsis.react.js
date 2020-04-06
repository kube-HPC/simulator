import React from 'react';
import styled from 'styled-components';
import { Typography, Tooltip } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { notification } from 'utils';

const { Text } = Typography;

const Center = styled.div`
  display: flex;
`;

const DEFAULT_LENGTH = 20;

const onCopy = () =>
  notification({ message: 'Copied to clipboard', type: notification.TYPES.SUCCESS });

const Ellipsis = ({
  text = '',
  length = DEFAULT_LENGTH,
  copyable,
  type,
  ellipsis = true,
  ...props
}) => {
  const isOverlapped = text && text.length >= length;

  const textComponent = (
    <Center>
      <Tooltip title={isOverlapped && ellipsis && text}>
        <Text ellipsis type={type ? type : copyable && 'secondary'} {...props}>
          {isOverlapped && ellipsis ? `${text.substring(0, length)}...` : text}
        </Text>
      </Tooltip>
    </Center>
  );

  const copyableComponent = copyable ? (
    <CopyToClipboard text={text} onCopy={onCopy}>
      {textComponent}
    </CopyToClipboard>
  ) : (
    textComponent
  );

  return copyableComponent;
};

export default Ellipsis;

Ellipsis.defaultProps = {
  ellipsis: true,
};
