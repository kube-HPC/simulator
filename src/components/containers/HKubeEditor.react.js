import React, { useState } from 'react';
import { Modal, Button, notification, Icon } from 'antd';
import { Paragraph } from '../style/Styled';
import generateName from 'sillyname';
import './HKubeEditor.scss';

import LiveJsonEditor from '../dumb/LiveJsonEditor.react';

export default function HKubeEditor(props) {
  const [json, setJson] = useState(props.jsonTemplate);
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

  return (
    <div>
      {props.styledButton(() => setVisible(!isVisible))}
      <Modal
        visible={isVisible}
        width={'80%'}
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
        <LiveJsonEditor onChange={setJson} formData={JSON.parse(json)} pipelines={props.pipelines} algorithms={props.algorithms.map(value => value.key)} />
        <Paragraph>{props.hintText}</Paragraph>
      </Modal>
    </div>
  );
}
