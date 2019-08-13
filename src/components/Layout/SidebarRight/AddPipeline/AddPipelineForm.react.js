import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Select,
  Switch,
  Popover,
  Slider,
  Card,
  notification,
  Icon,
  Steps,
  Divider
} from 'antd';
import cronstrue from 'cronstrue';
import cronParser from 'cron-parser';

import DynamicForm from 'components/Layout/SidebarRight/AddPipeline/AddPipelineFormDynamic.react';
import { stringify, toUpperCaseFirstLetter } from 'utils/string';
import JsonEditor from 'components/common/json/JsonEditor.react';
import BottomContent from 'components/common/BottomContent.react';
import JsonView from 'components/common/json/JsonView.react';
import addPipelineTemplate from 'config/template/addPipeline.template';

const span = 6;
const formItemLayout = {
  labelCol: { span },
  wrapperCol: { span: 24 - span }
};

const formItemLayoutWithOutLabel = {
  wrapperCol: { offset: formItemLayout.labelCol.span }
};

const addPipelineOptions = pipelines =>
  pipelines.map((pipeline, i) => (
    <Select.Option key={i} value={pipeline}>
      {pipeline}
    </Select.Option>
  ));

const verbosityLevels = ['info', 'trace', 'debug', 'warn', 'error', 'critical'];
const stepsTitles = ['Initial', 'Nodes', 'Webhooks', 'Triggers', 'Options'];

const URL_REGEX = /^(f|ht)tps?:\/\//i;

const SelectBefore = ({ value, setValue }) => {
  return (
    <Select value={value} onSelect={setValue} style={{ width: 90 }}>
      <Select.Option value="http://">http://</Select.Option>
      <Select.Option value="ftp://">ftp://</Select.Option>
      <Select.Option value="https://">https://</Select.Option>
      <Select.Option value="ftps://">ftps://</Select.Option>
    </Select>
  );
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
  return isLegalPattern
    ? `${current}, Next Interval: ${next}`
    : 'Invalid Pattern';
};

