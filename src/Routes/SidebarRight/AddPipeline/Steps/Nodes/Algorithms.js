import React from 'react';
import PropTypes from 'prop-types';
import { Input, Form } from 'antd';
import Controller from './InputParseJson/Controller';
import useWizardContext from '../../useWizardContext';

const AlgorithmNode = ({ id }) => {
  const {
    form: { getFieldDecorator },
  } = useWizardContext();

  return (
    <>
      <Form.Item label="Algorithm name">
        {getFieldDecorator(`nodes.${id}.algorithmName`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please input algorithm's name or delete this field.",
            },
          ],
        })(<Input placeholder="Algorithm name" />)}
      </Form.Item>
      <Form.Item label="Inputs">
        <Controller placeholder="Input" tooltip="Input" nodeIdx={id} />
      </Form.Item>
    </>
  );
};

AlgorithmNode.propTypes = {
  id: PropTypes.node.isRequired,
};
export default AlgorithmNode;
