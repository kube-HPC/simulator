import React from 'react';
import PropTypes from 'prop-types';
import { InputNumber, Select } from 'antd';

import { Form } from 'components/common';
import addPipelineSchema from 'config/schema/addPipeline.schema';
import SliderNumber from './SliderNumber.react';
import { toUpperCaseFirstLetter } from 'utils';

const smallSelectStyle = { width: '90px' };

const { TOLERANCE, CONCURRENT, PRIORITY, TTL, VERBOSITY_LEVEL } = addPipelineSchema.OPTIONS;

const Options = ({ getFieldDecorator }) => (
  <>
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
        </Select>
      )}
    </Form.Item>
    <Form.Item label={PRIORITY.label}>
      {getFieldDecorator(PRIORITY.field)(<InputNumber />)}
    </Form.Item>
  </>
);

Options.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  setFieldsValue: PropTypes.func.isRequired
};

export default Options;
