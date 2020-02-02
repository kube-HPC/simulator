import { Tag as AntdTag, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { COLOR_PIPELINE_STATUS } from 'styles';
import { toUpperCaseFirstLetter } from 'utils';

const Tag = styled(AntdTag)`
  margin: 0px;
`;

const ProgressStatus = ({ status }) => (
  <Tooltip justify="center" title={status.error}>
    <Tag color={COLOR_PIPELINE_STATUS[status.status]}>{toUpperCaseFirstLetter(status.status)}</Tag>
  </Tooltip>
);

ProgressStatus.propTypes = {
  status: PropTypes.object.isRequired,
};

export default ProgressStatus;
