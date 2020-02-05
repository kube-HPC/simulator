import { pipelineStatuses as PIPELINE_STATUS } from '@hkube/consts';
import { Progress } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { COLOR_PIPELINE_STATUS } from 'styles';

const { STOPPED, FAILED } = PIPELINE_STATUS;

const JobProgress = ({ status, type, width }) => {
  const stopped = status && status.status === STOPPED;
  const failed = status && status.status === FAILED;
  const percent = parseInt((status && status.data && status.data.progress) || 0);
  return (
    <Progress
      type={type}
      width={width}
      percent={percent}
      status={percent === 100 ? 'success' : 'normal'}
      strokeColor={
        failed
          ? COLOR_PIPELINE_STATUS[FAILED]
          : stopped
            ? COLOR_PIPELINE_STATUS[STOPPED]
            : undefined
      }
    />
  );
};

JobProgress.propTypes = {
  status: PropTypes.object,
  type: PropTypes.string,
  width: PropTypes.number,
};

export default JobProgress;
