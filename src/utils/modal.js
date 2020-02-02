import { Modal } from 'antd';
import Text from 'antd/lib/typography/Text';
import React from 'react';

export const deleteConfirmAction = (action, { name }) => {
  Modal.confirm({
    title: 'WARNING Deleting Pipeline',
    content: (
      <>
        Are you sure you want to delete {name}? Deleting Pipeline will
        <Text strong> STOP-ALL</Text> related Jobs and Executions,
      </>
    ),
    okText: 'Confirm',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk() {
      action(name);
    },
  });
};
