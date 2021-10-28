import React from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Button } from 'antd';
import InputField from './InputField';

const listAddOn = ['', '@', '#', '#@'];

const Controller = ({ nodeIdx }) => (
  <Form.List name={['nodes', nodeIdx, 'input']}>
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name, fieldKey, ...restField }) => (
          <Form.Item
            style={{ marginBottom: 10 }}
            {...restField}
            name={[name]}
            fieldKey={[fieldKey]}
            validateTrigger={['onChange', 'onBlur']}>
            <InputField
              addonBefore={listAddOn}
              onRemove={name > 0 ? () => remove(name) : null}
            />
          </Form.Item>
        ))}
        <Form.Item>
          <Button
            type="dashed"
            onClick={() => add()}
            block
            icon={<PlusOutlined />}>
            Add field
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>
);

Controller.propTypes = {
  nodeIdx: PropTypes.node.isRequired,
};

export default Controller;
