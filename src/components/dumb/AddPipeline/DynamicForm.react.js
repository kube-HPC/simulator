import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Select, Col, Row, Card } from 'antd';

export const removeNElement = (array, N) =>
  array.slice(0, N).concat(array.slice(N + 1, array.length));

const selectOptions = algorithms =>
  algorithms.map((value, i) => (
    <Select.Option key={i} value={value}>
      {value}
    </Select.Option>
  ));

const id = 'dynamic-form';

function DynamicForm(props) {
  const { formData, form, onChange } = props;
  const { formItemLayout } = props;
  const { getFieldDecorator, getFieldValue } = form;
  const nodes = formData.nodes;

  const onChangeNode = (formData, index, t1, t2 = undefined) => c => {
    const value = c && c.target ? c.target.value : c;
    const node = formData[t1][index];
    formData[t1][index] = { ...node, [t2]: value };
    onChange({ ...formData });
  };

  getFieldDecorator('keys', { initialValue: [...Array(nodes.length).keys()] });

  const addInput = i => () => {
    nodes[i].input.push('');
    onChange({ ...formData });
  };

  const removeInput = (nodeIndex, inputIndex) => {
    const updated = removeNElement(nodes[nodeIndex].input, inputIndex);
    nodes[nodeIndex].input = updated;
    onChange({ ...formData });
  };

  const validateName = name => (!(name !== '') ? 'error' : 'success');
  const validateHelp = (name, msg) => !(name !== '') && msg;

  const formItems = getFieldValue('keys').map(i => {
    const inputs = nodes[i].input;
    return (
      <Card key={i} size="small" style={{ marginBottom: '10px' }}>
        <Row type="flex" gutter={10}>
          <Col span={22}>
            <Form.Item required={i === 0}>
              <Form.Item
                {...formItemLayout}
                label="Node Name"
                validateStatus={validateName(nodes[i].nodeName)}
                help={validateHelp(nodes[i].nodeName, 'Name cannot be empty')}
              >
                <Input
                  placeholder="Node Name"
                  value={nodes[i] ? nodes[i].nodeName : ''}
                  onChange={onChangeNode(formData, i, 'nodes', 'nodeName')}
                />
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="Algorithm Name"
                validateStatus={validateName(nodes[i].algorithmName)}
                help={validateHelp(
                  nodes[i].algorithmName,
                  'Algorithm cannot be empty'
                )}
              >
                <Select
                  placeholder="Select Algorithm Name"
                  onChange={onChangeNode(formData, i, 'nodes', 'algorithmName')}
                  getPopupContainer={() => document.getElementById(id)}
                >
                  {selectOptions(props.algorithms)}
                </Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="Input">
                {inputs &&
                  inputs.map((value, index) => (
                    <Row key={`${i}_${index}`} gutter={10} type="flex">
                      <Col span={22}>
                        <Input
                          value={value}
                          onChange={e => {
                            inputs[index] = e.target.value;
                            onChange({ ...formData });
                          }}
                        />
                      </Col>
                      <Col span={2}>
                        <Button
                          type="danger"
                          icon="minus"
                          onClick={() => removeInput(i, index)}
                        />
                      </Col>
                    </Row>
                  ))}
                <Button
                  type="dashed"
                  icon="plus"
                  onClick={addInput(i)}
                  style={{ width: '100%' }}
                >
                  Add Input
                </Button>
              </Form.Item>
            </Form.Item>
          </Col>
          <Col span={2}>
            {i === 0 ? (
              <div />
            ) : (
              <Button
                type="danger"
                icon="minus"
                onClick={() => removeNode(i)}
                style={{ marginTop: '7.5%' }}
              />
            )}
          </Col>
        </Row>
      </Card>
    );
  });

  const addNode = () => {
    const keys = form.getFieldValue('keys');
    nodes.push(props.emptyData);
    onChange({ ...formData, nodes });
    const nextKeys = keys.concat(nodes.length - 1);
    form.setFieldsValue({ keys: nextKeys });
  };

  const removeNode = k => {
    const updateNode = removeNElement(nodes, k);
    form.setFieldsValue({ keys: [...updateNode.keys()] });
    onChange({ ...formData, nodes: updateNode });
  };

  return (
    <div id={id}>
      <Form.Item required={true}>{formItems}</Form.Item>
      <Button
        type="dashed"
        icon="plus"
        onClick={addNode}
        style={{ width: '100%' }}
      >
        Add Node
      </Button>
    </div>
  );
}

DynamicForm.propTypes = {
  formData: PropTypes.object.isRequired,
  emptyData: PropTypes.object.isRequired,
  algorithms: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  formItemLayoutWithOutLabel: PropTypes.object.isRequired,
  formItemLayout: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired
};

export default Form.create({ name: 'dynamic_form_item' })(DynamicForm);
