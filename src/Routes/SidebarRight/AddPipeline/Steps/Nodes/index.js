import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Theme } from 'styles/colors';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Radio, Input, Tag } from 'antd';
import { FlexBox } from 'components/common';
import { NODE_KINDS_COLOR } from 'styles';
import { KIND_NODE_SHORT_NAME } from 'const';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import AlgorithmNode from './Algorithms';
import DataSourceNode from './DataSource';
import GatewayNode from './Gateway';
import OutputNode from './Output';
import HyperParamsNode from './HyperParams';
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

const DataNode = styled.div`
  ${props =>
    props.$isDisabled &&
    `

        pointer-events:none;

        .ant-divider{
          pointer-events:auto;
        }

        .ant-select-selector,
        .ant-switch-checked,
        .ant-radio-button-wrapper,
        .ant-input-affix-wrapper,input
        {
          color: rgba(0, 0, 0, 0.25);
          background-color: #f5f5f5;
          cursor: not-allowed;
          opacity: 1;
        
        }

       
    `}
`;

const TagByName = styled(Tag)`
  border: 0px;
  color: ${props => props.colors.white};
  font-weight: 500;
  background-color: ${props => props.$tagColor};
  border-radius: 50px;
`;

const nodesMap = {
  output: OutputNode,
  gateway: GatewayNode,
  dataSource: DataSourceNode,
  algorithm: AlgorithmNode,
  hyperparamsTuner: HyperParamsNode,
};

const Node = ({ kind, id }) => {
  const NodeFields = nodesMap[kind];
  return !NodeFields ? null : <NodeFields id={id} />;
};

Node.propTypes = {
  kind: PropTypes.oneOf([
    'dataSource',
    'algorithm',
    'gateway',
    'output',
    'hyperparamsTuner',
  ]).isRequired,
  id: PropTypes.node.isRequired,
};

/**
 * @param {import('antd/lib/form/Form.d').WrappedFormUtils & {
 *   style: import('react').StyleHTMLAttributes;
 * }} props
 */
