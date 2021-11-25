import { Tag, Tooltip } from 'antd';
import { FlexBox } from 'components/common';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { COLOR_PIPELINE_TYPES } from 'styles';
import { toUpperCaseFirstLetter as toUpper } from 'utils';
import { useSiteDarkMode } from 'hooks';

const Overflow = styled(FlexBox.Auto)`
  overflow: auto;
  flex-wrap: wrap;
`;

const CapitalizedTag = styled(Tag)`
  text-transform: capitalize;
`;

const JobTypes = ({ types, fullName }) => {
  const { isDarkMode } = useSiteDarkMode();

  return (
    <Overflow justify="start" gutter={0}>
      {types !== undefined &&
        types.map(type =>
          fullName ? (
            <CapitalizedTag
              key={type}
              color={isDarkMode ? '' : COLOR_PIPELINE_TYPES[type]}
              style={{
                border: isDarkMode
                  ? `1px solid ${COLOR_PIPELINE_TYPES[type]}`
                  : undefined,
              }}>
              {type}
            </CapitalizedTag>
          ) : (
            <Tooltip key={type} placement="top" title={toUpper(type)}>
              <CapitalizedTag
                color={isDarkMode ? '' : COLOR_PIPELINE_TYPES[type]}
                style={{
                  border: isDarkMode
                    ? `1px solid ${COLOR_PIPELINE_TYPES[type]}`
                    : undefined,
                }}>
                {type.slice(0, 2)}
              </CapitalizedTag>
            </Tooltip>
          )
        )}
    </Overflow>
  );
};

JobTypes.propTypes = {
  types: PropTypes.arrayOf(PropTypes.string),
  fullName: PropTypes.bool,
};

JobTypes.defaultProps = {
  fullName: true,
  types: [],
};

export default React.memo(JobTypes);
