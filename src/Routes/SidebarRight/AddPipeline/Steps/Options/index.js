import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Checkbox, InputNumber, Select } from 'antd';
import { FlexBox, Form } from 'components/common';
import { toUpperCaseFirstLetter } from 'utils';
import SliderNumber from './SliderNumber';
import Triggers from './Triggers';
import Webhooks from './Webhooks';
import useWizardContext from '../../useWizardContext';

export { Triggers, Webhooks };

const smallSelectStyle = { width: '90px' };

const Grow = styled(FlexBox.Item)`
  flex-grow: 1;
`;

const verbosityLevels = ['info', 'trace', 'debug', 'warn', 'error', 'critical'];

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
      <Form.Item
        label="Batch Tolerance"
        labelCol={{}}
        wrapperCol={{ style: { whiteSpace: 'nowrap' } }}>
        {getFieldDecorator('options.batchTolerance', { initialValue: 80 })(
          <SliderNumber />
        )}
      </Form.Item>
      <Form.Item
        label="Concurrent Amount"
        labelCol={{}}
        wrapperCol={{ style: { whiteSpace: 'nowrap' } }}>
        <FlexBox>
          <Grow>
            {getFieldDecorator('options.concurrentPipelines.amount', {
              initialValue: 10,
            })(<SliderNumber min={1} />)}
          </Grow>
          <FlexBox.Item>
            Reject on Failure:{' '}
            {getFieldDecorator('options.concurrentPipelines.rejectOnFailure', {
              valuePropName: 'checked',
            })(<Checkbox />)}
          </FlexBox.Item>
        </FlexBox>
      </Form.Item>
      <Form.Item label="Pipeline TTL">
        {getFieldDecorator('options.ttl')(<InputNumber />)}
      </Form.Item>
      <Form.Item label="Verbosity Level">
        {getFieldDecorator('options.progressVerbosityLevel')(
          <Select style={smallSelectStyle}>
            {verbosityLevels.map(level => (
              <Select.Option key={`verbosity-level-${level}`} value={level}>
                {toUpperCaseFirstLetter(level)}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
      <Form.Item label="Priority">
        {getFieldDecorator('priority')(<InputNumber max={5} min={1} />)}
      </Form.Item>
    </div>
  );
};

Options.propTypes = {
  // eslint-disable-next-line
  style: PropTypes.object.isRequired,
};

export default Options;
