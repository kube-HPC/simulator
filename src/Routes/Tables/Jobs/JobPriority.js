import { Tag, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { COLOR_PRIORITY } from 'styles';
import { useSiteDarkMode } from 'hooks';

const JobPriority = ({ priority }) => {
  const { isDarkMode } = useSiteDarkMode();

  return (
    <Tooltip placement="top" title={COLOR_PRIORITY[priority].name}>
      <Tag
        color={isDarkMode ? '' : COLOR_PRIORITY[priority].color}
        style={{
          border: isDarkMode
            ? `1px solid ${COLOR_PRIORITY[priority].color}`
            : undefined,
        }}>
        {COLOR_PRIORITY[priority].name.slice(0, 1)}
      </Tag>
    </Tooltip>
  );
};

JobPriority.propTypes = {
  priority: PropTypes.number,
};

JobPriority.defaultProps = {
  priority: 1,
};

export default React.memo(JobPriority);
