import { Tag, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { COLOR_PRIORITY, COLOR_PRIORITY_TEMPLATE } from 'styles';
import styled from 'styled-components';

const TagTheme = styled(Tag)`
  border: 1px solid ${props => props.priorityColor};
`;

const JobPriority = ({ priority }) => (
  <Tooltip placement="top" title={COLOR_PRIORITY[priority].name}>
    <TagTheme
      color={COLOR_PRIORITY_TEMPLATE[priority]?.color}
      priorityColor={COLOR_PRIORITY[priority].color}>
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
