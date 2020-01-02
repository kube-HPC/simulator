import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Tooltip } from 'antd';
import { COLOR_PIPELINE_TYPES } from 'styles';
import { FlexBox } from 'components/common';
import { toUpperCaseFirstLetter as toUpper } from 'utils';

const JobTypes = ({ types }) => (
  <FlexBox.Auto justify="start" gutter={0}>
    {types.map(type => (
      <Tooltip key={type} placement="top" title={toUpper(type)}>
        <Tag color={COLOR_PIPELINE_TYPES[type]}>{toUpper(type.slice(0, 2))}</Tag>
      </Tooltip>
    ))}
  </FlexBox.Auto>
);

JobTypes.propTypes = {
  types: PropTypes.array.isRequired,
};

export default JobTypes;
