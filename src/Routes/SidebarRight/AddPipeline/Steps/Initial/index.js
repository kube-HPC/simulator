import React from 'react';
import PropTypes from 'prop-types';
import { Input, Radio } from 'antd';
import { Form } from 'components/common';
import FlowInput from './FlowInput';
import useWizardContext from '../../useWizardContext';

/** @param {{ style: import('react').CSSProperties }} props */
const Initial = ({ style }) => {
  const { form } = useWizardContext();
  const { getFieldDecorator } = form;
  return (
    <div style={style}>
      <Form.Item label="Name" required>
        {getFieldDecorator('name', {
          rules: [{ required: true, message: 'Pipeline name is required' }],
        })(<Input placeholder="Unique Identifier" />)}
      </Form.Item>
      <Form.Item label="Description">
        {getFieldDecorator('description')(
          <Input placeholder="Pipeline Description" />
        )}
      </Form.Item>
      <Form.Item label="Pipeline Kind">
        {getFieldDecorator('kind', {
          rules: [{ required: true }],
          initialValue: 'batch',
        })(
          <Radio.Group>
            <Radio.Button value="batch">Batch</Radio.Button>
            <Radio.Button value="stream">Streaming</Radio.Button>
          </Radio.Group>
        )}
      </Form.Item>
      <Form.Item label="Flow Input">
        {getFieldDecorator('flowInput')(<FlowInput />)}
      </Form.Item>
    </div>
  );
};

Initial.propTypes = {
  // eslint-disable-next-line
  style: PropTypes.object.isRequired,
};

export default Initial;
