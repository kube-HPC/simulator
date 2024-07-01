import React from 'react';
import PropTypes from 'prop-types';
import { COLOR_PIPELINE_STATUS } from 'styles/colors';

import BaseTag from './BaseTag';

export const StatusTag = ({
  status = null,
  count = null,
  colorMap = COLOR_PIPELINE_STATUS,
  isError = false,
}) => (
  <BaseTag key={status} status={status} colorMap={colorMap} isError={isError}>
    {Number.isInteger(count) ? count : `No Stats`}
  </BaseTag>
);

StatusTag.propTypes = {
  status: PropTypes.string,
  count: PropTypes.number,
  colorMap: PropTypes.objectOf(PropTypes.string),
  isError: PropTypes.bool,
};
