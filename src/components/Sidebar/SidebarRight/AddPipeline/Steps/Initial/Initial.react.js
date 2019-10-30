import React, { useContext, memo } from 'react';

import { Form, InputAddon } from 'components/common';
import schema from 'config/schema/addPipeline.schema';
import FlowInput from './FlowInput.react';
import { FormContext } from '../../AddPipelineForm.react';

const { NAME, DESCRIPTION, FLOW_INPUT } = schema.INITIAL;

const Initial = () => {
  const { getFieldDecorator } = useContext(FormContext);

  return (
    <>
      <Form.Item label={NAME.label} required={NAME.required} hasFeedback>
        {getFieldDecorator(NAME.field, {
          rules: [{ required: true, message: NAME.message }]
        })(<InputAddon placeholder={NAME.placeholder} />)}
      </Form.Item>
      <Form.Item label={DESCRIPTION.label}>
        {getFieldDecorator(DESCRIPTION.field)(<InputAddon placeholder={DESCRIPTION.placeholder} />)}
      </Form.Item>
      <Form.Item label={FLOW_INPUT.label}>
        {getFieldDecorator(FLOW_INPUT.field)(<FlowInput />)}
      </Form.Item>
    </>
  );
};

export default memo(Initial);
