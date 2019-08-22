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
import { algorithmModalTemplate as template, algorithmModalSchema as schema } from 'config';

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

FormItem.propTypes = Form.Item.propTypes;

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

const FormDivider = ({ children, ...props }) => (
  <Divider orientation="left" {...props}>
    {children}
  </Divider>
);

FormDivider.propTypes = Divider.propTypes;

const AddAlgorithmForm = ({ form }) => {
  const [buildType, setBuildType] = useState('code');
  const [file, setFile] = useState(undefined);

  const { getFieldDecorator, validateFields } = form;

  const draggerProps = {
    name: 'file',
    multiple: false,
    accept: '.zip,.tar.gz',
    customRequest: ({ file, onSuccess }) => {
      setFile(file);
      onSuccess('OK');
    }
  };

  const buildTypes = {
    code: (
      <>
        <FormItem label={schema.BUILD_TYPES.CODE.ENVIRONMENT.label}>
          {getFieldDecorator(schema.BUILD_TYPES.CODE.ENVIRONMENT.field, {
            initialValue: template.env
          })(<Select>{insertEnvOptions(schema.BUILD_TYPES.CODE.ENVIRONMENT.types)}</Select>)}
        </FormItem>
        <FormItem label={schema.BUILD_TYPES.CODE.ENTRY_POINT.label}>
          <Input placeholder="Insert Entry Point" />
        </FormItem>
        <FormItem wrapperCol={null} style={{ marginTop: '15px' }}>
          <Upload.Dragger {...draggerProps}>
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
    image: <FormItem label={schema.image}></FormItem>,
    git: <FormItem label={schema.image}></FormItem>
  };

  const onSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      console.log(err);
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  return (
    <FormNoMargin onSubmit={onSubmit}>
      <FormItem label={schema.NAME.label}>
        {getFieldDecorator(schema.NAME.field, {
          rules: [{ required: true }]
        })(<Input placeholder="Insert Algorithm Name" />)}
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
      <FormDivider>{schema.DIVIDER.RESOURCES}</FormDivider>
      <FormItem label={schema.CPU.label}>
        {getFieldDecorator(schema.CPU.field, {
          initialValue: template.cpu
        })(<InputNumber min={0.1} />)}
      </FormItem>
      <FormItem label={schema.GPU.label}>
        {getFieldDecorator(schema.GPU.field, {
          initialValue: template.gpu
        })(<InputNumber min={0} />)}
      </FormItem>
      <FormItem label={schema.MEMORY.label} labelAlign="left">
        <FlexBox justify="start">
          <FlexBox.Item>
            {getFieldDecorator(schema.MEMORY.field, {
              initialValue: template.mem
            })(<InputNumber min={1} />)}
          </FlexBox.Item>
          <FlexBox.Item>
            <Select style={{ width: '90px' }}>
              {schema.MEMORY.memoryTypes.map(value => (
                <Option key={value} value={value}>
                  {value}
                </Option>
              ))}
            </Select>
          </FlexBox.Item>
        </FlexBox>
      </FormItem>
      <FormDivider>{schema.DIVIDER.ADVANCED}</FormDivider>
      <FormItem label={schema.WORKERS.label}>
        {getFieldDecorator(schema.WORKERS.field, {
          initialValue: template.minHotWorkers
        })(<InputNumber min={0} />)}
      </FormItem>
      <FormItem label={schema.OPTIONS.label}>
        {getFieldDecorator(schema.OPTIONS.field, {
          initialValue: Object.entries(template.options)
            .filter(([, isAvailable]) => isAvailable)
            .map(([key]) => key)
        })(
          <Select mode="tags" placeholder="Enable Options">
            {insertAlgorithmOptions(template.options)}
          </Select>
        )}
      </FormItem>
      <FormDivider>{toUpperCaseFirstLetter(buildType)}</FormDivider>
      {buildTypes[buildType]}

      <BottomContent
        width={DRAWER_SIZE.ADD_ALGORITHM}
        extra={[
          <Button type="danger" key="clear">
            Clear
          </Button>
        ]}
      >
        <Form.Item>
          <Button key="Submit" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </BottomContent>
    </FormNoMargin>
  );
};

export default React.memo(
  Form.create({
    validateMessages: {
      name: 'Hello'
    }
  })(AddAlgorithmForm)
);
