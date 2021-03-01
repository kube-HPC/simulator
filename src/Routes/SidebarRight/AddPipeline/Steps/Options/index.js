import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Checkbox, InputNumber, Select } from 'antd';
import { FlexBox, Form } from 'components/common';
import { toUpperCaseFirstLetter } from 'utils';
import SliderNumber from './SliderNumber';
import Triggers from './Triggers';
import Webhooks from './Webhooks';
import addPipelineSchema from './../../schema';
import useWizardContext from '../../useWizardContext';

export { Triggers, Webhooks };

const smallSelectStyle = { width: '90px' };

const {
  TOLERANCE,
  CONCURRENT,
  PRIORITY,
  TTL,
  VERBOSITY_LEVEL,
} = addPipelineSchema.OPTIONS;

const Grow = styled(FlexBox.Item)`
  flex-grow: 1;
`;

const Options = ({ style }) => {
  const { form } = useWizardContext();
  const { getFieldDecorator } = form;
  return (
    <div style={style}>
      <Form.Divider>Webhooks</Form.Divider>
      <Webhooks getFieldDecorator={getFieldDecorator} />
      <Form.Divider>Triggers</Form.Divider>
      <Triggers getFieldDecorator={getFieldDecorator} />
      <Form.Divider>Advanced Options</Form.Divider>
      <Form.Item label={TOLERANCE.label}>
        {getFieldDecorator(TOLERANCE.field)(<SliderNumber />)}
      </Form.Item>
      <Form.Item label={CONCURRENT.amount.label}>
        <FlexBox>
          <Grow>
            {getFieldDecorator(CONCURRENT.amount.field)(
              <SliderNumber min={1} />
            )}
          </Grow>
          <FlexBox.Item>
            Reject on Failure:{' '}
            {getFieldDecorator(CONCURRENT.reject.field, {
              valuePropName: 'checked',
            })(<Checkbox />)}
          </FlexBox.Item>
        </FlexBox>
      </Form.Item>
      <Form.Item label={TTL.label}>
        {getFieldDecorator(TTL.field)(<InputNumber />)}
      </Form.Item>
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
    </div>
  );
};

Options.propTypes = {
  // eslint-disable-next-line
  style: PropTypes.object.isRequired,
};

export default Options;
