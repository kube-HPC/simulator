import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputAddon } from 'components/common';

const webHooksOptions = ['http://', 'ftp://', 'https://', 'ftps://'];

const Webhooks = ({ getFieldDecorator }) => (
  <>
    <Form.Item label="Progress">
      <InputAddon before={webHooksOptions} />
    </Form.Item>
    <Form.Item label="Result">
      <InputAddon before={webHooksOptions} />
    </Form.Item>
  </>
);

Webhooks.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired
};

export default Webhooks;