export default function AddPipelineForm(props) {
  const [formData, setFormData] = useState(addPipelineTemplate);
  const [flowInputString, setFlowInputString] = useState(
    stringify(formData.flowInput)
  );

  const [step, setStep] = useState(0);
  const [selectedWebhook, setSelectedWebhook] = useState({
    progress: 'http://',
    result: 'http://'
  });

  const onChangeTarget = (formData, t1, t2 = undefined) => c => {
    const value = c && c.target ? c.target.value : c;
    const targetKey = t2 ? { ...formData[t1], [t2]: value } : value;
    setFormData({ ...formData, [t1]: targetKey });
  };

  const initialValidName = formData.name !== '';

  const Initial = (
    <div>
      <Form.Item
        {...formItemLayout}
        label="Name"
        required={true}
        validateStatus={initialValidName ? 'success' : 'error'}
        help={!initialValidName && 'Name cannot be empty'}
      >
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
      <Form.Item {...formItemLayout} label="Flow Input">
        <Card>
          <JsonEditor
            width={'100%'}
            height={'30vh'}
            value={flowInputString}
            onChange={setFlowInputString}
            snippetEnabled={false}
            showGutter={true}
          />
        </Card>
      </Form.Item>
    </div>
  );

  const Nodes = (
    <DynamicForm
      formData={formData}
      emptyData={{ nodeName: '', algorithmName: '', input: [] }}
      onChange={setFormData}
      algorithms={props.algorithms}
      formItemLayout={formItemLayout}
      formItemLayoutWithOutLabel={formItemLayoutWithOutLabel}
    />
  );

  const webhooks = formData.webhooks;

  if (!webhooks) formData.webhooks = { progress: '', result: '' };
  else {
    webhooks.progress = webhooks.progress
      ? webhooks.progress.replace(URL_REGEX, '')
      : '';
    webhooks.result = webhooks.result
      ? webhooks.result.replace(URL_REGEX, '')
      : '';
  }

  const Webhooks = (
    <>
      <Form.Item {...formItemLayout} label="Progress">
        <Input
          addonBefore={
            <SelectBefore
              value={selectedWebhook.progress}
              setValue={progress =>
                setSelectedWebhook(prev => ({ ...prev, progress }))
              }
            />
          }
          placeholder="Progress Webhook URI"
          onChange={e => {
            formData.webhooks.progress = `${selectedWebhook.progress}${
              e.target.value
            }`;
            setFormData({ ...formData });
          }}
          value={formData.webhooks.progress.replace(URL_REGEX, '')}
        />
      </Form.Item>
      <Form.Item {...formItemLayout} label="Result">
        <Input
          addonBefore={
            <SelectBefore
              value={selectedWebhook.result}
              setValue={result =>
                setSelectedWebhook(prev => ({ ...prev, result }))
              }
            />
          }
          placeholder="Result Webhook URI"
          onChange={e => {
            formData.webhooks.result = `${selectedWebhook.result}${
              e.target.value
            }`;
            setFormData({ ...formData });
          }}
          value={formData.webhooks.result.replace(URL_REGEX, '')}
        />
      </Form.Item>
    </>
  );

  const triggersId = 'triggers-id';
  const Triggers = (
    <div id={triggersId}>
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
            formData.triggers.pipelines = formData.triggers.pipelines.filter(
              p => p !== pipeline
            );
            setFormData({ ...formData });
          }}
          getPopupContainer={() => document.getElementById(triggersId)}
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
              onChange={e =>
                !isNaN(e) &&
                onChangeTarget(formData, 'options', 'batchTolerance')(e)
              }
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
              onChange={onChangeTarget(
                formData,
                'options',
                'concurrentPipelines'
              )}
            />
          </Col>
          <Col span={6}>
            <InputNumber
              min={0}
              max={10000}
              value={formData.options.concurrentPipelines}
              onChange={e =>
                !isNaN(e) &&
                onChangeTarget(formData, 'options', 'concurrentPipelines')(e)
              }
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
              onChange={e =>
                !isNaN(e) && onChangeTarget(formData, 'options', 'ttl')(e)
              }
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
          onChange={onChangeTarget(
            formData,
            'options',
            'progressVerbosityLevel'
          )}
        >
          {verbosityLevels.map(value => (
            <Select.Option key={value} value={value}>
              {toUpperCaseFirstLetter(value)}
            </Select.Option>
          ))}
        </Select>
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

  const steps = [Initial, Nodes, Webhooks, Triggers, Options];
  const isLastStep = step === steps.length - 1;
  const isFirstStep = step === 0;

  const [editorIsVisible, setEditorVisible] = useState(false);
  const [editorValue, setEditorValue] = useState(
    stringify(addPipelineTemplate)
  );
  return (
    <div>
      {editorIsVisible && (
        <Card style={{ overflow: 'scroll' }}>
          <JsonEditor
            width={'100%'}
            height={'60vh'}
            isControlled
            value={editorValue}
            onChange={setEditorValue}
          />
        </Card>
      )}
      {!editorIsVisible && (
        <>
          <Row>
            <Steps size="small" current={step}>
              {stepsTitles.map(title => (
                <Steps.Step key={title} title={title} />
              ))}
            </Steps>
            <Divider />
          </Row>
          <Row type="flex" gutter={10}>
            <Col span={8}>
              <JsonView jsonObject={formData} />
            </Col>
            <Col span={16}>
              <Card>
                <Form>{steps[step]}</Form>
              </Card>
            </Col>
          </Row>
        </>
      )}
      <BottomContent
        extra={[
          <Button
            key="editor"
            type="primary"
            onClick={() => {
              setEditorVisible(prev => !prev);
            }}
          >
            {!editorIsVisible ? 'Edit as JSON' : 'Edit with a Wizard'}
          </Button>,
          <Popover
            key="clear"
            content={<div>Resets {editorIsVisible ? 'JSON' : 'Wizard'}</div>}
          >
            <Button
              type="danger"
              onClick={() => {
                if (editorIsVisible)
                  setEditorValue(stringify(addPipelineTemplate));
                else {
                  setFormData({
                    ...addPipelineTemplate,
                    nodes: [
                      {
                        nodeName: '',
                        algorithmName: '',
                        input: []
                      }
                    ]
                  });
                  setStep(0);
                }
              }}
            >
              Reset
            </Button>
          </Popover>
        ]}
      >
        {!editorIsVisible && (
          <Button
            key="back"
            disabled={isFirstStep}
            type="default"
            onClick={() => {
              setFormData(formData);
              setStep(step - 1);
            }}
          >
            <Icon type="left" />
            Back
          </Button>
        )}
        <Button
          key="submit"
          type={isLastStep ? 'primary' : 'default'}
          onClick={() => {
            try {
              const needToSubmit = isLastStep || editorIsVisible;
              if (!editorIsVisible) {
                setFormData({
                  ...formData,
                  flowInput: JSON.parse(flowInputString)
                });
              }

              if (needToSubmit) {
                const { progress, result } = formData.webhooks;
                if (progress) formData.webhooks.progress = `${progress}`;
                else delete formData.webhooks.progress;

                if (result) formData.webhooks.result = `${result}`;
                else delete formData.webhooks.result;

                !formData.webhooks.progress &&
                  !formData.webhooks.result &&
                  delete formData.webhooks;
              }

              needToSubmit
                ? props.onSubmit(
                    editorIsVisible ? JSON.parse(editorValue) : formData
                  )
                : setStep(step + 1);
            } catch (e) {
              notification.config({
                placement: 'bottomRight'
              });
              notification.open({
                message: 'Flow Input Error',
                description: e.message,
                icon: <Icon type="warning" style={{ color: 'red' }} />
              });
            }
          }}
        >
          {isLastStep || editorIsVisible ? (
            'Submit'
          ) : (
            <>
              Next <Icon type="right" />
            </>
          )}
        </Button>
      </BottomContent>
    </div>
  );
}

AddPipelineForm.propTypes = {
  formData: PropTypes.object
};
