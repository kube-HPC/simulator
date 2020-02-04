import { Tag, Tooltip } from 'antd';
import PropsTypes from 'prop-types';
import React from 'react';
import { COLOR_PIPELINE_STATUS } from 'styles/colors';
import { toUpperCaseFirstLetter } from 'utils/string';

const StatusTag = ({ status, count, colorMap = COLOR_PIPELINE_STATUS }) => (
  <Tooltip placement="top" title={status && toUpperCaseFirstLetter(status)}>
    <Tag color={colorMap[status]}>{Number.isInteger(count) ? count : `No Stats`}</Tag>
  </Tooltip>
);

StatusTag.propTypes = {
  status: PropsTypes.string,
  count: PropsTypes.number,
  colorMap: PropsTypes.object,
};

export default StatusTag;
