import { Tag, Tooltip } from 'antd';
import PropsTypes from 'prop-types';
import React from 'react';
import { COLOR_TASK_STATUS } from 'styles/colors';
import { toUpperCaseFirstLetter } from 'utils/string';

const StatusTag = ({ status, count }) => (
  <Tooltip placement="top" title={status && toUpperCaseFirstLetter(status)}>
    <Tag color={COLOR_TASK_STATUS[status]}>{Number.isInteger(count) ? count : `No Stats`}</Tag>
  </Tooltip>
);

StatusTag.propTypes = {
  status: PropsTypes.string,
  count: PropsTypes.number,
};

export default StatusTag;
