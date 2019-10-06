import React from 'react';
import PropTypes from 'prop-types';

import { FormItem } from '../FormElements.react';
import { Input, Upload, Icon, Alert, Typography } from 'antd';
import schema from 'config/schema/addAlgorithm.schema';
import SelectEnvOptions from '../SelectEnvOptions.react';
import { FlexBox } from 'components/common';
import { COLOR } from 'styles';

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

const marginTop = { marginTop: 15 };
const inboxStyle = { fontSize: 50, color: COLOR.blueLight };

const { Text } = Typography;
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
    <FormItem wrapperCol={null} style={marginTop}>
      <Upload.Dragger {...setDraggerProps({ fileList, setFileList })}>
        <Icon type="inbox" style={inboxStyle} />
        <br />
        <Text>Click or drag Algorithm Source code to this area to upload</Text>
        <br />
        <Text type="secondary">Support for zip or tar.gz only</Text>
        <FlexBox justify="center" style={marginTop}>
          <FlexBox.Item>
            <Alert
              message={`File ${fileList.length ? 'Uploaded' : 'Required'}`}
              type={fileList.length ? 'info' : 'warning'}
              showIcon
            />
          </FlexBox.Item>
        </FlexBox>
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
