import React from 'react';
import PropTypes from 'prop-types';
import { Form, Card, JsonEditor } from 'components/common';
import { Input } from 'antd';
import addPipelineSchema from 'config/schema/addPipeline.schema';

const { NAME, DESCRIPTION, FLOW_INPUT } = addPipelineSchema.INITIAL;

const Initial = ({ required, getFieldDecorator, fileList, setFileList }) => (
  <>
    <Form.Item label={NAME.label} required>
      {getFieldDecorator(NAME.field)(<Input placeholder={NAME.placeholder} />)}
    </Form.Item>
    <Form.Item label={DESCRIPTION.label}>
      <Input.TextArea placeholder={DESCRIPTION.placeholder} />
    </Form.Item>
    <Form.Item label={FLOW_INPUT.label}>
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
