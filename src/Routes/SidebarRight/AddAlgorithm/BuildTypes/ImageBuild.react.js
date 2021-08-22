import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { splitByDot } from 'utils';
import { Form } from 'components/common';
import schema from '../schema';

const {
  IMAGE: { ALGORITHM_IMAGE },
} = schema.BUILD_TYPES;

const ImageBuild = ({ required }) => (
  <Form.Item
    name={splitByDot(ALGORITHM_IMAGE.field)}
    label={ALGORITHM_IMAGE.label}
    rules={[{ required, message: ALGORITHM_IMAGE.message }]}>
    <Input placeholder={ALGORITHM_IMAGE.placeholder} />
  </Form.Item>
);

ImageBuild.propTypes = {
  required: PropTypes.bool.isRequired,
};

export default ImageBuild;
