import React from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'antd';
import { COLOR_PIPELINE_STATUS } from 'styles';
import { PIPELINE_STATES } from 'const';

const JobProgress = ({ status, type, width }) => {
  const stopped = status && status.status === PIPELINE_STATES.STOPPED;
  const failed = status && status.status === PIPELINE_STATES.FAILED;
  const percent = parseInt((status && status.data && status.data.progress) || 0);
  return (
    <Progress
      type={type}
      width={width}
      percent={percent}
      status={percent === 100 && 'success'}
      strokeColor={
        failed ? COLOR_PIPELINE_STATUS.failed : stopped ? COLOR_PIPELINE_STATUS.stopped : undefined
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