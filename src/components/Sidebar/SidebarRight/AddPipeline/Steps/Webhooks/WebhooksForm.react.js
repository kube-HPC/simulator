import React from 'react';
import PropTypes from 'prop-types';

import { Form, InputAddon } from 'components/common';
import schema from 'config/schema/addPipeline.schema';

const webHooksOptions = ['http://', 'ftp://', 'https://', 'ftps://'];

const { RESULT, PROGRESS } = schema.WEBHOOKS;

const WebhooksForm = ({ form: { getFieldDecorator } }) => (
  <>
    <Form.Item label={PROGRESS.label}>
      {getFieldDecorator(PROGRESS.field)(<InputAddon before={webHooksOptions} />)}
    </Form.Item>
    <Form.Item label={RESULT.label}>
      {getFieldDecorator(RESULT.field)(<InputAddon before={webHooksOptions} />)}
    </Form.Item>
  </>
);

WebhooksForm.propTypes = {
  form: PropTypes.object.isRequired
};

export default WebhooksForm;
