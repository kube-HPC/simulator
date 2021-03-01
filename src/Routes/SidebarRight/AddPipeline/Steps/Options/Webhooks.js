import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputAddon } from 'components/common';
import schema from './../../schema';

const { RESULT, PROGRESS, types } = schema.WEBHOOKS;

const Webhooks = ({ getFieldDecorator }) => (
  <>
    <Form.Item label={PROGRESS.label}>
      {getFieldDecorator(PROGRESS.field)(<InputAddon before={types} />)}
    </Form.Item>
    <Form.Item label={RESULT.label}>
      {getFieldDecorator(RESULT.field)(<InputAddon before={types} />)}
    </Form.Item>
  </>
);

Webhooks.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
};

export default Webhooks;
