import { Tag, Tooltip } from 'antd';
import { FlexBox } from 'components/common';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { COLOR_PIPELINE_TYPES } from 'styles';
import { toUpperCaseFirstLetter as toUpper } from 'utils';

const Overflow = styled(FlexBox.Auto)`
  overflow: auto;
  flex-wrap: wrap;
`;

const JobTypes = ({ types, fullName = true }) => (
  <Overflow justify="start" gutter={0}>
    {types.map(type =>
      fullName ? (
        <Tag key={type} color={COLOR_PIPELINE_TYPES[type]}>
          {toUpper(type)}
        </Tag>
      ) : (
        <Tooltip key={type} placement="top" title={toUpper(type)}>
          <Tag color={COLOR_PIPELINE_TYPES[type]}>
            {toUpper(type.slice(0, 2))}
          </Tag>
        </Tooltip>
      )
    )}
  </Overflow>
);

JobTypes.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  types: PropTypes.array.isRequired,
  // TODO: fill missing default value
  // eslint-disable-next-line
  fullName: PropTypes.bool,
};

export default React.memo(JobTypes);
