import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input, InputNumber, Row, Col, Select, Switch, Popover, Slider } from 'antd';
import cronstrue from 'cronstrue';
import cronParser from 'cron-parser';

import DynamicForm from 'components/dumb/DynamicForm.react';
import { stringify } from 'utils.js';

const span = 6;
const formItemLayout = {
  labelCol: { span },
  wrapperCol: { span: 24 - span }
};

const formItemLayoutWithOutLabel = { wrapperCol: { offset: formItemLayout.labelCol.span } };

const addPipelineOptions = pipelines =>
  pipelines.map((pipeline, i) => (
    <Select.Option key={i} value={pipeline}>
      {pipeline}
    </Select.Option>
  ));

const verbosityLevels = ['info', 'trace', 'debug', 'warn', 'error', 'critical'];

export default function AddPipelineForm(props) {
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

  const Initial = (
    <div>
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
    </div>
  );

  const Nodes = (
    <DynamicForm
      formData={formData}
      emptyData={{ nodeName: '', algorithmName: '' }}
      onChange={setFormData}
      algorithms={props.algorithms}
      formItemLayout={formItemLayout}
      formItemLayoutWithOutLabel={formItemLayoutWithOutLabel}
    />
  );

  const Hooks = (
    <div>
      <Form.Item {...formItemLayout} label="Progress">
        <Input
          placeholder="Progress Webhook URI"
          onChange={onChangeTarget(formData, 'webhooks', 'progress')}
          value={formData.webhooks.progress}
        />
      </Form.Item>
      <Form.Item {...formItemLayout} label="Result">
        <Input
          placeholder="Result Webhook URI"
          onChange={onChangeTarget(formData, 'webhooks', 'result')}
          value={formData.webhooks.result}
        />
      </Form.Item>
      <Form.Item {...formItemLayout} label="Flow">
        <Input.TextArea
          value={stringify(formData.flowInput)}
          placeholder="Object"
          autosize={{ minRows: 3 }}
          disabled={true}
        />
      </Form.Item>
    </div>
  );

  const Triggers = (
    <div>
      <Form.Item {...formItemLayout} label="Cron">
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
      </Form.Item>
      <Form.Item {...formItemLayout} label="Cron Enabled">
        <Switch
          onClick={() => {
            formData.triggers.cron.enabled = !formData.triggers.cron.enabled;
            setFormData({ ...formData });
          }}
          value={formData.triggers.cron.enabled}
          checked={formData.triggers.cron.enabled}
        />
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
    </div>
  );

  const Options = (
    <div>
      <Form.Item {...formItemLayout} label="Batch Tolerance">
        <Row type="flex" gutter={10}>
          <Col span={18}>
            <Slider
              min={0}
              max={100}
              value={formData.options.batchTolerance}
              onChange={onChangeTarget(formData, 'options', 'batchTolerance')}
            />
          </Col>
          <Col span={6}>
            <InputNumber
              min={0}
              max={100}
              value={formData.options.batchTolerance}
              onChange={onChangeTarget(formData, 'options', 'batchTolerance')}
            />
          </Col>
        </Row>
      </Form.Item>
      <Form.Item {...formItemLayout} label="Concurrent">
        <Row type="flex" gutter={10}>
          <Col span={18}>
            <Slider
              min={0}
              max={10000}
              value={formData.options.concurrentPipelines}
              onChange={onChangeTarget(formData, 'options', 'concurrentPipelines')}
            />
          </Col>
          <Col span={6}>
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
          {verbosityLevels.map(value => (
            <Select.Option key={value} value={value}>
              {value.toUpperCaseFirstLetter()}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  );

  const steps = [Initial, Nodes, Hooks, Triggers, Options];
  const isLastStep = props.step === steps.length - 1;
  const isFirstStep = props.step === 0;

  return (
    <Form>
      {steps[props.step]}
      <Form.Item {...formItemLayoutWithOutLabel}>
        <Row gutter={10} type="flex" justify="space-around">
          <Col span={12}>
            <Button
              disabled={isFirstStep}
              type="default"
              icon="left"
              onClick={() => {
                props.onChange(formData);
                props.onStep(props.step - 1);
              }}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={12}>
            <Button
              type="primary"
              icon={!isLastStep ? 'right' : ''}
              onClick={() => {
                props.onChange(formData);
                if (!isLastStep) {
                  props.onStep(props.step + 1);
                } else {
                  props.onSubmit(formData);
                }
              }}
              style={{ width: '100%' }}
            >
              {isLastStep && 'Submit'}
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
}

AddPipelineForm.propTypes = {
  formData: PropTypes.object.isRequired
};
