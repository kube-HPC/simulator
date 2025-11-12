import { RedoOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Tooltip, Space, Popconfirm } from 'antd';
import { USER_GUIDE } from 'const';
import { useActions, usePipeline } from 'hooks';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

const ActionsQueueOrder = ({ job }) => {
  const { jobId } = job;

  const { rerunPipeline } = usePipeline();
  const { stopPipeline } = useActions();
  const onReRun = useCallback(
    () => rerunPipeline(jobId),
    [rerunPipeline, jobId]
  );
  const onStop = useCallback(() => stopPipeline(jobId), [stopPipeline, jobId]);
  return (
    <Space.Compact className={USER_GUIDE.TABLE_JOB.ACTIONS_SELECT}>
      <Tooltip title="re-run pipeline">
        <Button icon={<RedoOutlined />} onClick={onReRun} />
      </Tooltip>
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

ActionsQueueOrder.propTypes = {
  // eslint-disable-next-line
  job: PropTypes.object.isRequired,
};

export default React.memo(ActionsQueueOrder);
