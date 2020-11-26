import { Form, InputAddon } from 'components/common';
import schema from 'config/schema/addPipeline.schema';
import React, { useContext } from 'react';
import { FormContext } from '../../AddPipelineForm';

const { RESULT, PROGRESS, types } = schema.WEBHOOKS;

const Webhooks = () => {
  const { getFieldDecorator } = useContext(FormContext);
  return (
    <>
      <Form.Item label={PROGRESS.label}>
        {getFieldDecorator(PROGRESS.field)(<InputAddon before={types} />)}
      </Form.Item>
      <Form.Item label={RESULT.label}>
        {getFieldDecorator(RESULT.field)(<InputAddon before={types} />)}
      </Form.Item>
    </>
  );
};

export default Webhooks;
