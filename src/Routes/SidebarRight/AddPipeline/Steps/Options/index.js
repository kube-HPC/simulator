import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Checkbox, InputNumber, Select } from 'antd';
import { FlexBox, Form } from 'components/common';
import SliderNumber from './SliderNumber';
import Triggers from './Triggers';
import Webhooks from './Webhooks';
import useWizardContext from '../../useWizardContext';
import { Field } from '../FormUtils';
import FlowInput from '../Initial/FlowInput';

export { Triggers, Webhooks };

const smallSelectStyle = { width: '90px' };

const Grow = styled(FlexBox.Item)`
  flex-grow: 1;
`;

const verbosityLevels = ['info', 'trace', 'debug', 'warn', 'error', 'critical'];

const Options = ({ style }) => {
  const {
    fieldDecorator,
    form: { getFieldDecorator },
    isStreamingPipeline,
  } = useWizardContext();
  return (
    <div style={style}>
      {isStreamingPipeline && (
        <>
          <Form.Divider>Streaming Flows</Form.Divider>
          <Field
            name="streaming.flows"
            getFieldDecorator={getFieldDecorator}
            skipValidation>
            <FlowInput style={{ height: '20em', width: '65ch' }} />
          </Field>
        </>
      )}
      <Form.Divider>Webhooks</Form.Divider>
      <Webhooks />
      <Form.Divider>Triggers</Form.Divider>
      <Triggers />
      <Form.Divider>Advanced Options</Form.Divider>
      <Form.Item
        label="Batch Tolerance"
        labelCol={{}}
        wrapperCol={{ style: { whiteSpace: 'nowrap' } }}>
        {fieldDecorator('options.batchTolerance')(<SliderNumber />)}
      </Form.Item>
      <Form.Item
        label="Concurrent Amount"
        labelCol={{}}
        wrapperCol={{ style: { whiteSpace: 'nowrap' } }}>
        <FlexBox>
          <Grow>
            {fieldDecorator('options.concurrentPipelines.amount')(
              <SliderNumber min={1} />
            )}
          </Grow>
          <FlexBox.Item>
            Reject on Failure:{' '}
            {fieldDecorator('options.concurrentPipelines.rejectOnFailure', {
              valuePropName: 'checked',
            })(<Checkbox />)}
          </FlexBox.Item>
        </FlexBox>
      </Form.Item>
      <Form.Item label="Pipeline TTL">
        {fieldDecorator('options.ttl')(<InputNumber />)}
      </Form.Item>
      <Form.Item label="Verbosity Level">
        {fieldDecorator('options.progressVerbosityLevel')(
          <Select style={smallSelectStyle}>
            {verbosityLevels.map(level => (
              <Select.Option
                key={`verbosity-level-${level}`}
                value={level}
                style={{ textTransform: 'capitalize' }}>
                {level}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
      <Form.Item label="Priority">
        {fieldDecorator('priority')(<InputNumber max={5} min={1} />)}
      </Form.Item>
    </div>
  );
};

Options.propTypes = {
  // eslint-disable-next-line
  style: PropTypes.object.isRequired,
};

export default Options;
