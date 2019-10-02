import React from 'react';
import PropTypes from 'prop-types';
import { FormItem } from '../FormElements.react';
import { Input, Upload, Icon } from 'antd';
import schema from 'config/schema/addAlgorithm.schema';
import SelectEnvOptions from '../SelectEnvOptions.react';

// #region helpers
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
// #endregion

const {
  CODE: { ENVIRONMENT, ENTRY_POINT, VERSION }
} = schema.BUILD_TYPES;

const CodeBuild = ({ required, getFieldDecorator, fileList, setFileList }) => (
  <>
    <FormItem label={ENVIRONMENT.label}>
      {getFieldDecorator(ENVIRONMENT.field, {
        rules: [{ required, message: ENVIRONMENT.message }]
      })(<SelectEnvOptions placeholder={ENVIRONMENT.placeholder} />)}
    </FormItem>
    <FormItem label={ENTRY_POINT.label}>
      {getFieldDecorator(ENTRY_POINT.field, {
        rules: [{ required, message: ENTRY_POINT.message }]
      })(<Input placeholder={ENTRY_POINT.placeholder} />)}
    </FormItem>
    <FormItem label={VERSION.label}>
      {getFieldDecorator(VERSION.field)(<Input placeholder={VERSION.placeholder} />)}
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
  required: PropTypes.bool.isRequired,
  setFileList: PropTypes.func.isRequired,
  fileList: PropTypes.array.isRequired
};

export default CodeBuild;
