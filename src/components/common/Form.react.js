import React, { useReducer } from 'react';
import PropTypes, { oneOfType } from 'prop-types';
import styled from 'styled-components';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Divider as AntdDivider, Form as AntdForm } from 'antd';

const DEFAULT_SPAN = 5;
const formItemLayout = {
  labelCol: { span: DEFAULT_SPAN },
  wrapperCol: { span: 24 - DEFAULT_SPAN },
  labelAlign: 'left',
};

const Form = styled(AntdForm)`
  .ant-form-item {
    margin-bottom: 8px;
  }

  .ant-form-item-control {
    display: inline-block;
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

const Collapsible = ({
  title,
  children,
  defaultExpanded = false,
  expanded,
  onChange,
}) => {
  const [internalExpanded, toggleInternal] = useReducer(
    state => !state,
    defaultExpanded
  );

  const isControlled = expanded !== undefined;
  const isExpanded = isControlled ? expanded : internalExpanded;

  const handleToggle = () => {
    if (isControlled) {
      onChange?.(!expanded);
    } else {
      toggleInternal();
      onChange?.(!isExpanded);
    }
  };

  return (
    <>
      <DividerWrapper>
        {title}{' '}
        {isExpanded ? (
          <CaretDownOutlined onClick={handleToggle} />
        ) : (
          <CaretRightOutlined onClick={handleToggle} />
        )}
      </DividerWrapper>
      <div style={{ display: isExpanded ? 'unset' : 'none' }}>{children}</div>
    </>
  );
};

Collapsible.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  children: oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)])
    .isRequired,
  defaultExpanded: PropTypes.bool,
  expanded: PropTypes.bool,
  onChange: PropTypes.func,
};

Form.Collapsible = Collapsible;

export default Form;
