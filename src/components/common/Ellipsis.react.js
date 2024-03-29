import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Tooltip } from 'antd';
import { copyToClipboard } from 'utils';

const { Text } = Typography;

const DEFAULT_LENGTH = 30;

const Ellipsis = ({
  text,
  length,
  copyable,
  type,
  ellipsis,
  children,
  viewDisplayLine,
  style,
  ...props
}) => (
  <Tooltip title={copyable ? 'click to copy' : text || children}>
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
  type: PropTypes.string,
  ellipsis: PropTypes.bool,
  viewDisplayLine: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.string),
};

Ellipsis.defaultProps = {
  text: '',
  children: '',
  length: DEFAULT_LENGTH,
  copyable: false,
  ellipsis: true,
  type: null,
  viewDisplayLine: 'inline-flex',
  style: {},
};

export default Ellipsis;
