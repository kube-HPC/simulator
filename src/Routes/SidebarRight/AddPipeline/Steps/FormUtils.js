import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form, Icon } from 'antd';
import { COLOR } from 'styles';

const smallStyle = {
  marginRight: '2ch',
  alignItems: 'center',
  textAlign: 'center',
};

/** @typedef {typeof Field} FieldProps */
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
}) => (
  <Form.Item label={title} style={small ? smallStyle : {}}>
    {getFieldDecorator(
      `${rootId}.${name}`,
      /** @type {import('antd/lib/form/Form').GetFieldDecoratorOptions} */
      (skipValidation
        ? {}
        : {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required,
                whitespace: true,
                type,
              },
            ],
          })
    )(children)}
  </Form.Item>
);

Field.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string,
  required: PropTypes.bool,
  skipValidation: PropTypes.bool,
  small: PropTypes.bool,
  getFieldDecorator: PropTypes.func.isRequired,
  rootId: PropTypes.string.isRequired,
};
Field.defaultProps = {
  type: 'string',
  required: true,
  skipValidation: false,
  small: false,
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
