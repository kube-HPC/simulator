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

const AddAlgorithmForm = ({ form }) => {
  const [buildType, setBuildType] = useState('code');

  const { getFieldDecorator, validateFields } = form;

  const buildTypes = {
    code: <FormItem label={schema.environment}></FormItem>,
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
    <>
      <FormNoMargin onSubmit={onSubmit}>
        <FormItem label={schema.NAME.label}>
          {getFieldDecorator(schema.NAME.field, {
            rules: [{ required: true }]
          })(<Input placeholder="Insert algorithm name" />)}
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
        <Divider orientation="left">{schema.RESOURCES}</Divider>
        <FormItem label={schema.CPU.label}>
          {getFieldDecorator(schema.CPU.field)(
            <InputNumber min={0.1} defaultValue={template.cpu} />
          )}
        </FormItem>
        <FormItem label={schema.GPU.label}>
          {getFieldDecorator(schema.GPU.field)(<InputNumber min={0} defaultValue={template.gpu} />)}
        </FormItem>

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
    </>
  );
};

export default React.memo(
  Form.create({
    validateMessages: {
      name: 'Hello'
    }
  })(AddAlgorithmForm)
);
