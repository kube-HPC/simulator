import { Tag, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { COLOR_PRIORITY } from 'styles';

const JobPriority = ({ priority }) => (
  <Tooltip placement="top" title={COLOR_PRIORITY[priority].name}>
    <Tag color={COLOR_PRIORITY[priority].color}>
      {COLOR_PRIORITY[priority].name.slice(0, 1)}
    </Tag>
  </Tooltip>
);

JobPriority.propTypes = {
  priority: PropTypes.number.isRequired,
};

export default JobPriority;
