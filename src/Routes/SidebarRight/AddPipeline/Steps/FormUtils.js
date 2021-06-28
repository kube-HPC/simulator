import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form, Icon } from 'antd';

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
  title,
  type,
  required,
  skipValidation,
  small,
  getFieldDecorator,
  rootId,
  extraRules,
  initialValue,
  overrides,
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
    {...overrides}>
    {getFieldDecorator(
      rootId ? `${rootId}.${name}` : name,
      /** @type {import('antd/lib/form/Form').GetFieldDecoratorOptions} */
      (skipValidation
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
          })
    )(children)}
  </Form.Item>
);

Field.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  skipValidation: PropTypes.bool,
  small: PropTypes.bool,
  getFieldDecorator: PropTypes.func.isRequired,
  rootId: PropTypes.string,
  /* eslint-disable */
  extraRules: PropTypes.object,
  overrides: PropTypes.object,
  /* eslint-enable */
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
Field.defaultProps = {
  type: 'string',
  required: true,
  skipValidation: false,
  small: false,
  extraRules: [],
  initialValue: null,
  overrides: {},
  title: '',
  rootId: null,
};

export const HorizontalRow = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export const DeleteButton = styled(Icon)`
  margin-left: auto;
  color: ${COLOR.red};
  font-size: 1.5em;
  line-height: 100%;
`;
