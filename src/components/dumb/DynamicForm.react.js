import React from 'react';
import { Button, Icon, Input, Form, Select } from 'antd';

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
  const { formItemLayout, formItemLayoutWithOutLabel } = props;
  const { getFieldDecorator, getFieldValue } = form;

  const onChangeNode = (formData, index, t1, t2 = undefined) => c => {
    const value = c && c.target ? c.target.value : c;
    const node = formData[t1][index];
    formData[t1][index] = { ...node, [t2]: value };
    onChange({ ...formData });
  };

  const nodes = formData.nodes;

  getFieldDecorator('keys', { initialValue: [...Array(nodes.length).keys()] });

  const formItems = getFieldValue('keys').map(i => {
    return (
      <Form.Item key={i} required={i === 0}>
        <Form.Item {...formItemLayout} label="Node Name">
          <Input placeholder="Node Name" value={nodes[i] ? nodes[i].nodeName : ''} onChange={onChangeNode(formData, i, 'nodes', 'nodeName')} />
        </Form.Item>
        <Form.Item {...formItemLayout} label="Algorithm Name">
          <Select placeholder="Select Algorithm Name" onChange={onChangeNode(formData, i, 'nodes', 'algorithmName')}>
            {selectOptions(props.algorithms)}
          </Select>
        </Form.Item>
        <Form.Item {...formItemLayout} label="Input">
          <Input.TextArea placeholder="Insert Input Array" autosize={{ minRows: 2 }} disabled={true} />
        </Form.Item>
        {i !== 0 ? (
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="danger" onClick={() => removeNode(i)}>
              <Icon type="minus" /> Remove Node
            </Button>
          </Form.Item>
        ) : (
          <div />
        )}
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
      <Form.Item required={true}>{formItems}</Form.Item>
      <Form.Item {...formItemLayoutWithOutLabel}>
        <Button type="dashed" onClick={addNode} style={{ width: '100%' }}>
          <Icon type="plus" /> Add Node
        </Button>
      </Form.Item>
    </div>
  );
}

export default Form.create({ name: 'dynamic_form_item' })(DynamicForm);
