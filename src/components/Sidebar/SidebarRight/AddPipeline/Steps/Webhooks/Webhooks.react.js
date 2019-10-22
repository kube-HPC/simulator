import React from 'react';
import PropTypes from 'prop-types';

import { Form } from 'components/common';
import schema from 'config/schema/addPipeline.schema';
import WebhooksForm from './WebhooksForm.react';
import { memo } from 'react';

const { WEBHOOKS } = schema;

const Webhooks = ({ getFieldDecorator, setFieldsValue }) => {
  const onValuesChange = (_, changedValues, allValues) => {
    console.log(allValues);
    setFieldsValue({ [WEBHOOKS.field]: allValues });
  };
  const Controller = Form.create({ onValuesChange })(WebhooksForm);
  return <>{getFieldDecorator(WEBHOOKS.field)(<Controller />)}</>;
};

Webhooks.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  setFieldsValue: PropTypes.func.isRequired
};

export default memo(Webhooks);
