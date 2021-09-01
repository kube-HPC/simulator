import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Checkbox, InputNumber, Select, Input } from 'antd';
import { FlexBox, Form } from 'components/common';
import JsonEditor from './../../JsonEditor';
import SliderNumber from './SliderNumber';
import Triggers from './Triggers';
import Webhooks from './Webhooks';
import useWizardContext from '../../useWizardContext';
import { Field } from '../FormUtils';

export { Triggers, Webhooks };

const smallSelectStyle = { width: '90px' };

const Grow = styled(FlexBox.Item)`
  flex-grow: 1;
`;
const FlexBoxCheckBoxStart = styled(FlexBox)`
  .ant-form-item-control-input {
    align-items: start;
  }
`;
const verbosityLevels = ['info', 'trace', 'debug', 'warn', 'error', 'critical'];

const Options = ({ style }) => {
  const { isStreamingPipeline } = useWizardContext();

  return (
    <div style={style}>
      {!isStreamingPipeline !== false && (
        <>
          <Form.Divider>Streaming Flows</Form.Divider>
          <Form.Item label="Default Flow" name={['streaming', 'defaultFlow']}>
            <Input />
          </Form.Item>
          <Field name={['streaming', 'flows']} skipValidation>
            <JsonEditor style={{ height: '20em', width: '65ch' }} />
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
        <SliderNumber name={['options', 'batchTolerance']} />
      </Form.Item>

      <FlexBox align="baseline">
        <Grow>
          <Form.Item
            label="Concurrent Amount"
            labelCol={{}}
            wrapperCol={{ style: { whiteSpace: 'nowrap' } }}>
            <SliderNumber
              min={1}
              name={['options', 'concurrentPipelines', 'amount']}
            />
          </Form.Item>
        </Grow>
        <FlexBox.Auto align="start">
          <FlexBox.Item>Reject on Failure:</FlexBox.Item>
          <FlexBoxCheckBoxStart align="start">
            <Form.Item
              name={['options', 'concurrentPipelines', 'rejectOnFailure']}
              valuePropName="checked">
              <Checkbox />
            </Form.Item>
          </FlexBoxCheckBoxStart>
        </FlexBox.Auto>
      </FlexBox>

      <Form.Item label="Pipeline TTL" name={['options', 'ttl']}>
        <InputNumber />
      </Form.Item>
      <Form.Item
        label="Verbosity Level"
        name={['options', 'progressVerbosityLevel']}>
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
      </Form.Item>
      <Form.Item label="Priority" name="priority">
        <InputNumber max={5} min={1} />
      </Form.Item>
    </div>
  );
};

Options.propTypes = {
  // eslint-disable-next-line
  style: PropTypes.object.isRequired,
};

export default Options;
