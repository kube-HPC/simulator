import React from 'react';

import { Form, InputAddon } from 'components/common';

const protocols = ['http://', 'https://'];
const Webhooks = () => (
  <>
    <Form.Item label="Progress" name={['webhooks', 'progress']}>
      <InputAddon
        before={protocols}
        data-testid="add-pipeline-options-webhook-progress-input"
      />
    </Form.Item>
    <Form.Item label="Result" name={['webhooks', 'result']}>
      <InputAddon
        before={protocols}
        data-testid="add-pipeline-options-webhook-result-input"
      />
    </Form.Item>
  </>
);

export default Webhooks;
