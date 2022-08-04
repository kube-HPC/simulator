import { Tag, Tooltip } from 'antd';
import { FlexBox } from 'components/common';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { COLOR_PIPELINE_TYPES, Theme } from 'styles';
import { toUpperCaseFirstLetter as toUpper } from 'utils';

const Overflow = styled(FlexBox.Auto)`
  overflow: auto;
  flex-wrap: wrap;
`;

const CapitalizedTag = styled(Tag)`
  text-transform: capitalize;
  border: 1px solid
    ${props =>
      props.theme.Styles.CapitalizedTag?.borderType[props.$borderType] ||
      'inherit'};
`;

const JobTypes = ({ types, fullName }) => (
  <Overflow justify="start" gutter={0}>
    {types &&
      types.map(type =>
        fullName ? (
          <CapitalizedTag
            key={type}
            color={Theme.Styles.isTagFill ? COLOR_PIPELINE_TYPES[type] : ''}
            $borderType={type}>
            {type}
          </CapitalizedTag>
        ) : (
          <Tooltip key={type} placement="top" title={toUpper(type)}>
            <CapitalizedTag
              color={Theme.Styles.isTagFill ? COLOR_PIPELINE_TYPES[type] : ''}
              $borderType={type}>
              {type.slice(0, 2)}
            </CapitalizedTag>
          </Tooltip>
        )
      )}
  </Overflow>
);

JobTypes.propTypes = {
  types: PropTypes.arrayOf(PropTypes.string),
  fullName: PropTypes.bool,
};

JobTypes.defaultProps = {
  fullName: true,
  types: [],
};

export default React.memo(JobTypes);
