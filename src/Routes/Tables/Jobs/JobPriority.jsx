import { Tag, Tooltip } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import { COLOR_PRIORITY, Theme } from 'styles';

const TagTheme = styled(Tag)`
  border: 1px solid ${props => props.$priorityColor};
`;

const JobPriority = ({ priority = 1 }) => (
  <Tooltip placement="top" title={priority && COLOR_PRIORITY[priority].name}>
    <TagTheme
      color={Theme.Styles.isTagFill ? COLOR_PRIORITY[priority]?.color : ''}
      $priorityColor={priority && COLOR_PRIORITY[priority].color}>
      {priority && COLOR_PRIORITY[priority].name.slice(0, 1)}
    </TagTheme>
  </Tooltip>
);

JobPriority.propTypes = {
  priority: PropTypes.number,
};

export default React.memo(JobPriority);
