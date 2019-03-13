import React, { useState } from 'react';
import { Modal, Button, Card, notification, Icon, Row, Col, Input, Form, Divider } from 'antd';

import './DynamicForm.scss';

let id = 0;

function DynamicForm(props) {
  const { formItemLayout, formItemLayoutWithOutLabel } = props;
  const { getFieldDecorator, getFieldValue } = props.form;

  const pipeline = JSON.parse(props.jsonRecord);
  const onChange = props.onChange;

  getFieldDecorator('keys', { initialValue: [] });
  const keys = getFieldValue('keys');

  const formItems = keys.map((k, index) => {
    return (
      <Form.Item key={k}>
        <Row type="flex" justify="space-between">
          <Col span={22}>
            <Row gutter={12}>
              <Col span={12}>
                <Input placeholder="Node Name" />
              </Col>
              <Col span={12}>
                <Input placeholder="Algorithm Name" />
              </Col>
            </Row>
          </Col>
          <Col>
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => removeNode(k)}
            />
          </Col>
        </Row>
      </Form.Item>
    );
  });

  const addNode = () => {
    const { form } = props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  const removeNode = k => {
    const { form } = props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  return (
    <Form>
      <Form.Item {...formItemLayout} label="Nodes" required={true}>
        <Form>
          <Form.Item required={true}>
            <Row gutter={12}>
              <Col span={12}>
                <Input
                  placeholder="Node Name"
                  value={pipeline.nodes[0].nodeName}
                  onChange={s => {
                    pipeline.nodes[0].nodeName = s.target.value;
                    onChange(JSON.stringify(pipeline, null, 2));
                  }}
                />
              </Col>
              <Col span={12}>
                <Input
                  placeholder="Algorithm Name"
                  value={pipeline.nodes[0].algorithmName}
                  onChange={s => {
                    pipeline.nodes[0].algorithmName = s.target.value;
                    onChange(JSON.stringify(pipeline, null, 2));
                  }}
                />
              </Col>
            </Row>
          </Form.Item>
        </Form>
        {formItems}
      </Form.Item>
      <Form.Item {...formItemLayoutWithOutLabel}>
        <Button type="dashed" onClick={addNode} style={{ width: '100%' }}>
          <Icon type="plus" /> Add Node
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Form.create({ name: 'dynamic_form_item' })(DynamicForm);
