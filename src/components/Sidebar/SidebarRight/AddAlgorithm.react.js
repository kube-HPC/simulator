import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import parseUnit from 'parse-unit';
import PropTypes from 'prop-types';

import { Input, Icon, Select, InputNumber, Upload, Divider, Form, Button, Radio } from 'antd';

import { DRAWER_SIZE } from 'const';
import { BottomContent } from 'components/common';
import { algorithmModalTemplate as template, algorithmModalSchema as schema } from 'config';
import { toUpperCaseFirstLetter } from 'utils';
import { applyAlgorithm } from 'actions';

const Option = Select.Option;

const insertAlgorithmOptions = options =>
  options.map((option, key) => (
    <Option key={key} value={option}>
      {toUpperCaseFirstLetter(option)}
    </Option>
  ));

const insertEnvOptions = options =>
  Object.entries(options).map(([key, value]) => (
    <Option key={key} value={key}>
      {value}
    </Option>
  ));

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

const insertRadioButtons = buildTypes =>
  Object.keys(buildTypes).map(key => (
    <Radio.Button key={key} value={key}>
      {toUpperCaseFirstLetter(key)}
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

const getBuildTypes = ({ buildType, getFieldDecorator, fileList, setFileList }) => {
  const draggerProps = {
    name: 'file',
    multiple: false,
    accept: '.zip,.tar.gz',
    customRequest: ({ file, onSuccess }) => {
      setTimeout(() => {
        setFileList([file]);
        onSuccess('OK');
      }, 0);
    },
    fileList,
    onRemove: () => setFileList([])
  };

  const { CODE, IMAGE } = schema.BUILD_TYPES;

  return {
    [CODE.label]: (
      <>
        <FormItem label={CODE.ENVIRONMENT.label}>
          {getFieldDecorator(CODE.ENVIRONMENT.field, {
            rules: [{ required: buildType === CODE.label, message: 'Environment required' }]
          })(
            <Select placeholder="Pick Environment">
              {insertEnvOptions(CODE.ENVIRONMENT.types)}
            </Select>
          )}
        </FormItem>
        <FormItem label={CODE.ENTRY_POINT.label}>
          {getFieldDecorator(CODE.ENTRY_POINT.field)(<Input placeholder="Insert Entry Point" />)}
        </FormItem>
        <FormItem label={CODE.VERSION.label}>
          {getFieldDecorator(CODE.VERSION.field)(<Input placeholder="Insert Version" />)}
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
    [IMAGE.label]: (
      <FormItem label={IMAGE.ALGORITHM_IMAGE.label}>
        {getFieldDecorator(IMAGE.ALGORITHM_IMAGE.field, {
          rules: [{ required: buildType === IMAGE.label, message: 'Image URL required' }]
        })(<Input placeholder="Insert algorithm image" />)}
      </FormItem>
    )
    // TODO: Next Feature
    // ,git: (
    //   <>
    //     <FormItem label={GIT.REPOSITORY.label}>
    //       {getFieldDecorator(GIT.REPOSITORY.field)(<Input placeholder="Enter Git Repository" />)}
    //     </FormItem>
    //     <FormItem label={GIT.BRANCH.label}>
    //       {getFieldDecorator(GIT.BRANCH.field, {
    //         initialValue: 'master'
    //       })(<Input placeholder="Enter Branch" />)}
    //     </FormItem>
    //     <FormItem label={GIT.TOKEN.label}>
    //       {getFieldDecorator(GIT.TOKEN.field)(<Input.Password placeholder="Enter Token" />)}
    //     </FormItem>
    //   </>
    // )
  };
};

const getMemoryUnits = str => {
  const [value, unit] = parseUnit(str);
  return { value, unit };
};

const AddAlgorithm = ({ form, onSubmit }) => {
  const [buildType, setBuildType] = useState(schema.BUILD_TYPES.CODE.label);
  const [fileList, setFileList] = useState(undefined);
  const [mem, setMem] = useState(getMemoryUnits(template.mem));

  const { getFieldDecorator, validateFields } = form;
  const buildTypes = getBuildTypes({ buildType, getFieldDecorator, fileList, setFileList });

  const dispatch = useDispatch();
  const onSubmitClick = e => {
    e.preventDefault();
    validateFields((err, values) => {
      console.log('err', err);
      if (!err) {
        const formData = new FormData();
        const options = values.options.reduce((acc, option) => ({ ...acc, [option]: true }), {});
        const payload = { ...values, options, mem: `${mem.value}${mem.unit}` };
        console.log('Submitted Values: ', { payload, file: fileList });

        const [file] = fileList;

        formData.append('file', file);
        formData.append('payload', JSON.stringify(payload));
        dispatch(applyAlgorithm(formData));
        onSubmit();
      }
    });
  };

  return (
    <FormNoMargin onSubmit={onSubmitClick}>
      <FormItem label={schema.NAME.label}>
        {getFieldDecorator(schema.NAME.field, {
          rules: [{ required: true, message: 'Algorithm Name is Required' }]
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
        <Input.Group compact>
          <InputNumber
            min={1}
            defaultValue={getMemoryUnits(template.mem).value}
            onChange={value => setMem(prev => ({ ...prev, value }))}
          />
          <Select
            style={{ width: '90px' }}
            defaultValue={getMemoryUnits(template.mem).unit}
            onSelect={unit => setMem(prev => ({ ...prev, unit }))}
          >
            {schema.MEMORY.memoryTypes.map(value => (
              <Option key={value} value={value}>
                {value}
              </Option>
            ))}
          </Select>
        </Input.Group>
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
            {insertAlgorithmOptions(schema.OPTIONS.types)}
          </Select>
        )}
      </FormItem>
      <FormDivider>{toUpperCaseFirstLetter(buildType)}</FormDivider>
      {buildTypes[buildType]}

      <BottomContent width={DRAWER_SIZE.ADD_ALGORITHM}>
        <Form.Item>
          <Button key="Submit" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </BottomContent>
    </FormNoMargin>
  );
};

AddAlgorithm.propTypes = {
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default React.memo(Form.create({})(AddAlgorithm));
