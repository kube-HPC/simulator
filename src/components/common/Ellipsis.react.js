import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Typography, Tooltip } from 'antd';
import { notification } from 'utils';

const { Text } = Typography;

const DEFAULT_LENGTH = 20;

const onCopy = () =>
  notification({
    message: 'Copied to clipboard',
    type: notification.TYPES.SUCCESS,
  });

const Ellipsis = ({ text, length, copyable, type, ellipsis, ...props }) => {
  const onClick = useCallback(() => {
    if (!copyable) return;
    navigator.clipboard.writeText(text);
    onCopy();
  }, [copyable, text]);

  return (
    <Tooltip title={text}>
      <Text
        onClick={onClick}
        style={{
          whiteSpace: 'nowrap',
          textOverflow: ellipsis ? 'ellipsis' : 'visible',
          ...(length ? { width: `${length}ch` } : {}),
        }}
        // eslint-disable-next-line
        type={type ? type : copyable && 'secondary'}
        // eslint-disable-next-line
        {...props}>
        {text}
      </Text>
    </Tooltip>
  );
};

Ellipsis.propTypes = {
  text: PropTypes.string,
  length: PropTypes.number,
  copyable: PropTypes.bool,
  type: PropTypes.string,
  ellipsis: PropTypes.bool,
};

Ellipsis.defaultProps = {
  text: '',
  length: DEFAULT_LENGTH,
  copyable: false,
  ellipsis: true,
  type: null,
};

export default Ellipsis;
