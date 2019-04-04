import React, { useState } from 'react';
import { Row, Col, Input, Form, Divider, Switch, Slider, InputNumber, Select, Popover } from 'antd';
import cronstrue from 'cronstrue';
import cronParser from 'cron-parser';

import './AddPipelineForm.scss';

import DynamicForm from './DynamicForm.react';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};

const stringify = obj => JSON.stringify(obj, null, 2);

const addCronContent = formData => {
  let isLegalPattern = false;
  let next = '';
  let current = '';
  try {
    next = cronParser
      .parseExpression(formData.triggers.cron.pattern)
      .next()
      .toString();
    current = cronstrue.toString(formData.triggers.cron.pattern, {
      use24HourTimeFormat: true
    });
    isLegalPattern = true;
  } catch {
    isLegalPattern = false;
  }
  return isLegalPattern ? `${current}, Next Interval: ${next}` : 'Invalid Pattern';
};
const addPipelineOptions = pipelines =>
  pipelines.map((pipeline, i) => (
    <Select.Option key={i} value={pipeline}>
      {pipeline}
    </Select.Option>
  ));

export default function AddPipelineForm(props) {
  const [formData, setFormData] = useState(props.formData);

  const onChangeTarget = (formData, t1, t2 = undefined) => c => {
    const value = c && c.target ? c.target.value : c;
    const targetKey = t2 ? { ...formData[t1], [t2]: value } : value;
    setFormData({ ...formData, [t1]: targetKey });
  };

  return (
    <Form>
      <Form.Item {...formItemLayout} label="Name" required={true}>
        <Input placeholder="Unique Identifier" value={formData.name} onChange={onChangeTarget(formData, 'name')} />
      </Form.Item>
      <Form.Item {...formItemLayout} label="Description">
        <Input.TextArea value={formData.description} placeholder="Pipeline Description" onChange={onChangeTarget(formData, 'description')} autosize />
      </Form.Item>
      <Form.Item {...formItemLayout} label="Priority">
        <InputNumber
          min={1}
          max={5}
          value={formData.priority}
          onChange={value => {
            formData.priority = isNaN(value) ? 0 : value;
            setFormData({ ...formData });
          }}
        />
      </Form.Item>
      <Divider orientation="left"> Nodes </Divider>
      <DynamicForm
        formData={formData}
        emptyData={{ nodeName: '', algorithmName: '' }}
        onChange={setFormData}
        algorithms={props.algorithms}
        formItemLayout={formItemLayout}
        formItemLayoutWithOutLabel={{ wrapperCol: { offset: 4 } }}
      />
      <Divider orientation="left"> Flow Input </Divider>
      <Form.Item {...formItemLayout} label="Flow">
        <Input.TextArea value={stringify(formData.flowInput)} placeholder="Object" autosize={{ minRows: 2 }} disabled={true} />
      </Form.Item>
      <Divider orientation="left"> Web Hooks </Divider>
      <Form.Item {...formItemLayout} label="Progress">
        <Input placeholder="Progress URI" onChange={onChangeTarget(formData, 'webhooks', 'progress')} value={formData.webhooks.progress} />
      </Form.Item>
      <Form.Item {...formItemLayout} label="Result">
        <Input placeholder="Result URI" onChange={onChangeTarget(formData, 'webhooks', 'result')} value={formData.webhooks.result} />
      </Form.Item>
      <Divider orientation="left"> Triggers </Divider>
      <Form.Item {...formItemLayout} label="Cron">
        <Row>
          <Col span={2} style={{ textAlign: 'center' }}>
            <Switch
              onClick={() => {
                formData.triggers.cron.enabled = !formData.triggers.cron.enabled;
                setFormData({ ...formData });
              }}
              value={formData.triggers.cron.enabled}
              checked={formData.triggers.cron.enabled}
            />
          </Col>
          <Col span={12}>
            <Popover content={addCronContent(formData)} trigger="focus">
              <Input
                placeholder="Pattern"
                onChange={c => {
                  formData.triggers.cron.pattern = c.target.value;
                  setFormData({ ...formData });
                }}
                value={formData.triggers.cron.pattern}
              />
            </Popover>
          </Col>
        </Row>
      </Form.Item>
      <Form.Item {...formItemLayout} label="Pipelines">
        <Select
          mode="multiple"
          placeholder="Pipelines to activate upon result"
          defaultValue={formData.triggers.pipelines}
          onSelect={pipeline => {
            formData.triggers.pipelines.push(pipeline);
            setFormData({ ...formData });
          }}
          onDeselect={pipeline => {
            formData.triggers.pipelines = formData.triggers.pipelines.filter(p => p !== pipeline);
            setFormData({ ...formData });
          }}
        >
          {addPipelineOptions(props.pipelines)}
        </Select>
      </Form.Item>
      <Divider orientation="left"> Options </Divider>
      <Form.Item {...formItemLayout} label="Batch Tolerance">
        <Row gutter={15}>
          <Col span={20}>
            <Slider min={0} max={100} value={formData.options.batchTolerance} onChange={onChangeTarget(formData, 'options', 'batchTolerance')} />
          </Col>
          <Col span={4}>
            <InputNumber min={0} max={100} value={formData.options.batchTolerance} onChange={onChangeTarget(formData, 'options', 'batchTolerance')} />
          </Col>
        </Row>
      </Form.Item>
      <Form.Item {...formItemLayout} label="Concurrent Pipelines">
        <Row gutter={15}>
          <Col span={20}>
            <Slider min={0} max={10000} value={formData.options.concurrentPipelines} onChange={onChangeTarget(formData, 'options', 'concurrentPipelines')} />
          </Col>
          <Col span={4}>
            <InputNumber min={0} max={10000} value={formData.options.concurrentPipelines} onChange={onChangeTarget(formData, 'options', 'concurrentPipelines')} />
          </Col>
        </Row>
      </Form.Item>
      <Form.Item {...formItemLayout} label="TTL">
        <Row>
          <Col>
            <InputNumber min={1} value={formData.options.ttl} onChange={onChangeTarget(formData, 'options', 'ttl')} />
          </Col>
          <Col />
        </Row>
      </Form.Item>
      <Form.Item {...formItemLayout} label="Verbosity Level">
        <Select defaultValue="info" value={formData.options.progressVerbosityLevel} style={{ width: 120 }} onChange={onChangeTarget(formData, 'options', 'progressVerbosityLevel')}>
          <Select.Option value="info">Info</Select.Option>
          <Select.Option value="trace">Trace</Select.Option>
          <Select.Option value="debug">Debug</Select.Option>
          <Select.Option value="warn">Warn</Select.Option>
          <Select.Option value="error">Error</Select.Option>
          <Select.Option value="critical">Critical</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
}
