import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '@ant-design/icons';
import { Form } from 'antd';

import { COLOR } from 'styles';

const smallStyle = {
  marginRight: '2ch',
  alignItems: 'center',
  textAlign: 'center',
  fontWeight: 'normal',
};
const DEFAULT_SPAN = 8;

/** @typedef {typeof Field} FieldProps */
/**
 * @param {Object} props
 * @param {import('antd/lib/form').ValidationRule[]} props.extraRules
 * @param {import('antd/lib/form').FormItemProps} props.overrides
 */

export const Field = ({
  name,
  children,
  title = '',
  type = 'string',
  required = true,
  skipValidation = false,
  small = false,
  rootId = null,
  extraRules = [],
  initialValue = null,
  overrides = {},
}) => (
  <Form.Item
    label={title}
    labelAlign="left"
    style={
      small
        ? smallStyle
        : { marginTop: '1em', marginBottom: 0, fontWeight: 'normal' }
    }
    labelCol={{ span: DEFAULT_SPAN }}
    wrapperCol={{ span: 24 - DEFAULT_SPAN }}
    name={rootId ? rootId.concat(name) : name}
    {...(skipValidation
      ? { initialValue }
      : {
          initialValue,
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required,
              whitespace: true,
              type,
              message: `${title} is required`,
            },
            ...extraRules,
          ],
        })}
    {...overrides}>
    {children}
  </Form.Item>
);

Field.propTypes = {
  /* eslint-disable */
  name: PropTypes.array,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  skipValidation: PropTypes.bool,
  small: PropTypes.bool,

  /* eslint-disable */
  rootId: PropTypes.array,
  /* eslint-disable */
  extraRules: PropTypes.array,
  overrides: PropTypes.object,
  /* eslint-enable */
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export const HorizontalRow = styled.div`
  display: flex;
  justify-content: space-evenly;
`;
export const HorizontalStartRow = styled.div`
  display: flex;
  justify-content: start;
`;
export const DeleteButton = styled(Icon)`
  margin-left: auto;
  color: ${COLOR.red};
  font-size: 1.5em;
  line-height: 100%;
`;

export const FormItemLabelWrapper = styled(Form.Item)`
  display: flex;

  .ant-form-item-label {
    text-align: left;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .ant-form-item-control-wrapper {
    margin-left: 181px;
  }
`;
