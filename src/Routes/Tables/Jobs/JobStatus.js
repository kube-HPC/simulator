import React from 'react';
import {
  pipelineStatuses as PIPELINE_STATUS,
  executeActions as EXECUT_ACTIONS,
} from '@hkube/consts';

import { Badge } from 'antd';
import PropTypes from 'prop-types';
import BaseTag from 'components/BaseTag';

/** @param {{ status: string; style: React.CSSProperties }} */
const JobStatus = ({ status, auditTrail, style }) => {
  let statusAction =
    status.status === PIPELINE_STATUS.STOPPED ? EXECUT_ACTIONS.STOP : '';
  statusAction =
    status.status === PIPELINE_STATUS.PAUSED ? EXECUT_ACTIONS.PAUSE : '';
  statusAction =
    status.status === PIPELINE_STATUS.RESUMED ? EXECUT_ACTIONS.RESUME : '';

  const userName =
    statusAction !== ''
      ? auditTrail.filter(x => x.action === statusAction)[0]
      : undefined;

  return (
    (userName && (
      <Badge
        style={{ fontSize: '8px' }}
        count={userName}
        size="small"
        status="success"
        color="blue"
        title={`${userName} is ${status.status}`}
        offset={[-7, 0]}>
        <BaseTag status={status.status} tooltip={status.error} style={style}>
          {status.status}
        </BaseTag>
      </Badge>
    )) || (
      <BaseTag status={status.status} tooltip={status.error} style={style}>
        {status.status}
      </BaseTag>
    )
  );
};

JobStatus.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  status: PropTypes.object.isRequired,
  auditTrail: PropTypes.object,
  // eslint-disable-next-line
  style: PropTypes.object,
};

export default React.memo(JobStatus);
