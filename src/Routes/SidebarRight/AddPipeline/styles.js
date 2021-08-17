import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

/** @typedef {import('antd/lib/form').FormItemProps} FormItemProps */
/** @type {(props: FormItemProps) => FormItem} */
export const BoldedFormField = props => (
  <Form.Item
    labelCol={{
      style: {
        fontWeight: 'bold',
        fontSize: '1.5em',
      },
    }}
    {...props}
  />
);
