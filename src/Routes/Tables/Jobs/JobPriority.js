import { Tag, Tooltip } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import { COLOR_PRIORITY, Theme } from 'styles';

const TagTheme = styled(Tag)`
  border: 1px solid ${props => props.$priorityColor};
`;

const JobPriority = ({ priority }) => (
  <Tooltip placement="top" title={COLOR_PRIORITY[priority].name}>
    <TagTheme
      color={Theme.Styles.isTagFill ? COLOR_PRIORITY[priority]?.color : ''}
      $priorityColor={COLOR_PRIORITY[priority].color}>
      {COLOR_PRIORITY[priority].name.slice(0, 1)}
    </TagTheme>
  </Tooltip>
);

JobPriority.propTypes = {
  priority: PropTypes.number,
};

JobPriority.defaultProps = {
  priority: 1,
};

export default React.memo(JobPriority);
