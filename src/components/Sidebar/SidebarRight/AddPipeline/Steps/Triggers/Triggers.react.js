import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'components/common';
import { Select } from 'antd';

import addPipelineSchema from 'config/schema/addPipeline.schema';
import CronInput from './CronInput.react';

const { CRON, PIPELINES } = addPipelineSchema.TRIGGERS;

const Triggers = ({ getFieldDecorator }) => (
  <>
    <Form.Item label={CRON.label}>
      <CronInput placeholder={CRON.placeholder} />
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

Triggers.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  setFieldsValue: PropTypes.func.isRequired
};

export default Triggers;
