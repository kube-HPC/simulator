import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'components/common';
import { Select } from 'antd';
import has from 'lodash/has';
import ControllerKeyValue from '../Nodes/inputKeyValueJson';

const smallSelectStyle = { width: '90px' };

const StreamingFlows = ({ form, initialState }) => {
  const [listFlow, setListFlow] = useState(
    initialState?.streaming?.flows || []
  );
  const [arrayListFlow, setArrayListFlow] = useState(
    ['No Default', ...Object.keys(listFlow)] || []
  );

  useEffect(() => {
    const listFlowKeys = Object.keys(listFlow);
    setArrayListFlow(['No Default', ...listFlowKeys]);

    const defaultFlowValue = form.getFieldValue(['streaming', 'defaultFlow']);
    if (!has(listFlow, defaultFlowValue)) {
      setTimeout(() => {
        form.setFieldsValue({ streaming: { defaultFlow: '' } });
      }, 100);
    }
  }, [form, listFlow]);
  return (
    <>
      <Form.Divider>Streaming Flows</Form.Divider>

      <Form.Item label="Flows" name={['streaming', 'flows']}>
        <ControllerKeyValue
          onChange={setListFlow}
          ValuePlaceholder="ex : a >> b >> c"
          isValueSignBoard
          titleKeyboard="Builder flow :"
          nameRef={['streaming', 'flows']}
        />
      </Form.Item>
      {arrayListFlow.length > 1 && (
        <Form.Item label="Default Flow" name={['streaming', 'defaultFlow']}>
          <Select style={smallSelectStyle}>
            {arrayListFlow.map((item, index) => (
              <Select.Option
                key={`default-list-flow-${item}`}
                value={index > 0 ? item : ''}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}
    </>
  );
};

StreamingFlows.propTypes = {
  form: PropTypes.shape({
    setFieldsValue: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
    getFieldInstance: PropTypes.func.isRequired,
  }).isRequired,

  // eslint-disable-next-line react/forbid-prop-types
  initialState: PropTypes.object.isRequired,
};

export default StreamingFlows;
