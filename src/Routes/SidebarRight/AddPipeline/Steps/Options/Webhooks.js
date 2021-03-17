import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputAddon } from 'components/common';

const protocols = ['http://', 'https://'];
const Webhooks = ({ getFieldDecorator }) => (
  <>
    <Form.Item label="Progress">
      {getFieldDecorator('webhooks.progress')(
        <InputAddon before={protocols} />
      )}
    </Form.Item>
    <Form.Item label="Result">
      {getFieldDecorator('webhooks.result')(<InputAddon before={protocols} />)}
    </Form.Item>
  </>
);

Webhooks.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
};

export default Webhooks;
