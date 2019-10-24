import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'components/common';
import { Select, Switch, Popover, Input } from 'antd';
import addPipelineSchema from 'config/schema/addPipeline.schema';

const { CRON, PIPELINES } = addPipelineSchema.TRIGGERS;

const Triggers = ({ getFieldDecorator }) => {
  const switchAddon = getFieldDecorator(CRON.fields.ENABLED, { valuePropName: 'checked' })(
    <Switch />
  );

  return (
    <>
      <Form.Item label={CRON.label}>
        <Popover content={'pattern'} trigger="focus">
          {getFieldDecorator(CRON.fields.PATTERN)(
            <Input placeholder={CRON.placeholder} addonAfter={switchAddon} />
          )}
        </Popover>
      </Form.Item>
      <Form.Item label={PIPELINES.label}>
        {getFieldDecorator(PIPELINES.field)(
          <Select mode="multiple" placeholder={PIPELINES.placeholder}>
            <Select.Option value="pipeline">Pipeline</Select.Option>
          </Select>
        )}
      </Form.Item>
    </>
  );
};

Triggers.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  setFieldsValue: PropTypes.func.isRequired
};

export default Triggers;
