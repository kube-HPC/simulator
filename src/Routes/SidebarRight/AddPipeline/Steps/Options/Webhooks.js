import React from 'react';
import { Form, InputAddon } from 'components/common';
import useWizardContext from '../../useWizardContext';

const protocols = ['http://', 'https://'];
const Webhooks = () => {
  const { fieldDecorator } = useWizardContext();
  return (
    <>
      <Form.Item label="Progress">
        {fieldDecorator('webhooks.progress')(<InputAddon before={protocols} />)}
      </Form.Item>
      <Form.Item label="Result">
        {fieldDecorator('webhooks.result')(<InputAddon before={protocols} />)}
      </Form.Item>
    </>
  );
};

export default Webhooks;
