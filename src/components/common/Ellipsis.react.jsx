import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Tooltip } from 'antd';
import { copyToClipboard } from 'utils';

const { Text } = Typography;

const DEFAULT_LENGTH = 30;

const Ellipsis = ({
  text = '',
  length = DEFAULT_LENGTH,
  copyable = false,
  ellipsis = true,
  children = '',
  viewDisplayLine = 'inline-flex',
  style = {},
  ...props
}) => (
  <Tooltip title={copyable ? 'Click to copy' : text || children}>
    <Text
      onClick={() => (copyable ? copyToClipboard(text) : null)}
      style={{
        cursor: 'pointer',
        lineHeight: '2',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        display: viewDisplayLine,
        textOverflow: ellipsis ? 'ellipsis' : 'visible',
        ...(length ? { width: `${length * 5}px` } : {}),
        ...style,
      }}
      {...props}>
      {text || children}
    </Text>
  </Tooltip>
);

Ellipsis.propTypes = {
  text: PropTypes.string,
  children: PropTypes.node,
  length: PropTypes.number,
  copyable: PropTypes.bool,
  ellipsis: PropTypes.bool,
  viewDisplayLine: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.string),
};

export default Ellipsis;
