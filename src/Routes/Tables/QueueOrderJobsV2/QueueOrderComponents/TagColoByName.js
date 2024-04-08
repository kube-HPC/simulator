import React from 'react';
import { getColorByName } from 'utils';
import { Tag } from 'antd';

const TagColoByName = name => {
  if (name && name.length > 0) {
    const arrayTags = name.toString().split(',');

    return arrayTags.length > 0
      ? arrayTags.map(tagName => (
          <Tag color={getColorByName(tagName)}>{tagName}</Tag>
        ))
      : 'No tag';
  }

  return 'No tag.';
};

export default TagColoByName;
