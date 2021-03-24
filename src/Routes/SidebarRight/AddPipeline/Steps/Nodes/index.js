import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Radio, Input } from 'antd';
import AlgorithmNode from './Algorithms';
import DataSourceNode from './DataSource';
import useIds from './useIds';
import useWizardContext from '../../useWizardContext';
import { BoldedFormField } from './../../styles';
import { Field } from './../FormUtils';

const NodeBrowserContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px dashed #ccc;
  margin-bottom: 1em;
  padding-bottom: 1em;
`;

const NodeSelectRadioButton = styled(Radio.Button)`
  width: calc(25% - 1ch);
  border-radius: 0.5em;
  margin: 0.5em 0.5ch;
`;
const AddNodeButton = styled(Button)`
  width: calc(25% - 1ch);
  border-radius: 0.5em;
  margin: 0.5em 0.5ch;
`;

const NodeSelectRadioGroup = styled(Radio.Group)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 0;
  margin-bottom: auto;
  width: 100%;
`;

const NodeNameHeader = styled.h1`
  text-transform: capitalize;
`;

const nodesMap = {
  dataSource: DataSourceNode,
  algorithm: AlgorithmNode,
};

const Node = ({ kind, id }) => {
  const NodeFields = nodesMap[kind];
  return !NodeFields ? null : <NodeFields id={id} />;
};

Node.propTypes = {
  kind: PropTypes.oneOf(['dataSource', 'algorithm']).isRequired,
  id: PropTypes.node.isRequired,
};

/**
 * @param {import('antd/lib/form/Form.d').WrappedFormUtils & {
 *   style: import('react').StyleHTMLAttributes;
 * }} props
 */
const Nodes = ({ style }) => {
  const {
    form: { getFieldDecorator, getFieldValue },
    initialState,
  } = useWizardContext();

  const [ids, appendKey, dropKey] = useIds(Object.keys(initialState.nodes));

  const [activeNodeId, setActiveNodeId] = useState(ids[0]);

  const selectActiveNode = useCallback(
    e => {
      setActiveNodeId(e.target.value);
    },
    [setActiveNodeId]
  );

  const handleDelete = useCallback(
    id => {
      const idx = ids.indexOf(id);
      const nextIdx = (() => {
        if (idx === ids.length - 1) return ids.length - 2;
        if (idx === 0) return 1;
        return idx - 1;
      })();
      const nextId = ids[nextIdx];
      dropKey(id);
      setActiveNodeId(nextId);
    },
    [dropKey, setActiveNodeId, ids]
  );

  return (
    <div style={style}>
      <NodeBrowserContainer>
        <NodeSelectRadioGroup
          value={activeNodeId}
          buttonStyle="outline"
          onChange={selectActiveNode}>
          {ids.map(id => (
            <NodeSelectRadioButton key={`node-radio-${id}`} value={id}>
              {getFieldValue(`nodes.${id}.nodeName`) || `node-${id}`}
            </NodeSelectRadioButton>
          ))}
          <AddNodeButton
            // block
            icon="plus"
            type="dashed"
            onClick={appendKey}
          />
        </NodeSelectRadioGroup>
      </NodeBrowserContainer>
      {ids.map(id => (
        <BoldedFormField
          key={`node::id-${id}`}
          style={{
            display: activeNodeId === id ? '' : 'none',
            margin: 0,
          }}
          required={false}>
          <NodeNameHeader>
            {getFieldValue(`nodes.${id}.nodeName`) || `node-${id}`}
          </NodeNameHeader>
          <h2>
            {getFieldDecorator(`nodes.${id}.kind`, {
              initialValue: 'algorithm',
            })(
              <Radio.Group
                buttonStyle="solid"
                style={{ display: 'flex', alignItems: 'center' }}>
                <Radio.Button value="algorithm">Algorithm</Radio.Button>
                <Radio.Button value="dataSource">dataSource</Radio.Button>
                {ids.length > 1 ? (
                  <Button
                    icon="close-circle"
                    ghost
                    onClick={() => handleDelete(id)}
                    type="danger"
                    style={{ marginLeft: 'auto' }}>
                    Delete Node
                  </Button>
                ) : null}
              </Radio.Group>
            )}
            <Field
              title="Node Name"
              name="nodeName"
              rootId={`nodes.${id}`}
              getFieldDecorator={getFieldDecorator}
              extraRules={[
                {
                  max: 32,
                  message: 'Node Name has to be shorter than 32 characters',
                },
              ]}>
              <Input placeholder="Node Name" />
            </Field>
            <Node id={id} kind={getFieldValue(`nodes.${id}.kind`)} />
          </h2>
        </BoldedFormField>
      ))}
    </div>
  );
};

Nodes.propTypes = {
  // eslint-disable-next-line
  style: PropTypes.object.isRequired,
};

export default Nodes;
