import { Input } from 'antd';
import { Form } from 'components/common';
import schema from 'config/schema/addPipeline.schema';
import React, { memo, useContext } from 'react';
import { FormContext } from '../../AddPipelineForm';
import FlowInput from './FlowInput.react';

const { NAME, DESCRIPTION, FLOW_INPUT } = schema.INITIAL;

const Initial = () => {
  const { getFieldDecorator } = useContext(FormContext);

  return (
    <>
      <Form.Item label={NAME.label} required={NAME.required} hasFeedback>
        {getFieldDecorator(NAME.field, {
          rules: [{ required: true, message: NAME.message }],
        })(<Input placeholder={NAME.placeholder} />)}
      </Form.Item>
      <Form.Item label={DESCRIPTION.label}>
        {getFieldDecorator(DESCRIPTION.field)(
          <Input placeholder={DESCRIPTION.placeholder} />
        )}
      </Form.Item>
      <Form.Item label={FLOW_INPUT.label}>
        {getFieldDecorator(FLOW_INPUT.field)(<FlowInput />)}
      </Form.Item>
    </>
  );
};

export default memo(Initial);
