import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form as AntdForm, Divider as AntdDivider } from 'antd';

const DEFAULT_SPAN = 5;
const formItemLayout = {
  labelCol: { span: DEFAULT_SPAN },
  wrapperCol: { span: 24 - DEFAULT_SPAN },
  labelAlign: 'left',
};

const Form = styled(AntdForm)`
  .ant-form-item {
    margin-bottom: 0px;
  }
`;

const FormWrapper = ({ children, ...props }) => (
  <AntdForm.Item {...formItemLayout} {...props}>
    {children}
  </AntdForm.Item>
);

FormWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
Form.Item = FormWrapper;

const DividerWrapper = ({ children, ...props }) => (
  <AntdDivider orientation="left" {...props}>
    {children}
  </AntdDivider>
);

DividerWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
Form.Divider = DividerWrapper;

Form.Item.propTypes = AntdForm.Item.propTypes;
Form.Divider.propTypes = AntdDivider.propTypes;

export default Form;
