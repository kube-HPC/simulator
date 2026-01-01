import React from 'react';
import { getColorByName } from 'utils';
import { Tag } from 'antd';

const TagColoByName = name => {
  if (name && name.length > 0) {
    const arrayTags = name.toString().split(',');

    return arrayTags.length > 0
      ? arrayTags.map(tag => <Tag color={getColorByName(tag)}>{tag}</Tag>)
      : 'No tag';
  }

  return 'No tag.';
};

export default TagColoByName;
