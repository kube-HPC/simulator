import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import { COLOR_PIPELINE_STATUS } from 'styles';
import { toUpperCaseFirstLetter } from 'utils';

const ProgressStatus = ({ status }) => (
  <Tag color={COLOR_PIPELINE_STATUS[status]}>{toUpperCaseFirstLetter(status)}</Tag>
);

ProgressStatus.propTypes = {
  status: PropTypes.number.isRequired,
};

export default ProgressStatus;
