import React from 'react';
import { Icon, notification } from 'antd';

const configNotificationOnOpen = description => ({
  message: 'Error in Submitted Json',
  description,
  icon: <Icon type="warning" style={{ color: 'red' }} />
});

const handleParsing = ({ src, onSuccess }) => {
  try {
    const parsed = JSON.parse(src);
    onSuccess({ src, parsed });
  } catch ({ message }) {
    notification.open(configNotificationOnOpen(message));
  }
};

export default handleParsing;
