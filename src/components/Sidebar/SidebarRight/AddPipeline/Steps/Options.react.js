import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'components/common';

const Options = ({ required, getFieldDecorator, fileList, setFileList }) => (
  <>
    <Form.Item></Form.Item>
  </>
);

Options.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired,
  setFileList: PropTypes.func.isRequired,
  fileList: PropTypes.array.isRequired
};

export default Options;
