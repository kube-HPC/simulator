import React from 'react';

import { Form, InputAddon } from 'components/common';

const protocols = ['http://', 'https://'];
const Webhooks = () => (
  <>
    <Form.Item label="Progress" name={['webhooks', 'progress']}>
      <InputAddon before={protocols} />
    </Form.Item>
    <Form.Item label="Result" name={['webhooks', 'result']}>
      <InputAddon before={protocols} />
    </Form.Item>
  </>
);

export default Webhooks;
