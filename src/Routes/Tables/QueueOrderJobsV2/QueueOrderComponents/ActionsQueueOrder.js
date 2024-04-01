import { RedoOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { USER_GUIDE } from 'const';
import { useActions, usePipeline } from 'hooks';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

const ActionsQueueOrder = ({ job }) => {
  const { jobId } = job;
  // console.log('job', job, jobId);
  const { rerunPipeline } = usePipeline();
  const { stopPipeline } = useActions();
  const onReRun = useCallback(() => rerunPipeline(jobId), [
    rerunPipeline,
    jobId,
  ]);
  const onStop = useCallback(() => stopPipeline(jobId), [stopPipeline, jobId]);
  return (
    <Button.Group className={USER_GUIDE.TABLE_JOB.ACTIONS_SELECT}>
      <Tooltip title="re-run pipeline">
        <Button icon={<RedoOutlined />} onClick={onReRun} />
      </Tooltip>
      <Tooltip title="stop">
        <Button icon={<StopOutlined />} onClick={onStop} />
      </Tooltip>
    </Button.Group>
  );
};

ActionsQueueOrder.propTypes = {
  // eslint-disable-next-line
  job: PropTypes.object.isRequired,
};

ActionsQueueOrder.defaultProps = {};

export default React.memo(ActionsQueueOrder);
