import React from 'react';
import { WarningOutlined } from '@ant-design/icons';
import { notification } from 'antd';

const configNotificationOnOpen = description => ({
  message: 'Error in Submitted Json',
  description,
  icon: <WarningOutlined style={{ color: 'red' }} />,
});

const noop = () => {};

const tryParse = ({ src, onSuccess = noop, onFail }) => {
  try {
    const parsed = JSON.parse(src);
    onSuccess({ src, parsed });
  } catch ({ message }) {
    if (onFail) onFail();
    else notification.open(configNotificationOnOpen(message));
  }
};

export default tryParse;
