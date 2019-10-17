import React from 'react';
import PropTypes from 'prop-types';
import { Form, FlexBox } from 'components/common';
import { Slider, InputNumber, Select } from 'antd';
import { toUpperCaseFirstLetter } from 'utils';

const SPAN = 18;
const SPAN_REST = 24 - SPAN;

const levelOptions = ['info', 'trace', 'debug', 'warn', 'error', 'critical'];
const smallSelectStyle = { width: '90px' };

const Options = ({ getFieldDecorator }) => (
  <>
    <Form.Item label="Batch Tolerance">
      <FlexBox>
        <FlexBox.Item span={SPAN}>
          <Slider />
        </FlexBox.Item>
        <FlexBox.Item span={SPAN_REST}>
          <InputNumber />
        </FlexBox.Item>
      </FlexBox>
    </Form.Item>
    <Form.Item label="Concurrent">
      <FlexBox>
        <FlexBox.Item span={SPAN}>
          <Slider />
        </FlexBox.Item>
        <FlexBox.Item span={SPAN_REST}>
          <InputNumber />
        </FlexBox.Item>
      </FlexBox>
    </Form.Item>
    <Form.Item label="TTL">
      <InputNumber />
    </Form.Item>
    <Form.Item label="Verbosity Level">
      <Select style={smallSelectStyle}>
        {levelOptions.map(option => (
          <Select.Option key={option} value={option}>
            {toUpperCaseFirstLetter(option)}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
    <Form.Item label="Priority">
      <InputNumber />
    </Form.Item>
  </>
);

Options.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired
};

export default Options;
