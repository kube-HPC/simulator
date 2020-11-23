import React, {
  useState,
  useEffect,
  memo,
  useContext,
  useCallback,
} from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { Form } from 'components/common';
import addPipelineSchema from 'config/schema/addPipeline.schema';
import NodeForm from './NodeForm.react';
import { removeLast } from './helpers';
import { FormContext } from '../../Form/AddPipelineForm.react';

const ButtonGroupCenter = styled(Button.Group)`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const { NODES } = addPipelineSchema;
const EMPTY_INITIAL = [];

const Nodes = () => {
  // TODO: convert this whole component to formik or react-hook-form

  const [nodes, setNodes] = useState(EMPTY_INITIAL);

  const { getFieldDecorator, setFieldsValue } = useContext(FormContext);

  getFieldDecorator(NODES.field, { initialValue: nodes });

  useEffect(() => {
    setFieldsValue({ [NODES.field]: nodes.map(({ value }) => value) });
  }, [nodes, setFieldsValue]);

  const onAddNode = useCallback(() => {
    // Note the closure on id
    const id = nodes.length;

    const onValuesChange = (_, __, allValues) => {
      setNodes(state => {
        // Changing the key "name" to "nodeName",
        // thats because "nodeName" is used by React when querying the dom.
        const { name, ...rest } = allValues;
        return [
          ...state.slice(0, id),
          {
            ...state[id],
            value: { ...rest, nodeName: name },
          },
          ...state.slice(id + 1),
        ];
      });
    };

    const DynamicForm = Form.create({ onValuesChange })(NodeForm);

    const newNode = {
      component: <DynamicForm key={id} id={id} />,
      value: {},
    };

    setNodes(state => [...state, newNode]);
  }, [nodes, setNodes]);

  const onRemoveNode = () => setNodes(removeLast);

  useEffect(() => {
    onAddNode();
    // NOTE: the dependency array triggers infinite render
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

export default memo(Nodes);
