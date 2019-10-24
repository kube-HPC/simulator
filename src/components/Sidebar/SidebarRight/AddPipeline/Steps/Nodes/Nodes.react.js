import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'antd';

import { Form } from 'components/common';
import addPipelineSchema from 'config/schema/addPipeline.schema';
import NodeForm from './NodeForm.react';
import { removeLast } from './helpers';

const ButtonGroupCenter = styled(Button.Group)`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const { NODES } = addPipelineSchema;
const EMPTY_INITIAL = [];

const Nodes = ({ getFieldDecorator, setFieldsValue }) => {
  const [nodes, setNodes] = useState(EMPTY_INITIAL);
  getFieldDecorator(NODES.field, { initialValue: nodes });

  useEffect(() => {
    setFieldsValue({ [NODES.field]: nodes.map(({ value }) => value) });
  }, [nodes, setFieldsValue]);

  const onAddNode = () => {
    // Note the closure on id
    const id = nodes.length;

    const onValuesChange = (_, __, allValues) => {
      setNodes(prev => {
        // Changing the key "name" to "nodeName",
        // thats because "nodeName" is used by React when querying the dom.
        const { name, ...rest } = allValues;
        prev[id].value = { ...rest, nodeName: name };

        return [...prev];
      });
    };

    const DynamicForm = Form.create({ onValuesChange })(NodeForm);

    const newNode = {
      component: <DynamicForm key={id} id={id} />,
      value: {}
    };

    setNodes(prev => [...prev, newNode]);
  };

  const onRemoveNode = () => setNodes(removeLast);

  useEffect(() => {
    // Initial with a single node
    onAddNode();

    // eslint-disable-next-line
  }, []);

  return (
    <>
      {nodes.map(({ component }) => component)}
      <ButtonGroupCenter>
        <Button block icon="plus" type="primary" onClick={onAddNode}>
          Add Node
        </Button>
        {nodes.length > 1 && (
          <Button block icon="minus" type="danger" onClick={onRemoveNode}>
            Remove Last
          </Button>
        )}
      </ButtonGroupCenter>
    </>
  );
};

Nodes.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  setFieldsValue: PropTypes.func.isRequired
};

export default memo(Nodes);
