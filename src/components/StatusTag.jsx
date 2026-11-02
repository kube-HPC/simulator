import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'styled-components';

import BaseTag from './BaseTag';

export const StatusTag = ({
  status = null,
  count = null,
  colorMap,
  isError = false,
}) => {
  const theme = useTheme();

  return (
    <BaseTag
      key={status}
      status={status}
      colorMap={colorMap || theme.COLOR_PIPELINE_STATUS}
      isError={isError}
      style={{ margin: '1px' }}>
      <span>{Number.isInteger(count) ? count : `No Stats`}</span>
    </BaseTag>
  );
};

StatusTag.propTypes = {
  status: PropTypes.string,
  count: PropTypes.number,
  colorMap: PropTypes.objectOf(PropTypes.string),
  isError: PropTypes.bool,
};
