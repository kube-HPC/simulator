import { Tag, Tooltip } from 'antd';
import PropsTypes from 'prop-types';
import React from 'react';
import { COLOR_PIPELINE_STATUS } from 'styles/colors';
import { toUpperCaseFirstLetter } from 'utils/string';

const StatusTag = ({ status, count }) => (
  <Tooltip placement="top" title={status && toUpperCaseFirstLetter(status)}>
    <Tag color={COLOR_PIPELINE_STATUS[status]}>{count || `No Stats`}</Tag>
  </Tooltip>
);

StatusTag.propTypes = {
  status: PropsTypes.string,
  count: PropsTypes.number.isRequired,
};

export default StatusTag;
