import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

import { FormItem } from '../FormElements.react';
import addAlgorithmSchema from 'config/schema/addAlgorithm.schema';

const { IMAGE } = addAlgorithmSchema.BUILD_TYPES;

const ImageBuild = ({ buildType, getFieldDecorator }) => (
  <FormItem label={IMAGE.ALGORITHM_IMAGE.label}>
    {getFieldDecorator(IMAGE.ALGORITHM_IMAGE.field, {
      rules: [{ required: buildType === IMAGE.field, message: 'Image URL required' }]
    })(<Input placeholder="Insert URL" />)}
  </FormItem>
);

ImageBuild.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  buildType: PropTypes.string.isRequired
};

export default ImageBuild;