const Nodes = ({ style }) => {
  const {
    form: { getFieldValue, getFieldsValue, setFieldsValue },
    initialState,
    isStreamingPipeline,
    isRunPipeline,
    graphNodeSelected,
    setForm,
  } = useWizardContext();

  const { dataSourceIsEnable } = useSelector(selectors.connection);
  const nodeSelectRadio = useRef();
  const [ids, appendKey, dropKey, reloadIds] = useIds(
    Object.keys(initialState.nodes)
  );

  const [activeNodeId, setActiveNodeId] = useState(ids[0]);

  const handleKindChange = (e, id) => {
    const kindValue = e.target.value;
    const nodesArr = getFieldValue(['nodes']);

    if (kindValue !== 'gateway') {
      nodesArr[id].kind = 'algorithm';
      nodesArr[id].stateType = kindValue;
    } else {
      nodesArr[id].kind = 'gateway';
      nodesArr[id].stateType = 'stateful';
    }

    setFieldsValue({ nodes: nodesArr });
    setForm();
  };

  const getDefaultValueStateType = id => {
    const nodesArr = getFieldValue(['nodes']);
    return nodesArr[id].stateType;
  };

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

      // delete node from Form State
      const formFields = getFieldsValue(true);
      formFields.nodes[id] = undefined;
      setFieldsValue({ nodes: formFields.nodes });
      setForm();
    },
    [ids, dropKey, getFieldsValue, setFieldsValue, setForm]
  );

  const handleAddNode = useCallback(() => {
    appendKey();
    setActiveNodeId(ids.length);
  }, [appendKey, ids]);

  useEffect(() => {
    if (graphNodeSelected) {
      const formFields = getFieldsValue(true);

      const indexNode = formFields.nodes.findIndex(
        item => item.nodeName === graphNodeSelected[0]
      );

      setActiveNodeId(indexNode);
    }
  }, [graphNodeSelected]);

  const [reloadNodes, setReloadNodes] = useState(true);
  useEffect(() => {
    if (isStreamingPipeline) {
      const formFields = getFieldsValue();
      reloadIds(formFields.nodes.filter(x => x.nodeName !== undefined));
      setReloadNodes(false);
      setTimeout(() => {
        setReloadNodes(true);
      }, 100);
    }
  }, [isStreamingPipeline]);

  return (
    reloadNodes && (
      <div style={style}>
        <NodeBrowserContainer>
          <NodeSelectRadioGroup
            ref={nodeSelectRadio}
            value={activeNodeId}
            buttonStyle="outline"
            onChange={selectActiveNode}>
            {ids.map(id => {
              const kindName = getFieldValue(['nodes', id, 'kind']);

              return (
                <NodeSelectRadioButton key={`node-radio-${id}`} value={id}>
                  <TagByName
                    $tagColor={NODE_KINDS_COLOR[kindName]}
                    colors={Theme.COLOR}>
                    {KIND_NODE_SHORT_NAME[kindName]}
                  </TagByName>{' '}
                  {getFieldValue(['nodes', id, 'nodeName']) || `node-${id}`}
                </NodeSelectRadioButton>
              );
            })}

            {!isRunPipeline && (
              <AddNodeButton
                icon={<PlusOutlined />}
                type="dashed"
                onClick={handleAddNode}
              />
            )}
          </NodeSelectRadioGroup>
        </NodeBrowserContainer>

        {ids.map(id => (
          <DataNode key={`dataNode::id-${id}`} $isDisabled={isRunPipeline}>
            <BoldedFormField
              key={`node::id-${id}`}
              style={{
                display: activeNodeId === id ? '' : 'none',
                margin: 0,
              }}
              required={false}>
              <FlexBox align="normal">
                <TitleNode>
                  {getFieldValue(['nodes', id, 'nodeName']) || `node-${id}`}
                </TitleNode>
                {!isRunPipeline && ids.length > 1 ? (
                  <Button
                    icon={<CloseCircleOutlined />}
                    ghost
                    onClick={() => handleDelete(id)}
                    type="danger"
                    style={{ marginLeft: 'auto' }}>
                    Delete Node
                  </Button>
                ) : null}
              </FlexBox>
              <FormItemLabelWrapper
                style={isStreamingPipeline ? { display: 'none' } : {}}
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

                  {dataSourceIsEnable && (
                    <Radio.Button value="dataSource">DataSource</Radio.Button>
                  )}

                  {isStreamingPipeline && (
                    <Radio.Button value="gateway">Gateway</Radio.Button>
                  )}

                  {!isStreamingPipeline && (
                    <>
                      <Radio.Button value="output">Output</Radio.Button>
                      <Radio.Button value="hyperparamsTuner">
                        Hyper Params
                      </Radio.Button>
                    </>
                  )}
                </Radio.Group>
              </FormItemLabelWrapper>
              {isStreamingPipeline && (
                <Field title="Kind">
                  <Radio.Group
                    defaultValue={() => getDefaultValueStateType(id)}
                    buttonStyle="solid"
                    onChange={e => handleKindChange(e, id)}>
                    <Radio.Button value="stateless">stateless</Radio.Button>
                    <Radio.Button value="stateful">stateful</Radio.Button>
                    <Radio.Button value="gateway">gateway</Radio.Button>
                  </Radio.Group>
                </Field>
              )}

              {isStreamingPipeline && (
                <Field
                  overrides={{ style: { display: 'none' } }}
                  name={['nodes', id, 'stateType']}
                  title="state Type"
                  required>
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value="stateless">stateless</Radio.Button>
                    <Radio.Button value="stateful">stateful</Radio.Button>
                  </Radio.Group>
                </Field>
              )}
              <Field
                title="Node name"
                name={['nodeName']}
                rootId={['nodes', id]}
                extraRules={[
                  {
                    max: 32,
                    message: 'Node name has to be shorter than 32 characters',
                  },
                ]}>
                <Input placeholder="Node name" />
              </Field>
              <Node
                id={id}
                kind={getFieldValue(['nodes', id, 'kind']) || 'algorithm'}
              />
            </BoldedFormField>
          </DataNode>
        ))}
      </div>
    )
  );
};

Nodes.propTypes = {
  // eslint-disable-next-line
  style: PropTypes.object.isRequired,
};

export default Nodes;
