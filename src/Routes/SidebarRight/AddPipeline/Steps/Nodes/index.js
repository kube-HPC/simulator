import React, { useCallback, useState } from 'react';
import { Theme } from 'styles/colors';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Radio, Input, Tag } from 'antd';
import AlgorithmNode from './Algorithms';
import DataSourceNode from './DataSource';
import GatewayNode from './Gateway';
import OutputNode from './Output';
import useIds from './useIds';
import useWizardContext from '../../useWizardContext';
import { BoldedFormField } from './../../styles';
import { Field, FormItemLabelWrapper } from './../FormUtils';

const TitleNode = styled.h1`
  font-size: 28px;
`;

const NodeBrowserContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px dashed #ccc;
  margin-bottom: 1em;
  padding-bottom: 1em;
`;

const NodeSelectRadioButton = styled(Radio.Button)`
  &:nth-child(1) {
    border-radius: 0.5em;
  }
  width: calc(33% - 1ch);
  border-width: 1px;
  border-radius: 0.5em;
  margin: 0.5em 0.5ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: none;

  &.ant-radio-button-wrapper-checked {
    background-color: ${props =>
      props.theme.Styles.nodeSelectRadioButton.bgButton};
  }
`;
const AddNodeButton = styled(Button)`
  width: calc(33% - 1ch);
  border-radius: 0.5em;
  margin: 0.5em 0.5ch;

  background: #1890ff;
  color: #ffffff;

  &:hover,
  :focus {
    background: #1890ff;
    color: #ffffff;
  }
`;

const NodeSelectRadioGroup = styled(Radio.Group)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 0;
  margin-bottom: auto;
  width: 100%;
`;

const TagByName = styled(Tag)`
  border: 0px;
  color: ${props => props.colors.white};
  font-weight: 500;
  background-color: ${props =>
    props.tagcolor === 'gateway'
      ? props.colors.greenDark
      : props.tagcolor === 'dataSource'
      ? props.colors.darkPurple
      : props.tagcolor === 'algorithm'
      ? props.colors.pink
      : props.tagcolor === 'output'
      ? props.colors.orangePale
      : ''};
  border-radius: 50px;
`;

const nodesMap = {
  output: OutputNode,
  gateway: GatewayNode,
  dataSource: DataSourceNode,
  algorithm: AlgorithmNode,
};

const Node = ({ kind, id }) => {
  const NodeFields = nodesMap[kind];
  return !NodeFields ? null : <NodeFields id={id} />;
};

Node.propTypes = {
  kind: PropTypes.oneOf(['dataSource', 'algorithm', 'gateway', 'output'])
    .isRequired,
  id: PropTypes.node.isRequired,
};

/**
 * @param {import('antd/lib/form/Form.d').WrappedFormUtils & {
 *   style: import('react').StyleHTMLAttributes;
 * }} props
 */
const Nodes = ({ style }) => {
  const {
    form: { getFieldValue },
    initialState,
    isStreamingPipeline,
  } = useWizardContext();

  const getShortName = name => {
    if (name !== undefined) {
      const arrName = name.split(/(?=[A-Z])/);
      return arrName.map(i => i[0].toUpperCase());
    }
    return ' ';
  };

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

  const handleAddNode = useCallback(() => {
    appendKey();
    setActiveNodeId(ids.length);
  }, [appendKey, ids]);

  return (
    <div style={style}>
      <NodeBrowserContainer>
        <NodeSelectRadioGroup
          value={activeNodeId}
          buttonStyle="outline"
          onChange={selectActiveNode}>
          {ids.map(id => (
            <NodeSelectRadioButton key={`node-radio-${id}`} value={id}>
              <TagByName
                tagcolor={getFieldValue(['nodes', id, 'kind'])}
                colors={Theme.COLOR}>
                {getShortName(getFieldValue(['nodes', id, 'kind']))}
              </TagByName>{' '}
              {getFieldValue(['nodes', id, 'nodeName']) || `node-${id}`}
            </NodeSelectRadioButton>
          ))}
          <AddNodeButton
            icon={<PlusOutlined />}
            type="dashed"
            onClick={handleAddNode}
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
          <TitleNode>
            {getFieldValue(['nodes', id, 'nodeName']) || `node-${id}`}
          </TitleNode>

          <h2>
            <FormItemLabelWrapper
              label="Kind"
              name={['nodes', id, 'kind']}
              initialValue={
                initialState?.nodes[id]?.kind
                  ? initialState.nodes[id].kind
                  : 'algorithm'
              }>
              <Radio.Group
                buttonStyle="solid"
                style={{ display: 'flex', alignItems: 'center' }}>
                <Radio.Button value="algorithm">Algorithm</Radio.Button>
                <Radio.Button value="dataSource">DataSource</Radio.Button>

                {isStreamingPipeline && (
                  <Radio.Button value="gateway">Gateway</Radio.Button>
                )}

                {!isStreamingPipeline && (
                  <Radio.Button value="output">Output</Radio.Button>
                )}

                {ids.length > 1 ? (
                  <Button
                    icon={<CloseCircleOutlined />}
                    ghost
                    onClick={() => handleDelete(id)}
                    type="danger"
                    style={{ marginLeft: 'auto' }}>
                    Delete Node
                  </Button>
                ) : null}
              </Radio.Group>
            </FormItemLabelWrapper>

            <Field
              title="Node Name"
              name={['nodeName']}
              rootId={['nodes', id]}
              extraRules={[
                {
                  max: 32,
                  message: 'Node Name has to be shorter than 32 characters',
                },
              ]}>
              <Input placeholder="Node Name" />
            </Field>

            {getFieldValue(['nodes', id, 'kind']) && (
              <Node id={id} kind={getFieldValue(['nodes', id, 'kind'])} />
            )}
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
