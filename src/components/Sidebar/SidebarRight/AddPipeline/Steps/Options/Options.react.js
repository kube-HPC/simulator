import React, { useContext } from 'react';
import { InputNumber, Select } from 'antd';

import { Form } from 'components/common';
import addPipelineSchema from 'config/schema/addPipeline.schema';
import SliderNumber from './SliderNumber.react';
import { toUpperCaseFirstLetter } from 'utils';
import { FormContext } from '../../Form/AddPipelineForm.react';
import Webhooks from './Webhooks.react';
import Triggers from './Triggers/Triggers.react';

const smallSelectStyle = { width: '90px' };

const { TOLERANCE, CONCURRENT, PRIORITY, TTL, VERBOSITY_LEVEL } = addPipelineSchema.OPTIONS;

const Options = () => {
  const { getFieldDecorator } = useContext(FormContext);

  return (
    <>
      <Form.Divider>Webhooks</Form.Divider>
      <Webhooks />
      <Form.Divider>Triggers</Form.Divider>
      <Triggers />
      <Form.Divider>Advanced Options</Form.Divider>
      <Form.Item label={TOLERANCE.label}>
        {getFieldDecorator(TOLERANCE.field)(<SliderNumber />)}
      </Form.Item>
      <Form.Item label={CONCURRENT.label}>
        {getFieldDecorator(CONCURRENT.field)(<SliderNumber />)}
      </Form.Item>
      <Form.Item label={TTL.label}>{getFieldDecorator(TTL.field)(<InputNumber />)}</Form.Item>
      <Form.Item label={VERBOSITY_LEVEL.label}>
        {getFieldDecorator(VERBOSITY_LEVEL.field)(
          <Select style={smallSelectStyle}>
            {VERBOSITY_LEVEL.types.map(option => (
              <Select.Option key={option} value={option}>
                {toUpperCaseFirstLetter(option)}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label={PRIORITY.label}>
        {getFieldDecorator(PRIORITY.field)(<InputNumber />)}
      </Form.Item>
    </>
  );
};

export default Options;
