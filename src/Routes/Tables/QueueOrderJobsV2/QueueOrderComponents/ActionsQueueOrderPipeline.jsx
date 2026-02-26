import { StopOutlined } from '@ant-design/icons';
import { Button, Tooltip, Space, Popconfirm } from 'antd';
import { USER_GUIDE } from 'const';
import { useActions } from 'hooks';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { queueClearedVar } from 'cache';

const ActionsQueueOrderPipeline = ({ job }) => {
  const { name } = job;

  const { stopAllPipeline } = useActions();
  const onStop = useCallback(() => {
    queueClearedVar(true);
    stopAllPipeline(name, () => {});
  }, [stopAllPipeline, name]);

  return (
    <Space.Compact className={USER_GUIDE.TABLE_JOB.ACTIONS_SELECT}>
      <Popconfirm
        title="Are you sure you want to stop?"
        onConfirm={onStop}
        okText="Yes"
        cancelText="No"
        placement="top">
        <Tooltip title="stop">
          <Button icon={<StopOutlined />} />
        </Tooltip>
      </Popconfirm>
    </Space.Compact>
  );
};

ActionsQueueOrderPipeline.propTypes = {
  // eslint-disable-next-line
  job: PropTypes.object.isRequired,
};

export default React.memo(ActionsQueueOrderPipeline);
