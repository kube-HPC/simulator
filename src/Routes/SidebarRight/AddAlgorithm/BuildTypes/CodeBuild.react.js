import React from 'react';
import PropTypes from 'prop-types';
import { InboxOutlined } from '@ant-design/icons';
import { Alert, Input, Typography, Upload } from 'antd';
import { FlexBox, Form } from 'components/common';
import { COLOR } from 'styles';
import { notification, splitByDot } from 'utils';
import schema from '../schema';
import SelectEnvOptions from '../SelectEnvOptions.react';

// #region helpers
const toStatusMessage = fileName => ({
  done: `${fileName} uploaded successfully`,
  error: `${fileName} upload failed`,
  removed: `File ${fileName} removed`,
});

const STATUS_TYPE = {
  done: notification.TYPES.SUCCESS,
  error: notification.TYPES.ERROR,
  removed: notification.TYPES.INFO,
};

const isNotify = status =>
  status === 'done' || status === 'error' || status === 'removed';

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
      notification({
        message: toStatusMessage(fileName)[status],
        type: STATUS_TYPE[status],
      });
    }

    if (status === 'removed') {
      setFileList([]);
    }
  },
});

const marginTop = { marginTop: 15 };
const inboxStyle = { fontSize: 50, color: COLOR.blueLight };
const inboxDisplayedStyle = { fontSize: 50, color: COLOR.grey };

const { Text } = Typography;
// #endregion

const {
  CODE: { ENVIRONMENT, ENTRY_POINT, BASE_IMAGE, DIVIDERS },
} = schema.BUILD_TYPES;

const CodeBuild = ({ required, fileList, setFileList, isEdit }) => (
  <>
    <Form.Divider>{DIVIDERS.BUILD}</Form.Divider>
    <Form.Item
      name={splitByDot(ENVIRONMENT.field)}
      label={ENVIRONMENT.label}
      rules={[{ required, message: ENVIRONMENT.message }]}>
      <SelectEnvOptions placeholder={ENVIRONMENT.placeholder} />
    </Form.Item>
    <Form.Item
      name={splitByDot(ENTRY_POINT.field)}
      label={ENTRY_POINT.label}
      rules={[{ required, message: ENTRY_POINT.message }]}>
      <Input placeholder={ENTRY_POINT.placeholder} />
    </Form.Item>
    <Form.Item label={BASE_IMAGE.label} name={splitByDot(BASE_IMAGE.field)}>
      <Input
        disabled={isEdit && fileList.length === 0}
        placeholder={BASE_IMAGE.placeholder}
      />
    </Form.Item>

    <Form.Item wrapperCol={null} style={marginTop}>
      <Upload.Dragger
        // eslint-disable-next-line
        {...setDraggerProps({ fileList, setFileList })}>
        <InboxOutlined style={isEdit ? inboxDisplayedStyle : inboxStyle} />
        <br />
        <Text>Click or drag Algorithm Source code to this area to upload</Text>
        <br />
        <Text type="secondary">Support for zip or tar.gz only</Text>

        {!isEdit && (
          <FlexBox justify="center" style={marginTop}>
            <FlexBox.Item>
              <Alert
                message={`File ${fileList.length ? 'Uploaded' : 'Required'}`}
                type={fileList.length ? 'info' : 'warning'}
                showIcon
              />
            </FlexBox.Item>
          </FlexBox>
        )}
      </Upload.Dragger>
    </Form.Item>
  </>
);

CodeBuild.propTypes = {
  required: PropTypes.bool.isRequired,
  setFileList: PropTypes.func.isRequired,
  // TODO: detail the props
  // eslint-disable-next-line
  fileList: PropTypes.array.isRequired,
  isEdit: PropTypes.bool.isRequired,
};

export default CodeBuild;
