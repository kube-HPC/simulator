import React from 'react';
import { getColorByName } from 'utils';
import PropTypes from 'prop-types';
import { Tag, Tooltip } from 'antd';

const numberViewTags = 2;

const JobTags = ({ tags }) => {
  if (!tags || !Array.isArray(tags) || tags.length === 0) return null;
  return (
    <span>
      {tags.slice(0, numberViewTags).map(tag => (
        <Tooltip key={tag} title={tag}>
          <Tag color={getColorByName(tag)}>{String(tag).slice(0, 2)}</Tag>
        </Tooltip>
      ))}

      {tags.length > numberViewTags && (
        <Tooltip title={tags.join(', ')}>
          <Tag>...</Tag>
        </Tooltip>
      )}
    </span>
  );
};

JobTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
};

export default JobTags;
