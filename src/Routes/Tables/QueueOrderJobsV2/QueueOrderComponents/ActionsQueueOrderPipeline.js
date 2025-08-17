import { StopOutlined } from '@ant-design/icons';
import { Button, Tooltip, Space } from 'antd';
import { USER_GUIDE } from 'const';
import { useActions } from 'hooks';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

const ActionsQueueOrderPipeline = ({ job }) => {
  const { name } = job;

  const { stopAllPipeline } = useActions();

  const onStop = useCallback(
    () => stopAllPipeline(name, () => {}),
    [stopAllPipeline, name]
  );
  return (
    <Space.Compact className={USER_GUIDE.TABLE_JOB.ACTIONS_SELECT}>
      <Tooltip title="stop">
        <Button icon={<StopOutlined />} onClick={onStop} />
      </Tooltip>
    </Space.Compact>
  );
};

ActionsQueueOrderPipeline.propTypes = {
  // eslint-disable-next-line
  job: PropTypes.object.isRequired,
};

export default React.memo(ActionsQueueOrderPipeline);
