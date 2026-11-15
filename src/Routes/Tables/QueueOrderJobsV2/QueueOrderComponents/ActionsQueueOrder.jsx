import { RedoOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Tooltip, Space, Popconfirm } from 'antd';
import { USER_GUIDE } from 'const';
import { useActions, usePipeline } from 'hooks';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { events } from 'utils';
import { queueClearedVar } from 'cache';

const ActionsQueueOrder = ({ job }) => {
  const { jobId } = job;

  const { rerunPipeline } = usePipeline();
  const { stopPipeline } = useActions();

  const onReRun = useCallback(
    () => rerunPipeline(jobId),
    [rerunPipeline, jobId]
  );

  const onStop = useCallback(() => {
    queueClearedVar(true);
    stopPipeline(jobId);
    events.emit('global_alert_msg', `Job ${jobId} stopped`, 'info');
  }, [stopPipeline, jobId]);

  return (
    <Space.Compact className={USER_GUIDE.TABLE_JOB.ACTIONS_SELECT}>
      <Tooltip title="Re-run pipeline">
        <Button
          data-testid={`queue-job-rerun-${jobId}`}
          icon={<RedoOutlined />}
          onClick={onReRun}
        />
      </Tooltip>
      <Popconfirm
        title="Are you sure you want to stop?"
        okButtonProps={{ 'data-testid': `queue-job-stop-confirm-${jobId}` }}
        cancelButtonProps={{ 'data-testid': `queue-job-stop-cancel-${jobId}` }}
        onConfirm={onStop}
        okText="Yes"
        cancelText="No"
        placement="top">
        <Tooltip title="stop">
          <Button
            data-testid={`queue-job-stop-${jobId}`}
            icon={<StopOutlined />}
          />
        </Tooltip>
      </Popconfirm>
    </Space.Compact>
  );
};

ActionsQueueOrder.propTypes = {
  job: PropTypes.object.isRequired,
};

export default React.memo(ActionsQueueOrder);
