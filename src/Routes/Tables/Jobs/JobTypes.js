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

const CapitalizedTag = styled(Tag)`
  text-transform: capitalize;
`;

const JobTypes = ({ types, fullName }) => (
  <Overflow justify="start" gutter={0}>
    {types.map(type =>
      fullName ? (
        <CapitalizedTag key={type} color={COLOR_PIPELINE_TYPES[type]}>
          {type}
        </CapitalizedTag>
      ) : (
        <Tooltip key={type} placement="top" title={toUpper(type)}>
          <CapitalizedTag color={COLOR_PIPELINE_TYPES[type]}>
            {type.slice(0, 2)}
          </CapitalizedTag>
        </Tooltip>
      )
    )}
  </Overflow>
);

JobTypes.propTypes = {
  types: PropTypes.arrayOf(PropTypes.string).isRequired,
  fullName: PropTypes.bool,
};

JobTypes.defaultProps = {
  fullName: true,
};

export default React.memo(JobTypes);
