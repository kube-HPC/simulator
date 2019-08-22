import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import parseUnit from 'parse-unit';
import PropTypes from 'prop-types';

import { Input, Icon, Select, InputNumber, Upload, Divider, Form, Button, Radio } from 'antd';

import { applyAlgorithm } from 'actions/algorithm.action';
import { toUpperCaseFirstLetter } from 'utils/string';
import { DRAWER_SIZE } from 'const';
import { FlexBox, BottomContent } from 'components/common';
import { algorithmModalTemplate, algorithmModalSchema as schema } from 'config';

const Option = Select.Option;

const _parseUnit = obj => {
  const [val, unit] = parseUnit(obj);
  return { val, unit };
};

const insertAlgorithmOptions = options =>
  Object.entries(options).map(([key]) => (
    <Option key={key.toString()} value={key}>
      {toUpperCaseFirstLetter(key)}
    </Option>
  ));

const insertEnvOptions = options =>
  Object.entries(options).map(([key, value]) => (
    <Option key={key} value={key}>
      {value}
    </Option>
  ));

const availableOptions = options =>
  Object.entries(options)
    .filter(([, value]) => value)
    .map(([key]) => key);

const LABEL_SPAN = 5;

const formItemLayout = {
  labelCol: { span: LABEL_SPAN },
  wrapperCol: { span: 24 - LABEL_SPAN },
  labelAlign: 'left'
};

const FormItem = ({ children, ...props }) => (
  <Form.Item {...formItemLayout} {...props}>
    {children}
  </Form.Item>
);

FormItem.propTypes = {
  children: PropTypes.node.isRequired
};

const getMemValue = (mem, isReturnUnit) => {
  const { val, unit } = _parseUnit(mem);
  return isReturnUnit ? unit : val;
};

const insertRadioButtons = buildTypes =>
  Object.entries(buildTypes).map(([type]) => (
    <Radio.Button key={type} value={type}>
      {toUpperCaseFirstLetter(type)}
    </Radio.Button>
  ));

const FormNoMargin = styled(Form)`
  .ant-form-item {
    margin-bottom: 0px;
  }
`;

const AddAlgorithmForm = props => {
  const [algoData, setAlgoData] = useState(algorithmModalTemplate);
  const [buildType, setBuildType] = useState('code');
  const [file, setFile] = useState(undefined);

  const dispatch = useDispatch();

  const dragProps = {
    name: 'file',
    multiple: false,
    accept: '.zip,.tar.gz',
    customRequest: ({ file, onSuccess }) => {
      setTimeout(() => {
        setFile(file);
        onSuccess('OK');
      }, 0);
    }
  };

  const onSubmit = event => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('payload', JSON.stringify(algoData));
    dispatch(applyAlgorithm(formData));
    props.onSubmit();
  };

  const buildTypes = {
    code: (
      <>
        <FormItem label={schema.environment}>
          <Select value={algoData.env} onChange={env => setAlgoData({ ...algoData, env })}>
            {insertEnvOptions(schema.env)}
          </Select>
        </FormItem>
        <FormItem label={schema.entryPoint}>
          <Input
            defaultValue={algoData.entryPoint}
            value={algoData.entryPoint}
            onChange={e => setAlgoData({ ...algoData, entryPoint: e.target.value })}
            prefix={<Icon type="login" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Insert Entry Point"
          />
        </FormItem>
        <FormItem style={{ marginTop: '15px' }}>
          <Upload.Dragger {...dragProps}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">
              Click or drag algorithm source code to this area to upload
            </p>
            <p className="ant-upload-hint">Support for zip or tar.gz only</p>
          </Upload.Dragger>
        </FormItem>
      </>
    ),
    image: (
      <FormItem label={schema.image}>
        <Input
          value={algoData.algorithmImage}
          onChange={e => setAlgoData({ ...algoData, algorithmImage: e.target.value })}
          prefix={<Icon type="share-alt" style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder="Insert algorithm image"
        />
      </FormItem>
    ),
    git: (
      <>
        <FormItem label={schema.repository}>
          <Input placeholder="Enter Git Repository" />
        </FormItem>
        <FormItem label={schema.branch}>
          <Input placeholder="Enter Branch" />
        </FormItem>
        <FormItem label={schema.token}>
          <Input placeholder="Enter Token" />
        </FormItem>
      </>
    )
  };

  return (
    <>
      <FormNoMargin>
        <FormItem label={schema.name}>
          <Input
            className="input"
            value={algoData.name}
            onChange={e => setAlgoData({ ...algoData, name: e.target.value })}
            prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Insert algorithm name"
          />
        </FormItem>
        <FormItem label="Build Type">
          <Radio.Group
            defaultValue={buildType}
            buttonStyle="solid"
            onChange={v => setBuildType(v.target.value)}
          >
            {insertRadioButtons(buildTypes)}
          </Radio.Group>
        </FormItem>
        <Divider orientation="left">{schema.resources}</Divider>
        <FormItem label={schema.cpu}>
          <InputNumber
            min={0.1}
            value={algoData.cpu}
            defaultValue={algoData.cpu}
            onChange={v => setAlgoData({ ...algoData, cpu: +v })}
          />
        </FormItem>
        <FormItem label={schema.gpu}>
          <InputNumber
            min={0}
            value={algoData.gpu}
            defaultValue={algoData.gpu}
            onChange={v => setAlgoData({ ...algoData, gpu: +v })}
          />
        </FormItem>
        <FormItem label={schema.memory} labelAlign="left">
          <FlexBox type="flex" justify="start" gutter={4}>
            <FlexBox.Item>
              <InputNumber
                min={1}
                value={getMemValue(algoData.mem)}
                onChange={v => {
                  const { unit } = _parseUnit(algoData.mem);
                  setAlgoData({ ...algoData, mem: v + unit });
                }}
              />
            </FlexBox.Item>
            <FlexBox.Item>
              <Select
                value={getMemValue(algoData.mem, true)}
                style={{ width: '90px' }}
                onChange={v => {
                  const { val } = _parseUnit(algoData.mem);
                  setAlgoData({ ...algoData, mem: val + v });
                }}
              >
                {schema.memoryType.map(value => (
                  <Option key={value} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            </FlexBox.Item>
          </FlexBox>
        </FormItem>
        <Divider orientation="left">{schema.advanced}</Divider>
        <FormItem label={schema.minHotWorkers}>
          <InputNumber
            min={0}
            value={Math.floor(algoData.minHotWorkers)}
            onChange={minHotWorkers => setAlgoData({ ...algoData, minHotWorkers: minHotWorkers })}
          />
        </FormItem>
        <FormItem label={schema.options}>
          <Select
            className="input"
            defaultValue={availableOptions(algoData.options)}
            mode="tags"
            placeholder="Enable Options"
            onSelect={key =>
              setAlgoData({
                ...algoData,
                options: {
                  ...algoData.options,
                  [key]: !algoData.options[key]
                }
              })
            }
          >
            {insertAlgorithmOptions(algoData.options)}
          </Select>
        </FormItem>
        <Divider orientation="left">{toUpperCaseFirstLetter(buildType)}</Divider>
        {buildTypes[buildType]}
      </FormNoMargin>
      <BottomContent
        width={DRAWER_SIZE.ADD_ALGORITHM}
        extra={[
          <Button type="danger" key="clear" onClick={() => setAlgoData(algorithmModalTemplate)}>
            Clear
          </Button>
        ]}
      >
        <Button key="Submit" type="primary" onClick={onSubmit} htmlType="submit">
          Submit
        </Button>
      </BottomContent>
    </>
  );
};

export default React.memo(Form.create()(AddAlgorithmForm));
