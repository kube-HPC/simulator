import React from 'react';
import PropTypes from 'prop-types';
import { Form, Card, JsonEditor } from 'components/common';
import { Input } from 'antd';

const Initial = ({ required, getFieldDecorator, fileList, setFileList }) => (
  <>
    <Form.Item label="Name">
      <Input placeholder="Unique Identifier" />
    </Form.Item>
    <Form.Item label="Description">
      <Input.TextArea placeholder="Pipeline Description" />
    </Form.Item>
    <Form.Item label="Flow Input">
      <Card>
        <JsonEditor />
      </Card>
    </Form.Item>
  </>
);

Initial.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired,
  setFileList: PropTypes.func.isRequired,
  fileList: PropTypes.array.isRequired
};

export default Initial;
