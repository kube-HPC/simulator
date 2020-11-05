import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

import { Form } from 'components/common';
import schema from '../schema';

const {
  IMAGE: { ALGORITHM_IMAGE },
} = schema.BUILD_TYPES;

const ImageBuild = ({ required, getFieldDecorator }) => (
  <Form.Item label={ALGORITHM_IMAGE.label}>
    {getFieldDecorator(ALGORITHM_IMAGE.field, {
      rules: [{ required, message: ALGORITHM_IMAGE.message }],
    })(<Input placeholder={ALGORITHM_IMAGE.placeholder} />)}
  </Form.Item>
);

ImageBuild.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired,
};

export default ImageBuild;
