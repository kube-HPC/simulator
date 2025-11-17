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

  margin-right: ${props => (props.$isMinimized ? '0px !important;' : '8px')};
`;

const DotTag = styled(Tag)`
  margin-right: 0px !important;
  border: 1px solid
    ${props =>
      props.theme.Styles.CapitalizedTag?.borderType[props.$borderType] ||
      'inherit'};
  margin-left: 8px;
`;

const numberViewTypes = 1;
const JobTypes = ({ types = [], fullName = true, isMinimized = false }) => {
  const visibleTypes = isMinimized ? types.slice(0, 1) : types;

  return (
    <Overflow justify="center" gutter={0}>
      {visibleTypes &&
        visibleTypes.map(type =>
          fullName ? (
            <CapitalizedTag
              key={type}
              color={Theme.Styles.isTagFill ? COLOR_PIPELINE_TYPES[type] : ''}
              $borderType={type}
              $isMinimized={false}>
              {type}
            </CapitalizedTag>
          ) : (
            <Tooltip key={type} placement="top" title={toUpper(type)}>
              <CapitalizedTag
                color={Theme.Styles.isTagFill ? COLOR_PIPELINE_TYPES[type] : ''}
                $borderType={type}
                $isMinimized={isMinimized}>
                {type.slice(0, 2)}
              </CapitalizedTag>
            </Tooltip>
          )
        )}

      {isMinimized && types.length > numberViewTypes && (
        <Tooltip title={types.join(', ')}>
          <DotTag>...</DotTag>
        </Tooltip>
      )}
    </Overflow>
  );
};

JobTypes.propTypes = {
  types: PropTypes.arrayOf(PropTypes.string),
  fullName: PropTypes.bool,
  isMinimized: PropTypes.bool,
};

export default React.memo(JobTypes);
