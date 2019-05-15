import React from 'react';
import PropsTypes from 'prop-types';

import { Tooltip, Tag } from 'antd';
import { toUpperCaseFirstLetter } from 'utils/string';
import { STATUS } from 'constants/colors';

function StatusTag({ status, count }) {
  return (
    <Tooltip placement="top" title={toUpperCaseFirstLetter(status)}>
      <Tag color={STATUS[status]}>{[count]}</Tag>
    </Tooltip>
  );
}

StatusTag.propsTypes = {
  status: PropsTypes.string.isRequired,
  count: PropsTypes.number.isRequired
};

export default StatusTag;
