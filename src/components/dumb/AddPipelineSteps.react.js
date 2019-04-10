import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Steps,
  Button,
  message,
  Form,
  Input,
  InputNumber,
  Divider,
  Row,
  Col,
  Select,
  Switch,
  Popover,
  Slider
} from 'antd';

import DynamicForm from 'components/containers/DynamicForm.react';
import { stringify } from 'utils.js';

import cronstrue from 'cronstrue';
import cronParser from 'cron-parser';

const Step = Steps.Step;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};

const addPipelineOptions = pipelines =>
  pipelines.map((pipeline, i) => (
    <Select.Option key={i} value={pipeline}>
      {pipeline}
    </Select.Option>
  ));

export default function AddPipelineSteps(props) {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState(props.formData);

  const onChangeTarget = (formData, t1, t2 = undefined) => c => {
    const value = c && c.target ? c.target.value : c;
    const targetKey = t2 ? { ...formData[t1], [t2]: value } : value;
    setFormData({ ...formData, [t1]: targetKey });
  };

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

  const PipelineDescription = (
    <>
      <Form.Item {...formItemLayout} label="Name" required={true}>
        <Input
          placeholder="Unique Identifier"
          value={formData.name}
          onChange={onChangeTarget(formData, 'name')}
        />
      </Form.Item>
      <Form.Item {...formItemLayout} label="Description">
        <Input.TextArea
          value={formData.description}
          placeholder="Pipeline Description"
          onChange={onChangeTarget(formData, 'description')}
        />
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
    </>
  );

  const Nodes = (
    <DynamicForm
      formData={formData}
      emptyData={{ nodeName: '', algorithmName: '' }}
      onChange={setFormData}
      algorithms={props.algorithms}
      formItemLayout={formItemLayout}
      formItemLayoutWithOutLabel={{ wrapperCol: { offset: 4 } }}
    />
  );

  const Hooks = (
    <>
      <Form.Item {...formItemLayout} label="Flow">
        <Input.TextArea
          value={stringify(formData.flowInput)}
          placeholder="Object"
          autosize={{ minRows: 2 }}
          disabled={true}
        />
      </Form.Item>
      <Form.Item {...formItemLayout} label="Progress Webhook">
        <Input
          placeholder="Progress URI"
          onChange={onChangeTarget(formData, 'webhooks', 'progress')}
          value={formData.webhooks.progress}
        />
      </Form.Item>
      <Form.Item {...formItemLayout} label="Result Webhook">
        <Input
          placeholder="Result URI"
          onChange={onChangeTarget(formData, 'webhooks', 'result')}
          value={formData.webhooks.result}
        />
      </Form.Item>
    </>
  );

  const Triggers = (
    <>
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
    </>
  );

  const Options = (
    <div>
      <Form.Item {...formItemLayout} label="Batch Tolerance">
        <Row gutter={15}>
          <Col span={20}>
            <Slider
              min={0}
              max={100}
              value={formData.options.batchTolerance}
              onChange={onChangeTarget(formData, 'options', 'batchTolerance')}
            />
          </Col>
          <Col span={4}>
            <InputNumber
              min={0}
              max={100}
              value={formData.options.batchTolerance}
              onChange={onChangeTarget(formData, 'options', 'batchTolerance')}
            />
          </Col>
        </Row>
      </Form.Item>
      <Form.Item {...formItemLayout} label="Concurrent Pipelines">
        <Row gutter={15}>
          <Col span={20}>
            <Slider
              min={0}
              max={10000}
              value={formData.options.concurrentPipelines}
              onChange={onChangeTarget(formData, 'options', 'concurrentPipelines')}
            />
          </Col>
          <Col span={4}>
            <InputNumber
              min={0}
              max={10000}
              value={formData.options.concurrentPipelines}
              onChange={onChangeTarget(formData, 'options', 'concurrentPipelines')}
            />
          </Col>
        </Row>
      </Form.Item>
      <Form.Item {...formItemLayout} label="TTL">
        <Row>
          <Col>
            <InputNumber
              min={1}
              value={formData.options.ttl}
              onChange={onChangeTarget(formData, 'options', 'ttl')}
            />
          </Col>
          <Col />
        </Row>
      </Form.Item>
      <Form.Item {...formItemLayout} label="Verbosity Level">
        <Select
          defaultValue="info"
          value={formData.options.progressVerbosityLevel}
          style={{ width: 120 }}
          onChange={onChangeTarget(formData, 'options', 'progressVerbosityLevel')}
        >
          <Select.Option value="info">Info</Select.Option>
          <Select.Option value="trace">Trace</Select.Option>
          <Select.Option value="debug">Debug</Select.Option>
          <Select.Option value="warn">Warn</Select.Option>
          <Select.Option value="error">Error</Select.Option>
          <Select.Option value="critical">Critical</Select.Option>
        </Select>
      </Form.Item>
    </div>
  );

  const steps = [
    {
      title: 'Initial',
      content: PipelineDescription
    },
    {
      title: 'Nodes',
      content: Nodes
    },
    {
      title: 'Side Effects',
      content: Hooks
    },
    {
      title: 'Triggers',
      content: Triggers
    },
    {
      title: 'Options',
      content: Hooks
    }
  ];

  return (
    <>
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <Form>{steps[current].content}</Form>
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => setCurrent(current + 1)}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ marginLeft: 8 }} onClick={() => setCurrent(current - 1)}>
            Previous
          </Button>
        )}
      </div>
    </>
  );
}

AddPipelineSteps.propTypes = {
  formData: PropTypes.object.isRequired
};
