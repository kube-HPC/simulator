// #region imports
import React from 'react';
import PropTypes from 'prop-types';

import { Input, Upload, Icon, Alert, Typography } from 'antd';
import schema from 'config/schema/addAlgorithm.schema';
import SelectEnvOptions from '../SelectEnvOptions.react';
import { FlexBox, Form } from 'components/common';
import { COLOR } from 'styles';
import { notification } from 'utils';
// #endregion

// #region helpers
const toStatusMessage = fileName => ({
  done: `${fileName} uploaded successfully`,
  error: `${fileName} upload failed`,
  removed: `File ${fileName} removed`
});

const STATUS_TYPE = {
  done: notification.TYPES.SUCCESS,
  error: notification.TYPES.ERROR,
  removed: notification.TYPES.INFO
};

const isNotify = status => status === 'done' || status === 'error' || status === 'removed';

const setDraggerProps = ({ fileList, setFileList }) => ({
  name: 'file',
  multiple: false,
  accept: '.zip,.tar.gz',
  customRequest: ({ file, onSuccess }) => {
    setTimeout(() => {
      setFileList([file]);
      onSuccess(file.name);
    }, 0);
  },
  fileList,
  onChange(info) {
    const { status, response: fileName } = info.file;
    if (isNotify(status)) {
      notification({ message: toStatusMessage(fileName)[status], type: STATUS_TYPE[status] });
    }

    if (status === 'removed') {
      setFileList([]);
    }
  }
});

const marginTop = { marginTop: 15 };
const inboxStyle = { fontSize: 50, color: COLOR.blueLight };

const { Text } = Typography;
// #endregion

const {
  CODE: { ENVIRONMENT, ENTRY_POINT, VERSION, BASE_IMAGE }
} = schema.BUILD_TYPES;

const CodeBuild = ({ required, getFieldDecorator, fileList, setFileList }) => (
  <>
    <Form.Item label={ENVIRONMENT.label}>
      {getFieldDecorator(ENVIRONMENT.field, {
        rules: [{ required, message: ENVIRONMENT.message }]
      })(<SelectEnvOptions placeholder={ENVIRONMENT.placeholder} />)}
    </Form.Item>
    <Form.Item label={ENTRY_POINT.label}>
      {getFieldDecorator(ENTRY_POINT.field, {
        rules: [{ required, message: ENTRY_POINT.message }]
      })(<Input placeholder={ENTRY_POINT.placeholder} />)}
    </Form.Item>
    <Form.Item label={VERSION.label}>
      {getFieldDecorator(VERSION.field)(<Input placeholder={VERSION.placeholder} />)}
    </Form.Item>
    <Form.Item label={BASE_IMAGE.label}>
      {getFieldDecorator(BASE_IMAGE.field)(<Input placeholder={BASE_IMAGE.placeholder} />)}
    </Form.Item>
    <Form.Item wrapperCol={null} style={marginTop}>
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
    </Form.Item>
  </>
);

CodeBuild.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired,
  setFileList: PropTypes.func.isRequired,
  fileList: PropTypes.array.isRequired
};

export default CodeBuild;
