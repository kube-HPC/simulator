import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const KeyValueForm = ({ fieldName, titleButtoAdd }) => (
  <Form.List name={fieldName}>
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name, fieldKey, ...restField }) => (
          <Space
            key={key}
            style={{ display: 'flex', marginBottom: 8 }}
            align="baseline">
            <Form.Item
              {...restField}
              name={[name, 'key']}
              fieldKey={[fieldKey, 'key']}
              rules={[{ required: true, message: 'Missing key' }]}>
              <Input placeholder="Key" />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, 'value']}
              fieldKey={[fieldKey, 'value']}
              rules={[{ required: true, message: 'Missing value' }]}>
              <Input placeholder="Value" />
            </Form.Item>
            <MinusCircleOutlined onClick={() => remove(name)} />
          </Space>
        ))}
        <Form.Item>
          <Button
            type="dashed"
            onClick={() => add()}
            block
            icon={<PlusOutlined />}>
            {titleButtoAdd ?? 'Add Key-Value Pair'}
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>
);

KeyValueForm.propTypes = {
  fieldName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  titleButtoAdd: PropTypes.string.isRequired,
};

export default KeyValueForm;
