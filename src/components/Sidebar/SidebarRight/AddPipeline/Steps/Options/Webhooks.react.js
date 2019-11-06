import React, { useContext } from 'react';

import { Form, InputAddon } from 'components/common';
import schema from 'config/schema/addPipeline.schema';
import { FormContext } from '../../AddPipelineForm.react';

const webHooksOptions = ['http://', 'ftp://', 'https://', 'ftps://'];

const { RESULT, PROGRESS } = schema.WEBHOOKS;

const Webhooks = () => {
  const { getFieldDecorator } = useContext(FormContext);
  return (
    <>
      <Form.Item label={PROGRESS.label}>
        {getFieldDecorator(PROGRESS.field)(<InputAddon before={webHooksOptions} />)}
      </Form.Item>
      <Form.Item label={RESULT.label}>
        {getFieldDecorator(RESULT.field)(<InputAddon before={webHooksOptions} />)}
      </Form.Item>
    </>
  );
};

export default Webhooks;
