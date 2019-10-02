import React from 'react';
import PropTypes from 'prop-types';
import { FormItem } from '../FormElements.react';
import { Select, Input, Upload, Icon } from 'antd';
import { toUpperCaseFirstLetter } from 'utils';
import addAlgorithmSchema from 'config/schema/addAlgorithm.schema';

const { CODE } = addAlgorithmSchema.BUILD_TYPES;

const insertEnvOptions = options =>
  Object.entries(options).map(([key, value]) => (
    <Select.Option key={key} value={key}>
      {toUpperCaseFirstLetter(value)}
    </Select.Option>
  ));

const setDraggerProps = ({ fileList, setFileList }) => ({
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
});

const draggerMarginTop = { marginTop: 15 };

// https://codesandbox.io/s/g653p
const DefaultDrop = () => (
  <>
    <p className="ant-upload-drag-icon">
      <Icon type="inbox" />
    </p>
    <p className="ant-upload-text">Click or drag algorithm source code to this area to upload</p>
    <p className="ant-upload-hint">Support for zip or tar.gz only</p>
  </>
);

const CodeBuild = ({ buildType, getFieldDecorator, fileList, setFileList }) => (
  <>
    <FormItem label={CODE.ENVIRONMENT.label}>
      {getFieldDecorator(CODE.ENVIRONMENT.field, {
        rules: [{ required: buildType === CODE.field, message: 'Environment required' }]
      })(
        <Select placeholder={CODE.ENVIRONMENT.placeholder}>
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
    <FormItem wrapperCol={null} style={draggerMarginTop}>
      <Upload.Dragger {...setDraggerProps({ fileList, setFileList })}>
        <DefaultDrop />
      </Upload.Dragger>
    </FormItem>
  </>
);

CodeBuild.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  buildType: PropTypes.string.isRequired,
  setFileList: PropTypes.func.isRequired,
  fileList: PropTypes.array.isRequired
};

export default CodeBuild;
