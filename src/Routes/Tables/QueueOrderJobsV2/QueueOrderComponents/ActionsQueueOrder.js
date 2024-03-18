import { RedoOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { USER_GUIDE } from 'const';
import { useActions, usePipeline } from 'hooks';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

const ActionsQueueOrder = ({ job }) => {
  console.log('job', job);
  const { key } = job;
  const { rerunPipeline } = usePipeline();
  const { stopPipeline } = useActions();
  const onReRun = useCallback(() => rerunPipeline(key), [rerunPipeline, key]);
  const onStop = useCallback(() => stopPipeline(key), [stopPipeline, key]);
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
