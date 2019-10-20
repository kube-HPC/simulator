import React, { useState, useEffect, forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Form } from 'components/common';
import { Input, Select } from 'antd';
import addPipelineSchema from 'config/schema/addPipeline.schema';
import InputType from './InputType.react';

const { NAME, ALGORITHM, INPUT } = addPipelineSchema.NODES;

const MyForm = forwardRef(({ form }, ref) => {
  const { getFieldDecorator } = form;

  return (
    <>
      <Form.Item required label={NAME.label}>
        {getFieldDecorator(NAME.field)(<Input placeholder={NAME.placeholder} />)}
      </Form.Item>
      <Form.Item required label={ALGORITHM.label}>
        {getFieldDecorator(ALGORITHM.field)(
          <Select placeholder={ALGORITHM.placeholder}>
            <Select.Option key="algo" value="Algo">
              Algo
            </Select.Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label={INPUT.label}>
        {getFieldDecorator(INPUT.field)(
          <InputType placeholder={INPUT.placeholder} tooltip={INPUT.tooltip} />
        )}
      </Form.Item>
    </>
  );
});

MyForm.propTypes = {
  form: PropTypes.object.isRequired
};

const initial = [
  {
    nodeName: '',
    algorithmName: '',
    input: []
  }
];

const NodeForm = forwardRef(({ onChange }, ref) => {
  const [nodes, setNodes] = useState(initial);

  useEffect(() => {
    onChange(nodes);
  }, [nodes, onChange]);

  const onValuesChange = useCallback((_, changedValues) => {
    setNodes(prev => [{ ...prev[0], ...changedValues }]);
  }, []);

  const Node = useMemo(() => memo(Form.create({ name: 'nodes', onValuesChange })(MyForm)), [
    onValuesChange
  ]);

  return (
    <>
      <Node />
    </>
  );
});

NodeForm.propTypes = {
  onChange: PropTypes.func
};

export default memo(NodeForm);
