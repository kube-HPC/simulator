import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Checkbox, InputNumber, Select } from 'antd';
import { FlexBox, Form } from 'components/common';
import has from 'lodash/has';
import SliderNumber from './SliderNumber';
import Triggers from './Triggers';
import Webhooks from './Webhooks';
import useWizardContext from '../../useWizardContext';
import { Field } from '../FormUtils';
import JsonEditor from './../../JsonEditor';

export { Triggers, Webhooks };

const smallSelectStyle = { width: '90px' };

const Grow = styled(FlexBox.Item)`
  flex-grow: 1;
`;

const verbosityLevels = ['info', 'trace', 'debug', 'warn', 'error', 'critical'];

const Options = ({ style }) => {
  const overrides = {
    labelCol: {
      span: 5,
    },
  };

  const {
    fieldDecorator,
    form: { getFieldDecorator, setFieldsValue, getFieldValue },
    isStreamingPipeline,
    initialState,
  } = useWizardContext();

  const [listFlow, setListFlow] = useState(
    initialState?.streaming?.flows || []
  );
  const [arrayListFlow, setArrayListFlow] = useState(
    ['No Default', ...Object.keys(listFlow)] || []
  );

  useEffect(() => {
    if (
      initialState?.streaming?.flows &&
      !has(initialState?.streaming?.flows, initialState?.streaming?.defaultFlow)
    ) {
      if (Object.keys(initialState.streaming.flows).length === 0) {
        initialState.streaming.defaultFlow = '';
      }
    } else {
      setFieldsValue({
        'streaming.defaultFlow': initialState?.streaming?.defaultFlow || '',
      });
    }
  }, []);

  useEffect(() => {
    const listFlowKeys = Object.keys(listFlow);
    setArrayListFlow(['No Default', ...listFlowKeys]);

    const defaultFlowValue = getFieldValue('streaming.defaultFlow');

    if (!has(listFlow, defaultFlowValue)) {
      setTimeout(() => {
        setFieldsValue({ 'streaming.defaultFlow': '' });
      }, 100);
    }
  }, [getFieldValue, listFlow, setFieldsValue]);

  return (
    <div style={style}>
      {isStreamingPipeline !== false && (
        <>
          <Form.Divider>Streaming Flows</Form.Divider>

          <Field
            title="Flow"
            name="streaming.flows"
            getFieldDecorator={getFieldDecorator}
            overrides={overrides}
            skipValidation>
            <JsonEditor
              style={{ height: '20em', width: '68ch' }}
              onChange={setListFlow}
            />
          </Field>

          {arrayListFlow.length > 1 && (
            <Form.Item label="Default Flow">
              {fieldDecorator('streaming.defaultFlow')(
                <Select style={smallSelectStyle}>
                  {arrayListFlow.map((item, index) => (
                    <Select.Option
                      key={`default-list-flow-${item}`}
                      value={index > 0 ? item : ''}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          )}
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
