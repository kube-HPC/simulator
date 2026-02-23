import { events } from 'utils';

import successMsg from 'config/schema/success-messages.schema';
import Text from 'antd/lib/typography/Text';
import React from 'react';

export const deleteConfirmAction = (modal, action, { name }) => {
  modal.confirm({
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

export const stopConfirmAction = (modal, action, { name }) => {
  modal.confirm({
    title: 'WARNING stop all jobs',
    content: (
      <>
        Are you sure you want to stop all jobs of pipeline{' '}
        <Text strong>{name}</Text>?
      </>
    ),
    okText: 'Confirm',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk() {
      action(name, {
        onSuccess: () => {
          events.emit(
            'global_alert_msg',
            successMsg({ name }).ALL_PIPELINE_JOBS_STOP,
            'success'
          );
        },
      });
    },
  });
};
