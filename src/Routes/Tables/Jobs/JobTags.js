import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';

const JobTags = ({ tags }) => {
  if (!tags || !Array.isArray(tags) || tags.length === 0) return null;
  return (
    <span>
      {tags.map(tag => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </span>
  );
};

JobTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
};

export default JobTags;
