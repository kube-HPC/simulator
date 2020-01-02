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
  <Overflow justify="center" gutter={0}>
    {types.map(type =>
      fullName ? (
        <Tag key={type} color={COLOR_PIPELINE_TYPES[type]}>
          {toUpper(type)}
        </Tag>
      ) : (
        <Tooltip key={type} placement="top" title={toUpper(type)}>
          <Tag color={COLOR_PIPELINE_TYPES[type]}>{toUpper(type.slice(0, 2))}</Tag>
        </Tooltip>
      ),
    )}
  </Overflow>
);

JobTypes.propTypes = {
  types: PropTypes.array.isRequired,
  fullName: PropTypes.bool,
};

export default JobTypes;
