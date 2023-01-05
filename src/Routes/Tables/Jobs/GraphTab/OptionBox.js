import PropTypes from 'prop-types';
import React from 'react';
import BaseTag from 'components/BaseTag';
import { COLOR_TASK_STATUS } from 'styles/colors';
import { Tag } from 'antd';
import { FlexBox } from 'components/common';

const OptionBox = ({ index, taskId, status }) => (
  <FlexBox justify="start">
    <FlexBox.Item>
      <Tag>{index}</Tag>
    </FlexBox.Item>
    <FlexBox.Item>{taskId}</FlexBox.Item>
    <BaseTag status={status} colorMap={COLOR_TASK_STATUS}>
      {status}
    </BaseTag>
  </FlexBox>
);

OptionBox.propTypes = {
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  taskId: PropTypes.string,
  status: PropTypes.string,
};
OptionBox.defaultProps = {
  taskId: null,
  status: null,
};

export default OptionBox;
