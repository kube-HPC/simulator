import { Tag as AntdTag } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { COLOR_PIPELINE_STATUS } from 'styles';
import { toUpperCaseFirstLetter } from 'utils';

const Tag = styled(AntdTag)`
  margin: 0px;
`;

const ProgressStatus = ({ status }) => (
  <Tag color={COLOR_PIPELINE_STATUS[status]}>{toUpperCaseFirstLetter(status)}</Tag>
);

ProgressStatus.propTypes = {
  status: PropTypes.number.isRequired,
};

export default ProgressStatus;
