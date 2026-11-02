import { Tag, Tooltip } from 'antd';
import styled, { useTheme } from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';

const TagTheme = styled(Tag)`
  border: 1px solid ${props => props.$priorityColor};
`;

const JobPriority = ({ priority = 1 }) => {
  const theme = useTheme();
  const priorityData = theme.COLOR_PRIORITY[priority];

  return (
    <Tooltip placement="top" title={priority && priorityData?.name}>
      <TagTheme
        variant="solid"
        color={theme.Styles.isTagFill ? priorityData?.color : ''}
        $priorityColor={priority && priorityData?.color}>
        {priority && priorityData?.name.slice(0, 1)}
      </TagTheme>
    </Tooltip>
  );
};

JobPriority.propTypes = {
  priority: PropTypes.number,
};

export default React.memo(JobPriority);
