import React from 'react';
import PropTypes from 'prop-types';

import { Form } from 'components/common';
import { Input, Select } from 'antd';
import addPipelineSchema from 'config/schema/addPipeline.schema';
import Controller from './InputParseJson/Controller.react';
import { memo } from 'react';

const { NAME, ALGORITHM, INPUT } = addPipelineSchema.NODES;

const NodeForm = ({ form, id }) => {
  const { getFieldDecorator } = form;

  return (
    <>
      <Form.Divider>{`Node ${id}`}</Form.Divider>
      <Form.Item required label={NAME.label}>
        {getFieldDecorator(NAME.field)(<Input placeholder={NAME.placeholder} />)}
      </Form.Item>
      <Form.Item required label={ALGORITHM.label}>
        {getFieldDecorator(ALGORITHM.field)(
          <Select placeholder={ALGORITHM.placeholder}>
            <Select.Option value="algo">Algo</Select.Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label={INPUT.label}>
        {getFieldDecorator(INPUT.field)(
          <Controller placeholder={INPUT.placeholder} tooltip={INPUT.tooltip} />
        )}
      </Form.Item>
    </>
  );
};

NodeForm.propTypes = {
  form: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired
};

export default memo(NodeForm);
