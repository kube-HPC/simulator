import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Radio, Input, Form } from 'antd';
import AlgorithmNode from './Algorithms';
import DataSourceNode from './DataSource';
import useIds from './useIds';
import useWizardContext from '../../useWizardContext';
import DeleteButton from './DeleteButton';
import { BoldedFormField } from './../../styles';

const ButtonGroupCenter = styled(Button.Group)`
  display: flex;
  justify-content: center;
  margin-top: 20px;
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
  const [ids, appendKey, dropKey] = useIds(
    Object.keys(initialState?.nodes ?? {})
  );

  return (
    <div style={style}>
      {ids.map((id, ii) => (
        <BoldedFormField
          style={{
            borderBottom: '1px dashed #ccc',
            paddingBottom: '1em',
          }}
          label={`Node ${ii}`}
          required={false}
          key={`node::id-${id}`}>
          <>
            {getFieldDecorator(`nodes.${id}.kind`, {
              initialValue: 'algorithm',
            })(
              <Radio.Group
                buttonStyle="solid"
                style={{ display: 'flex', alignItems: 'center' }}>
                <Radio.Button value="algorithm">Algorithm</Radio.Button>
                <Radio.Button value="dataSource">dataSource</Radio.Button>
                {ids.length > 1 ? (
                  <DeleteButton
                    type="close-circle"
                    theme="filled"
                    onClick={() => dropKey(id)}
                  />
                ) : null}
              </Radio.Group>
            )}
            <Form.Item label="Node Name">
              {getFieldDecorator(`nodes.${id}.nodeName`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message:
                      "Please input passenger's name or delete this field.",
                  },
                ],
              })(<Input placeholder="Node Name" />)}
            </Form.Item>
            <Node id={id} kind={getFieldValue(`nodes.${id}.kind`)} />
          </>
        </BoldedFormField>
      ))}
      <ButtonGroupCenter>
        <Button block icon="plus" type="primary" onClick={appendKey}>
          Add Node
        </Button>
      </ButtonGroupCenter>
    </div>
  );
};

Nodes.propTypes = {
  // eslint-disable-next-line
  style: PropTypes.object.isRequired,
};

export default Nodes;
