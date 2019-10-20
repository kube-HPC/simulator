import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'components/common';
import { Input } from 'antd';
import schema from 'config/schema/addPipeline.schema';
import FlowInput from './FlowInput.react';

const { NAME, DESCRIPTION, FLOW_INPUT } = schema.INITIAL;

const Initial = ({ getFieldDecorator }) => (
  <>
    <Form.Item label={NAME.label} required={NAME.required}>
      {getFieldDecorator(NAME.field)(<Input placeholder={NAME.placeholder} />)}
    </Form.Item>
    <Form.Item label={DESCRIPTION.label}>
      {getFieldDecorator(DESCRIPTION.field)(
        <Input.TextArea placeholder={DESCRIPTION.placeholder} />
      )}
    </Form.Item>
    <Form.Item label={FLOW_INPUT.label}>
      {getFieldDecorator(FLOW_INPUT.field)(<FlowInput />)}
    </Form.Item>
  </>
);

Initial.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired
};

export default Initial;
