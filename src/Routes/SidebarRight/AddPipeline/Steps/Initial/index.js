import React from 'react';
import PropTypes from 'prop-types';
import { Input, Radio } from 'antd';
import { Form } from 'components/common';

import JsonEditor from '../../JsonEditor';

/** @param {{ style: import('react').CSSProperties }} props */
const Initial = ({ style }) => (
  <div style={style}>
    <Form.Item
      label="Name"
      name="name"
      rules={[{ required: true, message: 'Pipeline name is required' }]}
      required>
      <Input placeholder="Unique Identifier" />
    </Form.Item>
    <Form.Item label="Description" name="description">
      <Input placeholder="Pipeline Description" />
    </Form.Item>
    <Form.Item
      label="Pipeline Kind"
      name="kind"
      rules={[{ required: true }]}
      initialValue="batch">
      <Radio.Group>
        <Radio.Button value="batch">Batch</Radio.Button>
        <Radio.Button value="stream">Streaming</Radio.Button>
      </Radio.Group>
    </Form.Item>
    <Form.Item label="Flow Input" name={['flowInput']}>
      <JsonEditor style={{ height: '30em' }} />
    </Form.Item>
  </div>
);

Initial.propTypes = {
  // eslint-disable-next-line
  style: PropTypes.object.isRequired,
};

export default Initial;
