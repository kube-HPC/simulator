import React from 'react';
import PropsTypes from 'prop-types';

import { Tooltip, Tag } from 'antd';
import { toUpperCaseFirstLetter } from 'utils/string';
import { COLOR_PIPELINE_STATUS } from 'styles/colors';

function StatusTag({ status, count }) {
  return (
    <Tooltip placement="top" title={status && toUpperCaseFirstLetter(status)}>
      <Tag color={COLOR_PIPELINE_STATUS[status]}>{count || 0}</Tag>
    </Tooltip>
  );
}

StatusTag.propsTypes = {
  status: PropsTypes.string.isRequired,
  count: PropsTypes.number.isRequired
};

export default StatusTag;
