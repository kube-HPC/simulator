import React, { useState } from 'react';
import { Modal, Button, Card, notification, Icon, Row, Col, Input, Form, Divider } from 'antd';
import { Paragraph } from '../style/Styled';
import generateName from 'sillyname';
import './HKubeEditor.scss';

import JsonEditor from '../dumb/JsonEditor.react';
import DynamicForm from './DynamicForm.react';

export default function HKubeEditor(props) {
  const [json, setJson] = useState(props.jsonTemplate);
  const pipeline = JSON.parse(json);
  const algorithms = props.algorithms.map(a => a.data.name);

  let [isVisible, setVisible] = useState(false);
  let [isEditable, setEditable] = useState(false);

  const onReset = () => {
    setEditable(false);
    setJson(props.jsonTemplate);
  };

  const onOk = () => {
    try {
      props.action(JSON.parse(json));
      setEditable(false);
    } catch (e) {
      notification.config({
        placement: 'bottomRight'
      });
      notification.open({
        message: 'HKube Editor Error',
        description: e.message,
        icon: <Icon type="warning" style={{ color: 'red' }} />
      });
    }

    onVisible();
  };

  const onVisible = () => {
    setJson(isEditable ? json : props.jsonTemplate);
    setVisible(!isVisible);
  };

  const onGenerate = () => {
    const minimalPipeline = {
      name: generateName().replace(' ', '-'),
      nodes: [
        {
          nodeName: generateName(),
          algorithmName: algorithms[Math.floor(Math.random() * algorithms.length)]
        }
      ]
    };

    setJson(JSON.stringify(minimalPipeline, null, 2));
  };

  const onCancel = onVisible;

  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 }
  };

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 20, offset: 3 }
    }
  };

  return (
    <div>
      {props.styledButton(() => setVisible(!isVisible))}
      <Modal
        visible={isVisible}
        width={'60%'}
        title={props.title}
        onOk={onOk}
        onCancel={onCancel}
        footer={[
          <Button key={1} type="primary" size="default" onClick={onOk}>
            {props.okText}
          </Button>,
          <Button key={2} onClick={onReset}>
            {' '}
            Reset
          </Button>,
          <Button key={3} onClick={onGenerate}>
            {' '}
            Generate
          </Button>,
          <Button key={4} onClick={onCancel}>
            {' '}
            Cancel
          </Button>
        ]}
      >
        <Row>
          <Col span={9}>
            <JsonEditor
              jsonTemplate={json}
              pipe={newPipe => {
                setJson(newPipe);
                setEditable(true);
              }}
            />
          </Col>
          <Col span={1}>
            <Divider type="vertical" className="divider" />
          </Col>
          <Col span={14}>
            <Form.Item {...formItemLayout} label="Name" required={true}>
              <Input
                placeholder="Unique Identifier"
                value={pipeline.name}
                onChange={s => {
                  pipeline.name = s.target.value;
                  setJson(JSON.stringify(pipeline, null, 2));
                }}
              />
            </Form.Item>
            <DynamicForm
              jsonRecord={json}
              onChange={pipeline => setJson(pipeline)}
              formItemLayout={formItemLayout}
              formItemLayoutWithOutLabel={formItemLayoutWithOutLabel}
            />
          </Col>
        </Row>
        <Paragraph>{props.hintText}</Paragraph>
      </Modal>
    </div>
  );
}
