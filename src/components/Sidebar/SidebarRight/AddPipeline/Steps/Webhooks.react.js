import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'components/common';

const Webhooks = ({ required, getFieldDecorator, fileList, setFileList }) => (
  <>
    <Form.Item></Form.Item>
  </>
);

Webhooks.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired,
  setFileList: PropTypes.func.isRequired,
  fileList: PropTypes.array.isRequired
};

export default Webhooks;
