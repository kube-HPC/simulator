import React from 'react';
import styled from 'styled-components';
import { Form, Divider } from 'antd';

const LABEL_SPAN = 5;
const formItemLayout = {
  labelCol: { span: LABEL_SPAN },
  wrapperCol: { span: 24 - LABEL_SPAN },
  labelAlign: 'left'
};

const FormItem = ({ children, ...props }) => (
  <Form.Item {...formItemLayout} {...props}>
    {children}
  </Form.Item>
);

const FormNoMargin = styled(Form)`
  .ant-form-item {
    margin-bottom: 0px;
  }
`;

const FormDivider = ({ children, ...props }) => (
  <Divider orientation="left" {...props}>
    {children}
  </Divider>
);

FormItem.propTypes = Form.Item.propTypes;
FormDivider.propTypes = Divider.propTypes;

export { FormItem, FormNoMargin, FormDivider };
