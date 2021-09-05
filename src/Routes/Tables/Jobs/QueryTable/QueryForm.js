import React, { useState } from 'react';
import { Form, Input, Button, DatePicker } from 'antd4';

const { RangePicker } = DatePicker;
const QueryForm = () => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState('inline');

  const onFormLayoutChange = ({ layout }) => {
    setFormLayout(layout);
  };

  const formItemLayout =
    formLayout === 'inline'
      ? {
          labelCol: {
            span: 10,
          },
          wrapperCol: {
            span: 12,
          },
        }
      : null;

  const dateItemLayout =
    formLayout === 'inline'
      ? {
          labelCol: {
            span: 4,
          },
          wrapperCol: {
            span: 20,
          },
        }
      : null;
  const buttonItemLayout =
    formLayout === 'inline'
      ? {
          wrapperCol: {
            span: 1,
            offset: 8,
          },
        }
      : null;
  return (
    <Form
      {...formItemLayout}
      layout={formLayout}
      form={form}
      initialValues={{
        layout: formLayout,
      }}
      style={{
        justifyContent: 'space-evenly',
        border: '1px solid #d9d9d9',
        borderRadius: '2px',
        margin: '4px',
        padding: '8px',
        background: 'aliceblue',
        boxShadow: 'box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px',
      }}
      size="medium"
      onValuesChange={onFormLayoutChange}>
      <Form.Item label="Time" {...dateItemLayout}>
        <RangePicker />
      </Form.Item>
      <Form.Item label=" Pipeline Name">
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item label="Pipeline Status">
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item label="Algorithm Name">
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item {...buttonItemLayout}>
        <Button type="primary">Submit</Button>
      </Form.Item>
    </Form>
  );
};

export default React.memo(QueryForm);
