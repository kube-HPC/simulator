import React from 'react';
import { Form } from 'antd';

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
