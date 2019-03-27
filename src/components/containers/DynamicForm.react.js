import React from 'react';
import { Button, Icon, Row, Col, Input, Form, Select } from 'antd';

import './DynamicForm.scss';

const removeElementN = (array, N) => array.slice(0, N).concat(array.slice(N + 1, array.length));

const selectOptions = algorithms =>
  algorithms.map((value, i) => (
    <Select.Option key={i} value={value}>
      {value}
    </Select.Option>
  ));

function DynamicForm(props) {
  const { formData, form, onChange } = props;
  const { getFieldDecorator, getFieldValue } = form;
  const nodes = formData.nodes;

  const onChangeNode = (formData, index, t1, t2 = undefined) => c => {
    const value = c && c.target ? c.target.value : c;
    const node = formData[t1][index];
    formData[t1][index] = { ...node, [t2]: value };
    onChange({ ...formData });
  };

  const addRemoveIcon = i => {
    const iconComponent = (
      <Col key={i}>
        <Icon className="dynamic-delete-button" type="minus-circle-o" onClick={() => removeNode(i)} />
      </Col>
    );
    return i === 0 ? [] : [iconComponent];
  };

  getFieldDecorator('keys', { initialValue: [...Array(nodes.length).keys()] });
  const keys = getFieldValue('keys');

  const formItems = keys.map(i => {
    return (
      <Form.Item key={i} required={i === 0}>
        <Row type="flex" justify="space-between">
          <Col span={22}>
            <Row gutter={12}>
              <Col span={12}>
                <Input placeholder="Node Name" value={nodes[i] ? nodes[i].nodeName : ''} onChange={onChangeNode(formData, i, 'nodes', 'nodeName')} />
              </Col>
              <Col span={12}>
                <Select value={nodes[i] ? nodes[i].algorithmName : ''} onChange={onChangeNode(formData, i, 'nodes', 'algorithmName')}>
                  {selectOptions(props.algorithms)}
                </Select>
              </Col>
            </Row>
            <Row>
              <Col>
                <Input.TextArea value={JSON.stringify(nodes[i].input)} placeholder="Input" autosize={{ minRows: 2 }} disabled={true} />
              </Col>
            </Row>
          </Col>

          {addRemoveIcon(i)}
        </Row>
      </Form.Item>
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
    const updateNode = removeElementN(nodes, k);
    form.setFieldsValue({ keys: [...updateNode.keys()] });
    onChange({ ...formData, nodes: updateNode });
  };

  return (
    <div>
      <Form.Item {...props.formItemLayout} label="Nodes" required={true}>
        {formItems}
      </Form.Item>
      <Form.Item {...props.formItemLayoutWithOutLabel}>
        <Button type="dashed" onClick={addNode} style={{ width: '100%' }}>
          <Icon type="plus" /> Add Node
        </Button>
      </Form.Item>
    </div>
  );
}

export default Form.create({ name: 'dynamic_form_item' })(DynamicForm);
