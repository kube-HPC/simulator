import React, { useState } from 'react';
import { Upload, Typography, Alert } from 'antd';
import PropTypes from 'prop-types';
import { InboxOutlined } from '@ant-design/icons';
import { notification } from 'utils';
import { COLOR } from 'styles';

const { Text } = Typography;

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

const marginTop = {
  marginTop: 15,
  width: '15%',
  marginLeft: 'auto',
  marginRight: 'auto',
};
const inboxStyle = { fontSize: 50, color: COLOR.blueLight };
const inboxDisplayedStyle = { fontSize: 50, color: COLOR.grey };

const AlgorithmUploadFile = ({ fileList, setFileList, isEdit }) => {
  const [statsUpload, setStatsUpload] = useState(false);

  const setDraggerProps = () => ({
    name: 'file',
    multiple: false,
    disabled: statsUpload,
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

      setStatsUpload(status === 'uploading');
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 10,
      format: percent => `${parseFloat(percent.toFixed(2))}%`,
    },
  });

  return (
    <Upload.Dragger {...setDraggerProps({ fileList, setFileList })}>
      <InboxOutlined style={isEdit ? inboxDisplayedStyle : inboxStyle} />
      <br />
      <Text>Click or drag Algorithm Source code to this area to upload</Text>
      <br />
      <Text type="secondary">Support for zip or tar.gz only</Text>

      {!isEdit && (
        <Alert
          style={marginTop}
          message={`File ${fileList.length ? 'Uploaded' : 'Required'}`}
          type={fileList.length ? 'info' : 'warning'}
          showIcon
        />
      )}
    </Upload.Dragger>
  );
};

export default AlgorithmUploadFile;

AlgorithmUploadFile.propTypes = {
  isEdit: PropTypes.bool.isRequired,

  fileList: PropTypes.instanceOf(PropTypes.object).isRequired,
  setFileList: PropTypes.func.isRequired,
};
