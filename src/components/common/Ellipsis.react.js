import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Tooltip } from 'antd';
import { copyToClipboard } from 'utils';

const { Text } = Typography;

const DEFAULT_LENGTH = 20;

const Ellipsis = ({
  text,
  length,
  copyable,
  type,
  ellipsis,
  children,
  ...props
}) => (
  <Tooltip title={text}>
    <Text
      onClick={() => (copyable ? copyToClipboard(text) : null)}
      style={{
        whiteSpace: 'nowrap',
        textOverflow: ellipsis ? 'ellipsis' : 'visible',
        ...(length ? { width: `${length}ch` } : {}),
      }}
      // eslint-disable-next-line
      type={type ? type : copyable && 'secondary'}
      // eslint-disable-next-line
      {...props}>
      {text || children}
    </Text>
  </Tooltip>
);

Ellipsis.propTypes = {
  text: PropTypes.string,
  children: PropTypes.string,
  length: PropTypes.number,
  copyable: PropTypes.bool,
  type: PropTypes.string,
  ellipsis: PropTypes.bool,
};

Ellipsis.defaultProps = {
  text: '',
  children: '',
  length: DEFAULT_LENGTH,
  copyable: false,
  ellipsis: true,
  type: null,
};

export default Ellipsis;
