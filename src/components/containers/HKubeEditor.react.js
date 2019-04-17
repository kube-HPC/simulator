import React, { useState } from 'react';
import { Modal, Button, notification, Icon, Tabs } from 'antd';
import PropTypes from 'prop-types';
import generateName from 'sillyname';
import './HKubeEditor.scss';

// import AddPipelineForm from './AddPipelineForm.react';
// import JsonEditor from '../dumb/JsonEditor.react';

function HKubeEditor(props) {
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
        style={{ top: '2%' }}
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
            Reset
          </Button>,
          <Button key={3} onClick={onGenerate} disabled={true}>
            Generate
          </Button>,
          <Button key={4} onClick={onCancel}>
            Cancel
          </Button>
        ]}
        <JsonEditor value={json} onChange={setJson} />
      </Modal>
    </div>
  );
}

export default HKubeEditor;

HKubeEditor.propTypes = {
  okText: PropTypes.string.isRequired,
  title: PropTypes.string,
  hintText: PropTypes.string,
  pipelines: PropTypes.array.isRequired,
  algorithms: PropTypes.array.isRequired,
  styledButton: PropTypes.object.isRequired,
  action: PropTypes.func.isRequired,
  jsonTemplate: PropTypes.object.isRequired
};
