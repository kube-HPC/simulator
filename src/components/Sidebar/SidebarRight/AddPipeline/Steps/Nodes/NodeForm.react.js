import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Input, Select, Typography } from 'antd';

import { Form } from 'components/common';
import addPipelineSchema from 'config/schema/addPipeline.schema';
import Controller from './InputParseJson/Controller.react';
import { STATE_SOURCES } from 'const';

const { NAME, ALGORITHM, INPUT } = addPipelineSchema.NODES;

const algorithmNamesSelector = state =>
  state[STATE_SOURCES.ALGORITHM_TABLE].dataSource.map(({ name }) => name);

const NodeForm = ({ form: { getFieldDecorator }, id }) => {
  const algorithms = useSelector(algorithmNamesSelector);

  return (
    <>
      <Form.Divider>
        <Typography.Text code>{`Node ${id}`}</Typography.Text>
      </Form.Divider>
      <Form.Item required label={NAME.label} hasFeedback>
        {getFieldDecorator(NAME.field, {
          rules: [{ required: true, message: NAME.message }]
        })(<Input placeholder={NAME.placeholder} />)}
      </Form.Item>
      <Form.Item required label={ALGORITHM.label} hasFeedback>
        {getFieldDecorator(ALGORITHM.field)(
          <Select placeholder={ALGORITHM.placeholder}>
            {algorithms.map(algorithm => (
              <Select.Option key={algorithm} value={algorithm}>
                {algorithm}
              </Select.Option>
            ))}
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
